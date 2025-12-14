import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../config";
import KostCard from "../components/KostCard";
import BottomNavigator from "../components/BottomNavigator";
import Carousel from "../components/Carousel"; // Pastikan component ini sudah support isLocal

const { width } = Dimensions.get("window");

// --- 1. SIAPKAN GAMBAR LOKAL ---
const localPromoImages = [
  require("../../assets/images/gambar1.jpeg"),
  require("../../assets/images/gambar2.jpeg"),
  require("../../assets/images/gambar3.jpeg"),
];

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}kosts.php`);
      const json = await response.json();
      if (json.status === "success") setData(json.data);
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

  const renderHeader = () => (
    <View style={{ paddingBottom: 20 }}>
      {/* 1. HEADER HIJAU */}
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
            <View style={styles.iconArea}>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />
                <View style={styles.notifBadge} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.greetingText}>Mau cari kos apa?</Text>
          <Text style={styles.subGreetingText}>
            Temukan hunian nyaman untuk istirahatmu.
          </Text>
        </View>

        {/* 2. SEARCH CARD (FLOATING) */}
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

      {/* 3. KATEGORI MENU */}
      <Text style={styles.sectionTitle}>Kategori</Text>
      <View style={styles.categoryContainer}>
        <CategoryItem
          icon="home"
          label="Kost"
          color="#4fc3f7"
          onPress={() => navigation.navigate("Search")}
        />
        <CategoryItem
          icon="office-building"
          label="Apartemen"
          color="#ffb74d"
          onPress={() => navigation.navigate("Search")}
        />
        <CategoryItem
          icon="home-city"
          label="Rumah"
          color="#81c784"
          onPress={() => navigation.navigate("Search")}
        />
        <CategoryItem
          icon="store"
          label="Ruko"
          color="#e57373"
          onPress={() => navigation.navigate("Search")}
        />
      </View>

      {/* 4. BANNER PROMO (MENGGUNAKAN CAROUSEL + GAMBAR LOKAL) */}
      <Text style={styles.sectionTitle}>Promo Spesial</Text>
      <View style={{ marginTop: 10 }}>
        <Carousel
          data={localPromoImages}
          height={150}
          isLocal={true} // Wajib true agar membaca require()
        />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
        Rekomendasi Kos
      </Text>
    </View>
  );

  const CategoryItem = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View style={[styles.categoryIconBg, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const FilterShortcut = ({ icon, label }) => (
    <TouchableOpacity
      style={styles.filterItem}
      onPress={() => navigation.navigate("Search")}
    >
      <Ionicons name={icon} size={18} color="#27ae60" />
      <Text style={styles.filterText}>{label}</Text>
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
          renderItem={({ item }) => (
            <KostCard
              item={item}
              onPress={() => navigation.navigate("DetailKos", { item: item })}
            />
          )}
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

  // Header
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

  iconBtn: { position: "relative", padding: 5 },
  notifBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e74c3c",
    borderWidth: 1,
    borderColor: "#27ae60",
  },

  greetingText: { color: "white", fontSize: 24, fontWeight: "bold" },
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
    height: 50,
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

  // Categories
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
});
