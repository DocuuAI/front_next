export type UIDeadline = {
  id: string;
  title: string;          // required for DeadlineCard
  description: string;    // required, no optional
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' |'completed';
  document_id: string;
};