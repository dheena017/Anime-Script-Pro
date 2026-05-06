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
    if (!newTask.trim() || !user) return;
    try {
      const todo = await todoService.createTodo(user.id, newTask);
      setTasks([...tasks, todo]);
      setNewTask('');
    } catch (e) {
      console.error("Failed to add task:", e);
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
    <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-2xl h-full flex flex-col">
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-[#bd4a4a] fill-current" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-100">Production Queue</h3>
      </div>

      <form onSubmit={addTask} className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          placeholder="Add production task..."
          className="bg-black/20 border-zinc-800 text-xs placeholder:text-zinc-600 rounded-xl"
        />
        <Button type="submit" size="icon" className="bg-white text-black hover:bg-zinc-200 rounded-xl shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      <div className="space-y-2 overflow-y-auto max-h-[300px] flex-1">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="group flex items-center justify-between p-3 bg-black/20 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
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



