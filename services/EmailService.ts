// Email service for sending welcome and reminder emails
// This would typically connect to your backend API

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const emailTemplate: EmailTemplate = {
        to: userEmail,
        subject: "🎉 Welcome to Leli Rentals - Your Rental Journey Starts Here!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; font-size: 28px;">Welcome to Leli Rentals!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${userName}! 👋</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #555;">
                Welcome to the best rental platform! We're excited to have you join our community of smart renters and owners.
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #d97706;">🚀 What you can do now:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li>Browse thousands of items to rent</li>
                <li>List your own items and earn money</li>
                <li>Connect with verified renters and owners</li>
                <li>Enjoy secure transactions and insurance</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://your-app-url.com/explore" 
                 style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Start Exploring Now
              </a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
              <p>Happy renting!</p>
              <p>The Leli Rentals Team</p>
            </div>
          </div>
        `,
        text: `
          Welcome to Leli Rentals!
          
          Hi ${userName}!
          
          Welcome to the best rental platform! We're excited to have you join our community.
          
          What you can do now:
          - Browse thousands of items to rent
          - List your own items and earn money
          - Connect with verified renters and owners
          - Enjoy secure transactions and insurance
          
          Start exploring: https://your-app-url.com/explore
          
          Happy renting!
          The Leli Rentals Team
        `
      };

      // In a real app, you would make an API call to your backend
      console.log('Sending welcome email:', emailTemplate);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  static async sendReminderEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const emailTemplate: EmailTemplate = {
        to: userEmail,
        subject: "🛍️ Don't miss out - Amazing items are waiting for you!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; font-size: 24px;">We miss you! 👋</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #555;">
                We noticed you haven't explored our amazing rental items yet. Don't miss out on incredible deals and unique items waiting just for you!
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #d97706;">🔥 What's trending now:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li>Professional Camera Equipment - Perfect for events</li>
                <li>Power Tools - For your DIY projects</li>
                <li>Sports Equipment - Stay active and healthy</li>
                <li>Electronics - Latest gadgets and accessories</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://your-app-url.com/browse" 
                 style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Browse Items Now
              </a>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> First-time users get 20% off their first rental!
              </p>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
              <p>Happy renting!</p>
              <p>The Leli Rentals Team</p>
            </div>
          </div>
        `,
        text: `
          We miss you!
          
          Hi ${userName}!
          
          We noticed you haven't explored our amazing rental items yet. Don't miss out on incredible deals!
          
          What's trending now:
          - Professional Camera Equipment
          - Power Tools
          - Sports Equipment
          - Electronics
          
          Browse items: https://your-app-url.com/browse
          
          Pro Tip: First-time users get 20% off their first rental!
          
          Happy renting!
          The Leli Rentals Team
        `
      };

      // In a real app, you would make an API call to your backend
      console.log('Sending reminder email:', emailTemplate);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending reminder email:', error);
      return false;
    }
  }

  static async sendBookingConfirmationEmail(userEmail: string, userName: string, itemName: string, bookingDetails: any): Promise<boolean> {
    try {
      const emailTemplate: EmailTemplate = {
        to: userEmail,
        subject: "✅ Booking Confirmed - Your rental is ready!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #28a745; font-size: 24px;">Booking Confirmed! ✅</h1>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #155724; margin-top: 0;">Hi ${userName}!</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #155724; margin: 0;">
                Your booking for <strong>${itemName}</strong> has been confirmed successfully!
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">📋 Booking Details:</h3>
              <p style="color: #555; margin: 5px 0;"><strong>Item:</strong> ${itemName}</p>
              <p style="color: #555; margin: 5px 0;"><strong>Booking ID:</strong> #${bookingDetails.id || '12345'}</p>
              <p style="color: #555; margin: 5px 0;"><strong>Duration:</strong> ${bookingDetails.duration || '1 day'}</p>
              <p style="color: #555; margin: 5px 0;"><strong>Total:</strong> $${bookingDetails.total || '25.00'}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://your-app-url.com/my-bookings" 
                 style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View My Bookings
              </a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
              <p>Thank you for choosing Leli Rentals!</p>
              <p>The Leli Rentals Team</p>
            </div>
          </div>
        `,
        text: `
          Booking Confirmed!
          
          Hi ${userName}!
          
          Your booking for ${itemName} has been confirmed successfully!
          
          Booking Details:
          - Item: ${itemName}
          - Booking ID: #${bookingDetails.id || '12345'}
          - Duration: ${bookingDetails.duration || '1 day'}
          - Total: $${bookingDetails.total || '25.00'}
          
          View bookings: https://your-app-url.com/my-bookings
          
          Thank you for choosing Leli Rentals!
          The Leli Rentals Team
        `
      };

      console.log('Sending booking confirmation email:', emailTemplate);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      return false;
    }
  }

  static async sendVerificationReminderEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const emailTemplate: EmailTemplate = {
        to: userEmail,
        subject: "⚠️ Action Required: Complete Your Owner Verification",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; font-size: 24px;">⚠️ Verification Required</h1>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #856404; margin-top: 0;">Hi ${userName}! 👋</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #856404;">
                <strong>Important:</strong> As an owner on Leli Rentals, you need to complete ID verification within 2 days of account creation to maintain your owner status.
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #d97706;">📋 What you need to do:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li>Upload a clear photo of your ID card or passport</li>
                <li>Provide additional verification documents if requested</li>
                <li>Wait for our team to review your documents (usually within 24 hours)</li>
                <li>Start listing your items once verified!</li>
              </ul>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Why verification is required:</strong> We verify all owners to ensure a safe and trustworthy marketplace for all users.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://your-app-url.com/owner-verification" 
                 style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Complete Verification Now
              </a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
              <p>Questions? Contact our support team.</p>
              <p>The Leli Rentals Team</p>
            </div>
          </div>
        `,
        text: `Hi ${userName}! Complete your owner verification within 2 days to maintain your owner status. Visit the app to upload your ID documents.`
      };

      console.log('Sending verification reminder email:', emailTemplate);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending verification reminder email:', error);
      return false;
    }
  }
}
