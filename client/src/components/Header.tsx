import Cart from './Cart';

export default function Header() {
    return (
    <div className="bg-white border-b border-gray-200 text-gray-900 py-2 px-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">💼 ServiceHub</h1>
        <p className="text-sm text-gray-600">Профессиональные услуги для вашего бизнеса</p>
      </div>
      <Cart />
    </div>
  );
}