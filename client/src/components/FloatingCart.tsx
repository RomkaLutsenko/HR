interface FloatingCartProps {
  showCart: () => void;
}

export default function FloatingCart({ showCart }: FloatingCartProps) {
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div
      className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 hover:shadow-xl transition-all cursor-pointer"
      onClick={() => {
        showCart();
        vibrate();
      }}
    >
      🛒
      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        3
      </div>
    </div>
  );
}