'use client';

import { ServiceCategory } from '@/types/types';
import { useEffect, useState } from 'react';

interface SpecialistProfile {
  name: string;
  experience: string;
  description: string;
  hourlyRate: number;
  categories: string[];
  isAvailable: boolean;
}

interface SpecialistService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category?: {
    name: string;
  };
}

export default function SpecialistDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'services'>('profile');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<SpecialistProfile>({
    name: '',
    experience: '',
    description: '',
    hourlyRate: 0,
    categories: [],
    isAvailable: true,
  });

  const [application, setApplication] = useState({
    categoryId: '',
    title: '',
    description: '',
    price: '',
    duration: '',
  });

  const [services, setServices] = useState<SpecialistService[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProfile();
    fetchServices();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/specialist/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.specialist) {
          setProfile({
            name: data.specialist.name || '',
            experience: data.specialist.experience || '',
            description: data.specialist.description || '',
            hourlyRate: data.specialist.hourlyRate || 0,
            categories: data.specialist.categories || [],
            isAvailable: data.specialist.isAvailable,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/specialist/applications');
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const response = await fetch('/api/specialist/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        alert('Профиль успешно сохранен!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Ошибка при сохранении профиля');
    }
  };

  const handleApplicationSubmit = async () => {
    try {
      const response = await fetch('/api/specialist/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });

      if (response.ok) {
        setApplication({
          categoryId: '',
          title: '',
          description: '',
          price: '',
          duration: '',
        });
        fetchServices(); // Обновляем список услуг
        alert('Заявка успешно отправлена!');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Ошибка при отправке заявки');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">

      {/* Табы */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'applications'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Заявки
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'services'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Услуги
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="p-4 pb-24">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя и фамилия
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опыт работы
                  </label>
                  <input
                    type="text"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Например: 5 лет в сфере IT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Расскажите о себе и ваших навыках"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Почасовая ставка (₽)
                  </label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категории услуг
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={profile.categories.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfile({
                                ...profile,
                                categories: [...profile.categories, category.name],
                              });
                            } else {
                              setProfile({
                                ...profile,
                                categories: profile.categories.filter((c) => c !== category.name),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.isAvailable}
                    onChange={(e) => setProfile({ ...profile, isAvailable: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Доступен для заказов</span>
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                className="w-full mt-6 bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-700 transition-all duration-300"
              >
                Сохранить профиль
              </button>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Форма подачи заявки */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Подать заявку на услугу</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={application.categoryId}
                    onChange={(e) => setApplication({ ...application, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название услуги
                  </label>
                  <input
                    type="text"
                    value={application.title}
                    onChange={(e) => setApplication({ ...application, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Введите название услуги"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание услуги
                  </label>
                  <textarea
                    value={application.description}
                    onChange={(e) => setApplication({ ...application, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Подробно опишите услугу"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цена (₽)
                    </label>
                    <input
                      type="number"
                      value={application.price}
                      onChange={(e) => setApplication({ ...application, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Длительность (мин)
                    </label>
                    <input
                      type="number"
                      value={application.duration}
                      onChange={(e) => setApplication({ ...application, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplicationSubmit}
                className="w-full mt-6 bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-700 transition-all duration-300"
              >
                Отправить заявку
              </button>
            </div>

            {/* Статистика */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600">0</div>
                  <div className="text-sm text-gray-600">Активных заказов</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl">
                  <div className="text-2xl font-bold text-secondary-600">0</div>
                  <div className="text-sm text-gray-600">Выполнено</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Список услуг */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Мои услуги</h3>
              
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-600 mb-2">У вас пока нет услуг</p>
                  <p className="text-gray-500 text-sm">Создайте свою первую услугу во вкладке &quot;Заявки&quot;</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service: SpecialistService) => (
                    <div key={service.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <span className="text-primary-600 font-semibold">₽{service.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Длительность: {service.duration} мин</span>
                        <span>Категория: {service.category?.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
