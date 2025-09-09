import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import LoginForm from '@/components/LoginForm';
import Navigation from '@/components/Navigation';
import StatsCards from '@/components/StatsCards';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import TaskCard from '@/components/TaskCard';
import ReportForm from '@/components/ReportForm';
import ReportsList from '@/components/ReportsList';
import ReportView from '@/components/ReportView';
import { 
  Task, 
  Report, 
  saveTasks, 
  loadTasks, 
  saveReports, 
  loadReports,
  saveUserSession,
  loadUserSession,
  clearUserSession
} from '@/utils/localStorage';

interface User {
  username: string;
  role: 'admin' | 'user';
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports'>('dashboard');
  const [reportView, setReportView] = useState<'list' | 'create' | 'view'>('list');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // Загрузка данных при старте
  useEffect(() => {
    const savedUser = loadUserSession();
    const savedTasks = loadTasks();
    const savedReports = loadReports();
    
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setTasks(savedTasks);
    setReports(savedReports);
  }, []);

  // Сохранение задач при изменении
  useEffect(() => {
    if (tasks.length >= 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Сохранение отчетов при изменении
  useEffect(() => {
    if (reports.length >= 0) {
      saveReports(reports);
    }
  }, [reports]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    saveUserSession(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearUserSession();
    setCurrentView('dashboard');
    setReportView('list');
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

  const handleCreateReport = (reportData: Omit<Report, 'id' | 'submittedAt'>) => {
    const newReport: Report = {
      id: Date.now().toString(),
      ...reportData,
      submittedAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);
    setReportView('list');
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setReportView('view');
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const filteredTasks = tasks.filter(task => 
    currentUser.role === 'admin' || 
    task.assignee === currentUser.username || 
    !task.assignee
  );

  const filteredReports = currentUser.role === 'admin' 
    ? reports 
    : reports.filter(report => report.submittedBy === currentUser.username);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        taskCount={filteredTasks.length}
        reportCount={filteredReports.length}
      />

      <div className="max-w-7xl mx-auto p-6">
        {currentView === 'dashboard' ? (
          <>
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
          </>
        ) : (
          <>
            {reportView === 'list' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Система отчетов
                  </h2>
                  <Button onClick={() => setReportView('create')}>
                    <Icon name="Plus" className="mr-2" size={16} />
                    Создать отчет
                  </Button>
                </div>
                <ReportsList
                  reports={reports}
                  currentUser={currentUser}
                  onDeleteReport={handleDeleteReport}
                  onViewReport={handleViewReport}
                />
              </>
            )}

            {reportView === 'create' && (
              <ReportForm
                onSubmitReport={handleCreateReport}
                currentUser={currentUser}
                onCancel={() => setReportView('list')}
              />
            )}

            {reportView === 'view' && selectedReport && (
              <ReportView
                report={selectedReport}
                onClose={() => {
                  setReportView('list');
                  setSelectedReport(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;