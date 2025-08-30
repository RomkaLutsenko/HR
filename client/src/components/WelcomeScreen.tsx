'use client';

export const WelcomeScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-200 to-primary-200 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-secondary-200 to-accent-200 rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10 text-center max-w-md">
        {/* Логотип */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-bounce-soft">
            <span className="text-white text-4xl">💼</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">ServiceHub</h1>
          <p className="text-lg text-neutral-600 font-medium">Профессиональные услуги</p>
        </div>

        {/* Сообщение */}
        <div className="glass rounded-3xl p-8 mb-8 border border-white/20 shadow-large">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white text-2xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Добро пожаловать!</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            Это приложение работает только внутри Telegram. Пожалуйста, откройте его через Telegram WebApp для полного доступа к функциям.
          </p>
          
          {/* Преимущества */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-sm text-neutral-600">Безопасная авторизация</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span className="text-sm text-neutral-600">Удобный интерфейс</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-sm">✓</span>
              </div>
              <span className="text-sm text-neutral-600">Быстрые заказы</span>
            </div>
          </div>
        </div>

        {/* Кнопка действия */}
        <a
          href="https://t.me/hr_best_ru_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-soft hover:shadow-medium hover-lift group"
        >
          <span className="text-xl">🚀</span>
          <span>Открыть Telegram-бота</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500 mb-2">Нужна помощь?</p>
          <a 
            href="mailto:support@servicehub.com" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Связаться с поддержкой
          </a>
        </div>
      </div>

      {/* Анимированные частицы */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-secondary-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-accent-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
};
