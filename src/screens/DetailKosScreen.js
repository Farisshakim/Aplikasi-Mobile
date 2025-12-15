import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { IMAGE_URL } from "../config";

const { width } = Dimensions.get("window");

// Mapping Icon biar otomatis (Sama dengan AddKostScreen)
const ICON_MAP = {
  WiFi: "wifi",
  AC: "air-conditioner",
  "K. Mandi Dalam": "shower",
  Kasur: "bed-empty",
  Lemari: "wardrobe",
  Meja: "desk",
  "Parkir Motor": "motorbike",
  "Parkir Mobil": "car",
  Dapur: "stove",
  CCTV: "cctv",
};

export default function DetailKosScreen({ route, navigation }) {
  const { item } = route.params;
  const stock = item.stok_kamar ? parseInt(item.stok_kamar) : 0;
  const isFull = stock <= 0;

  const fasilitasArray = item.fasilitas
    ? item.fasilitas.split(",").filter((i) => i)
    : [];

  const FacilityItem = ({ name }) => {
    // Cari nama icon berdasarkan teks fasilitas, default 'check-circle' kalau gak ketemu
    const iconName = ICON_MAP[name] || "check-circle";

    return (
      <View style={styles.facilityItem}>
        <View style={styles.facilityIconBg}>
          <MaterialCommunityIcons name={iconName} size={24} color="#27ae60" />
        </View>
        <Text style={styles.facilityText}>{name}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Gambar */}
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
          <View style={styles.titleSection}>
            <Text style={styles.title}>{item.nama_kos}</Text>
            <View style={styles.badgesRow}>
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
              {isFull ? (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: "#ffebee", borderColor: "#e53935" },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: "#e53935" }]}>
                    PENUH
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
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color="#27ae60" />
              <Text style={styles.location}>{item.alamat}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* --- BAGIAN FASILITAS DINAMIS --- */}
          <Text style={styles.sectionTitle}>Fasilitas</Text>
          <View style={styles.facilitiesGrid}>
            {fasilitasArray.length > 0 ? (
              fasilitasArray.map((fasilitasName, index) => (
                <FacilityItem key={index} name={fasilitasName.trim()} />
              ))
            ) : (
              <Text style={{ color: "gray", fontStyle: "italic" }}>
                Tidak ada data fasilitas.
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Deskripsi Kos</Text>
          <Text style={styles.desc}>{item.deskripsi}</Text>

          <View style={styles.divider} />
          {/* Pemilik Kos Section (Tetap sama) */}
          <Text style={styles.sectionTitle}>Pemilik Kos</Text>
          <View style={styles.ownerCard}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              }}
              style={styles.ownerImage}
            />
            <View>
              <Text style={styles.ownerName}>Ibu Kost</Text>
              <Text style={styles.ownerStatus}>Online</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
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
        <TouchableOpacity
          style={[styles.btnBook, isFull && { backgroundColor: "#ccc" }]}
          disabled={isFull}
          onPress={() => navigation.navigate("BookingForm", { item })}
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
    top: 40,
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
  locationRow: { flexDirection: "row", alignItems: "center" },
  location: { color: "gray", marginLeft: 5, fontSize: 14, flex: 1 },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  // Style Fasilitas Grid
  facilitiesGrid: { flexDirection: "row", flexWrap: "wrap" },
  facilityItem: { width: "33%", alignItems: "center", marginBottom: 15 }, // 3 kolom
  facilityIconBg: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  facilityText: { fontSize: 12, color: "gray", textAlign: "center" },

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
