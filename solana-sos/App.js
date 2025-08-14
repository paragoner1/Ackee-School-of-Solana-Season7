import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

export default function App() {
  console.log('🚨 SOLANA SOS App Loading...'); // Debug log
  
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const activateEmergency = () => {
    console.log('🚨 Emergency Button Pressed!'); // Debug log
    setIsEmergencyActive(true);
    Alert.alert('🚨 Emergency Activated', 'Emergency mode is now active!');
    
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 3000);
  };

  console.log('🚨 Rendering Emergency App...'); // Debug log

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
      <View style={styles.content}>
        <Text style={styles.title}>🚨 SOLANA SOS</Text>
        <Text style={styles.subtitle}>Emergency Companion</Text>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isEmergencyActive ? '#FF1744' : '#4CAF50' }
          ]}>
            <Text style={styles.statusIcon}>
              {isEmergencyActive ? "🚨" : "✅"}
            </Text>
          </View>
          
          <Text style={styles.statusText}>
            {isEmergencyActive ? "🚨 EMERGENCY ACTIVATED" : "Ready for emergency"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.emergencyButton,
            isEmergencyActive && styles.emergencyButtonActive
          ]}
          onPress={activateEmergency}
          disabled={isEmergencyActive}
        >
          <Text style={styles.emergencyButtonIcon}>
            {isEmergencyActive ? "🚨" : "⚠️"}
          </Text>
          <Text style={styles.emergencyButtonText}>
            {isEmergencyActive ? "EMERGENCY ACTIVATED" : "PRESS FOR EMERGENCY"}
          </Text>
        </TouchableOpacity>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureText}>GPS</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📞</Text>
            <Text style={styles.featureText}>CALL</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>WALLET</Text>
          </View>
        </View>

        <Text style={styles.debugText}>✅ React Native Emergency App - Working!</Text>
        <Text style={styles.debugText}>Status: {isEmergencyActive ? 'Active' : 'Ready'}</Text>
        <Text style={styles.debugText}>🚨 Debug: App.js loaded successfully!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A237E',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 40,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusIcon: {
    fontSize: 24,
  },
  statusText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  emergencyButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 40,
  },
  emergencyButtonActive: {
    backgroundColor: '#FF1744',
    shadowColor: '#FF1744',
    shadowOpacity: 0.6,
  },
  emergencyButtonIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  feature: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    minWidth: 80,
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 5,
  },
}); 