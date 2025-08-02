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
      const { data, error: insertError } = await supabase
        .from('signs')
        .insert([signData])
        .select()
        .single();

      if (insertError) {
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

  useEffect(() => {
    fetchSigns();
  }, []);

  return {
    signs,
    loading,
    error,
    addSign,
    refetch: fetchSigns
  };
}