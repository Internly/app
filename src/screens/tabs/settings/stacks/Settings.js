import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../../data/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../../../../context/AppContext";
import ModalComponent from "../../../../components/modal/Modal";

const Settings = ({ navigation }) => {
  const { logOut, user } = useAppContext();
  const [showLogOutModal, setshowLogOutModal] = useState(false);

  const navigateToProfile = () => {
    navigation.navigate("UserProfile");
  };

  const navigateToSecurity = () => {
    navigation.navigate("Password");
  };

  const navigateToSubscription = () => {
    console.log("Subscription function");
  };

  const navigateToPayments = () => {
    navigation.navigate("Payments");
  };

  const navigateToSupport = () => {
    console.log("Support function");
  };

  const navigateToTermsAndPolicies = () => {
    console.log("Terms and Policies function");
  };

  const navigateToFeedback = () => {
    navigation.navigate("Feedback");
  };

  const handleLogout = async () => {
    await logOut();
    navigation.navigate("Signin");
  };

  const accountItems = [
    {
      icon: "person-outline",
      text: "My Profile",
      action: navigateToProfile,
    },
  ];

  const supportItems = [
    { icon: "help-outline", text: "Help & Support", action: navigateToSupport },
    {
      icon: "info-outline",
      text: "Terms and Policies",
      action: navigateToTermsAndPolicies,
    },
  ];

  const actionsItems = [
    { icon: "security", text: "Change Password", action: navigateToSecurity },
    {
      icon: "outlined-flag",
      text: "Feedback and Report",
      action: navigateToFeedback,
    },
    {
      icon: "logout",
      text: "Log out",
      action: () => setshowLogOutModal(true),
    },
  ];

  const renderSettingsItem = ({ icon, text, action, disabled }) => (
    <TouchableOpacity
      onPress={action}
      disabled={disabled}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 20,
        marginVertical: 10,
        // backgroundColor: "white",
      }}
      className="w-full justify-between px-4 py-4 rounded-full min-h-[40] bg-[#F7F7F7]"
    >
      <View className="flex flex-row items-center">
        <MaterialIcons name={icon} size={20} color={"#4785FF"} />
        <Text
          style={{
            marginLeft: 5,

            fontWeight: 600,
          }}
          className="text-[13px] text-[#272727] font-[DMSans-Medium] "
        >
          {text}{" "}
        </Text>
      </View>

      <MaterialIcons name={"chevron-right"} size={20} color={"black"} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
      }}
    >
      {/* header */}
      <View
        style={{
          // // marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          // backgroundColor: colors.primary_blue,
          width: "100%",
        }}
      >
        <View className="flex flex-row items-center">
          <Text
            style={{ color: "black" }}
            className="text-[20px] text-[#1F2024] font-[DMSans-Bold]"
          >
            Settings
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
          {user?.avatar ? (
            <Image
              source={{ uri: user?.avatar }}
              className="rounded-full w-[50] h-[50]"
            />
          ) : (
            <Image
              source={require("../../../../../assets/icons/Avatar.png")}
              className="rounded-full w-[50] h-[50]"
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ marginHorizontal: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Settings */}
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{ margin: 10 }}
            className="font-[DMSans-Medium] text-[#696767] text-[14px]"
          >
            Account
          </Text>
          <View
            style={{
              borderRadius: 12,
              // backgroundColor: "#C5FFF880",
            }}
          >
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Support and About settings */}

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{ margin: 10 }}
            className="font-[DMSans-Medium] text-[#696767] text-[14px]"
          >
            Support & About{" "}
          </Text>
          <View
            style={{
              borderRadius: 12,
              // marginVertical:10,
              // backgroundColor: "#c5fff880",
            }}
          >
            {supportItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Cache & Cellular */}
        {/* Actions Settings */}

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{ margin: 10 }}
            className="font-[DMSans-Medium] text-[#696767] text-[14px]"
          >
            Actions
          </Text>
          <View
            style={{
              borderRadius: 12,
              // backgroundColor: "#C5FFF880",
            }}
          >
            {actionsItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>
        <ModalComponent
          show={showLogOutModal}
          title={"log out"}
          message={
            "Are you sure you want to log out? You'll need to login again to use the app."
          }
          onAccept={handleLogout}
          onClose={() => setshowLogOutModal(false)}
          cancelText={"Cancel"}
          acceptText={"Log out"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
