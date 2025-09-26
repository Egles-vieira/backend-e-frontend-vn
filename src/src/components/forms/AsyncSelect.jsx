// src/components/forms/AsyncSelect.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const AsyncSelect = ({
  label,
  name,
  value,
  onChange,
  onSearch,
  options = [],
  loading = false,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Digite para buscar...',
  required = false,
  error = null,
  disabled = false,
  multiple = false,
  displayKey = 'nome',
  valueKey = 'id',
  minSearchLength = 2,
  debounceMs = 300
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= minSearchLength) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, minSearchLength, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const getSelectedOption = () => {
    if (multiple) {
      return options.filter(option => value?.includes(option[valueKey]));
    }
    return options.find(option => option[valueKey] === value);
  };

  const handleSelect = (option) => {
    if (multiple) {
      const currentValues = value || [];
      const optionValue = option[valueKey];
      
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      onChange(option[valueKey]);
      setIsOpen(false);
    }
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    if (multiple) {
      onChange((value || []).filter(v => v !== optionValue));
    } else {
      onChange(null);
    }
  };

  const renderSelectedValue = () => {
    const selected = getSelectedOption();
    
    if (multiple) {
      if (!selected || selected.length === 0) {
        return <span className="text-gray-500">{placeholder}</span>;
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <span
              key={option[valueKey]}
              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#e8f5ef] text-[#045c53] rounded-md"
            >
              {option[displayKey]}
              <button
                onClick={(e) => handleRemove(option[valueKey], e)}
                className="ml-1 text-[#045c53] hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      );
    }
    
    return selected ? selected[displayKey] : <span className="text-gray-500">{placeholder}</span>;
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        {/* Select Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left border rounded-lg focus:ring-2 focus:ring-[#045c53] focus:border-transparent transition-colors
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {renderSelectedValue()}
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#045c53] focus:border-transparent"
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4">
                  <LoadingSpinner size="sm" text="Buscando..." />
                </div>
              ) : options.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {searchTerm.length >= minSearchLength 
                    ? 'Nenhum resultado encontrado' 
                    : `Digite pelo menos ${minSearchLength} caracteres para buscar`
                  }
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = multiple 
                    ? value?.includes(option[valueKey])
                    : value === option[valueKey];
                    
                  return (
                    <button
                      key={option[valueKey]}
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors
                        ${isSelected ? 'bg-[#e8f5ef] text-[#045c53] font-medium' : 'text-gray-900'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option[displayKey]}</span>
                        {isSelected && multiple && (
                          <X className="h-4 w-4 text-[#045c53]" />
                        )}
                      </div>
                      {option.subtitle && (
                        <div className="text-xs text-gray-500 mt-1">
                          {option.subtitle}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error.message || error}</p>
      )}
    </div>
  );
};

export default AsyncSelect;