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
          // Reset navigasi ke Home agar tidak bisa back
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

  // --- TAMPILAN JIKA BELUM LOGIN (TAMU) ---
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

  // --- TAMPILAN UTAMA PROFILE ---
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
        {/* --- MENU AKTIVITAS --- */}
        <Text style={styles.sectionTitle}>Aktivitas Saya</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="document-text-outline"
            label="Riwayat Pesanan"
            subLabel="Cek status booking"
            onPress={() => navigation.navigate("History")}
          />
        </View>

        {/* --- MENU PENGATURAN --- */}
        <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="person-outline"
            label="Edit Profil"
            onPress={() => navigation.navigate("EditProfile")}
          />
        </View>

        {/* --- MENU LAINNYA --- */}
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

        {/* --- BAGIAN PEMILIK KOS SUDAH DIHAPUS --- */}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* --- MODAL POP-UP CREDIT --- */}
      {/* --- MODAL POP-UP CREDIT (PERBAGUSAN UI) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={creditVisible}
        onRequestClose={() => setCreditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.creditCard}>
            {/* Bagian Header Modal */}
            <View style={styles.modalHeaderDecor}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="home-city"
                  size={40}
                  color="#27ae60"
                />
              </View>
              <Text style={styles.appName}>AnaKKost</Text>
              <Text style={styles.appVersion}>v1.0.0 (Beta)</Text>
            </View>

            {/* Bagian Konten Developer */}
            <View style={styles.modalBody}>
              <Text style={styles.devLabel}>Meet the Team</Text>

              <View style={styles.devListContainer}>
                {/* Developer 1 */}
                <View style={styles.devItem}>
                  <View style={styles.devAvatar}>
                    <Text style={styles.devInitial}>R</Text>
                  </View>
                  <View>
                    <Text style={styles.devName}>Ririn Wanandi</Text>
                    <Text style={styles.devNim}>23081010136</Text>
                  </View>
                </View>

                {/* Developer 2 */}
                <View style={styles.devItem}>
                  <View style={styles.devAvatar}>
                    <Text style={styles.devInitial}>M</Text>
                  </View>
                  <View>
                    <Text style={styles.devName}>M. Rizki Darmawan</Text>
                    <Text style={styles.devNim}>23081010238</Text>
                  </View>
                </View>

                {/* Developer 3 */}
                <View style={styles.devItem}>
                  <View style={styles.devAvatar}>
                    <Text style={styles.devInitial}>F</Text>
                  </View>
                  <View>
                    <Text style={styles.devName}>Faris Hakim W.</Text>
                    <Text style={styles.devNim}>230801010247</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.copyright}>
                © 2025 AnaKKost. All Rights Reserved.
              </Text>
            </View>

            {/* Tombol Tutup */}
            <TouchableOpacity
              style={styles.closeCreditBtn}
              onPress={() => setCreditVisible(false)}
              activeOpacity={0.8}
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
    marginBottom: 2,
    textAlign: "center",
  },
  copyright: { fontSize: 10, color: "#ccc", marginTop: 15, marginBottom: 20 },
  closeCreditBtn: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  closeBtnText: { color: "#555", fontWeight: "bold" },

  // --- STYLES MODAL BARU ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Lebih gelap biar fokus
    justifyContent: "center",
    alignItems: "center",
  },
  creditCard: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 25,
    overflow: "hidden", // Agar header decor tidak keluar radius
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeaderDecor: {
    backgroundColor: "#27ae60",
    alignItems: "center",
    paddingVertical: 25,
    borderBottomLeftRadius: 30, // Efek lengkung
    borderBottomRightRadius: 30,
  },
  iconCircle: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  appVersion: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  modalBody: {
    padding: 25,
    alignItems: "center",
  },
  devLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  devListContainer: {
    width: "100%",
    marginBottom: 10,
  },
  devItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  devAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  devInitial: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  devName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  devNim: {
    fontSize: 12,
    color: "gray",
  },
  copyright: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 10,
    fontStyle: "italic",
  },
  closeCreditBtn: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  closeBtnText: {
    color: "#27ae60",
    fontWeight: "bold",
    fontSize: 16,
  },
});
