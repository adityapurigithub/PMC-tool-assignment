import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api.js";

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/projects?${queryParams}`);
      setProjects(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectDetails = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${id}`);
      setCurrentProject(data.data);
      return data.data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (name, description) => {
    try {
      const { data } = await api.post("/projects", { name, description });
      setProjects((prev) => [data.data, ...prev]);
      return data.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addMember = async (projectId, email, role) => {
    try {
      await api.post(`/projects/${projectId}/members`, { email, role });
      await fetchProjectDetails(projectId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        fetchProjects,
        fetchProjectDetails,
        createProject,
        addMember,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
