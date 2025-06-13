import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const FacilityDetails = ({ route, navigation }) => {
  const { facility } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        {facility.image && (
          <Image
            source={{
              uri: `https://via.placeholder.com/300x200.png?text=${facility.name.replace(/ /g, '+')}`,
            }}
            style={styles.image}
          />
        )}
        <Card.Content>
          <Title style={styles.title}>{facility.name}</Title>
          <Paragraph style={styles.location}>Location: {facility.location}</Paragraph>
          <Paragraph style={styles.details}>Type: {facility.type}</Paragraph>
          <Paragraph style={styles.details}>Capacity: {facility.capacity} people</Paragraph>
          <Paragraph style={styles.description}>{facility.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Book Facility functionality here!')}>
            Book Facility
          </Button>
          <Button mode="outlined" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  image: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },
});

export default FacilityDetails;


