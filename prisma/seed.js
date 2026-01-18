const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Clean up existing data
  await prisma.skill.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.workExperience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.profile.deleteMany({});

  // 2. Create the Profile WITH Skills first
  // We create skills here so they are linked to YOU (the profile)
  const profile = await prisma.profile.create({
    data: {
      name: "Alex Developer",
      email: "alex@example.com",
      bio: "Full Stack Developer. I build things with code.",
      // --- REQUIREMENT: Links ---
      github: "https://github.com/alexdev",
      linkedin: "https://linkedin.com/in/alexdev",
      portfolio: "https://alexdev.com",
      
      // --- REQUIREMENT: Education ---
      education: {
        create: [
          {
            school: "Tech University",
            degree: "B.S. Computer Science",
            startDate: new Date("2019-09-01"),
            endDate: new Date("2023-05-20")
          }
        ]
      },

      // --- REQUIREMENT: Work Experience ---
      work: {
        create: [
          {
            company: "Tech Corp",
            role: "Junior Developer",
            description: "Built APIs and frontend dashboards."
          }
        ]
      },

      // --- REQUIREMENT: Skills (With Levels for /skills/top) ---
      skills: {
        create: [
          { name: "React", level: "Expert" },
          { name: "JavaScript", level: "Expert" },
          { name: "Node.js", level: "Expert" },
          { name: "Python", level: "Intermediate" },
          { name: "CSS", level: "Intermediate" }
        ]
      }
    }
  });

  // 3. Create Projects and CONNECT them to the Skills created above
  // We do this separately to ensure we can "connect" to existing skills by name
  
  // Project 1: React Dashboard
  await prisma.project.create({
    data: {
      title: "E-Commerce Dashboard",
      description: "A React dashboard for managing sales data.",
      profileId: profile.id, // Link to your profile
      skills: {
        connect: [{ name: "React" }, { name: "JavaScript" }, { name: "CSS" }]
      }
    }
  });

  // Project 2: Data Script
  await prisma.project.create({
    data: {
      title: "Data Analysis Script",
      description: "Automated report generation using Pandas.",
      profileId: profile.id,
      skills: {
        connect: [{ name: "Python" }]
      }
    }
  });

  // Project 3: API Service
  await prisma.project.create({
    data: {
      title: "Backend API Service",
      description: "A robust API handling user authentication.",
      profileId: profile.id,
      skills: {
        connect: [{ name: "Node.js" }, { name: "JavaScript" }] // Connecting to skills we made in Step 2
      }
    }
  });

  console.log('Database populated with diverse test data (Skills, Work, Projects)!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());