import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IMAGE_URL } from "../config";

export default function KostCard({ item, onPress }) {
  // 1. Logika Cek Stok
  const stock = parseInt(item.stok_kamar) || 0;
  const isFull = stock <= 0;

  // 2. Logika Warna Gender
  let genderColor = "#9b59b6"; // Default Ungu (Campur)
  let genderBg = "#f3e5f5";

  if (item.gender === "Putra") {
    genderColor = "#2980b9"; // Biru
    genderBg = "#e3f2fd";
  } else if (item.gender === "Putri") {
    genderColor = "#e91e63"; // Pink
    genderBg = "#fce4ec";
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* GAMBAR */}
      <Image
        source={{
          uri: item.gambar
            ? `${IMAGE_URL}${item.gambar}`
            : "https://via.placeholder.com/300",
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        {/* --- BARIS TAG (GENDER & STOK) --- */}
        <View style={styles.tagsRow}>
          {/* Badge Gender */}
          <View style={[styles.badge, { backgroundColor: genderBg }]}>
            <Text style={[styles.badgeText, { color: genderColor }]}>
              {item.gender || "Campur"}
            </Text>
          </View>

          {/* Badge Stok (YANG BARU) */}
          {isFull ? (
            <View style={[styles.badge, { backgroundColor: "#ffebee" }]}>
              <Text style={[styles.badgeText, { color: "#c62828" }]}>
                Penuh
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, { backgroundColor: "#e8f5e9" }]}>
              <Text style={[styles.badgeText, { color: "#27ae60" }]}>
                Sisa {stock}
              </Text>
            </View>
          )}
        </View>
        {/* -------------------------------- */}

        <Text style={styles.title} numberOfLines={1}>
          {item.nama_kos}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color="#95a5a6"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.location} numberOfLines={1}>
            {item.alamat}
          </Text>
        </View>

        <Text style={styles.price}>
          Rp {parseInt(item.harga).toLocaleString("id-ID")}
          <Text style={styles.perMonth}> / bulan</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    // Efek Bayangan (Card Elevation)
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
  },

  // Style Baris Tag (Badge)
  tagsRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    color: "#7f8c8d",
    fontSize: 12,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
  },
  perMonth: {
    fontSize: 12,
    color: "#95a5a6",
    fontWeight: "normal",
  },
});
