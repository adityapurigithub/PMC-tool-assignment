import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api.js";

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchBoards = useCallback(
    async (projectId) => {
      setLoading(true);
      try {
        const { data } = await api.get(`/projects/${projectId}/boards`);
        setBoards(data.data);

        // data.data.forEach((board) => {
        //   fetchTasks(board._id);
        // });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const fetchTasks = async (boardId) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const { data } = await api.get(
        `/boards/${boardId}/tasks?limit=100&${queryParams}`,
      );
      setTasks((prev) => ({
        ...prev,
        [boardId]: data.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const createBoard = async (projectId, name) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/boards`, {
        name,
      });
      setBoards((prev) => [...prev, data.data]);
      setTasks((prev) => ({ ...prev, [data.data._id]: [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async (boardId, taskData) => {
    try {
      const { data } = await api.post(`/boards/${boardId}/tasks`, taskData);
      setTasks((prev) => ({
        ...prev,
        [boardId]: [...(prev[boardId] || []), data.data],
      }));
      return data.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateTaskStatus = async (
    taskId,
    newStatus,
    sourceBoardId,
    destBoardId,
  ) => {
    try {
      const targetTask = tasks[sourceBoardId].find((t) => t._id === taskId);

      if (sourceBoardId === destBoardId) {
        setTasks((prev) => ({
          ...prev,
          [sourceBoardId]: prev[sourceBoardId].map((t) =>
            t._id === taskId ? { ...t, status: newStatus } : t,
          ),
        }));
      } else {
        setTasks((prev) => {
          const sTasks = prev[sourceBoardId].filter((t) => t._id !== taskId);
          const dTasks = [
            ...(prev[destBoardId] || []),
            { ...targetTask, status: newStatus },
          ];
          return { ...prev, [sourceBoardId]: sTasks, [destBoardId]: dTasks };
        });
      }

      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
        boardId: destBoardId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <TaskContext.Provider
      value={{
        boards,
        tasks,
        loading,
        filters,
        fetchBoards,
        fetchTasks,
        createBoard,
        createTask,
        updateTaskStatus,
        updateFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
