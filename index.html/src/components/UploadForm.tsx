import React, { useState, useRef } from 'react';
import { Upload, X, Image, Check, AlertCircle, Lock } from 'lucide-react';
import { SignData } from '../types';
import { convertToBase64, validateImageFile } from '../utils/fileUtils';
import PasswordModal from './PasswordModal';

interface UploadFormProps {
  onUpload: (data: Omit<SignData, 'id' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
}

export default function UploadForm({ onUpload }: UploadFormProps) {
  const [formData, setFormData] = useState({
    sign_details: '',
    sign_type: '',
    mutcd_name: '',
    mutcd_code: '',
    legend_color: '',
    background_color: '',
    sign_shape: ''
  });
  
  const [photo, setPhoto] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (file: File) => {
    try {
      validateImageFile(file);
      const base64 = await convertToBase64(file);
      setPhoto(base64);
      setMessage(null);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthorized) {
      setShowPasswordModal(true);
      return;
    }
    
    if (!photo) {
      setMessage({ type: 'error', text: 'Please upload a photo' });
      return;
    }

    setIsSubmitting(true);
    try {
      const signData = {
        photo,
        ...formData,
        upload_date: new Date().toISOString()
      };
      
      const result = await onUpload(signData);
      
      if (result.success) {
        // Reset form
        setFormData({
          sign_details: '',
          sign_type: '',
          mutcd_name: '',
          mutcd_code: '',
          legend_color: '',
          background_color: '',
          sign_shape: ''
        });
        setPhoto('');
        setMessage({ type: 'success', text: 'Sign uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Error uploading sign' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading sign' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAuthorized(true);
    setShowPasswordModal(false);
    setMessage({ type: 'success', text: 'Authorization successful! You can now upload signs.' });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload New Sign</h2>
            {!isAuthorized && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Authorization Required</span>
              </div>
            )}
          </div>
          
          {message && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sign Photo
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragOver
                    ? 'border-blue-400 bg-blue-50'
                    : photo
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
              >
                {photo ? (
                  <div className="relative">
                    <img
                      src={photo}
                      alt="Uploaded sign"
                      className="max-h-64 mx-auto rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your sign photo here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPEG, PNG, GIF, WebP (max 10MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sign Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sign Details
                </label>
                <input
                  type="text"
                  name="sign_details"
                  value={formData.sign_details}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sign details"
                  required
                />
              </div>

              {/* Sign Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sign Type
                </label>
                <input
                  type="text"
                  name="sign_type"
                  value={formData.sign_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Warning, Regulatory, Guide"
                  required
                />
              </div>

              {/* MUTCD Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MUTCD Name
                </label>
                <input
                  type="text"
                  name="mutcd_name"
                  value={formData.mutcd_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MUTCD designation name"
                  required
                />
              </div>

              {/* MUTCD Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MUTCD Code
                </label>
                <input
                  type="text"
                  name="mutcd_code"
                  value={formData.mutcd_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., W1-1, R1-1"
                  required
                />
              </div>

              {/* Legend Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legend Color
                </label>
                <select
                  name="legend_color"
                  value={formData.legend_color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select legend color</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <select
                  name="background_color"
                  value={formData.background_color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select background color</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Sign Shape */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sign Shape
                </label>
                <select
                  name="sign_shape"
                  value={formData.sign_shape}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select sign shape</option>
                  {signShapes.map(shape => (
                    <option key={shape} value={shape}>{shape}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-6 py-3 font-medium rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  isAuthorized 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
                    : 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500'
                }`}
              >
                {isAuthorized ? (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>{isSubmitting ? 'Uploading...' : 'Upload Sign'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Upload</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />
    </>
  );
}