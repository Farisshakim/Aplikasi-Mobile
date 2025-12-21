import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../components/CustomInput"; // Pastikan path benar
import CustomButton from "../components/CustomButton"; // Pastikan path benar
import { API_BASE_URL } from "../config";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("penyewa"); // Default Penyewa

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "Semua kolom harus diisi!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          no_hp: phone,
          password: password,
          role: role, // Kirim role ke backend
        }),
      });

      // Debugging: Cek respon mentah jika error JSON
      const textResponse = await response.text();
      console.log("Response:", textResponse);

      const json = JSON.parse(textResponse);
      if (json.status === "success") {
        Alert.alert("Sukses", "Registrasi berhasil! Silakan login.");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", json.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi kesalahan sistem/jaringan");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Text style={styles.title}>Daftar Akun</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            icon="person-outline"
            placeholder="Nama Lengkap"
            value={name}
            onChangeText={setName}
          />
          <CustomInput
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            icon="call-outline"
            placeholder="No. Handphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <CustomInput
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* PILIHAN ROLE */}
          <Text
            style={{
              marginTop: 15,
              marginBottom: 10,
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Daftar Sebagai:
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === "penyewa" && styles.roleBtnActive,
              ]}
              onPress={() => setRole("penyewa")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "penyewa" && { color: "white" },
                ]}
              >
                Penyewa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === "pemilik" && styles.roleBtnActive,
              ]}
              onPress={() => setRole("pemilik")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "pemilik" && { color: "white" },
                ]}
              >
                Pemilik Kos
              </Text>
            </TouchableOpacity>
          </View>

          <CustomButton title="Register" onPress={handleRegister} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: "green", fontWeight: "bold" }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  formContainer: { paddingHorizontal: 25 },
  roleBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27ae60",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  roleBtnActive: { backgroundColor: "#27ae60" },
  roleText: { color: "#27ae60", fontWeight: "bold" },
});
