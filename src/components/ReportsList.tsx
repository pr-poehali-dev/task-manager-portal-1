import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Report } from '@/utils/localStorage';

interface ReportsListProps {
  reports: Report[];
  currentUser: {
    username: string;
    role: 'admin' | 'user';
  };
  onDeleteReport: (reportId: string) => void;
  onViewReport: (report: Report) => void;
}

const ReportsList = ({ reports, currentUser, onDeleteReport, onViewReport }: ReportsListProps) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = currentUser.role === 'admin' 
    ? reports 
    : reports.filter(report => report.submittedBy === currentUser.username);

  if (filteredReports.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-12 text-center">
          <Icon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Отчетов пока нет</h3>
          <p className="text-gray-600">
            {currentUser.role === 'admin' 
              ? 'Пока не создано ни одного отчета в системе.'
              : 'Вы еще не создали ни одного отчета.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {currentUser.role === 'admin' ? 'Все отчеты' : 'Мои отчеты'} 
          <Badge className="ml-2">{filteredReports.length}</Badge>
        </h2>
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="shadow-card hover:shadow-card-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                  {report.description && (
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      <span>Автор: {report.submittedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      <span>Создан: {formatDateTime(report.submittedAt)}</span>
                    </div>
                    {report.taskId && (
                      <div className="flex items-center gap-1">
                        <Icon name="Link" size={14} />
                        <span>Задача: #{report.taskId}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewReport(report)}
                  >
                    <Icon name="Eye" size={14} className="mr-1" />
                    Просмотр
                  </Button>
                  {(currentUser.role === 'admin' || report.submittedBy === currentUser.username) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteReport(report.id)}
                    >
                      <Icon name="Trash2" size={14} className="mr-1" />
                      Удалить
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">Краткое содержание:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                  {report.fields.slice(0, 3).map((field) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{field.label}:</span>
                      <span className="text-gray-600 truncate">
                        {field.value || 'Не указано'}
                      </span>
                    </div>
                  ))}
                  {report.fields.length > 3 && (
                    <div className="text-gray-500">
                      +{report.fields.length - 3} полей...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsList;