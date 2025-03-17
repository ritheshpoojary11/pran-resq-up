import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { database, ref, onValue } from './firebaseConfig';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const userData = await AsyncStorage.getItem('loggedInUser');
      console.log('Stored User Data:', userData); // Debugging log
  
      if (userData) {
        const { mobileNumber, userType } = JSON.parse(userData);
        
        // Use navigation.reset to avoid going back to login
        navigation.reset({
          index: 0,
          routes: [{ name: getHomeScreen(userType), params: { mobileNumber } }],
        });
      }
    };
  
    checkLoggedInUser();
  }, []);
  
  const getHomeScreen = (userType) => {
    switch (userType) {
      case 'public':
        return 'PublicHomeScreen';
      case 'rescuer':
        return 'RescuerHomeScreen';
      case 'admin':
        return 'AdminHomeScreen';
      case 'superadmin':
        return 'SupAdminScreen';
      default:
        return 'LoginScreen';
    }
  };
  

  const checkLoggedInUser = async () => {
    const userData = await AsyncStorage.getItem('loggedInUser');
    if (userData) {
      const { mobileNumber, userType } = JSON.parse(userData);
      navigateToHomeScreen(userType, mobileNumber);
    }
  };

  const checkUserTable = (table, callback) => {
    const userRef = ref(database, `${table}/${mobileNumber}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.password === password) {
        callback(true, table);
      } else {
        callback(false);
      }
    });
  };

  const isValidMobileNumber = (number) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password.');
      return;
    }

    if (!isValidMobileNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (mobileNumber === '9876543210' && password === 'superadminpassword') {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify({ mobileNumber, userType: 'superadmin' }));
      navigation.navigate('SupAdminScreen');
      return;
    }

    checkUserTable('public_users', async (exists) => {
      if (exists) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify({ mobileNumber, userType: 'public' }));
        navigation.navigate('PublicHomeScreen', { mobileNumber });
      } else {
        checkUserTable('rescuers', async (exists) => {
          if (exists) {
            await AsyncStorage.setItem('loggedInUser', JSON.stringify({ mobileNumber, userType: 'rescuer' }));
            navigation.navigate('RescuerHomeScreen', { mobileNumber });
          } else {
            checkUserTable('admin', async (exists) => {
              if (exists) {
                await AsyncStorage.setItem('loggedInUser', JSON.stringify({ mobileNumber, userType: 'admin' }));
                navigation.navigate('AdminHomeScreen', { mobileNumber });
              } else {
                Alert.alert('Error', 'Mobile number or password is incorrect. Please try again.');
              }
            });
          }
        });
      }
    });
  };

  const navigateToHomeScreen = (userType, mobileNumber) => {
    switch (userType) {
      case 'public':
        navigation.navigate('PublicHomeScreen', { mobileNumber });
        break;
      case 'rescuer':
        navigation.navigate('RescuerHomeScreen', { mobileNumber });
        break;
      case 'admin':
        navigation.navigate('AdminHomeScreen', { mobileNumber });
        break;
      case 'superadmin':
        navigation.navigate('SupAdminScreen');
        break;
      default:
        break;
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.backgroundContainer} />
          <Text style={styles.title}>Login</Text>

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#004D40" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              placeholderTextColor="#CCCCCC"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#004D40" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#CCCCCC"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={styles.signupText}>Forgot password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004D40',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05, // 5% padding horizontally
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
    fontSize: width * 0.07, // Dynamic font size based on screen width
    color: '#004D40',
    textAlign: 'center',
    marginBottom: height * 0.03, // Margin relative to height
    fontFamily: 'CustomFont',
    paddingTop: height * 0.03,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: width * 0.04, // 4% horizontal padding
    marginBottom: height * 0.02, // 2% margin
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
    height: height * 0.06, // 6% of screen height for input box
    color: '#000',
    fontFamily: 'CustomFont',
  },
  loginButton: {
    backgroundColor: '#004D40',
    paddingVertical: height * 0.02, // 2% of height
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    marginTop: height * 0.02,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045, // 4.5% of width
    fontFamily: 'CustomFont',
  },
  signupText: {
    marginTop: height * 0.02,
    color: '#0066cc',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: 'CustomFont',
  },
});

export default LoginScreen;
