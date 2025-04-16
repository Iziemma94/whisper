import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CreateConfessionScreen from './screens/CreateConfessionScreen';
import ConfessionDetailScreen from './screens/ConfessionDetailScreen';
import ConfessionListScreen from './screens/ConfessionListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // For testing only. Remove this once it's working.
        // await AsyncStorage.clear(); 

        const token = await AsyncStorage.getItem('access');
        console.log("🌟 Token from AsyncStorage:", token);
        setIsLoggedIn(!!token);
      } catch (err) {
        console.error("❌ Error checking token:", err);
        setIsLoggedIn(false); // fallback in case of error
      }
    };

    checkLogin();
  }, []);

  // ✅ Show a simple loading state while checking login
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>🔄 Checking login status...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#fff' }}> 
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="CreateConfession" component={CreateConfessionScreen} />
              <Stack.Screen name="ConfessionDetail" component={ConfessionDetailScreen} />
              <Stack.Screen name="ConfessionList" component={ConfessionListScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}