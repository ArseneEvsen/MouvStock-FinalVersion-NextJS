"use client";

import * as React from "react";

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  { value: "weekly", label: "Semaine" },
  { value: "annual", label: "Année" },
];

interface ComboBoxPeriodProps {
  onSelectPeriod: (period: string) => void;
}

export function MenuPeriod({ onSelectPeriod }: ComboBoxPeriodProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<Status>(statuses[0]); // Default to "weekly"
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    onSelectPeriod(selectedStatus.value);
  }, [selectedStatus, onSelectPeriod]);

  const handleSelect = (status: Status) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedStatus.label}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleSelect(status)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                role="menuitem"
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
