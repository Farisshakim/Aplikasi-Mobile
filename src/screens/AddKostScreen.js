import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../config";

// DAFTAR OPSI FASILITAS (Bisa ditambah)
const FACILITY_OPTIONS = [
  { id: "WiFi", icon: "wifi" },
  { id: "AC", icon: "air-conditioner" },
  { id: "K. Mandi Dalam", icon: "shower" },
  { id: "Kasur", icon: "bed-empty" },
  { id: "Lemari", icon: "wardrobe" },
  { id: "Meja", icon: "desk" },
  { id: "Parkir Motor", icon: "motorbike" },
  { id: "Parkir Mobil", icon: "car" },
  { id: "Dapur", icon: "stove" },
  { id: "CCTV", icon: "cctv" },
];

export default function AddKostScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [stok, setStok] = useState("5");
  const [gender, setGender] = useState("Campur");

  // UBAH INI: Dari string kosong jadi Array kosong
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const [image, setImage] = useState(null);

  // --- LOGIKA TOGGLE CHIPS ---
  const toggleFacility = (facilityId) => {
    if (selectedFacilities.includes(facilityId)) {
      // Jika sudah ada, HAPUS (Undo)
      setSelectedFacilities((prev) =>
        prev.filter((item) => item !== facilityId)
      );
    } else {
      // Jika belum ada, TAMBAH
      setSelectedFacilities((prev) => [...prev, facilityId]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("Butuh izin galeri");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!nama || !alamat || !harga || !image) {
      Alert.alert("Error", "Mohon lengkapi data dan foto kost.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("nama_kos", nama);
    formData.append("alamat", alamat);
    formData.append("harga", harga);
    formData.append("deskripsi", deskripsi);
    formData.append("gender", gender);
    formData.append("stok_kamar", stok);

    // PENTING: Ubah Array fasilitas menjadi String (dipisah koma) untuk Database
    // Contoh: ["WiFi", "AC"] menjadi "WiFi,AC"
    formData.append("fasilitas", selectedFacilities.join(","));

    let localUri = image.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("gambar", { uri: localUri, name: filename, type });

    try {
      const response = await fetch(`${API_BASE_URL}add_kost.php`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const json = await response.json();

      if (json.status === "success") {
        Alert.alert("Berhasil", "Kost ditayangkan!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Gagal", json.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal koneksi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Kost Baru</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        {/* Upload Foto */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="camera-outline" size={40} color="#ccc" />
              <Text style={{ color: "#aaa", marginTop: 5 }}>
                Upload Foto Utama
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nama Kost</Text>
        <TextInput
          style={styles.input}
          value={nama}
          onChangeText={setNama}
          placeholder="Contoh: Kost Melati"
        />

        <Text style={styles.label}>Alamat</Text>
        <TextInput
          style={styles.input}
          value={alamat}
          onChangeText={setAlamat}
          placeholder="Jl. Mawar No. 10..."
        />

        <Text style={styles.label}>Harga (Rp)</Text>
        <TextInput
          style={styles.input}
          value={harga}
          onChangeText={setHarga}
          keyboardType="numeric"
          placeholder="500000"
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 0.48 }}>
            <Text style={styles.label}>Stok</Text>
            <TextInput
              style={styles.input}
              value={stok}
              onChangeText={setStok}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 0.48 }}>
            <Text style={styles.label}>Tipe</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {["Putra", "Putri", "Campur"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setGender(t)}
                  style={[styles.pill, gender === t && styles.pillActive]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      gender === t && { color: "white" },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* --- BAGIAN FASILITAS (CHIPS) --- */}
        <Text style={styles.label}>Fasilitas (Pilih yang tersedia)</Text>
        <View style={styles.chipsContainer}>
          {FACILITY_OPTIONS.map((item) => {
            const isSelected = selectedFacilities.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => toggleFacility(item.id)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={16}
                  color={isSelected ? "white" : "#555"}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[styles.chipText, isSelected && { color: "white" }]}
                >
                  {item.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Deskripsi</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
        />

        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>Tayangkan Kost</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  form: { padding: 20 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  imagePicker: {
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  previewImage: { width: "100%", height: "100%" },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 5,
    marginBottom: 5,
  },
  pillActive: { backgroundColor: "#27ae60", borderColor: "#27ae60" },
  pillText: { fontSize: 10, color: "#555" },

  // STYLE BARU UNTUK CHIPS
  chipsContainer: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#27ae60", borderColor: "#27ae60" },
  chipText: { fontSize: 12, color: "#555" },

  btnSubmit: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
