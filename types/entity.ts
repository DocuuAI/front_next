export interface Entity {
  id: string; // 🔥 not number
  name: string;
  type: "person" | "business";
  phone?: string;
  pan?: string;
  gst?: string;
created_at: string;
}