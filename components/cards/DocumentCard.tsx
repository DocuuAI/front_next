'use client';

import { FileText, MoreVertical, Download, Trash2 } from 'lucide-react';
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
}

export default function DocumentCard({ document, onDelete }: Props) {
  const uploadedAt = new Date(document.created_at).toLocaleDateString('en-GB');

  const openFile = () => {
    window.open(document.file_url, '_blank');
  };

  return (
    <Card
      onClick={openFile}
      className="p-4 cursor-pointer hover:shadow-lg transition bg-card"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
              {document.file_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(document.file_size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

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
                openFile();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
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

      <Badge variant="outline">{document.file_type ?? 'Unknown'}</Badge>

      <p className="text-xs text-muted-foreground mt-2">
        Uploaded {uploadedAt}
      </p>
    </Card>
  );
}