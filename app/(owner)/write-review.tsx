import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    DarkBackground,
    DarkBorder,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    WhiteBackground
} from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WriteReviewScreen() {
  const { isDark } = useTheme();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a review title.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Comment Required', 'Please write a review comment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Review Submitted',
        'Thank you for your review! It will be published after moderation.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleRatingPress(index + 1)}
        style={styles.starButton}
      >
        <Ionicons
          name={index < rating ? 'star' : 'star-outline'}
          size={32}
          color={index < rating ? '#fbbf24' : '#d1d5db'}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      <BackButton onPress={() => router.back()} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? DarkText : PrimaryText }]}>
          Write a Review
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Share your experience with others
        </Text>

        {/* Rating Section */}
        <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Rating *
          </Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          {rating > 0 && (
            <Text style={[styles.ratingText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
            </Text>
          )}
        </View>

        {/* Title Section */}
        <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Review Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? DarkBackground : WhiteBackground,
                color: isDark ? DarkText : PrimaryText,
                borderColor: isDark ? DarkBorder : Border,
              }
            ]}
            placeholder="Enter a title for your review"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Comment Section */}
        <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Your Review *
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: isDark ? DarkBackground : WhiteBackground,
                color: isDark ? DarkText : PrimaryText,
                borderColor: isDark ? DarkBorder : Border,
              }
            ]}
            placeholder="Tell others about your experience..."
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            maxLength={500}
          />
          <Text style={[styles.characterCount, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            {comment.length}/500 characters
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isSubmitting ? SecondaryText : PrimaryBrand },
            isSubmitting && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: WhiteBackground,
    fontSize: 18,
    fontWeight: '600',
  },
});
