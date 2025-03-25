import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import PostItem from "./PostItem";
import { deviceHeight, deviceWidth } from "../metrics/styles";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../metrics/colors";
import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const PostFlatlist = ({ data }) => {
  const [index, setIndex] = useState(0);
  const flatListRef = React.useRef(null);

  const handlePrev = () => {
    if (index > 0) {
      flatListRef.current.scrollToIndex({ animated: true, index: index - 1 });
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    if (index < data.length - 1) {
      flatListRef.current.scrollToIndex({ animated: true, index: index + 1 });
      setIndex(index + 1);
    }
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        snapToInterval={deviceWidth}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <PostItem item={item} />}
        initialScrollIndex={index}
        getItemLayout={(data, index) => ({
          length: deviceWidth,
          offset: deviceWidth * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const { contentOffset, layoutMeasurement, contentSize } =
            event.nativeEvent;
          const currentIndex = Math.round(
            contentOffset.x / layoutMeasurement.width
          );
          setIndex(currentIndex);
        }}
      />

      {/* The navigation icons to be shown when the data list is more than 1 item */}
      {data.length > 1 && (
        <View className="flex-row absolute bottom-8 right-8">
          {/* The navigation buttons */}
          <TouchableOpacity
            onPress={handlePrev}
            disabled={index === 0}
            style={{ opacity: index === 0 ? 0.6 : 1 }}
          >
            <Entypo
              name="chevron-with-circle-left"
              size={24}
              color={colors.gold}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>

          {/* Right icon */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={index === data.length - 1}
            style={{ opacity: index === data.length - 1 ? 0.6 : 1 }}
          >
            <Entypo
              name="chevron-with-circle-right"
              size={24}
              color={colors.gold}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PostFlatlist;
