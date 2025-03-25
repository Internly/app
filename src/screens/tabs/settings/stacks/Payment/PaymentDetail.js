import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";
import React, { useState, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../data/colors";
import Pending from "../../../../../../assets/svgs/pending.svg";
import Download from "../../../../../../assets/svgs/download.svg";

const PaymentDetails = ({ navigation, route }) => {
  // this payment detail will be used for both settlements and withdrawals
  const { payment } = route.params;

  function handleAddAccount() {}

  return (
    <View className="w-full flex-1 min-h-screen p-4 bg-white">
      <View className="py-5 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text className="text-black text-[14px] font-[DMSans-Bold]">
          Payment details
        </Text>
        <View />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full p-4 items-center">
          <Text className=" text-[13px] my-2  text-[#242424]  font-[DMSans-SemiBold]  ">
            {payment?.text || "Fashion Walkaway Model"}
          </Text>
          <Text className="text-[11px] my-2  text-[#707070]  font-[DMSans-Regular]">
            {payment?.subtext || "Versace Inc."}
          </Text>

          {/* price */}
          <Text
            className="text-[26px] my-2 text-[#28B446] font-[DMSans-SemiBold]"
            style={{}}
          >
            +${payment?.price || "400"}
          </Text>

          {/* Date */}

          <Text
            className="text-[11px] my-2 text-[#707070] font-[DMSans-Regular]"
            style={{}}
          >
            Sun, 13th Oct.
          </Text>
          {/* status */}
          <View className="flex-row items-center">
            {/*  */}
            <Pending height={15} width={15} />
            <Text
              className="text-[9px] my-2 mx-1 text-[#707070] font-[DMSans-Regular]"
              style={{}}
            >
              Pending
            </Text>
          </View>

          <Text
            className="text-[12px] my-2 text-left self-start text-[#707070] font-[DMSans-Regular]"
            style={{}}
          >
            Details
          </Text>

          {/* details */}
          <View className=" w-full rounded-lg bg-[#F8F8F8] p-4">
            <View className="flex-row items-center justify-between w-full">
              <Text
                className="text-[11px] my-2 mx-1 text-[#707070] font-[DMSans-Regular]"
                style={{}}
              >
                Transaction ID
              </Text>
              <Text
                className="text-[11px] my-2 mx-1 text-[#707070] font-[DMSans-Regular]"
                style={{}}
              >
                GU68 7099 3233 9586 6589
              </Text>
            </View>

            <View className="flex-row items-center justify-between w-full">
              <Text
                className="text-[11px] my-2 mx-1 text-[#707070] font-[DMSans-Regular]"
                style={{}}
              >
                Recipient name
              </Text>
              <Text
                className="text-[11px] my-2 mx-1 text-[#707070] font-[DMSans-Regular]"
                style={{}}
              >
                Ayo Faluyi
              </Text>
            </View>
          </View>

          {/* download */}
          <View className=" w-full rounded-lg my-2 bg-[#F8F8F8] p-4">
            <View className="flex-row items-center justify-between w-full">
              <Text
                className="text-[11px] my-2 mx-1 text-[#707070] font-[DMSans-Regular]"
                style={{}}
              >
                Reciept
              </Text>

              <View className=" flex-row items-center">
                <Text
                  className="text-[11px] my-2 mx-1 text-[#4785FF] font-[DMSans-Regular]"
                  style={{}}
                >
                  Download
                </Text>
                <Download height={20} width={20} className="ml-2" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({});

// settlem
