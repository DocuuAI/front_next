export interface Document {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number;
  created_at: string;
}