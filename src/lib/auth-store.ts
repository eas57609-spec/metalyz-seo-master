import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, SubscriptionType } from '@/types/user';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  sessionToken?: string;
  
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setRememberMe: (remember: boolean) => void;
  updateProfile: (updates: Partial<User>) => void;
  upgradeSubscription: (planId: SubscriptionType) => Promise<{ success: boolean; error?: string }>;
  validateSession: () => boolean;
}

// SEPARATED ACCOUNTS - Owner and Kerem Çağan İlhan are DIFFERENT
const mockUsers: User[] = [
  // System Owner Account
  {
    id: 'system-owner-001',
    email: 'owner@metalyz.io',
    name: 'System Owner',
    provider: 'email',
    createdAt: new Date('2024-01-01'),
    subscription: SubscriptionType.ENTERPRISE,
    role: UserRole.OWNER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  // Kerem Çağan İlhan - Enterprise Customer Account
  {
    id: 'customer-kerem-001',
    email: 'duncanthetall@atomicmail.io',
    name: 'Kerem Çağan İlhan',
    provider: 'email',
    createdAt: new Date('2024-01-01'),
    subscription: SubscriptionType.ENTERPRISE,
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateSessionToken = (): string => {
  return 'metalyz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

const validateSessionToken = (token?: string): boolean => {
  if (!token || !token.startsWith('metalyz_')) return false;
  const timestamp = parseInt(token.split('_')[1]);
  const now = Date.now();
  return (now - timestamp) < (24 * 60 * 60 * 1000);
};

const securePasswords: { [email: string]: string } = {
  'owner@metalyz.io': 'xD9wmE993r',                    // System Owner
  'duncanthetall@atomicmail.io': '6e3Ki3hErR3m'       // Kerem Çağan İlhan
};

const mockLogin = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  await delay(1000 + Math.random() * 500);
  
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { success: false, error: 'No account found with this email address' };
  }
  
  // System Owner Access
  if (user.email === 'owner@metalyz.io' && password === 'xD9wmE993r') {
    return { success: true, user };
  }
  
  // Kerem Çağan İlhan - Enterprise Customer Access
  if (user.email === 'duncanthetall@atomicmail.io' && password === '6e3Ki3hErR3m') {
    return { success: true, user };
  }
  
  const storedPassword = securePasswords[user.email];
  if (!storedPassword) {
    return { success: false, error: 'Account setup incomplete. Please contact administrator.' };
  }
  
  if (password !== storedPassword) {
    return { success: false, error: 'Invalid password' };
  }
  
  return { success: true, user };
};

const mockRegister = async (email: string, password: string, name: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  await delay(1200 + Math.random() * 500);
  
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }
  
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }
  
  if (name.trim().length < 2) {
    return { success: false, error: 'Name must be at least 2 characters long' };
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    name: name.trim(),
    provider: 'email',
    createdAt: new Date(),
    subscription: SubscriptionType.FREE
  };
  
  mockUsers.push(newUser);
  return { success: true, user: newUser };
};

const mockGoogleLogin = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  await delay(800 + Math.random() * 400);
  
  const googleUser: User = {
    id: `google-${Date.now()}`,
    email: 'user@gmail.com',
    name: 'Google User',
    provider: 'google',
    createdAt: new Date(),
    subscription: SubscriptionType.FREE,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  };
  
  const existingUser = mockUsers.find(u => u.email === googleUser.email);
  if (!existingUser) {
    mockUsers.push(googleUser);
  }
  
  return { success: true, user: existingUser || googleUser };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: true,
      sessionToken: undefined,
      
      validateSession: () => {
        const state = get();
        if (!state.sessionToken || !validateSessionToken(state.sessionToken)) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            sessionToken: undefined 
          });
          return false;
        }
        return true;
      },
      
      login: async (email: string, password: string, remember = true) => {
        set({ isLoading: true });
        
        try {
          const result = await mockLogin(email, password);
          
          if (result.success && result.user) {
            const sessionToken = generateSessionToken();
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              rememberMe: remember,
              sessionToken: sessionToken,
              isLoading: false 
            });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Login failed. Please try again.' };
        }
      },
      
      loginWithGoogle: async (remember = true) => {
        set({ isLoading: true });
        
        try {
          const result = await mockGoogleLogin();
          
          if (result.success && result.user) {
            const sessionToken = generateSessionToken();
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              rememberMe: remember,
              sessionToken: sessionToken,
              isLoading: false 
            });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Google login failed. Please try again.' };
        }
      },
      
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        
        try {
          const result = await mockRegister(email, password, name);
          
          if (result.success && result.user) {
            const sessionToken = generateSessionToken();
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              rememberMe: true,
              sessionToken: sessionToken,
              isLoading: false 
            });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Registration failed. Please try again.' };
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          sessionToken: undefined,
          isLoading: false 
        });
      },
      
      setRememberMe: (remember: boolean) => {
        set({ rememberMe: remember });
      },
      
      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
        // System Owner - Full privileges maintained
        if (currentUser.role === UserRole.OWNER) {
          set({ 
            user: { 
              ...currentUser, 
              ...updates,
              role: UserRole.OWNER,
              subscription: SubscriptionType.ENTERPRISE
            } 
          });
        } 
        // Kerem Çağan İlhan - Enterprise privileges maintained
        else if (currentUser.email === 'duncanthetall@atomicmail.io') {
          set({ 
            user: { 
              ...currentUser, 
              ...updates,
              subscription: SubscriptionType.ENTERPRISE
            } 
          });
        } else {
          set({ 
            user: { ...currentUser, ...updates } 
          });
        }
        }
      },

      upgradeSubscription: async (planId: SubscriptionType) => {
        const currentUser = get().user;
        if (!currentUser) {
          return { success: false, error: 'User not authenticated' };
        }

        // System Owner - Already Enterprise
        if (currentUser.role === UserRole.OWNER) {
          return { success: true };
        }
        
        // Kerem Çağan İlhan - Already Enterprise
        if (currentUser.email === 'duncanthetall@atomicmail.io') {
          return { success: true };
        }

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          set({ 
            user: { 
              ...currentUser, 
              subscription: planId 
            } 
          });

          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Upgrade failed' 
          };
        }
      },
    }),
    {
      name: 'metalyz-auth',
      partialize: (state) => ({
        user: state.rememberMe ? state.user : null,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        sessionToken: state.rememberMe ? state.sessionToken : undefined,
        rememberMe: state.rememberMe,
      }),
    }
  )
);