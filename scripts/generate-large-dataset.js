#!/usr/bin/env node

/**
 * Large Dataset Generator for WhatsApp Groups
 *
 * This script generates a large amount of realistic WhatsApp group data
 * for testing and demonstration purposes.
 */

import { writeFileSync } from "fs";

// Data pools for realistic generation
const groupNames = [
  "Family",
  "Work",
  "Friends",
  "School",
  "College",
  "University",
  "Office",
  "Team",
  "Project",
  "Department",
  "Neighbors",
  "Community",
  "Society",
  "Club",
  "Association",
  "Organization",
  "Group",
  "Circle",
  "Network",
  "Study",
  "Tutorial",
  "Course",
  "Class",
  "Batch",
  "Alumni",
  "Graduates",
  "Students",
  "Teachers",
  "Sports",
  "Fitness",
  "Gym",
  "Yoga",
  "Running",
  "Cycling",
  "Swimming",
  "Cricket",
  "Football",
  "Basketball",
  "Hobbies",
  "Gaming",
  "Reading",
  "Music",
  "Art",
  "Photography",
  "Cooking",
  "Travel",
  "Movies",
  "Books",
  "Tech",
  "Programming",
  "Developers",
  "Designers",
  "Startup",
  "Innovation",
  "AI",
  "Blockchain",
  "Cloud",
  "DevOps",
  "Business",
  "Entrepreneurs",
  "Startup",
  "Investment",
  "Marketing",
  "Sales",
  "Finance",
  "Banking",
  "Insurance",
  "Health",
  "Medical",
  "Doctors",
  "Nurses",
  "Patients",
  "Wellness",
  "Mental Health",
  "Yoga",
  "Meditation",
  "Education",
  "Online Learning",
  "Courses",
  "Workshops",
  "Training",
  "Certification",
  "Skills",
  "Development",
];

const descriptors = [
  "Official",
  "General",
  "Main",
  "Primary",
  "Central",
  "Core",
  "Essential",
  "Important",
  "Critical",
  "Urgent",
  "Chat",
  "Discussion",
  "Updates",
  "News",
  "Announcements",
  "Information",
  "Messages",
  "Communication",
  "Planning",
  "Strategy",
  "Goals",
  "Objectives",
  "Targets",
  "Milestones",
  "Progress",
  "Reports",
  "Support",
  "Help",
  "Assistance",
  "Guidance",
  "Mentorship",
  "Advice",
  "Tips",
  "Resources",
  "Social",
  "Community",
  "Networking",
  "Events",
  "Activities",
  "Meetings",
  "Gatherings",
  "Celebrations",
];

const projectNames = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
  "Kappa",
  "Phoenix",
  "Eagle",
  "Falcon",
  "Hawk",
  "Titan",
  "Olympus",
  "Apollo",
  "Zeus",
  "Hercules",
  "Atlas",
  "Quantum",
  "Nexus",
  "Vertex",
  "Matrix",
  "Vector",
  "Tensor",
  "Scalar",
  "Lambda",
  "Sigma",
  "Omega",
  "Horizon",
  "Pioneer",
  "Voyager",
  "Explorer",
  "Discovery",
  "Innovation",
  "Revolution",
  "Evolution",
  "Progress",
  "Thunder",
  "Lightning",
  "Storm",
  "Hurricane",
  "Tornado",
  "Blizzard",
  "Avalanche",
  "Volcano",
  "Earthquake",
  "Diamond",
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Crystal",
  "Ruby",
  "Emerald",
  "Sapphire",
  "Pearl",
];

const labels = [
  "Important",
  "Urgent",
  "Archive",
  "Starred",
  "Personal",
  "Work",
  "Family",
  "Friends",
  "School",
  "Project",
  "Meeting",
  "Deadline",
  "Review",
  "Follow-up",
  "Pending",
  "Completed",
  "In Progress",
  "High Priority",
  "Medium Priority",
  "Low Priority",
  "Critical",
  "Normal",
  "Information",
  "Update",
  "Notification",
  "Marketing",
  "Sales",
  "Support",
  "Development",
  "Design",
  "Testing",
  "Deployment",
  "Maintenance",
];

function generateRandomName() {
  const name = groupNames[Math.floor(Math.random() * groupNames.length)];
  const descriptor =
    descriptors[Math.floor(Math.random() * descriptors.length)];
  const project = projectNames[Math.floor(Math.random() * projectNames.length)];

  const patterns = [
    `${name} Group`,
    `${descriptor} ${name}`,
    `${name} - ${project}`,
    `${project} ${name}`,
    `${name} ${descriptor}`,
    `${descriptor} ${name} ${project}`,
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
}

function generateRandomDescription() {
  const templates = [
    "A group for collaboration and communication",
    "Discussion forum for technology and business",
    "Updates and announcements about projects",
    "Community focused on learning and development",
    "Sharing experiences and best practices",
    "Collaboration on development projects",
    "Support group for team members",
    "Information hub for industry trends",
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateRandomLabels() {
  const numLabels = Math.floor(Math.random() * 4) + 1; // 1-4 labels per group
  const selectedLabels = [];
  const availableLabels = [...labels];

  for (let i = 0; i < numLabels && availableLabels.length > 0; i++) {
    const index = Math.floor(Math.random() * availableLabels.length);
    selectedLabels.push(availableLabels[index]);
    availableLabels.splice(index, 1);
  }

  return selectedLabels;
}

function generateRandomDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));

  return date.toISOString();
}

function generateWhatsAppGroups(count) {
  const groups = [];

  for (let i = 1; i <= count; i++) {
    const created = generateRandomDate(365); // Created within last year
    const updated = generateRandomDate(30); // Updated within last month

    groups.push({
      id: i,
      name: generateRandomName(),
      description: generateRandomDescription(),
      member_count: Math.floor(Math.random() * 200) + 5, // 5-204 members
      phone_number: `+1 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900000) + 100000}`,
      created_at: created,
      updated_at: updated,
      is_active: Math.random() > 0.1, // 90% active
      project: projectNames[Math.floor(Math.random() * projectNames.length)],
      labels: generateRandomLabels(),
    });
  }

  return groups;
}

function generateSeedSQL(groups) {
  const sql = [
    "-- Large Dataset Seed for whatsapp_groups table",
    "-- Generated automatically",
    `-- Total groups: ${groups.length}`,
    "",
    "-- Clear existing data (for development only)",
    "TRUNCATE TABLE whatsapp_groups RESTART IDENTITY CASCADE;",
    "",
    "-- Insert generated WhatsApp groups",
  ];

  groups.forEach((group) => {
    const labelJson = JSON.stringify(group.labels);
    const escapedName = group.name.replace(/'/g, "''");
    const escapedDescription = group.description.replace(/'/g, "''");
    sql.push(`INSERT INTO whatsapp_groups (name, description, member_count, phone_number, created_at, updated_at, is_active, project, labels) VALUES
('${escapedName}', '${escapedDescription}', ${group.member_count}, '${group.phone_number}', '${group.created_at}', '${group.updated_at}', ${group.is_active}, '${group.project}', '${labelJson}'::jsonb);`);
  });

  sql.push("");
  sql.push("-- Output confirmation");
  sql.push("DO $$");
  sql.push("BEGIN");
  sql.push(
    `  RAISE NOTICE 'Large dataset seeded successfully. Total groups: %', (SELECT COUNT(*) FROM whatsapp_groups);`,
  );
  sql.push("END $$;");

  return sql.join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 1000; // Default 1000 groups

  console.log(`🌱 Generating ${count} WhatsApp groups...`);

  const groups = generateWhatsAppGroups(count);
  const seedSQL = generateSeedSQL(groups);

  // Write to seed file
  writeFileSync("supabase/seed-large.sql", seedSQL);

  console.log(
    `✅ Generated ${count} groups and saved to supabase/seed-large.sql`,
  );
  console.log(`📊 Sample data:`);
  console.log(
    `   - Names: ${groups
      .slice(0, 5)
      .map((g) => g.name)
      .join(", ")}`,
  );
  console.log(
    `   - Member count range: ${Math.min(...groups.map((g) => g.member_count))} - ${Math.max(...groups.map((g) => g.member_count))}`,
  );
  console.log(
    `   - Active groups: ${groups.filter((g) => g.is_active).length}/${groups.length}`,
  );

  // Show usage instructions
  console.log(`\n🚀 To use this data:`);
  console.log(`   npm run db:seed-large`);
}

if (import.meta.main) {
  main();
}

export { generateWhatsAppGroups, generateSeedSQL };
