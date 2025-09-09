import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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

interface StatsCardsProps {
  tasks: Task[];
}

const StatsCards = ({ tasks }: StatsCardsProps) => {
  const isOverdue = (deadline: string) => {
    return new Date() > new Date(deadline);
  };

  // Статистика для дашборда
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status !== 'completed' && isOverdue(t.deadline)).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
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
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="TrendingUp" size={20} />
            <h3 className="text-lg font-semibold">Общий прогресс проекта</h3>
          </div>
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
    </>
  );
};

export default StatsCards;