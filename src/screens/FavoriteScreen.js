import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigator from "../components/BottomNavigator";

export default function FavoriteScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="heart-circle-outline" size={100} color="#ddd" />
        <Text style={styles.text}>Belum ada kos favorit</Text>
        <Text style={styles.subText}>
          Simpan kos impianmu di sini agar mudah ditemukan nanti.
        </Text>
      </View>
      <BottomNavigator navigation={navigation} activeScreen="Favorite" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  text: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 20 },
  subText: {
    textAlign: "center",
    color: "gray",
    marginTop: 10,
    lineHeight: 22,
  },
});
