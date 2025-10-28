// Import fallback crypto service
import { SimpleCryptoService } from './SimpleCryptoService';

export class CryptoService {
  /**
   * Generate a cryptographically secure random string
   * @param length - Length of the random string (default: 32)
   * @returns Promise<string> - Random string
   */
  static async generateRandomString(length: number = 32): Promise<string> {
    // Use SimpleCryptoService to avoid native module issues
    return await SimpleCryptoService.generateRandomString(length);
  }

  /**
   * Generate a secure token for authentication
   * @returns Promise<string> - Secure authentication token
   */
  static async generateAuthToken(): Promise<string> {
    // Use SimpleCryptoService as primary method to avoid native module issues
    return await SimpleCryptoService.generateAuthToken();
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
    // Use SimpleCryptoService to avoid native module issues
    return await SimpleCryptoService.hashData(data);
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
