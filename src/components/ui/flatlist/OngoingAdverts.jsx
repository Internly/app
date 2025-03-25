import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import LottieView from "lottie-react-native";
import empty from "../../../../assets/lottie/empty.json";
import { colors } from "../../../data/colors";
import JobCard from "../../cards/JobCard";

const OngoingAdverts = ({
  data,
  title,
  horizontal = false,
  showHeader = false,
}) => {
  const { width } = useWindowDimensions();
  return (
    <View className="w-full h-full flex-1">
      {showHeader && (
        <View className="flex flex-row items-center my-2 p-2 justify-between w-[95%]">
          <Text
            className="text-black text-lg"
            style={{ fontFamily: "DMSans-Medium" }}
          >
            {title}
          </Text>
          <Text
            className="text-black text-sm"
            style={{ fontFamily: "DMSans-Medium" }}
          >
            Last week &darr;
          </Text>
        </View>
      )}

      {data?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          horizontal={false}
          renderItem={({ item }) => (
            <JobCard
              advert={item}
              containerClassName={"w-screen mr-4"}
              containerStyle={{ width: width * 0.9 }}
            />
          )}
          className="p-2"
          data={data}
        />
      ) : (
        <View className="w-full min-h-full flex flex-col items-center justify-center relative h-full">
          <LottieView
            source={empty}
            // duration={1000}
            autoPlay
            // ref={animation}
            style={{
              backgroundColor: "transparent",
              position: "relative",
              alignSelf: "center",
              flex: 1,
              width: 300,
              height: 300,
            }}
          />
          <Text
            className="m-2 text-md text-center self-center font-[DMSans-SemiBold]"
            style={{ color: colors.primary_blue }}
          >
            No ongoing advert at the moment
          </Text>
        </View>
      )}
    </View>
  );
};

export default OngoingAdverts;

const styles = StyleSheet.create({});
