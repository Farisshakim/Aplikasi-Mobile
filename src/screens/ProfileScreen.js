import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StatusBar,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNavigator from "../components/BottomNavigator";
import { IMAGE_URL } from "../config";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [creditVisible, setCreditVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => cekStatusLogin());
    return unsubscribe;
  }, [navigation]);

  const cekStatusLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("user_data");
      setUser(value ? JSON.parse(value) : null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Keluar Akun", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya, Keluar",
        onPress: async () => {
          await AsyncStorage.removeItem("user_data");
          setUser(null);
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        },
        style: "destructive",
      },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, isDestructive, subLabel }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[styles.iconBox, isDestructive && styles.iconBoxDestructive]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#e53935" : "#555"}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text
          style={[
            styles.menuText,
            isDestructive && { color: "#e53935", fontWeight: "bold" },
          ]}
        >
          {label}
        </Text>
        {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
      </View>
      {!isDestructive && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  if (user === null) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.guestContent}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={100}
            color="#ccc"
          />
          <Text style={styles.guestTitle}>Halo, Tamu!</Text>
          <Text style={styles.guestDesc}>
            Masuk atau daftar sekarang untuk mulai menyewa kost.
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.btnLoginText}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnRegister}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.btnRegisterText}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BottomNavigator navigation={navigation} activeScreen="Profile" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user.gambar
                ? `${IMAGE_URL}${user.gambar}`
                : "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.editIconBtn}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <MaterialCommunityIcons name="pencil" size={14} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Aktivitas Saya</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="document-text-outline"
            label="Riwayat Pesanan"
            subLabel="Cek status booking"
            onPress={() => navigation.navigate("History")}
          />
        </View>

        <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="person-outline"
            label="Edit Profil"
            onPress={() => navigation.navigate("EditProfile")}
          />
        </View>

        <Text style={styles.sectionTitle}>Lainnya</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="information-circle-outline"
            label="Tentang Aplikasi"
            onPress={() => setCreditVisible(true)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="log-out-outline"
            label="Keluar Aplikasi"
            isDestructive
            onPress={handleLogout}
          />
        </View>

        <Text style={styles.sectionTitle}>Area Pemilik Kos</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="add-circle-outline"
            label="Sewakan Kost Anda"
            subLabel="Tambah iklan kost baru"
            onPress={() => navigation.navigate("AddKost")}
          />
        </View>
        {/* --------------------------- */}

        <Text style={styles.sectionTitle}>Lainnya</Text>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* --- MODAL POP-UP CREDIT (ICON VECTOR) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={creditVisible}
        onRequestClose={() => setCreditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.creditCard}>
            {/* LOGO VECTOR (Sama dengan Splash) */}
            <MaterialCommunityIcons
              name="home-city"
              size={80}
              color="#27ae60"
              style={{ marginBottom: 10 }}
            />

            <Text style={styles.appName}>AnaKKost</Text>
            <Text style={styles.appVersion}>Versi 1.0.0 (Beta)</Text>
            <View style={styles.creditDivider} />
            <Text style={styles.devLabel}>Developed by:</Text>

            {/* nama npm */}
            <Text style={styles.devName}>Mahasiswa Teladan</Text>
            <Text style={styles.devName}>Mahasiswa Teladan</Text>
            <Text style={styles.devName}>
              Faris Hakim Wicaksono 230801010247
            </Text>
            <Text style={styles.copyright}>© 2025 All Rights Reserved</Text>

            <TouchableOpacity
              style={styles.closeCreditBtn}
              onPress={() => setCreditVisible(false)}
            >
              <Text style={styles.closeBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigator navigation={navigation} activeScreen="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  customHeader: {
    backgroundColor: "white",
    paddingTop: 30,
    paddingBottom: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  headerContent: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  guestContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 20,
  },
  guestDesc: {
    textAlign: "center",
    color: "gray",
    marginBottom: 30,
    lineHeight: 22,
  },
  btnRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  btnLogin: {
    flex: 0.48,
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnLoginText: { color: "white", fontWeight: "bold" },
  btnRegister: {
    flex: 0.48,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27ae60",
  },
  btnRegisterText: { color: "#27ae60", fontWeight: "bold" },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#eee" },
  editIconBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#27ae60",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  userName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  userEmail: { fontSize: 14, color: "gray", marginTop: 2, marginBottom: 10 },
  scrollContent: { padding: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7f8c8d",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 5,
  },
  menuGroup: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 5,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxDestructive: { backgroundColor: "#ffebee" },
  menuText: { fontSize: 16, color: "#333", fontWeight: "500" },
  subLabel: { fontSize: 11, color: "#95a5a6", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginLeft: 60 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  creditCard: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 5,
  },
  appName: { fontSize: 22, fontWeight: "bold", color: "#333" },
  appVersion: { fontSize: 12, color: "gray", marginBottom: 15 },
  creditDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 15,
  },
  devLabel: { fontSize: 12, color: "gray" },
  devName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  copyright: { fontSize: 10, color: "#ccc", marginBottom: 20 },
  closeCreditBtn: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  closeBtnText: { color: "#555", fontWeight: "bold" },
});
