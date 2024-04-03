import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

export default function Home({ navigation }) {

  const [data, setData] = useState([]);

  useEffect(() => {
    // Check if data exists in AsyncStorage
    AsyncStorage.getItem('Data').then((storedData) => {
      if (storedData) {
        // Data exists in AsyncStorage
        console.log('Data found in AsyncStorage:', storedData);
        setData(JSON.parse(storedData));
      } else {
        // Data doesn't exist in AsyncStorage, fetch from API
        console.log('No data found in AsyncStorage, fetching from API...');
        fetchDataFromAPI();
      }
    }).catch(error => {
      console.error('Error reading data from AsyncStorage:', error);
    });
  }, []);

  const fetchDataFromAPI = () => {
    axios.get('https://reactnative.dev/movies.json')
      .then((response) => {
        const fetchedData = response.data.movies;
        setData(fetchedData);
        AsyncStorage.setItem('Data', JSON.stringify(fetchedData))
          .then(() => {
            console.log('Data stored successfully in AsyncStorage');
          })
          .catch(error => {
            console.error('Error storing data in AsyncStorage:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.text}>{item.id}</Text>
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.text}>{item.releaseYear}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NextScreen')}>
        <Text style={styles.buttonText}>Go to Next Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});