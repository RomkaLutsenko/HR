'use client';

import { Review, Service } from '@/types/types';
import { api } from '@/utils/api';
import { useEffect, useState } from 'react';

interface ReviewsProps {
  service?: Service;
  onClose?: () => void;
}

export default function Reviews({ service, onClose }: ReviewsProps) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!service) return;
      
      try {
        const reviewsData = await api.getReviews({ 
          serviceId: service.id,
          limit: 10 
        });
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [service]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleSubmitReview = async () => {
    if (!service) return;
    
    try {
      await api.createReview({
        userId: 1, // TODO: получить из контекста пользователя
        serviceId: service.id,
        rating,
        comment
      });
      
      // Перезагружаем отзывы
      const reviewsData = await api.getReviews({ 
        serviceId: service.id,
        limit: 10 
      });
      setReviews(reviewsData);
      
      setShowAddReview(false);
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  // Если это модальное окно (с service и onClose)
  if (service && onClose) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">📝 Отзывы</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Service Info */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{service.image}</div>
              <div>
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{renderStars(service.rating)}</span>
                  <span>•</span>
                  <span>{service.reviewCount} отзывов</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Загрузка отзывов...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Пока нет отзывов</p>
              </div>
            ) : (
              reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="text-sm text-yellow-600 mb-2">{renderStars(review.rating)}</div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* Add Review Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddReview(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Добавить отзыв
            </button>
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Добавить отзыв</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Оценка</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                  placeholder="Поделитесь своим опытом..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddReview(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
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

  // Если это общая страница отзывов (без props)
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">⭐ Отзывы клиентов</h2>
      
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">📊</div>
          <div>
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Средняя оценка</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">95%</div>
            <div className="text-sm text-gray-600">Довольных клиентов</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Выполненных заказов</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Последние отзывы</h3>
        
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                </div>
                <div className="text-sm text-yellow-600 mb-2">{renderStars(review.rating)}</div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <h3 className="font-semibold text-blue-900 mb-2">Оставить отзыв</h3>
        <p className="text-sm text-blue-700 mb-3">
          Поделитесь своим опытом и помогите другим клиентам
        </p>
        <button
          onClick={() => setShowAddReview(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Написать отзыв
        </button>
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Добавить отзыв</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Оценка</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Поделитесь своим опытом..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddReview(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
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