import React from 'react';
import { Database, Search, Upload } from 'lucide-react';

interface HeaderProps {
  activeTab: 'upload' | 'search';
  onTabChange: (tab: 'upload' | 'search') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sign Database</h1>
              <p className="text-sm text-gray-500">Photo Management System</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => onTabChange('search')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}