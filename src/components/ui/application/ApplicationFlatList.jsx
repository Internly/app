import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import ApplicationCard from "../../cards/ApplicationCard";
import LottieView from "lottie-react-native";
import empty from "../../../../assets/lottie/empty.json";
import { colors } from "../../../data/colors";

const ApplicationFlatList = ({
  data,
  title,
  emptyLottie,
  emptyMessage,
  horizontalList,
  showHeader,
}) => {
  return (
    <View className="w-full flex-1 bg-white">
      {showHeader && (
        <View className="flex flex-row items-center my-2 p-2 justify-between w-[95%]">
          <Text
            className="text-black text-lg"
            style={{ fontFamily: "DMSans-Medium" }}
          >
            {title || "Adverts"}
          </Text>
          {/* <Text
          className="text-black text-sm"
          style={{ fontFamily: "DMSans-Medium" }}
        >
          Last week &darr;
        </Text> */}
        </View>
      )}

      {data?.length > 0 ? (
        <FlatList
          horizontal={horizontalList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ApplicationCard application={item} />}
          className=""
          data={data}
        />
      ) : (
        <View className="w-full flex flex-col items-center justify-center">
          <LottieView
            source={emptyLottie || empty}
            // duration={1000}
            autoPlay
            // ref={animation}
            style={{
              backgroundColor: "transparent",
              // alignSelf:'center',
              width: 150,
              height: 150,
            }}
          />
          <Text
            className="m-2 text-md font-[DMSans-SemiBold] text-center"
            style={{
              color: colors.primary_blue,
              textAlign: "center",
              lineHeight: 27,
            }}
          >
            {emptyMessage || "No advert at the moment"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ApplicationFlatList;

const styles = StyleSheet.create({});
