# Shared Backend Setup Guide

This guide explains how to set up the shared backend that both the mobile app and website will use.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Website       │    │  Shared Backend │
│   (Expo/RN)     │    │   (Next.js)     │    │   (Node.js)    │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ API Client  │ │◄───┤ │ API Routes  │ │◄───┤ │ REST API    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    │                 │
                                               │ ┌─────────────┐ │
                                               │ │ PostgreSQL │ │
                                               │ │ Database   │ │
                                               │ └─────────────┘ │
                                               └─────────────────┘
```

## Setup Steps

### 1. Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```

4. **Configure your `.env` file:**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/leli_rentals"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=3001
   NODE_ENV="development"
   
   # CORS
   CORS_ORIGIN="http://localhost:3000,http://localhost:8081"
   
   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

5. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

### 2. Mobile App Setup

1. **Update environment variables in the mobile app:**
   Create or update `.env` file in the mobile app root:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3001/api
   ```

2. **The mobile app will automatically use the shared backend through the API client.**

### 3. Website Setup

1. **Update the website to use the shared backend:**
   - Replace existing API calls with calls to the shared backend
   - Update environment variables to point to the shared backend
   - Remove duplicate database connections

## Database Migration

### From Website's Current Database

If you want to migrate data from the website's current database:

1. **Export data from current database:**
   ```bash
   # Export users
   pg_dump -h localhost -U username -d current_db -t users --data-only > users.sql
   
   # Export listings
   pg_dump -h localhost -U username -d current_db -t listings --data-only > listings.sql
   
   # Export other tables...
   ```

2. **Import to new database:**
   ```bash
   psql -h localhost -U username -d leli_rentals < users.sql
   psql -h localhost -U username -d leli_rentals < listings.sql
   ```

### From Firebase (Mobile App)

If you want to migrate from Firebase:

1. **Export Firebase data:**
   - Use Firebase Admin SDK to export data
   - Convert Firebase documents to SQL format

2. **Import to PostgreSQL:**
   - Use the migration scripts in the backend

## API Endpoints

The shared backend provides these endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (authenticated)
- `PUT /api/listings/:id` - Update listing (owner only)
- `DELETE /api/listings/:id` - Delete listing (owner only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status

### Messages
- `GET /api/messages` - Get chat sessions
- `GET /api/messages/:chatSessionId` - Get messages for chat session
- `POST /api/messages/:chatSessionId` - Send message

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/listings` - Get user's listings
- `GET /api/users/bookings` - Get user's bookings (as owner)
- `GET /api/users/favorites` - Get user's favorites

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

### Interactions
- `POST /api/interactions/like` - Like/unlike listing
- `POST /api/interactions/save` - Save/unsave listing
- `POST /api/interactions/view` - Record view
- `POST /api/interactions/share` - Record share

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image` - Delete image

## Deployment

### Backend Deployment

1. **Deploy to Render (Recommended):**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

2. **Deploy to Railway:**
   - Connect repository
   - Set environment variables
   - Deploy

3. **Deploy to Heroku:**
   - Create Heroku app
   - Set environment variables
   - Deploy

### Update Mobile App

1. **Update API URL in mobile app:**
   ```env
   EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

2. **Update website API calls:**
   - Change all API calls to use the shared backend URL
   - Remove duplicate database connections

## Benefits of Shared Backend

1. **Single Source of Truth**: One database for both mobile and web
2. **Consistent API**: Same endpoints for both platforms
3. **Easier Maintenance**: Update once, affects both platforms
4. **Better Performance**: Optimized database queries
5. **Unified Authentication**: Same user accounts across platforms
6. **Real-time Features**: Shared messaging and notifications

## Testing

1. **Test backend locally:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test mobile app:**
   ```bash
   cd .. # back to mobile app root
   npm start
   ```

3. **Test website:**
   ```bash
   cd ../website-folder
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure CORS_ORIGIN includes your mobile app and website URLs
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Authentication**: Check JWT_SECRET is set
4. **File Upload**: Verify Cloudinary credentials

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
DEBUG=*
```

## Next Steps

1. Set up the backend following the steps above
2. Test the API endpoints
3. Update mobile app to use the shared backend
4. Update website to use the shared backend
5. Deploy to production
6. Monitor and maintain

This shared backend approach will give you a unified, scalable solution for both your mobile app and website.
