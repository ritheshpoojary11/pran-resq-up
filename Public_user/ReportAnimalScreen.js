import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import the Picker component
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ficon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import CustomAlertMessage from './CustomAlertMessage';
import { getDatabase, ref, serverTimestamp, get } from 'firebase/database';
import { database, set} from '../firebaseConfig';
import { ScrollView } from 'react-native';
import axios from 'axios';

const animalOptions = [
  { label: 'Leopard', value: 'leopard', image: require('../assets/leopard-lying-silhouette-vector-removebg-preview.png') },
  { label: 'Gaur', value: 'Gaur', image: require('../assets/pngtree-the-head-of-a-bull-with-an-angry-glare-vector-png-image_15740597-removebg-preview.png') },
  { label: 'Wildboar', value: 'Wildboar', image: require('../assets/wild-boar-silhouette-0274c1-removebg-preview.png') },
  { label: 'Snake', value: 'snake', image: require('../assets/103051781-snake-silhouette-curled-up-in-the-ring-snake-logo-vector-illustration-black-and-white-removebg-preview.png') },
  { label: 'Bird', value: 'Bird', image: require('../assets/depositphotos_6600115-stock-illustration-vector-silhouette-of-the-wild-removebg-preview.png') },
  { label: 'Sea Turtle', value: 'Sea Turtle', image: require('../assets/Screenshot_2025-01-10_231406-removebg-preview.png') },
  { label: 'Lizards', value: 'Lizards', image: require('../assets/pngtree-vector-of-crocodile-design-on-white-background-png-image_4954095-removebg-preview.png') },
  { label: 'Monkey', value: 'Monkey', image: require('../assets/silhouette-monkey-animal-genus-primates-vector-illustrator-163854286-Photoroom.png') },
  { label: 'Marine mammals', value: 'Marine mammals', image: require('../assets/humpback-whale-silhouette-design-sea-mammal-animal-sign-and-symbol-vector-removebg-preview.png') },
];

const animalLocations = [
  { label: 'Within Building', value: 'Within Building' },
  { label: 'Settlement', value: 'Settlement' },
  { label: 'Premises', value: 'Premises' },
];

const animalStates = [
  { label: 'Injured', value: 'Injured' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Trapped', value: 'Trapped' },
];

const ReportAnimalScreen = ({ navigation, route }) => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(route.params.mobileNumber || '');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [location, setLocation] = useState('');
  const [animalLocation, setAnimalLocation] = useState(''); // Updated to use dropdown
  const [animalState, setAnimalState] = useState(''); // Updated to use dropdown
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission Denied', 'Notification permissions were denied.');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions.');
      return false;
    }
  };

  const handleLocationAccess = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAlertTitle('Permission Denied');
        setAlertMessage(
          'Location permission was denied. Please enable it in settings to report an animal.'
        );
        setAlertVisible(true);
        return null;
      }
  
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
  
      if (!currentLocation?.coords) {
        setAlertTitle('Error');
        setAlertMessage('Location data is incomplete. Please try again.');
        setAlertVisible(true);
        return null;
      }

      const { latitude, longitude } = currentLocation.coords;
      const locationMessage = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setLocation(locationMessage);
  
      // Reverse geocoding
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const { city, region, street } = geocode[0] || {};
      console.log('City:', city, 'Region:', region, 'Street:', street);
  
      return {
        locationMessage,
        city,
        region,
        street,
        latitude,  // 🔹 Added latitude
        longitude,
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      setAlertTitle('Error');
      setAlertMessage(error.message || 'Failed to fetch location');
      setAlertVisible(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Animal Reported',
        body: `You have reported a ${selectedAnimal}.`,
      },
      trigger: null,
    });
  };

  const handleSubmit = async () => {
    if (!mobileNumber || !selectedAnimal) {
        setAlertTitle('Incomplete Information');
        setAlertMessage('Please provide all the required details to submit the report.');
        setAlertVisible(true);
        setLoading(false);
        return;
    }

    const locationData = await handleLocationAccess();
    if (!locationData) return;

    const { locationMessage, city, region, street, latitude, longitude } = locationData;

    const now = new Date();
    const reportedDate = now.toISOString().split('T')[0];
    const reportedTime = now.toTimeString().split(' ')[0];

    try {
        // Fetch the admin from Firebase
        const adminRef = ref(database, 'admin');
        const adminSnapshot = await get(adminRef);

        if (!adminSnapshot.exists()) {
            setAlertTitle('Admin Not Found');
            setAlertMessage('Could not find an admin. Please try again later.');
            setAlertVisible(true);
            return;
        }

        // Assuming there's only one admin in the database
        const adminData = Object.values(adminSnapshot.val())[0]; 
        const adminMobileNumber = adminData.mobileNumber;

        console.log("Fetched Admin:", adminData);

        const reportId = Date.now();
        console.log("Report Data:", {
            mobileNumber,
            selectedAnimal,
            animalLocation,
            animalState,
            reportedDate,
            reportedTime,
            assignedRescuerMobileNumber: "",
            adminMobileNumber,
            rescuedTime: "",
            location: locationMessage,
            city,
            region,
            street,
            timestamp: serverTimestamp(),
        });

        // Store report in Firebase
        const reportRef = ref(database, `reports/${reportId}`);
        await set(reportRef, {
            mobileNumber: mobileNumber || "",
            selectedAnimal: selectedAnimal || "",
            animalLocation: animalLocation || "",
            animalState: animalState || "",
            reportedDate,
            reportedTime,
            assignedRescuerMobileNumber: "",
            adminMobileNumber: adminMobileNumber || "",
            rescuedTime: "",
            location: locationMessage || "",
            city: city || "",
            region: region || "",
            timestamp: serverTimestamp(),
        });

        // Send SMS to the fetched admin
        await axios.post('https://api-lppklutfcq-uc.a.run.app/send-message', {
            phoneNumber: `+91${adminMobileNumber}`,
            text: `Wildlife Alert: ${selectedAnimal} reported in ${city}. Please assign a rescuer in the app.`
        });

        setAlertTitle('Thank you');
        setAlertMessage('Thank you for reporting the wildlife. Our rescue team will get in touch with you shortly.');
        setAlertVisible(true);
        setLoading(false);
        await sendNotification();
        setSubmitted(true);

    } catch (error) {
        console.error('Error submitting report:', error);
        setAlertTitle('Network Error');
        setAlertMessage('There was a problem submitting the report. Please check your network connection and try again.');
        setAlertVisible(true);
        setLoading(false);
    }
};



  const handleAlertConfirm = () => {
    setAlertVisible(false);
    navigation.navigate('DosAndDontsScreen');
  };

  const openLocationInMaps = () => {
    Linking.openURL(alertMessage).catch((err) => {
      setAlertTitle('Error');
      setAlertMessage('Failed to open the link');
      setAlertVisible(true);
      setLoading(false);
    });
  };

  const handleBlur = () => {
    Keyboard.dismiss();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Report a Wildlife</Text>
      </View>

      <View style={styles.backgroundContainer} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ficon name="phone" size={20} color="#004d40" style={styles.icon} />
          <TextInput
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            onBlur={handleBlur} // Hide keyboard when focus is lost
            style={styles.input}
          />
        </View>

        <Text style={styles.animalSelectionText}>Select Wildlife:</Text>
        <View style={styles.animalOptionsContainer}>
          {animalOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelectedAnimal(option.value)}
              style={[
                styles.animalOption,
                selectedAnimal === option.value && styles.selectedAnimalOption,
              ]}
            >
              <Image source={option.image} style={styles.animalImage} />
              <Text style={styles.animalLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Animal Location:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={animalLocation}
              onValueChange={(value) => setAnimalLocation(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Location" value="" />
              {animalLocations.map((location) => (
                <Picker.Item key={location.value} label={location.label} value={location.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Animal State:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={animalState}
              onValueChange={(value) => setAnimalState(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select State" value="" />
              {animalStates.map((state) => (
                <Picker.Item key={state.value} label={state.label} value={state.value} />
              ))}
            </Picker>
          </View>

          {loading ? (
  <ActivityIndicator size="large" color="#004d40" />
) : (
  <TouchableOpacity
    style={[styles.submitButton, (submitted || loading) && styles.disabledButton]}
    onPress={handleSubmit}
    disabled={submitted || loading}
  >
    <Text style={styles.submitButtonText}>Submit</Text>
  </TouchableOpacity>
)}

      </View>
      </ScrollView>
      <CustomAlertMessage
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004d40',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 10,
    fontFamily: 'CustomFont',
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  backgroundContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    top: 100,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 30, // Add padding for better scrolling experience
    backgroundColor: '',
  },
  formContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: 'CustomFont',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#004d40',
    fontFamily: 'CustomFont',
  },
  animalSelectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'CustomFont',
  },
  animalOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    fontFamily: 'CustomFont',
  },
  animalOption: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
    width: '30%',
    minWidth: 100,
    fontFamily: 'CustomFont',
  },
  selectedAnimalOption: {
    borderColor: '#004d40',
  },
  animalImage: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  animalLabel: {
    fontSize: 16,
    fontFamily: 'CustomFont',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    fontFamily: 'CustomFont',
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'CustomFont',
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    fontFamily: 'CustomFont',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#004d40',
    fontFamily: 'CustomFont',
  },
  submitButton: {
    backgroundColor: '#004d40',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "gray", // Change color to indicate disabled state
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'CustomFont',
  },
});

export default ReportAnimalScreen;
