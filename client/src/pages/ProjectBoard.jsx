import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext.jsx";
import { useTask } from "../context/TaskContext.jsx";
import { useAuth } from "../context/AuthContext.jsx"; // To check if current user is admin
import TaskBoard from "../components/TaskBoard.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import { FiSearch, FiChevronDown, FiPlus } from "react-icons/fi";

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentProject, fetchProjectDetails, addMember, deleteProject } =
    useProject();
  const {
    boards,
    tasks,
    fetchBoards,
    createBoard,
    createTask,
    loading,
    filters,
    updateFilters,
    fetchTasks,
  } = useTask();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Task Creation Form
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedUser: "",
  });

  // Local Filter State mappings (to debounce search text before calling Context updateFilters)
  const [searchText, setSearchText] = useState(filters?.search || "");

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key]; // clear filter if empty
    }
    updateFilters(newFilters, id);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await addMember(id, newMemberEmail, "Member");
      setNewMemberEmail("");
      setShowMemberModal(false);
    } catch (err) {
      alert("Failed to add member. Check email or role permissions.");
    }
  };

  const handleDeleteProject = async () => {
    if (
      window.confirm(
        "Are you sure you want to completely delete this workspace? This action cannot be undone.",
      )
    ) {
      try {
        await deleteProject(id);
        navigate("/");
      } catch (err) {
        alert("Failed to delete project. You might not have Admin privileges.");
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (boards.length === 0) {
      await createBoard(id, "Main Board");
      alert(
        "No board exists. Please wait a moment and try again while we setup the main board.",
      );
      return;
    }

    const mainBoardId = boards[0]._id;
    try {
      await createTask(mainBoardId, {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined,
        assignedUser: taskForm.assignedUser || undefined,
        status: "Todo",
      });
      setTaskForm({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        assignedUser: "",
      });
      setShowTaskModal(false);
    } catch (err) {
      alert("Failed to create task");
    }
  };

  useEffect(() => {
    fetchProjectDetails(id);
    fetchBoards(id);
  }, [id]);

  useEffect(() => {
    if (boards.length > 0) fetchTasks(boards[0]?._id);
  }, [filters]);

  // Debounced search for tasks
  useEffect(() => {
    const delay = setTimeout(() => {
      handleFilterChange("search", searchText);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchText]);

  // Check user role
  const currentUserMember = currentProject?.members?.find(
    (m) => m.user?._id === user?._id,
  );
  const isAdmin = currentUserMember?.role === "Admin";

  if (!currentProject)
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 font-semibold text-lg animate-pulse">
        Loading project data...
      </div>
    );

  return (
    <div className="max-w-400 w-full mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-start mb-8 pb-6 border-b border-slate-200 gap-4">
        <div className="flex-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 font-semibold hover:text-accent hover:translate-x-1 transition-all mb-4 text-sm bg-slate-100 px-3 py-1 rounded-full"
          >
            <span>&larr;</span> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {currentProject.name}
            </h2>
            {isAdmin && (
              <button
                onClick={handleDeleteProject}
                className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg font-bold border border-red-200 hover:bg-red-100 transition-colors"
              >
                Delete Project
              </button>
            )}
          </div>
          <p className="text-slate-500 mt-2 max-w-3xl text-sm leading-relaxed">
            {currentProject.description ||
              "No detailed description provided for this project."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end mt-4 md:mt-0 items-center">
          <Button variant="secondary" onClick={() => setShowMemberModal(true)}>
            Manage Team ({currentProject.members.length})
          </Button>
          <Button onClick={() => setShowTaskModal(true)}>
            <FiPlus className="w-5 h-5" />
            New Task
          </Button>
        </div>
      </header>

      {/* Advanced Filter Bar for Tasks */}
      {boards.length !== 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm font-medium text-slate-700"
            />
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-3">
            <select
              value={filters?.priority || ""}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-accent outline-none min-w-30"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={filters?.assignedUser || ""}
              onChange={(e) =>
                handleFilterChange("assignedUser", e.target.value)
              }
              className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-accent outline-none min-w-35"
            >
              <option value="">All Assignees</option>
              {currentProject.members.map((m) => (
                <option key={m.user._id} value={m.user._id}>
                  {m.user.name}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="date"
                value={filters?.dueDate || ""}
                onChange={(e) => handleFilterChange("dueDate", e.target.value)}
                className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-accent outline-none w-full lg:w-37.5"
                title="Filter by Exact Due Date"
              />
            </div>

            {(filters?.priority ||
              filters?.assignedUser ||
              filters?.dueDate ||
              filters?.search) && (
              <button
                onClick={() => {
                  setSearchText("");
                  updateFilters({}, id);
                }}
                className="text-xs text-red-500 font-bold px-4 hover:bg-red-50 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center flex-col items-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-accent mb-4"></div>
          <p className="text-slate-400 font-medium animate-pulse">
            Syncing boards...
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {boards.length === 0 && (
            <div className="py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl my-auto shadow-sm max-w-2xl mx-auto w-full flex flex-col items-center">
              <div className="text-5xl mb-6">📋</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No active Boards
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Initialize a Kanban board to start tracking tasks and
                collaborating with your team.
              </p>
              <Button onClick={() => createBoard(id, "Sprint 1")}>
                Launch Default Board
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-12 flex-1 pb-10">
            {boards.map((board) => (
              <div
                key={board._id}
                className="flex flex-col h-full bg-transparent"
              >
                <TaskBoard boardId={board._id} tasks={tasks[board._id] || []} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abstracted Member Modal */}
      <Modal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        title="Project Team"
      >
        <ul className="mb-6 max-h-60 overflow-y-auto pr-3 divide-y divide-slate-100 ">
          {currentProject.members.map((m) => (
            <li
              key={m._id}
              className="py-4 flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-100 to-blue-50 flex items-center justify-center text-indigo-700 font-black shadow-sm border-2 border-white ring-2 ring-indigo-50">
                  {m.user?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-accent transition-colors">
                    {m.user?.name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {m.user?.email}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${m.role === "Admin" ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200"}`}
              >
                {m.role}
              </span>
            </li>
          ))}
        </ul>

        {isAdmin ? (
          <form
            onSubmit={handleAddMember}
            className="flex flex-col gap-4 border-t border-slate-100 pt-6"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Invite exactly by Email
              </label>
              <input
                type="email"
                placeholder="user@gmail.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent bg-slate-50 focus:bg-white transition-all text-slate-800 font-medium"
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowMemberModal(false)}
              >
                Close
              </Button>
              <Button type="submit">Send Invite</Button>
            </div>
          </form>
        ) : (
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowMemberModal(false)}
            >
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Abstracted Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Enter title for the task..."
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent bg-slate-50 focus:bg-white text-slate-800 font-medium transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter Task Description..."
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent bg-slate-50 focus:bg-white resize-none h-24 text-slate-800 font-medium transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <select
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, priority: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent bg-slate-50 focus:bg-white text-slate-800 font-bold appearance-none cursor-pointer transition-all pr-10"
                >
                  <option value="Low">🧊 Low</option>
                  <option value="Medium">⚡ Medium</option>
                  <option value="High">🔥 High</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <FiChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, dueDate: e.target.value })
                }
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent bg-slate-50 focus:bg-white text-slate-800 font-bold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Assign To
            </label>
            <div className="relative">
              <select
                value={taskForm.assignedUser}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, assignedUser: e.target.value })
                }
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent bg-slate-50 focus:bg-white text-slate-800 font-medium appearance-none cursor-pointer transition-all pr-10"
              >
                <option value="">Unassigned</option>
                {currentProject.members.map((m) => (
                  <option key={m.user._id} value={m.user._id}>
                    {m.user.name} {m.user._id === user._id && "(You)"}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                <FiChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowTaskModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectBoard;
