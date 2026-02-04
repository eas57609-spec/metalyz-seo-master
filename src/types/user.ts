// Global User Types and Enums for Metalyz
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  OWNER = 'owner',
  SUPERADMIN = 'superadmin'
}

export enum SubscriptionType {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
  LIFETIME = 'lifetime'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'email' | 'google';
  createdAt: Date;
  subscription?: SubscriptionType;
  role?: UserRole;
}

// Type guards for better type safety
export const isOwner = (user?: User | null): boolean => {
  return user?.role === UserRole.OWNER;
};

export const isSuperAdmin = (user?: User | null): boolean => {
  return user?.role === UserRole.SUPERADMIN;
};

export const isAdmin = (user?: User | null): boolean => {
  return user?.role === UserRole.ADMIN || isOwner(user) || isSuperAdmin(user);
};

export const hasLifetimeAccess = (user?: User | null): boolean => {
  return user?.subscription === SubscriptionType.LIFETIME || isOwner(user);
};

export const hasPremiumAccess = (user?: User | null): boolean => {
  return user?.subscription === SubscriptionType.PRO || 
         user?.subscription === SubscriptionType.ENTERPRISE || 
         hasLifetimeAccess(user);
};