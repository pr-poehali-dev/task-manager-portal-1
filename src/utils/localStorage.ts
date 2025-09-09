// Утилиты для работы с локальным хранилищем
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  deadline: string;
  createdAt: string;
  assignedBy?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  taskId?: string;
  fields: ReportField[];
}

export interface ReportField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  value: string;
  options?: string[];
  required?: boolean;
}

const STORAGE_KEYS = {
  TASKS: 'taskManager_tasks',
  REPORTS: 'taskManager_reports',
  USER_SESSION: 'taskManager_userSession'
};

// Сохранение задач
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Ошибка сохранения задач:', error);
  }
};

// Загрузка задач
export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Ошибка загрузки задач:', error);
    return [];
  }
};

// Сохранение отчетов
export const saveReports = (reports: Report[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (error) {
    console.error('Ошибка сохранения отчетов:', error);
  }
};

// Загрузка отчетов
export const loadReports = (): Report[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Ошибка загрузки отчетов:', error);
    return [];
  }
};

// Сохранение сессии пользователя
export const saveUserSession = (user: { username: string; role: 'admin' | 'user' }): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  } catch (error) {
    console.error('Ошибка сохранения сессии:', error);
  }
};

// Загрузка сессии пользователя
export const loadUserSession = (): { username: string; role: 'admin' | 'user' } | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Ошибка загрузки сессии:', error);
    return null;
  }
};

// Очистка сессии
export const clearUserSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  } catch (error) {
    console.error('Ошибка очистки сессии:', error);
  }
};

// Очистка всех данных (для отладки)
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Ошибка очистки данных:', error);
  }
};

// Экспорт данных для резервной копии
export const exportData = () => {
  try {
    const data = {
      tasks: loadTasks(),
      reports: loadReports(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Ошибка экспорта данных:', error);
    return null;
  }
};

// Импорт данных из резервной копии
export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (data.tasks) saveTasks(data.tasks);
    if (data.reports) saveReports(data.reports);
    return true;
  } catch (error) {
    console.error('Ошибка импорта данных:', error);
    return false;
  }
};