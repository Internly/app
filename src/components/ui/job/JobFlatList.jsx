import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import JobCard from "../../cards/JobCard";
import LottieView from "lottie-react-native";
import empty from "../../../../assets/lottie/empty.json";
import { colors } from "../../../data/colors";

const JobFlatList = ({
  data,
  title,
  emptyLottie,
  emptyMessage,
  horizontalList,
  showHeader,
  status,
}) => {
  return (
    <View className="w-full flex-1 bg-white">
      {showHeader && (
        <View className="flex flex-row items-center my-2 p-2 justify-between w-[95%]">
          <Text
            className="text-black text-lg"
            style={{ fontFamily: "DMSans-Medium" }}
          >
            {title || "Campaigns"}
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
        <ScrollView>
          <FlatList
            horizontal={horizontalList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <JobCard status={status} advert={item} />}
            className="p-2"
            data={data}
          />
        </ScrollView>
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
              width: 200,
              height: 200,
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
            {emptyMessage || "No Advert at the moment"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default JobFlatList;

const styles = StyleSheet.create({});
