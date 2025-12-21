import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TextInput, // Pastikan TextInput diimport jika CustomInput bermasalah, atau gunakan CustomInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // [1] IMPORT ASYNC STORAGE

// Import Config & Components
import { API_BASE_URL, IMAGE_URL } from "../config";
// Jika CustomInput Anda bekerja dengan baik, biarkan. Jika error, ganti dengan TextInput biasa.
import CustomInput from "../components/CustomInput";

export default function BookingFormScreen({ route, navigation }) {
  const { item } = route.params; // Data kos yang dipilih

  const [nama, setNama] = useState("");
  const [lama, setLama] = useState("1");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // [2] STATE UNTUK USER

  // [3] AMBIL DATA USER SAAT APLIKASI DIBUKA
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setNama(parsedUser.name); // Otomatis isi nama dari akun
        } else {
          Alert.alert("Perhatian", "Anda belum login. Silakan login dulu.");
          navigation.navigate("Login");
        }
      } catch (e) {
        console.log("Error loading user:", e);
      }
    };
    loadUser();
  }, []);

  // Hitung Tanggal Masuk (Hari ini)
  const today = new Date();
  const dateString = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Hitung Total
  const pricePerMonth = parseInt(item.harga);
  const duration = parseInt(lama) || 0;
  const totalHarga = pricePerMonth * duration;
  const serviceFee = 5000;
  const grandTotal = totalHarga + serviceFee;

  const handleBooking = async () => {
    // Validasi User
    if (!user || !user.id) {
      Alert.alert("Gagal", "Sesi login habis. Silakan login ulang.");
      return;
    }

    if (!nama) return Alert.alert("Error", "Nama wajib diisi");
    if (duration < 1) return Alert.alert("Error", "Minimal sewa 1 bulan");

    setLoading(true);

    // Format tanggal ke YYYY-MM-DD
    const isoDate = new Date().toISOString().split("T")[0];

    const formData = new FormData();

    // [4] KIRIM DATA SESUAI DENGAN YANG DIMINTA bookings.php
    formData.append("user_id", user.id); // PENTING: ID User
    formData.append("kos_id", item.id); // Sesuaikan nama param (kos_id)
    formData.append("durasi", duration); // Sesuaikan nama param (durasi)
    formData.append("total_harga", grandTotal);
    formData.append("tanggal_mulai", isoDate); // Sesuaikan nama param (tanggal_mulai)

    // Debug di terminal
    console.log("Mengirim Booking:", {
      user_id: user.id,
      kos_id: item.id,
      durasi: duration,
      total: grandTotal,
      tgl: isoDate,
    });

    try {
      const response = await fetch(`${API_BASE_URL}bookings.php`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      const textResponse = await response.text();
      console.log("Respon Server:", textResponse);

      try {
        const json = JSON.parse(textResponse);
        if (json.status === "success") {
          Alert.alert("Berhasil", "Pengajuan sewa terkirim!", [
            {
              text: "Cek Pesanan",
              onPress: () => navigation.navigate("History"),
            },
            // Pastikan navigasi ke 'History' sesuai nama di Stack.Navigator Anda (mungkin 'History' atau 'Pesanan')
          ]);
        } else {
          Alert.alert("Gagal", json.message || "Terjadi kesalahan.");
        }
      } catch (e) {
        Alert.alert("Error", "Respon server tidak valid (Bukan JSON).");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- 1. KARTU KOS (RINGKASAN) --- */}
          <View style={styles.kosCard}>
            <Image
              source={{
                uri: item.gambar
                  ? `${IMAGE_URL}${item.gambar}`
                  : "https://via.placeholder.com/150",
              }}
              style={styles.kosImage}
            />
            <View style={styles.kosInfo}>
              {/* Tampilkan Badge Gender jika ada */}
              <Text style={styles.badge}>{item.gender || "Campur"}</Text>
              <Text style={styles.kosName} numberOfLines={1}>
                {item.nama_kos}
              </Text>
              <View style={styles.row}>
                <Ionicons name="location-outline" size={12} color="gray" />
                <Text style={styles.kosLoc} numberOfLines={1}>
                  {" "}
                  {item.alamat}
                </Text>
              </View>
              <Text style={styles.kosPrice}>
                Rp {pricePerMonth.toLocaleString("id-ID")}
                <Text
                  style={{ fontSize: 12, fontWeight: "normal", color: "gray" }}
                >
                  /bln
                </Text>
              </Text>
            </View>
          </View>

          {/* --- 2. FORMULIR --- */}
          <Text style={styles.sectionTitle}>Data Penyewa</Text>
          <View style={styles.formCard}>
            <Text style={styles.label}>Nama Lengkap</Text>
            {/* Menggunakan TextInput bawaan React Native jika CustomInput error */}
            <TextInput
              style={styles.inputStyle}
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChangeText={setNama}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <View style={{ flex: 0.48 }}>
                <Text style={styles.label}>Lama Sewa (Bulan)</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="1"
                  value={lama}
                  onChangeText={setLama}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 0.48 }}>
                <Text style={styles.label}>Tanggal Masuk</Text>
                <View style={styles.dateBox}>
                  <Ionicons name="calendar-outline" size={18} color="#27ae60" />
                  <Text style={styles.dateText}>{dateString}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* --- 3. RINCIAN BIAYA --- */}
          <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Harga Sewa</Text>
              <Text style={styles.billValue}>
                Rp {pricePerMonth.toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Durasi</Text>
              <Text style={styles.billValue}>x {duration} Bulan</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Biaya Layanan</Text>
              <Text style={styles.billValue}>
                Rp {serviceFee.toLocaleString("id-ID")}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.billRowTotal}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>
                Rp {grandTotal.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- 4. STICKY FOOTER --- */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Tagihan</Text>
          <Text style={styles.footerTotal}>
            Rp {grandTotal.toLocaleString("id-ID")}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnBook}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.btnText}>Memproses...</Text>
          ) : (
            <Text style={styles.btnText}>Ajukan Sewa</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { padding: 20 },

  // Styling Input Manual (jika tidak pakai CustomInput)
  inputStyle: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
  },

  // Kos Card (Ringkasan)
  kosCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 2,
  },
  kosImage: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  kosInfo: { flex: 1, justifyContent: "center" },
  badge: {
    fontSize: 10,
    color: "#27ae60",
    backgroundColor: "#e8f5e9",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  kosName: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 2 },
  kosLoc: { fontSize: 12, color: "gray", flex: 1 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  kosPrice: { fontSize: 14, fontWeight: "bold", color: "#27ae60" },

  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  // Form Area
  formCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 1,
  },
  label: { fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 5 },
  dateBox: {
    height: 50,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8, // disamakan dengan input
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  dateText: { marginLeft: 8, color: "#333" },

  // Bill Area
  billCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    elevation: 1,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billLabel: { color: "gray" },
  billValue: { color: "#333", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  billRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#27ae60" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
  },
  footerLabel: { fontSize: 12, color: "gray" },
  footerTotal: { fontSize: 18, fontWeight: "bold", color: "#27ae60" },
  btnBook: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
