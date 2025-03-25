import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../data/colors";
import img from "../../../../../../assets/post-images/stripe-image.png";
import ModalWrapperComponent from "../../../../../components/modal/ModalWrapper";
import { AppContext } from "../../../../../context/AppContext";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";

const Payments = ({ navigation }) => {
  const { getData, setAppLoading, isApploading, user } = useContext(AppContext);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accounts, setAccounts] = useState([]); // Add a state for accounts
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [ipAddress, setIpAddress] = useState();

  const [formData, setFormData] = useState({
    account_holder_name: "",
    account_number: "",
    routing_number: "",
    bank_name: "",
    country: "",
    account_type: "",
  });

  const [accountLink, setAccountLink] = useState("");

  const formFields = [
    {
      label: "Account Name",
      formDataKey: "account_holder_name",
    },
    {
      label: "Account Number",
      formDataKey: "account_number",
    },
    {
      label: "Country",
      formDataKey: "country",
    },
    {
      label: "Routing Number",
      formDataKey: "routing_number",
    },
    {
      label: "Bank Name",
      formDataKey: "bank_name",
    },
    {
      label: "Account Type",
      formDataKey: "account_type",
    },
  ];

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
          "x-auth-token": token,
        },
      });

      const { data } = response.data;
      const fetchedAccounts = data; // Fetch transactions data
      setAccounts(fetchedAccounts);
      setAppLoading(false);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  async function handleAddAccount() {
    setAppLoading(true);
    const token = await getData("authToken");
    formData.ip = ipAddress;

    if (
      !formData.account_holder_name ||
      !formData.account_number ||
      !formData.bank_name ||
      !formData.country
    ) {
      return Alert.alert("Add account error", " Fill all required fields");
    }

    try {
      // Replace with your fetch logic
      const response = await axios.post(
        `${baseUrl}/payments/account/bank/add`,
        formData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setAppLoading(false);
      setShowAddAccountModal(false);
      fetchUserAccounts();
    } catch (error) {
      console.error("Error adding new account:", error?.response.data);
      setAppLoading(false);
      Alert.alert(
        error?.response?.data?.message || "failed to add new account"
      );
    }
  }

  async function handleDeleteAccount(bank_id) {
    setAppLoading(true);
    const token = await getData("authToken");

    try {
      // Replace with your fetch logic
      const response = await axios.delete(
        `${baseUrl}/payments/account/bank/${bank_id}/delete`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setAppLoading(false);
      fetchUserAccounts();
    } catch (error) {
      console.error("Error adding new account:", error?.response.data);
      setAppLoading(false);
      Alert.alert(error?.response?.data?.message || "failed to delete account");
    }
  }

  const stripeOnboard = async (accountLink) => {
    try {
      let result = await WebBrowser.openBrowserAsync(accountLink);
      // setResult(result);
      console.log("expo browaer result : ", result);
    } catch (error) {
      console.log(" web browser error : ", error);
    }
  };

  async function createStripeWallet() {
    setAppLoading(true);
    const token = await getData("authToken");

    try {
      // Replace with your fetch logic
      const response = await axios.post(
        `${baseUrl}/payments/account/wallet/add`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setAccountLink(response.data.accountLink);
      console.log(" account link : ", response.data.accountLink);
      setAppLoading(false);

      stripeOnboard(response.data.accountLink);
    } catch (error) {
      console.error("Error adding new account:", error?.response.data);
      setAppLoading(false);
      Alert.alert(
        error?.response?.data?.message || "failed to add new account"
      );
    }
  }

  const getPublicIpAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = response.data.ip;
      setIpAddress(ipAddress);
      console.log("Public IP Address:", ipAddress);
      return ipAddress;
    } catch (error) {
      console.error("Error getting IP address:", error);
      return null;
    }
  };

  function handleFormDataChange(key, value) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
    getPublicIpAddress();
  }, []);

  return (
    <View className="w-full flex-1 min-h-screen p-4 pb-[50] bg-white">
      <View className="py-5 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text className="text-black text-[14px] font-[DMSans-Bold]">
          Payments
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
            <View className="p-4 bg-[#F8F9FE] rounded-lg justify-between my-2 flex-row flex items-center">
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
              <Ionicons
                onPress={() => handleDeleteAccount(item?.bank_id)}
                name="trash-bin-outline"
                color={"#8F9098"}
                size={17}
              />
            </View>
          )}
          ListEmptyComponent={<Text>No accounts found</Text>}
        />

        <View className="w-full items-center">
          <TouchableOpacity
            onPress={() => setShowAddAccountModal(true)}
            className="border border-[#4785FF] w-[200px] p-4 my-4 rounded-full bg-transparent items-center justify-center"
          >
            <Text className="text-[12px] text-[#4785FF] font-[DMSans-Regular]">
              Add Account
            </Text>
          </TouchableOpacity>
        </View>
        {/* {user.stripe_connected_acc_verified ? (
 
        ) : (
          <View className="w-full items-center">
            <TouchableOpacity
              onPress={() => createStripeWallet()}
              className="border border-[#4785FF] w-[200px] p-4 my-4 rounded-full bg-transparent items-center justify-center"
            >
              <Text className="text-[12px] text-[#4785FF] font-[DMSans-Regular]">
                {user.stripe_connected_acc
                  ? "Complete wallet set up"
                  : "Create wallet"}
              </Text>
            </TouchableOpacity>
          </View>
        )} */}

        {/* Navigations */}
        <TouchableOpacity
          onPress={() => navigation.navigate("WithdrawalHistory")}
          className="p-4 rounded-lg justify-between my-4 flex-row flex items-center bg-[#F7F7F7]"
        >
          <Text className="text-[14px] text-[#1F2024] font-normal font-[DMSans-Regular]">
            See withdrawal History
          </Text>
          <Ionicons name="chevron-forward" color={"#8F9098"} size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SettlementHistory")}
          className="p-4 rounded-lg justify-between my-2 flex-row flex items-center bg-[#F7F7F7]"
        >
          <Text className="text-[14px] text-[#1F2024] font-normal font-[DMSans-Regular]">
            See advert settlement history
          </Text>
          <Ionicons name="chevron-forward" color={"#8F9098"} size={20} />
        </TouchableOpacity>
      </ScrollView>

      <ModalWrapperComponent
        show={showAddAccountModal}
        customComponent={
          <View className="w-[90%] rounded-xl p-4 bg-white shadow-lg shadow-slate-500 min-h-[200px] items-center">
            <Text className="text-center my-2 text-[16px] font-[DMSans-Bold] text-[#1F2024]">
              Add Account
            </Text>
            <Text className="text-center my-2 text-[12px] text-[#71727A]">
              Fill the account information below
            </Text>

            {formFields.map(({ formDataKey, label }, i) => (
              <View className="w-full min-w-[100%]" key={i}>
                <Text className="text-left my-2 text-[13px] text-[#202020]">
                  {label}
                </Text>
                <TextInput
                  keyboardType={
                    formDataKey === "account_number" ? "numeric" : "default"
                  }
                  className="bg-[#F5F7F9] rounded-sm p-4"
                  value={formData[formDataKey]}
                  onChangeText={(value) =>
                    handleFormDataChange(formDataKey, value)
                  }
                />
              </View>
            ))}

            <View className="flex-row items-center justify-between gap-4 my-4">
              <TouchableOpacity
                onPress={() => setShowAddAccountModal(false)}
                className={`border flex-1 items-center justify-center  p-4 border-[${colors.primary_blue}] rounded-lg bg-transparent`}
              >
                <Text
                  className={`text-[${colors.primary_blue}] text-[12px] font-[DMSans-SemiBold] `}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddAccount}
                disabled={isApploading}
                className={`p-4 flex-1 ${
                  isApploading && " opacity-20"
                } items-center justify-center bg-[${
                  colors.primary_blue
                }] rounded-lg`}
              >
                <Text
                  className={`text-white text-[12px] font-[DMSans-SemiBold] `}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({});
