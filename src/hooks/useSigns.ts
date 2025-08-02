@@ .. @@
 import { useState, useEffect } from 'react';
 import { supabase } from '../lib/supabase';
 import { SignData } from '../types';
 
 export function useSigns() {
   const [signs, setSigns] = useState<SignData[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   const fetchSigns = async () => {
     try {
       setLoading(true);
       setError(null);
       
       const { data, error: fetchError } = await supabase
         .from('signs')
         .select('*')
         .order('upload_date', { ascending: false });
 
       if (fetchError) {
         throw fetchError;
       }
 
       setSigns(data || []);
     } catch (err) {
       console.error('Error fetching signs:', err);
       setError(err instanceof Error ? err.message : 'Failed to fetch signs');
     } finally {
       setLoading(false);
     }
   };
 
   const addSign = async (signData: Omit<SignData, 'id' | 'created_at'>) => {
     try {
+      // Validate required fields
+      const requiredFields = ['photo', 'sign_details', 'sign_type', 'mutcd_name', 'mutcd_code', 'legend_color', 'background_color', 'sign_shape'];
+      for (const field of requiredFields) {
+        if (!signData[field as keyof typeof signData]) {
+          throw new Error(`${field.replace('_', ' ')} is required`);
+        }
+      }
+
       const { data, error: insertError } = await supabase
         .from('signs')
         .insert([signData])
         .select()
         .single();
 
       if (insertError) {
+        console.error('Supabase insert error:', insertError);
         throw insertError;
       }
 
       if (data) {
         setSigns(prev => [data, ...prev]);
       }
 
       return { success: true, data };
     } catch (err) {
       console.error('Error adding sign:', err);
       const errorMessage = err instanceof Error ? err.message : 'Failed to upload sign';
       return { success: false, error: errorMessage };
     }
   };
 
+  const deleteSign = async (id: string) => {
+    try {
+      const { error: deleteError } = await supabase
+        .from('signs')
+        .delete()
+        .eq('id', id);
+
+      if (deleteError) {
+        console.error('Supabase delete error:', deleteError);
+        throw deleteError;
+      }
+
+      setSigns(prev => prev.filter(sign => sign.id !== id));
+      return { success: true };
+    } catch (err) {
+      console.error('Error deleting sign:', err);
+      const errorMessage = err instanceof Error ? err.message : 'Failed to delete sign';
+      return { success: false, error: errorMessage };
+    }
+  };
+
   useEffect(() => {
     fetchSigns();
   }, []);
 
   return {
     signs,
     loading,
     error,
     addSign,
+    deleteSign,
     refetch: fetchSigns
   };
 }