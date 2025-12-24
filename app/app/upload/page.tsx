"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload as UploadIcon,
  CheckCircle,
  AlertTriangle,
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  Hash,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Entity } from "@/types/entity";
import { useAppStore } from "@/contexts/AppContext";

/* ───────────── Entity display config ───────────── */

const ENTITY_CONFIG: Record<
  string,
  { label: string; icon: any }
> = {
  people: { label: "People", icon: User },
  organizations: { label: "Organizations", icon: Building2 },
  emails: { label: "Emails", icon: Mail },
  phone_numbers: { label: "Phone Numbers", icon: Phone },
  dates: { label: "Dates", icon: Calendar },
  ids: { label: "IDs", icon: Hash },
};

export default function UploadPage() {
  const { user } = useUser();
  const router = useRouter();
  const addDocument = useAppStore((s) => s.addDocument);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] =
    useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);

  const [progress, setProgress] = useState(0);
  const [ocrEntities, setOcrEntities] = useState<any | null>(null);
  const [currentDocId, setCurrentDocId] =
    useState<number | null>(null);

  const [pendingFile, setPendingFile] =
    useState<File | null>(null);
  const [pendingForcedName, setPendingForcedName] =
    useState<string | undefined>(undefined);

  const noEntities = entities.length === 0;

  /* ───────────── Fetch entities ───────────── */
  useEffect(() => {
    if (!user) return;

    fetch("/api/entities")
      .then((r) => r.json())
      .then((d) => setEntities(d.entities ?? d))
      .catch(() => {});
  }, [user]);

  /* ───────────── Upload document ───────────── */
  const uploadDocument = async (
    file: File,
    forcedName?: string,
    entityOverride?: string
  ) => {
    const entityId = entityOverride ?? selectedEntityId;
    if (!entityId) return toast.error("Select an entity");

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("entity_id", entityId);
      if (forcedName) form.append("file_name", forcedName);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      addDocument(data.document);

      setCurrentDocId(data.document.id);
      setProcessing(true);
      setProcessingDone(false);
      setProgress(10);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setPendingFile(null);
      setPendingForcedName(undefined);
    }
  };

  /* ───────────── Auto-upload pending file ───────────── */
  useEffect(() => {
    if (pendingFile && selectedEntityId) {
      uploadDocument(pendingFile, pendingForcedName);
    }
  }, [selectedEntityId]);

  /* ───────────── Poll OCR entities ───────────── */
  useEffect(() => {
    if (!currentDocId || !processing) return;

    const pollEntities = async () => {
      try {
        const res = await fetch(
          `/api/documents/${currentDocId}/entities`
        );
        if (!res.ok) return;

        const data = await res.json();
        setOcrEntities(data.entities ?? data);
        setProgress((p) => Math.min(p + 15, 70));
      } catch {}
    };

    pollEntities();
    const i = setInterval(pollEntities, 3000);
    return () => clearInterval(i);
  }, [currentDocId, processing]);

  /* ───────────── Poll processing status ───────────── */
  useEffect(() => {
    if (!currentDocId || !processing) return;

    const pollStatus = async () => {
      try {
        const res = await fetch(
          `/api/documents/${currentDocId}`
        );
        if (!res.ok) return;

        const data = await res.json();

        if (typeof data.processing_progress === "number") {
          setProgress(data.processing_progress);
        }

        if (data.processing_status === "completed") {
          setProgress(100);
          setProcessing(false);
          setProcessingDone(true);
        }

        if (data.processing_status === "error") {
          setProcessing(false);
          toast.error(
            data.processing_error || "Processing failed"
          );
        }
      } catch {}
    };

    pollStatus();
    const i = setInterval(pollStatus, 4000);
    return () => clearInterval(i);
  }, [currentDocId, processing]);

  /* ───────────── Dropzone ───────────── */
  const { getRootProps, getInputProps } = useDropzone({
    disabled: uploading || processing || noEntities,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    onDrop: async ([file]) => {
      if (!file) return;
      if (!selectedEntityId) return setPendingFile(file);
      uploadDocument(file);
    },
  });

  /* ───────────── Camera upload ───────────── */
  const scanWithCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const name = prompt("Document name");
      if (!name) return;

      const forced = `${name}.${file.name.split(".").pop()}`;
      if (!selectedEntityId) {
        setPendingFile(file);
        setPendingForcedName(forced);
      } else {
        uploadDocument(file, forced);
      }
    };

    input.click();
  };

  /* ───────────── UI ───────────── */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload Document</h1>

      {noEntities && (
        <Card className="p-5 border-yellow-500/40 bg-yellow-500/5 flex gap-3">
          <AlertTriangle className="text-yellow-500" />
          <div>
            <p className="font-semibold">
              Create an entity first
            </p>
            <Button
              onClick={() => router.push("/app/entities")}
              size="sm"
            >
              Go to Entities
            </Button>
          </div>
        </Card>
      )}

      {!noEntities && (
        <select
          className="border p-2 rounded w-full bg-zinc-900"
          value={selectedEntityId ?? ""}
          onChange={(e) =>
            setSelectedEntityId(e.target.value || null)
          }
        >
          <option value="">Select Entity</option>
          {entities.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.type})
            </option>
          ))}
        </select>
      )}

      {/* Upload – ALWAYS visible */}
      <div {...getRootProps()}>
        <Card className="p-10 border-2 border-dashed text-center cursor-pointer">
          <input {...getInputProps()} />
          <UploadIcon className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold">
            Drag & drop or click to upload
          </h3>
          <p className="text-xs text-muted-foreground">
            PDF or images supported
          </p>
        </Card>
      </div>

      {/* Processing */}
      {processing && (
        <Card className="p-6 space-y-4">
          <p className="font-semibold">
            📄 Processing document…
          </p>
          <div className="w-full bg-zinc-800 rounded h-2">
            <div
              className="bg-primary h-2 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Extracted entities */}
      {ocrEntities && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">
            🔍 Extracted Information
          </h3>

          {Object.entries(ENTITY_CONFIG).map(
            ([key, cfg]) => {
              const values = ocrEntities[key];
              if (!values || values.length === 0)
                return null;

              const Icon = cfg.icon;

              return (
                <div
                  key={key}
                  className="border rounded p-4 bg-zinc-900/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="font-semibold">
                      {cfg.label}
                    </p>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {values.map((v: string, i: number) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          )}
        </Card>
      )}

      {processingDone && (
        <Card className="p-6 border-green-500/40 bg-green-500/5 text-center">
          <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-2" />
          <p className="font-semibold">
            Document processing completed
          </p>
        </Card>
      )}

      {/* Quick actions */}
      {!uploading && !noEntities && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            onClick={scanWithCamera}
            className="p-4 cursor-pointer hover:shadow transition"
          >
            <h3 className="font-semibold">Scan Document</h3>
            <p className="text-xs opacity-70">
              Use your device camera
            </p>
          </Card>

          <Card className="p-4 opacity-50 cursor-not-allowed">
            <h3 className="font-semibold">
              Import from Cloud
            </h3>
            <p className="text-xs opacity-70">
              Coming soon
            </p>
          </Card>

          <Card className="p-4 opacity-50 cursor-not-allowed">
            <h3 className="font-semibold">Email Import</h3>
            <p className="text-xs opacity-70">
              Coming soon
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}