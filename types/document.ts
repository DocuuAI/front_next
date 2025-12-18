export interface Document {
  id: number;
  clerk_id: string;           // the user who uploaded
  file_name: string;
  file_url: string;
  file_path: string;
  file_type: string | null;
  file_size: number;
  created_at: string;
  entity_id?: number;          // optional: links document to an entity
}