import {
    Background,
    Border,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground
} from '@/constants/Colors';
import { BookingService } from '@/services/BookingService';
import { NotificationService } from '@/services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
}

const ChatScreen = () => {
  const params = useLocalSearchParams();
  const { ownerId, listingId, ownerName, bookingId } = params as any;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock data - in real app, this would come from API
  const currentUser = {
    id: 'current-user-id',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  };

  const owner = {
    id: ownerId as string,
    name: ownerName as string || 'Owner',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
  };

  const listing = {
    id: listingId as string,
    title: 'Professional Camera Kit - Canon EOS R5',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
  };

  useEffect(() => {
    // Load existing messages and start polling for near real-time updates
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      // In real app, fetch messages from API via BookingService.getBooking(bookingId)
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: owner.id,
          senderName: owner.name,
          message: 'Hi! Thanks for your interest in my camera kit. How can I help you?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          type: 'text',
        },
        {
          id: '2',
          senderId: currentUser.id,
          senderName: currentUser.name,
          message: 'Hello! I\'m interested in renting your camera for a wedding shoot this weekend. Is it available?',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          type: 'text',
        },
        {
          id: '3',
          senderId: owner.id,
          senderName: owner.name,
          message: 'Yes, it\'s available! The camera is in excellent condition and comes with all accessories. What dates do you need it for?',
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          type: 'text',
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate owner response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: owner.id,
        senderName: owner.name,
        message: 'Thanks for your message! I\'ll get back to you shortly.',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages(prev => [...prev, response]);
    }, 2000);

    try {
      // In real app, send message via API
      await BookingService.addBookingMessage(
        bookingId || 'booking-id', // In real app, required
        currentUser.id,
        currentUser.name,
        message.message
      );
    } catch (error) {
      console.error('Error sending message:', error);
      NotificationService.getInstance().showError(
        'Message Failed',
        'Unable to send message. Please try again.'
      );
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    const isOwn = message.senderId === currentUser.id;
    
    return (
      <View key={message.id} style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage]}>
        {!isOwn && (
          <Image source={{ uri: owner.avatar }} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
          {!isOwn && (
            <Text style={styles.senderName}>{message.senderName}</Text>
          )}
          <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
            {message.message}
          </Text>
          <Text style={[styles.messageTime, isOwn ? styles.ownMessageTime : styles.otherMessageTime]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
        {isOwn && (
          <Image source={{ uri: currentUser.avatar }} style={styles.messageAvatar} />
        )}
      </View>
    );
  };

  const quickReplies = [
    'Is this item still available?',
    'What are the rental terms?',
    'Can I see more photos?',
    'What\'s the pickup location?',
    'Do you offer delivery?',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={PrimaryText} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image source={{ uri: owner.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{owner.name}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => {
            Alert.alert(
              'Contact Options',
              'Choose how you\'d like to contact the owner',
              [
                { text: 'Call', onPress: () => console.log('Call owner') },
                { text: 'Email', onPress: () => console.log('Email owner') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={PrimaryText} />
        </TouchableOpacity>
      </View>

      {/* Listing Info */}
      <View style={styles.listingInfo}>
        <Image source={{ uri: listing.image }} style={styles.listingImage} />
        <View style={styles.listingDetails}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <Text style={styles.listingPrice}>KES {listing.price.toLocaleString()}/day</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewListingButton}
          onPress={() => router.push(`/(renter)/listing-detail?id=${listing.id}`)}
        >
          <Text style={styles.viewListingText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.otherMessage]}>
              <Image source={{ uri: owner.avatar }} style={styles.messageAvatar} />
              <View style={[styles.messageBubble, styles.otherBubble]}>
                <Text style={styles.typingText}>Typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Replies */}
        {messages.length === 0 && (
          <View style={styles.quickRepliesContainer}>
            <Text style={styles.quickRepliesTitle}>Quick Questions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickReplyButton}
                  onPress={() => setNewMessage(reply)}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor={SecondaryText}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.disabledSendButton]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  headerStatus: {
    fontSize: 12,
    color: Success,
  },
  moreButton: {
    padding: 8,
  },
  listingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  listingImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  listingDetails: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 2,
  },
  listingPrice: {
    fontSize: 12,
    color: PrimaryBrand,
    fontWeight: 'bold',
  },
  viewListingButton: {
    backgroundColor: PrimaryBrand,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewListingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: PrimaryBrand,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: WhiteBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Border,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: PrimaryText,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: SecondaryText,
  },
  typingText: {
    fontSize: 14,
    color: SecondaryText,
    fontStyle: 'italic',
  },
  quickRepliesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WhiteBackground,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  quickRepliesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 8,
  },
  quickReplyButton: {
    backgroundColor: Background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Border,
  },
  quickReplyText: {
    fontSize: 12,
    color: PrimaryText,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WhiteBackground,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: PrimaryText,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: PrimaryBrand,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: SecondaryText,
  },
});

export default ChatScreen;
