import { useAuth } from '@/hooks/useAuth';
import { setActiveSection, setCurrentCategory } from '@/store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { getPopularServices, serviceCategories } from '../../utils/data/services';
import SearchBar from '../SearchBar';
import SpecialOffers from '../SpecialOffers';

export default function MainMenu() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const popularServices = getPopularServices();

  const handleShowCategory = (category: string) => {
    dispatch(setCurrentCategory(category));
  };

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      <SearchBar />
      <SpecialOffers />
      
      {/* Популярные услуги */}
      <div className="px-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">🔥 Популярные услуги</h2>
        <div className="space-y-3">
          {popularServices.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                dispatch(setCurrentCategory(service.category));
                vibrate();
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{service.image}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description.substring(0, 50)}...</p>
                  <div className="flex items-center mt-1">
                    <span className="text-blue-600 font-semibold">{service.price} ₽</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-sm text-gray-500">{Math.floor(service.duration / 60)}ч</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-sm text-gray-500">⭐ {service.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Категории услуг */}
      <div className="px-5 mb-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">📂 Категории услуг</h2>
        <div className="grid grid-cols-2 gap-4">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                handleShowCategory(category.name);
                vibrate();
              }}
            >
              <span className="text-3xl block mb-2">{category.icon}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-600 leading-tight">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Админ-панель для администраторов */}
      {user?.isAdmin && (
        <div className="px-5 mb-5">
          <button
            onClick={() => {
              dispatch(setActiveSection('adminPanel'));
              vibrate();
            }}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition-colors"
          >
            ⚙️ Админ-панель
          </button>
        </div>
      )}
    </>
  );
}