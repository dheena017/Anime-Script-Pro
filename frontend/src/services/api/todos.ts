import { apiRequest } from '@/lib/api-utils';

export interface Todo {
  id: number;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export const todoService = {
  getTodos: async (userId: string): Promise<Todo[]> => {
    return apiRequest<Todo[]>(`/api/todos/${userId}`);
  },

  createTodo: async (userId: string, text: string): Promise<Todo> => {
    return apiRequest<Todo>(`/api/todos/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

  updateTodo: async (todoId: number, completed: boolean): Promise<Todo> => {
    return apiRequest<Todo>(`/api/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed })
    });
  },

  deleteTodo: async (todoId: number): Promise<boolean> => {
    const res = await apiRequest<any>(`/api/todos/${todoId}`, {
      method: 'DELETE'
    });
    return res.ok === true;
  }
};



