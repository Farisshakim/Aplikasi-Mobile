import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, IMAGE_URL } from "../config"; // Pastikan path config benar

export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null); // Untuk menampung foto baru
  const [loading, setLoading] = useState(false);

  // Load data user saat pertama kali buka
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setName(parsed.name);
        setEmail(parsed.email);
        setPhone(parsed.no_hp || "");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Maaf", "Kami butuh izin akses galeri untuk ganti foto.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0]); // Simpan objek aset gambar
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", user.id); // ID Wajib dikirim
      formData.append("name", name);
      formData.append("email", email);
      formData.append("no_hp", phone);

      // Jika ada gambar baru, append ke FormData
      if (image) {
        let localUri = image.uri;
        let filename = localUri.split("/").pop();

        // Trik untuk mendapatkan tipe file (jpeg/png)
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append("gambar", { uri: localUri, name: filename, type });
      }

      const response = await fetch(`${API_BASE_URL}update_profile.php`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Header Wajib
        },
      });

      // --- Debugging ---
      const textResponse = await response.text();
      console.log("RESPONSE UPDATE:", textResponse);

      try {
        const json = JSON.parse(textResponse);
        if (json.status === "success") {
          // PENTING: Update data user di HP dengan data baru dari server
          await AsyncStorage.setItem("user_data", JSON.stringify(json.data));

          Alert.alert("Sukses", "Profil berhasil diperbarui!", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Gagal", json.message);
        }
      } catch (e) {
        Alert.alert("Error", "Respon server tidak valid.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  // Tampilan UI Sederhana
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {/* Prioritas Tampilan: 1. Gambar Baru, 2. Gambar Lama, 3. Placeholder */}
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.profileImage} />
          ) : user && user.gambar ? (
            <Image
              source={{ uri: IMAGE_URL + user.gambar }}
              style={styles.profileImage}
            />
          ) : (
            <View
              style={[
                styles.profileImage,
                {
                  backgroundColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons name="camera" size={40} color="#fff" />
            </View>
          )}
          <View style={styles.editIconBadge}>
            <Ionicons name="pencil" size={16} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Ketuk untuk ganti foto</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>No. Handphone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.btnSave}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  header: { alignItems: "center", marginBottom: 30 },
  imageContainer: { position: "relative" },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#eee",
  },
  editIconBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#27ae60",
    padding: 8,
    borderRadius: 20,
  },
  changePhotoText: { marginTop: 10, color: "#27ae60", fontWeight: "bold" },
  form: { flex: 1 },
  label: { marginBottom: 5, color: "#555", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  btnSave: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
