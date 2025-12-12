import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ⚠️ GANTI IP SESUAI DENGAN KODE TERAKHIR MU
const IP_ADDRESS = "192.168.100.252";
const PORT = "8000";
const API_URL = `http://${IP_ADDRESS}:${PORT}/kosts.php`;
const IMAGE_URL = `http://${IP_ADDRESS}:${PORT}/images/`;

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [masterData, setMasterData] = useState([]); // Data asli dari API
  const [filteredData, setFilteredData] = useState([]); // Data hasil filter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      if (json.status === "success") {
        setMasterData(json.data);
        setFilteredData(json.data); // Awalnya tampilkan semua
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Logika Pencarian (Filter Client-Side)
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = item.nama_kos
          ? item.nama_kos.toUpperCase()
          : "".toUpperCase();
        const addressData = item.alamat
          ? item.alamat.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();

        // Cari berdasarkan Nama Kos ATAU Alamat
        return (
          itemData.indexOf(textData) > -1 || addressData.indexOf(textData) > -1
        );
      });
      setFilteredData(newData);
    } else {
      setFilteredData(masterData); // Jika kosong, kembalikan ke data awal
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailKos", { item: item })}
    >
      <Image
        source={{
          uri: item.gambar
            ? `${IMAGE_URL}${item.gambar}`
            : "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>Campur</Text>
        </View>
        <Text style={styles.title}>{item.nama_kos}</Text>
        <Text style={styles.price}>
          Rp {parseInt(item.harga).toLocaleString("id-ID")} / bulan
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {item.alamat}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER PENCARIAN */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Cari nama kos atau alamat..."
            value={searchText}
            onChangeText={handleSearch}
            autoFocus={true} // Otomatis keyboard muncul
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
        >
          <Text style={{ color: "#27ae60", fontWeight: "bold" }}>Batal</Text>
        </TouchableOpacity>
      </View>

      {/* KONTEN */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#27ae60"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="#ddd" />
              <Text style={{ color: "gray", marginTop: 10 }}>
                Kos tidak ditemukan
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  input: { flex: 1, fontSize: 16, color: "#333" },

  // Card Styles (List View - Lebih kecil dari Home)
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
    overflow: "hidden",
    padding: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 15 },
  content: { flex: 1, justifyContent: "center" },
  badgeContainer: { flexDirection: "row", marginBottom: 5 },
  badge: {
    fontSize: 10,
    color: "#27ae60",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#333" },
  price: { fontSize: 14, fontWeight: "bold", color: "#27ae60", marginTop: 4 },
  location: { fontSize: 12, color: "gray", marginTop: 4 },

  emptyContainer: { alignItems: "center", marginTop: 100 },
});
