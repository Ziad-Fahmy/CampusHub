import React from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
const FacilitiesList = ({ navigation }) => {
  // In a real app, this would fetch from the API 
  const [facilities, setFacilities] = React.useState([
    {
      id: '1',
      name: 'Basketball Court',
      type: 'sports',
      location: 'Sports Complex, North Wing',
      capacity: 30,
      description: 'Full-size indoor basketball court with seating for spectators.',
      image: 'basketball.jpg'
    },
    {
      id: '2',
      name: 'Study Hall A',
      type: 'study',
      location: 'Library, 2nd Floor',
      capacity: 50,
      description: 'Quiet study space with individual desks and power outlets.',
      image: 'study.jpg'
    },
    {
      id: '3',
      name: 'Conference Room',
      type: 'event',
      location: 'Student Center, Room 201',
      capacity: 25,
      description: 'Meeting room with projector, whiteboard, and conference table.',
      image: 'conference.jpg'
    },
    {
      id: '4',
      name: 'Computer Lab',
      type: 'lab',
      location: 'Technology Building, Room 105',
      capacity: 40,
      description: 'Computer lab with high-performance workstations and specialized software.',
      image: 'lab.jpg'
    }
  ]);
  
  const [loading, setLoading] = React.useState(false);
  
  const renderFacilityItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph style={styles.location}>{item.location}</Paragraph>
        <Paragraph>Capacity: {item.capacity} people</Paragraph>
        <Paragraph>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('FacilityDetails', { facility: item })}
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );
  
  const filterByType = (type) => {
    setLoading(true);
    // In a real app, this would filter from the API
    setTimeout(() => {
      if (type === 'all') {
        setFacilities([
          {
            id: '1',
            name: 'Basketball Court',
            type: 'sports',
            location: 'Sports Complex, North Wing',
            capacity: 30,
            description: 'Full-size indoor basketball court with seating for spectators.',
            image: 'basketball.jpg'
          },
          {
            id: '2',
            name: 'Study Hall A',
            type: 'study',
            location: 'Library, 2nd Floor',
            capacity: 50,
            description: 'Quiet study space with individual desks and power outlets.',
            image: 'study.jpg'
          },
          {
            id: '3',
            name: 'Conference Room',
            type: 'event',
            location: 'Student Center, Room 201',
            capacity: 25,
            description: 'Meeting room with projector, whiteboard, and conference table.',
            image: 'conference.jpg'
          },
          {
            id: '4',
            name: 'Computer Lab',
            type: 'lab',
            location: 'Technology Building, Room 105',
            capacity: 40,
            description: 'Computer lab with high-performance workstations and specialized software.',
            image: 'lab.jpg'
          }
        ]);
      } else {
        setFacilities(facilities.filter(facility => facility.type === type));
      }
      setLoading(false);
    }, 500);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => filterByType('all')}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => filterByType('sports')}
          >
            <Text style={styles.filterText}>Sports</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => filterByType('study')}
          >
            <Text style={styles.filterText}>Study</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => filterByType('event')}
          >
            <Text style={styles.filterText}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => filterByType('lab')}
          >
            <Text style={styles.filterText}>Labs</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : (
        <FlatList
          data={facilities}
          renderItem={renderFacilityItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#003366',
    borderRadius: 20,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  location: {
    color: '#666',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FacilitiesList;
