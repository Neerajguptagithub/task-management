export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedTo: Pick<User, '_id' | 'name' | 'email'>;
  assignedBy: Pick<User, '_id' | 'name' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalTasks: number;
  tasksByStatus: {
    todo: number;
    in_progress: number;
    completed: number;
  };
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
  };
  recentTasks: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors: { field: string; message: string }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface UserState {
  employees: User[];
  loading: boolean;
  error: string | null;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  assignedTo: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}
