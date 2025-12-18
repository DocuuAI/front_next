"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload as UploadIcon,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import { Entity } from "@/types/entity";
import { useAppStore } from "@/contexts/AppContext";

export default function UploadPage() {
  const { user } = useUser();
  const router = useRouter();
  const addDocument = useAppStore((s) => s.addDocument);

  const [uploading, setUploading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingForcedName, setPendingForcedName] = useState<string | undefined>(
    undefined
  );

  const [uploadResult, setUploadResult] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const noEntities = entities.length === 0;

  /* ---------------- Fetch entities ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchEntities = async () => {
      try {
        const res = await fetch("/api/entities");
        const data = await res.json();
        setEntities(Array.isArray(data) ? data : data.entities || []);
      } catch (err) {
        console.error("Failed to fetch entities", err);
      }
    };

    fetchEntities();
  }, [user]);

  /* ---------------- Upload function ---------------- */
  /* ---------------- Upload function ---------------- */
const uploadDocument = async (
    file: File,
    forcedName?: string,
    entityOverride?: string
  ) => {
    if (noEntities) return;

    const entityId = entityOverride ?? selectedEntityId;
    if (!entityId) {
      toast.error("Please select an entity");
      return;
    }

    setUploading(true);

    try {
      // Prepare multipart form
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entity_id", entityId);
      if (forcedName) formData.append("file_name", forcedName);

      // Call backend upload endpoint
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData, // multipart form
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Update global state / store
      addDocument(data.document);

      setUploadResult({
        status: "success",
        message: "Document uploaded successfully",
      });
    } catch (err: any) {
      setUploadResult({
        status: "error",
        message: err.message || "Upload failed",
      });
    } finally {
      setUploading(false);
      setPendingFile(null);
      setPendingForcedName(undefined);
      setTimeout(() => setUploadResult(null), 3000);
    }
  };

  /* ---------------- Dropzone ---------------- */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: noEntities || uploading,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length || noEntities) return;
      const file = acceptedFiles[0];

      if (!selectedEntityId) {
        setPendingFile(file);
        return;
      }

      await uploadDocument(file);
    },
  });

  /* ---------------- Camera upload ---------------- */
  const scanWithCamera = () => {
    if (noEntities) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const name = prompt("Enter document name (without extension):");
      if (!name?.trim()) return;

      const ext = file.name.split(".").pop() || "jpg";
      const forcedName = `${name.trim()}.${ext}`;

      if (!selectedEntityId) {
        setPendingFile(file);
        setPendingForcedName(forcedName);
        return;
      }

      await uploadDocument(file, forcedName);
    };

    input.click();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload Document</h1>

      {/* No entity warning */}
      {noEntities && (
        <Card className="p-5 border border-yellow-500/40 bg-yellow-500/5 flex gap-3 items-start">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Create entity first</p>
            <p className="text-sm opacity-80">
              You need at least one entity before uploading documents.
            </p>
            <Button
              size="sm"
              className="mt-2"
              onClick={() => router.push("/app/entities")}
            >
              Go to Entities
            </Button>
          </div>
        </Card>
      )}

      {/* Entity selector */}
      {!noEntities && (
        <select
          className="border p-2 rounded w-full bg-zinc-900"
          value={selectedEntityId ?? ""}
          onChange={(e) => setSelectedEntityId(e.target.value || null)}
        >
          <option value="">Select Entity</option>
          {entities.map((ent) => (
            <option key={ent.id} value={ent.id}>
              {ent.name} ({ent.type})
            </option>
          ))}
        </select>
      )}

      {/* Pending upload confirmation */}
      {pendingFile && !uploading && !noEntities && (
        <Card className="p-4 border border-primary/40 bg-primary/5 space-y-4">
          <p className="text-sm">
            Upload <strong>{pendingFile.name}</strong> to:
          </p>

          <select
            className="border p-2 rounded w-full bg-zinc-900"
            value={selectedEntityId ?? ""}
            onChange={(e) => setSelectedEntityId(e.target.value || null)}
          >
            <option value="">Select Entity</option>
            {entities.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.name} ({ent.type})
              </option>
            ))}
          </select>

          <Button
            className="w-full"
            disabled={!selectedEntityId}
            onClick={() =>
              uploadDocument(
                pendingFile,
                pendingForcedName,
                selectedEntityId!
              )
            }
          >
            Upload Document
          </Button>
        </Card>
      )}

      {/* Dropzone */}
      {!uploading && (
        <div {...getRootProps()}>
          <Card
            className={`p-10 border-2 border-dashed text-center transition ${
              noEntities
                ? "opacity-50 cursor-not-allowed"
                : isDragActive
                ? "scale-105 border-primary cursor-pointer"
                : "border-zinc-700 cursor-pointer"
            }`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="w-10 h-10 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold">
              Drag & drop or click to upload
            </h3>
            <p className="text-sm opacity-70 mt-2">
              Supports PDF, JPG, PNG (Max 10MB)
            </p>
          </Card>
        </div>
      )}

      {/* Uploading */}
      {uploading && (
        <Card className="p-10 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg">Uploading…</p>
        </Card>
      )}

      {/* Result */}
      {uploadResult && (
        <Card
          className={`p-6 text-center ${
            uploadResult.status === "success"
              ? "border-green-500/40 bg-green-500/5"
              : "border-red-500/40 bg-red-500/5"
          }`}
        >
          {uploadResult.status === "success" ? (
            <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-2" />
          ) : (
            <XCircle className="w-10 h-10 mx-auto text-red-500 mb-2" />
          )}
          <p className="font-semibold">{uploadResult.message}</p>
        </Card>
      )}

      {/* Quick actions */}
      {!uploading && !noEntities && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            onClick={scanWithCamera}
            className="p-4 cursor-pointer hover:shadow"
          >
            <h3 className="font-semibold">Scan Document</h3>
            <p className="text-xs opacity-70">Use your device camera</p>
          </Card>

          <Card className="p-4 opacity-50 cursor-not-allowed">
            <h3 className="font-semibold">Import from Cloud</h3>
            <p className="text-xs opacity-70">Coming soon</p>
          </Card>

          <Card className="p-4 opacity-50 cursor-not-allowed">
            <h3 className="font-semibold">Email Import</h3>
            <p className="text-xs opacity-70">Coming soon</p>
          </Card>
        </div>
      )}
    </div>
  );
}