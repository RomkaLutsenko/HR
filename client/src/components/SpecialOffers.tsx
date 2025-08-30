import { setActiveSection } from '@/store/slices/uiSlice';
import { useDispatch } from 'react-redux';

export default function SpecialOffers() {
  const dispatch = useDispatch()

  const handleOffers = () => {
    dispatch(setActiveSection("offers"))
  }

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="px-6">
      <div 
        className="relative overflow-hidden glass rounded-2xl border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover-lift group"
        onClick={() => {
          handleOffers();
          vibrate();
        }}
      >
        {/* Фоновый градиент */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 opacity-90"></div>
        
        {/* Декоративные элементы */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        
        {/* Основной контент */}
        <div className="relative p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Акции и скидки</h3>
                <p className="text-sm opacity-90">Специальные предложения</p>
              </div>
            </div>
            
            {/* Стрелка */}
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* Дополнительная информация */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-300">🔥</span>
                <span className="text-sm font-medium">До -50%</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-300">⚡</span>
                <span className="text-sm font-medium">Ограничено</span>
              </div>
            </div>
            
            {/* Счетчик */}
            <div className="text-right">
              <div className="text-xs opacity-75">Осталось</div>
              <div className="text-lg font-bold">2 дня</div>
            </div>
          </div>
        </div>
        
        {/* Анимированные частицы */}
        {/* <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-8 left-6 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div> */}
      </div>
    </div>
  );
}