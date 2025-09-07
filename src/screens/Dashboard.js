import { View, Text, StyleSheet, Button, StatusBar, Platform , Image, Pressable } from "react-native";
import { ScrollView, RefreshControl, Switch, Linking } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { use, useContext, useState } from "react";
import { TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
const Tab = createBottomTabNavigator();

const ScreenWrapper = ({ children, style }) => (
  <SafeAreaView
    style={[
      styles.safeArea,
      { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      style,
    ]}
  >
    {children}
  </SafeAreaView>
);

const DashboardScreen = () => {
  const navigation = useNavigation(); // use parent stack navigation
  const { user } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22d3ee" />}>
        
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome Back, {user?.name}</Text>
          <Text style={styles.subtext}>Here’s your dashboard overview</Text>
        </View>
        <View style={styles.divider} />

        {/* User Info Card */}
        <Pressable style={styles.card} android_ripple={null}>
          <Image source={require("../assets/user.png")} style={styles.avatar} />
          <View>
            <Text style={styles.cardTitleText}>{user?.name}</Text>
            <Text style={styles.cardSubText}>{user?.role}</Text>
          </View>
        </Pressable>

        {/* Quick Stats */}
        <View style={styles.tilesRow}>
          <View style={styles.tile}>
            <View style={styles.tileIconCircle}>
              <Ionicons name="time-outline" size={18} color="#22d3ee" />
            </View>
            <Text style={styles.tileValue}>--</Text>
            <Text style={styles.tileLabel}>Hours Driven</Text>
          </View>
          <View style={styles.tile}>
            <View style={styles.tileIconCircle}>
              <Ionicons name="alert-circle-outline" size={18} color="#f59e0b" />
            </View>
            <Text style={styles.tileValue}>--</Text>
            <Text style={styles.tileLabel}>Alerts</Text>
          </View>
          <View style={styles.tile}>
            <View style={styles.tileIconCircle}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#22c55e" />
            </View>
            <Text style={styles.tileValue}>--</Text>
            <Text style={styles.tileLabel}>Sessions</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Logs")} activeOpacity={1}>
            <Ionicons name="document-text-outline" size={20} color="#22d3ee" />
            <Text style={styles.actionText}>Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Alerts")} activeOpacity={1}>
            <Ionicons name="notifications-outline" size={20} color="#f59e0b" />
            <Text style={styles.actionText}>Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Profile")} activeOpacity={1}>
            <Ionicons name="person-outline" size={20} color="#a78bfa" />
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <Pressable style={styles.cameraBtn} onPress={() => navigation.navigate("Camera")} android_ripple={null}>
          <Text style={styles.cameraBtnText}>Start Detecting Drowsiness</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
};


const LogsScreen = () => (
  <ScreenWrapper>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Driver Logs</Text>
      <View style={styles.cardAlt}>
        <Text style={styles.cardText}>No logs available yet.</Text>
      </View>
    </ScrollView>
  </ScreenWrapper>
);

const AlertsScreen = () => (
  <ScreenWrapper>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Alerts</Text>
      <View style={styles.cardAlt}>
        <Text style={styles.cardText}>No active alerts</Text>
      </View>
    </ScrollView>
  </ScreenWrapper>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const handleLogout = () => {
    logout(); // this will trigger RootNavigator to show Login automatically
  };

  return (
    <ScreenWrapper style={darkModeEnabled ? styles.safeAreaDark : undefined}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={require("../assets/user.png")} style={styles.image}/>
        <Text style={[styles.name_text, darkModeEnabled && styles.textLight]}>{user?.name}</Text>
        <Text style={[styles.center_text, darkModeEnabled && styles.textLight]}>{user?.email}</Text>
        <Text style={[styles.center_text, darkModeEnabled && styles.textLight]}>{user?.role}</Text>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={[styles.settingsCard, darkModeEnabled && styles.settingsCardDark]}>
          <View style={styles.settingRowTall}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: "#334155", true: "#22d3ee" }} thumbColor="#0b1220" />
          </View>
          <View style={styles.settingRowTall}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch value={darkModeEnabled} onValueChange={setDarkModeEnabled} trackColor={{ false: "#334155", true: "#a78bfa" }} thumbColor="#0b1220" />
          </View>
          <TouchableOpacity style={styles.settingRowTall} onPress={() => {}}>
            <View style={styles.rowLeft}>
              <Ionicons name="create-outline" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRowTall} onPress={() => {}}>
            <View style={styles.rowLeft}>
              <Ionicons name="key-outline" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRowTall} onPress={() => Linking.openURL('mailto:support@drowsiguard.app')}>
            <View style={styles.rowLeft}>
              <Ionicons name="help-circle-outline" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>
          <View style={styles.settingRowTall}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle-outline" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>About DrowsiGuard</Text>
            </View>
            <Text style={styles.settingValue}>App</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
          tabBarActiveTintColor: "#22d3ee",
          tabBarInactiveTintColor: "#64748b",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          tabBarStyle:{
            position: "absolute",
            backgroundColor:"#0b1220",
            borderTopColor: "transparent",
            marginHorizontal: 16,
            marginBottom: Platform.OS === "android" ? 24 : 16,
            height: 64,
            borderRadius: 16,
            paddingBottom: Platform.OS === "android" ? 14 : 8,
            paddingTop: 8,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 16,
            elevation: 6,
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
    paddingBottom: Platform.OS === "android" ? 24 : 0,
  },
  safeAreaDark: {
    backgroundColor: "#050816",
  },
  container: {
    paddingBottom: 120,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginHorizontal: 16,
    marginBottom: 16,
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
    backgroundColor: "#81e4f9",
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
  cardAlt: {
    backgroundColor: "#0b1220",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  tilesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: "#0b1220",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  tileIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  tileValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  tileLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#0b1220",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionText: {
    color: "#e2e8f0",
    fontWeight: "600",
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardSubText: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
    marginTop: 2,
  },
  cardText: {
    fontSize: 16,
    color: "#ffffff"
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
  settingsCard: {
    backgroundColor: "#0b1220",
    borderRadius: 14,
    marginHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
  },
  settingRowTall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 8,
  },
  settingValue: {
    color: "#94a3b8",
    fontSize: 13,
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
    bottom: Platform.OS === "android" ? 60 : 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    alignSelf: "center",
  },
  Tab: {
    backgroundColor: "#1b2b2dff",
  },
});
