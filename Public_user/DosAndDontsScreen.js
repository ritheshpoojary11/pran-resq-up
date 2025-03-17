import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DosAndDontsScreen = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Watermark */}
      <Image
        source={require('../assets/icon.png')} // Replace with your app icon path
        style={styles.watermark}
      />

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Dos and Don'ts of Snakebites</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dos</Text>
          <Text style={styles.sectionText}>• Stay calm and still: Movement can increase the spread of venom, so minimize movement as much as possible.</Text>
          <Text style={styles.sectionText}>• Remove any tight clothing, jewelry, or accessories: Swelling may occur around the bite, so removing anything tight around the bite area helps prevent further complications.</Text>
          <Text style={styles.sectionText}>• Keep the affected limb at or slightly below heart level: This helps slow the spread of venom through the bloodstream.</Text>
          <Text style={styles.sectionText}>• Seek medical attention immediately: Transport the victim to a medical facility as quickly as possible, ensuring minimal movement of the bite area.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Don'ts</Text>
          <Text style={styles.sectionText}>• Do not apply tight tourniquets: Tight tourniquets can cause more harm than good by restricting blood flow and leading to severe tissue damage​.</Text>
          <Text style={styles.sectionText}>• Do not cut the wound or attempt to suck out the venom: These methods are ineffective and can cause further injury or infection​.</Text>
          <Text style={styles.sectionText}>• Avoid using cold packs, herbal remedies, or other traditional methods: These can be harmful and delay proper treatment.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  watermark: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
    paddingTop: 900,
    paddingLeft: 350,
    opacity: 0.1, // Adjust the transparency to make it subtle
    resizeMode: 'contain', // Ensures the image maintains its aspect ratio
  },
  backButton: {
    position: 'absolute',
    top: 20,
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
    paddingTop: 10,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DosAndDontsScreen;
