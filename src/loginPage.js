import React, { useState } from 'react';
import { validateUser } from './DBHelper';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const handleLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert("Message", "Enter proper credentials to login!!", [
        { text: 'OK' },
      ]);
      return;
    }

    try {
      if (username === 'admin' && password === 'admin') {
        await AsyncStorage.setItem('isLoggedIn', 'admin');
        props.navigation.navigate('AdminMenu');
      } else {
        const user = await validateUser(username, password);
        console.log(user, "User Details ----------------------");
        if (!user.uid) {
          Alert.alert("Message", "Enter proper credentials to login!!", [
            { text: 'OK' },
          ]);
          return;
        }
        await AsyncStorage.setItem('isLoggedIn', 'user');
        await AsyncStorage.setItem('user-id', user.uid.toString());
        props.navigation.navigate('UserMenu');
      }
      setUsername('');
      setPassword('');
    } catch (error) {
      console.log(error, "error in login page");
      Alert.alert("Message", "Invalid username or password", [
        { text: 'OK' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ScrollView>
          <Text style={styles.header}>Login</Text>
          <TextInput
            label="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
            placeholderTextColor="#ff6600"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            color='#ff6600'
            variant="outlined"
            secureTextEntry={isPasswordSecure}
            placeholderTextColor="#ff6600"
          />
          <TouchableOpacity style={styles.togglePassword} onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
            <Text style={styles.togglePasswordText}>Show/Hide Password</Text>
          </TouchableOpacity>
          <Button
            title="Login"
            onPress={handleLogin}
            style={styles.button}
            titleStyle={{ color: '#ffffff' }}
            color="#ffffff"
            backgroundColor="#ff6600"
          />
        </ScrollView>
      </View>
    </View>
  );
};

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
  input: {
    marginBottom: 16,
    color: '#000000',
    borderColor: '#ff6600',
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
  togglePassword: {
    marginBottom: 15,
  },
  togglePasswordText: {
    color: '#ff6600',
    textAlign: 'right',
  },
});

export default LoginPage;
