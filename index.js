const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// =========================================================
// REQUIREMENT 1c: GET /health for liveness
// =========================================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// =========================================================
// REQUIREMENT 1a: Create / Read / Update Profile
// =========================================================

// 1. CREATE Profile (POST)
app.post('/profile', async (req, res) => {
  try {
    const newProfile = await prisma.profile.create({
      data: req.body // Expects JSON matching the schema
    });
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to create profile", details: error.message });
  }
});

// 2. READ Profile (GET)
// Returns name, email, education, skills, projects, work, links
app.get('/profile', async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst({
      include: { 
        education: true, 
        work: true, 
        skills: true, 
        projects: { include: { skills: true } } // Nest skills inside projects
      }
    });
    
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    
    // Grouping links nicely as requested in Requirement 1a
    const formattedProfile = {
      ...profile,
      links: {
        github: profile.github,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio
      }
    };

    res.json(formattedProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// 3. UPDATE Profile (PUT)
app.put('/profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.profile.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// =========================================================
// REQUIREMENT 1b: Query Endpoints
// =========================================================

// 1. GET /projects?skill=python
app.get('/projects', async (req, res) => {
  const { skill } = req.query;
  try {
    const whereClause = skill 
      ? { skills: { some: { name: { contains: skill, mode: 'insensitive' } } } }
      : {};
    
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: { skills: true }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});

// 2. GET /skills/top (New addition!)
// Returns skills marked as "Expert"
app.get('/skills/top', async (req, res) => {
  try {
    const topSkills = await prisma.skill.findMany({
      where: { level: "Expert" },
      take: 5 // Optional: Limit to top 5
    });
    res.json(topSkills);
  } catch (error) {
    res.status(500).json({ error: "Error fetching top skills" });
  }
});

// 3. GET /search?q=...
app.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' required" });

  try {
    // Advanced search: Looks in Project Title, Description, AND Skill Names
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { skills: { some: { name: { contains: q, mode: 'insensitive' } } } }
        ]
      },
      include: { skills: true }
    });
    res.json({ results: projects });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});