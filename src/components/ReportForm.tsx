import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Report, ReportField } from '@/utils/localStorage';

interface ReportFormProps {
  onSubmitReport: (report: Omit<Report, 'id' | 'submittedAt'>) => void;
  currentUser: {
    username: string;
    role: 'admin' | 'user';
  };
  onCancel: () => void;
}

const ReportForm = ({ onSubmitReport, currentUser, onCancel }: ReportFormProps) => {
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    taskId: ''
  });

  const [formFields, setFormFields] = useState<ReportField[]>([
    {
      id: '1',
      label: 'Выполненная работа',
      type: 'textarea' as const,
      value: '',
      required: true
    },
    {
      id: '2',
      label: 'Затраченное время (часы)',
      type: 'number' as const,
      value: '',
      required: true
    },
    {
      id: '3',
      label: 'Статус выполнения',
      type: 'select' as const,
      value: '',
      options: ['Выполнено полностью', 'Выполнено частично', 'В процессе', 'Приостановлено'],
      required: true
    },
    {
      id: '4',
      label: 'Комментарии и замечания',
      type: 'textarea' as const,
      value: '',
      required: false
    }
  ]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ));
  };

  const addCustomField = () => {
    const newField: ReportField = {
      id: Date.now().toString(),
      label: 'Новое поле',
      type: 'text',
      value: '',
      required: false
    };
    setFormFields(prev => [...prev, newField]);
  };

  const updateFieldLabel = (fieldId: string, label: string) => {
    setFormFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, label } : field
    ));
  };

  const updateFieldType = (fieldId: string, type: ReportField['type']) => {
    setFormFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, type, value: '' } : field
    ));
  };

  const removeField = (fieldId: string) => {
    setFormFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка обязательных полей
    const requiredFields = formFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !field.value.trim());
    
    if (!reportData.title.trim()) {
      alert('Введите название отчета');
      return;
    }

    if (missingFields.length > 0) {
      alert(`Заполните обязательные поля: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    const report = {
      title: reportData.title,
      description: reportData.description,
      submittedBy: currentUser.username,
      taskId: reportData.taskId || undefined,
      fields: formFields
    };

    onSubmitReport(report);
  };

  const renderField = (field: ReportField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={field.value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Введите ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={field.value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Введите ${field.label.toLowerCase()}`}
            rows={3}
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={field.value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder="0"
            required={field.required}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={field.value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <Select value={field.value} onValueChange={(value) => handleFieldChange(field.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите вариант" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-card-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="FileText" size={24} />
          Создание отчета
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Название отчета *</Label>
              <Input
                id="title"
                value={reportData.title}
                onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Введите название отчета"
                required
              />
            </div>
            <div>
              <Label htmlFor="taskId">ID связанной задачи (опционально)</Label>
              <Input
                id="taskId"
                value={reportData.taskId}
                onChange={(e) => setReportData(prev => ({ ...prev, taskId: e.target.value }))}
                placeholder="Введите ID задачи"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Краткое описание</Label>
            <Textarea
              id="description"
              value={reportData.description}
              onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Введите краткое описание отчета"
              rows={2}
            />
          </div>

          {/* Поля отчета */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Поля отчета</h3>
              <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить поле
              </Button>
            </div>

            {formFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Название поля</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                          placeholder="Название поля"
                        />
                      </div>
                      <div>
                        <Label>Тип поля</Label>
                        <Select value={field.type} onValueChange={(value) => updateFieldType(field.id, value as ReportField['type'])}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Текст</SelectItem>
                            <SelectItem value="textarea">Многострочный текст</SelectItem>
                            <SelectItem value="number">Число</SelectItem>
                            <SelectItem value="date">Дата</SelectItem>
                            <SelectItem value="select">Выпадающий список</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => setFormFields(prev => prev.map(f => 
                              f.id === field.id ? { ...f, required: e.target.checked } : f
                            ))}
                            className="rounded"
                          />
                          <span className="text-sm">Обязательное</span>
                        </label>
                        {index > 3 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>
                      {field.label} {field.required && '*'}
                    </Label>
                    {renderField(field)}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Кнопки управления */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Icon name="Send" size={16} className="mr-2" />
              Отправить отчет
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <Icon name="X" size={16} className="mr-2" />
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;