import { memo } from 'react';

const SearchIcon = memo(() => (
  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mr-3 shadow-glow">
    <span className="text-white text-lg">🔍</span>
  </div>
));

SearchIcon.displayName = 'SearchIcon';

export default SearchIcon;
