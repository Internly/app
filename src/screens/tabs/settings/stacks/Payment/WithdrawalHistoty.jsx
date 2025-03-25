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

const WithdrawalHistoty = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const { getData, setAppLoading } = useContext(AppContext);
  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const fetchTransaction = async () => {
    setAppLoading(true);
    const token = await getData("authToken");

    try {
      // Replace with your fetch logic
      const response = await axios.get(`${baseUrl}/transactions/student`, {
        headers: {
          "x-auth-token": token,
        },
      });

      const { data } = response.data;
      const fetchedTransactions = data; // Fetch transactions data
      setTransactions(fetchedTransactions);
      console.log(transactions);
      setAppLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (transactions.length > 0) {
      setFilteredTransactions(
        transactions.filter(
          (transaction) =>
            transaction?.bank?.name?.toLowerCase().includes(lowercasedQuery) ||
            transaction?.bank_name?.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  }, [searchQuery, transactions]);

  return (
    <View className="w-full flex-1 min-h-screen p-4 bg-white">
      <View className="py-5 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text className="text-black text-[14px] font-[DMSans-Bold]">
          Withdrawal History
        </Text>
        <View />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="rounded-full bg-[#F8F9FE] p-4 flex-row items-center justify-between flex">
          <Ionicons name="search" color={"black"} size={20} />
          <TextInput
            placeholder="Search transactions"
            placeholderTextColor={"#8F9098"}
            onChangeText={(value) => setSearchQuery(value)}
            className="text-[14px] min-w-[80%] text-black font-normal font-[DMSans-Regular]"
          />
        </View>

        {/* Existing Account List */}
        {filteredTransactions.map((transaction, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PaymentDetails", { payment: {} })
            }
            key={i}
            className="p-4 bg-[#FFFBFA] rounded-lg justify-between my-4 flex-row flex items-center"
          >
            <View className="flex flex-row items-center">
              <View className="rounded-full bg-[#4785FF33] items-center justify-center p-2  ">
                <Withdrawal height={30} width={30} />
              </View>
              <View className="mx-2">
                <Text className="text-[14px] text-[#1F2024] font-normal font-[DMSans-Regular]">
                  Paypal
                </Text>
                <Text className="text-[12px] text-[#71727A] font-normal font-[DMSans-Regular]">
                  Withdrawal
                </Text>
              </View>
            </View>
            <Text className="text-[12px] text-[#E25C5C] font-normal font-[DMSans-Regular]">
              -${25}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default WithdrawalHistoty;

const styles = StyleSheet.create({});
