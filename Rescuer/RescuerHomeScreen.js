import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const imageMap = {
  'anumal_attack.png': require('../assets/hmw.png'),
  'image.png': require('../assets/image.png'),
  'pawprint.png': require('../assets/pawprint.png'),
  'quickaccess.png': require('../assets/access.png'),
  
};

const RescuerHomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [activePage, setActivePage] = useState('home'); // Track active page
  const route = useRoute();
  const mobileNumber = route.params?.mobileNumber;

  const cardsData = [
    { id: '3', title: 'Task to Complete', subtitle: 'Subtitle 3', image: 'image.png' },
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

  const handleNavigation = (page) => {
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
                if (item.title === 'Task to Complete') {
                  handleNavigation('TaskToCompleteScreen');
                }
                else if (item.title === 'Reports') {
                  handleNavigation('ReportsScreen');
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
            <Text style={styles.cText}>Our rescues....\..</Text>
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
            getItemLayout={getItemLayout}
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
    height: height * 0.7, // Make background responsive
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 0,
  },
  slogan: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: width * 0.05, // Responsive font size
    marginTop: height * 0.05,
    fontFamily: 'CustomFont',
  },
  scrollViewContent: {
    paddingBottom: height * 0.1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: 'rgba(100, 121, 107, 0.3)',
    borderRadius: 25,
    marginHorizontal: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
  searchIcon: {
    marginLeft: width * 0.02,
  },
  searchInput: {
    flex: 1,
    height: height * 0.05,
    paddingHorizontal: 10,
    color: '#FFFFFF',
  },
  cardList: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: height * 0.03,
  },
  cardOuterContainer: {
    flex: 1,
    marginHorizontal: width * 0.03,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    height: height * 0.15, // Responsive height for card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: width * 0.3, // Responsive width for card
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: width * 0.25, // Responsive width for card
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  cardImage: {
    width: width * 0.15, // Responsive image size
    height: width * 0.15,
    borderRadius: 10,
    marginBottom: height * 0.01,
  },
  textContainer: {
    alignItems: 'center',
    padding: 0,
  },
  iconText: {
    fontSize: width * 0.03, // Responsive font size
    textAlign: 'center',
    fontFamily: 'CustomFont',
  },
  carouselContainer: {
    marginTop: height * 0.03,
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  carouselTextContainer: {
    marginBottom: height * 0.01,
  },
  cText: {
    fontSize: width * 0.04, // Responsive font size
    fontFamily: 'CustomFont',
  },
  carouselList: {
    alignItems: 'center',
  },
  carouselItemOuterContainer: {
    width: width * 0.45, // Responsive width for carousel item
    marginHorizontal: width * 0.03,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.28, // Responsive height for carousel item
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  carouselItemText: {
    marginTop: height * 0.01,
    fontSize: width * 0.045, // Responsive font size
    fontFamily: 'CustomFont',
  },
  carouselDotsContainer: {
    position: 'absolute',
    bottom: height * 0.02,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
  },
});

export default RescuerHomeScreen;
