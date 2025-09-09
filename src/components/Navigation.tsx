import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  currentView: 'dashboard' | 'reports';
  onViewChange: (view: 'dashboard' | 'reports') => void;
  currentUser: {
    username: string;
    role: 'admin' | 'user';
  };
  onLogout: () => void;
  taskCount?: number;
  reportCount?: number;
}

const Navigation = ({ 
  currentView, 
  onViewChange, 
  currentUser, 
  onLogout,
  taskCount = 0,
  reportCount = 0
}: NavigationProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
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
          <Button variant="outline" onClick={onLogout}>
            <Icon name="LogOut" className="mr-2" size={16} />
            Выйти
          </Button>
        </div>

        {/* Навигационные вкладки */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => onViewChange('dashboard')}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Icon name="Layout" size={16} />
            <span>Dashboard</span>
            <Badge 
              variant={currentView === 'dashboard' ? 'secondary' : 'outline'}
              className="ml-1"
            >
              {taskCount}
            </Badge>
          </Button>
          
          <Button
            variant={currentView === 'reports' ? 'default' : 'ghost'}
            onClick={() => onViewChange('reports')}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Icon name="FileText" size={16} />
            <span>Отчеты</span>
            <Badge 
              variant={currentView === 'reports' ? 'secondary' : 'outline'}
              className="ml-1"
            >
              {reportCount}
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;