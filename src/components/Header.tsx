import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header = ({ currentUser, onLogout }: HeaderProps) => {
  return (
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
        <Button variant="outline" onClick={onLogout}>
          <Icon name="LogOut" className="mr-2" size={16} />
          Выйти
        </Button>
      </div>
    </header>
  );
};

export default Header;