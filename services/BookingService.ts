import { Booking, Notification } from '@/types/FirebaseTypes';
import { FirebaseService } from './FirebaseService';

export class BookingService {
  static async createBooking(
    renterId: string,
    ownerId: string,
    listingId: string,
    listingTitle: string,
    startDate: string,
    endDate: string,
    totalAmount: number
  ): Promise<string> {
    try {
      // Calculate total days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      // Create booking
      const bookingId = await FirebaseService.createBooking({
        renterId,
        ownerId,
        listingId,
        listingTitle,
        startDate,
        endDate,
        totalDays,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
      });

      // Create notification for owner
      await FirebaseService.createNotification({
        userId: ownerId,
        type: 'booking_request',
        title: 'New Booking Request',
        message: `You have a new booking request for "${listingTitle}"`,
        data: {
          bookingId,
          listingId,
          renterId,
        },
        isRead: false,
      });

      return bookingId;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking. Please try again.');
    }
  }

  static async updateBookingStatus(
    bookingId: string,
    status: Booking['status'],
    updatedBy: string
  ): Promise<void> {
    try {
      await FirebaseService.updateBooking(bookingId, { status });

      // Get booking details for notifications
      const booking = await FirebaseService.getBooking(bookingId);
      if (!booking) return;

      // Create appropriate notifications
      let notification: Omit<Notification, 'id' | 'createdAt'> | null = null;

      switch (status) {
        case 'confirmed':
          notification = {
            userId: booking.renterId,
            type: 'booking_confirmed',
            title: 'Booking Confirmed',
            message: `Your booking for "${booking.listingTitle}" has been confirmed!`,
            data: { bookingId },
            isRead: false,
          };
          break;
        case 'cancelled':
          notification = {
            userId: booking.renterId,
            type: 'booking_cancelled',
            title: 'Booking Cancelled',
            message: `Your booking for "${booking.listingTitle}" has been cancelled.`,
            data: { bookingId },
            isRead: false,
          };
          break;
      }

      if (notification) {
        await FirebaseService.createNotification(notification);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status. Please try again.');
    }
  }

  static async getUserBookings(userId: string, userType: 'renter' | 'owner'): Promise<Booking[]> {
    try {
      return await FirebaseService.getUserBookings(userId, userType);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw new Error('Failed to get your bookings. Please try again.');
    }
  }

  static async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      return await FirebaseService.getBooking(bookingId);
    } catch (error) {
      console.error('Error getting booking:', error);
      throw new Error('Failed to get booking details. Please try again.');
    }
  }

  static async addBookingMessage(
    bookingId: string,
    senderId: string,
    senderName: string,
    message: string
  ): Promise<void> {
    try {
      const booking = await FirebaseService.getBooking(bookingId);
      if (!booking) throw new Error('Booking not found');

      const newMessage = {
        id: Date.now().toString(),
        senderId,
        senderName,
        message,
        timestamp: new Date().toISOString(),
        type: 'text' as const,
      };

      const updatedMessages = [...(booking.messages || []), newMessage];

      await FirebaseService.updateBooking(bookingId, {
        messages: updatedMessages,
      });
    } catch (error) {
      console.error('Error adding booking message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }

  static async markBookingAsCompleted(bookingId: string): Promise<void> {
    try {
      await FirebaseService.updateBooking(bookingId, {
        status: 'completed',
      });
    } catch (error) {
      console.error('Error marking booking as completed:', error);
      throw new Error('Failed to mark booking as completed. Please try again.');
    }
  }

  static async cancelBooking(bookingId: string, cancelledBy: string): Promise<void> {
    try {
      await this.updateBookingStatus(bookingId, 'cancelled', cancelledBy);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking. Please try again.');
    }
  }
}
