@@ .. @@
 import React, { useState } from 'react';
-import { Eye, Calendar, Tag, Loader2 } from 'lucide-react';
+import { Eye, Calendar, Tag, Loader2, Trash2 } from 'lucide-react';
 import { SignData } from '../types';
 import PhotoModal from './PhotoModal';
 
 interface PhotoGalleryProps {
   signs: SignData[];
   loading?: boolean;
+  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
 }
 
-export default function PhotoGallery({ signs, loading = false }: PhotoGalleryProps) {
+export default function PhotoGallery({ signs, loading = false, onDelete }: PhotoGalleryProps) {
   const [selectedSign, setSelectedSign] = useState<SignData | null>(null);
+  const [deletingId, setDeletingId] = useState<string | null>(null);
+
+  const handleDelete = async (e: React.MouseEvent, id: string) => {
+    e.stopPropagation();
+    
+    if (!confirm('Are you sure you want to delete this sign? This action cannot be undone.')) {
+      return;
+    }
+
+    setDeletingId(id);
+    try {
+      const result = await onDelete(id);
+      if (!result.success) {
+        alert(`Failed to delete sign: ${result.error}`);
+      }
+    } catch (error) {
+      alert('Failed to delete sign. Please try again.');
+    } finally {
+      setDeletingId(null);
+    }
+  };
 
   if (loading) {
     return (
       <div className="max-w-7xl mx-auto px-6 py-12">
         <div className="text-center">
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
           <h3 className="text-lg font-medium text-gray-900 mb-2">Loading signs...</h3>
           <p className="text-gray-500">Please wait while we fetch the database.</p>
         </div>
       </div>
     );
   }
 
   if (signs.length === 0) {
     return (
       <div className="max-w-7xl mx-auto px-6 py-12">
         <div className="text-center">
           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <Tag className="w-8 h-8 text-gray-400" />
           </div>
           <h3 className="text-lg font-medium text-gray-900 mb-2">No signs found</h3>
           <p className="text-gray-500">
             Try adjusting your search filters or upload some signs to get started.
           </p>
         </div>
       </div>
     );
   }
 
   return (
     <>
       <div className="max-w-7xl mx-auto px-6 pb-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {signs.map((sign) => (
             <div
               key={sign.id}
               className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
               onClick={() => setSelectedSign(sign)}
             >
               <div className="relative aspect-square">
                 <img
                   src={sign.photo}
                   alt={sign.sign_details}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                 />
                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                   <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                 </div>
+                <button
+                  onClick={(e) => handleDelete(e, sign.id)}
+                  disabled={deletingId === sign.id}
+                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
+                  title="Delete sign"
+                >
+                  {deletingId === sign.id ? (
+                    <Loader2 className="w-4 h-4 animate-spin" />
+                  ) : (
+                    <Trash2 className="w-4 h-4" />
+                  )}
+                </button>
               </div>
               
               <div className="p-4">
                 <h3 className="font-semibold text-gray-900 truncate mb-2">
                   {sign.sign_details}
                 </h3>
                 
                 <div className="space-y-1 text-sm text-gray-600">
                   <div className="flex items-center justify-between">
                     <span>Type:</span>
                     <span className="font-medium">{sign.sign_type}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span>MUTCD:</span>
                     <span className="font-medium">{sign.mutcd_code}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span>Shape:</span>
                     <span className="font-medium">{sign.sign_shape}</span>
                   </div>
                 </div>
 
                 <div className="flex items-center mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                   <Calendar className="w-3 h-3 mr-1" />
                   {new Date(sign.upload_date).toLocaleDateString()}
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
 
       {selectedSign && (
         <PhotoModal
           sign={selectedSign}
           onClose={() => setSelectedSign(null)}
+          onDelete={onDelete}
         />
       )}
     </>
   );
 }