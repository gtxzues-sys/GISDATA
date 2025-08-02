import React from 'react';
import { X, Calendar, Tag, Palette, Shapes } from 'lucide-react';
import { SignData } from '../types';

interface PhotoModalProps {
  sign: SignData;
  onClose: () => void;
}

export default function PhotoModal({ sign, onClose }: PhotoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <img
                src={sign.photo}
                alt={sign.sign_details}
                className="w-full rounded-lg shadow-sm"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sign.sign_details}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Uploaded on {new Date(sign.upload_date).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Tag className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Classification</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sign Type:</span>
                      <span className="font-medium">{sign.sign_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MUTCD Name:</span>
                      <span className="font-medium">{sign.mutcd_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MUTCD Code:</span>
                      <span className="font-medium">{sign.mutcd_code}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Palette className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Colors</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Legend Color:</span>
                      <span className="font-medium">{sign.legend_color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Background Color:</span>
                      <span className="font-medium">{sign.background_color}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Shapes className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Physical Properties</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shape:</span>
                      <span className="font-medium">{sign.sign_shape}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}