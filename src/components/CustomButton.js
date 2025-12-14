import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function CustomButton({
  title,
  onPress,
  loading,
  color = "#27ae60", // Default warna hijau (Login)
}) {
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading} // Tombol mati saat loading
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.btnText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 2, // Efek bayangan dikit biar cantik
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
