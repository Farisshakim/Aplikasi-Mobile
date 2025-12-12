import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Timer 2 detik, lalu pindah ke halaman 'Home'
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#27ae60",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          color: "white",
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        AnaKKost
      </Text>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}
