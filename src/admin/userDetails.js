import { getUserData } from '../DBHelper';
import React, { useEffect, useState } from 'react';
import { Text } from '@react-native-material/core';
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

export default function UserDetails(props) {
  const isFocused = useIsFocused();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, [isFocused]);

  const fetchUserData = async () => {
    try {
      const userData = await getUserData();
      console.log(userData);
      setUsers(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => props.navigation.navigate('EditProfile', { 'id': item.uid })}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.uname}</Text>
        <Text style={styles.details}>Phone: {item.phone_no}</Text>
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      </View>
    </TouchableOpacity>
  );

  return (
    (users.length == 0? <View style={[styles.container,{justifyContent:'center'}]}><Text style={[styles.name,{textAlign:'center'}]}>No Users Found</Text></View>:<View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.uid.toString()}
      />
    </View>)
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#ff6600',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ff6600',
  },
  details: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
