import { DBDeadline } from '@/types/deadline';
import { UIDeadline } from '@/types/ui-deadline';

export function toUIDeadline(db: DBDeadline): UIDeadline {
  const hasDueDate = typeof db.due_date === 'string';

  const overdue = !!db.due_date && new Date(db.due_date).getTime() < Date.now();

  let priority: UIDeadline['priority'] = 'medium';

 if (typeof db.confidence === 'number') {
    if (db.confidence >= 0.8) {
      priority = 'high';
    } else if (db.confidence <= 0.4) {
      priority = 'low';
    }
  }

  const dueDate =
    db.due_date ?? new Date().toISOString().split('T')[0];

  return {
    id: db.id,
    title: db.title ?? 'No title',
    description: db.deadline_reason ?? 'No additional context provided',
    dueDate,
    priority,

    // ⚠️ overdue should NOT be completed
    status: overdue ? 'completed' : 'pending',

    document_id: db.document_id,
  };
}