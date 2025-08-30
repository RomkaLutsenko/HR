import { memo } from 'react';

const LoadingSpinner = memo(() => (
  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
