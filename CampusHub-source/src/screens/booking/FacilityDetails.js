import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { getFacilities, createBooking } from '../../api/api';

const FacilityDetails = ({ route, navigation }) => {
  const { facility } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [availableSlots, setAvailableSlots] = React.useState([]);
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);
  const { user } = useSelector((state) => state.auth);
  
  React.useEffect(() => {
    // In a real app, this would fetch from the API
    setLoading(true);
    setTimeout(() => {
      setAvailableSlots([
        {
          id: '1',
          date: new Date('2025-05-20'),
          startTime: '09:00',
          endTime: '11:00',
          isBooked: false
        },
        {
          id: '2',
          date: new Date('2025-05-20'),
          startTime: '13:00',
          endTime: '15:00',
          isBooked: false
        },
        {
          id: '3',
          date: new Date('2025-05-21'),
          startTime: '10:00',
          endTime: '12:00',
          isBooked: false
        },
        {
          id: '4',
          date: new Date('2025-05-21'),
          startTime: '14:00',
          endTime: '16:00',
          isBooked: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [facility.id]);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleBooking = async () => {
    if (!selectedSlot) return;
    
    setLoading(true);
    
    try {
      // In a real app, this would call the API
      // await createBooking({
      //   facilityId: facility.id,
      //   date: selectedSlot.date,
      //   startTime: selectedSlot.startTime,
      //   endTime: selectedSlot.endTime
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBookingSuccess(true);
      setSelectedSlot(null);
      
      // Update available slots
      setAvailableSlots(availableSlots.map(slot => 
        slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
      ));
      
      setLoading(false);
    } catch (error) {
      console.error('Booking failed:', error);
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{facility.name}</Title>
          <Paragraph style={styles.location}>{facility.location}</Paragraph>
          <Paragraph style={styles.description}>{facility.description}</Paragraph>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>{facility.type}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Capacity:</Text>
              <Text style={styles.detailValue}>{facility.capacity} people</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {bookingSuccess && (
        <Card style={[styles.card, styles.successCard]}>
          <Card.Content>
            <Title style={styles.successTitle}>Booking Successful!</Title>
            <Paragraph style={styles.successText}>
              Your booking has been confirmed. You can view your bookings in the profile section.
            </Paragraph>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('MyBookings')}
              style={styles.viewBookingsButton}
            >
              View My Bookings
            </Button>
          </Card.Content>
        </Card>
      )}
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Available Time Slots</Title>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#003366" />
            </View>
          ) : (
            <View>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotContainer,
                      selectedSlot?.id === slot.id && styles.selectedSlot,
                      slot.isBooked && styles.bookedSlot
                    ]}
                    onPress={() => !slot.isBooked && setSelectedSlot(slot)}
                    disabled={slot.isBooked}
                  >
                    <View style={styles.slotInfo}>
                      <Text style={styles.slotDate}>{formatDate(slot.date)}</Text>
                      <Text style={styles.slotTime}>{slot.startTime} - {slot.endTime}</Text>
                    </View>
                    {slot.isBooked ? (
                      <Text style={styles.bookedText}>Booked</Text>
                    ) : (
                      <View style={styles.radioButton}>
                        {selectedSlot?.id === slot.id && <View style={styles.radioButtonInner} />}
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noSlotsText}>No available time slots for this facility.</Text>
              )}
              
              <Button 
                mode="contained" 
                onPress={handleBooking}
                style={styles.bookButton}
                disabled={!selectedSlot || loading}
                loading={loading}
              >
                Book Selected Slot
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  location: {
    color: '#666',
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 80,
  },
  detailValue: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  slotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedSlot: {
    borderColor: '#003366',
    backgroundColor: 'rgba(0, 51, 102, 0.05)',
  },
  bookedSlot: {
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  slotInfo: {
    flex: 1,
  },
  slotDate: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  slotTime: {
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#003366',
  },
  bookedText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  noSlotsText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  bookButton: {
    marginTop: 16,
  },
  successCard: {
    backgroundColor: '#E8F5E9',
  },
  successTitle: {
    color: '#2E7D32',
  },
  successText: {
    marginBottom: 16,
  },
  viewBookingsButton: {
    backgroundColor: '#2E7D32',
  },
});

export default FacilityDetails;
