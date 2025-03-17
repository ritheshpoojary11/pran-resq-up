import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, 
  Image, ScrollView, Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get device dimensions

const imageMap = {
  'anumal_attack.png': require('../assets/image.png'),
  'reports.png': require('../assets/image.png'),
  'pawprint.png': require('../assets/elephant1.png'),
  'quickaccess.png': require('../assets/access.png'),
  'carousel0.png': require('../assets/0.png'),
  'carousel1.png': require('../assets/1.png'),
  'carousel2.png': require('../assets/2.png'),
  'carousel3.png': require('../assets/3.png'),
  'carousel4.png': require('../assets/4.png'),
  'carousel5.png': require('../assets/5.png'),
  'carousel6.png': require('../assets/6.png'),
  'carousel7.png': require('../assets/7.png'),
  'carousel8.png': require('../assets/8.png'),
  'carousel9.png': require('../assets/9.png'),
  'carousel10.png': require('../assets/10.png'),
};

const PublicHomeScreen = ({ navigation }) => {
  const [activePage, setActivePage] = useState('home'); // Track active page
  const route = useRoute();
  const mobileNumber = route.params?.mobileNumber; // Get mobile number from route params

  const cardsData = [
    { id: '1', title: 'Report a Wildlife', subtitle: 'Subtitle 1', image: 'pawprint.png' },
    { id: '2', title: "Dos & Don'ts", subtitle: 'Subtitle 2', image: 'anumal_attack.png' },
  ];

  const imageCardsData = [
    { id: '0', image: 'carousel0.png' },
    { id: '1', image: 'carousel1.png' },
    { id: '2', image: 'carousel2.png' },
    { id: '3', image: 'carousel3.png' },
    { id: '4', image: 'carousel4.png' },
    { id: '5', image: 'carousel5.png' },
    { id: '6', image: 'carousel6.png' },
    { id: '7', image: 'carousel7.png' },
    { id: '8', image: 'carousel8.png' },
    { id: '9', image: 'carousel9.png' },
    { id: '10', image: 'carousel10.png' },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page, { mobileNumber });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer} />

      <Text style={styles.slogan}>Protecting Wildlife, Preserving Nature.</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <FlatList
          data={cardsData}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardOuterContainer}
              onPress={() => {
                if (item.title === 'Report a Wildlife') {
                  handleNavigation('ReportAnimalScreen');
                } else if (item.title === "Dos & Don'ts") {
                  handleNavigation('DosAndDontsScreen');
                }
              }}>
              <View style={styles.card}>
                <Image source={imageMap[item.image]} style={styles.cardImage} />
                <Text style={styles.iconText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
        />

        {/* Image-only Carousel */}
        <FlatList
          data={imageCardsData}
          renderItem={({ item }) => (
            <Image source={imageMap[item.image]} style={styles.imageCardImage} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageCardList}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#004D40', // Dark green color
  },
  backgroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '73%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 0,
  },
  slogan: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: height * 0.07, // 7% of screen height
    fontFamily: 'CustomFont',
    paddingBottom: 50,
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  cardList: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  cardOuterContainer: {
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    height: height * 0.16, // 14% of screen height
    width: width * 0.28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: width * 0.45, // 35% of screen width
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    padding:30,
  },
  iconText: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'CustomFont',
  },
  imageCardList: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  imageCardImage: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.5, // 50% of screen height
    resizeMode: "cover", // Ensures image fills the area
    borderRadius: 10,
    marginHorizontal: 10,
  },
});

export default PublicHomeScreen;
