'use client';

import { useState } from 'react';
import { Clock, ListTodo, CheckCircle2, Trash2, Tag, Filter, ChevronDown } from 'lucide-react';
import Button from "@/components/ui/Button";
import { useTasks } from '@/hooks/use-task';
import type { Task, CreateTask } from '@/types/task';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ['Study', 'Assignment', 'Project', 'Exam', 'Review', 'Other'] as const;

export default function TasksSection() {
  const { t } = useTranslation('common');
  const { tasks, loading, error, handleCreateTask, handleUpdateTask, handleDeleteTask } = useTasks();
  const [newTask, setNewTask] = useState<CreateTask>({
    title: '',
    description: '',
    category: 'Study',
    due_date: '',
    completed: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>('all');

// In the TasksSection component, modify the addTask function:
const addTask = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTask.title.trim()) return;
  try {
    // Format the date before sending
    const taskToCreate = {
      ...newTask,
      due_date: newTask.due_date ? new Date(newTask.due_date).toISOString().split('T')[0] : ''
    };
    await handleCreateTask(taskToCreate);
    setNewTask({ title: '', description: '', category: 'Study', due_date: '', completed: false });
  } catch (err) {
    console.error('Failed to create task:', err);
  }
};

  const toggleTask = async (task: Task) => {
    try {
      await handleUpdateTask(task.task_id, { ...task, completed: !task.completed });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const deleteTask = async (taskId: string) => {
    console.log('Deleting task with ID:', taskId);
    try {
      await handleDeleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'study': return 'bg-blue-100 text-blue-700';
      case 'assignment': return 'bg-purple-100 text-purple-700';
      case 'project': return 'bg-green-100 text-green-700';
      case 'exam': return 'bg-red-100 text-red-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = !selectedCategory || task.category === selectedCategory;
    const matchesCompletion = 
      completionFilter === 'all' ? true :
      completionFilter === 'completed' ? task.completed :
      !task.completed;
    return matchesCategory && matchesCompletion;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-gray-900">{t('studyTasks', 'Study Tasks')}</h2>
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-gray-400" />
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{t('filters', 'Filters')}</span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === null
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All Categories
                      </button>
                      {CATEGORIES.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'completed', 'pending'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setCompletionFilter(status)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            completionFilter === status
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-soft p-6">
        <form onSubmit={addTask} className="space-y-4 mb-6">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Task title..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Task description (optional)..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newTask.category}
              onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <Button type="submit" className="w-full bg-primary-500 text-white hover:bg-primary-600" disabled={loading}>
            {loading ? 'Adding Task...' : 'Add Task'}
          </Button>
        </form>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {loading && tasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No tasks found. Add your first task above!</div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <button
                  onClick={() => toggleTask(task)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${task.completed ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'}`}
                >
                  {task.completed && <CheckCircle2 className="h-4 w-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  {task.description && <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>}
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                      <Tag className="h-3 w-3 mr-1" />
                      {task.category}
                    </span>
                    {task.due_date && (
                      <>
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">{new Date(task.due_date).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.task_id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  disabled={loading}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
