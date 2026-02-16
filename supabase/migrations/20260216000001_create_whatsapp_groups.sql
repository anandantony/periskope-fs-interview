-- Migration: Create whatsapp_groups table
-- Created: 2026-02-16

CREATE TABLE whatsapp_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  phone_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_whatsapp_groups_phone ON whatsapp_groups(phone_number);
CREATE INDEX idx_whatsapp_groups_active ON whatsapp_groups(is_active);
CREATE INDEX idx_whatsapp_groups_created_at ON whatsapp_groups(created_at);

-- Add comments for documentation
COMMENT ON TABLE whatsapp_groups IS 'Table storing WhatsApp group information';
COMMENT ON COLUMN whatsapp_groups.id IS 'Unique identifier for each group';
COMMENT ON COLUMN whatsapp_groups.name IS 'Display name of the WhatsApp group';
COMMENT ON COLUMN whatsapp_groups.description IS 'Optional description of the group purpose';
COMMENT ON COLUMN whatsapp_groups.member_count IS 'Number of members in the group';
COMMENT ON COLUMN whatsapp_groups.phone_number IS 'Associated phone number';
COMMENT ON COLUMN whatsapp_groups.created_at IS 'Timestamp when group was created';
COMMENT ON COLUMN whatsapp_groups.updated_at IS 'Timestamp when group was last updated';
COMMENT ON COLUMN whatsapp_groups.is_active IS 'Whether the group is currently active';
