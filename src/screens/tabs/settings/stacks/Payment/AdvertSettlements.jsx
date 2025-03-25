import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../data/colors";
import Withdrawal from "../../../../../../assets/svgs/withdrawal.svg";
import axios from "axios";
import { AppContext } from "../../../../../context/AppContext";

const SettlementHistory = ({ navigation }) => {
  const [settlements, setSettlements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSettlements, setFilteredSettlementss] = useState([]);
  const { getData, setAppLoading } = useContext(AppContext);
  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const fetchSettlements = async () => {
    setAppLoading(true);
    const token = await getData("authToken");

    try {
      // Replace with your fetch logic
      const response = await axios.get(
        `${baseUrl}/transactions/settlements/student`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      const { data } = response.data;

      console.log(response.data);
      const fetchedSettlements = data; // Fetch settlements data
      setSettlements(fetchedSettlements);
      console.log("settlements", settlements);
      setAppLoading(false);
    } catch (error) {
      console.error("Error fetching settlements:", error);
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (settlements.length > 0) {
      setFilteredSettlementss(
        settlements.filter(
          (settlement) =>
            settlement?.advert?.title
              ?.toLowerCase()
              .includes(lowercasedQuery) ||
            settlement?.organization?.name
              ?.toLowerCase()
              .includes(lowercasedQuery)
        )
      );
    }
  }, [searchQuery, settlements]);

  return (
    <View className="w-full flex-1 min-h-screen p-4 bg-white">
      <View className="py-5 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text className="text-black text-[14px] font-[DMSans-Bold]">
          Settlement History
        </Text>
        <View />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="rounded-full bg-[#F8F9FE] p-4 flex-row items-center justify-between flex">
          <Ionicons name="search" color={"black"} size={20} />
          <TextInput
            placeholder="Search settlements"
            placeholderTextColor={"#8F9098"}
            onChangeText={(value) => setSearchQuery(value)}
            className="text-[14px] min-w-[80%] text-black font-normal font-[DMSans-Regular]"
          />
        </View>

        {/* Existing Account List */}
        {filteredSettlements.map((settlement, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PaymentDetails", {
                payment: settlement,
                type: "settlement",
              })
            }
            key={i}
            className="p-4 bg-[#fafffc] rounded-lg justify-between my-2 flex-row flex items-center"
          >
            <View className="flex flex-row items-center">
              <View className="rounded-full bg-[#4785FF33] items-center justify-center p-2  ">
                <Withdrawal height={30} width={30} />
              </View>
              <View className="mx-2">
                <Text className="text-[14px] text-[#1F2024] font-normal font-[DMSans-Regular]">
                  {settlement?.advert?.title}
                </Text>
                <Text className="text-[12px] text-[#71727A] font-normal font-[DMSans-Regular]">
                  {settlement?.organization?.name}
                </Text>
              </View>
            </View>
            <Text className="text-[12px] text-[#5ce298] font-normal font-[DMSans-Regular]">
              +${settlement?.amount}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SettlementHistory;

const styles = StyleSheet.create({});
