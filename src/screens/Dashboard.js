import { View, Text, StyleSheet, Button, StatusBar, Platform , Image} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { use, useContext } from "react";
import { TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
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
  const navigation = useNavigation(); // use parent stack navigation
  const { user } = useContext(AuthContext);
  return (
    <ScreenWrapper>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.subtext}>Here’s your dashboard overview</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <Image source={require("../assets/user.png")} style={styles.avatar} />
        <View>
          <Text style={styles.cardText}>{user?.name}</Text>
          <Text style={styles.cardText}>{user?.role}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cameraBtn}
        onPress={() => navigation.navigate("Camera")} 
      >
        <Text style={styles.cameraBtnText}>Start Detecting Drowsiness</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};


const LogsScreen = () => (
  <ScreenWrapper>
    <Text style={styles.title}>Driver Logs</Text>
    <View style={styles.card}>
      <Text style={styles.cardText}>No logs available yet.</Text>
    </View>
  </ScreenWrapper>
);

const AlertsScreen = () => (
  <ScreenWrapper>
    <Text style={styles.title}>Alerts</Text>
    <View style={styles.card}>
      <Text style={styles.cardText}>No active alerts</Text>
    </View>
  </ScreenWrapper>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const handleLogout = () => {
    logout(); // this will trigger RootNavigator to show Login automatically
  };

  return (
    <ScreenWrapper>
      <Image source={require("../assets/user.png")} style={styles.image}/>
      <Text style={styles.name_text}>{user?.name}</Text>
      <Text style={styles.center_text}>{user?.email}</Text>
      <Text style={styles.center_text}>{user?.role}</Text>

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
          tabBarStyle:{
            backgroundColor:"#000000",
            borderTopColor: "#222222",
          }
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
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
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 20,
  },
  subtext: {
    fontSize: 14,
    color: "#abc5d3ff",
    marginTop: 4,
    marginLeft: 20,
  },
  name_text:{
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  center_text:{
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
    color: "#ffffff",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#3d5c64ff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#ffffffff",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#ffffffff"
  },
  cameraBtn: {
    marginTop: 20,
    backgroundColor: "#81e4f9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    width: "60%",
    alignSelf: "center"
  },
  cameraBtnText: {
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center"
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: "#FF5252",
    position: "absolute",
    bottom: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
    alignSelf: "center",
  },
  Tab: {
    backgroundColor: "#1b2b2dff",
  },
});
