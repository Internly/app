import {
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
import { colors } from "../../../data/colors";
import { Vectors } from "../../../../assets/assets";
import { AppContext } from "../../../context/AppContext";
import shieldLottie from "../../../../assets/lottie/shield.json";

const Welcome = () => {
  const navigate = useNavigation();
  const { storeData, getData } = useContext(AppContext);
  const [userStatus, setUserStatus] = useState(null);
  const animation = useRef(null);

  useFocusEffect(
    useCallback(() => {
      animation.current.play();
    }, [])
  );

  const getStarted = () => {
    navigate.navigate("UploadAvatar");
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={styles.Welcome}
          className="flex flex-col h-screen items-center"
        >
          <LottieView
            source={shieldLottie}
            duration={1000}
            loop={false}
            autoPlay
            ref={animation}
            style={{
              backgroundColor: "transparent",
              // alignSelf:'center',
              width: 200,
              height: 200,
            }}
          />
          <View style={styles.textHolder}>
            <Text style={{ color: "black", ...styles.text }}>
              Set up your profile, to continue.
            </Text>
            <Text
              style={{ color: "black", textAlign: "center", width: "100%" }}
            >
              Create a solid profile with accurate information.
            </Text>
            <Text style={{ ...styles.subtext, textAlign: "center" }}>
              Your data is secure. Please read our privacy policy.
            </Text>
          </View>

          <TouchableOpacity onPress={getStarted} style={styles.nextArrow}>
            <Text style={{ color: "white", marginHorizontal: 10 }}>
              Create now
            </Text>
            <Vectors.ArrowRight width={"16px"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  Welcome: {
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
    backgroundColor: colors.primary_blue,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
