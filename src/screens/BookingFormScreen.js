import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Import Config & Components
import { API_BASE_URL, IMAGE_URL } from "../config";
import CustomInput from "../components/CustomInput";

export default function BookingFormScreen({ route, navigation }) {
  const { item } = route.params; // Data kos yang dipilih

  const [nama, setNama] = useState("");
  const [lama, setLama] = useState("1"); // Default 1 bulan
  const [loading, setLoading] = useState(false);

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
  const serviceFee = 5000; // Contoh biaya layanan (opsional)
  const grandTotal = totalHarga + serviceFee;

  const handleBooking = async () => {
    if (!nama) return Alert.alert("Error", "Nama wajib diisi");
    if (duration < 1) return Alert.alert("Error", "Minimal sewa 1 bulan");

    setLoading(true);

    const formData = new FormData();
    formData.append("nama_pemesan", nama);
    formData.append("kost_id", item.id);
    formData.append("nama_kos", item.nama_kos);
    formData.append("tanggal_masuk", new Date().toISOString().split("T")[0]);
    formData.append("lama_sewa", lama);
    formData.append("total_harga", grandTotal); // Kirim Grand Total

    try {
      await fetch(`${API_BASE_URL}bookings.php`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      Alert.alert("Berhasil", "Pengajuan sewa terkirim!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* --- HEADER --- */}

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
              <Text style={styles.badge}>Campur</Text>
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
            <CustomInput
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChangeText={setNama}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 0.48 }}>
                <Text style={styles.label}>Lama Sewa (Bulan)</Text>
                <CustomInput
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

          {/* Spacer agar tidak ketutup footer */}
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  scrollContent: { padding: 20 },

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
    borderRadius: 10,
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
