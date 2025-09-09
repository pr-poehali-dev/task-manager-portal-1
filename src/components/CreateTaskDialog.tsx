import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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

interface CreateTaskDialogProps {
  currentUser: {
    username: string;
    role: 'admin' | 'user';
  };
  onCreateTask: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => void;
}

const CreateTaskDialog = ({ currentUser, onCreateTask }: CreateTaskDialogProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium' as Task['priority'],
    deadline: ''
  });

  const handleCreateTask = () => {
    if (!newTaskForm.title || !newTaskForm.description) return;

    const taskData = {
      title: newTaskForm.title,
      description: newTaskForm.description,
      assignee: newTaskForm.assignee || undefined,
      priority: newTaskForm.priority,
      deadline: newTaskForm.deadline,
      assignedBy: currentUser?.username
    };

    onCreateTask(taskData);
    
    setNewTaskForm({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      deadline: ''
    });
    setIsCreateDialogOpen(false);
  };

  if (currentUser.role !== 'admin') {
    return null;
  }

  return (
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
  );
};

export default CreateTaskDialog;