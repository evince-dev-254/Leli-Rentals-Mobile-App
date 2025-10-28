import { FirebaseService } from './FirebaseService';

export interface BillingAccount {
  id: string;
  ownerId: string;
  businessName?: string;
  taxId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
  payoutMethod: 'bank_transfer' | 'paypal' | 'stripe';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  id: string;
  ownerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payoutMethod: string;
  transactionId?: string;
  scheduledDate: string;
  processedDate?: string;
  failureReason?: string;
  earnings: {
    totalEarnings: number;
    platformFee: number;
    netAmount: number;
  };
}

export interface Earnings {
  id: string;
  ownerId: string;
  listingId: string;
  bookingId: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'available' | 'paid';
  createdAt: string;
  paidAt?: string;
}

export interface TaxDocument {
  id: string;
  ownerId: string;
  year: number;
  totalEarnings: number;
  totalFees: number;
  netEarnings: number;
  documentUrl: string;
  createdAt: string;
}

export class BillingService {
  // ===== BILLING ACCOUNT =====
  
  static async createBillingAccount(
    ownerId: string,
    accountData: Omit<BillingAccount, 'id' | 'ownerId' | 'isVerified' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const billingAccount: BillingAccount = {
        id: `billing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ownerId,
        ...accountData,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock billing account creation
      console.log('Mock: Creating billing account', billingAccount.id);
      return billingAccount.id;
    } catch (error) {
      console.error('Error creating billing account:', error);
      throw new Error('Failed to create billing account. Please try again.');
    }
  }

  static async updateBillingAccount(
    accountId: string,
    updates: Partial<BillingAccount>
  ): Promise<void> {
    try {
      // Mock billing account update
      console.log('Mock: Updating billing account', accountId, updates);
    } catch (error) {
      console.error('Error updating billing account:', error);
      throw new Error('Failed to update billing account. Please try again.');
    }
  }

  static async getBillingAccount(ownerId: string): Promise<BillingAccount | null> {
    try {
      // Mock get billing account
      console.log('Mock: Getting billing account for', ownerId);
      return null; // Return null for demo
    } catch (error) {
      console.error('Error getting billing account:', error);
      throw new Error('Failed to get billing account. Please try again.');
    }
  }

  static async verifyBillingAccount(accountId: string): Promise<void> {
    try {
      // Mock verify billing account
      console.log('Mock: Verifying billing account', accountId);
    } catch (error) {
      console.error('Error verifying billing account:', error);
      throw new Error('Failed to verify billing account. Please try again.');
    }
  }

  // ===== EARNINGS =====
  
  static async recordEarnings(
    ownerId: string,
    listingId: string,
    bookingId: string,
    grossAmount: number
  ): Promise<string> {
    try {
      const platformFee = grossAmount * 0.1; // 10% platform fee
      const netAmount = grossAmount - platformFee;

      const earnings: Earnings = {
        id: `earnings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ownerId,
        listingId,
        bookingId,
        grossAmount,
        platformFee,
        netAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Mock create earnings
      console.log('Mock: Creating earnings', earnings);
      return earnings.id;
    } catch (error) {
      console.error('Error recording earnings:', error);
      throw new Error('Failed to record earnings. Please try again.');
    }
  }

  static async getOwnerEarnings(ownerId: string): Promise<Earnings[]> {
    try {
      // Mock get owner earnings
      console.log('Mock: Getting owner earnings for', ownerId);
      return []; // Return empty array for demo
    } catch (error) {
      console.error('Error getting owner earnings:', error);
      throw new Error('Failed to get earnings. Please try again.');
    }
  }

  static async getEarningsSummary(ownerId: string): Promise<{
    totalEarnings: number;
    totalFees: number;
    netEarnings: number;
    pendingEarnings: number;
    availableForPayout: number;
  }> {
    try {
      const earnings = await this.getOwnerEarnings(ownerId);
      
      const totalEarnings = earnings.reduce((sum, earning) => sum + earning.grossAmount, 0);
      const totalFees = earnings.reduce((sum, earning) => sum + earning.platformFee, 0);
      const netEarnings = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
      const pendingEarnings = earnings
        .filter(earning => earning.status === 'pending')
        .reduce((sum, earning) => sum + earning.netAmount, 0);
      const availableForPayout = earnings
        .filter(earning => earning.status === 'available')
        .reduce((sum, earning) => sum + earning.netAmount, 0);

      return {
        totalEarnings,
        totalFees,
        netEarnings,
        pendingEarnings,
        availableForPayout,
      };
    } catch (error) {
      console.error('Error getting earnings summary:', error);
      throw new Error('Failed to get earnings summary. Please try again.');
    }
  }

  // ===== PAYOUTS =====
  
  static async requestPayout(
    ownerId: string,
    amount: number,
    payoutMethod: string
  ): Promise<string> {
    try {
      const payoutId = `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const payout: Payout = {
        id: payoutId,
        ownerId,
        amount,
        currency: 'USD',
        status: 'pending',
        payoutMethod,
        scheduledDate: new Date().toISOString(),
        earnings: {
          totalEarnings: amount,
          platformFee: 0,
          netAmount: amount,
        },
      };

      // Mock create payout
      console.log('Mock: Creating payout', payout);
      return payoutId;
    } catch (error) {
      console.error('Error requesting payout:', error);
      throw new Error('Failed to request payout. Please try again.');
    }
  }

  static async getOwnerPayouts(ownerId: string): Promise<Payout[]> {
    try {
      // Mock get owner payouts
      console.log('Mock: Getting owner payouts for', ownerId);
      return []; // Return empty array for demo
    } catch (error) {
      console.error('Error getting owner payouts:', error);
      throw new Error('Failed to get payout history. Please try again.');
    }
  }

  static async getPayout(payoutId: string): Promise<Payout | null> {
    try {
      // Mock get payout
      console.log('Mock: Getting payout', payoutId);
      return null; // Return null for demo
    } catch (error) {
      console.error('Error getting payout:', error);
      throw new Error('Failed to get payout details. Please try again.');
    }
  }

  // ===== TAX DOCUMENTS =====
  
  static async generateTaxDocument(
    ownerId: string,
    year: number
  ): Promise<TaxDocument> {
    try {
      const earnings = await this.getOwnerEarnings(ownerId);
      const yearEarnings = earnings.filter(earning => 
        new Date(earning.createdAt).getFullYear() === year
      );

      const totalEarnings = yearEarnings.reduce((sum, earning) => sum + earning.grossAmount, 0);
      const totalFees = yearEarnings.reduce((sum, earning) => sum + earning.platformFee, 0);
      const netEarnings = totalEarnings - totalFees;

      const taxDocument: TaxDocument = {
        id: `tax_${year}_${ownerId}`,
        ownerId,
        year,
        totalEarnings,
        totalFees,
        netEarnings,
        documentUrl: `https://example.com/tax-documents/${ownerId}/${year}.pdf`,
        createdAt: new Date().toISOString(),
      };

      // Mock create tax document
      console.log('Mock: Creating tax document', taxDocument);
      return taxDocument;
    } catch (error) {
      console.error('Error generating tax document:', error);
      throw new Error('Failed to generate tax document. Please try again.');
    }
  }

  static async getTaxDocuments(ownerId: string): Promise<TaxDocument[]> {
    try {
      // Mock get tax documents
      console.log('Mock: Getting tax documents for', ownerId);
      return []; // Return empty array for demo
    } catch (error) {
      console.error('Error getting tax documents:', error);
      throw new Error('Failed to get tax documents. Please try again.');
    }
  }

  // ===== BILLING ANALYTICS =====
  
  static async getBillingAnalytics(ownerId: string, period: 'week' | 'month' | 'year'): Promise<{
    totalRevenue: number;
    totalFees: number;
    netRevenue: number;
    averageBookingValue: number;
    topListings: Array<{
      listingId: string;
      title: string;
      revenue: number;
    }>;
  }> {
    try {
      const earnings = await this.getOwnerEarnings(ownerId);
      
      // Filter by period
      const now = new Date();
      const filteredEarnings = earnings.filter(earning => {
        const earningDate = new Date(earning.createdAt);
        const diffTime = now.getTime() - earningDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        switch (period) {
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'year':
            return diffDays <= 365;
          default:
            return true;
        }
      });

      const totalRevenue = filteredEarnings.reduce((sum, earning) => sum + earning.grossAmount, 0);
      const totalFees = filteredEarnings.reduce((sum, earning) => sum + earning.platformFee, 0);
      const netRevenue = totalRevenue - totalFees;
      const averageBookingValue = filteredEarnings.length > 0 ? totalRevenue / filteredEarnings.length : 0;

      // Get top listings (simplified)
      const topListings = [
        {
          listingId: 'listing_1',
          title: 'Sample Listing 1',
          revenue: totalRevenue * 0.4,
        },
        {
          listingId: 'listing_2',
          title: 'Sample Listing 2',
          revenue: totalRevenue * 0.3,
        },
        {
          listingId: 'listing_3',
          title: 'Sample Listing 3',
          revenue: totalRevenue * 0.3,
        },
      ];

      return {
        totalRevenue,
        totalFees,
        netRevenue,
        averageBookingValue,
        topListings,
      };
    } catch (error) {
      console.error('Error getting billing analytics:', error);
      throw new Error('Failed to get billing analytics. Please try again.');
    }
  }
}
