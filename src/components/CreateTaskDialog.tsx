import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Task } from '@/utils/localStorage';

interface CreateTaskDialogProps {
  currentUser: {
    username: string;
    role: 'admin' | 'user';
  };
  onCreateTask: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => void;
}

const CreateTaskDialog = ({ currentUser, onCreateTask }: CreateTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium' as Task['priority'],
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Пожалуйста, заполните название и описание задачи');
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee: formData.assignee || undefined,
      priority: formData.priority,
      deadline: formData.deadline,
      assignedBy: currentUser.username
    };

    onCreateTask(taskData);
    
    // Сбросить форму
    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      deadline: ''
    });
    
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      deadline: ''
    });
  };

  if (currentUser.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Icon name="Plus" className="mr-2" size={16} />
        Создать задачу
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Создание новой задачи</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClose}
                className="rounded-full"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium mb-2">
                  Название задачи *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Введите название задачи"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium mb-2">
                  Описание *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Введите описание задачи"
                  rows={4}
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee" className="block text-sm font-medium mb-2">
                    Исполнитель
                  </Label>
                  <select
                    id="assignee"
                    value={formData.assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Не назначено</option>
                    <option value="user1">user1</option>
                    <option value="user2">user2</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority" className="block text-sm font-medium mb-2">
                    Приоритет
                  </Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">🟢 Низкий</option>
                    <option value="medium">🟡 Средний</option>
                    <option value="high">🔴 Высокий</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="deadline" className="block text-sm font-medium mb-2">
                  Срок выполнения
                </Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto"
                >
                  <Icon name="ArrowLeft" className="mr-2" size={16} />
                  Назад
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:flex-1"
                  disabled={!formData.title.trim() || !formData.description.trim()}
                >
                  <Icon name="CheckCircle" className="mr-2" size={16} />
                  Создать задачу
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTaskDialog;