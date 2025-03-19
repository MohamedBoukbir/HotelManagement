import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (navigation) => {
  try {
    await AsyncStorage.clear(); // Clear all stored data
    navigation.replace('Auth'); // Navigate to the Auth stack
  } catch (error) {
    console.error('Error during logout:', error);
  }
};