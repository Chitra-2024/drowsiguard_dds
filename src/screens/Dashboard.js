import { View, Text, StyleSheet, Button, StatusBar, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Tab = createBottomTabNavigator();


const ScreenWrapper = ({ children }) => (
  <SafeAreaView
    style={[
      styles.safeArea,
      { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
    ]}
  >
    {children}
  </SafeAreaView>
);

const DashboardScreen = () => {
  const navigation = useNavigation(); // ✅ use parent stack navigation

  return (
    <ScreenWrapper>
      <Text style={styles.title}>🚍 Driver Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Drowsiness Status</Text>
        <Text style={styles.cardText}>Active Monitoring...</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last Alert</Text>
        <Text style={styles.cardText}>No recent alerts ✅</Text>
      </View>

      <Button
        title="Open Camera"
        onPress={() => navigation.navigate("Camera")} // ✅ this now works
      />
    </ScreenWrapper>
  );
};


const LogsScreen = () => (
  <ScreenWrapper>
    <Text style={styles.title}>📑 Driver Logs</Text>
    <View style={styles.card}>
      <Text style={styles.cardText}>No logs available yet.</Text>
    </View>
  </ScreenWrapper>
);

const AlertsScreen = () => (
  <ScreenWrapper>
    <Text style={styles.title}>⚠️ Alerts</Text>
    <View style={styles.card}>
      <Text style={styles.cardText}>No active alerts 🚨</Text>
    </View>
  </ScreenWrapper>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext); // ✅ get logout from context

  const handleLogout = () => {
    logout(); // ✅ this will trigger RootNavigator to show Login automatically
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>👤 Profile</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Name: John Doe</Text>
        <Text style={styles.cardText}>Role: Bus Driver</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default function Dashboard({ navigation }) {
  return (

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Dashboard") iconName = "speedometer-outline";
            else if (route.name === "Logs") iconName = "document-text";
            else if (route.name === "Alerts") iconName = "alert-circle";
            else if (route.name === "Profile") iconName = "person";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Dash" component={DashboardScreen} />
        <Tab.Screen name="Logs" component={LogsScreen} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
    color: "#ffffff",
  },
  card: {
    backgroundColor: "#81e4f9",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000000ff",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#000000"
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: "#FF5252",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
    alignSelf: "center",
  },
});
