import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../config";

export default function PaymentScreen({ route, navigation }) {
  const { item } = route.params;
  const [loading, setLoading] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState({
    type: "bank",
    id: "bca",
    name: "Bank BCA",
  });
  const [phoneNumber, setPhoneNumber] = useState("");

  const [timeLeft, setTimeLeft] = useState(3599);
  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((p) => (p > 0 ? p - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handlePayment = async () => {
    if (selectedMethod.type === "ewallet" && phoneNumber.length < 10) {
      return Alert.alert(
        "Error",
        "Masukkan nomor HP yang terdaftar di " + selectedMethod.name
      );
    }

    Alert.alert("Konfirmasi", `Bayar menggunakan ${selectedMethod.name}?`, [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Bayar", onPress: processPayment },
    ]);
  };

  const processPayment = async () => {
    setLoading(true);
    const formData = new FormData();
    // Sesuaikan dengan PHP: 'id_booking'
    formData.append("id_booking", item.id);
    formData.append("metode", selectedMethod.name);

    try {
      console.log("Mengirim Pembayaran ID:", item.id);

      const response = await fetch(`${API_BASE_URL}confirm_payment.php`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data", // PENTING untuk FormData
        },
      });

      const textResponse = await response.text();
      console.log("Respon Server:", textResponse); // Debugging

      try {
        const json = JSON.parse(textResponse);
        if (json.status === "success") {
          Alert.alert(
            "Sukses!",
            "Pembayaran berhasil! Status booking kini LUNAS.",
            [
              {
                text: "Lihat Riwayat",
                onPress: () => navigation.navigate("History"),
              },
            ]
          );
        } else {
          Alert.alert("Gagal", json.message || "Terjadi kesalahan sistem.");
        }
      } catch (e) {
        Alert.alert("Error Server", "Respon server tidak valid.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Koneksi gagal. Cek internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const PaymentItem = ({ id, name, icon, color, type }) => {
    const isSelected = selectedMethod.id === id;
    return (
      <TouchableOpacity
        style={[styles.payItem, isSelected && styles.payItemActive]}
        onPress={() => setSelectedMethod({ type, id, name })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={[styles.iconBox, { backgroundColor: color }]}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 10 }}>
              {icon}
            </Text>
          </View>
          <Text style={styles.methodName}>{name}</Text>
        </View>
        <View style={styles.radio}>
          {isSelected && <View style={styles.radioActive} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.amountCard}>
          <Text style={styles.label}>Total Pembayaran</Text>
          <Text style={styles.amount}>
            Rp {parseInt(item.total_harga).toLocaleString("id-ID")}
          </Text>
          <View style={styles.timerContainer}>
            <Text style={{ color: "#e53935", fontSize: 12 }}>
              Berakhir dalam:{" "}
            </Text>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>E-Wallet / Dompet Digital</Text>
        <View style={styles.methodGroup}>
          <PaymentItem
            type="ewallet"
            id="gopay"
            name="GoPay"
            icon="GO"
            color="#00aa13"
          />
          <PaymentItem
            type="ewallet"
            id="ovo"
            name="OVO"
            icon="OVO"
            color="#4c3494"
          />
          <PaymentItem
            type="ewallet"
            id="dana"
            name="DANA"
            icon="DN"
            color="#118eea"
          />
          <PaymentItem
            type="ewallet"
            id="shopee"
            name="ShopeePay"
            icon="SP"
            color="#ee4d2d"
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Transfer Bank (Virtual Account)
        </Text>
        <View style={styles.methodGroup}>
          <PaymentItem
            type="bank"
            id="bca"
            name="Bank BCA"
            icon="BCA"
            color="#005eb8"
          />
          <PaymentItem
            type="bank"
            id="mandiri"
            name="Bank Mandiri"
            icon="MDR"
            color="#ffb700"
          />
          <PaymentItem
            type="bank"
            id="bni"
            name="Bank BNI"
            icon="BNI"
            color="#006c7d"
          />
        </View>

        <View style={styles.instructionContainer}>
          {selectedMethod.type === "ewallet" ? (
            <View>
              <Text style={styles.instructionTitle}>
                Sambungkan ke {selectedMethod.name}
              </Text>
              <Text style={styles.instructionDesc}>
                Masukkan nomor HP yang terdaftar untuk memproses pembayaran.
              </Text>
              <View style={styles.inputBox}>
                <Text style={{ fontWeight: "bold", marginRight: 10 }}>+62</Text>
                <TextInput
                  style={{ flex: 1, fontSize: 16 }}
                  placeholder="812-3456-7890"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/1175/1175117.png",
                  }}
                  style={{ width: 20, height: 20, tintColor: "green" }}
                />
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.instructionTitle}>Nomor Virtual Account</Text>
              <Text style={styles.instructionDesc}>
                Salin nomor ini ke m-banking atau ATM Anda.
              </Text>
              <View style={styles.vaBox}>
                <Text style={styles.vaNumber}>8801 0023 9912 8822</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Disalin!", "Nomor VA berhasil disalin.")
                  }
                >
                  <Text style={styles.copyText}>SALIN</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            selectedMethod.id === "ovo" && { backgroundColor: "#4c3494" },
            selectedMethod.id === "dana" && { backgroundColor: "#118eea" },
            selectedMethod.id === "shopee" && { backgroundColor: "#ee4d2d" },
          ]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payText}>
              {selectedMethod.type === "ewallet"
                ? `Bayar dengan ${selectedMethod.name}`
                : "Bayar"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "white",
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  backBtn: { padding: 5 },

  amountCard: { alignItems: "center", marginVertical: 20 },
  label: { fontSize: 14, color: "gray" },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  timerContainer: {
    flexDirection: "row",
    backgroundColor: "#ffebee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timerText: { color: "#e53935", fontWeight: "bold" },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
    fontSize: 14,
  },
  methodGroup: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 1,
  },

  payItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  payItemActive: { backgroundColor: "#f0fdf4" },
  iconBox: {
    width: 40,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginRight: 15,
  },
  methodName: { fontWeight: "500", fontSize: 14 },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#27ae60",
  },

  instructionContainer: {
    marginTop: 25,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  instructionTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 5 },
  instructionDesc: { color: "gray", fontSize: 12, marginBottom: 15 },

  vaBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
  },
  vaNumber: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#333",
  },
  copyText: { color: "#27ae60", fontWeight: "bold" },

  inputBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  payButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  payText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
