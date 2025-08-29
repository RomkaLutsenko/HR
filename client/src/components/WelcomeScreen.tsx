'use client';

export const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">👋 Добро пожаловать!</h1>
      <p className="text-lg mb-6 max-w-md">
        Это приложение работает только внутри Telegram. Пожалуйста, откройте его через Telegram WebApp.
      </p>
      <a
        href="https://t.me/hr_best_ru_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
      >
        🚀 Открыть Telegram-бота
      </a>
    </div>
  );
};
