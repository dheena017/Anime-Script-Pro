import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Square, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { todoService, Todo } from '@/services/api/todos';
import { useAuth } from '@/hooks/useAuth';

export const TodoWidget: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await todoService.getTodos(user.id);
      setTasks(data);
    } catch (e) {
      console.error("Failed to fetch tasks:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user?.id]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newTask.trim() || !user) return;

    // Client-side duplicate check
    if (tasks.some(t => t.text.toLowerCase() === newTask.trim().toLowerCase())) {
      setError("This task already exists in your queue.");
      return;
    }

    try {
      const todo = await todoService.createTodo(user.id, newTask.trim());
      setTasks([...tasks, todo]);
      setNewTask('');
    } catch (e: any) {
      console.error("Failed to add task:", e);
      setError(e.response?.data?.detail || "Failed to add task.");
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const updated = await todoService.updateTodo(id, !completed);
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (e) {
      console.error("Failed to toggle task:", e);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const success = await todoService.deleteTodo(id);
      if (success) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete task:", e);
    }
  };

  return (
    <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-2xl h-full flex flex-col relative overflow-hidden group/todo">
      {/* Cinematic Shimmer Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/todo:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <Zap className="w-5 h-5 text-[#bd4a4a] fill-current" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-100">Production Queue</h3>
      </div>

      <form onSubmit={addTask} className="space-y-2 relative z-10">
        <div className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewTask(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Add production task..."
            className="bg-black/40 border-zinc-800 text-xs placeholder:text-zinc-600 rounded-xl focus:ring-1 focus:ring-studio/50 transition-all"
          />
          <Button type="submit" size="icon" className="bg-white text-black hover:bg-zinc-200 rounded-xl shrink-0 transition-transform active:scale-95">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[10px] text-red-400 font-medium px-2 overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <div className="space-y-2 overflow-y-auto max-h-[300px] flex-1 relative z-10">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="group flex items-center justify-between p-3 bg-black/40 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={() => toggleTask(task.id, task.completed)} className="shrink-0">
                  {task.completed ? <Check className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-zinc-600" />}
                </button>
                <span className={`text-xs ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-300'} truncate`}>
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};
