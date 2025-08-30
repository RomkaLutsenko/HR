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

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6 pb-24">
      {/* Табы */}
      <div className="px-6">
        <div className="glass rounded-2xl border border-white/20 shadow-soft">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab('profile');
                vibrate();
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 rounded-l-2xl ${
                activeTab === 'profile'
                  ? 'text-primary-600 bg-white/80 shadow-medium'
                  : 'text-neutral-600 hover:text-primary-500 hover:bg-white/40'
              }`}
            >
              Профиль
            </button>
            <button
              onClick={() => {
                setActiveTab('applications');
                vibrate();
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === 'applications'
                  ? 'text-primary-600 bg-white/80 shadow-medium'
                  : 'text-neutral-600 hover:text-primary-500 hover:bg-white/40'
              }`}
            >
              Заявки
            </button>
            <button
              onClick={() => {
                setActiveTab('services');
                vibrate();
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 rounded-r-2xl ${
                activeTab === 'services'
                  ? 'text-primary-600 bg-white/80 shadow-medium'
                  : 'text-neutral-600 hover:text-primary-500 hover:bg-white/40'
              }`}
            >
              Услуги
            </button>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="px-6 space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="glass rounded-2xl p-6 border border-white/20 shadow-soft">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-800">Основная информация</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Имя и фамилия
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Опыт работы
                  </label>
                  <input
                    type="text"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="Например: 5 лет в сфере IT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="Расскажите о себе и ваших навыках"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Почасовая ставка (₽)
                  </label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                          className="rounded border-white/20 text-primary-600 focus:ring-primary-500 bg-white/50"
                        />
                        <span className="text-sm text-neutral-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.isAvailable}
                    onChange={(e) => setProfile({ ...profile, isAvailable: e.target.checked })}
                    className="rounded border-white/20 text-primary-600 focus:ring-primary-500 bg-white/50"
                  />
                  <span className="text-sm text-neutral-700">Доступен для заказов</span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleProfileSave();
                  vibrate();
                }}
                className="w-full mt-6 bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-700 transition-all duration-300 shadow-medium hover:shadow-large hover-lift"
              >
                Сохранить профиль
              </button>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Форма подачи заявки */}
            <div className="glass rounded-2xl p-6 border border-white/20 shadow-soft">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">📝</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-800">Подать заявку на услугу</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={application.categoryId}
                    onChange={(e) => setApplication({ ...application, categoryId: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Название услуги
                  </label>
                  <input
                    type="text"
                    value={application.title}
                    onChange={(e) => setApplication({ ...application, title: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="Введите название услуги"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Описание услуги
                  </label>
                  <textarea
                    value={application.description}
                    onChange={(e) => setApplication({ ...application, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="Подробно опишите услугу"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Цена (₽)
                    </label>
                    <input
                      type="number"
                      value={application.price}
                      onChange={(e) => setApplication({ ...application, price: e.target.value })}
                      className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Длительность (мин)
                    </label>
                    <input
                      type="number"
                      value={application.duration}
                      onChange={(e) => setApplication({ ...application, duration: e.target.value })}
                      className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleApplicationSubmit();
                  vibrate();
                }}
                className="w-full mt-6 bg-gradient-to-r from-accent-500 to-accent-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-medium hover:shadow-large hover-lift"
              >
                Отправить заявку
              </button>
            </div>

            {/* Статистика */}
            <div className="glass rounded-2xl p-6 border border-white/20 shadow-soft">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-800">Статистика</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 glass border border-white/20 rounded-xl hover-lift transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600">0</div>
                  <div className="text-sm text-neutral-600">Активных заказов</div>
                </div>
                
                <div className="text-center p-4 glass border border-white/20 rounded-xl hover-lift transition-all duration-300">
                  <div className="text-2xl font-bold text-secondary-600">0</div>
                  <div className="text-sm text-neutral-600">Выполнено</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Список услуг */}
            <div className="glass rounded-2xl p-6 border border-white/20 shadow-soft">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">🛠️</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-800">Мои услуги</h3>
              </div>
              
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-neutral-600 mb-2">У вас пока нет услуг</p>
                  <p className="text-neutral-500 text-sm">Создайте свою первую услугу во вкладке "Заявки"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service: SpecialistService) => (
                    <div key={service.id} className="glass border border-white/20 rounded-xl p-4 hover-lift transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-neutral-800">{service.name}</h4>
                        <span className="text-primary-600 font-semibold">₽{service.price}</span>
                      </div>
                      <p className="text-neutral-600 text-sm mb-2">{service.description}</p>
                      <div className="flex justify-between items-center text-xs text-neutral-500">
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
