'use client';

import { SpecialistApplication } from '@/types/types';
import { api } from '@/utils/api';
import { useEffect, useState } from 'react';

export default function SpecialistApplications() {
  const [applications, setApplications] = useState<SpecialistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    experience: '',
    description: '',
    categories: [] as string[],
    hourlyRate: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/specialist/applications');
      if (response.success) {
        setApplications(response.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/specialist/applications', formData);
      if (response.success) {
        setShowForm(false);
        setFormData({
          name: '',
          avatar: '',
          experience: '',
          description: '',
          categories: [],
          hourlyRate: ''
        });
        await fetchApplications();
      }
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Ожидает рассмотрения' },
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

  const addCategory = () => {
    const category = prompt('Введите название категории:');
    if (category && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Мои заявки</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showForm ? 'Отменить' : 'Подать заявку'}
        </button>
      </div>

      {/* Форма подачи заявки */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Новая заявка</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Имя специалиста
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                URL аватара (необязательно)
              </label>
              <input
                type="url"
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Опыт работы
              </label>
              <textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                required
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Опишите ваш опыт работы..."
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание услуг
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Опишите услуги, которые вы предоставляете..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категории услуг
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Добавить категорию
              </button>
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                Почасовая ставка (₽)
              </label>
              <input
                type="number"
                id="hourlyRate"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отправить заявку
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список заявок */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">У вас пока нет заявок</p>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{application.name}</h4>
                  {getStatusBadge(application.status)}
                </div>
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
          ))
        )}
      </div>
    </div>
  );
}
