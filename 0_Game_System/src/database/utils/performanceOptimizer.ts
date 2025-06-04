import { lazyDbTester } from './lazyDbConnectionTest';

/**
 * Performance optimization utilities for database operations
 */

/**
 * Wrapper for database operations that ensures connection is available
 * before attempting the operation
 */
export async function withDatabaseConnection<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    const isConnected = await lazyDbTester.getConnectionStatus();
    
    if (!isConnected) {
      console.warn('🔗 Database not connected, using fallback or throwing error');
      if (fallback !== undefined) {
        return fallback;
      }
      throw new Error('Database connection not available');
    }
    
    return await operation();
  } catch (error) {
    console.error('🔗 Database operation failed:', error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

/**
 * Debounce function to prevent excessive database calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit database operation frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Cache for expensive database operations
 */
class OperationCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

export const operationCache = new OperationCache();

/**
 * Cached database operation wrapper
 */
export async function withCache<T>(
  key: string,
  operation: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = operationCache.get(key);
  if (cached !== null) {
    console.log(`📦 Cache hit for ${key}`);
    return cached;
  }
  
  // Execute operation and cache result
  console.log(`🔄 Cache miss for ${key}, executing operation`);
  const result = await operation();
  operationCache.set(key, result, ttl);
  
  return result;
}
