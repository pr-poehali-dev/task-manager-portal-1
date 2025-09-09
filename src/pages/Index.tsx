import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import TaskCard from '@/components/TaskCard';

interface Task {
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

interface User {
  username: string;
  role: 'admin' | 'user';
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);



  // Демо-задачи
  useEffect(() => {
    const demoTasks: Task[] = [
      {
        id: '1',
        title: 'Настроить сервер базы данных',
        description: 'Установить и настроить PostgreSQL сервер для проекта',
        assignee: 'user1',
        priority: 'high',
        status: 'in_progress',
        deadline: '2025-09-12T15:00',
        createdAt: '2025-09-08T10:00',
        assignedBy: 'admin'
      },
      {
        id: '2',
        title: 'Написать документацию API',
        description: 'Создать подробную документацию для всех API endpoints',
        assignee: 'user2',
        priority: 'medium',
        status: 'pending',
        deadline: '2025-09-15T18:00',
        createdAt: '2025-09-09T09:00',
        assignedBy: 'admin'
      },
      {
        id: '3',
        title: 'Провести код-ревью',
        description: 'Проверить новые изменения в модуле аутентификации',
        priority: 'low',
        status: 'completed',
        deadline: '2025-09-10T12:00',
        createdAt: '2025-09-07T14:30'
      },
      {
        id: '4',
        title: 'Исправить критический баг',
        description: 'Устранить проблему с авторизацией в продакшене',
        assignee: 'user1',
        priority: 'high',
        status: 'pending',
        deadline: '2025-09-09T23:59', // просроченная
        createdAt: '2025-09-08T16:00',
        assignedBy: 'admin'
      }
    ];
    setTasks(demoTasks);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleAcceptTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { 
        ...task, 
        status: 'in_progress', 
        assignee: currentUser?.username 
      } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (currentUser?.role === 'admin') {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };



  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const filteredTasks = tasks.filter(task => 
    currentUser.role === 'admin' || 
    task.assignee === currentUser.username || 
    !task.assignee
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto p-6">
        <StatsCards tasks={tasks} />

        {/* Заголовок секции задач */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentUser.role === 'admin' ? 'Управление задачами' : 'Мои задачи'}
          </h2>
          
          <CreateTaskDialog
            currentUser={currentUser}
            onCreateTask={handleCreateTask}
          />
        </div>

        {/* Список задач */}
        <div className="grid gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              currentUser={currentUser}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onAcceptTask={handleAcceptTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Задач пока нет</h3>
              <p className="text-gray-600">
                {currentUser.role === 'admin' 
                  ? 'Создайте первую задачу, чтобы начать управление проектом.'
                  : 'Пока нет задач, назначенных вам.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;