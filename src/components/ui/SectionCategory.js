import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { colors } from "../metrics/colors";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const SectionCategory = ({
  firstContent,
  secondContent,
  thirdContent,
  title,
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const scrollViewRef = useRef(null);
  const left = useSharedValue(0);

  const handleCategoryChange = (index) => {
    setActiveCategory(index);
    left.value = withTiming((width / 3) * index);
    scrollViewRef.current.scrollTo({ x: index * width, animated: false });
  };

  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = (offsetX / width) | 0;

    const leftValue = (width / 3) * index;
    left.value = withTiming(leftValue);
    setActiveCategory(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {title.map((item, index) => (
          <Text
            key={index}
            className={`basis-1/3 ${index === 1 && "text-center"} `}
            style={[
              styles.headerText,
              activeCategory === index && styles.activeHeader,
            ]}
            onPress={() => handleCategoryChange(index)}
          >
            {item}
          </Text>
        ))}

        <Animated.View style={{ ...styles.underline, left }} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrol
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        // scrollEventThrottle={10}
      >
        {/* home content */}
        <View style={styles.slide}>{firstContent}</View>

        {/* about content */}
        <View style={styles.slide}>{secondContent}</View>

        {/* community content */}
        <View style={styles.slide}>{thirdContent}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#494B4D",
    paddingHorizontal: 10,
  },

  headerText: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    color: "#5F5F5F",
    fontSize: 16,
    fontFamily: "DMSans-Medium",
  },

  activeHeader: {
    color: "#fff",
  },

  underline: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: `${100 / 3}%`,
    backgroundColor: colors.gold,
  },
  slide: {
    width,
  },
});

export default SectionCategory;
