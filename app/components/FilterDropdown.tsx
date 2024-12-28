'use client';

import React, { useState } from 'react';
import DownIcon from '@/app/assets/svgs/down.svg';

// Define the prop types for the dropdown component
type FilterDropdownProps = {
  options: {
    value: string | number;
    label: string;
    icon?: React.ReactNode; // Optional icon for each option
  }[];
  onSelect: (value: string | number) => void; // Callback for when an option is selected
  placeholder?: string; // Optional placeholder text
  LabelIcon?: React.ReactNode;
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  onSelect,
  placeholder = 'All socials',
  LabelIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(
    null,
  );

  const handleSelect = (value: string | number) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 justify-between w-full px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md shadow-sm
          text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none
          ${isOpen && 'ring-1 ring-primary'}`}
      >
        <span className="flex items-center gap-2">
          {LabelIcon}
          {selectedOption
            ? options.find((option) => option.value === selectedOption)?.icon
            : null}
          {selectedOption
            ? options.find((option) => option.value === selectedOption)?.label
            : placeholder}
        </span>
        <DownIcon className={`${isOpen && 'rotate-180'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute z-10 mt-2 w-fit bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {option.icon && <span>{option.icon}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDropdown;
