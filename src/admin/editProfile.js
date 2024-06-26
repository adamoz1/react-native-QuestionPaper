import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, Button, ScrollView } from 'react-native';
import { TextInput, Text } from '@react-native-material/core';
import { getUserData, updateUser } from '../DBHelper';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfile(props) {
  const [uid, setUid] = useState('');
  const [uname, setUname] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = props.route.params.id;
      const userData = await getUserData();
      const user = userData.find(user => user.uid === parseInt(userId));
      if (user) {
        setUid(user.uid);
        setUname(user.uname);
        setPassword(user.password);
        setPhoneNo(user.phone_no);
        setImage(user.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(uid, uname, password, phoneNo, image);
      Alert.alert('Success', 'Profile updated successfully', [
        { 'text': 'OK', onPress: () => props.navigation.goBack() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update profile', [{ 'text': 'OK' }]);
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        setImage(uri);
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Edit Profile</Text>
          <TextInput
            label="Username"
            value={uname}
            onChangeText={value => setUname(value)}
            style={styles.input}
            variant="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={value => setPassword(value)}
            style={styles.input}
            variant="outlined"
            secureTextEntry
          />
          <TextInput
            label="Phone Number"
            value={phoneNo}
            onChangeText={value => setPhoneNo(value)}
            style={styles.input}
            variant="outlined"
          />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <View style={styles.marginBtm}>
            <Button title="Pick an Image" onPress={pickImage} color="#ff6600" />
          </View>
          <Button
            title="Update Profile"
            onPress={handleUpdate}
            color="#ff6600"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff5e6',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderLeftColor: '#ff6600',
  },
  input: {
    marginVertical: 10,
    borderColor: '#ff6600',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#ff6600',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  marginBtm: {
    marginBottom: 10,
  },
});

