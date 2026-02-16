-- Migration: Add project and labels columns to whatsapp_groups table
-- Created: 2026-02-16

-- Add project column
ALTER TABLE whatsapp_groups 
ADD COLUMN project VARCHAR(100);

-- Add labels column as JSON array
ALTER TABLE whatsapp_groups 
ADD COLUMN labels JSONB;

-- Create index for project column
CREATE INDEX idx_whatsapp_groups_project ON whatsapp_groups(project);

-- Create GIN index for labels JSONB column for efficient querying
CREATE INDEX idx_whatsapp_groups_labels ON whatsapp_groups USING GIN (labels);

-- Add comments
COMMENT ON COLUMN whatsapp_groups.project IS 'Project name or identifier';
COMMENT ON COLUMN whatsapp_groups.labels IS 'Array of labels associated with the group';

-- Update existing records to have default project and labels
UPDATE whatsapp_groups 
SET 
  project = CASE 
    WHEN name LIKE '%Family%' THEN 'Family'
    WHEN name LIKE '%Work%' THEN 'Professional'
    WHEN name LIKE '%Friends%' THEN 'Social'
    WHEN name LIKE '%Study%' THEN 'Education'
    WHEN name LIKE '%Fitness%' THEN 'Health'
    ELSE 'General'
  END,
  labels = CASE 
    WHEN is_active = true THEN '["Active"]'::jsonb
    ELSE '["Inactive"]'::jsonb
  END
WHERE project IS NULL;
