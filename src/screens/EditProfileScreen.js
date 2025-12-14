import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // 1. Import Image Picker
import { API_BASE_URL, IMAGE_URL } from "../config";

export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. State untuk menampung gambar baru yang dipilih
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const data = await AsyncStorage.getItem("user_data");
    if (data) {
      const parsedUser = JSON.parse(data);
      setUser(parsedUser);
      setName(parsedUser.name);
      setEmail(parsedUser.email);
      setPhone(parsedUser.phone || "");
    }
  };

  // 3. Fungsi Membuka Galeri
  const pickImage = async () => {
    // Meminta izin akses galeri (wajib di iOS, baik di Android)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Maaf",
        "Kami membutuhkan izin untuk mengakses galeri foto Anda."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Boleh crop
      aspect: [1, 1], // Rasio persegi
      quality: 0.7, // Kompres sedikit agar tidak terlalu besar
    });

    if (!result.canceled) {
      // Simpan data gambar yang dipilih ke state
      setSelectedImage(result.assets[0]);
    }
  };

  // 4. Fungsi Simpan Data (Menggunakan FormData)
  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Nama dan Email wajib diisi!");
      return;
    }
    setLoading(true);

    // Gunakan FormData untuk mengirim file + text
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

    // Jika ada gambar baru yang dipilih, masukkan ke FormData
    if (selectedImage) {
      let localUri = selectedImage.uri;
      let filename = localUri.split("/").pop(); // Ambil nama file dari URI

      // Trik untuk mendapatkan tipe file (jpeg/png)
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      // Append file gambar (PENTING: struktur objeknya harus seperti ini di RN)
      formData.append("gambar", { uri: localUri, name: filename, type });
    }

    try {
      // PENTING: Jangan pakai header 'Content-Type': 'application/json'
      // Biarkan fetch yang mengatur boundary untuk multipart/form-data
      const response = await fetch(`${API_BASE_URL}update_profile.php`, {
        method: "POST",
        body: formData,
      });

      const textResponse = await response.text(); // Baca dulu sebagai text untuk debug
      console.log("Respon Server:", textResponse);

      // Coba parse ke JSON
      const json = JSON.parse(textResponse);

      if (json.status === "success") {
        // Update data di AsyncStorage dengan data baru dari server
        await AsyncStorage.setItem("user_data", JSON.stringify(json.data));
        Alert.alert("Sukses", "Profil berhasil diperbarui!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Gagal", json.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Tentukan gambar mana yang akan ditampilkan (Gambar baru ATAU Gambar lama dari server ATAU Default)
  let displayImage = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"; // Default
  if (selectedImage) {
    displayImage = selectedImage.uri; // Gambar baru dari galeri HP
  } else if (user.gambar) {
    displayImage = `${IMAGE_URL}${user.gambar}`; // Gambar lama dari server
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        {/* 5. TouchableOpacity untuk memanggil pickImage saat foto diklik */}
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: displayImage }} style={styles.avatar} />
          <View style={styles.cameraBtn}>
            <MaterialCommunityIcons name="camera" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nama Lengkap"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Nomor HP</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Contoh: 08123456789"
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.btnSave}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnSaveText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "white", padding: 20 },
  avatarContainer: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#27ae60",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  form: { marginTop: 10 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  btnSave: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  btnSaveText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
