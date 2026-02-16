-- Remove phone_number column from whatsapp_groups (replaced by phone_id)
ALTER TABLE whatsapp_groups 
DROP COLUMN phone_number;
