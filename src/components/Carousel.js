import React, { useState, useEffect, useRef } from "react";
import { View, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import { IMAGE_URL } from "../config";

const { width } = Dimensions.get("window");

export default function Carousel({
  data,
  height = 200,
  isUrl = true,
  isLocal = false,
  autoPlay = true, // Tambahan properti untuk on/off auto play
  timer = 3000, // Durasi per geseran (ms)
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null); // 1. Buat referensi untuk FlatList

  // 2. Logika Auto Play
  useEffect(() => {
    let interval;
    if (autoPlay && data.length > 0) {
      interval = setInterval(() => {
        let nextIndex = activeIndex + 1;

        // Jika sudah di akhir, kembali ke 0
        if (nextIndex >= data.length) {
          nextIndex = 0;
        }

        // Geser FlatList secara programatis
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        setActiveIndex(nextIndex);
      }, timer);
    }

    // Bersihkan timer saat komponen hilang/unmount
    return () => clearInterval(interval);
  }, [activeIndex, autoPlay, data.length, timer]);

  const handleScroll = (event) => {
    // Hitung index saat user menggeser manual
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const renderItem = ({ item }) => {
    let imageSource;
    if (isLocal) {
      imageSource = item;
    } else {
      imageSource = { uri: isUrl ? item : `${IMAGE_URL}${item}` };
    }

    return (
      <View style={{ width: width, height: height, alignItems: "center" }}>
        <Image
          source={imageSource}
          style={[styles.image, { height: height, width: width }]}
        />
      </View>
    );
  };

  const renderDotIndicators = () => {
    return (
      <View style={styles.dotContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: activeIndex === index ? "#27ae60" : "#ccc" },
              { width: activeIndex === index ? 20 : 8 },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef} // 3. Sambungkan ref ke FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // Menambahkan getItemLayout supaya scrollToIndex akurat & tidak error
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      {renderDotIndicators()}
    </View>
  );
}

const styles = StyleSheet.create({
  image: { resizeMode: "cover" }, // Ubah ke cover agar gambar full
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    elevation: 3,
  },
});
