import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Report } from '@/utils/localStorage';

interface ReportViewProps {
  report: Report;
  onClose: () => void;
  onEdit?: () => void;
}

const ReportView = ({ report, onClose, onEdit }: ReportViewProps) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFieldValue = (field: any) => {
    if (!field.value) return <span className="text-gray-400">Не заполнено</span>;
    
    if (field.type === 'textarea') {
      return (
        <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border text-sm">
          {field.value}
        </div>
      );
    }
    
    return <span className="text-gray-900">{field.value}</span>;
  };

  const getFieldTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'text': 'Текст',
      'textarea': 'Многострочный текст',
      'number': 'Число',
      'date': 'Дата',
      'select': 'Выбор'
    };
    return types[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                {report.description && (
                  <p className="text-gray-600 mb-3">{report.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Icon name="User" size={12} />
                    {report.submittedBy}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {formatDateTime(report.submittedAt)}
                  </Badge>
                  {report.taskId && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Icon name="Link" size={12} />
                      Задача #{report.taskId}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={onEdit}>
                    <Icon name="Edit" size={14} className="mr-1" />
                    Редактировать
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={onClose}>
                  <Icon name="X" size={14} className="mr-1" />
                  Закрыть
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="FileText" size={18} />
                  Содержание отчета
                </h3>
                
                <div className="space-y-4">
                  {report.fields.map((field, index) => (
                    <Card key={field.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                {field.label}
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Обязательное
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Тип: {getFieldTypeLabel(field.type)}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Поле {index + 1}
                            </Badge>
                          </div>
                          
                          <div className="mt-3">
                            <div className="text-sm font-medium text-gray-700 mb-1">
                              Ответ:
                            </div>
                            {renderFieldValue(field)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Сводка отчета */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Icon name="Info" size={16} />
                    Сводная информация
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Всего полей:</span>
                      <span className="ml-2 text-blue-900">{report.fields.length}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Заполнено:</span>
                      <span className="ml-2 text-blue-900">
                        {report.fields.filter(f => f.value).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Обязательных:</span>
                      <span className="ml-2 text-blue-900">
                        {report.fields.filter(f => f.required).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">ID отчета:</span>
                      <span className="ml-2 text-blue-900 font-mono text-xs">
                        {report.id}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportView;