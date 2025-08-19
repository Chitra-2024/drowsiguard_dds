import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../screens/Dashboard"; // your existing Tab navigator
import CameraScreen from "../screens/CameraScreen";

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tabs (your existing Dashboard.js Tab navigator) */}
      <Stack.Screen name="MainTabs" component={Dashboard} />

      {/* Camera Screen */}
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
}
