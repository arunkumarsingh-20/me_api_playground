import { useEffect, useState } from 'react';
import { Search, Github, Linkedin, ExternalLink, Code2, Briefcase, GraduationCap } from 'lucide-react';

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, projectRes] = await Promise.all([
        fetch(`${API_URL}/profile`),
        fetch(`${API_URL}/projects`)
      ]);
      
      const profileData = await profileRes.json();
      const projectData = await projectRes.json();
      
      setProfile(profileData);
      setProjects(projectData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      // If search is empty, reload all projects
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      setProjects(data);
      return;
    }

    // Call the advanced search endpoint
    try {
      const res = await fetch(`${API_URL}/search?q=${search}`);
      const data = await res.json();
      setProjects(data.results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!profile) return <div className="text-center mt-20">Profile not found. Is backend running?</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
      
      {/* --- HERO SECTION --- */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-12 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{profile.name}</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-xl">{profile.bio}</p>
            
            <div className="flex gap-4 mt-6">
              {profile.links?.github && (
                <a href={profile.links.github} target="_blank" rel="noreferrer" 
                   className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                  <Github size={20} /> <span className="text-sm font-medium">GitHub</span>
                </a>
              )}
              {profile.links?.linkedin && (
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" 
                   className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                  <Linkedin size={20} /> <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {profile.links?.portfolio && (
                <a href={profile.links.portfolio} target="_blank" rel="noreferrer" 
                   className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                  <ExternalLink size={20} /> <span className="text-sm font-medium">Portfolio</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Stats / Quick Info Box */}
          <div className="mt-8 md:mt-0 bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-[250px]">
             <div className="space-y-3">
               <div className="flex items-center gap-3 text-gray-700">
                 <Briefcase size={18} className="text-blue-500" />
                 <span className="text-sm font-medium">{profile.work[0]?.role || "Developer"}</span>
               </div>
               <div className="flex items-center gap-3 text-gray-700">
                 <GraduationCap size={18} className="text-purple-500" />
                 <span className="text-sm font-medium">{profile.education[0]?.degree || "Learner"}</span>
               </div>
               <div className="flex items-center gap-3 text-gray-700">
                 <Code2 size={18} className="text-green-500" />
                 <span className="text-sm font-medium">{profile.skills.length} Skills Mastered</span>
               </div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* --- SKILLS SECTION --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Technical Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill) => (
              <span key={skill.id} 
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  skill.level === 'Expert' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-gray-600 border-gray-200'
                }`}>
                {skill.name} {skill.level === 'Expert' && '★'}
              </span>
            ))}
          </div>
        </section>

        {/* --- PROJECTS SEARCH & GRID --- */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search projects or skills..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </form>
          </div>

          {/* Project Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No projects found matching "{search}"</p>
              <button 
                onClick={() => { setSearch(""); handleSearch({ preventDefault: () => {} }); }}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Code2 size={24} />
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.skills.map(skill => (
                      <span key={skill.id} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} {profile.name}. Built with React, Node.js & Prisma.</p>
      </footer>
    </div>
  );
}

export default App;