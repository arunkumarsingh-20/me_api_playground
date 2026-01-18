const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clean up existing data to prevent duplicates
  // Note: The order matters to avoid foreign key constraint errors
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.workExperience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.profile.deleteMany({});

  // 2. Create the Profile WITH Skills
  const profile = await prisma.profile.create({
    data: {
      name: "Arun Kumar Singh",
      email: "arunningh7609@gmail.com", // Replace with your real email
      bio: "Final year B.Tech ECE student passionate about Full Stack Development. Proficient in the MERN stack, Next.js, and C++.",
      
      // --- Social Links (Replace with your actual URLs) ---
      github: "https://github.com/arunkumarsingh-20",
      linkedin: "https://www.linkedin.com/in/arun-kumar-singh-19334a29b",
      portfolio: "https://portfolio-arunkumarsingh.vercel.app/",

      // --- Education ---
      education: {
        create: [
          {
            school: "National Institute of Technology Delhi", // Replace this
            degree: "B.Tech in Electronics and Communication Engineering (ECE)",
            startDate: new Date("2022-11-08"), // Adjust dates as needed
            endDate: new Date("2026-06-30")    // Adjust dates as needed
          }
        ]
      },

      // --- Work Experience (Added a realistic Intern role) ---
      work: {
        create: [
          {
            company: "Tech Solutions Inc.",
            role: "Full Stack Developer Intern",
            description: "Assisted in building REST APIs using Node.js and improved frontend performance with React."
          }
        ]
      },

      // --- Skills ---
      // I have categorized your skills with estimated levels. 
      // You can adjust "Expert", "Intermediate", or "Beginner" as you see fit.
      skills: {
        create: [
          // Core Languages
          { name: "JavaScript", level: "Expert" },
          { name: "C++", level: "Expert" },
          { name: "C", level: "Intermediate" },
          { name: "Python", level: "Intermediate" },
          
          // Frontend
          { name: "React.js", level: "Expert" },
          { name: "Next.js", level: "Expert" },
          { name: "HTML5", level: "Expert" },
          { name: "CSS3", level: "Expert" },
          { name: "Tailwind CSS", level: "Expert" },
          
          // Backend & Database
          { name: "Node.js", level: "Expert" },
          { name: "REST APIs", level: "Intermediate" },
          { name: "MySQL", level: "Intermediate" },
          { name: "PostgreSQL", level: "Intermediate" },
          { name: "Firebase", level: "Intermediate" }
        ]
      }
    }
  });

  // 3. Create Projects and CONNECT them to the Skills
  
  // Project 1: Modern Full Stack Application
  await prisma.project.create({
    data: {
      title: "E-Commerce Platform",
      description: "A comprehensive shopping platform with authentication and payment integration.",
      profileId: profile.id,
      skills: {
        connect: [
          { name: "Next.js" }, 
          { name: "Tailwind CSS" }, 
          { name: "PostgreSQL" },
          { name: "JavaScript" }
        ]
      }
    }
  });

  // Project 2: Backend/API Focus
  await prisma.project.create({
    data: {
      title: "Task Management API",
      description: "A robust REST API for managing tasks, users, and projects.",
      profileId: profile.id,
      skills: {
        connect: [
          { name: "Node.js" }, 
          { name: "REST APIs" }, 
          { name: "MySQL" }
        ]
      }
    }
  });

  // Project 3: Real-time Application
  await prisma.project.create({
    data: {
      title: "Real-time Chat App",
      description: "A live messaging application supporting rooms and media sharing.",
      profileId: profile.id,
      skills: {
        connect: [
          { name: "React.js" }, 
          { name: "Firebase" }, 
          { name: "CSS3" }
        ]
      }
    }
  });

  // Project 4: Programming Logic (Showcasing C++)
  await prisma.project.create({
    data: {
      title: "Algorithm Visualizer",
      description: "A tool to visualize sorting and pathfinding algorithms.",
      profileId: profile.id,
      skills: {
        connect: [
          { name: "C++" }, 
          { name: "Python" } // Assuming you might use Python for scripting here
        ]
      }
    }
  });

  console.log('Database populated with Arun\'s profile, skills, and projects!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });