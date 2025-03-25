import {
  ImageBackground,
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
import Swiper from "react-native-swiper";
import { slide } from "../../data/onboarding";
import { Vectors } from "../../../assets/assets";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../data/colors";
import { AppContext } from "../../context/AppContext";
const Onboarding = () => {
  const navigate = useNavigation();
  const { storeData, getData, setAppLoading } = useContext(AppContext);
  const [userStatus, setUserStatus] = useState(null);

  useFocusEffect(
    useCallback(() => {
      checkUserStatus();
    }, [])
  );

  const checkUserStatus = async () => {
    setAppLoading(true);
    const status = await getData("userStatus");
    setUserStatus(status);
    if (status === "old") {
      setAppLoading(false);

      navigate.navigate("Signin");
    } else {
      storeData("userStatus", "new");
      setAppLoading(false);
    }
  };

  const getStarted = () => {
    storeData("userStatus", "old");
    navigate.navigate("Signup");
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Swiper autoplay loop speed={1} dotColor="white" dotStyle={{width:5,height:5}}>
          {slide.map((slider, index) => {
            return (
              <View style={styles.onboarding} key={index}>
                <ImageBackground
                  className="absolute top-0 h-screen w-screen"
                  src={slider.bg_image}
                />
                <View style={styles.textHolder}>
                  <Text style={{ color: "white", ...styles.text }}>
                    {slider.text}
                  </Text>
                  <Text style={styles.subtext}>{slider.subtext}</Text>
                  {index == slide.length - 1 && (
                    <TouchableOpacity
                      onPress={getStarted}
                      style={styles.nextArrow}
                    >
                      <Text style={{ color: "white", marginHorizontal: 10 }}>
                        Get started
                      </Text>
                      <Vectors.ArrowRight width={"16px"} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </Swiper>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  onboarding: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#F9F9F9",
    paddingVertical: 50,
  },
  textHolder: {
    width: "100%",
    padding: 20,
    // marginTop: 20,
    marginBottom: 40,
    display:"flex",
    alignItems: "center",
    justifyContent: "center",

  },
  text: {
    // color:"black",
    fontSize: 35,
    fontWeight: "700",
    textAlign: "center",
  },
  subtext: {
    color: "white",
    width: "70%",
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
  },
  nextArrow: {
    position: "relative",
    width:"70%",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    borderRadius: 5,
    padding: 10,
    backgroundColor: colors.primary_purple,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
