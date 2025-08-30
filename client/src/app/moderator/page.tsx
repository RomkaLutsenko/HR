'use client';

import ModeratorSpecialists from '@/components/sections/ModeratorSpecialists';
import { ModeratorDashboard, SpecialistApplication } from '@/types/types';
import { api } from '@/utils/api';
import { useEffect, useState } from 'react';

export default function ModeratorPage() {
  const [dashboard, setDashboard] = useState<ModeratorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'specialists'>('applications');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/moderator/applications');
      if (response.success) {
        setDashboard(response.dashboard);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: number, action: 'APPROVE' | 'REJECT', comment?: string) => {
    try {
      const response = await api.post('/moderator/applications', {
        applicationId,
        action,
        comment
      });

      if (response.success) {
        // Обновляем дашборд
        await fetchDashboard();
      }
    } catch (error) {
      console.error('Error processing application:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Ожидает' },
      APPROVED: { color: 'bg-green-100 text-green-800', text: 'Одобрена' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Отклонена' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Всего заявок</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboard?.totalApplications || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ожидают</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboard?.pendingApplications.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Одобрены</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboard?.approvedApplications.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Отклонены</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboard?.rejectedApplications.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Заявки специалистов
            </button>
            <button
              onClick={() => setActiveTab('specialists')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specialists'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Управление специалистами
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Ожидающие заявки */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ожидающие рассмотрения</h3>
                {dashboard?.pendingApplications.length === 0 ? (
                  <p className="text-gray-500">Нет заявок, ожидающих рассмотрения</p>
                ) : (
                  <div className="space-y-4">
                    {dashboard?.pendingApplications.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        onAction={handleApplicationAction}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Обработанные заявки */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Обработанные заявки</h3>
                <div className="space-y-4">
                  {dashboard?.approvedApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onAction={handleApplicationAction}
                      showActions={false}
                    />
                  ))}
                  {dashboard?.rejectedApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onAction={handleApplicationAction}
                      showActions={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specialists' && (
            <ModeratorSpecialists />
          )}
        </div>
      </div>
    </div>
  );
}

interface ApplicationCardProps {
  application: SpecialistApplication;
  onAction: (applicationId: number, action: 'APPROVE' | 'REJECT', comment?: string) => void;
  showActions: boolean;
}

function ApplicationCard({ application, onAction, showActions }: ApplicationCardProps) {
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    setIsProcessing(true);
    await onAction(application.id, action, comment);
    setIsProcessing(false);
    setComment('');
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h4 className="text-lg font-medium text-gray-900">{application.name}</h4>
            {getStatusBadge(application.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Опыт работы</p>
              <p className="text-gray-900">{application.experience}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Почасовая ставка</p>
              <p className="text-gray-900">{application.hourlyRate} ₽/час</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Описание</p>
              <p className="text-gray-900">{application.description}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Категории</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {application.categories.map((category, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {application.moderatorComment && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">Комментарий модератора</p>
              <p className="text-gray-900 bg-yellow-50 p-3 rounded-md">{application.moderatorComment}</p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>Подана: {new Date(application.createdAt).toLocaleDateString('ru-RU')}</p>
            {application.moderator && (
              <p>Обработана модератором: {application.moderator.firstName} {application.moderator.lastName}</p>
            )}
          </div>
        </div>
      </div>

      {showActions && application.status === 'PENDING' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <label htmlFor={`comment-${application.id}`} className="block text-sm font-medium text-gray-700">
                Комментарий (необязательно)
              </label>
              <textarea
                id={`comment-${application.id}`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Добавьте комментарий к решению..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleAction('APPROVE')}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isProcessing ? 'Обработка...' : 'Одобрить'}
              </button>
              <button
                onClick={() => handleAction('REJECT')}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isProcessing ? 'Обработка...' : 'Отклонить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
