import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

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
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium' as Task['priority'],
    deadline: ''
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Предустановленные пользователи для демо
  const demoUsers = {
    'admin': { username: 'admin', role: 'admin' as const, password: 'admin123' },
    'user1': { username: 'user1', role: 'user' as const, password: 'user123' },
    'user2': { username: 'user2', role: 'user' as const, password: 'user123' }
  };

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = Object.values(demoUsers).find(u => 
      u.username === loginForm.username && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser({ username: user.username, role: user.role });
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
  };

  const handleCreateTask = () => {
    if (!newTaskForm.title || !newTaskForm.description) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskForm.title,
      description: newTaskForm.description,
      assignee: newTaskForm.assignee || undefined,
      priority: newTaskForm.priority,
      status: 'pending',
      deadline: newTaskForm.deadline,
      createdAt: new Date().toISOString(),
      assignedBy: currentUser?.username
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskForm({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      deadline: ''
    });
    setIsCreateDialogOpen(false);
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

  const isOverdue = (deadline: string) => {
    return new Date() > new Date(deadline);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Выполнено';
    }
  };

  // Статистика для дашборда
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status !== 'completed' && isOverdue(t.deadline)).length,
    myTasks: tasks.filter(t => t.assignee === currentUser?.username).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Shield" className="text-white" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold">Система Управления Задачами</CardTitle>
            <p className="text-gray-600">Войдите в систему для продолжения</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Введите логин"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Icon name="LogIn" className="mr-2" size={16} />
                Войти
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Демо-аккаунты:</h3>
              <div className="text-xs space-y-1 text-gray-600">
                <div><strong>Администратор:</strong> admin / admin123</div>
                <div><strong>Пользователь:</strong> user1 / user123</div>
                <div><strong>Пользователь:</strong> user2 / user123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="CheckSquare" className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Система Управления Задачами</h1>
              <p className="text-sm text-gray-600">
                Добро пожаловать, <span className="font-medium">{currentUser.username}</span>
                <Badge className="ml-2" variant={currentUser.role === 'admin' ? 'default' : 'secondary'}>
                  {currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </Badge>
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <Icon name="LogOut" className="mr-2" size={16} />
            Выйти
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Статистические карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего задач</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="List" className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">В работе</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Выполнено</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Просрочено</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" className="text-red-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Прогресс выполнения */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Общий прогресс проекта
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Выполнено задач</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-xs text-gray-600">
                {stats.completed} из {stats.total} задач выполнено
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Заголовок секции задач */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentUser.role === 'admin' ? 'Управление задачами' : 'Мои задачи'}
          </h2>
          
          {currentUser.role === 'admin' && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" className="mr-2" size={16} />
                  Создать задачу
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Создание новой задачи</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название задачи</Label>
                    <Input
                      id="title"
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Введите название задачи"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={newTaskForm.description}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Введите описание задачи"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assignee">Исполнитель (не обязательно)</Label>
                      <Select value={newTaskForm.assignee} onValueChange={(value) => 
                        setNewTaskForm(prev => ({ ...prev, assignee: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите исполнителя" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Не назначено</SelectItem>
                          <SelectItem value="user1">user1</SelectItem>
                          <SelectItem value="user2">user2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Приоритет</Label>
                      <Select value={newTaskForm.priority} onValueChange={(value) => 
                        setNewTaskForm(prev => ({ ...prev, priority: value as Task['priority'] }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deadline">Срок выполнения</Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={newTaskForm.deadline}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleCreateTask} className="flex-1">
                      Создать задачу
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Список задач */}
        <div className="grid gap-6">
          {tasks
            .filter(task => currentUser.role === 'admin' || task.assignee === currentUser.username || !task.assignee)
            .map((task) => (
            <Card 
              key={task.id} 
              className={`shadow-card transition-all duration-200 hover:shadow-card-lg ${
                task.status !== 'completed' && isOverdue(task.deadline) 
                  ? 'border-red-200 bg-red-50' 
                  : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        task.status !== 'completed' && isOverdue(task.deadline) 
                          ? 'text-red-700' 
                          : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      
                      <Badge variant="secondary" className={getStatusColor(task.status)}>
                        {getStatusLabel(task.status)}
                      </Badge>
                      
                      {task.status !== 'completed' && isOverdue(task.deadline) && (
                        <Badge variant="destructive">
                          <Icon name="AlertTriangle" size={12} className="mr-1" />
                          Просрочено
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <Icon name="User" size={14} />
                          <span>Исполнитель: {task.assignee}</span>
                        </div>
                      )}
                      
                      {task.assignedBy && (
                        <div className="flex items-center gap-1">
                          <Icon name="UserCheck" size={14} />
                          <span>Назначил: {task.assignedBy}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        <span>Срок: {formatDateTime(task.deadline)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        <span>Создано: {formatDateTime(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {/* Пользователь может принять неназначенную задачу */}
                    {currentUser.role === 'user' && !task.assignee && task.status === 'pending' && (
                      <Button size="sm" onClick={() => handleAcceptTask(task.id)}>
                        <Icon name="UserPlus" size={14} className="mr-1" />
                        Принять
                      </Button>
                    )}
                    
                    {/* Пользователь может изменить статус своих задач */}
                    {task.assignee === currentUser.username && (
                      <>
                        {task.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                          >
                            <Icon name="Play" size={14} className="mr-1" />
                            Начать
                          </Button>
                        )}
                        
                        {task.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          >
                            <Icon name="Check" size={14} className="mr-1" />
                            Завершить
                          </Button>
                        )}
                      </>
                    )}
                    
                    {/* Администратор может удалять задачи */}
                    {currentUser.role === 'admin' && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Удалить
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.filter(task => currentUser.role === 'admin' || task.assignee === currentUser.username || !task.assignee).length === 0 && (
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