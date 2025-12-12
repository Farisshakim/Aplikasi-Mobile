import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

const IP_ADDRESS = "192.168.100.182";
const API_URL = `http://${IP_ADDRESS}:8000/bookings.php`;

export default function BookingFormScreen({ route, navigation }) {
  const { item } = route.params; // Data kos yang dipilih

  const [nama, setNama] = useState("");
  const [lama, setLama] = useState("1"); // Default 1 bulan
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!nama) return Alert.alert("Error", "Nama wajib diisi");

    setLoading(true);
    const totalHarga = parseInt(item.harga) * parseInt(lama);

    // Siapkan data form
    const formData = new FormData();
    formData.append("nama_pemesan", nama);
    formData.append("kost_id", item.id);
    formData.append("nama_kos", item.nama_kos);
    formData.append("tanggal_masuk", new Date().toISOString().split("T")[0]); // Hari ini
    formData.append("lama_sewa", lama);
    formData.append("total_harga", totalHarga);

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      Alert.alert("Berhasil", "Pengajuan sewa terkirim!");
      navigation.navigate("Home"); // Balik ke Home
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Form Pengajuan Sewa</Text>
      <Text style={styles.subTitle}>{item.nama_kos}</Text>

      <Text style={styles.label}>Nama Lengkap</Text>
      <TextInput
        style={styles.input}
        value={nama}
        onChangeText={setNama}
        placeholder="Nama Anda"
      />

      <Text style={styles.label}>Lama Sewa (Bulan)</Text>
      <TextInput
        style={styles.input}
        value={lama}
        onChangeText={setLama}
        keyboardType="numeric"
      />

      <View style={styles.summary}>
        <Text>Total Harga:</Text>
        <Text style={styles.total}>
          Rp {(parseInt(item.harga) * parseInt(lama)).toLocaleString("id-ID")}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>Kirim Pengajuan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 20, fontWeight: "bold", color: "#27ae60" },
  subTitle: { fontSize: 16, marginBottom: 20, color: "gray" },
  label: { marginTop: 15, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  summary: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: { fontWeight: "bold", fontSize: 18, color: "#27ae60" },
  btn: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
});
