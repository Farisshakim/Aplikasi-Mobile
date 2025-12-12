import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 1. Import Semua Halaman
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DetailKosScreen from "./src/screens/DetailKosScreen"; // <-- Wajib ada
import BookingFormScreen from "./src/screens/BookingFormScreen"; // <-- Wajib ada
import HistoryScreen from "./src/screens/HistoryScreen"; // <-- Wajib ada
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SearchScreen from "./src/screens/SearchScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Halaman Splash & Home (Header disembunyikan biar custom) */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Halaman Detail & Form (Header dimunculkan biar ada tombol Back) */}
        <Stack.Screen
          name="DetailKos"
          component={DetailKosScreen}
          options={{ title: "Detail Kos", headerTintColor: "#27ae60" }}
        />
        <Stack.Screen
          name="BookingForm"
          component={BookingFormScreen}
          options={{ title: "Ajukan Sewa", headerTintColor: "#27ae60" }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "Pesanan Saya", headerTintColor: "#27ae60" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />

        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }} // <-- 2. Tambahkan ini
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
