import { memo } from 'react';

const QuickFilters = memo(() => (
  <div className="mt-3 flex flex-wrap gap-2">
    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
      Все услуги
    </span>
    <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
      По цене
    </span>
    <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-medium">
      По рейтингу
    </span>
  </div>
));

QuickFilters.displayName = 'QuickFilters';

export default QuickFilters;
