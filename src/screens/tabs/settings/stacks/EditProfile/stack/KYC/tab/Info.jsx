import React, { useCallback, useContext, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useStripeIdentity } from "@stripe/stripe-identity-react-native";
import { AppContext } from "../../../../../../../../context/AppContext";
import kycLottie from "../../../../../../../../../assets/lottie/kyc.json";
import logo from "../../../../../../../../../assets/icons/appIcon.png";
import axios from "axios";
import { StyleSheet } from "react-native";
import { colors } from "../../../../../../../../data/colors";

const KycOnboard = () => {
  const navigate = useNavigation();
  const { getData, user } = useContext(AppContext);
  const [appLoading, setAppLoading] = useState(false);
  const animation = useRef(null);
  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  useFocusEffect(
    useCallback(() => {
      animation.current.play();
    }, [])
  );

  async function fetchVerificationSessionParams() {
    const token = await getData("authToken");
    console.log(" fetching ...");
    try {
      setAppLoading(true);
      const response = await axios.get(`${baseUrl}/kyc/initiate`, {
        headers: { "x-auth-token": token },
      });
      setAppLoading(false);
      console.log(response);
      return response.data;
    } catch (error) {
      setAppLoading(false);
      console.error(
        error?.response?.data?.message,
        error?.response?.data?.error
      );
      Alert.alert(
        "KYC Error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }

  const fetchOptions = async () => {
    const response = await fetchVerificationSessionParams();
    console.log(response, " fetch");
    return {
      sessionId: response.id,
      ephemeralKeySecret: response.ephemeral_key_secret,
      organizationLogo: Image.resolveAssetSource(logo),
    };
  };

  const { present } = useStripeIdentity(fetchOptions);

  const handlePress = () => {
    setAppLoading(true);

    if (!user?.kycCompleted && user?.kycStatus !== "pending") {
      console.log(" calling present");
      present();
    }
    setAppLoading(true);
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.KycOnboard}>
          <LottieView
            source={kycLottie}
            autoPlay
            ref={animation}
            style={{
              backgroundColor: "transparent",
              width: 200,
              height: 200,
            }}
          />
          <View style={styles.textHolder}>
            <Text style={{ color: "black", ...styles.text }}>
              Complete your KYC registration
            </Text>
            <Text style={{ ...styles.subtext, textAlign: "center" }}>
              Your data is secure. Please read our privacy policy.
            </Text>
          </View>
          <TouchableOpacity
            onPress={handlePress}
            className="border-gray-200 w-[70vw] my-2 border-2 rounded-[12px] flex flex-row py-2 p-4 items-center justify-between"
          >
            <View className="flex flex-row items-center">
              <FontAwesome
                name={
                  user?.kycCompleted
                    ? "check-circle-o"
                    : user?.kycStatus === "pending"
                    ? "clock-o"
                    : "file-o"
                }
                size={14}
              />
              <Text className="font-[DMSans-SemiBold] text-sm px-4">
                {user?.kycCompleted
                  ? "KYC verification completed"
                  : user?.kycStatus === "pending"
                  ? "KYC verification pending"
                  : "Verify documents"}
              </Text>
            </View>
            <FontAwesome name="arrow-right" size={14} color={"black"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KycOnboard;

const styles = StyleSheet.create({
  KycOnboard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  textHolder: {
    width: "90%",
    padding: 20,
    // marginTop: 20,
  },
  text: {
    // color:"black",
    fontSize: 20,
    margin: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  subtext: {
    color: "#524B6B",
    width: "90%",
    fontSize: 14,
    marginTop: 20,
  },
  nextArrow: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.primary_mint,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
