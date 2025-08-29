'use client';

import { Review, Service } from '@/types/types';
import { useState } from 'react';

interface ReviewsProps {
  service: Service;
  onClose: () => void;
}

export default function Reviews({ service, onClose }: ReviewsProps) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Моковые отзывы для демонстрации
  const reviews: Review[] = [
    {
      id: 1,
      userId: 1,
      serviceId: service.id,
      rating: 5,
      comment: "Отличный сервис! Специалист пришел вовремя, работа выполнена качественно. Рекомендую!",
      createdAt: "2024-01-15T10:30:00Z",
      userName: "Анна К."
    },
    {
      id: 2,
      userId: 2,
      serviceId: service.id,
      rating: 4,
      comment: "Хорошая работа, но немного задержались с началом. В целом доволен результатом.",
      createdAt: "2024-01-14T15:45:00Z",
      userName: "Михаил С."
    },
    {
      id: 3,
      userId: 3,
      serviceId: service.id,
      rating: 5,
      comment: "Профессиональный подход, аккуратная работа. Буду обращаться еще!",
      createdAt: "2024-01-13T09:20:00Z",
      userName: "Елена В."
    }
  ];

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

  const handleSubmitReview = () => {
    // Здесь будет логика отправки отзыва
    console.log('Отзыв:', { rating, comment });
    setShowAddReview(false);
    setRating(5);
    setComment('');
  };

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
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                  {review.userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{review.userName}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="text-sm text-yellow-500 mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowAddReview(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Написать отзыв
          </button>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Написать отзыв</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Оценка:
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
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
    </div>
  );
}