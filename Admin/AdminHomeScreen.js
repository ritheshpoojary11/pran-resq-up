import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card } from 'react-native-paper';
import { useRoute } from '@react-navigation/native'; 

const imageMap = {
  'anumal_attack.png': require('../assets/rescues.png'),
  'reports.png': require('../assets/report.png'),
  'pawprint.png': require('../assets/pawprint.png'),
  'quickaccess.png': require('../assets/access.png'),
};

const AdminHomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [activePage, setActivePage] = useState('home'); // Track active page
  const route = useRoute();
  const mobileNumber = route.params?.mobileNumber; // Get mobile number from route params
 

  const cardsData = [
    { id: '1', title: 'Add Rescuer', subtitle: 'Subtitle 1', image: 'pawprint.png' },
    { id: '2', title: 'Rescues', subtitle: 'Subtitle 2', image: 'anumal_attack.png' },
    { id: '3', title: 'Reports', subtitle: 'Subtitle 3', image: 'reports.png' },
  ];

  const carouselData = [
    { id: '1', title: 'Item 1', image: 'carousel1.png' },
    { id: '2', title: 'Item 2', image: 'carousel2.png' },
    { id: '3', title: 'Item 3', image: 'carousel3.png' },
    { id: '4', title: 'Item 4', image: 'carousel4.png' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ animated: true, index: currentIndex });
    }
  }, [currentIndex]);

  const getItemLayout = (data, index) => ({
    length: 140,
    offset: 140 * index,
    index,
  });

  const onScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const handleNavigation = (page, params) => {
    setActivePage(page);
    navigation.navigate(page, { mobileNumber });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer} />

      <Text style={styles.slogan}>Protecting Wildlife, Preserving Nature.</Text>
      
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#999999" style={styles.searchIcon} />
        <TextInput placeholder="Search..." placeholderTextColor="#CCCCCC" style={styles.searchInput} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <FlatList
          data={cardsData}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.cardOuterContainer} 
              onPress={() => {
                if (item.title === 'Rescues') {
                  handleNavigation('Rescue');
                }
                else if (item.title === 'Reports') {
                  handleNavigation('ReportsScreen');
                }
                else if (item.title === 'Add Rescuer') {
                    handleNavigation('AddRescuerScreen');
                  }
              }}>
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <Image source={imageMap[item.image]} style={styles.cardImage} />
                  <View style={styles.textContainer}>
                    <Text style={styles.iconText}>{item.title}</Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
        />

        {/* <View style={styles.carouselContainer}>
          <View style={styles.carouselTextContainer}>
            <Text style={styles.cText}>Our rescues......</Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={carouselData}
            renderItem={({ item }) => (
              <View style={styles.carouselItemOuterContainer}>
                <Card style={styles.card}>
                  <Card.Content style={styles.carouselItem}>
                    <Image source={imageMap[item.image]} style={styles.carouselImage} />
                    <Text style={styles.carouselItemText}>{item.title}</Text>
                  </Card.Content>
                </Card>
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselList}
            pagingEnabled
            onScrollToIndexFailed={onScrollToIndexFailed}
          />
          <View style={styles.carouselDotsContainer}>
            <Icon name="more-horiz" size={30} color="#FFFFFF" />
          </View>
        </View> */}
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
    height: '70%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 0,
  },
  slogan: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: 40,
    fontFamily: 'CustomFont', // Use custom font here
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(100, 121, 107, 0.3)', // Transparent green background with blur
    borderRadius: 25,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
    fontFamily: 'CustomFont',
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: '#FFFFFF', // Text color for search input
    fontFamily: 'CustomFont',
  },
  cardList: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  cardOuterContainer: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF', // Set card background to white
    borderRadius: 10,
    overflow: 'hidden',
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: 118, // Adjust based on card width
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: 100,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
  },
  textContainer: {
    alignItems: 'center',
    padding: 0,
  },
  iconText: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'CustomFont', // Use custom font here
  },
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  carouselTextContainer: {
    marginBottom: 10,
  },
  cText: {
    fontSize: 15,
    fontFamily: 'CustomFont', // Use custom font here
  },
  carouselList: {
    alignItems: 'center',
  },
  carouselItemOuterContainer: {
    marginHorizontal: 10,
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 140,
  },
  carouselImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  carouselItemText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'CustomFont', // Use custom font here
  },
  carouselDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
  },
});

export default AdminHomeScreen;
