import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { deviceWidth, styles } from "../../metrics/styles";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../metrics/colors";
import SinglePostItem from "./SinglePostItem";

const SinglePost = ({ details }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollViewRef = React.useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: activeIndex * deviceWidth,
        animated: false,
      });
    }
  }, [activeIndex]);

  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / deviceWidth);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex !== details?.data.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex !== 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <View className="py-8">
      {/* Post information || header */}
      <View className="flex-row items-center px-5">
        <Image
          source={details?.icon}
          alt="image"
          className="h-11 w-11"
          resizeMode="contain"
        />

        <Text
          style={styles.textbold}
          className="text-white max-w-[164px] text-sm ml-1"
        >
          {details?.author}
        </Text>
      </View>

      {/* Post text */}
      <Text
        style={styles.textmedium}
        numberOfLines={3}
        className="text-white text-sm my-3 ml-[5px] h-[57px] px-5"
      >
        {details?.text}
      </Text>

      <View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={onScroll}
        >
          {details.data.map((item, index) => (
            <SinglePostItem key={index} item={item} />
          ))}
        </ScrollView>

        {/* The navigation icons to be shown when the data list is more than 1 details */}
        {details?.data.length > 1 && (
          <View className="flex-row absolute bottom-8 right-8">
            {/* The navigation buttons */}
            <TouchableOpacity
              onPress={handlePrev}
              disabled={activeIndex === 0}
              style={{ opacity: activeIndex === 0 ? 0.6 : 1 }}
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
              disabled={activeIndex === details?.data.length - 1}
              style={{
                opacity: activeIndex === details?.data.length - 1 ? 0.6 : 1,
              }}
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
    </View>
  );
};

export default SinglePost;
