import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppBar, Button } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminMenu(props) {
  return (
    <>
      <AppBar 
        title="Admin Menu" 
        color='#ff6600' 
        titleStyle={{ color: 'white' }} 
        trailing={prop => (
          <Button
            variant="text"
            title="Logout"
            titleStyle={{ color: 'white' }} 
            compact
            style={{ marginEnd: 4, color: 'white' }}
            onPress={async () => {
              await AsyncStorage.clear();
              props.navigation.navigate('Login');
              console.log("Button is working after");
            }}
            {...prop}
          />
        )} 
      />
      <View style={styles.mainContainer}>
        <Button 
          title="Add User" 
          style={styles.button} 
          color='#ff6600' 
          tintColor="white" 
          onPress={() => props.navigation.navigate('CreateUser')}
        />
        <Button 
          title="User List" 
          style={styles.button} 
          color='#ff6600' 
          tintColor="white" 
          onPress={() => props.navigation.navigate('UserDetails')}
        />
        <Button 
          title="Add Question" 
          style={styles.button} 
          color='#ff6600' 
          tintColor="white" 
          onPress={() => props.navigation.navigate('AddQuestion')}
        />
        <Button 
          title="Report" 
          style={styles.button} 
          color='#ff6600' 
          tintColor="white" 
          onPress={() => props.navigation.navigate('ReportUserList')}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff5e6',
  },
  button: {
    marginVertical: 5,
  },
});
