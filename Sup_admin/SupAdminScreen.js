import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card } from 'react-native-paper';

const imageMap = {
  'addadmin.png': require('../assets/access.png'), // Replace with actual image for adding admin
};

const SupAdminScreen = ({ navigation }) => {
  const [activePage, setActivePage] = useState('supadmin'); // Track active page

  const cardsData = [
    { id: '1', title: 'Add Admin', subtitle: 'Add a new admin user', image: 'addadmin.png' },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer} />

      <Text style={styles.slogan}>Super Admin Controls</Text>
      
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#999999" style={styles.searchIcon} />
        <Text style={styles.searchInput}>Search Admins...</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <FlatList
          data={cardsData}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.cardOuterContainer} 
              onPress={() => {
                if (item.title === 'Add Admin') {
                  handleNavigation('AddAdminScreen'); // Navigate to Add Admin screen
                }
              }}>
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <Image source={imageMap[item.image]} style={styles.cardImage} />
                  <View style={styles.textContainer}>
                    <Text style={styles.iconText}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1B5E20', // Dark green color
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
    fontFamily: 'CustomFont', // Use custom font
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(100, 121, 107, 0.3)', // Transparent green background
    borderRadius: 25,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
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
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'CustomFont', // Use custom font
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#888888', // Subtitle text color
    textAlign: 'center',
    marginTop: 5,
  },
});

export default SupAdminScreen;
