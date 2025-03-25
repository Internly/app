import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../../../../../../../data/colors";
import { Vectors } from "../../../../../../../../../assets/assets";
import { AppContext } from "../../../../../../../../context/AppContext";
import socialLottie from "../../../../../../../../../assets/lottie/socialVerification.json";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

const SocialOnboard = () => {
  const navigate = useNavigation();
  const { storeData, getData, setAppLoading } = useContext(AppContext);
  const [socialsData, setSocialsData] = useState();
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");
  const animation = useRef(null);

  useFocusEffect(
    useCallback(() => {
      animation.current.play();
    }, [])
  );
  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const getInfluencerSocials = async () => {
    setAppLoading(true);
    const token = await getData("authToken");

    try {
      const response = await axios.get(`${baseUrl}/socials/student_socials`, {
        headers: {
          "x-auth-token": token,
        },
      });

      const { data } = response.data;
      setSocialsData(data);
      setAppLoading(false);
    } catch (error) {
      console.error("Error fetching socials:", error);
      setAppLoading(false);
    }
  };

  const initiateOAuth = (platform) => {
    setWebViewUrl(`${baseUrl}/socials/add/${platform}`);
    setWebViewVisible(true);
  };

  const handleWebViewNavigationStateChange = (event) => {
    if (event.url.startsWith("yourapp://auth/callback")) {
      setWebViewVisible(false);
      const { queryParams } = Linking.parse(event.url);
      const token = queryParams.token;

      if (token) {
        Alert.alert("Verification complete");
        storeData("socialAuthToken", token);
      } else {
        Alert.alert("OAuth failed");
      }
    }
  };

  useEffect(() => {
    getInfluencerSocials();
  }, []);

  const socials = [
    { text: "Facebook", icon: "facebook", platform: "facebook" },
    { text: "Twitter", icon: "twitter", platform: "twitter" },
    { text: "Instagram", icon: "instagram", platform: "instagram" },
  ];

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.SocialOnboard} className=" h-screen items-center">
          <LottieView
            source={socialLottie}
            duration={5000}
            autoPlay
            ref={animation}
            style={{
              backgroundColor: "transparent",
              width: 100,
              height: 100,
            }}
          />
          <View style={styles.textHolder}>
            <Text style={{ color: "black", ...styles.text }}>
              Link your Social media accounts
            </Text>
            <Text style={{ ...styles.subtext, textAlign: "center" }}>
              Your data is secure. Please read our privacy policy.
            </Text>
          </View>

          <View>
            {socials.map(({ text, icon, platform }, i) => (
              <SocialOptionCard
                onPress={() => initiateOAuth(platform)}
                key={i}
                text={text}
                icon={icon}
              />
            ))}
          </View>

          {webViewVisible && (
            <View style={styles.webViewContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setWebViewVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <WebView
                source={{ uri: webViewUrl }}
                onNavigationStateChange={handleWebViewNavigationStateChange}
                style={{ marginTop: 20 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SocialOnboard;

function SocialOptionCard({ text, icon, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border-gray-200 w-[70vw] my-2 border-2 rounded-[12px] flex flex-row py-2 p-4 items-center justify-between"
    >
      <View className="flex flex-row items-center">
        <FontAwesome name={icon} size={14} />
        <Text className="font-[DMSans-SemiBold] text-sm px-4">{text}</Text>
      </View>
      <FontAwesome name="arrow-right" size={14} color={"black"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  SocialOnboard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  textHolder: {
    width: "90%",
    padding: 20,
  },
  text: {
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
  webViewContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});
