import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";
import Image from 'react-native-remote-svg'
const AnalyticsChart = () => {
  const screenWidth = Dimensions.get("window").width * 0.9;

  const data = [
    { value: 1.0, label: "8:00am" },
    { value: 20, label: "10:00am" },
    { value: 2.0, label: "12:00pm" },
    { value: 1.5, label: "1:00pm" },
    { value: 3.0, label: "3:00pm" },
    { value: 12.0, label: "8:00am" },
    { value: 25, label: "10:00am" },
    { value: 2.0, label: "12:00pm" },
    { value: 1.5, label: "1:00pm" },
    { value: 3.0, label: "3:00pm" },
  ];

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "#151515",
        marginVertical: 10,
        borderRadius: 10,
        // width: "100%",
      }}
    >
      <View className="p-2">
        <Text style={{ color: "white", fontSize: 12, marginBottom: 5 }}>
          Analytics
        </Text>
        <View className="flex flex-row items-center w-full justify-between">
          <Text style={{ color: "white", fontSize: 25, fontWeight: "700" }}>
            4.875k
          </Text>
          <Image
            source={{
              uri: "https://res.cloudinary.com/ddgiqvgov/image/upload/v1726868541/app_icons/Activity_-_Iconly_Pro_z2sa6d.svg",
            }}
            alt="analytics icon"
            style={{ width: 25, height: 25 }}
          />
        </View>
      </View>

      <View className="w-full ml-[-40] pb-2">
        <LineChart
          data={data}
          className={`m-0 p-0`}
          height={50}
          width={screenWidth}
          isAnimated
          curved
          xAxisLabelTextStyle={{ color: "#C7D4E1", fontSize: 7, padding: 4 }}
          lineGradient
          lineGradientId="ggrd" // same as the id passed in <LinearGradient> below
          lineGradientComponent={() => {
            return (
              <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={"#060B10"} />
                <Stop offset="0.01" stopColor={"#7B66FF"} />
                <Stop offset="0.02" stopColor={"#5FBDFF"} />
                <Stop offset="0.5" stopColor={"#C5FFF8"} />
                <Stop offset="0.4" stopColor={"#C5FFF8"} />
                <Stop offset="1" stopColor={"#96EFFF"} />
              </LinearGradient>
            );
          }}
          spacing={44}
          initialSpacing={0}
          hideDataPoints
          hideAxesAndRules
          onDataPointClick={(item) => {
            // Handle data point click if necessary
            console.log(item);
          }}
          renderTooltip={(item) => (
            <View
              style={{
                backgroundColor: "purple",
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>{item.value}k</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default AnalyticsChart;
