import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import axios from 'axios';

const API_URL = 'https://dev.iqrakitab.net/api/books';

const useFetchData = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setBooks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return { books, loading };
};

const App = () => {
  const { books, loading } = useFetchData();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const handleSearch = text => {
    setSearchText(text);
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const toggleRTL = () => {
    setIsRTL(!isRTL);
  };

  const scaleValue = new Animated.Value(1); // Initial scale value for touchable opacity

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.1, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.bookItem, { transform: [{ scale: scaleValue }] }]} // Apply scale animation
      onPress={() => {
        console.log('Book selected:', item.title);
        startAnimation(); // Start animation on press
      }}
      activeOpacity={0.7}
    >
      <Text style={[styles.bookTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <Text style={[styles.navigationBarTitle, { color: '#fff', fontFamily: 'ItalianFont' }]}>Book Reading App</Text>
      </View>
      <Button title={isRTL ? 'LTR' : 'RTL'} onPress={toggleRTL} color="#db7093" /> {/* Change color of RTL button to dark pink */}
      <TextInput
        placeholder={isRTL ? "کتاب کا عنوان تلاش کریں..." : "Search by book title..."}
        value={searchText}
        onChangeText={handleSearch}
        style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          style={styles.flatList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdcdc', // grey background color
  },
  navigationBar: {
    width: '100%',
    height: 60,
    borderWidth: 2, // Add border to the navigation bar
    borderColor: '#ff69b4', // Bright pink border color
    backgroundColor: '#ffb6c1', // light pink background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // white font color
  },
  searchInput: {
    borderWidth: 2, // Increased border width
    borderColor: '#ff69b4', // Bright pink outline color
    width: '80%',
    margin: 10,
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#fff', // White background for search input
    color: '#000000', // Black font color
    fontWeight: 'bold', // Added font weight to make it bold
  },
  flatList: {
    width: '100%',
  },
  bookItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fffafa', // lightest pink background color
    borderRadius: 8,
    elevation: 5, // Add elevation for shadow effect
  },
  bookTitle: {
    fontSize: 16,
    color: '#c71585', // Adjusted to darker pink font color
    fontFamily: 'BeautifulFont', // Custom font family for beautiful font style
  },
});

export default App;
