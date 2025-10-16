// Task structure
export interface Task {
  id: string; // Task ID
  title: string; // Task title
  description?: string; // Task description (optional)
  category: string; // Task category
  due_date?: string; // Due date (optional)
  completed: boolean; // Task completion status
}

// Data to create or update a task
export interface CreateTask {
  title: string;
  description?: string;
  category: string;
  due_date?: string;
  completed: boolean;
}
