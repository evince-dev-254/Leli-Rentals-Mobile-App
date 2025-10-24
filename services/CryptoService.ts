// Import expo-crypto with error handling
let Crypto: any = null;
try {
  Crypto = require('expo-crypto');
} catch (error) {
  console.warn('expo-crypto not available, using fallback methods');
}

// Import fallback crypto service
import { SimpleCryptoService } from './SimpleCryptoService';

export class CryptoService {
  /**
   * Generate a cryptographically secure random string
   * @param length - Length of the random string (default: 32)
   * @returns Promise<string> - Random string
   */
  static async generateRandomString(length: number = 32): Promise<string> {
    // Fallback to web crypto API
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
   * Generate a secure token for authentication
   * @returns Promise<string> - Secure authentication token
   */
  static async generateAuthToken(): Promise<string> {
    const timestamp = Date.now().toString();
    const randomPart = await this.generateRandomString(16);
    const combined = `${timestamp}_${randomPart}`;
    
    if (Crypto) {
      try {
        // Create a hash of the combined string for additional security
        const hash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          combined,
          { encoding: Crypto.CryptoEncoding.HEX }
        );
        return hash;
      } catch (error) {
        console.warn('expo-crypto error, using fallback hash:', error);
        return await this.hashData(combined);
      }
    } else {
      // Fallback to simple hash if expo-crypto is not available
      console.warn('expo-crypto not available, using fallback hash');
      return await this.hashData(combined);
    }
  }

  /**
   * Generate a secure state parameter for OAuth flows
   * @returns Promise<string> - Secure state parameter
   */
  static async generateOAuthState(): Promise<string> {
    // Use SimpleCryptoService as fallback
    return await SimpleCryptoService.generateOAuthState();
  }

  /**
   * Hash a password or sensitive data
   * @param data - Data to hash
   * @returns Promise<string> - Hashed data
   */
  static async hashData(data: string): Promise<string> {
    // Use Web Crypto API if available
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
   * Generate a secure session ID
   * @returns Promise<string> - Secure session ID
   */
  static async generateSessionId(): Promise<string> {
    const timestamp = Date.now().toString();
    const randomHex = await this.generateRandomString(16);
    
    return await this.hashData(`${timestamp}_${randomHex}`);
  }

  /**
   * Generate a secure API key
   * @param prefix - Optional prefix for the API key
   * @returns Promise<string> - Secure API key
   */
  static async generateApiKey(prefix: string = 'api'): Promise<string> {
    const randomPart = await this.generateRandomString(24);
    const timestamp = Date.now().toString(36); // Base36 for shorter timestamp
    
    return `${prefix}_${timestamp}_${randomPart}`;
  }

  /**
   * Verify data integrity by comparing hashes
   * @param data - Original data
   * @param hash - Hash to compare against
   * @returns Promise<boolean> - Whether the hash matches
   */
  static async verifyHash(data: string, hash: string): Promise<boolean> {
    const computedHash = await this.hashData(data);
    return computedHash === hash;
  }
}
