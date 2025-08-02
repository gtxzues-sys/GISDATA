import React, { useState } from 'react';
import { Search, RotateCcw, Download } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function SearchForm({ 
  onSearch, 
  onReset, 
  totalCount, 
  filteredCount 
}: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    sign_details: '',
    sign_type: '',
    mutcd_name: '',
    mutcd_code: '',
    legend_color: '',
    background_color: '',
    sign_shape: ''
  });

  const signShapes = [
    'Circle', 'Octagon', 'Triangle', 'Square', 'Rectangle', 
    'Diamond', 'Pentagon', 'Trapezoid', 'Arrow', 'Custom'
  ];

  const colors = [
    'Red', 'Blue', 'Yellow', 'Green', 'Orange', 'White', 
    'Black', 'Brown', 'Purple', 'Pink', 'Gray', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      sign_details: '',
      sign_type: '',
      mutcd_name: '',
      mutcd_code: '',
      legend_color: '',
      background_color: '',
      sign_shape: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Search Signs</h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredCount} of {totalCount} signs
              </p>
            </div>
            <div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sign Details
              </label>
              <input
                type="text"
                name="sign_details"
                value={filters.sign_details}
                onChange={handleInputChange}
                placeholder="Search sign details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sign Type
              </label>
              <input
                type="text"
                name="sign_type"
                value={filters.sign_type}
                onChange={handleInputChange}
                placeholder="Search sign type..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MUTCD Name
              </label>
              <input
                type="text"
                name="mutcd_name"
                value={filters.mutcd_name}
                onChange={handleInputChange}
                placeholder="Search MUTCD name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MUTCD Code
              </label>
              <input
                type="text"
                name="mutcd_code"
                value={filters.mutcd_code}
                onChange={handleInputChange}
                placeholder="Search MUTCD code..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legend Color
              </label>
              <select
                name="legend_color"
                value={filters.legend_color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All legend colors</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <select
                name="background_color"
                value={filters.background_color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All background colors</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sign Shape
              </label>
              <select
                name="sign_shape"
                value={filters.sign_shape}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All shapes</option>
                {signShapes.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}