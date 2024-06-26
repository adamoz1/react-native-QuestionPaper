import LoginPage from './src/loginPage';
import UserMenu from './src/user/userMenu';
import AdminMenu from './src/admin/adminMenu';
import CreateUser from './src/admin/createUser';
import UserDetails from './src/admin/userDetails';
import EditProfile from './src/admin/editProfile';
import AddQuestion from './src/admin/addQuestion';
import React, { useState, useEffect } from 'react';
import { createTables } from './src/DBHelper';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuestionReport from './src/admin/questionReport';
import UserProfile from './src/user/userProfile';
import UserReport from './src/user/userReport';
import AttendQuestion from './src/user/attendQuestion';
import ReportUserList from './src/admin/reportUserList';

const Stack = createNativeStackNavigator();

function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        createTables();
        const loginStatus = await AsyncStorage.getItem('isLoggedIn');
        console.log(loginStatus);
        if (loginStatus === 'admin') {
          setInitialRoute('AdminMenu');
        } else if (loginStatus === 'user') {
          setInitialRoute('UserMenu');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Failed to load login status:', error);
        setInitialRoute('Login');
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginPage} options={{headerShown:false}}/>
        <Stack.Screen name="AdminMenu" component={AdminMenu} options={{headerShown:false}} />
        <Stack.Screen name="UserMenu" component={UserMenu} options={{headerShown:false}}/>
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="AddQuestion" component={AddQuestion} />
        <Stack.Screen name="UserProfile" component={UserProfile} /> 
        <Stack.Screen name="AttendQuestion" component={AttendQuestion} />
        <Stack.Screen name="Report" component={UserReport} />
        <Stack.Screen name="QuestionReport" component={QuestionReport} />
        <Stack.Screen name="ReportUserList" component={ReportUserList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
