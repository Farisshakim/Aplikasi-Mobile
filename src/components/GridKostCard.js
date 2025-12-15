import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { IMAGE_URL } from "../config";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 24;

export default function GridKostCard({ item, onPress }) {
  // --- PERBAIKAN DI SINI ---
  // Ambil data asli dari database. Default "Campur" jika kosong.
  const genderType = item.gender ? item.gender : "Campur";

  // Tentukan Warna
  let genderColor = "#9b59b6"; // Ungu (Campur)
  let badgeBg = "#f3e5f5";

  // Kita pakai toLowerCase() agar aman (Putra/putra tetap terbaca)
  if (genderType.toLowerCase() === "putra") {
    genderColor = "#3498db"; // Biru
    badgeBg = "#e3f2fd";
  } else if (genderType.toLowerCase() === "putri") {
    genderColor = "#e91e63"; // Pink
    badgeBg = "#fce4ec";
  }

  // Hitung Diskon (Pura-pura/Dummy)
  const price = parseInt(item.harga);
  const originalPrice = price + 150000;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        {/* IMAGE CONTAINER */}
        <View>
          <Image
            source={{
              uri: item.gambar
                ? `${IMAGE_URL}${item.gambar}`
                : "https://via.placeholder.com/300",
            }}
            style={styles.cardImage}
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
          <TouchableOpacity style={styles.wishlistBtn}>
            <Ionicons name="heart-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* INFO CONTENT */}
        <View style={styles.cardContent}>
          <View style={styles.rowBetween}>
            {/* Badge Gender yang sudah diperbaiki */}
            <View style={[styles.genderBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.genderText, { color: genderColor }]}>
                {genderType}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#f1c40f" />
              <Text style={styles.ratingText}>4.8 (12)</Text>
            </View>
          </View>

          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.nama_kos}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color="#95a5a6" />
            <Text style={styles.cardLocation} numberOfLines={1}>
              {item.alamat}
            </Text>
          </View>

          <View style={styles.facilityRow}>
            <View style={styles.facPill}>
              <Text style={styles.facText}>WiFi</Text>
            </View>
            <View style={styles.facPill}>
              <Text style={styles.facText}>AC</Text>
            </View>
            <Text style={styles.facMore}>+2</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.strikethrough}>
              Rp {originalPrice.toLocaleString("id-ID")}
            </Text>
            <Text style={styles.mainPrice}>
              Rp {price.toLocaleString("id-ID")}
            </Text>
            <Text style={styles.priceNote}>Belum termasuk listrik</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: { width: cardWidth, marginBottom: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardImage: { width: "100%", height: 140, resizeMode: "cover" },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#e53935",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: { color: "white", fontSize: 10, fontWeight: "bold" },
  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: { padding: 10 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  genderBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  genderText: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase" },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 10, color: "#7f8c8d", marginLeft: 2 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 2,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardLocation: { fontSize: 11, color: "#95a5a6", flex: 1, marginLeft: 2 },
  facilityRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  facPill: {
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  facText: { fontSize: 9, color: "#7f8c8d" },
  facMore: { fontSize: 9, color: "#7f8c8d" },
  priceContainer: { marginTop: "auto" },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#bdc3c7",
    fontSize: 10,
  },
  mainPrice: { fontSize: 15, fontWeight: "bold", color: "#27ae60" },
  priceNote: { fontSize: 9, color: "#95a5a6" },
});
