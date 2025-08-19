import React from "react";
import { Image, StyleSheet } from "react-native";

const Logo = ({ size = 0.5 }) => {
  return (
    <Image
      source={require("../assets/drowsiguard_logo.png")}
      style={[styles.logo, { width: 200 * size, height: 200 * size }]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default Logo;
