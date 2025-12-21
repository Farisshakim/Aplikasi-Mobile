import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../config";
import BottomNavigator from "../components/BottomNavigator";
import GridKostCard from "../components/GridKostCard";

const { height } = Dimensions.get("window");

export default function SearchScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter State
  // Mengambil parameter dari Home (misal user klik ikon 'Putra')
  const initialType = route.params?.filter || "Semua";
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedPrice, setSelectedPrice] = useState("Semua Harga");
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  // Data Opsi Filter
  const filterTypes = ["Semua", "Putra", "Putri", "Campur"];
  const filterPrices = ["Semua Harga", "< 1 Juta", "1 - 2 Juta", "> 2 Juta"];
  const filterFacilities = [
    "WiFi",
    "AC",
    "K. Mandi Dalam",
    "Parkir",
    "Kasur",
    "Lemari",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Update jika parameter navigasi berubah
  useEffect(() => {
    if (route.params?.filter) {
      setSelectedType(route.params.filter);
    }
  }, [route.params]);

  // Jalankan filter otomatis saat state berubah
  useEffect(() => {
    if (masterData.length > 0) {
      applyFilters(searchText, selectedType, selectedPrice, selectedFacilities);
    }
  }, [selectedType, selectedPrice, selectedFacilities, masterData]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}kosts.php`);
      const json = await response.json();
      if (json.status === "success") {
        setMasterData(json.data);
        const initialFilter = route.params?.filter || "Semua";
        applyFilters(
          searchText,
          initialFilter,
          selectedPrice,
          selectedFacilities,
          json.data
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchText = (text) => {
    setSearchText(text);
    applyFilters(text, selectedType, selectedPrice, selectedFacilities);
  };

  // --- LOGIKA FILTER UTAMA ---
  const applyFilters = (
    text,
    type,
    price,
    facilities,
    sourceData = masterData
  ) => {
    let data = sourceData;

    // 1. Filter Teks (Nama & Alamat)
    if (text) {
      data = data.filter(
        (item) =>
          item.nama_kos.toUpperCase().includes(text.toUpperCase()) ||
          item.alamat.toUpperCase().includes(text.toUpperCase())
      );
    }

    // 2. Filter Tipe Kost (MENGGUNAKAN KOLOM GENDER)
    if (type !== "Semua") {
      data = data.filter((item) => {
        // Ambil data dari kolom 'gender' di database
        const dbGender = item.gender ? item.gender.trim().toLowerCase() : "";
        const targetType = type.trim().toLowerCase();

        return dbGender === targetType;
      });
    }

    // 3. Filter Harga
    if (price !== "Semua Harga") {
      data = data.filter((item) => {
        const p = parseInt(item.harga);
        if (price === "< 1 Juta") return p < 1000000;
        if (price === "1 - 2 Juta") return p >= 1000000 && p <= 2000000;
        if (price === "> 2 Juta") return p > 2000000;
        return true;
      });
    }

    // 4. Filter Fasilitas
    if (facilities.length > 0) {
      data = data.filter((item) => {
        const itemFasilitas = item.fasilitas
          ? item.fasilitas.toUpperCase()
          : "";
        const itemDeskripsi = item.deskripsi
          ? item.deskripsi.toUpperCase()
          : "";

        return facilities.every(
          (fac) =>
            itemFasilitas.includes(fac.toUpperCase()) ||
            itemDeskripsi.includes(fac.toUpperCase())
        );
      });
    }

    setFilteredData(data);
  };

  const handleReset = () => {
    setSelectedType("Semua");
    setSelectedPrice("Semua Harga");
    setSelectedFacilities([]);
    applyFilters(searchText, "Semua", "Semua Harga", []);
    setModalVisible(false);
  };

  const toggleFacility = (fac) => {
    if (selectedFacilities.includes(fac)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== fac));
    } else {
      setSelectedFacilities([...selectedFacilities, fac]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#bdc3c7"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Cari lokasi, nama kost..."
              value={searchText}
              onChangeText={handleSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchText("")}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.filterIconBtn}
            onPress={() => setModalVisible(true)}
          >
            {(selectedType !== "Semua" ||
              selectedPrice !== "Semua Harga" ||
              selectedFacilities.length > 0) && (
              <View style={styles.activeFilterDot} />
            )}
            <Ionicons name="options-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Chips Filter Aktif */}
        {selectedType !== "Semua" && (
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={styles.activeChip}>
              <Text style={styles.activeChipText}>{selectedType}</Text>
              <TouchableOpacity onPress={() => setSelectedType("Semua")}>
                <Ionicons
                  name="close"
                  size={16}
                  color="white"
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* LIST KOS */}
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
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <GridKostCard
              item={item}
              onPress={() => navigation.navigate("DetailKos", { item: item })}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#eee" />
              <Text style={{ color: "gray", marginTop: 10, fontSize: 16 }}>
                Tidak ditemukan.
              </Text>
              <TouchableOpacity
                onPress={handleReset}
                style={{ marginTop: 15, padding: 10 }}
              >
                <Text style={{ color: "#27ae60", fontWeight: "bold" }}>
                  Reset Filter
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* MODAL FILTER */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Pencarian</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Tipe Kost</Text>
              <View style={styles.optionsRow}>
                {filterTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionChip,
                      selectedType === type && styles.optionChipActive,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedType === type && styles.optionTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.sectionTitle}>Harga</Text>
              <View style={styles.gridContainer}>
                {filterPrices.map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.gridOption,
                      selectedPrice === price && styles.gridOptionActive,
                    ]}
                    onPress={() => setSelectedPrice(price)}
                  >
                    <Text
                      style={[
                        styles.gridText,
                        selectedPrice === price && styles.gridTextActive,
                      ]}
                    >
                      {price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.sectionTitle}>Fasilitas</Text>
              <View style={styles.optionsRow}>
                {filterFacilities.map((fac) => {
                  const isSelected = selectedFacilities.includes(fac);
                  return (
                    <TouchableOpacity
                      key={fac}
                      style={[
                        styles.optionChip,
                        isSelected && styles.optionChipActive,
                      ]}
                      onPress={() => toggleFacility(fac)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextActive,
                        ]}
                      >
                        {fac}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={{ height: 20 }} />
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
                <Text style={styles.btnResetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnApply}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnApplyText}>Terapkan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigator navigation={navigation} activeScreen="Search" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  headerContainer: {
    backgroundColor: "white",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
  },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ecf0f1",
    marginRight: 10,
  },
  input: { flex: 1, fontSize: 15, color: "#2c3e50" },
  filterIconBtn: {
    backgroundColor: "#27ae60",
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    position: "relative",
  },
  activeFilterDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e74c3c",
    borderWidth: 2,
    borderColor: "white",
  },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27ae60",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  activeChipText: { color: "white", fontSize: 12, fontWeight: "bold" },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#555",
  },
  optionsRow: { flexDirection: "row", flexWrap: "wrap" },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  optionChipActive: { backgroundColor: "#e8f5e9", borderColor: "#27ae60" },
  optionText: { color: "#757575", fontSize: 14 },
  optionTextActive: { color: "#27ae60", fontWeight: "bold" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridOption: {
    width: "48%",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
  },
  gridOptionActive: { backgroundColor: "#e8f5e9", borderColor: "#27ae60" },
  gridText: { color: "#757575", fontSize: 14 },
  gridTextActive: { color: "#27ae60", fontWeight: "bold" },
  modalFooter: {
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  btnReset: {
    flex: 0.3,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginRight: 10,
  },
  btnResetText: { color: "#757575", fontWeight: "bold" },
  btnApply: {
    flex: 0.7,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#27ae60",
    alignItems: "center",
  },
  btnApplyText: { color: "white", fontWeight: "bold" },
});
