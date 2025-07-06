import axios from 'axios';
import { Todo } from '../types/todo';

class TodoService {
  // Include `/todo` in base URL
  private static readonly BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/todo`;
  private static instance: TodoService;

  private constructor() { }

  static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  async getAll(): Promise<Todo[]> {
    try {
      const response = await axios.get(TodoService.BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  async create(todo: Todo): Promise<Todo> {
    try {
      const response = await axios.post(TodoService.BASE_URL, todo);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  async update(id: string, updatedData: Partial<Todo>): Promise<Todo> {
    try {
      const response = await axios.put(
        `${TodoService.BASE_URL}/${id}`,
        updatedData,
      );
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${TodoService.BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
}

export const todoService = TodoService.getInstance();
