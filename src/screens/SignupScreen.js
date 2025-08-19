import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signup } from "../api/api";
import Logo from "../components/Logo";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const data = await signup(name, email, password);
      console.log("Signup success:", data);
      navigation.navigate("Login");
    } catch (err) {
      console.log(err.response?.data?.message);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Logo size={1.0} />
      <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#81e4f9" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#81e4f9" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#81e4f9"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Signup" color="#0b7992" onPress={handleSignup} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Log in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#000000"},
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color:"#92240b"},
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, color:"#81e4f9", borderColor: "#81e4f9"},
  link: { color: "#81e4f9", textAlign: "center", marginTop: 10 }
});