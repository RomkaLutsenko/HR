import { memo } from 'react';
import ClearButton from './ClearButton';
import LoadingSpinner from './LoadingSpinner';
import SearchIcon from './SearchIcon';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  isSearching: boolean;
}

const SearchInput = memo(({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  isSearching
}: SearchInputProps) => (
  <div className="flex items-center px-4 py-3">
    <SearchIcon />
    
    <input
      type="text"
      className="flex-1 bg-transparent text-neutral-800 placeholder-neutral-500 text-base font-medium focus:outline-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
    
    {isSearching && <LoadingSpinner />}
    
    {value && (
      <ClearButton 
        onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)} 
      />
    )}
  </div>
));

SearchInput.displayName = 'SearchInput';

export default SearchInput;
