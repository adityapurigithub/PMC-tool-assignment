import React, { useEffect, useState } from "react";
import { useProject } from "../context/ProjectContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import { FiSearch, FiChevronDown, FiArrowRight } from "react-icons/fi";

const Dashboard = () => {
  const { projects, fetchProjects, createProject, loading } = useProject();
  const { logout, user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const [search, setSearch] = useState("");
  const [sortByDate, setSortByDate] = useState("desc");

  useEffect(() => {
    if (projects.length > 0) return;
    const delayDebounceFn = setTimeout(() => {
      fetchProjects({ search: search?.trim(), sortByDate });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortByDate]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    await createProject(newProjectName, newProjectDesc);
    setNewProjectName("");
    setNewProjectDesc("");
    setShowModal(false);
  };

  return (
    <div className="max-w-400 w-full mx-auto p-6 md:p-10 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Welcome back,{" "}
            <span className="font-medium text-slate-700">{user?.name}</span>
          </p>
        </div>
        <Button variant="secondary" onClick={logout} className="px-5 py-2.5">
          Logout
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-slate-700"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select
              value={sortByDate}
              onChange={(e) => setSortByDate(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer text-slate-700 font-medium"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
              <FiChevronDown className="w-5 h-5" />
            </div>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="whitespace-nowrap px-6"
          >
            + New Project
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No projects found
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                  No workspace matches your criteria, or you haven't created one
                  yet.
                </p>
                <Button onClick={() => setShowModal(true)}>
                  Create your first project &rarr;
                </Button>
              </div>
            )}

            {projects.map((project) => (
              <Link
                to={`/project/${project._id}`}
                key={project._id}
                className="flex flex-col bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-slate-800 group-hover:text-accent transition-colors line-clamp-1">
                    {project.name}
                  </h4>
                  <span className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-accent group-hover:bg-blue-50 transition-colors">
                    <FiArrowRight className="w-5 h-5" />
                  </span>
                </div>

                <p className="text-slate-500 text-sm flex-1 leading-relaxed line-clamp-3 mb-6">
                  {project.description ||
                    "No detailed description provided for this project."}
                </p>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(project.members.length, 3))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs text-indigo-700 font-bold z-10 relative"
                          >
                            {project.members[i]?.user?.name?.charAt(0) || "U"}
                          </div>
                        ),
                      )}
                      {project.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-600 font-bold z-0 relative">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter a name for your project..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-slate-50 focus:bg-white transition-all text-slate-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              placeholder="Describe the details of this project..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-slate-50 focus:bg-white transition-all resize-none h-32 text-slate-800"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
