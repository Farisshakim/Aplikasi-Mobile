import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  RefreshControl,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL, IMAGE_URL } from "../config";

const { width } = Dimensions.get("window");

export default function OwnerHomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchMyKosts(parsedUser.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMyKosts = async (ownerId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}get_my_kosts.php?owner_id=${ownerId}`
      );
      const json = await response.json();
      if (json.status === "success") {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memuat data kost.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (user) fetchMyKosts(user.id);
  };

  const handleDelete = (id, namaKos) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Yakin ingin menghapus kost "${namaKos}"? Data yang dihapus tidak bisa dikembalikan.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}delete_kost.php?id=${id}`
              );
              const json = await response.json();
              if (json.status === "success") {
                Alert.alert("Sukses", "Data berhasil dihapus");
                fetchMyKosts(user.id); // Refresh list
              } else {
                Alert.alert("Gagal", json.message);
              }
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus data");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace("Login");
        },
      },
    ]);
  };

  // --- KOMPONEN HEADER ---
  const renderHeader = () => (
    // PERBAIKAN DI SINI: Menghapus paddingBottom, diganti dengan marginBottom di styles
    <View style={styles.headerWrapper}>
      <View style={styles.greenHeader}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.logoText}>Owner Dashboard</Text>
            <Text style={styles.subGreetingText}>
              Kelola properti kos Anda di sini
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Card diletakkan di luar greenHeader tapi di dalam wrapper */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{data.length}</Text>
          <Text style={styles.statLabel}>Total Kost</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {data.reduce((acc, curr) => acc + parseInt(curr.stok_kamar), 0)}
          </Text>
          <Text style={styles.statLabel}>Total Kamar</Text>
        </View>
      </View>
    </View>
  );

  // --- KOMPONEN ITEM KOST ---
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Image
          source={{ uri: IMAGE_URL + item.gambar }}
          style={styles.cardImage}
          defaultSource={{ uri: "https://via.placeholder.com/300" }}
        />
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>Sisa: {item.stok_kamar}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.nama_kos}
          </Text>
          <Text style={styles.cardPrice}>
            Rp {parseInt(item.harga).toLocaleString("id-ID")} / bulan
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.cardLocation} numberOfLines={1}>
              {item.alamat}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id, item.nama_kos)}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="#e74c3c"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27ae60" />

      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          // Padding bawah agar item terakhir tidak tertutup FAB
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#27ae60"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="home-plus-outline"
                size={80}
                color="#ddd"
              />
              <Text style={styles.emptyText}>Anda belum memiliki kost.</Text>
              <Text style={styles.emptySubText}>
                Tekan tombol (+) untuk menambah.
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AddKost")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// --- STYLES YANG DIPERBAIKI ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Wrapper untuk seluruh bagian header (Hijau + Stats Card)
  headerWrapper: {
    // PENTING: Memberi jarak di bawah header agar kartu pertama tidak nabrak
    marginBottom: 50,
    backgroundColor: "#f8f9fa", // Samakan dengan background container
    zIndex: 1, // Memastikan header di atas saat scroll
  },

  greenHeader: {
    backgroundColor: "#27ae60",
    padding: 20,
    paddingTop: 45,
    // Padding bawah dikurangi karena kita pakai marginBottom di wrapper
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  logoText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subGreetingText: {
    color: "#e8f5e9",
    fontSize: 14,
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },

  // Statistik Kecil
  statsCard: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    // Menarik kartu ke atas menutupi perbatasan hijau
    marginTop: -40,
    borderRadius: 15,
    paddingVertical: 20, // Padding vertikal ditambah sedikit
    paddingHorizontal: 15,
    elevation: 8, // Bayangan lebih kuat agar terlihat melayang
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#333" }, // Font lebih besar
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  verticalDivider: { width: 1, height: 35, backgroundColor: "#eee" },

  // Card Kost
  card: {
    marginHorizontal: 20,
    marginBottom: 20, // Jarak antar kartu
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#eee",
  },
  stockBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(39, 174, 96, 0.9)", // Warna hijau transparan
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: { color: "white", fontSize: 12, fontWeight: "bold" },

  cardContent: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  cardPrice: {
    fontSize: 15,
    color: "#27ae60",
    fontWeight: "bold",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  cardLocation: { color: "gray", fontSize: 12, marginLeft: 4, flex: 1 },

  deleteBtn: {
    padding: 12,
    backgroundColor: "#fff5f5", // Merah sangat muda
    borderRadius: 12,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#27ae60",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    opacity: 0.6,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },
});
