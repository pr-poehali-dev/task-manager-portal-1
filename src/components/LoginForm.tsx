import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Предустановленные пользователи для демо
  const demoUsers = {
    'admin': { username: 'admin', role: 'admin' as const, password: 'admin123' },
    'user1': { username: 'user1', role: 'user' as const, password: 'user123' },
    'user2': { username: 'user2', role: 'user' as const, password: 'user123' }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = Object.values(demoUsers).find(u => 
      u.username === loginForm.username && u.password === loginForm.password
    );
    if (user) {
      onLogin({ username: user.username, role: user.role });
    } else {
      alert('Неверный логин или пароль');
    }
  };

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
};

export default LoginForm;