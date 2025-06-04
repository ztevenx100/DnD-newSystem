import { checkDatabaseConnection } from './dbConnectionTest';

/**
 * Lazy database connection tester that only runs when needed
 * and caches the result to avoid multiple unnecessary tests
 */
class LazyDbConnectionTester {
  private connectionStatus: boolean | null = null;
  private isChecking = false;
  private checkPromise: Promise<boolean> | null = null;

  /**
   * Get database connection status with lazy loading
   * Only performs the test once and caches the result
   */
  async getConnectionStatus(): Promise<boolean> {
    // Return cached result if available
    if (this.connectionStatus !== null) {
      return this.connectionStatus;
    }

    // If already checking, return the existing promise
    if (this.isChecking && this.checkPromise) {
      return this.checkPromise;
    }

    // Start the connection test
    this.isChecking = true;
    this.checkPromise = this.performConnectionTest();
    
    try {
      this.connectionStatus = await this.checkPromise;
      return this.connectionStatus;
    } finally {
      this.isChecking = false;
      this.checkPromise = null;
    }
  }

  private async performConnectionTest(): Promise<boolean> {
    try {
      console.log('🔄 Testing database connection (lazy load)...');
      const result = await checkDatabaseConnection();
      
      if (result) {
        console.log('✅ Database connection established successfully');
      } else {
        console.warn('⚠️ Database connection could not be established');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error during database connection test:', error);
      return false;
    }
  }

  /**
   * Force a fresh connection test (ignores cache)
   */
  async forceConnectionTest(): Promise<boolean> {
    this.connectionStatus = null;
    this.isChecking = false;
    this.checkPromise = null;
    return this.getConnectionStatus();
  }

  /**
   * Check if connection status is already known (cached)
   */
  isConnectionStatusKnown(): boolean {
    return this.connectionStatus !== null;
  }
}

// Export singleton instance
export const lazyDbTester = new LazyDbConnectionTester();

/**
 * Hook for React components to check database connection status
 * with lazy loading and caching
 */
export function useDatabaseConnection() {
  return {
    getConnectionStatus: () => lazyDbTester.getConnectionStatus(),
    forceConnectionTest: () => lazyDbTester.forceConnectionTest(),
    isConnectionStatusKnown: () => lazyDbTester.isConnectionStatusKnown()
  };
}
