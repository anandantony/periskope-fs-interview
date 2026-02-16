-- Add phone_id column to whatsapp_groups
ALTER TABLE whatsapp_groups 
ADD COLUMN phone_id INTEGER REFERENCES phone_numbers(id);

-- Create index for faster lookups
CREATE INDEX idx_whatsapp_groups_phone_id ON whatsapp_groups(phone_id);
