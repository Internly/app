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
  import React, { useState, useEffect, useContext } from "react";
  
  import { Ionicons } from "@expo/vector-icons";
  import { colors } from "../../../../../data/colors";
  import img from "../../../../../../assets/post-images/stripe-image.png";
  import ModalWrapperComponent from "../../../../../components/modal/ModalWrapper";
  import { AppContext } from "../../../../../context/AppContext";
  import axios from "axios";
  import * as WebBrowser from "expo-web-browser";
  
  const BankDetails = ({ navigation,router }) => {
    const { getData, setAppLoading, isApploading, user } = useContext(AppContext);
    const [showVerifyAccount, setShowVerifyAccount] = useState(false);
    const [accounts, setAccounts] = useState([]); // Add a state for accounts
    const [searchQuery, setSearchQuery] = useState("");
  
    const [formData, setFormData] = useState({
      value1: "",
      account_number: "",
      routing_number: "",
      bank_name: "",
      country: "",
      account_type: ""
    });
    
  
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
        console.log("Error fetching accounts:", error);
        setAppLoading(false);
      }
    };
  
    useEffect(() => {
      fetchUserAccounts();
    }, []);
  
  
    async function handleDeleteAccount(bank_id) {
      setAppLoading(true);
      const token = await getData("authToken");
  
      try {
        // Replace with your fetch logic
        const response = await axios.delete(
          `${baseUrl}/payments/account/bank/${bank_id}/delete`,
          {
            headers: {
              "x-auth-token": token
            }
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
        [key]: value
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
            BankDetails
          </Text>
          <View />
        </View>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
                        <TouchableOpacity
                onPress={() => {
                  setShowAccountDetails(true);
                  setcurrentAccount(bank);
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
                      {bank?.account_holder_name}
                    </Text>
                    <Text className="text-[12px] text-[#71727A] font-normal font-[DMSans-Regular]">
                      {bank?.bank_name}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  onPress={() => handleDeleteAccount(bank?.bank_id)}
                  name="trash-bin-outline"
                  color={"#8F9098"}
                  size={17}
                />
              </TouchableOpacity>
        </ScrollView>
  

  
        {/* Account Details modal */}
  
        <ModalWrapperComponent
          show={showAddAccountModal}
          customComponent={
            <View className="w-[90%] rounded-xl p-4 bg-white shadow-lg shadow-slate-500 min-h-[200px] items-center">
              <Text className="text-center my-2 text-[16px] font-[DMSans-Bold] text-[#1F2024]">
                Account details
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
              <TouchableOpacity
                onPress={()=>{}}
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
                  Verify
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  };
  
  export default BankDetails;
  
  const styles = StyleSheet.create({});
  