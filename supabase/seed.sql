-- Seed data for whatsapp_groups table
-- This file contains sample data for development and testing

-- Clear existing data (for development only)
TRUNCATE TABLE whatsapp_groups RESTART IDENTITY CASCADE;

-- Insert sample WhatsApp groups with project and labels
INSERT INTO whatsapp_groups (name, description, member_count, phone_number, is_active, project, labels) VALUES
('Family Group', 'Close family members chat', 12, '+1 234 567 8900', true, 'Family', '["Active", "Daily"]'::jsonb),
('Work Team', 'Project team discussions', 8, '+1 234 567 8900', true, 'Professional', '["Active", "Important"]'::jsonb),
('Friends Circle', 'School and college friends', 25, '+1 234 567 8900', true, 'Social', '["Active", "Casual"]'::jsonb),
('Book Club', 'Monthly book discussions', 6, '+1 234 567 8900', true, 'Social', '["Active", "Monthly"]'::jsonb),
('Fitness Group', 'Workout motivation and tips', 15, '+1 234 567 8900', true, 'Health', '["Active", "Wellness"]'::jsonb),
('Tech Enthusiasts', 'Latest tech news and discussions', 32, '+1 234 567 8900', false, 'General', '["Inactive", "Archive"]'::jsonb),
('Recipe Exchange', 'Share and discover recipes', 18, '+1 234 567 8900', true, 'Lifestyle', '["Active", "Creative"]'::jsonb),
('Travel Planning', 'Upcoming trip discussions', 10, '+1 234 567 8900', true, 'Social', '["Active", "Planning"]'::jsonb),
('Study Group', 'Exam preparation and study materials', 7, '+1 234 567 8900', true, 'Education', '["Active", "Important"]'::jsonb),
('Neighborhood Watch', 'Community safety and updates', 22, '+1 234 567 8900', true, 'General', '["Active", "Community"]'::jsonb);

-- Set realistic created_at timestamps
UPDATE whatsapp_groups 
SET created_at = NOW() - (random() * 30 || ' days')::INTERVAL,
    updated_at = NOW() - (random() * 7 || ' days')::INTERVAL;

-- Output confirmation
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully. Total groups: %', 
    (SELECT COUNT(*) FROM whatsapp_groups);
END $$;
