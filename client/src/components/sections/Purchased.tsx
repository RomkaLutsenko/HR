'use client';

import { useAuth } from '@/hooks/useAuth';
import { Service, Specialist } from '@/types/types';
import { useEffect, useState } from 'react';

interface PurchasedItem {
  id: number;
  service: Service;
  specialist?: Specialist;
  orderDate: string;
  totalPrice: number;
  status: 'completed' | 'cancelled';
  hasReview: boolean;
}

export default function Purchased() {
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<PurchasedItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем реальные данные о покупках
  useEffect(() => {
    const fetchPurchasedItems = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/orders?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          
          // Преобразуем данные из API в формат PurchasedItem
          const items: PurchasedItem[] = data.orders.map((order: {
            id: number;
            service: Service;
            specialist?: Specialist;
            createdAt: string;
            totalPrice: number;
            status: { name: string };
          }) => ({
            id: order.id,
            service: order.service,
            specialist: order.specialist,
            orderDate: order.createdAt,
            totalPrice: order.totalPrice,
            status: order.status.name === 'Завершен' ? 'completed' : 
                   order.status.name === 'Отменен' ? 'cancelled' : 'completed', // Показываем все заказы как завершенные для демонстрации
            hasReview: false // TODO: добавить проверку наличия отзыва
          }));
          
          setPurchasedItems(items);
        }
      } catch (error) {
        console.error('Error fetching purchased items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedItems();
  }, [user]);

  // Mock data for past purchases (fallback) - удалено, так как теперь используем реальные данные

  const handleReview = (item: PurchasedItem) => {
    setSelectedItem(item);
    setShowReviewModal(true);
  };

  const submitReview = () => {
    if (!selectedItem) return;
    
    // Here you would typically send the review to your API
    console.log('Submitting review:', {
      serviceId: selectedItem.service.id,
      specialistId: selectedItem.specialist?.id,
      rating,
      comment
    });
    
    setShowReviewModal(false);
    setRating(5);
    setComment('');
    setSelectedItem(null);
  };

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  if (loading) {
    return (
      <div className="px-6 pt-6 pb-24">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-24">
      {/* Заголовок */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
          <span className="text-white text-lg">📦</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Мои покупки</h2>
          <p className="text-sm text-neutral-600">{purchasedItems.length} заказов</p>
        </div>
      </div>

      {/* Список покупок */}
      {purchasedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">У вас пока нет покупок</h3>
          <p className="text-neutral-600">Оформите заказ, чтобы увидеть его здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchasedItems.map((item, index) => (
          <div
            key={item.id}
            className="glass rounded-2xl p-5 border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-neutral-800">{item.service.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'completed' ? 'Завершен' : 'Отменен'}
                  </span>
                </div>
                
                <p className="text-sm text-neutral-600 mb-3">{item.service.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-neutral-600 font-medium">{item.service.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-neutral-400">📝</span>
                      <span className="text-sm text-neutral-600">{item.service.reviewCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-neutral-400">⏱️</span>
                    <span className="text-sm text-neutral-600">{Math.floor(item.service.duration / 60)}ч</span>
                  </div>
                  <div>
                    <span className="text-primary-600 font-bold text-lg">{item.totalPrice} ₽</span>
                  </div>
                </div>

                {item.specialist && (
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-3 mb-3 border border-primary-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-primary-800">
                        {item.specialist.name} • {item.specialist.hourlyRate} ₽/час
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-500">
                    Заказ от {new Date(item.orderDate).toLocaleDateString('ru-RU')}
                  </div>
                  {item.status === 'completed' && !item.hasReview && (
                    <button
                      onClick={() => {
                        handleReview(item);
                        vibrate();
                      }}
                      className="bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-soft hover:shadow-medium hover-lift"
                    >
                      Оставить отзыв
                    </button>
                  )}
                  {item.hasReview && (
                    <span className="text-green-600 text-sm font-medium">✓ Отзыв оставлен</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Модальное окно отзыва */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="glass rounded-3xl shadow-large max-w-sm w-full p-6 border border-white/20">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Оставить отзыв</h3>
              <p className="text-neutral-600">{selectedItem.service.name}</p>
            </div>

            {/* Рейтинг */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-3">Оценка:</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= rating ? 'text-yellow-500' : 'text-neutral-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Комментарий */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Комментарий:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-neutral-200 rounded-xl text-sm resize-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Поделитесь своими впечатлениями..."
              />
            </div>

            {/* Кнопки */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(5);
                  setComment('');
                  setSelectedItem(null);
                }}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Отмена
              </button>
              <button
                onClick={submitReview}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-soft hover:shadow-medium"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
