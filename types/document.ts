export interface Document {
  id: number;
  clerk_id: string;                   // the user who uploaded
  file_name: string;
  file_url: string;
  file_path: string;
  file_type: string | null;
  file_size: number;
  created_at: string;
  entity_id?: number;                 // optional: links document to an entity
  library?: string | null;            // optional: library name
  processed_at?: string | null;       // optional: when processing finished
  extracted_entities?: any;           // optional: OCR / NLP extracted entities
  processing_progress?: number;       // optional: 0-100
  processing_status?: string;         // optional: e.g., 'processing', 'completed', 'error'
  processing_error?: string | null;   // optional: error message if processing failed
}