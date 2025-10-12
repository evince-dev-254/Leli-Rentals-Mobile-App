import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  PrimaryText, 
  SecondaryText, 
  Border,
  Success,
  Error
} from '@/constants/Colors';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Leli Rentals AI Assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickActions = [
    { text: "How do I rent an item?", icon: "help-circle" },
    { text: "Payment methods", icon: "card" },
    { text: "Cancel booking", icon: "close-circle" },
    { text: "Contact support", icon: "call" },
  ];

  const getContextualResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Handle specific queries with contextual responses
    if (message.includes('rent') || message.includes('rental') || message.includes('book')) {
      return "I can help you with rental questions! You can browse our categories to find items, or use the search function to look for specific items. Would you like me to guide you through the rental process?";
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('billing')) {
      return "For payment and billing questions, we accept all major credit cards, PayPal, and bank transfers. All payments are processed securely. You can manage your payment methods in your profile settings.";
    }
    
    if (message.includes('cancel') || message.includes('refund')) {
      return "You can cancel a booking up to 24 hours before the rental period starts. Go to your bookings and click 'Cancel'. For refunds, please contact our support team at +254 112 081 866.";
    }
    
    if (message.includes('damage') || message.includes('broken') || message.includes('issue')) {
      return "If you encounter any issues with a rental item, please report it immediately through the app. We have insurance coverage and a dispute resolution process to handle such situations.";
    }
    
    if (message.includes('contact') || message.includes('support') || message.includes('help')) {
      return "I'm here to help! For immediate assistance, you can:\n• Call us at +254 112 081 866\n• Email us at lelirentalsmail@gmail.com\n• Use this chat for general questions\nOur support team is available 24/7!";
    }
    
    if (message.includes('account') || message.includes('profile') || message.includes('login')) {
      return "For account-related issues, please check your profile settings or contact our support team. You can update your information, manage notifications, and view your rental history from your profile.";
    }
    
    if (message.includes('list') || message.includes('sell') || message.includes('owner')) {
      return "To list items for rent, go to your profile and click 'List Item'. Follow the step-by-step process to add your item details, photos, and pricing. Our team can help you optimize your listings!";
    }
    
    // Default responses for general queries
    const defaultResponses = [
      "I'd be happy to help you with that! Let me connect you with our support team.",
      "That's a great question! Our support team can assist you with that specific issue.",
      "I understand your concern. Let me provide you with the best solution.",
      "Thank you for contacting Leli Rentals! How else can I assist you today?",
      "I'm here to help! What specific information do you need about our rental services?",
      "For immediate assistance, please call +254 112 081 866 or email lelirentalsmail@gmail.com"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Simulate AI response after 1-2 seconds with contextual responses
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getContextualResponse(currentInput),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <Ionicons name="chatbubbles" size={20} color={WhiteBackground} />
          </View>
          <View>
            <Text style={styles.aiName}>Leli AI Assistant</Text>
            <Text style={styles.aiStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={PrimaryText} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageContainer,
            message.isUser ? styles.userMessage : styles.aiMessage
          ]}>
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.aiText
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.timestamp,
                message.isUser ? styles.userTimestamp : styles.aiTimestamp
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionButton}
                  onPress={() => {
                    setInputText(action.text);
                    sendMessage();
                  }}
                >
                  <Ionicons name={action.icon as any} size={16} color={PrimaryBrand} />
                  <Text style={styles.quickActionText}>{action.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={SecondaryText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
        >
          <Ionicons name="send" size={20} color={WhiteBackground} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PrimaryBrand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  aiStatus: {
    fontSize: 12,
    color: Success,
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: PrimaryBrand,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: WhiteBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: WhiteBackground,
  },
  aiText: {
    color: PrimaryText,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: SecondaryText,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SecondaryText,
    marginHorizontal: 2,
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: WhiteBackground,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: PrimaryText,
    backgroundColor: Background,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PrimaryBrand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: SecondaryText,
  },
  quickActionsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Border,
    flex: 1,
    minWidth: '48%',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: PrimaryText,
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default AIChat;
