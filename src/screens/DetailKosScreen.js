import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet, // <-- INI YANG TADI HILANG
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { IMAGE_URL } from "../config";

const { width } = Dimensions.get("window");

export default function DetailKosScreen({ route, navigation }) {
  const { item } = route.params;

  // Logika Cek Stok (Mencegah error jika stok undefined/null)
  // Default ke 0 jika data tidak ada
  const stock = item.stok_kamar ? parseInt(item.stok_kamar) : 0;
  const isFull = stock <= 0;

  const FacilityItem = ({ icon, name }) => (
    <View style={styles.facilityItem}>
      <View style={styles.facilityIconBg}>
        <MaterialCommunityIcons name={icon} size={24} color="#27ae60" />
      </View>
      <Text style={styles.facilityText}>{name}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* --- 1. HEADER GAMBAR --- */}
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri: item.gambar
                ? `${IMAGE_URL}${item.gambar}`
                : "https://via.placeholder.com/300",
            }}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.content}>
          {/* --- 2. JUDUL & TAG --- */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{item.nama_kos}</Text>

            <View style={styles.badgesRow}>
              {/* Badge Campur/Putra/Putri */}
              <View
                style={[
                  styles.badge,
                  { backgroundColor: "#e3f2fd", borderColor: "#2196f3" },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#2196f3" }]}>
                  {item.gender || "Campur"}
                </Text>
              </View>

              {/* Badge Stok Dinamis */}
              {isFull ? (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: "#ffebee", borderColor: "#e53935" },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: "#e53935" }]}>
                    KAMAR PENUH
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: "#e8f5e9", borderColor: "#27ae60" },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: "#27ae60" }]}>
                    Sisa {stock} Kamar
                  </Text>
                </View>
              )}

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#f1c40f" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color="#27ae60" />
              <Text style={styles.location}>{item.alamat}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* --- 3. FASILITAS --- */}
          <Text style={styles.sectionTitle}>Fasilitas Utama</Text>
          <View style={styles.facilitiesGrid}>
            <FacilityItem icon="wifi" name="WiFi Gratis" />
            <FacilityItem icon="air-conditioner" name="AC" />
            <FacilityItem icon="bed-empty" name="Kasur" />
            <FacilityItem icon="wardrobe" name="Lemari" />
            <FacilityItem icon="shower" name="K. Mandi" />
            <FacilityItem icon="parking" name="Parkir" />
          </View>

          <View style={styles.divider} />

          {/* --- 4. DESKRIPSI --- */}
          <Text style={styles.sectionTitle}>Deskripsi Kos</Text>
          <Text style={styles.desc}>{item.deskripsi}</Text>

          <View style={styles.divider} />

          {/* --- 5. PEMILIK KOS --- */}
          <Text style={styles.sectionTitle}>Pemilik Kos</Text>
          <View style={styles.ownerCard}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              }}
              style={styles.ownerImage}
            />
            <View>
              <Text style={styles.ownerName}>Ibu Siti</Text>
              <Text style={styles.ownerStatus}>Aktif 5 menit lalu</Text>
            </View>
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#27ae60"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* --- 6. FOOTER STICKY --- */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "gray" }}>Harga Sewa</Text>
          <Text style={styles.priceText}>
            Rp {parseInt(item.harga).toLocaleString("id-ID")}
            <Text style={{ fontSize: 14, color: "gray", fontWeight: "normal" }}>
              /bln
            </Text>
          </Text>
        </View>

        {/* Tombol Booking dengan Logika Stok */}
        <TouchableOpacity
          style={[styles.btnBook, isFull && { backgroundColor: "#ccc" }]}
          disabled={isFull}
          onPress={() => navigation.navigate("BookingForm", { item: item })}
        >
          <Text style={styles.btnText}>{isFull ? "HABIS" : "Ajukan Sewa"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { position: "relative" },
  image: { width: width, height: 280, resizeMode: "cover" },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  badgesRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 8,
  },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff9c4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  ratingText: { marginLeft: 4, fontWeight: "bold", color: "#f39c12" },
  locationRow: { flexDirection: "row", alignItems: "center" },
  location: { color: "gray", marginLeft: 5, fontSize: 14, flex: 1 },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  facilityItem: { width: "30%", alignItems: "center", marginBottom: 15 },
  facilityIconBg: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  facilityText: { fontSize: 12, color: "gray" },
  desc: { lineHeight: 24, color: "#555", fontSize: 14 },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 15,
    borderRadius: 12,
  },
  ownerImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  ownerName: { fontWeight: "bold", fontSize: 16 },
  ownerStatus: { color: "#27ae60", fontSize: 12 },
  chatButton: { marginLeft: "auto", padding: 5 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "white",
    elevation: 20,
  },
  priceText: { fontSize: 20, fontWeight: "bold", color: "#27ae60" },
  btnBook: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
