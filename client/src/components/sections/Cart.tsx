'use client';

import { useAuth } from '@/hooks/useAuth';
import {
    addToCart,
    clearCart,
    decreaseQuantity,
    removeFromCart,
    updateItemDate,
    updateItemNotes,
} from '@/store/slices/cartSlice';
import { RootState } from '@/store/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.service.price, 0);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
  };

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">💼</div>
        <div className="text-gray-500 text-lg mb-2">Корзина пуста</div>
        <div className="text-gray-400 text-sm">Выберите услуги для заказа</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">💼 Корзина заказов</h2>

        {items.map((item) => (
          <div
            key={`${item.service.id}-${item.specialist?.id || 'no-specialist'}`}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className="text-2xl">{item.service.image}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">{item.service.name}</div>
                <div className="text-sm text-gray-600 mb-2">{item.service.description}</div>
                
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-blue-600 font-bold">{item.service.price} ₽</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">⏱️ {formatDuration(item.service.duration)}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">⭐ {item.service.rating}</span>
                </div>

                {item.specialist && (
                  <div className="bg-blue-50 rounded-lg p-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.specialist.avatar}</span>
                      <div>
                        <div className="text-sm font-medium text-blue-900">{item.specialist.name}</div>
                        <div className="text-xs text-blue-700">{item.specialist.hourlyRate} ₽/час</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Заметки */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Заметки к заказу:
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                    placeholder="Дополнительные пожелания..."
                    value={item.notes || ''}
                    onChange={(e) => dispatch(updateItemNotes({
                      serviceId: item.service.id,
                      specialistId: item.specialist?.id,
                      notes: e.target.value
                    }))}
                  />
                </div>

                {/* Дата заказа */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Желаемая дата:
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={item.scheduledDate || ''}
                    onChange={(e) => dispatch(updateItemDate({
                      serviceId: item.service.id,
                      specialistId: item.specialist?.id,
                      scheduledDate: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  onClick={() => dispatch(decreaseQuantity({
                    serviceId: item.service.id,
                    specialistId: item.specialist?.id
                  }))}
                >
                  −
                </button>
                <span className="text-base font-medium">{item.quantity}</span>
                <button
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  onClick={() => dispatch(addToCart({
                    service: item.service,
                    specialist: item.specialist,
                    notes: item.notes,
                    scheduledDate: item.scheduledDate
                  }))}
                >
                  +
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {item.service.price * item.quantity} ₽
                </span>
                <button
                  className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  onClick={() => dispatch(removeFromCart({
                    serviceId: item.service.id,
                    specialistId: item.specialist?.id
                  }))}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between font-bold text-lg mb-2">
            <span>Итого:</span>
            <span className="text-blue-600">{totalPrice} ₽</span>
          </div>
          <div className="text-sm text-gray-500 text-right">{totalCount} услуг</div>
        </div>

        <div className="space-y-2">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            onClick={() => setShowModal(true)}
          >
            Оформить заказ
          </button>
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors"
            onClick={() => dispatch(clearCart())}
          >
            Очистить корзину
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center animate-fade-in">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Заказ принят</h3>
            <p className="mb-2 text-gray-700">Ваш заказ передан менеджеру.</p>
            <p className="mb-2 text-gray-700">Номер: {user?.phoneNumber}</p>
            <p className="mb-2 text-gray-700">ID: {user?.telegramId}</p>
            <p className="text-sm text-gray-500 mb-4">Время: {formatTime()}</p>
            
            <div className="text-left text-sm max-h-48 overflow-y-auto border-t pt-3 space-y-2">
              {items.map((item) => (
                <div key={`${item.service.id}-${item.specialist?.id || 'no-specialist'}`} className="border-b pb-2">
                  <div className="flex justify-between font-medium">
                    <span>{item.service.name}</span>
                    <span>{item.service.price * item.quantity} ₽</span>
                  </div>
                  {item.specialist && (
                    <div className="text-xs text-gray-600">Специалист: {item.specialist.name}</div>
                  )}
                  {item.scheduledDate && (
                    <div className="text-xs text-gray-600">Дата: {item.scheduledDate}</div>
                  )}
                  {item.notes && (
                    <div className="text-xs text-gray-600">Заметки: {item.notes}</div>
                  )}
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Итого</span>
                <span className="text-blue-600">{totalPrice} ₽</span>
              </div>
            </div>
            
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={() => {
                setShowModal(false);
                dispatch(clearCart());
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
