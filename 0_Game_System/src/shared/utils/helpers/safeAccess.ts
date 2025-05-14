/**
 * Utility function to safely access properties of an object
 * Helps prevent "Element implicitly has an 'any' type" errors when accessing props with string indices
 * 
 * @param obj The object to access
 * @param key The property key to access
 * @param defaultValue A default value to return if the property doesn't exist
 * @returns The property value or default value if not found
 */
export function getProperty<T, K extends keyof T>(obj: T, key: K, defaultValue?: T[K]): T[K] {
    if (!obj) return defaultValue as T[K];
    return obj[key] !== undefined ? obj[key] : (defaultValue as T[K]);
}

/**
 * Type guard to check if a key exists in an object in a type-safe way
 * 
 * @param obj The object to check
 * @param key The key to check
 * @returns boolean indicating if the key exists
 */
export function hasProperty<T>(obj: T, key: keyof any): key is keyof T {
    return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * Helper to create a safe access wrapper for a specific object type
 * Creates a function that can safely access properties of objects of that type
 * 
 * @returns A function to safely access properties
 */
export function createSafeAccessor<T>() {
    return (obj: T, key: keyof T, defaultValue?: any) => getProperty(obj, key, defaultValue);
}
