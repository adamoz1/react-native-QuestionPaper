import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { insertUser } from '../DBHelper';
import { View, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text } from '@react-native-material/core';

const CreateUser = (props) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const pickImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    try {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          console.log(response, 'Response is this -----------------');
          setImageUri(response.assets[0].uri);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = () => {
    if (!name || !password || !mobileNumber || !imageUri) {
      Alert.alert('Error', 'Please fill all fields and select an image.');
      return;
    }

    if (mobileNumber.length !== 10) {
      Alert.alert('Error', 'Mobile number should be 10 digits long.');
      return;
    }

    if (!['6', '7', '8', '9'].includes(mobileNumber[0])) {
      Alert.alert('Error', 'Mobile number should start with 6, 7, 8, or 9.');
      return;
    }

    insertUser(name, password, mobileNumber, imageUri)
      .then(() => {
        Alert.alert('Success', 'User Data Inserted Successfully');
        props.navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        if (error.includes('UNIQUE')) {
          Alert.alert('Error', 'Unique Username needed');
        } else {
          console.log('It\'s insertUser function error block');
          Alert.alert('Error', error);
        }
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Add User</Text>
          <TextInput
            label="Name"
            value={name}
            onChangeText={text => setName(text)}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={isPasswordSecure}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <TouchableOpacity style={styles.togglePassword} onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
            <Text style={styles.togglePasswordText}>Show/Hide Password</Text>
          </TouchableOpacity>
          <TextInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={text => setMobileNumber(text)}
            keyboardType="phone-pad"
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerButtonText}>Select Image</Text>
          </TouchableOpacity>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
          <Button
            title="Submit"
            onPress={handleSubmit}
            color="#ff6600"
            titleStyle={{ color: 'white' }}
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff5e6',
  },
  formContainer: {
    // width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    marginBottom: 16,
    borderColor: '#ff6600',
  },
  togglePassword: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  togglePasswordText: {
    color: '#ff6600',
  },
  imagePickerButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#ff6600',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#ff6600',
  },
});

export default CreateUser;
