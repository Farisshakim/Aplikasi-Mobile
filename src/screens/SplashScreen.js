import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import Icon

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* 1. LOGO ICON VECTOR (OFFLINE READY) */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="home-city" size={100} color="#27ae60" />
      </View>

      {/* 2. NAMA APLIKASI */}
      <Text style={styles.title}>AnaKKost</Text>

      {/* 3. SLOGAN */}
      <Text style={styles.subtitle}>Cari Kost Nyaman, Hidup Aman</Text>

      <View style={styles.footer}>
        <Text style={styles.version}>Versi 1.0.0 (Beta)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
    // Opsional: Kasih bayangan dikit biar timbul
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#27ae60",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
  },
  version: {
    color: "#ccc",
    fontSize: 12,
  },
});
