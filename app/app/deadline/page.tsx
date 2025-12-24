'use client';

import { useEffect, useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Sparkles,
  Pencil,
  Check,
  X,
  Trash2,
} from 'lucide-react';

import DocumentCard from '@/components/cards/DocumentCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type { Document } from '@/types/document';

type Deadline = {
  id: string;
  title: string;
  due_date: string | null;
  deadline_reason: string | null;
  confidence: number | null;
  ai_generated: boolean;
  document_id: string;
};

type Filter = 'all' | 'overdue' | 'upcoming' | 'ai';

export default function DeadlinesPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deadlinesByDoc, setDeadlinesByDoc] =
    useState<Record<string, Deadline[]>>({});

  const [filter, setFilter] = useState<Filter>('all');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // Load documents + deadlines
  // ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const docsRes = await fetch('/api/documents');
      const docsData = await docsRes.json();

      const docs: Document[] = docsData.documents ?? [];
      setDocuments(docs);

      const map: Record<string, Deadline[]> = {};

      await Promise.all(
        docs.map(async (doc) => {
          const res = await fetch(
            `/api/documents/${doc.id}/deadlines`
          );
          const data = await res.json();
          map[String(doc.id)] = data.deadlines ?? [];
        })
      );

      setDeadlinesByDoc(map);
    };

    load();
  }, []);

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const isOverdue = (d: Deadline) =>
    !!d.due_date && new Date(d.due_date) < new Date();

  const applyFilter = (d: Deadline) => {
    if (filter === 'ai') return d.ai_generated;
    if (filter === 'overdue') return isOverdue(d);
    if (filter === 'upcoming')
      return !!d.due_date && !isOverdue(d);
    return true;
  };

  // ─────────────────────────────────────────────
  // Inline edit
  // ─────────────────────────────────────────────
  const startEdit = (d: Deadline) => {
    setEditingId(d.id);
    setEditTitle(d.title);
    setEditDate(d.due_date);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (docId: string, deadlineId: string) => {
    const prev = deadlinesByDoc[docId];

    setDeadlinesByDoc((p) => ({
      ...p,
      [docId]: p[docId].map((d) =>
        d.id === deadlineId
          ? { ...d, title: editTitle, due_date: editDate }
          : d
      ),
    }));

    setEditingId(null);

    const res = await fetch(
      `/api/documents/${docId}/deadlines/${deadlineId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          due_date: editDate,
        }),
      }
    );

    if (!res.ok) {
      setDeadlinesByDoc((p) => ({ ...p, [docId]: prev }));
    }
  };

  const completeDeadline = async (docId: string, deadlineId: string) => {
    const prev = deadlinesByDoc[docId];

    setDeadlinesByDoc((p) => ({
      ...p,
      [docId]: p[docId].filter((d) => d.id !== deadlineId),
    }));

    const res = await fetch(
      `/api/documents/${docId}/deadlines/${deadlineId}`,
      { method: 'DELETE' }
    );

    if (!res.ok) {
      setDeadlinesByDoc((p) => ({ ...p, [docId]: prev }));
    }
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            What needs to be done
          </h1>
          <p className="text-sm text-muted-foreground">
            Deadlines & reminders from your documents
          </p>
        </div>

        <div className="flex gap-2">
          {(['all', 'overdue', 'upcoming', 'ai'] as Filter[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f === 'ai' ? 'AI' : f}
            </Button>
          ))}
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="space-y-10">
        {documents.map((doc) => {
          const docId = String(doc.id);
          const deadlines =
            (deadlinesByDoc[docId] ?? []).filter(applyFilter);

          if (deadlines.length === 0) return null;

          return (
            <div key={docId} className="space-y-4">
              <DocumentCard document={doc} />

              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" />
                  Deadlines
                </h3>

                <Separator className="mb-3" />

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left py-2 px-2">Title</th>
                        <th className="text-left py-2 px-2">Reason</th>
                        <th className="text-left py-2 px-2">Due</th>
                        <th className="text-left py-2 px-2">Status</th>
                        <th className="text-left py-2 px-2">AI</th>
                        <th className="text-right py-2 px-2">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {deadlines.map((d) => {
                        const overdue = isOverdue(d);

                        return (
                          <tr
                            key={d.id}
                            className="border-b last:border-b-0 hover:bg-muted/40"
                          >
                            {/* TITLE */}
                            <td className="py-2 px-2 font-medium">
                              {editingId === d.id ? (
                                <input
                                  value={editTitle}
                                  onChange={(e) =>
                                    setEditTitle(e.target.value)
                                  }
                                  className="w-full h-8 px-2 text-sm border rounded bg-zinc-900"
                                />
                              ) : (
                                d.title
                              )}
                            </td>

                            {/* REASON */}
                            <td className="py-2 px-2 text-xs text-muted-foreground max-w-xs">
                              {d.deadline_reason ?? '—'}
                            </td>

                            {/* DUE DATE */}
                            <td className="py-2 px-2">
                              {editingId === d.id ? (
                                <input
                                  type="date"
                                  value={editDate ?? ''}
                                  onChange={(e) =>
                                    setEditDate(
                                      e.target.value || null
                                    )
                                  }
                                  className="h-8 px-2 text-xs border rounded bg-zinc-900"
                                />
                              ) : d.due_date ? (
                                <span
                                  className={
                                    overdue ? 'text-red-500' : ''
                                  }
                                >
                                  {new Date(
                                    d.due_date
                                  ).toLocaleDateString('en-GB')}
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>

                            {/* STATUS */}
                            <td className="py-2 px-2 text-xs">
                              {overdue ? (
                                <span className="flex items-center gap-1 text-red-500">
                                  <AlertTriangle className="w-3 h-3" />
                                  Overdue
                                </span>
                              ) : (
                                'Upcoming'
                              )}
                            </td>

                            {/* AI */}
                            <td className="py-2 px-2">
                              {d.ai_generated && (
                                <Badge variant="secondary">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td className="py-2 px-2 text-right">
                              {editingId === d.id ? (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      saveEdit(docId, d.id)
                                    }
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={cancelEdit}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => startEdit(d)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      completeDeadline(docId, d.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4 text-green-600" />
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}