import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseStats {
  id: string;
  monthly_revenue: number;
  active_subscriptions: number;
  global_users: number;
  total_projects: number;
  total_generated_tags: number;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface UserProject {
  id: string;
  title: string;
  website_url: string;
  description: string;
  seo_score: number;
  status: 'draft' | 'analyzing' | 'completed' | 'optimized';
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  user_id: string;
}

// Real-time stats functions
export async function getSystemStats(): Promise<DatabaseStats | null> {
  try {
    const { data, error } = await supabase
      .from('system_stats')
      .select('*')
      .single();

    if (error) {
      console.log('Using fallback stats - database not connected');
      // Fallback to initial values
      return {
        id: 'fallback',
        monthly_revenue: 0,
        active_subscriptions: 0,
        global_users: 1, // At least the owner
        total_projects: 0,
        total_generated_tags: 0,
        updated_at: new Date().toISOString()
      };
    }

    return data;
  } catch (error) {
    console.log('Database connection not available, using fallback');
    return {
      id: 'fallback',
      monthly_revenue: 0,
      active_subscriptions: 0,
      global_users: 1,
      total_projects: 0,
      total_generated_tags: 0,
      updated_at: new Date().toISOString()
    };
  }
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log('Notifications not available');
      return [];
    }

    return data || [];
  } catch (error) {
    console.log('Notification system not connected');
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  } catch (error) {
    console.log('Could not mark notification as read');
  }
}

// Real-time subscription for stats
export function subscribeToStats(callback: (stats: DatabaseStats) => void) {
  const subscription = supabase
    .channel('system_stats')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'system_stats' },
      (payload) => {
        if (payload.new) {
          callback(payload.new as DatabaseStats);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// Initialize database with default values (for first-time setup)
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if stats exist
    const { data: existingStats } = await supabase
      .from('system_stats')
      .select('id')
      .single();

    if (!existingStats) {
      // Insert initial stats
      await supabase
        .from('system_stats')
        .insert({
          monthly_revenue: 0,
          active_subscriptions: 0,
          global_users: 1,
          total_projects: 0,
          total_generated_tags: 0
        });
    }
  } catch (error) {
    console.log('Database initialization skipped - not connected');
  }
}

// User Projects Management
export async function getUserProjects(userId: string): Promise<UserProject[]> {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.log('Using fallback projects - database not connected');
      return [];
    }

    return data || [];
  } catch (error) {
    console.log('Error fetching user projects:', error);
    return [];
  }
}

export async function createUserProject(project: Omit<UserProject, 'id' | 'created_at' | 'updated_at'>): Promise<UserProject | null> {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .insert([{
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.log('Could not create project in database');
      return null;
    }

    return data;
  } catch (error) {
    console.log('Error creating project:', error);
    return null;
  }
}

export async function updateUserProject(projectId: string, updates: Partial<UserProject>): Promise<UserProject | null> {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.log('Could not update project in database');
      return null;
    }

    return data;
  } catch (error) {
    console.log('Error updating project:', error);
    return null;
  }
}

export async function deleteUserProject(projectId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.log('Could not delete project from database');
      return false;
    }

    return true;
  } catch (error) {
    console.log('Error deleting project:', error);
    return false;
  }
}