import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Config (Agar IP aman)
import { API_BASE_URL } from "../config";

// Import Komponen Baru
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Gunakan API_BASE_URL dari config
      const response = await fetch(`${API_BASE_URL}login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (json.status === "success") {
        const userData = json.data;

        // Simpan data ke penyimpanan HP
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));

        // AMBIL ROLE DENGAN AMAN
        // 1. Cek apakah role ada? Jika tidak, anggap 'penyewa'
        // 2. Ubah ke huruf kecil semua (antisipasi 'Pemilik')
        // 3. Hapus spasi di depan/belakang (antisipasi 'pemilik ')
        const userRole = userData.role
          ? userData.role.toLowerCase().trim()
          : "penyewa";

        // LOGIKA PINDAH HALAMAN
        if (userRole === "pemilik") {
          navigation.replace("OwnerHome");
        } else {
          navigation.replace("Home");
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk Akun</Text>

      {/* Pakai Komponen Input */}
      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Pakai Komponen Tombol (Warna Default Hijau) */}
      <CustomButton
        title="LOGIN SEKARANG"
        onPress={handleLogin}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 30,
    textAlign: "center",
  },
  // Style input & btn sudah dihapus karena pindah ke component
});
