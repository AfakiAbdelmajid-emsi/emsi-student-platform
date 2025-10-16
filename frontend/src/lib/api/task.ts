import client from './client';
import { Task, CreateTask } from '@/types/task';

// Create a new task
function serializeTaskDates(task: CreateTask): CreateTask {
  return {
    ...task,
    due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null
  };
}

// Create a new task
export async function createTask(task: CreateTask): Promise<Task> {
  try {
    const serializedTask = serializeTaskDates(task);
    const response = await client('/tasks/create_task', {
      method: 'POST',
      data: serializedTask,
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error creating task: ${error.message}`);
  }
}
// Fetch all tasks for the current user
export async function getTasks(): Promise<Task[]> {
  try {
    const response = await client('/tasks/get_tasks', {
      method: 'GET',
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error fetching tasks: ${error.message}`);
  }
}

// Update a task
export async function updateTask(taskId: string, task: CreateTask): Promise<Task> {
  try {
    const response = await client(`/tasks/update_task/${taskId}`, {
      method: 'PUT',
      data: task,
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error updating task: ${error.message}`);
  }
}

// Delete a task
export async function deleteTask(taskId: string): Promise<{ message: string }> {
  try {
    const response = await client(`/tasks/delete_task/${taskId}`, {
      method: 'DELETE',
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error deleting task: ${error.message}`);
  }
}
