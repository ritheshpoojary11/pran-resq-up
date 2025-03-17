import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { database, ref, set } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { get, child } from 'firebase/database'; // Import necessary Firebase functions

const { width, height } = Dimensions.get('window'); // Get device's width and height

const SignupScreen = () => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const userRef = ref(database, `public_users/${mobileNumber}`);

    get(child(ref(database), `public_users/${mobileNumber}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          Alert.alert('Error', 'This mobile number is already registered. Please log in or use a different number.');
        } else {
          set(userRef, {
            mobileNumber,
            password,
          })
            .then(() => {
              Alert.alert('Success', 'Signup successful!');
              navigation.navigate('PublicHomeScreen', { mobileNumber });
            })
            .catch((error) => {
              Alert.alert('Error', error.message);
            });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to check the mobile number. Please try again later.');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topTitle}>Sign Up</Text>

      <View style={styles.backgroundContainer} />
      <Text style={styles.title}>Create an Account</Text>

      <View style={styles.inputContainer}>
        <Icon name="phone" size={width * 0.05} color="#004D40" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#CCCCCC"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={width * 0.05} color="#004D40" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={width * 0.05} color="#004D40" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05, // 5% of screen width
    backgroundColor: '#004D40',
    fontFamily: 'CustomFont',
  },
  topTitle: {
    fontSize: width * 0.07, // Dynamic font size based on screen width
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: height * -0.1, // Negative margin for adjusting title position
    fontFamily: 'CustomFont',
    marginBottom: height * 0.05,
  },
  backgroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '111%',
    height: height * 0.7, // 70% of screen height
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: width * 0.06, // Dynamic font size based on screen width
    color: '#004D40',
    marginBottom: height * 0.06,
    textAlign: 'center',
    fontFamily: 'CustomFont',
    paddingTop: height * 0.01,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: width * 0.04, // 4% horizontal padding
    marginBottom: height * 0.02, // 2% margin bottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    fontFamily: 'CustomFont',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: height * 0.06, // 6% of screen height
    color: '#000',
    fontFamily: 'CustomFont',
  },
  signupButton: {
    backgroundColor: '#004D40',
    paddingVertical: height * 0.02, // 2% of screen height for padding
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    marginTop: height * 0.02, // 2% margin top
    fontFamily: 'CustomFont',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045, // 4.5% of screen width
    fontFamily: 'CustomFont',
  },
  loginText: {
    marginTop: height * 0.02,
    color: '#0066cc',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: 'CustomFont',
  },
});

export default SignupScreen;
