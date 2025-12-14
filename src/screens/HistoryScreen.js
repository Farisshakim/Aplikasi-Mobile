import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  RefreshControl,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { API_BASE_URL, IMAGE_URL } from "../config";
import BottomNavigator from "../components/BottomNavigator";

export default function HistoryScreen({ navigation }) {
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Berlangsung");

  // State untuk Struk/Tiket
  const [ticketVisible, setTicketVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // --- TAMBAHAN BARU: MATIKAN HEADER BAWAAN (TOMBOL BACK) ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Ini yang menghapus navigasi kembali (Panah Kiri)
    });
  }, [navigation]);
  // -----------------------------------------------------------

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}bookings.php`);
      const json = await response.json();
      if (json.status === "success") {
        setMasterData(json.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterData();
  }, [activeTab, masterData]);

  const filterData = () => {
    if (activeTab === "Berlangsung") {
      const data = masterData.filter(
        (item) => !item.status || item.status === "Pending"
      );
      setFilteredData(data);
    } else {
      const data = masterData.filter(
        (item) =>
          item.status === "Confirmed" ||
          item.status === "Selesai" ||
          item.status === "Dibatalkan"
      );
      setFilteredData(data);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  const handleCancel = (id) => {
    Alert.alert("Batalkan?", "Yakin ingin membatalkan pesanan ini?", [
      { text: "Tidak" },
      {
        text: "Ya, Batalkan",
        onPress: async () => {
          await fetch(`${API_BASE_URL}bookings.php?id=${id}`, {
            method: "DELETE",
          });
          fetchHistory();
        },
      },
    ]);
  };

  const handlePay = (item) => {
    navigation.navigate("Payment", { item: item });
  };

  const openTicket = (item) => {
    setSelectedTicket(item);
    setTicketVisible(true);
  };

  const OrderCard = ({ item }) => {
    let statusLabel = item.status || "Menunggu Pembayaran";
    let statusColor = "#f39c12";
    let statusBg = "#fdf2e9";

    if (statusLabel === "Confirmed") {
      statusLabel = "LUNAS";
      statusColor = "#27ae60";
      statusBg = "#e8f5e9";
    } else if (statusLabel === "Dibatalkan") {
      statusColor = "#e74c3c";
      statusBg = "#fce4ec";
    }

    const renderActions = () => {
      if (statusLabel === "Menunggu Pembayaran" || statusLabel === "Pending") {
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => handleCancel(item.id)}
            >
              <Text style={styles.btnTextOutline}>Batalkan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSolid}
              onPress={() => handlePay(item)}
            >
              <Text style={styles.btnTextSolid}>Bayar Sekarang</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (statusLabel === "LUNAS" || statusLabel === "Confirmed") {
        return (
          <TouchableOpacity
            style={styles.btnTicket}
            onPress={() => openTicket(item)}
          >
            <MaterialCommunityIcons
              name="ticket-confirmation-outline"
              size={18}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnTextSolid}>Lihat Detail Tiket</Text>
          </TouchableOpacity>
        );
      }
      return null;
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image
            source={{
              uri: item.gambar
                ? `${IMAGE_URL}${item.gambar}`
                : "https://via.placeholder.com/150",
            }}
            style={styles.thumb}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.nama_kos}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusLabel}
                </Text>
              </View>
            </View>
            <Text style={styles.cardLoc} numberOfLines={1}>
              {item.alamat || "Lokasi Kost"}
            </Text>
            <Text style={styles.cardPrice}>
              Rp {parseInt(item.total_harga).toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        {renderActions()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* HEADER TABS */}
      <View style={styles.topTabsContainer}>
        {/* JUDUL HALAMAN (Custom Header) */}
        <Text style={styles.headerTitle}>Pesanan Saya</Text>

        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "Berlangsung" && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab("Berlangsung")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Berlangsung" && styles.tabTextActive,
              ]}
            >
              Berlangsung
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "Selesai" && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab("Selesai")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Selesai" && styles.tabTextActive,
              ]}
            >
              Selesai
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderCard item={item} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={60}
              color="#ddd"
            />
            <Text style={styles.emptyText}>Tidak ada data</Text>
          </View>
        }
      />

      {/* MODAL STRUK / TIKET */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ticketVisible}
        onRequestClose={() => setTicketVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={40}
                color="white"
              />
              <Text style={styles.ticketTitle}>Pembayaran Berhasil</Text>
              <Text style={styles.ticketSubtitle}>
                Terima kasih telah melakukan pemesanan
              </Text>
            </View>

            {selectedTicket && (
              <View style={styles.ticketBody}>
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                  <Image
                    source={{
                      uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png",
                    }}
                    style={{ width: 80, height: 80 }}
                  />
                  <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                    BOOKING ID: #{selectedTicket.id}
                  </Text>
                </View>

                <View style={styles.dashedLine} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nama Kost</Text>
                  <Text style={styles.detailValue}>
                    {selectedTicket.nama_kos}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pemesan</Text>
                  <Text style={styles.detailValue}>
                    {selectedTicket.nama_pemesan}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check In</Text>
                  <Text style={styles.detailValue}>
                    {selectedTicket.tanggal_masuk}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Durasi</Text>
                  <Text style={styles.detailValue}>
                    {selectedTicket.lama_sewa} Bulan
                  </Text>
                </View>

                <View style={styles.dashedLine} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL BAYAR</Text>
                  <Text style={styles.totalValue}>
                    Rp{" "}
                    {parseInt(selectedTicket.total_harga).toLocaleString(
                      "id-ID"
                    )}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeTicketBtn}
              onPress={() => setTicketVisible(false)}
            >
              <Text style={styles.closeTicketText}>Tutup Tiket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigator navigation={navigation} activeScreen="History" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  topTabsContainer: {
    backgroundColor: "white",
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: { backgroundColor: "#27ae60" },
  tabText: { color: "gray", fontWeight: "600" },
  tabTextActive: { color: "white" },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardHeader: { flexDirection: "row" },
  thumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#eee" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: "bold" },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 5,
  },
  cardLoc: { fontSize: 11, color: "gray", marginTop: 2 },
  cardPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#27ae60",
    marginTop: 5,
  },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 },

  actionRow: { flexDirection: "row", justifyContent: "space-between" },
  btnOutline: {
    flex: 0.48,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  btnTextOutline: { color: "#555", fontWeight: "bold", fontSize: 12 },
  btnSolid: {
    flex: 0.48,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#27ae60",
    alignItems: "center",
  },
  btnTextSolid: { color: "white", fontWeight: "bold", fontSize: 12 },

  btnTicket: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ticketCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  ticketHeader: {
    backgroundColor: "#27ae60",
    padding: 20,
    alignItems: "center",
  },
  ticketTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  ticketSubtitle: { color: "#e8f5e9", fontSize: 12 },
  ticketBody: { padding: 20 },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    marginVertical: 15,
    borderRadius: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: { color: "gray", fontSize: 12 },
  detailValue: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  totalLabel: { fontSize: 14, fontWeight: "bold", color: "#333" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#27ae60" },
  closeTicketBtn: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  closeTicketText: { color: "#555", fontWeight: "bold" },

  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 10, color: "gray" },
});
