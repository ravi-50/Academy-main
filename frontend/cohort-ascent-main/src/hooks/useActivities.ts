import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import type { Json } from '@/integrations/supabase/types';

export interface ActivityDB {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Json | null;
  created_at: string;
}

export const useActivities = (limit = 20) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['activities', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as ActivityDB[];
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('activities_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_log',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['activities'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: Omit<ActivityDB, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('activity_log')
        .insert([activity])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};