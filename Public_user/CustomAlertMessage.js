import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomAlertMessage = ({ visible, title, message, onConfirm }) => {
  const navigation = useNavigation(); // Get navigation object

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onConfirm} // Closes the modal if the user presses the back button
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          {/* "Quick Links" title aligned to the left */}
          <Text style={styles.linkTitle}>Quick Links</Text>
          
          <TouchableOpacity onPress={onConfirm}>
            <Text style={styles.link}>Go to Dos and Don'ts</Text>
          </TouchableOpacity>

          {/* New "Got It" Button to Navigate to Home */}
          <TouchableOpacity 
            style={styles.gotItButton} 
            onPress={() => {
              onConfirm();  // Close modal
              navigation.navigate('PublicHomeScreen'); // Navigate to Home page
            }}
          >
            <Text style={styles.gotItText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'CustomFont',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'CustomFont',
  },
  linkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start', // Aligns "Quick Links" title to the left
    fontFamily: 'CustomFont',
  },
  link: {
    color: '#004d40',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'left',
    fontFamily: 'CustomFont',
  },
  gotItButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#004d40', // Dark green color
    borderRadius: 5,
    fontFamily: 'CustomFont',
  },
  gotItText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'CustomFont',
  },
});

export default CustomAlertMessage;
