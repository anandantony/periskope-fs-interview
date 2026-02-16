export interface WhatsAppGroup {
  id: number;
  name: string;
  description: string | null;
  member_count: number;
  phone_id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  project?: string;
  labels?: string[];
}
