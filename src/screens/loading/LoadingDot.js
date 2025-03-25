import { View, Text } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { colors } from "../../data/colors";

const LoadingDot = () => {
  const size1 = useSharedValue(18);
  const size2 = useSharedValue(13);
  const size3 = useSharedValue(9);
  const size4 = useSharedValue(6);

  const circle1Style = useAnimatedStyle(() => {
    return {
      width: size1.value,
      height: size1.value,
      backgroundColor:colors.primary_blue
    };
  });

  const circle2Style = useAnimatedStyle(() => {
    return {
      width: size2.value,
      height: size2.value,
      backgroundColor:colors.primary_purple

    };
  });

  const circle3Style = useAnimatedStyle(() => {
    return {
      width: size3.value,
      height: size3.value,
      backgroundColor:colors.primary_mint

    };
  });

  const circle4Style = useAnimatedStyle(() => {
    return {
      width: size4.value,
      height: size4.value,
      backgroundColor:colors.secondary_mint

    };
  });

  React.useEffect(() => {
    size1.value = withRepeat(
      withSequence(
        withTiming(18, { duration: 900 }),
        withTiming(13, { duration: 900 }),
        withTiming(9, { duration: 900 }),
        withTiming(6, { duration: 900 })
      ),
      -1,
      true
    );

    size2.value = withRepeat(
      withSequence(
        withTiming(13, { duration: 900 }),
        withTiming(18, { duration: 900 }),
        withTiming(13, { duration: 900 }),
        withTiming(9, { duration: 900 })
      ),
      -1,
      true
    );

    size3.value = withRepeat(
      withSequence(
        withTiming(9, { duration: 1800 }),
        withTiming(18, { duration: 900 }),
        withTiming(13, { duration: 900 })
      ),
      -1,
      true
    );

    size4.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 900 }),
        withTiming(6, { duration: 900 }),
        withTiming(6, { duration: 900 }),
        withTiming(18, { duration: 900 })
      ),
      -1,
      true
    );
  }, []);

  return (
    <View className="flex-row items-center justify-cent h-5">
      {/* first circle */}
      <Animated.View
        style={circle1Style}
        className=" rounded-full bg-[#EFDA67] mr-1"
      ></Animated.View>

      {/* second circle */}
      <Animated.View
        style={circle2Style}
        className="rounded-full bg-[#fff] mr-1"
      ></Animated.View>

      {/* third circle */}
      <Animated.View
        style={circle3Style}
        className="rounded-full bg-[#EFDA67]"
      ></Animated.View>

      {/* fourth circle */}
      <Animated.View
        style={circle4Style}
        className="rounded-full bg-[#fff] ml-1"
      ></Animated.View>
    </View>
  );
};

export default LoadingDot;
