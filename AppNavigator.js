import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import PublicHomeScreen from './Public_user/PublicHomeScreen';
import RescuerHomeScreen from './Rescuer/RescuerHomeScreen';
import AdminHomeScreen from './Admin/AdminHomeScreen';
import ReportAnimalScreen from './Public_user/ReportAnimalScreen';
import ReportsScreen from './Admin/ReportsScreen';
import DosAndDontsScreen from './Public_user/DosAndDontsScreen';
import RescuesScreen from './Admin/RescuesScreen';
import AddRescuerScreen from './Admin/AddRescuerScreen';
import TaskToCompleteScreen from './Rescuer/TaskToCompleteScreen';
import SupAdminScreen from './Sup_admin/SupAdminScreen';
import AddAdminScreen from './Sup_admin/AddAdminScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import SplashScreen from './SplashScreen';
import Rescuess from './Admin/Rescuess';
import Rescue from './Admin/Rescue';
const Stack = createStackNavigator();

/**
 * Custom Header Component with Logout Functionality
 */
const CustomHeader = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-200))[0];

  // Toggle Side Menu Animation
  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
  
      await AsyncStorage.removeItem('loggedInUser');
  
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      console.log('After removal:', storedUser); // Should print 'null'
  
      // Reset navigation to LoginScreen and remove back history
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
  
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  
  

  return (
    <View style={styles.headerContainer}>
  {/* Title on the left */}
  <Text style={styles.headerTitle}>PRAN ResQ</Text>

  {/* Logout button on the right */}
  <TouchableOpacity onPress={handleLogout}>
    <Text style={styles.headerLogout}>Logout</Text>
  </TouchableOpacity>
</View>
  );
};

/**
 * Main App Navigation
 */
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />, // Pass navigation to custom header
      })}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PublicHomeScreen" component={PublicHomeScreen} options={{ title: '' }} />
      <Stack.Screen name="RescuerHomeScreen" component={RescuerHomeScreen} options={{ title: 'Rescuer Home' }} />
      <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} options={{ title: 'Admin Home' }} />
      <Stack.Screen name="ReportAnimalScreen" component={ReportAnimalScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{ title: 'Reports' }} />
      <Stack.Screen name="DosAndDontsScreen" component={DosAndDontsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RescuesScreen" component={RescuesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddRescuerScreen" component={AddRescuerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TaskToCompleteScreen" component={TaskToCompleteScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SupAdminScreen" component={SupAdminScreen} options={{ title: 'Super Admin' }} />
      <Stack.Screen name="AddAdminScreen" component={AddAdminScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Rescuess" component={Rescuess} options={{ headerShown: false }} />
      <Stack.Screen name="Rescue" component={Rescue} options={{ headerShown: false }} />

    </Stack.Navigator>
  </NavigationContainer>
);

/**
 * Styles
 */
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures title is left & logout is right
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#004D40',
    paddingBottom: 10,
    paddingHorizontal: 20, // Ensures spacing on both sides
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'CustomFont',
  },
  headerLogout: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'right',
  },
});

export default AppNavigator;
