"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useUser();
  const router = useRouter();

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        await uploadDocument(file);
      }
    },
  });

  // Camera scan handler
  const scanWithCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // back camera
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const name = prompt("Enter a document name (without extension):");
      if (!name || !name.trim()) return;

      const ext = file.name.split(".").pop() || "jpg";
      const customFileName = `${name.trim()}.${ext}`;
      await uploadDocument(file, customFileName);
    };
    input.click();
  };

  // Upload function (client → server API)
  const uploadDocument = async (file: File, forcedName?: string) => {
    if (!user) return alert("User not logged in");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clerkId", user.id);
      if (forcedName) formData.append("fileName", forcedName);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast.success("Document uploaded successfully!");
      setSelectedFile(null);

      // Redirect to document details page (optional)
      // router.push(`/documents/${data.document.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload Document</h1>

      {/* Dropzone / Upload Zone */}
      {!uploading && (
        <Card
          {...getRootProps()}
          className={`p-10 border-2 border-dashed cursor-pointer text-center transition ${
            isDragActive ? "scale-105" : ""
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
        </Card>
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