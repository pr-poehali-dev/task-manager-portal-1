import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface TaskCardProps {
  task: Task;
  currentUser: {
    username: string;
    role: 'admin' | 'user';
  };
  onUpdateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  onAcceptTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard = ({ 
  task, 
  currentUser, 
  onUpdateTaskStatus, 
  onAcceptTask, 
  onDeleteTask 
}: TaskCardProps) => {
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

  return (
    <Card 
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
              <Button size="sm" onClick={() => onAcceptTask(task.id)}>
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
                    onClick={() => onUpdateTaskStatus(task.id, 'in_progress')}
                  >
                    <Icon name="Play" size={14} className="mr-1" />
                    Начать
                  </Button>
                )}
                
                {task.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    onClick={() => onUpdateTaskStatus(task.id, 'completed')}
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
                onClick={() => onDeleteTask(task.id)}
              >
                <Icon name="Trash2" size={14} className="mr-1" />
                Удалить
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;