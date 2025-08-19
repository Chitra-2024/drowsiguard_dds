// navigation/RootNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import { ActivityIndicator } from "react-native";


// Import your screens
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import DashboardStack from "./DashboardStack";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, loading } = useContext(AuthContext); // Check if user is logged in
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // If logged in → Show app screens
        <Stack.Screen name="Dashboard" component={DashboardStack} />

      ) : (
        // If NOT logged in → Show login/signup
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
