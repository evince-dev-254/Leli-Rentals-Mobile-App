/**
 * Shared API Client for Mobile App
 * This client communicates with the website's backend API
 */

import { CryptoService } from '@/services/CryptoService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private sessionId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.initializeSession();
  }

  private async initializeSession() {
    this.sessionId = await CryptoService.generateSessionId();
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  async generateSecureToken(): Promise<string> {
    return await CryptoService.generateAuthToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    // Add secure session ID for request tracking
    if (this.sessionId) {
      headers['X-Session-ID'] = this.sessionId;
    }

    // Add request timestamp for security
    headers['X-Request-Time'] = Date.now().toString();

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          message: data.message,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(userData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserListings() {
    return this.request('/users/listings');
  }

  async getUserBookings() {
    return this.request('/users/bookings');
  }

  async getUserFavorites() {
    return this.request('/users/favorites');
  }

  // Listings endpoints
  async getListings(params?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/listings?${queryString}` : '/listings';
    
    return this.request(endpoint);
  }

  async getListing(id: string) {
    return this.request(`/listings/${id}`);
  }

  async createListing(listingData: any) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async updateListing(id: string, listingData: any) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  }

  async deleteListing(id: string) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings endpoints
  async getBookings() {
    return this.request('/bookings');
  }

  async createBooking(bookingData: {
    listingId: string;
    startDate: string;
    endDate: string;
    specialRequests?: string;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Favorites endpoints
  async getFavorites() {
    return this.request('/users/favorites');
  }

  async addToFavorites(listingId: string) {
    return this.request('/interactions/save', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async removeFromFavorites(listingId: string) {
    return this.request('/interactions/save', {
      method: 'DELETE',
      body: JSON.stringify({ listingId }),
    });
  }

  // Messages endpoints
  async getChatSessions() {
    return this.request('/messages');
  }

  async getMessages(chatSessionId: string) {
    return this.request(`/messages/${chatSessionId}`);
  }

  async sendMessage(chatSessionId: string, content: string) {
    return this.request(`/messages/${chatSessionId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Interaction endpoints
  async likeListing(listingId: string, action: 'like' | 'unlike') {
    return this.request('/interactions/like', {
      method: 'POST',
      body: JSON.stringify({ listingId, action }),
    });
  }

  async saveListing(listingId: string, action: 'save' | 'unsave') {
    return this.request('/interactions/save', {
      method: 'POST',
      body: JSON.stringify({ listingId, action }),
    });
  }

  async recordView(listingId: string) {
    return this.request('/interactions/view', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async recordShare(listingId: string, platform?: string) {
    return this.request('/interactions/share', {
      method: 'POST',
      body: JSON.stringify({ listingId, platform }),
    });
  }

  // File upload
  async uploadFile(file: File | Blob, type: 'image' | 'document' = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set it with boundary
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      },
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;
