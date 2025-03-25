import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../data/colors";
import img from "../../../../../../assets/post-images/stripe-image.png";
import ModalWrapperComponent from "../../../../../components/modal/ModalWrapper";
import { AppContext } from "../../../../../context/AppContext";
import axios from "axios";
import { err } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";

const Withdrawal = ({ navigation }) => {
  const { getData, setAppLoading, isAppLoading, user } = useContext(AppContext);
  const [showAddAmountModal, setShowAddAmountModal] = useState(false);
  const [accounts, setAccounts] = useState([]); // Add a state for accounts
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [amount, setAmount] = useState(0);
  const [selectedBank, setSelectedBank] = useState();

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (accounts.length > 0) {
      setFilteredAccounts(
        accounts.filter(
          (account) =>
            account?.account_holder_name
              ?.toLowerCase()
              .includes(lowercasedQuery) ||
            account?.bank_name?.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  }, [searchQuery, accounts]);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const fetchUserAccounts = async () => {
    setAppLoading(true);
    const token = await getData("authToken");

    try {
      // Replace with your fetch logic
      const response = await axios.get(`${baseUrl}/payments/bank_accounts`, {
        headers: {
          "x-auth-token": token
        }
      });

      const { data } = response.data;
      const fetchedAccounts = data; // Fetch transactions data
      setAccounts(fetchedAccounts);
      setAppLoading(false);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAppLoading(false);
      Alert.alert(error?.response?.data?.message || "failed to fetch accounts");
    }
  };

  async function initiatePayout() {
    setAppLoading(true);
    const token = await getData("authToken");

    if (Number(amount) <= 0) {
      setAppLoading(false);

      return Alert.alert("Amount must be greater than 0");
    }

    if (Number(amount) > user.walletBalance) {
      setAppLoading(false);

      return Alert.alert("Insufficient funds in user wallet");
    }

    try {
      const response = await axios.post(
        `${baseUrl}/payments/payout/initiate`,
        {
          amount,
          externalAccountId: selectedBank?.bank_id
        },
        {
          headers: {
            "x-auth-token": token
          }
        }
      );
      setAppLoading(false);
      setShowAddAmountModal(false);
    } catch (error) {
      console.error("Error  initiating payput:", error);
      setAppLoading(false);
      Alert.alert(
        "Withdrawal error",
        error?.response?.data?.message || "failed to initiate"
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUserAccounts();
    }, [])
  );

  return (
    <View className="w-full flex-1 min-h-screen p-4 pb-[50] bg-white">
      <View className="py-5 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text className="text-black text-[14px] font-[DMSans-Bold]">
          Withdraw money
        </Text>
        <View />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Search Bar */}
        <View className="rounded-full bg-[#F8F9FE] p-4 my-4 flex-row items-center justify-between flex">
          <Ionicons name="search" color={"black"} size={20} />
          <TextInput
            placeholder="Search Account"
            placeholderTextColor={"#8F9098"}
            onChangeText={(text) => setSearchQuery(text)}
            className="text-[14px] min-w-[80%] text-black font-normal font-[DMSans-Regular]"
          />
        </View>

        <FlatList
          data={filteredAccounts}
          keyExtractor={(item) => item?._id?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedBank(item);
                setShowAddAmountModal(true);
              }}
              className="p-4 bg-[#F8F9FE] rounded-lg justify-between my-2 flex-row flex items-center"
            >
              <View className="flex flex-row items-center">
                <Image
                  source={img}
                  resizeMode="cover"
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                />
                <View className="mx-2">
                  <Text className="text-[14px] text-[#1F2024] font-normal font-[DMSans-Regular]">
                    {item?.account_holder_name}
                  </Text>
                  <Text className="text-[12px] text-[#71727A] font-normal font-[DMSans-Regular]">
                    {item?.bank_name}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" color={"#8F9098"} size={20} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No accounts found</Text>}
        />

        {/* Add New Account */}
        <View className="w-full items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("Payments")}
            className="border border-[#4785FF] w-[200px] p-4 my-4 rounded-full bg-transparent items-center justify-center"
          >
            <Text className="text-[12px] text-[#4785FF] font-[DMSans-Regular]">
              Add Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalWrapperComponent
        show={showAddAmountModal}
        customComponent={
          <View className="w-full h-screen items-center justify-center">
            <View className="w-4/5 rounded-xl p-4 bg-white shadow-lg shadow-slate-500 min-h-[200px] items-center">
              <Text className="text-center my-2 text-[16px] font-[DMSans-Bold] text-[#1F2024]">
                Enter amount
              </Text>
              <Text className="text-center my-2 text-[12px] text-[#71727A]">
                How much do you wish to withdraw?
              </Text>

              <View className="w-full min-w-[100%]">
                <Text className="text-left my-2 text-[13px] text-[#202020]">
                  Amount($)
                </Text>
                <TextInput
                  keyboardType={"numeric"}
                  className="bg-[#F5F7F9] rounded-sm p-4"
                  value={amount}
                  onChangeText={(value) => setAmount(value)}
                  placeholder="Enter amount"
                />
              </View>

              {amount <= 0 ||
                (amount > user?.walletBalance && (
                  <Text className="text-red-500 text-[10px] font-normal">
                    Amount must be greater and should not be more than{" "}
                    {user?.walletBalance}
                  </Text>
                ))}

              <View className="flex-row items-center justify-between gap-4 my-4">
                <TouchableOpacity
                  onPress={() => setShowAddAmountModal(false)}
                  className={`border flex-1 items-center justify-center  p-4 border-[${colors.primary_blue}] rounded-lg bg-transparent`}
                >
                  <Text
                    className={`text-[${colors.primary_blue}] text-[12px] font-[DMSans-SemiBold] `}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={initiatePayout}
                  disabled={isAppLoading}
                  className={`p-4 flex-1 ${
                    isAppLoading && " opacity-20"
                  } items-center justify-center bg-[${
                    colors.primary_blue
                  }] rounded-lg`}
                >
                  <Text
                    className={`text-white text-[12px] font-[DMSans-SemiBold] `}
                  >
                    Withdraw
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default Withdrawal;

const styles = StyleSheet.create({});
