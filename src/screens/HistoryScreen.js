import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IP_ADDRESS = "192.168.100.182";
const API_URL = `http://${IP_ADDRESS}:8000/bookings.php`;

export default function HistoryScreen() {
  const [data, setData] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      if (json.status === "success") setData(json.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCancel = (id) => {
    Alert.alert("Batalkan?", "Yakin ingin membatalkan pesanan ini?", [
      { text: "Tidak" },
      {
        text: "Ya, Batalkan",
        onPress: async () => {
          await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
          fetchHistory(); // Refresh list
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Riwayat Pesanan Saya</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kosName}>{item.nama_kos}</Text>
              <Text>Pemesan: {item.nama_pemesan}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => handleCancel(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  kosName: { fontWeight: "bold", fontSize: 16 },
  status: { color: "orange", fontWeight: "bold", marginTop: 5 },
});
