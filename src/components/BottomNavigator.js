import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BottomNavigator({ navigation, activeScreen }) {
  const NavIcon = ({ name, label, targetScreen }) => {
    const isActive = activeScreen === targetScreen;
    return (
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate(targetScreen)}
      >
        <MaterialCommunityIcons
          name={name}
          size={24}
          color={isActive ? "#27ae60" : "#B0B0B0"}
        />
        <Text
          style={[styles.text, { color: isActive ? "#27ae60" : "#B0B0B0" }]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <NavIcon name="home" label="Beranda" targetScreen="Home" />
      <NavIcon name="magnify" label="Cari" targetScreen="Search" />
      <NavIcon name="heart-outline" label="Favorit" targetScreen="Favorite" />
      <NavIcon
        name="file-document-outline"
        label="Pesanan"
        targetScreen="History"
      />
      <NavIcon name="account-outline" label="Profil" targetScreen="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8, // Sedikit lebih rapat
    backgroundColor: "white",

    // --- GAYA FIXED BOTTOM (MENEMPEL) ---
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,

    // Border atas tipis sebagai pemisah
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",

    // Bayangan halus ke atas
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconBtn: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "500",
  },
});
