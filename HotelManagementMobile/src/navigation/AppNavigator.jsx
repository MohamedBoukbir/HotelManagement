import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AddHotelScreen from '../screens/dashboard/AddHotelScreen';
import EditHotelScreen from '../screens/dashboard/EditHotelScreen';
import HotelsScreen from '../screens/hotels/HotelsScreen';
import HotelDetailScreen from '../screens/hotels/HotelDetailScreen';
import MainScreen from '../screens/main/MainScreen';
import { logout } from '../screens/auth/logout';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);


const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MyHotels" component={DashboardScreen} />
    <Stack.Screen name="AddHotel" component={AddHotelScreen} />
    <Stack.Screen name="EditHotel" component={EditHotelScreen} />
    <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
  </Stack.Navigator>
);

const HotelsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HotelsList" component={HotelsScreen} />
    <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
    <Stack.Screen name="EditHotel" component={EditHotelScreen} />
  </Stack.Navigator>
);


const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Hotels':
            iconName = 'hotel';
            break;
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Logout':
            iconName = 'logout';
            break;
          default:
            iconName = 'circle';
        }
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={MainScreen} />
    <Tab.Screen name="Hotels" component={HotelsStack} />
    <Tab.Screen name="Dashboard" component={DashboardStack} />
    <Tab.Screen
      name="Logout"
      component={() => null}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault(); 
          logout(navigation); 
        },
      })}
    />
  </Tab.Navigator>
);


const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="MainApp" component={MainTabs} />
  </Stack.Navigator>
);

export default AppNavigator;