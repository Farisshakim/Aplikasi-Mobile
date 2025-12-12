import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// ⚠️ IP SESUAI DENGAN KODE TERAKHIR ANDA
const IP_ADDRESS = "192.168.100.252";
const PORT = "8000";
const API_URL = `http://${IP_ADDRESS}:${PORT}/kosts.php`;
const IMAGE_URL = `http://${IP_ADDRESS}:${PORT}/images/`;

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk refresh data otomatis saat kembali ke halaman ini
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      if (json.status === "success") {
        setData(json.data);
      }
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- KOMPONEN HEADER ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greenHeader}>
        <View style={styles.topBar}>
          <View style={styles.logoArea}>
            <Text style={styles.logoText}>AnaKKost</Text>
          </View>
          <View style={styles.iconArea}>
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="white"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greetingText}>Mau cari kos?</Text>
        <Text style={styles.subGreetingText}>
          Dapatkan info kost terlengkap di seluruh Indonesia
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchCard}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color="#27ae60"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Cari lokasi kost..."
            style={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.searchInputContainer}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color="#27ae60"
              style={{ marginRight: 8 }}
            />
            {/* PointerEvents none agar input tidak fokus di sini, tapi tombolnya yg jalan */}
            <TextInput
              placeholder="Cari lokasi kost..."
              style={styles.searchInput}
              editable={false} // Matikan ketik di sini
              onPressIn={() => navigation.navigate("Search")}
            />
            <View style={styles.searchButton}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Cari</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterItem}>
            <Ionicons name="people-outline" size={20} color="#27ae60" />
            <Text style={styles.filterText}>Tipe Kos</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.filterItem}>
            <Ionicons name="pricetag-outline" size={20} color="#27ae60" />
            <Text style={styles.filterText}>Harga</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.filterItem}>
            <Ionicons name="options-outline" size={20} color="#27ae60" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.greenBanner} />
      </View>

      {/* Kategori */}
      <Text style={styles.sectionTitle}>Kategori Properti</Text>
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

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
        Rekomendasi Kos
      </Text>
    </View>
  );

  const CategoryItem = ({ icon, label, color }) => (
    <View style={styles.categoryItem}>
      <View style={[styles.categoryIconBg, { backgroundColor: color + "33" }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
  );

  // --- RENDERING ITEM LIST KOS (UPDATE: BISA DIKLIK) ---
  const renderKostItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("DetailKos", { item: item })} // Navigasi ke Detail
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: item.gambar
              ? `${IMAGE_URL}${item.gambar}`
              : "https://via.placeholder.com/300",
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Campur</Text>
            <Text style={styles.sisaText}>Sisa 2 Kamar</Text>
          </View>
          <Text style={styles.cardTitle}>{item.nama_kos}</Text>
          <Text style={styles.cardLocation}>📍 {item.alamat}</Text>
          <Text style={styles.cardPrice}>
            Rp {parseInt(item.harga).toLocaleString("id-ID")} / bulan
          </Text>
          <Text style={styles.cardFasilitas} numberOfLines={1}>
            {item.deskripsi}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27ae60" />

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderKostItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Navigation (UPDATE: BISA KLIK) */}
      <View style={styles.bottomNav}>
        <NavIcon name="home" label="Beranda" active onPress={() => {}} />
        <NavIcon
          name="magnify"
          label="Cari"
          onPress={() => navigation.navigate("Search")} // <-- Arahkan ke Search
        />
        <NavIcon name="heart-outline" label="Favorit" onPress={() => {}} />

        {/* Tombol Pesanan Aktif */}
        <NavIcon
          name="file-document-outline"
          label="Pesanan"
          onPress={() => navigation.navigate("History")}
        />

        {/* Tombol Profil */}
        <NavIcon
          name="account-outline"
          label="Profil"
          onPress={() => navigation.navigate("Profile")} // <-- Arahkan ke Profile
        />
      </View>
    </View>
  );
}

// Komponen Icon Navigasi (Update: Menerima onPress)
const NavIcon = ({ name, label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ alignItems: "center", flex: 1 }}>
    <MaterialCommunityIcons
      name={name}
      size={24}
      color={active ? "#27ae60" : "gray"}
    />
    <Text
      style={{ fontSize: 10, color: active ? "#27ae60" : "gray", marginTop: 3 }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header Styles
  greenHeader: {
    backgroundColor: "#27ae60",
    padding: 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  iconArea: { flexDirection: "row" },
  greetingText: { color: "white", fontSize: 24, fontWeight: "bold" },
  subGreetingText: { color: "#e8f5e9", fontSize: 14, marginTop: 5 },

  // Search Card
  searchCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 15,
  },
  searchInput: { flex: 1, marginLeft: 5 },
  searchButton: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  filterItem: { alignItems: "center", justifyContent: "center" },
  filterText: { fontSize: 12, color: "#555", marginTop: 4 },
  divider: { width: 1, height: 20, backgroundColor: "#eee" },

  // Banner
  bannerContainer: { paddingHorizontal: 20, marginTop: 20 },
  greenBanner: { backgroundColor: "#4ade80", height: 120, borderRadius: 15 },

  // Categories
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  categoryItem: { alignItems: "center" },
  categoryIconBg: {
    width: 55,
    height: 55,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryLabel: { fontSize: 12, color: "#555" },

  // Kost List Card
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 150 },
  cardContent: { padding: 12 },
  tagContainer: { flexDirection: "row", marginBottom: 5 },
  tagText: {
    fontSize: 10,
    color: "#27ae60",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
    fontWeight: "bold",
  },
  sisaText: { fontSize: 10, color: "#e53935" },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardLocation: { fontSize: 12, color: "#777", marginVertical: 3 },
  cardPrice: { fontSize: 14, fontWeight: "bold", color: "#333", marginTop: 5 },
  cardFasilitas: { fontSize: 11, color: "#999" },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
