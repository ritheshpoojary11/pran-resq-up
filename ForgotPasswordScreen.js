import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { database } from './firebaseConfig';
import { ref, get, update } from 'firebase/database'; // ✅ Import 'get' correctly

const ForgotPasswordScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 **Check if Mobile Number Exists in Any Table**
  const checkIfMobileExists = async (mobile) => {
    const tables = ['admin', 'rescuer', 'public_users'];

    for (let table of tables) {
      const userRef = ref(database, `${table}/${mobile}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return table; // Return the table where the user is found
      }
    }
    return null;
  };

  // 📩 **Send OTP**
  const handleSendOtp = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      // Remove "+91" before checking DB
      const mobile = mobileNumber.replace('+91', '');

      const userTable = await checkIfMobileExists(mobile);

      if (!userTable) {
        setIsLoading(false);
        Alert.alert('Error', 'Mobile number not found in our records.');
        return;
      }

      const apiUrl = 'https://api-lppklutfcq-uc.a.run.app/send-otp'; // Use Wi-Fi IP
      const response = await axios.post(apiUrl, { phoneNumber: mobileNumber });

      console.log('Response:', response.data);

      if (response.data.success) {
        setGeneratedOtp(response.data.otp);
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent successfully!');
      } else {
        Alert.alert('Error', 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to send OTP: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 **Resend OTP**
  const handleResendOtp = () => {
    setOtpSent(false);
    setOtp('');
    handleSendOtp();
  };

  // 🔑 **Verify OTP & Reset Password**
  const handleResetPassword = async () => {
    if (!otpSent || !otp) {
      Alert.alert('Error', 'Please enter the OTP sent to your mobile.');
      return;
    }

    if (otp !== generatedOtp.toString()) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    const mobile = mobileNumber.replace('+91', '');
    const userTable = await checkIfMobileExists(mobile);

    if (!userTable) {
      Alert.alert('Error', 'User not found in database.');
      return;
    }

    const userRef = ref(database, `${userTable}/${mobile}`);
    update(userRef, { password: newPassword })
      .then(() => {
        Alert.alert('Success', 'Password reset successfully!');
        navigation.navigate('SplashScreen');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={(text) => {
          if (!text.startsWith('+91')) {
            setMobileNumber('+91' + text.replace(/[^0-9]/g, ''));
          } else {
            setMobileNumber(text.replace(/[^0-9+]/g, ''));
          }
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Sending OTP...' : 'Send OTP'}</Text>
      </TouchableOpacity>

      {otpSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#004D40',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'CustomFont',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
    marginTop:10,
    fontFamily: 'CustomFont',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    fontFamily: 'CustomFont',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'CustomFont',
  },
  resendButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  resendText: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'CustomFont',
  },
});

export default ForgotPasswordScreen;
