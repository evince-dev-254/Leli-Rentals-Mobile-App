import {
    Background,
    Border,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground,
} from '@/constants/Colors';
import { BookingService } from '@/services/BookingService';
import { NotificationService } from '@/services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

const OwnerChatScreen = () => {
  const params = useLocalSearchParams();
  const { renterId, renterName, bookingId, listingId } = params as any;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const currentUser = {
    id: 'current-owner-id',
    name: 'Owner',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop',
  };

  const renter = {
    id: renterId as string,
    name: (renterName as string) || 'Renter',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      // Replace with BookingService.getBooking(bookingId) and map to messages
      const mock: Message[] = [];
      setMessages(mock);
    } catch (e) {
      console.error('Error loading messages:', e);
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

    try {
      await BookingService.addBookingMessage(
        bookingId || 'booking-id',
        currentUser.id,
        currentUser.name,
        message.message
      );
    } catch (error) {
      console.error('Error sending message:', error);
      NotificationService.getInstance().showError('Message Failed', 'Unable to send message.');
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
          <Image source={{ uri: renter.avatar }} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
          {!isOwn && <Text style={styles.senderName}>{message.senderName}</Text>}
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={PrimaryText} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={{ uri: renter.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{renter.name}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.messagesContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
        </ScrollView>

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
          <TouchableOpacity style={[styles.sendButton, !newMessage.trim() && styles.disabledSendButton]} onPress={sendMessage} disabled={!newMessage.trim()}>
            <Ionicons name="send" size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: WhiteBackground, borderBottomWidth: 1, borderBottomColor: Border },
  backButton: { padding: 8, marginRight: 8 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  headerText: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: 'bold', color: PrimaryText },
  headerStatus: { fontSize: 12, color: Success },
  messagesContainer: { flex: 1 },
  messagesList: { flex: 1, paddingHorizontal: 16 },
  messageContainer: { flexDirection: 'row', marginVertical: 4, alignItems: 'flex-end' },
  ownMessage: { justifyContent: 'flex-end' },
  otherMessage: { justifyContent: 'flex-start' },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 8 },
  messageBubble: { maxWidth: '70%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  ownBubble: { backgroundColor: PrimaryBrand, borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: WhiteBackground, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Border },
  senderName: { fontSize: 12, fontWeight: '600', color: PrimaryText, marginBottom: 2 },
  messageText: { fontSize: 14, lineHeight: 20 },
  ownMessageText: { color: 'white' },
  otherMessageText: { color: PrimaryText },
  messageTime: { fontSize: 10, marginTop: 4 },
  ownMessageTime: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  otherMessageTime: { color: SecondaryText },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: WhiteBackground, borderTopWidth: 1, borderTopColor: Border },
  messageInput: { flex: 1, borderWidth: 1, borderColor: Border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: PrimaryText, maxHeight: 100, marginRight: 8 },
  sendButton: { backgroundColor: PrimaryBrand, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  disabledSendButton: { backgroundColor: SecondaryText },
});

export default OwnerChatScreen;


