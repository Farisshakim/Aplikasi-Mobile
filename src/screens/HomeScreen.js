import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- IMPORT KOMPONEN ---
import Carousel from "../components/Carousel"; // Pastikan file ini sudah diperbarui dengan fitur autoPlay
import BottomNavigator from "../components/BottomNavigator";
import { API_BASE_URL, IMAGE_URL } from "../config";

const { width } = Dimensions.get("window");

// --- GAMBAR PROMO (LOKAL) ---
const localPromoImages = [
  require("../../assets/images/gambar1.jpeg"),
  require("../../assets/images/gambar2.jpeg"),
  require("../../assets/images/gambar3.jpeg"),
];

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      checkUser();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const checkUser = async () => {
    try {
      const value = await AsyncStorage.getItem("user_data"); // Pastikan key sesuai LoginScreen ("user_data")
      setUser(value ? JSON.parse(value) : null);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}kosts.php`);
      const json = await response.json();

      if (json.status === "success") {
        setData(json.data);
      }
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // --- HEADER ---
  const renderHeader = () => (
    <View style={{ paddingBottom: 20 }}>
      {/* Header Hijau */}
      <View style={styles.headerContainer}>
        <View style={styles.greenHeader}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.logoText}>AnaKKost</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="location-sharp" size={14} color="#e8f5e9" />
                <Text style={styles.locationText}>Malang, Jawa Timur</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate(user ? "Profile" : "Login")}
            >
              <Image
                source={{
                  uri:
                    user && user.gambar
                      ? IMAGE_URL + user.gambar
                      : "https://cdn-icons-png.flaticon.com/512/847/847969.png", // Placeholder default jika user belum login/tidak ada foto
                }}
                style={styles.profileIcon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.greetingText}>
            Hai, {user ? user.name : "Tamu"}
          </Text>
          <Text style={styles.subGreetingText}>Mau cari kos di mana?</Text>
        </View>

        {/* Search Card */}
        <View style={styles.searchCard}>
          <TouchableOpacity
            style={styles.searchInputButton}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.9}
          >
            <Ionicons
              name="search"
              size={20}
              color="#27ae60"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "#aaa", flex: 1 }}>
              Cari lokasi, nama kos...
            </Text>
          </TouchableOpacity>

          <View style={styles.filterContainer}>
            <FilterShortcut icon="people-outline" label="Putra/Putri" />
            <View style={styles.divider} />
            <FilterShortcut icon="pricetag-outline" label="Harga" />
            <View style={styles.divider} />
            <FilterShortcut icon="options-outline" label="Filter" />
          </View>
        </View>
      </View>

      {/* Kategori */}
      <Text style={styles.sectionTitle}>Kategori</Text>
      <View style={styles.categoryContainer}>
        <CategoryItem icon="home" label="Kost" color="#4fc3f7" />
        <CategoryItem
          icon="office-building"
          label="Apartemen"
          color="#ffb74d"
        />
        <CategoryItem icon="home-city" label="Rumah" color="#81c784" />
        <CategoryItem icon="store" label="Ruko" color="#e57373" />
      </View>

      {/* Promo Spesial (Carousel Auto Play) */}
      <Text style={styles.sectionTitle}>Promo Spesial</Text>
      <View style={{ marginTop: 10 }}>
        <Carousel
          data={localPromoImages}
          height={150}
          isLocal={true}
          autoPlay={true}
          timer={3000}
        />
      </View>

      {/* Judul Bagian Rekomendasi */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 25,
          marginRight: 20,
        }}
      >
        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
          Rekomendasi Kos
        </Text>
        {/* Opsional: Tombol Lihat Semua jika ingin melihat sisa data */}
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Text style={{ color: "#27ae60", fontSize: 12, fontWeight: "bold" }}>
            Lihat Semua
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CategoryItem = ({ icon, label, color }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIconBg, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const FilterShortcut = ({ icon, label }) => (
    <TouchableOpacity style={styles.filterItem}>
      <Ionicons name={icon} size={18} color="#27ae60" />
      <Text style={styles.filterText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const urlGambar = IMAGE_URL + item.gambar;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("DetailKos", { item })}
      >
        <Image
          source={{ uri: urlGambar }}
          style={styles.cardImage}
          defaultSource={{
            uri: "https://via.placeholder.com/300x200.png?text=Loading",
          }}
          onError={(e) =>
            console.log("Gagal muat gambar:", e.nativeEvent.error)
          }
        />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.nama_kos}</Text>
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27ae60" />

      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      ) : (
        <FlatList
          // --- PERUBAHAN UTAMA DI SINI ---
          // Gunakan .slice(0, 3) untuk membatasi hanya 3 data yang dirender
          data={data.slice(0, 3)}
          // ---------------------------------
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
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
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <MaterialCommunityIcons
                name="home-search-outline"
                size={60}
                color="#ddd"
              />
              <Text style={{ color: "gray", marginTop: 10 }}>
                Belum ada data kos.
              </Text>
            </View>
          }
        />
      )}

      <BottomNavigator navigation={navigation} activeScreen="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header Hijau
  greenHeader: {
    backgroundColor: "#27ae60",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 80,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  locationText: { color: "#e8f5e9", fontSize: 12, marginLeft: 4 },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#ccc", // Tambahkan background agar kelihatan jika gambar null
  },
  iconBtn: { padding: 5 },
  greetingText: { color: "white", fontSize: 20, fontWeight: "bold" },
  subGreetingText: {
    color: "#e8f5e9",
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },

  // Search Card
  searchCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 15,
    padding: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  searchInputButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  filterItem: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  filterText: { fontSize: 12, color: "#555", marginLeft: 5, fontWeight: "500" },
  divider: { width: 1, height: 20, backgroundColor: "#eee" },

  // Kategori & Promo
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 15,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  categoryItem: { alignItems: "center", width: width / 5 },
  categoryIconBg: {
    width: 55,
    height: 55,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: { fontSize: 12, color: "#555", fontWeight: "500" },

  // Card Kos
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#eee",
  },
  cardContent: { padding: 15 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  cardPrice: {
    fontSize: 15,
    color: "#27ae60",
    fontWeight: "bold",
    marginBottom: 5,
  },
  locationContainer: { flexDirection: "row", alignItems: "center" },
  cardLocation: { color: "gray", fontSize: 12, marginLeft: 4, flex: 1 },
});
