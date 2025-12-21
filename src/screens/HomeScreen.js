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
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORT KOMPONEN
import Carousel from "../components/Carousel";
import BottomNavigator from "../components/BottomNavigator";
import { API_BASE_URL, IMAGE_URL } from "../config";

const { width } = Dimensions.get("window");

// GAMBAR PROMO (LOKAL)
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
      const value = await AsyncStorage.getItem("user_data");
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

  const CategoryItem = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View style={[styles.categoryIconBg, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={{ paddingBottom: 20 }}>
      {/* Header Hijau */}
      <View style={styles.headerContainer}>
        <View style={styles.greenHeader}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.logoText}>AnaKKost</Text>
              <Text style={styles.locationText}>Temukan hunian nyamanmu</Text>
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
                      : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                style={styles.profileIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.greetingText}>
              Hai, {user ? user.name.split(" ")[0] : "Tamu"}!
            </Text>
            <Text style={styles.subGreetingText}>
              Mau cari kos tipe apa hari ini?
            </Text>
          </View>
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
              size={22}
              color="#27ae60"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.placeholderText}>
              Cari nama kos atau lokasi...
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Kategori */}
      <Text style={styles.sectionTitle}>Kategori</Text>
      <View style={styles.categoryContainer}>
        <CategoryItem
          icon="man"
          label="Putra"
          color="#2980b9"
          onPress={() => navigation.navigate("Search", { filter: "Putra" })}
        />
        <CategoryItem
          icon="woman"
          label="Putri"
          color="#e91e63"
          onPress={() => navigation.navigate("Search", { filter: "Putri" })}
        />
        <CategoryItem
          icon="people"
          label="Campur"
          color="#f39c12"
          onPress={() => navigation.navigate("Search", { filter: "Campur" })}
        />
      </View>

      {/* Promo */}
      <Text style={styles.sectionTitle}>Promo Spesial</Text>
      <View style={{ marginTop: 5 }}>
        <Carousel
          data={localPromoImages}
          height={160}
          isLocal={true}
          autoPlay={true}
          timer={4000}
        />
      </View>

      {/* Rekomendasi */}
      <View style={styles.recommendationHeader}>
        <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>
          Rekomendasi Kos
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Text style={styles.seeAllText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const urlGambar = IMAGE_URL + item.gambar;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("DetailKos", { item })}
      >
        <Image
          source={{ uri: urlGambar }}
          style={styles.cardImage}
          defaultSource={{
            uri: "https://via.placeholder.com/300x200.png?text=Loading",
          }}
        />

        {/* Badge Jenis Kos: Menggunakan GENDER */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.gender || "Campur"}</Text>
        </View>

        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.nama_kos}
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={14} color="#95a5a6" />
              <Text style={styles.cardLocation} numberOfLines={1}>
                {item.alamat}
              </Text>
            </View>
          </View>
          <Text style={styles.cardPrice}>
            Rp {parseInt(item.harga).toLocaleString("id-ID")}
            <Text style={{ fontSize: 12, color: "#777", fontWeight: "normal" }}>
              /bln
            </Text>
          </Text>
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
          data={data.slice(0, 3)}
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
            <View style={styles.emptyState}>
              <Ionicons name="home-outline" size={60} color="#ddd" />
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
  greenHeader: {
    backgroundColor: "#27ae60",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  locationText: { color: "#e8f5e9", fontSize: 13, marginTop: 2, opacity: 0.9 },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "#ccc",
  },
  iconBtn: { padding: 2 },
  greetingText: { color: "white", fontSize: 22, fontWeight: "bold" },
  subGreetingText: {
    color: "#e8f5e9",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  searchCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: -45,
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
    backgroundColor: "#f5f6fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  placeholderText: { color: "#aaa", flex: 1, fontSize: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 15,
    color: "#2d3436",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  categoryItem: { alignItems: "center", width: width / 3.5 },
  categoryIconBg: {
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: { fontSize: 13, color: "#555", fontWeight: "600" },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: { color: "#27ae60", fontSize: 13, fontWeight: "bold" },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 180, backgroundColor: "#eee" },
  typeBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: { color: "white", fontSize: 10, fontWeight: "bold" },
  cardContent: { padding: 15 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2d3436",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLocation: { color: "#95a5a6", fontSize: 12, marginLeft: 4, flex: 1 },
  cardPrice: { fontSize: 16, color: "#27ae60", fontWeight: "bold" },
  emptyState: { alignItems: "center", marginTop: 50 },
});
