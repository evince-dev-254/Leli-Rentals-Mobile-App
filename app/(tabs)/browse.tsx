import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    DarkBorder,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantOrange,
    WhiteBackground
} from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationService } from '@/services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const BrowseScreen = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'cars', name: 'Cars', icon: 'car-outline' },
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: 'tools', name: 'Tools', icon: 'hammer-outline' },
    { id: 'sports', name: 'Sports', icon: 'football-outline' },
    { id: 'furniture', name: 'Furniture', icon: 'bed-outline' },
    { id: 'books', name: 'Books', icon: 'book-outline' },
  ];

  const featuredItems = [
    {
      id: 1,
      title: 'Professional Camera Kit',
      category: 'Electronics',
      price: 'KSh 2,500/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 2,
      title: 'Power Drill Set',
      category: 'Tools',
      price: 'KSh 800/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 3,
      title: 'Mountain Bike',
      category: 'Sports',
      price: 'KSh 1,200/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: false,
    },
    {
      id: 4,
      title: 'Office Chair',
      category: 'Furniture',
      price: 'KSh 500/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 5,
      title: 'MacBook Pro 16"',
      category: 'Electronics',
      price: 'KSh 3,500/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 6,
      title: 'Circular Saw',
      category: 'Tools',
      price: 'KSh 1,200/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 7,
      title: 'Tennis Racket',
      category: 'Sports',
      price: 'KSh 400/day',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 8,
      title: 'Dining Table Set',
      category: 'Furniture',
      price: 'KSh 1,800/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: false,
    },
    {
      id: 9,
      title: 'iPhone 15 Pro',
      category: 'Electronics',
      price: 'KSh 2,000/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 10,
      title: 'Hammer Set',
      category: 'Tools',
      price: 'KSh 300/day',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 11,
      title: 'Football',
      category: 'Sports',
      price: 'KSh 200/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 12,
      title: 'Sofa Set',
      category: 'Furniture',
      price: 'KSh 2,500/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 13,
      title: 'Gaming Laptop',
      category: 'Electronics',
      price: 'KSh 4,000/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: false,
    },
    {
      id: 14,
      title: 'Wrench Set',
      category: 'Tools',
      price: 'KSh 600/day',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 15,
      title: 'Basketball',
      category: 'Sports',
      price: 'KSh 300/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 16,
      title: 'Bookshelf',
      category: 'Furniture',
      price: 'KSh 800/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 17,
      title: 'iPad Pro',
      category: 'Electronics',
      price: 'KSh 2,200/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 18,
      title: 'Screwdriver Set',
      category: 'Tools',
      price: 'KSh 400/day',
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 19,
      title: 'Badminton Set',
      category: 'Sports',
      price: 'KSh 500/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 20,
      title: 'Coffee Table',
      category: 'Furniture',
      price: 'KSh 600/day',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: false,
    },
    {
      id: 21,
      title: 'Samsung Galaxy S24',
      category: 'Electronics',
      price: 'KSh 1,800/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 22,
      title: 'Level Tool',
      category: 'Tools',
      price: 'KSh 350/day',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 23,
      title: 'Swimming Goggles',
      category: 'Sports',
      price: 'KSh 150/day',
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 24,
      title: 'Wardrobe',
      category: 'Furniture',
      price: 'KSh 1,500/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 25,
      title: 'Nintendo Switch',
      category: 'Electronics',
      price: 'KSh 1,500/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 26,
      title: 'Measuring Tape',
      category: 'Tools',
      price: 'KSh 200/day',
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 27,
      title: 'Yoga Mat',
      category: 'Sports',
      price: 'KSh 250/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 28,
      title: 'Study Desk',
      category: 'Furniture',
      price: 'KSh 700/day',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: false,
    },
    {
      id: 29,
      title: 'AirPods Pro',
      category: 'Electronics',
      price: 'KSh 800/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 30,
      title: 'Paint Brush Set',
      category: 'Tools',
      price: 'KSh 300/day',
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 31,
      title: 'Golf Clubs',
      category: 'Sports',
      price: 'KSh 2,000/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 32,
      title: 'TV Stand',
      category: 'Furniture',
      price: 'KSh 900/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 33,
      title: 'PlayStation 5',
      category: 'Electronics',
      price: 'KSh 3,000/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: false,
    },
    {
      id: 34,
      title: 'Safety Helmet',
      category: 'Tools',
      price: 'KSh 400/day',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 35,
      title: 'Running Shoes',
      category: 'Sports',
      price: 'KSh 600/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 36,
      title: 'Bed Frame',
      category: 'Furniture',
      price: 'KSh 1,200/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 37,
      title: 'Smart Watch',
      category: 'Electronics',
      price: 'KSh 1,000/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 38,
      title: 'Ladder',
      category: 'Tools',
      price: 'KSh 800/day',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 39,
      title: 'Treadmill',
      category: 'Sports',
      price: 'KSh 2,500/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: false,
    },
    {
      id: 40,
      title: 'Dining Chairs',
      category: 'Furniture',
      price: 'KSh 1,000/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 41,
      title: 'Bluetooth Speaker',
      category: 'Electronics',
      price: 'KSh 600/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 42,
      title: 'Toolbox',
      category: 'Tools',
      price: 'KSh 500/day',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 43,
      title: 'Skateboard',
      category: 'Sports',
      price: 'KSh 400/day',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 44,
      title: 'Bookshelf Unit',
      category: 'Furniture',
      price: 'KSh 1,100/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 45,
      title: 'Tablet',
      category: 'Electronics',
      price: 'KSh 1,400/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 46,
      title: 'Extension Cord',
      category: 'Tools',
      price: 'KSh 250/day',
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 47,
      title: 'Basketball Hoop',
      category: 'Sports',
      price: 'KSh 1,800/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: false,
    },
    {
      id: 48,
      title: 'Office Desk',
      category: 'Furniture',
      price: 'KSh 1,300/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 49,
      title: 'Drone',
      category: 'Electronics',
      price: 'KSh 4,500/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 50,
      title: 'Generator',
      category: 'Tools',
      price: 'KSh 3,000/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 51,
      title: 'Tennis Table',
      category: 'Sports',
      price: 'KSh 1,500/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 52,
      title: 'Recliner Chair',
      category: 'Furniture',
      price: 'KSh 1,800/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 53,
      title: 'VR Headset',
      category: 'Electronics',
      price: 'KSh 2,800/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: false,
    },
    {
      id: 54,
      title: 'Pressure Washer',
      category: 'Tools',
      price: 'KSh 2,200/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 55,
      title: 'Toyota Corolla',
      category: 'Cars',
      price: 'KSh 8,000/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 56,
      title: 'Honda Civic',
      category: 'Cars',
      price: 'KSh 7,500/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 57,
      title: 'Nissan X-Trail',
      category: 'Cars',
      price: 'KSh 12,000/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: false,
    },
    {
      id: 58,
      title: 'Mazda CX-5',
      category: 'Cars',
      price: 'KSh 10,500/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 59,
      title: 'Subaru Outback',
      category: 'Cars',
      price: 'KSh 11,000/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 60,
      title: 'Programming Books Set',
      category: 'Books',
      price: 'KSh 300/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 61,
      title: 'Business Strategy Books',
      category: 'Books',
      price: 'KSh 250/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: true,
    },
    {
      id: 62,
      title: 'Design Thinking Collection',
      category: 'Books',
      price: 'KSh 400/day',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 63,
      title: 'Photography Guide Books',
      category: 'Books',
      price: 'KSh 350/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: false,
    },
    {
      id: 64,
      title: 'Language Learning Books',
      category: 'Books',
      price: 'KSh 200/day',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
    {
      id: 65,
      title: 'Mercedes C-Class',
      category: 'Cars',
      price: 'KSh 15,000/day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Nairobi, Kenya',
      available: true,
    },
    {
      id: 66,
      title: 'BMW 3 Series',
      category: 'Cars',
      price: 'KSh 14,000/day',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Mombasa, Kenya',
      available: false,
    },
    {
      id: 67,
      title: 'Audi A4',
      category: 'Cars',
      price: 'KSh 13,500/day',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Kisumu, Kenya',
      available: true,
    },
    {
      id: 68,
      title: 'Cooking Recipe Books',
      category: 'Books',
      price: 'KSh 180/day',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Nakuru, Kenya',
      available: true,
    },
    {
      id: 69,
      title: 'Fitness & Health Books',
      category: 'Books',
      price: 'KSh 220/day',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      location: 'Thika, Kenya',
      available: true,
    },
    {
      id: 70,
      title: 'Volkswagen Golf',
      category: 'Cars',
      price: 'KSh 6,500/day',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      location: 'Eldoret, Kenya',
      available: true,
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        {
          backgroundColor: selectedCategory === item.id 
            ? PrimaryBrand 
            : (isDark ? DarkCard : WhiteBackground),
          borderColor: isDark ? DarkBorder : Border,
        }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={20} 
        color={selectedCategory === item.id ? WhiteBackground : (isDark ? DarkText : PrimaryText)} 
      />
      <Text style={[
        styles.categoryText,
        {
          color: selectedCategory === item.id 
            ? WhiteBackground 
            : (isDark ? DarkText : PrimaryText)
        }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    if (!item.available) {
      Alert.alert('Item Unavailable', 'This item is currently not available for rent.');
      return;
    }
    
    Alert.alert(
      'Rent Item',
      `Would you like to rent "${item.title}" for ${item.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rent Now', 
          onPress: async () => {
            // Send notifications
            try {
              // Send booking confirmation to renter
              await NotificationService.sendBookingNotification(item.title);
              
              // Send rental notification to owner (use current user's name)
              const renterName = user?.displayName || user?.email?.split('@')[0] || 'User';
              await NotificationService.sendRentalNotification(item.title, renterName);
              
              console.log('Notifications sent successfully');
            } catch (error) {
              console.log('Error sending notifications:', error);
            }
            
            // Navigate to booking/rental flow
            router.push('/booking-calendar');
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.itemCard,
        !item.available && styles.unavailableCard
      ]}
      onPress={() => handleItemPress(item)}
      disabled={!item.available}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemOverlay}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        {!item.available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
        {item.available && (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Available</Text>
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: isDark ? DarkText : PrimaryText }]}>
          {item.title}
        </Text>
        <View style={styles.itemDetails}>
          <Ionicons name="location-outline" size={14} color={isDark ? DarkSecondaryText : SecondaryText} />
          <Text style={[styles.itemLocation, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            {item.location}
          </Text>
        </View>
        <View style={styles.itemFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={VibrantOrange} />
            <Text style={[styles.ratingText, { color: isDark ? DarkText : PrimaryText }]}>
              {item.rating}
            </Text>
          </View>
          <Text style={[styles.itemPrice, { color: PrimaryBrand }]}>
            {item.price}
          </Text>
        </View>
        {item.available && (
          <View style={styles.rentButton}>
            <Text style={styles.rentButtonText}>Tap to Rent</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Background : Background }]}>
      {/* Back Button */}
      <BackButton onPress={() => router.push('/(tabs)')} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Browse Rentals
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Discover items to rent
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <Ionicons name="search" size={20} color={isDark ? DarkSecondaryText : SecondaryText} />
        <TextInput
          style={[styles.searchInput, { color: isDark ? DarkText : PrimaryText }]}
          placeholder="Search for items..."
          placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={isDark ? DarkSecondaryText : SecondaryText} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Categories
        </Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Featured Items */}
      <View style={styles.itemsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Featured Items
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: PrimaryBrand }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itemsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  itemsContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemCard: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableCard: {
    opacity: 0.6,
  },
  itemImage: {
    width: '100%',
    height: 120,
  },
  itemOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unavailableBadge: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unavailableText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: 'rgba(34,197,94,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemLocation: {
    marginLeft: 4,
    fontSize: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rentButton: {
    backgroundColor: PrimaryBrand,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  rentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BrowseScreen;
