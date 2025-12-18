'use client';

import { useState, useRef } from 'react';
import {
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Pencil,
  Check,
  X,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document } from '@/types/document';

interface Props {
  document: Document;
  onDelete?: (id: number) => void;
  onRename?: (id: number, newName: string) => void;
}

export default function DocumentCard({
  document,
  onDelete,
  onRename,
}: Props) {
  const uploadedAt = new Date(document.created_at).toLocaleDateString('en-GB');

  const originalName = document.file_name;
  const lastDotIndex = originalName.lastIndexOf('.');
  const extension =
    lastDotIndex !== -1 ? originalName.slice(lastDotIndex) : '';
  const baseName =
    lastDotIndex !== -1 ? originalName.slice(0, lastDotIndex) : originalName;

  const [isRenaming, setIsRenaming] = useState(false);
  const [fileName, setFileName] = useState(baseName);
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // ─────────────────────────────────────────────
  // 📂 Open file securely (NO SUPABASE URL)
  // ─────────────────────────────────────────────
  const openFile = () => {
    if (isRenaming) return;
    window.open(
      `/api/calldocument/download/${document.id}`,
      '_blank'
    );
  };

  // ─────────────────────────────────────────────
  // ✏️ Rename logic
  // ─────────────────────────────────────────────
  const startRename = () => {
    setIsRenaming(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancelRename = () => {
    setFileName(baseName);
    setIsRenaming(false);
  };

  const saveRename = async () => {
    const trimmed = fileName.trim();
    if (!trimmed || trimmed === baseName) {
      cancelRename();
      return;
    }

    const finalName = trimmed + extension;

    try {
      setIsSaving(true);

      // Optimistic update (optional)
      onRename?.(document.id, finalName);

      await fetch('/api/calldocument', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: document.id,
          file_name: finalName,
        }),
      });

      setIsRenaming(false);
    } catch (err) {
      console.error('Rename failed:', err);
      setFileName(baseName);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      onClick={openFile}
      className={`p-4 transition bg-card ${
        isRenaming
          ? 'cursor-default'
          : 'cursor-pointer hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 min-w-0">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 w-full">
            {/* FILE NAME */}
            {isRenaming ? (
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={inputRef}
                  value={fileName}
                  disabled={isSaving}
                  onChange={(e) => setFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveRename();
                    if (e.key === 'Escape') cancelRename();
                  }}
                  className="h-7 px-2 text-sm border rounded w-full bg-zinc-900 text-zinc-100"
                />

                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isSaving}
                  onClick={saveRename}
                >
                  <Check className="w-4 h-4 text-green-600" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isSaving}
                  onClick={cancelRename}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <p className="font-semibold text-sm truncate">
                {fileName}
                {extension}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              {(document.file_size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        {/* MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `/api/calldocument/download/${document.id}`
                );
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                startRename();
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(document.id);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Badge variant="outline">
        {document.file_type ?? 'Unknown'}
      </Badge>

      <p className="text-xs text-muted-foreground mt-2">
        Uploaded {uploadedAt}
      </p>
    </Card>
  );
}