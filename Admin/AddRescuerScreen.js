import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { database, ref, set, serverTimestamp } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { get } from 'firebase/database';

const AddRescuerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const adminMobileNumber = route.params?.mobileNumber;

  const cities = [
    "Agonda", "Aldona", "Anjuna", "Arambol", "Assagao", "Assolna", "Benaulim", "Betalbatim", "Bicholim", "Calangute",
    "Canacona", "Candolim", "Carmona", "Cavelossim", "Chandor", "Colva", "Colvale", "Corlim", "Cuncolim", "Curchorem",
    "Curtorim", "Dharbandora", "Fatorda", "Harmal", "Keri", "Loutolim", "Majorda", "Mandrem", "Marcela", "Margao",
    "Mapusa", "Morjim", "Navelim", "Palolem", "Panaji", "Ponda", "Porvorim", "Quepem", "Querim", "Raia", "Sanquelim",
    "Sanguem", "Shiroda", "Siolim", "Tivim", "Valpoi", "Vagator", "Vasco da Gama", "Verna"
  ];

  if (!adminMobileNumber) {
    Alert.alert('Error', 'Admin mobile number is undefined.');
    return;
  }

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password;
  };

  const handleSubmit = async () => {
    if (!name || !mobileNumber || !gender || !city) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
  
    try {
      setLoading(true);
      const rescuerRef = ref(database, `rescuers/${mobileNumber}`);
  
      // Check if rescuer already exists
      const snapshot = await get(rescuerRef);
      if (snapshot.exists()) {
        Alert.alert('Error', 'Rescuer with this mobile number already exists.');
        setLoading(false);
        return;
      }
  
      const password = generatePassword();
  
      // Add rescuer to the database
      await set(rescuerRef, {
        name,
        mobileNumber,
        gender,
        city,
        password,
        adminMobileNumber,
        timestamp: serverTimestamp(),
      });
  
      await sendSMS(mobileNumber, password);
  
      Alert.alert('Success', 'Rescuer added successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding rescuer:', error);
      Alert.alert('Error', 'Failed to add rescuer.');
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async (phoneNumber, password) => {
    const message = `Welcome to the Rescue Team!\n\nYour login details:\n📱 Mobile: ${phoneNumber}\n🔑 Password: ${password}\n\nPlease log in using the mobile app.`;

    try {
      await axios.post('https://api-lppklutfcq-uc.a.run.app/send-message', {
        phoneNumber: `+91${phoneNumber}`,
        text: message,
      });
      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Add Rescuer</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter rescuer's name"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          placeholder="Enter rescuer's phone number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioButton} onPress={() => setGender('Male')}>
            <Icon name={gender === 'Male' ? 'radio-button-checked' : 'radio-button-unchecked'} size={24} color="#004D40" />
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.radioButton} onPress={() => setGender('Female')}>
            <Icon name={gender === 'Female' ? 'radio-button-checked' : 'radio-button-unchecked'} size={24} color="#004D40" />
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>City</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={city}
            onValueChange={(itemValue) => setCity(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a City" value="" />
            {cities.map((cityName, index) => (
              <Picker.Item key={index} label={cityName} value={cityName} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Adding...' : 'Add Rescuer'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddRescuerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
  headerContainer: { backgroundColor: '#004D40', paddingVertical: 10, paddingHorizontal: 54 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  formContainer: { marginTop: 20, paddingHorizontal: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  radioButton: { flexDirection: 'row', alignItems: 'center' },
  radioText: { marginLeft: 5, fontSize: 16 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 },
  picker: { height: 50, width: '100%' },
  submitButton: { backgroundColor: '#004D40', padding: 15, borderRadius: 5, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
