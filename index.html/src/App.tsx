import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import SearchForm from './components/SearchForm';
import PhotoGallery from './components/PhotoGallery';
import { SignData, SearchFilters } from './types';
import { useSigns } from './hooks/useSigns';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'search'>('upload');
  const { signs, loading, error, addSign } = useSigns();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    sign_details: '',
    sign_type: '',
    mutcd_name: '',
    mutcd_code: '',
    legend_color: '',
    background_color: '',
    sign_shape: ''
  });

  const handleUpload = async (signData: Omit<SignData, 'id' | 'created_at'>) => {
    return await addSign(signData);
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleReset = () => {
    setSearchFilters({
      sign_details: '',
      sign_type: '',
      mutcd_name: '',
      mutcd_code: '',
      legend_color: '',
      background_color: '',
      sign_shape: ''
    });
  };

  const filteredSigns = useMemo(() => {
    return signs.filter(sign => {
      return Object.entries(searchFilters).every(([key, value]) => {
        if (!value) return true;
        const signValue = sign[key as keyof SignData]?.toString().toLowerCase() || '';
        return signValue.includes(value.toLowerCase());
      });
    });
  }, [signs, searchFilters]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Database Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please make sure Supabase is properly configured and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="py-6">
        {activeTab === 'upload' ? (
          <UploadForm onUpload={handleUpload} />
        ) : (
          <div className="space-y-6">
            <SearchForm
              onSearch={handleSearch}
              onReset={handleReset}
              totalCount={signs.length}
              filteredCount={filteredSigns.length}
            />
            <PhotoGallery signs={filteredSigns} loading={loading} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;