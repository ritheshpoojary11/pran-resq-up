import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup timer if the component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* App Icon */}
      <Image source={require('./assets/icon.png')} style={styles.logo} />

     

      {/* Footer with Forest Department logo and text */}
      <View style={styles.footer}>
        <Image source={require('./assets/forest_department.jpg')} style={styles.footerLogo} />
        <Text style={styles.footerText}>Forest Department of Goa</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // Increased size
    height: 200, // Increased size
    position: 'absolute',
    top: '15%',
  },
  slogan: {
    color: '#004D40',
    fontSize: 20, // Slightly larger font
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: '35%',
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center', // Center the footer content horizontally
  },
  footerLogo: {
    width: 70, // Increased size
    height: 70, // Increased size
    marginBottom: 5, // Added spacing between logo and text
  },
  footerText: {
    color: '#004D40',
    fontSize: 18, // Slightly larger font
    fontWeight: '600',
  },
});

export default SplashScreen;
