import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from '@react-native-material/core';
import { getUserData } from '../DBHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfile(props) {
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [img, setImg] = useState('');
  var id;
  
  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      id = await AsyncStorage.getItem('user-id');
      const userId = id;
      const userData = await getUserData();
      const user = userData.find(user => user.uid === parseInt(userId));
      if (user) {
        setName(user.uname);
        setPhoneNo(user.phone_no);
        setImg(user.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Profile</Text>
        {img ? <Image source={{ uri: img }} style={styles.image} /> : null}
        <Text style={styles.label}>
          Username: <Text style={styles.value}>{name}</Text>
        </Text>
        <Text style={styles.label}>
          Phone Number: <Text style={styles.value}>{phoneNo}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffebcc',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#ffffff', 
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000', 
    fontWeight: '600',
  },
  value: {
    fontWeight: '400',
    color: '#333333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
});
