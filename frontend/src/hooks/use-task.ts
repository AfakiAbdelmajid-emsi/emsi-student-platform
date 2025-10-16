"use client";

import { useState, useEffect } from "react";
import {
  createTask as apiCreateTask,
  getTasks,
  updateTask,
  deleteTask,
} from "@/lib/api/task";
import type { Task, CreateTask } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks();
      console.log("Fetched tasks:", fetchedTasks);
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

// In useTasks hook, modify handleCreateTask:
const handleCreateTask = async (taskData: CreateTask) => {
  setLoading(true);
  setError(null);
  try {
    console.log("Creating task with data:", taskData);
    const newTask = await apiCreateTask(taskData);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  } catch (err) {
    setError("Failed to create task");
    console.error(err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  const handleUpdateTask = async (taskId: string, taskData: CreateTask) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await updateTask(taskId, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.task_id === taskId ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log("Deleting task with ID:", taskId);
    setLoading(true);
    setError(null);
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.task_id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  };
}
