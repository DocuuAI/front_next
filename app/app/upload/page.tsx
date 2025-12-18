"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { Entity } from "@/types/entity";
import { useAppStore } from "@/contexts/AppContext";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const { user } = useUser();
  const router = useRouter();
  const addDocument = useAppStore((s) => s.addDocument);

  /* ---------------- Fetch entities ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchEntities = async () => {
      try {
        const res = await fetch("/api/entities");
        const data = await res.json();

        // supports both: array OR { entities: [] }
        setEntities(Array.isArray(data) ? data : data.entities || []);
      } catch (err) {
        console.error("Failed to fetch entities", err);
      }
    };

    fetchEntities();
  }, [user]);

  /* ---------------- Upload function ---------------- */
  const uploadDocument = async (file: File, forcedName?: string) => {
    if (!selectedEntityId) {
      toast.error("Select an entity first");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entity_id", selectedEntityId);
      if (forcedName) formData.append("fileName", forcedName);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      addDocument(data.document);
      toast.success("Uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- Dropzone ---------------- */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setSelectedFile(file);
      await uploadDocument(file);
    },
  });

  /* ---------------- Camera upload ---------------- */
  const scanWithCamera = () => {
    if (!selectedEntityId) {
      toast.error("Select an entity first");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const name = prompt("Enter a document name (without extension):");
      if (!name || !name.trim()) return;

      const ext = file.name.split(".").pop() || "jpg";
      const customFileName = `${name.trim()}.${ext}`;
      await uploadDocument(file, customFileName);
    };

    input.click();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload Document</h1>

      {/* Entity selector */}
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

      {/* Dropzone / Upload Zone */}
      {!uploading && (
        <div {...getRootProps()}>
          <Card
            className={`p-10 border-2 border-dashed cursor-pointer text-center transition-transform duration-150 ${
              isDragActive ? "scale-105 border-primary" : "border-zinc-700"
            }`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="w-10 h-10 mx-auto mb-4 text-primary" />

            <h3 className="text-lg font-semibold">
              {isDragActive ? "Drop your file…" : "Drag & drop or click to upload"}
            </h3>
            <p className="text-sm opacity-70 mt-2">
              Supports PDF, JPG, PNG (Max 10MB)
            </p>

            {selectedFile && (
              <p className="mt-3 text-sm text-foreground/80">
                Selected: {selectedFile.name}
              </p>
            )}
          </Card>
        </div>
      )}

      {/* Uploading Indicator */}
      {uploading && (
        <Card className="p-10 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg">Uploading…</p>
        </Card>
      )}

      {/* Quick Actions */}
      {!uploading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            onClick={scanWithCamera}
            className="p-4 cursor-pointer hover:shadow"
          >
            <h3 className="font-semibold">Scan Document</h3>
            <p className="text-xs opacity-70">Use your device camera</p>
          </Card>

          <Card className="p-4 cursor-pointer hover:shadow">
            <h3 className="font-semibold">Import from Cloud</h3>
            <p className="text-xs opacity-70">Google Drive, Dropbox etc.</p>
          </Card>

          <Card className="p-4 cursor-pointer hover:shadow">
            <h3 className="font-semibold">Email Import</h3>
            <p className="text-xs opacity-70">
              Forward files to your email import address
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}