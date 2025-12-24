export type DBDeadline = {
  id: string;
  title: string;
  deadline_reason: string | null;
  due_date: string | null;
  confidence: number | null;
  ai_generated: boolean;
  created_at: string;
  document_id: string;
  user_id: string;
  entity_id: string | null;
};