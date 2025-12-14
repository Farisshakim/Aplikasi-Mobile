import React, { useState } from "react";
import { View, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import { IMAGE_URL } from "../config";

const { width } = Dimensions.get("window");

// Tambahkan prop 'isLocal'
export default function Carousel({
  data,
  height = 200,
  isUrl = true,
  isLocal = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const renderItem = ({ item }) => {
    // LOGIKA SUMBER GAMBAR
    let imageSource;
    if (isLocal) {
      // Jika Lokal (pakai require)
      imageSource = item;
    } else {
      // Jika URL (Internet atau Database)
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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {renderDotIndicators()}
    </View>
  );
}

const styles = StyleSheet.create({
  image: { resizeMode: "cover" },
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
