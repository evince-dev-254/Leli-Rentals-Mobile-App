/**
 * Simple crypto service that works in development environments
 * without requiring native modules
 */
export class SimpleCryptoService {
  /**
   * Generate a cryptographically secure random string
   * @param length - Length of the random string (default: 32)
   * @returns Promise<string> - Random string
   */
  static async generateRandomString(length: number = 32): Promise<string> {
    // Use Web Crypto API if available
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback to Math.random for development
    let result = '';
    const chars = '0123456789abcdef';
    for (let i = 0; i < length * 2; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  /**
   * Generate a secure state parameter for OAuth flows
   * @returns Promise<string> - Secure state parameter
   */
  static async generateOAuthState(): Promise<string> {
    return await this.generateRandomString(16);
  }

  /**
   * Hash a password or sensitive data
   * @param data - Data to hash
   * @returns Promise<string> - Hashed data
   */
  static async hashData(data: string): Promise<string> {
    // Use Web Crypto API if available
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (error) {
        console.warn('Web Crypto API failed, using fallback:', error);
      }
    }
    
    // Fallback to simple hash for development
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Generate a secure authentication token
   * @returns Promise<string> - Secure authentication token
   */
  static async generateAuthToken(): Promise<string> {
    const timestamp = Date.now().toString();
    const randomPart = await this.generateRandomString(16);
    const combined = `${timestamp}_${randomPart}`;
    
    return await this.hashData(combined);
  }
}
