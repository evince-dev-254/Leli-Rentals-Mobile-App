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

const TestDatabaseScreen = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const databaseTests = [
    {
      id: 'connection',
      name: 'Database Connection',
      description: 'Test connection to the database server',
      status: 'pending',
    },
    {
      id: 'users',
      name: 'Users Table',
      description: 'Test user data operations (CRUD)',
      status: 'pending',
    },
    {
      id: 'listings',
      name: 'Listings Table',
      description: 'Test listing data operations',
      status: 'pending',
    },
    {
      id: 'bookings',
      name: 'Bookings Table',
      description: 'Test booking data operations',
      status: 'pending',
    },
    {
      id: 'payments',
      name: 'Payments Table',
      description: 'Test payment data operations',
      status: 'pending',
    },
    {
      id: 'performance',
      name: 'Query Performance',
      description: 'Test database query execution times',
      status: 'pending',
    },
  ];

  const performanceMetrics = [
    { query: 'SELECT * FROM users', time: '45ms', status: 'good' },
    { query: 'SELECT * FROM listings WHERE active = true', time: '120ms', status: 'good' },
    { query: 'SELECT * FROM bookings WHERE date >= NOW()', time: '89ms', status: 'good' },
    { query: 'SELECT COUNT(*) FROM payments', time: '234ms', status: 'slow' },
    { query: 'SELECT * FROM users JOIN listings', time: '456ms', status: 'slow' },
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const test of databaseTests) {
      // Simulate database test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        id: test.id,
        name: test.name,
        status: Math.random() > 0.15 ? 'passed' : 'failed',
        executionTime: Math.floor(Math.random() * 200) + 50,
        error: Math.random() > 0.85 ? 'Connection timeout' : null,
        recordsAffected: Math.floor(Math.random() * 1000) + 100,
      };
      
      setTestResults(prev => [...prev, result]);
    }
    
    setIsRunning(false);
  };

  const runSingleTest = async (testId) => {
    const test = databaseTests.find(t => t.id === testId);
    if (!test) return;

    setIsRunning(true);
    
    // Simulate database test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = {
      id: test.id,
      name: test.name,
      status: Math.random() > 0.2 ? 'passed' : 'failed',
      executionTime: Math.floor(Math.random() * 300) + 50,
      error: Math.random() > 0.8 ? 'Table not found' : null,
      recordsAffected: Math.floor(Math.random() * 500) + 50,
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

  const getPerformanceStatusColor = (status) => {
    switch (status) {
      case 'good': return Success;
      case 'slow': return Warning;
      case 'error': return Error;
      default: return SecondaryText;
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
          <Text style={styles.title}>Database Testing</Text>
          <Text style={styles.subtitle}>Test database connectivity and performance</Text>
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

        {/* Database Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Tests</Text>
          {databaseTests.map((test) => {
            const result = testResults.find(r => r.id === test.id);
            const status = result?.status || 'pending';
            
            return (
              <View key={test.id} style={styles.testCard}>
                <View style={styles.testHeader}>
                  <View style={styles.testInfo}>
                    <Text style={styles.testName}>{test.name}</Text>
                    <Text style={styles.testDescription}>{test.description}</Text>
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
                      <Text style={styles.resultLabel}>Execution Time:</Text>
                      <Text style={styles.resultValue}>{result.executionTime}ms</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Records Affected:</Text>
                      <Text style={styles.resultValue}>{result.recordsAffected}</Text>
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

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Query Performance</Text>
          <View style={styles.performanceCard}>
            {performanceMetrics.map((metric, index) => (
              <View key={index} style={styles.performanceRow}>
                <View style={styles.performanceQuery}>
                  <Text style={styles.queryText}>{metric.query}</Text>
                </View>
                <View style={styles.performanceMetrics}>
                  <Text style={styles.executionTime}>{metric.time}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getPerformanceStatusColor(metric.status) + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: getPerformanceStatusColor(metric.status) }]}>
                      {metric.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Database Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color={PrimaryBrand} />
              <Text style={styles.statValue}>2,847</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="home" size={24} color={PrimaryBrand} />
              <Text style={styles.statValue}>1,234</Text>
              <Text style={styles.statLabel}>Active Listings</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={PrimaryBrand} />
              <Text style={styles.statValue}>5,678</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="card" size={24} color={PrimaryBrand} />
              <Text style={styles.statValue}>$45,230</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
          </View>
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
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Avg Execution Time:</Text>
                <Text style={styles.summaryValue}>
                  {Math.round(testResults.reduce((acc, r) => acc + r.executionTime, 0) / testResults.length)}ms
                </Text>
              </View>
            </View>
          </View>
        )}
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
  performanceCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  performanceQuery: {
    flex: 1,
    marginRight: 12,
  },
  queryText: {
    fontSize: 12,
    color: PrimaryText,
    fontFamily: 'monospace',
  },
  performanceMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  executionTime: {
    fontSize: 14,
    color: PrimaryText,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
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
});

export default TestDatabaseScreen;
