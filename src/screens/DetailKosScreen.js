import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Ganti IP sesuai laptopmu
const IP_ADDRESS = "192.168.100.182";
const IMAGE_URL = `http://${IP_ADDRESS}:8000/images/`;

export default function DetailKosScreen({ route, navigation }) {
  const { item } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <Image
          source={{
            uri: item.gambar
              ? `${IMAGE_URL}${item.gambar}`
              : "https://via.placeholder.com/300",
          }}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{item.nama_kos}</Text>
          <Text style={styles.price}>
            Rp {parseInt(item.harga).toLocaleString("id-ID")} / bulan
          </Text>
          <Text style={styles.location}>📍 {item.alamat}</Text>
          <View style={styles.divider} />
          <Text style={styles.desc}>{item.deskripsi}</Text>
        </View>
      </ScrollView>

      {/* FOOTER UNTUK CUSTOMER */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "gray" }}>Total Pembayaran</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#27ae60" }}>
            Rp {parseInt(item.harga).toLocaleString("id-ID")}
          </Text>
        </View>

        {/* Tombol Booking */}
        <TouchableOpacity
          style={styles.btnBook}
          onPress={() => navigation.navigate("BookingForm", { item: item })}
        >
          <Text style={styles.btnText}>Ajukan Sewa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 250, resizeMode: "cover" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  price: { fontSize: 18, color: "#27ae60", marginVertical: 5 },
  location: { color: "gray" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  desc: { lineHeight: 22, color: "#555" },

  // Style Footer Baru
  footer: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  btnBook: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "bold" },
});
