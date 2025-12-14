import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";

// Import Config
import { API_BASE_URL } from "../config";

// Import Komponen Baru
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await response.json();

      if (json.status === "success") {
        Alert.alert("Sukses", "Akun berhasil dibuat! Silakan Login.");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", json.message || "Gagal mendaftar");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal koneksi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Akun Baru</Text>

      <CustomInput
        placeholder="Nama Lengkap"
        value={name}
        onChangeText={setName}
      />

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

      {/* Pakai Komponen Tombol dengan Warna Biru Gelap */}
      <CustomButton
        title="DAFTAR"
        onPress={handleRegister}
        loading={loading}
        color="#34495e" // <-- Custom Warna
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
    color: "#34495e", // Warna judul disamakan dengan tombol
    marginBottom: 30,
    textAlign: "center",
  },
});
