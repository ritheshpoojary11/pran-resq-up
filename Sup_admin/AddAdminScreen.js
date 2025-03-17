import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { database, ref, set, serverTimestamp } from '../firebaseConfig';

// Function to generate random password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const AddAdminScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBlur = () => {
    Keyboard.dismiss();
  };

  const handlePincodeBlur = async () => {
    if (pincode) {
      try {
        setLoading(true);
        const location = await Location.geocodeAsync(pincode);
        if (location.length > 0) {
          const { latitude, longitude } = location[0];
          setLatitude(latitude);
          setLongitude(longitude);

          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          if (reverseGeocode.length > 0) {
            const { city, region, country, postalCode } = reverseGeocode[0];
            const fullAddress = `${city}, ${region}, ${country}, ${postalCode}`;
            setAddress(fullAddress);
          }
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        Alert.alert('Error', 'Failed to fetch address for the entered pincode.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Mobile number validation function
  const validateMobileNumber = (number) => {
    const mobileRegex = /^[0-9]{10}$/; // Regular expression for a valid 10-digit number
    return mobileRegex.test(number);
  };

  const handleSubmit = async () => {
    if (!name || !email || !mobileNumber || !gender || !pincode || !address || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      const newAdminId = new Date().getTime().toString();
      const password = generatePassword();

      const adminRef = ref(database, `admin/${mobileNumber}`);
      await set(adminRef, {
        name,
        email,
        mobileNumber,
        gender,
        pincode,
        address,
        latitude,
        longitude,
        password,
        timestamp: serverTimestamp(),
      });

      Alert.alert('Success', 'Admin has been added successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding admin: ', error);
      Alert.alert('Error', 'Failed to add admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Add Admin</Text>
      </View>

      <View style={styles.container1}>
        <Text style={styles.title}>Add Admin</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter admin's name"
            placeholderTextColor="#888888"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter admin's email"
            placeholderTextColor="#888888"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Enter admin's phone number"
            placeholderTextColor="#888888"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender('Male')}>
              <Icon
                name={gender === 'Male' ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={24}
                color="#004D40"
              />
              <Text style={styles.radioText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender('Female')}>
              <Icon
                name={gender === 'Female' ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={24}
                color="#004D40"
              />
              <Text style={styles.radioText}>Female</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            value={pincode}
            onChangeText={setPincode}
            placeholder="Enter pincode"
            placeholderTextColor="#888888"
            keyboardType="numeric"
            onBlur={handlePincodeBlur}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            editable={false}
            placeholder="Address will be filled automatically"
            placeholderTextColor="#888888"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Add Admin</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#004D40',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#888888',
    marginBottom: 5,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 18,
    color: '#004D40',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#004D40',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
