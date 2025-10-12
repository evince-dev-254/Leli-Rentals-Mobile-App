import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  PrimaryText, 
  SecondaryText, 
  Border,
  Success,
  Error,
  Warning
} from '@/constants/Colors';

const TestIntegrationScreen = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const testSuites = [
    {
      id: 'auth',
      name: 'Authentication API',
      description: 'Test user login, registration, and token validation',
      endpoint: '/api/auth',
      status: 'pending',
    },
    {
      id: 'listings',
      name: 'Listings API',
      description: 'Test listing creation, retrieval, and updates',
      endpoint: '/api/listings',
      status: 'pending',
    },
    {
      id: 'bookings',
      name: 'Bookings API',
      description: 'Test booking creation and management',
      endpoint: '/api/bookings',
      status: 'pending',
    },
    {
      id: 'payments',
      name: 'Payments API',
      description: 'Test payment processing and validation',
      endpoint: '/api/payments',
      status: 'pending',
    },
    {
      id: 'notifications',
      name: 'Notifications API',
      description: 'Test push notifications and email services',
      endpoint: '/api/notifications',
      status: 'pending',
    },
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const test of testSuites) {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = {
        id: test.id,
        name: test.name,
        status: Math.random() > 0.2 ? 'passed' : 'failed',
        responseTime: Math.floor(Math.random() * 500) + 100,
        error: Math.random() > 0.8 ? 'Connection timeout' : null,
      };
      
      setTestResults(prev => [...prev, result]);
    }
    
    setIsRunning(false);
  };

  const runSingleTest = async (testId) => {
    const test = testSuites.find(t => t.id === testId);
    if (!test) return;

    setIsRunning(true);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = {
      id: test.id,
      name: test.name,
      status: Math.random() > 0.3 ? 'passed' : 'failed',
      responseTime: Math.floor(Math.random() * 500) + 100,
      error: Math.random() > 0.7 ? 'API endpoint not found' : null,
    };
    
    setTestResults(prev => [...prev.filter(r => r.id !== testId), result]);
    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return Success;
      case 'failed': return Error;
      case 'pending': return Warning;
      default: return SecondaryText;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      case 'pending': return 'time';
      default: return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={PrimaryBrand} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Integration Testing</Text>
          <Text style={styles.subtitle}>Test API endpoints and services</Text>
        </View>

        {/* Test Controls */}
        <View style={styles.section}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.runButton, isRunning && styles.disabledButton]} 
              onPress={runAllTests}
              disabled={isRunning}
            >
              <Ionicons name="play" size={20} color={WhiteBackground} />
              <Text style={styles.runButtonText}>
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setTestResults([])}
            >
              <Ionicons name="trash" size={20} color={Error} />
              <Text style={styles.clearButtonText}>Clear Results</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Test Suites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Suites</Text>
          {testSuites.map((test) => {
            const result = testResults.find(r => r.id === test.id);
            const status = result?.status || 'pending';
            
            return (
              <View key={test.id} style={styles.testCard}>
                <View style={styles.testHeader}>
                  <View style={styles.testInfo}>
                    <Text style={styles.testName}>{test.name}</Text>
                    <Text style={styles.testDescription}>{test.description}</Text>
                    <Text style={styles.testEndpoint}>{test.endpoint}</Text>
                  </View>
                  <View style={styles.testStatus}>
                    <Ionicons 
                      name={getStatusIcon(status)} 
                      size={24} 
                      color={getStatusColor(status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                      {status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                {result && (
                  <View style={styles.testResult}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Response Time:</Text>
                      <Text style={styles.resultValue}>{result.responseTime}ms</Text>
                    </View>
                    {result.error && (
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Error:</Text>
                        <Text style={[styles.resultValue, { color: Error }]}>{result.error}</Text>
                      </View>
                    )}
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.runSingleButton}
                  onPress={() => runSingleTest(test.id)}
                  disabled={isRunning}
                >
                  <Text style={styles.runSingleButtonText}>Run Test</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Results Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Tests:</Text>
                <Text style={styles.summaryValue}>{testResults.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Passed:</Text>
                <Text style={[styles.summaryValue, { color: Success }]}>
                  {testResults.filter(r => r.status === 'passed').length}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Failed:</Text>
                <Text style={[styles.summaryValue, { color: Error }]}>
                  {testResults.filter(r => r.status === 'failed').length}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Success Rate:</Text>
                <Text style={styles.summaryValue}>
                  {Math.round((testResults.filter(r => r.status === 'passed').length / testResults.length) * 100)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* API Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Status</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <Ionicons name="server" size={24} color={Success} />
              <Text style={styles.statusCardTitle}>Main API</Text>
              <Text style={styles.statusCardStatus}>Online</Text>
            </View>
            <View style={styles.statusCard}>
              <Ionicons name="card" size={24} color={Success} />
              <Text style={styles.statusCardTitle}>Payment API</Text>
              <Text style={styles.statusCardStatus}>Online</Text>
            </View>
            <View style={styles.statusCard}>
              <Ionicons name="mail" size={24} color={Warning} />
              <Text style={styles.statusCardTitle}>Email Service</Text>
              <Text style={styles.statusCardStatus}>Degraded</Text>
            </View>
            <View style={styles.statusCard}>
              <Ionicons name="notifications" size={24} color={Success} />
              <Text style={styles.statusCardTitle}>Push Service</Text>
              <Text style={styles.statusCardStatus}>Online</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  runButton: {
    flex: 1,
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: SecondaryText,
  },
  runButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  clearButton: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Error,
  },
  clearButtonText: {
    color: Error,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  testCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: SecondaryText,
    marginBottom: 4,
  },
  testEndpoint: {
    fontSize: 12,
    color: PrimaryBrand,
    fontFamily: 'monospace',
  },
  testStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  testResult: {
    backgroundColor: Background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 14,
    color: SecondaryText,
  },
  resultValue: {
    fontSize: 14,
    color: PrimaryText,
    fontWeight: '600',
  },
  runSingleButton: {
    backgroundColor: Background,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  runSingleButtonText: {
    color: PrimaryBrand,
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: SecondaryText,
  },
  summaryValue: {
    fontSize: 16,
    color: PrimaryText,
    fontWeight: 'bold',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  statusCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginTop: 8,
    marginBottom: 4,
  },
  statusCardStatus: {
    fontSize: 12,
    color: Success,
    fontWeight: '600',
  },
});

export default TestIntegrationScreen;
