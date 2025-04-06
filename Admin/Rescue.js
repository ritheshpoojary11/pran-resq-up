import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Alert, Dimensions } from 'react-native';
import { database, ref, onValue, update } from '../firebaseConfig';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
const SkeletonLoader = () => (
    <View style={styles.skeletonRow}>
      <View style={styles.skeletonCell} />
      <View style={styles.skeletonCell} />
      <View style={styles.skeletonCell} />
      <View style={styles.skeletonCell} />
    </View>
  );
  const CompletedTab = ({ adminMobileNumber}) => {
      const [completedRescues, setCompletedRescues] = useState([]);
      const [loading, setLoading] = useState(true);
    
    
      useEffect(() => {
        
        const reportsRef = ref(database, 'reports');
        onValue(reportsRef, (snapshot) => {
          const data = snapshot.val();
          
          if (data) {
            const completed = Object.keys(data)
              .filter((key) => data[key].rescuedTime !== '' && data[key].adminMobileNumber === adminMobileNumber)
              .map((key) => ({ id: key, ...data[key] }));
            setCompletedRescues(completed);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firebase Read Error:", error);
        });
      }, [adminMobileNumber]);
      
    
      return (
        <View style={styles.container}>
          <ScrollView horizontal>
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerText, styles.headerCell]}>Mobile Number</Text>
                <Text style={[styles.headerText, styles.headerCell]}>Reported Date</Text>
                <Text style={[styles.headerText, styles.headerCell]}>Rescued Time</Text>
                <Text style={[styles.headerText, styles.headerCell]}>Assigned Rescuer</Text>
              </View>
    
              {loading ? (
                Array(4).fill(0).map((_, index) => <SkeletonLoader key={index} />)
              ) : (
                <FlatList
                  data={completedRescues}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                      <Text style={[styles.rowText, styles.cell]}>{item.mobileNumber}</Text>
                      <Text style={[styles.rowText, styles.cell]}>{item.reportedDate}</Text>
                      <Text style={[styles.rowText, styles.cell]}>{item.rescuedTime}</Text>
                      <Text style={[styles.rowText, styles.cell]}>{item.assignedRescuerMobileNumber}</Text>
                    </View>
                  )}
                />
              )}
            </View>
          </ScrollView>
        </View>
      );
    };
    const PendingTab = ({ adminMobileNumber }) => {
        const [pendingRescues, setPendingRescues] = useState([]);
        const [loading, setLoading] = useState(true);
      
        useEffect(() => {
          const reportsRef = ref(database, 'reports');
          onValue(reportsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const pending = Object.keys(data)
                .filter((key) => data[key].rescuedTime === '' && data[key].assignedRescuerMobileNumber !== '' && data[key].adminMobileNumber === adminMobileNumber)
                .map((key) => ({ id: key, ...data[key] }));
              setPendingRescues(pending);
            }
            setLoading(false);
          });
        }, [adminMobileNumber]); // Add dependency
        
      
        return (
          <View style={styles.container}>
            <ScrollView horizontal>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerText, styles.headerCell]}>Mobile Number</Text>
                  <Text style={[styles.headerText, styles.headerCell]}>Reported Date</Text>
                  <Text style={[styles.headerText, styles.headerCell]}>Assigned Rescuer</Text>
                </View>
      
                {loading ? (
                  Array(4).fill(0).map((_, index) => <SkeletonLoader key={index} />)
                ) : (
                  <FlatList
                    data={pendingRescues}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={styles.tableRow}>
                        <Text style={[styles.rowText, styles.cell]}>{item.mobileNumber}</Text>
                        <Text style={[styles.rowText, styles.cell]}>{item.reportedDate}</Text>
                        <Text style={[styles.rowText, styles.cell]}>{item.assignedRescuerMobileNumber}</Text>
                      </View>
                    )}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        );
      };

      const UnassignedTab = ({ adminMobileNumber}) => {
        const [unassignedRescues, setUnassignedRescues] = useState([]);
        const [loading, setLoading] = useState(true);
        const [modalVisible, setModalVisible] = useState(false);
        const [selectedReportId, setSelectedReportId] = useState(null);
        const [rescuers, setRescuers] = useState([]);
      
        useEffect(() => {
          try {
            const reportsRef = ref(database, 'reports');
            onValue(reportsRef, (snapshot) => {
              const data = snapshot.val();
              if (data) {
                const unassigned = Object.keys(data)
                  .filter((key) => data[key].assignedRescuerMobileNumber === '')
                  .map((key) => ({ id: key, ...data[key] }));
                setUnassignedRescues(unassigned);
              }
              setLoading(false);
            });
          } catch (error) {
            console.error("Error fetching rescues:", error);
            Alert.alert("Error", "Failed to load rescues");
          }
        }, [adminMobileNumber]);
        
      
        const fetchRescuers = (reportCity) => {
          const rescuersRef = ref(database, "rescuers");
          onValue(rescuersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              let recommendedRescuers = [];
              let otherRescuers = [];
        
              Object.keys(data).forEach((key) => {
                const rescuer = { id: key, ...data[key] };
                if (rescuer.adminMobileNumber === adminMobileNumber) {
                  if (rescuer.city === reportCity) {
                    recommendedRescuers.push({ ...rescuer, recommended: true });
                  } else {
                    otherRescuers.push({ ...rescuer, recommended: false });
                  }
                }
              });
        
              // Combine lists: Recommended first, then others
              const sortedRescuers = [...recommendedRescuers, ...otherRescuers];
        
              // Log to console
              console.log(reportCity);
              console.log("Recommended Rescuers:", recommendedRescuers);
              console.log("Other Rescuers:", otherRescuers);
              console.log("Final Rescuer List:", sortedRescuers);
        
              setRescuers(sortedRescuers);
            }
          });
        };
        
        
        const handleAssign = (reportId, reportCity) => {
          setSelectedReportId(reportId);
          fetchRescuers(reportCity); // Pass city to filter rescuers
          setModalVisible(true);
        };
        
        
        const assignRescuer = (rescuerMobileNumber) => {
          if (!selectedReportId || !rescuerMobileNumber) return;
          const reportRef = ref(database, `reports/${selectedReportId}`);
          update(reportRef, { assignedRescuerMobileNumber: rescuerMobileNumber })
            .then(() => {
              alert(`Assigned rescuer with mobile: ${rescuerMobileNumber}`);
              setModalVisible(false);
              setSelectedReportId(null);
              sendSMS(rescuerMobileNumber, selectedReportId);
            })
            .catch((error) => {
              alert("Failed to assign rescuer. Please try again.");
              console.error("Error updating report:", error);
            });
            
        };
        const sendSMS = async (rescuerMobileNumber, reportId) => {
          const message = `You have been assigned a new rescue report. Report ID: ${reportId}. Please check the details in the app.`;
          
          try {
            // Assuming your backend is running at http://192.168.0.100:5000
            await axios.post('https://api-lppklutfcq-uc.a.run.app/send-message', {
              phoneNumber: `+91${rescuerMobileNumber}`, // Make sure this is the rescuer's number
              text: message
            });
            console.log('SMS sent successfully');
          } catch (error) {
            console.error('Failed to send SMS:', error);
          }
        };
      
        return (
          <View style={styles.container}>
            <ScrollView horizontal>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerText, styles.headerCell]}>Mobile Number</Text>
                  <Text style={[styles.headerText, styles.headerCell]}>Reported Date</Text>
                  <Text style={[styles.headerText, styles.headerCell]}>Location</Text>
                  <Text style={[styles.headerText, styles.headerCell]}>Action</Text>
                </View>
      
                {loading ? (
                  Array(4).fill(0).map((_, index) => <SkeletonLoader key={index} />)
                ) : (
                  <FlatList
                    data={unassignedRescues}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={styles.tableRow}>
                        <Text style={[styles.rowText, styles.cell]}>{item.mobileNumber}</Text>
                        <Text style={[styles.rowText, styles.cell]}>{item.reportedDate}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(item.location)}>
                          <Text style={[styles.rowText, { color: 'blue' }]}>Open Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.assignButton}
                          onPress={() => handleAssign(item.id, item.city)}
                        >
                          <Text style={styles.assignButtonText}>Assign</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </View>
            </ScrollView>
      
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Rescuer</Text>
                  <FlatList
                    data={rescuers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.rescuerButton,
                          item.recommended && { backgroundColor: '#E0F7FA' }, // Light blue for recommended
                        ]}
                        onPress={() => assignRescuer(item.mobileNumber)}
                      >
                        <Text style={[styles.rescuerText, item.recommended && { fontWeight: 'bold' }]}>
                          {item.name} ({item.mobileNumber}) {item.recommended ? " - Recommended" : ""}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />

                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        );
      };
const Rescue = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('completed');
  const route = useRoute();
  const mobileNumber = route.params?.mobileNumber; // 🔥 Extract mobile number from route params
        
  return (
    <View style={styles.container}>
      
      {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity> */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]} 
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unassigned' && styles.activeTab]} 
          onPress={() => setActiveTab('unassigned')}
        >
          <Text style={[styles.tabText, activeTab === 'unassigned' && styles.activeTabText]}>Unassigned</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'completed' && <View style={{ flex: 1 }}>
      <CompletedTab adminMobileNumber={mobileNumber} />
    </View>}
        {activeTab === 'pending' && <View style={{ flex: 1 }}>
      <PendingTab adminMobileNumber={mobileNumber} />
    </View>}
        {activeTab === 'unassigned' && <View style={{ flex: 1 }}>
      <UnassignedTab adminMobileNumber={mobileNumber} />
    </View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10, // Adjust the top value to fit your design
    left: 10, // Adjust the left value to fit your design
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ddd',
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#004D40',
  },
  tabText: {
    color: 'black',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenContainer: { 
    flex: 1, 
    paddingTop: 10, // Add space at the top
    backgroundColor: '#F5F5F5' // Optional: Set a background color to enhance visual separation
  },
  container: { flex: 1, paddingTop: 0 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#004D40', padding: 10 },
  headerText: { color: '#fff', fontWeight: 'bold' },
  headerCell: { width: 120, textAlign: 'center' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  rowText: { textAlign: 'center' },
  cell: { width: 120 },
  assignButton: { backgroundColor: '#004D40', padding: 8, borderRadius: 5 },
  assignButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { margin: 20, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  rescuerButton: { paddingVertical: 10, width: '100%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  rescuerText: { fontSize: 16, color: '#004D40' },
  closeButton: { marginTop: 20, color: '#004D40', fontSize: 16},
  skeletonRow: { flexDirection: 'row', padding: 10 },
  skeletonCell: { width: 120, height: 20, backgroundColor: '#ccc', marginRight: 10, borderRadius: 5 },
  
});

export default Rescue;
