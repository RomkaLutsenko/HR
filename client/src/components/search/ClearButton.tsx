import { memo } from 'react';

interface ClearButtonProps {
  onClick: () => void;
}

const ClearButton = memo(({ onClick }: ClearButtonProps) => (
  <button
    onClick={onClick}
    className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
  >
    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
));

ClearButton.displayName = 'ClearButton';

export default ClearButton;
