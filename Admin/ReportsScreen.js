import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Platform, Linking, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import * as IntentLauncher from 'expo-intent-launcher';
import { database, ref, onValue } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native'; 

const ReportsScreen = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [downloadHistoryVisible, setDownloadHistoryVisible] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const route = useRoute();
  const adminMobileNumber = route.params?.mobileNumber; // Get mobile number from route params
  // Fetch data from Firebase
  useEffect(() => {
    const dataRef = ref(database, 'reports');
  
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        const reportsArray = Object.keys(fetchedData)
          .map(key => ({
            id: key,
            ...fetchedData[key]
          }))
          .filter(report => report.adminMobileNumber === adminMobileNumber); // Filter by logged-in admin number
  
        setData(reportsArray);
      }
    });
  
    return () => unsubscribe();
  }, [adminMobileNumber]); 

  useEffect(() => {
    // Apply filter based on the selected month
    let filtered = data;

    if (selectedMonth !== 'All') {
      filtered = filtered.filter(item => new Date(item.reportedDate).getMonth() + 1 === parseInt(selectedMonth));
    }

    setFilteredData(filtered);
  }, [selectedMonth, data]);

  // Handle download functionality
  const handleDownload = async () => {
    try {
      const reportContent = filteredData
        .map((item) => `Rescue Report\nLocation: ${item.location}\nMobile Number: ${item.mobileNumber}\nReported Date: ${item.reportedDate}\n` +
          `Reported Time: ${item.reportedTime}\nSelected Animal: ${item.selectedAnimal}\nAssigned Rescuer: ${item.assignedRescuerMobileNumber}\n`)
        .join('\n');
      const fileName = `Rescue_Reports_${new Date().toISOString()}.txt`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, reportContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      setDownloadedFiles(prev => [...prev, fileUri]); // Store file URI in download history

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Download Complete',
          body: 'Tap to open the report.',
          data: { fileUri }, // Attach file URI to notification data
        },
        trigger: null,
      });

      Alert.alert('Download', 'The report has been downloaded. Please check your notifications to open it.');
    } catch (error) {
      console.error('Error downloading the report:', error);
      Alert.alert('Error', 'Failed to download the report.');
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { fileUri } = response.notification.request.content.data;
      if (fileUri) {
        openFile(fileUri);
      }
    });

    return () => subscription.remove();
  }, []);

  const openFile = async (fileUri) => {
    try {
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(fileUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        });
      } else {
        // Add iOS implementation or fallback for sharing
      }
    } catch (error) {
      console.error('Error opening the file:', error);
      Alert.alert('Error', 'Failed to open the file.');
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Rescue Reports</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
            <MaterialIcons name="filter-list" size={24} color="#004D40" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setDownloadHistoryVisible(true)}>
            <MaterialIcons name="folder" size={24} color="#004D40" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal>
  <View style={styles.tableContainer}>
    {/* Table Header */}
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Location</Text>
      <Text style={styles.headerText}>Mobile Number</Text>
      <Text style={styles.headerText}>Reported Date</Text>
      <Text style={styles.headerText}>Reported Time</Text>
      <Text style={styles.headerText}>Selected Animal</Text>
      <Text style={styles.headerText}>Assigned Rescuer</Text>
      <Text style={styles.headerText}>Rescued Time</Text>
    </View>

    {/* Table Rows */}
    {paginatedData.map((item) => (
      <View key={item.id} style={styles.tableRow}>
        <TouchableOpacity onPress={() => Linking.openURL(item.location)}>
          <Text style={[styles.rowText, { color: 'blue' }]}>Open Location</Text>
        </TouchableOpacity>
        <Text style={styles.rowText}>{item.mobileNumber}</Text>
        <Text style={styles.rowText}>{item.reportedDate}</Text>
        <Text style={styles.rowText}>{item.reportedTime}</Text>
        <Text style={styles.rowText}>{item.selectedAnimal}</Text>
        <Text style={styles.rowText}>{item.assignedRescuerMobileNumber || 'Unassigned'}</Text>
        <Text style={styles.rowText}>{item.rescuedTime || 'Not yet rescued'}</Text>
      </View>
    ))}
  </View>
</ScrollView>


      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        >
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => (endIndex < filteredData.length ? prev + 1 : prev))}
          disabled={endIndex >= filteredData.length}
          style={[styles.paginationButton, endIndex >= filteredData.length && styles.disabledButton]}
        >
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>Download All Reports</Text>
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>

            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="January" value="1" />
              <Picker.Item label="February" value="2" />
              <Picker.Item label="March" value="3" />
              <Picker.Item label="April" value="4" />
              <Picker.Item label="May" value="5" />
              <Picker.Item label="June" value="6" />
              <Picker.Item label="July" value="7" />
              <Picker.Item label="August" value="8" />
              <Picker.Item label="September" value="9" />
              <Picker.Item label="October" value="10" />
              <Picker.Item label="November" value="11" />
              <Picker.Item label="December" value="12" />
            </Picker>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setFilterVisible(false)}>
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setFilterVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Download History Modal */}
      <Modal visible={downloadHistoryVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Download History</Text>
            <ScrollView>
              {downloadedFiles.map((file, index) => (
                <TouchableOpacity key={index} onPress={() => openFile(file)}>
                  <Text style={styles.downloadedFileText}>{file}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setDownloadHistoryVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    marginLeft: 10,
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#d9d9d9',
    padding: 10,
    
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingRight: 12,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  paginationText: {
    color: '#FFFFFF',
  },
  downloadButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#28A745',
    borderRadius: 5,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  downloadedFileText: {
    marginVertical: 5,
    color: 'blue',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#DC3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
  },
});

export default ReportsScreen;
