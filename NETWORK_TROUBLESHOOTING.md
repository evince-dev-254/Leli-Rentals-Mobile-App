# Network Timeout Troubleshooting Guide

This guide helps resolve network timeout errors in your Leli Rentals app.

## ✅ **Fixes Applied**

### **1. Enhanced API Client (`lib/api-client.ts`)**
- **Timeout Protection**: Added 15-second timeout for all requests
- **Retry Logic**: Automatic retry with exponential backoff (max 2 retries)
- **Better Error Handling**: Specific error messages for different failure types
- **Network Detection**: Identifies network-related errors vs other issues

### **2. Network Utilities (`utils/networkUtils.ts`)**
- **Connectivity Check**: Tests internet connection before making requests
- **Enhanced Fetch**: `fetchWithTimeout()` with proper timeout handling
- **Retry Mechanism**: `retryWithBackoff()` for resilient network calls
- **Error Classification**: `isNetworkError()` to identify network issues

### **3. Network Status Component (`components/NetworkStatus.tsx`)**
- **Visual Feedback**: Shows connection status to users
- **Retry Button**: Allows manual connection retry
- **Auto-Check**: Monitors connection every 30 seconds

## 🔧 **How to Use**

### **In Your Components:**
```tsx
import { NetworkStatus } from '@/components/NetworkStatus';

function MyScreen() {
  return (
    <View>
      <NetworkStatus onRetry={() => {
        // Refresh data when connection is restored
        refetchData();
      }} />
      {/* Your content */}
    </View>
  );
}
```

### **For API Calls:**
```tsx
import { apiClient } from '@/lib/api-client';

// The API client now automatically handles:
// - Timeouts (15 seconds)
// - Retries (2 attempts with backoff)
// - Network error detection
const result = await apiClient.getListings();
```

## 🚨 **Common Timeout Causes & Solutions**

### **1. Slow Network Connection**
- **Cause**: Poor internet speed or unstable connection
- **Solution**: The app now retries automatically with longer timeouts

### **2. Server Overload**
- **Cause**: Backend server is slow or overloaded
- **Solution**: Retry logic gives server time to recover

### **3. Network Configuration Issues**
- **Cause**: Firewall, proxy, or DNS issues
- **Solution**: Better error messages help identify the specific issue

### **4. Mobile Network Issues**
- **Cause**: Switching between WiFi and cellular
- **Solution**: Network status component shows connection issues

## 📱 **User Experience Improvements**

### **Before (Problems):**
- ❌ Silent timeouts with no feedback
- ❌ No retry mechanism
- ❌ Generic error messages
- ❌ Users didn't know if it was their connection

### **After (Solutions):**
- ✅ Clear timeout messages
- ✅ Automatic retry with user feedback
- ✅ Specific error messages
- ✅ Visual connection status indicator

## 🔍 **Debugging Network Issues**

### **Check Network Status:**
```tsx
import { checkNetworkConnectivity } from '@/utils/networkUtils';

const status = await checkNetworkConnectivity();
console.log('Connected:', status.isConnected);
```

### **Test API Endpoints:**
```tsx
// Test if your backend is reachable
const result = await apiClient.getListings();
if (!result.success) {
  console.log('API Error:', result.error);
}
```

### **Monitor Network Calls:**
The API client now logs retry attempts:
```
Retrying request (attempt 1)...
Retrying request (attempt 2)...
```

## ⚙️ **Configuration Options**

### **Timeout Settings:**
- **API Timeout**: 15 seconds (configurable in `api-client.ts`)
- **Connectivity Check**: 5 seconds
- **Retry Attempts**: 2 maximum
- **Backoff Delay**: 1s, 2s, 4s (exponential)

### **Customize Timeouts:**
```tsx
// In lib/api-client.ts, line 69
}, 15000), // Change this number for different timeout
```

## 🎯 **Best Practices**

1. **Always show network status** in your main screens
2. **Provide retry buttons** for failed operations
3. **Cache data locally** to reduce network dependency
4. **Use offline indicators** when appropriate
5. **Test on different networks** (WiFi, 4G, 3G)

## 🚀 **Next Steps**

1. **Add the NetworkStatus component** to your main screens
2. **Test on different network conditions**
3. **Monitor error logs** for any remaining issues
4. **Consider implementing offline mode** for critical features

The timeout issues should now be significantly reduced with these improvements! 🎉
