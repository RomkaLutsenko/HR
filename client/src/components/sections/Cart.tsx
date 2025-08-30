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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft">
          <span className="text-4xl">🛒</span>
        </div>
        <h3 className="text-xl font-bold text-neutral-800 mb-2">Корзина пуста</h3>
        <p className="text-neutral-600 mb-6">Выберите услуги для заказа</p>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6 pb-24">
        {/* Заголовок */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-white text-lg">🛒</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Корзина заказов</h2>
            <p className="text-sm text-neutral-600">{totalCount} услуг на сумму {totalPrice} ₽</p>
          </div>
        </div>

        {/* Список товаров */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={`${item.service.id}-${item.specialist?.id || 'no-specialist'}`}
              className="glass rounded-2xl p-5 border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white text-xl">{item.service.image}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-800 text-lg mb-1">{item.service.name}</h3>
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{item.service.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-primary-600 font-bold text-lg">{item.service.price} ₽</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-neutral-400">⏱️</span>
                      <span className="text-sm text-neutral-500">{formatDuration(item.service.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-neutral-500 font-medium">{item.service.rating}</span>
                    </div>
                  </div>

                  {item.specialist && (
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-3 mb-3 border border-primary-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">{item.specialist.avatar}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-primary-800">{item.specialist.name}</div>
                          <div className="text-xs text-primary-600">{item.specialist.hourlyRate} ₽/час</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Заметки */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Заметки к заказу:
                    </label>
                    <textarea
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm resize-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Желаемая дата:
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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

              {/* Управление количеством */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      dispatch(decreaseQuantity({
                        serviceId: item.service.id,
                        specialistId: item.specialist?.id
                      }));
                      vibrate();
                    }}
                  >
                    <span className="text-lg font-bold text-neutral-600">−</span>
                  </button>
                  <span className="text-lg font-bold text-neutral-800 min-w-[2rem] text-center">{item.quantity}</span>
                  <button
                    className="w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      dispatch(addToCart({
                        service: item.service,
                        specialist: item.specialist,
                        notes: item.notes,
                        scheduledDate: item.scheduledDate
                      }));
                      vibrate();
                    }}
                  >
                    <span className="text-lg font-bold text-primary-600">+</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-neutral-800">
                    {item.service.price * item.quantity} ₽
                  </span>
                  <button
                    className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      dispatch(removeFromCart({
                        serviceId: item.service.id,
                        specialistId: item.specialist?.id
                      }));
                      vibrate();
                    }}
                  >
                    <span className="text-red-600 font-bold">✕</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Итого */}
        <div className="glass rounded-2xl p-6 border border-white/20 shadow-soft">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-neutral-800">Итого:</span>
            <span className="text-2xl font-bold text-primary-600">{totalPrice} ₽</span>
          </div>
          <div className="text-sm text-neutral-600 text-right">{totalCount} услуг</div>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3">
          <button
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            onClick={async () => {
              if (!user) {
                alert('Необходимо войти в систему');
                return;
              }
              
              if (items.length === 0) {
                alert('Корзина пуста');
                return;
              }
              
              setIsProcessing(true);
              try {
                // Создаем заказы для каждого товара в корзине
                for (const item of items) {
                  const orderData = {
                    userId: user.id,
                    serviceId: item.service.id,
                    specialistId: item.specialist?.id || null,
                    totalPrice: item.service.price * item.quantity,
                    scheduledDate: item.scheduledDate || null,
                    notes: item.notes || null
                  };

                  const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                  });

                  if (!response.ok) {
                    throw new Error('Ошибка при создании заказа');
                  }
                }

                setShowModal(true);
                vibrate();
              } catch (error) {
                console.error('Error creating order:', error);
                if (error instanceof Error) {
                  alert(`Ошибка при оформлении заказа: ${error.message}`);
                } else {
                  alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
                }
              } finally {
                setIsProcessing(false);
              }
            }}
            disabled={isProcessing}
          >
            <div className="flex items-center justify-center space-x-2">
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Обработка...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">✅</span>
                  <span>Оформить заказ</span>
                </>
              )}
            </div>
          </button>
          <button
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-2xl font-medium transition-all duration-300 hover-lift"
            onClick={() => {
              dispatch(clearCart());
              vibrate();
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🗑️</span>
              <span>Очистить корзину</span>
            </div>
          </button>
        </div>
      </div>

      {/* Модальное окно подтверждения */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="glass rounded-3xl shadow-large max-w-sm w-full p-6 text-center animate-scale-in border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <span className="text-white text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-neutral-800">Заказ принят</h3>
            <p className="mb-2 text-neutral-600">Ваш заказ передан менеджеру.</p>
            <p className="mb-2 text-neutral-600">Номер: {user?.phoneNumber}</p>
            <p className="mb-2 text-neutral-600">ID: {user?.telegramId}</p>
            <p className="text-sm text-neutral-500 mb-4">Время: {formatTime()}</p>
            
            <div className="text-left text-sm max-h-48 overflow-y-auto border-t border-white/20 pt-3 space-y-2">
              {items.map((item) => (
                <div key={`${item.service.id}-${item.specialist?.id || 'no-specialist'}`} className="border-b border-white/10 pb-2">
                  <div className="flex justify-between font-medium">
                    <span>{item.service.name}</span>
                    <span>{item.service.price * item.quantity} ₽</span>
                  </div>
                  {item.specialist && (
                    <div className="text-xs text-neutral-500">Специалист: {item.specialist.name}</div>
                  )}
                  {item.scheduledDate && (
                    <div className="text-xs text-neutral-500">Дата: {item.scheduledDate}</div>
                  )}
                  {item.notes && (
                    <div className="text-xs text-neutral-500">Заметки: {item.notes}</div>
                  )}
                </div>
              ))}
              <div className="flex justify-between font-bold border-t border-white/20 pt-2">
                <span>Итого</span>
                <span className="text-primary-600">{totalPrice} ₽</span>
              </div>
            </div>
            
            <button
              className="mt-6 bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-soft hover:shadow-medium hover-lift"
              onClick={() => {
                setShowModal(false);
                dispatch(clearCart());
                vibrate();
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
