import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppBar, Button } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserMenu(props) {
  return (
    <>
      <AppBar title="Menu" color='#ff6600' titleStyle={{ color: 'white' }}  trailing={prop => (
        <Button
          variant="text"
          title="Logout"
          titleStyle={{color:'white'}}
          compact
          style={{ marginEnd: 4 }}
          onPress={async () => {
            await AsyncStorage.clear();
            props.navigation.navigate('Login');
          }}
          {...prop}
        />
      )} />
      <View style={styles.mainContainer}>
        <Button title="Profile" style={styles.button} onPress={() => props.navigation.navigate('UserProfile')}  backgroundColor='#ff6600'></Button>
        <Button title="Attend Question" style={styles.button} onPress={() => props.navigation.navigate('AttendQuestion')} backgroundColor='#ff6600'></Button>
        <Button title="Report" style={styles.button} onPress={() => props.navigation.navigate('Report')} backgroundColor='#ff6600'></Button>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ffebcc',
  },
  button: {
    marginVertical: 10,
    width:'100%',
    color:'#ffffff'
  }
});
