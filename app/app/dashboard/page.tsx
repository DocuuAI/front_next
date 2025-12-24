'use client';

import {
  Sparkles,
  TrendingUp,
  FileText,
  Users,
  Calendar,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DocumentCard from '@/components/cards/DocumentCard';
import DeadlineCard from '@/components/cards/DeadlineCard';
import AISuggestionCard from '@/components/cards/AISuggestionCard';

import { useUserStore } from "@/services/useUserStore";
import { useAppStore } from "@/contexts/AppContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from "react";

import { DBDeadline } from '@/types/deadline';
import { UIDeadline } from '@/types/ui-deadline';

export default function Dashboard() {
  const router = useRouter();

  const profile = useUserStore((s) => s.profile);
  const documents = useAppStore((s) => s.documents);
  const aiSuggestions = useAppStore((s) => s.aiSuggestions);
  const deleteDocument = useAppStore((s) => s.deleteDocument);

  /* ---------------- DEADLINES (DB BASED) ---------------- */
  const [deadlines, setDeadlines] = useState<UIDeadline[]>([]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const docsRes = await fetch('/api/documents');
        const docsData = await docsRes.json();
        const docs = docsData.documents ?? [];

        const allDeadlines: UIDeadline[] = [];

        await Promise.all(
          docs.map(async (doc: any) => {
            const res = await fetch(`/api/documents/${doc.id}/deadlines`);
            if (!res.ok) return;

            const data = await res.json();

            (data.deadlines ?? []).forEach((d: DBDeadline) => {
              const overdue =
                !!d.due_date && new Date(d.due_date) < new Date();

              const confidence = d.confidence ?? undefined;

              allDeadlines.push({
                id: d.id,
                title: d.title ?? 'No title',
                description: d.title ?? 'No title',
                dueDate: d.due_date ?? '',
                priority:
                  confidence !== undefined
                    ? confidence >= 0.8
                      ? 'high'
                      : confidence <= 0.4
                      ? 'low'
                      : 'medium'
                    : 'medium',
                status: overdue ? 'completed' : 'pending',
                document_id: d.document_id,
              });
            });
          })
        );

        setDeadlines(allDeadlines);
      } catch (err) {
        console.error('Failed to load deadlines', err);
      }
    };

    fetchDeadlines();
  }, []);

  /* ---------------- DEADLINE FILTERING ---------------- */
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAhead = new Date();
  sevenDaysAhead.setHours(0, 0, 0, 0);
  sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);

  const upcomingDeadlines = deadlines
    .filter(d => {
      if (!d.dueDate) return false;
      const due = new Date(d.dueDate);
      due.setHours(0, 0, 0, 0); // ignore time
      return due >= today && due <= sevenDaysAhead;
    })
    .slice(0, 3);

  /* ---------------- DOC STATS ---------------- */
  const totalDocs = documents.length;
  const recentDocuments = documents.slice(0, 6);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const docsThisMonth = documents.filter(
    d => new Date(d.created_at) >= startOfMonth
  ).length;

  const docsLastMonth = documents.filter(d => {
    const date = new Date(d.created_at);
    return date >= startOfPrevMonth && date <= endOfPrevMonth;
  }).length;

  const growth =
    docsLastMonth === 0
      ? 100
      : Math.round(((docsThisMonth - docsLastMonth) / docsLastMonth) * 100);

  /* ---------------- ENTITIES ---------------- */
  const [entityCount, setEntityCount] = useState(0);
  const [newEntitiesCount, setNewEntitiesCount] = useState(0);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const res = await fetch("/api/entities");
        if (!res.ok) return;

        const data = await res.json();
        const entities = data.entities ?? data;

        setEntityCount(entities.length);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        setNewEntitiesCount(
          entities.filter((e: any) =>
            new Date(e.created_at) >= sevenDaysAgo
          ).length
        );
      } catch (err) {
        console.error("Failed to fetch entities", err);
      }
    };

    fetchEntities();
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-6">
      {/* AI Assistant Banner */}
      <Card className="p-6 bg-linear-to-r from-primary/20 via-primary/10 to-transparent border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {profile ? `Hi ${profile.first_name}!` : "Hi!"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Ask me anything about your documents, compliance, or deadlines
              </p>
            </div>
          </div>
          <Button size="lg" onClick={() => router.push('/app/chat')}>
            Start Chat
          </Button>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold">{totalDocs}</p>
            </div>
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div
            className="flex items-center gap-1 mt-2 text-xs"
            style={{ color: growth >= 0 ? 'green' : 'red' }}
          >
            <TrendingUp className="w-3 h-3" />
            {growth >= 0 ? '+' : ''}{growth}% this month
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Entities</p>
              <p className="text-2xl font-bold">{entityCount}</p>
            </div>
            <Users className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-xs text-green-500 mt-2">
            {newEntitiesCount > 0 ? `+${newEntitiesCount} new` : 'No new entities'}
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:bg-muted/50 transition"
          onClick={() => router.push('/app/deadline')}
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Deadlines</p>
              <p className="text-2xl font-bold">{deadlines.length}</p>
            </div>
            <Calendar className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-xs text-yellow-500 mt-2">
            {upcomingDeadlines.length} due this week
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">AI Suggestions</p>
              <p className="text-2xl font-bold">{aiSuggestions.length}</p>
            </div>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-xs text-purple-500 mt-2">Review now</div>
        </Card>
      </div>

      {/* Documents & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold">Recent Documents</h2>
            <Button variant="ghost">
              <Link href="/app/library">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={() => deleteDocument(doc.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold">Upcoming Deadlines</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/app/deadline')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.map(deadline => (
              <div
                key={deadline.id}
                className="cursor-pointer"
                onClick={() => router.push('/app/deadline')}
              >
                <DeadlineCard 
                deadline={{
                  ...deadline,
                  title: deadline.description // use description/deadline_reason
                }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">AI Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiSuggestions.map(s => (
            <AISuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </div>
    </div>
  );
}