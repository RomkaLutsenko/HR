import { setActiveSection } from '@/store/slices/uiSlice';
import { useDispatch } from 'react-redux';

export default function SpecialOffers() {
  const dispatch = useDispatch()

  const handleOffers = () => {
    dispatch(setActiveSection("offers"))
  }

  return (
    <div 
      className="mx-5 p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl text-white text-center mb-5"
      onClick={handleOffers}
    >
      <h3 className="text-lg font-semibold mb-2">🎯 Акции и скидки</h3>
      <p className="text-sm opacity-90">Специальные предложения для наших клиентов</p>
    </div>
  );
}