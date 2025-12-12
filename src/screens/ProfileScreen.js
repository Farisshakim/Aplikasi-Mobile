import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  // Fungsi Cek Login
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cekStatusLogin();
    });
    return unsubscribe;
  }, [navigation]);

  const cekStatusLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("user_data");
      if (value !== null) {
        setUser(JSON.parse(value));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Keluar", "Yakin ingin logout?", [
      { text: "Batal" },
      {
        text: "Ya, Keluar",
        onPress: async () => {
          await AsyncStorage.removeItem("user_data");
          setUser(null);
          navigation.navigate("Home");
        },
      },
    ]);
  };

  // --- TAMPILAN JIKA BELUM LOGIN (GUEST) ---
  if (user === null) {
    return (
      <View style={styles.container}>
        {/* --- TAMBAHAN: TOMBOL BACK --- */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")} // Bisa ganti navigation.goBack()
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        {/* ----------------------------- */}

        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.title}>Selamat Datang!</Text>
        <Text style={styles.subTitle}>
          Silakan login untuk menikmati fitur lengkap.
        </Text>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#27ae60" }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnText}>Masuk (Login)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#34495e", marginTop: 10 }]}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.btnText}>Daftar Akun (Register)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- TAMPILAN JIKA SUDAH LOGIN (USER) ---
  return (
    <View style={styles.container}>
      {/* Tombol Back Opsional untuk User Login (Jika mau) */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatarUser}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("History")}
        >
          <Ionicons name="document-text-outline" size={24} color="#555" />
          <Text style={styles.menuText}>Riwayat Pesanan Saya</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#555" />
          <Text style={styles.menuText}>Pengaturan Akun</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={[styles.menuText, { color: "red" }]}>
            Keluar Aplikasi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  // --- STYLE TOMBOL BACK ---
  backButton: {
    position: "absolute", // Agar menempel di atas
    top: 50, // Jarak dari atas (menghindari Status Bar)
    left: 20, // Jarak dari kiri
    zIndex: 10, // Agar bisa diklik (di atas elemen lain)
    padding: 5,
  },
  // -----------------------
  avatar: { width: 100, height: 100, marginBottom: 20, tintColor: "#ccc" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subTitle: { color: "gray", marginBottom: 30 },
  btn: { width: "80%", padding: 15, borderRadius: 10, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },

  header: { alignItems: "center", marginTop: 50, marginBottom: 30 },
  avatarUser: { width: 80, height: 80, borderRadius: 40, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold" },
  email: { color: "gray" },
  menuContainer: { width: "100%", paddingHorizontal: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16 },
});
