import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { styles } from "../metrics/styles";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../data/colors";
import axios from "axios";
import img from "../../../assets/icons/Avatar.png";
import { AppContext } from "../../context/AppContext";
import ModalComponent from "../modal/Modal";

const ApplicationCard = ({ application }) => {
  const navigation = useNavigation();
  const { setAppLoading, getData, userType } = useContext(AppContext);
  const WithdrawModal = ModalComponent;
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  // console.log("authToken: ", authToken);
  const handleViewApplication = () => {
    navigation.navigate("ApplicationDetails", {
      application: application,
    });
  };

  console.log(" Application : ", application.organization?.avatar);

  const handleWithdrawApplication = async () => {
    try {
      setShowWithdrawModal(false);
      setAppLoading(true);
      const authToken = await getData("authToken");

      const response = await axios.delete(
        `${baseUrl}/applications/${application?._id}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      if (response.status) {
        setAppLoading(false);

        Alert.alert("Success", "Application withdrawn successfully!");
        // Optionally, you can refresh the applications list here
      } else {
        Alert.alert("Error", "Failed to withdraw application?.");
      }
    } catch (error) {
      setAppLoading(false);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to withdraw application."
      );
      console.error(
        "Error withdrawing application:",
        error?.response?.data?.message || error
      );
    }
  };

  return (
    <View className="border-b border-[#4784ff80] px-4  rounded-3xl my-2">
      <View className="flex-col my-2 items-start">
        {/* application content */}
        <View
          className="relative flex flex-row w-full items-start  py-2"
          style={{ width: "auto" }}
        >
          {/* organization image */}

          {userType === "organization" && application?.student?.avatar ? (
            <Image
              source={{ uri: application?.student?.avatar }}
              className="flex-row items-start justify-center rounded-full w-[40] h-[40]"
            />
          ) : (
            <Image
              source={img}
              className="flex-row items-start justify-center rounded-full w-[40] h-[40]"
            />
          )}

          <View className=" mx-2 w-full">
            {userType === "organization" && (
              <Text
                style={{ ...styles.textbold }}
                className="text-[#272727] text-lg font-[DMSans-SemiBold] "
              >
                {application?.student &&
                  `${application?.student?.firstName} ${application?.student?.lastName}`}
              </Text>
            )}

            <Text
              style={userType != "organization" && styles.textbold}
              className="text-[#272727] text-[11px] font-normal"
            >
              {application?.title || "application title"}{" "}
            </Text>

            {/* propsal meta-data */}

            <View className="flex  py-1 justify-between items-start my-1 w-full">
              <Text className="text-[#272727] text-[11px] font-[DMSans-Medium] ">
                Submitted: {new Date(application?.submittedAt).toDateString()}
              </Text>
              <View className="flex flex-row items-center">
                <Text
                  className={`text-[12px] my-2 font-[DMSans-Medium] ${
                    application?.status === "submitted"
                      ? "text-blue-400"
                      : application?.status === "accepted"
                      ? "text-[#28B446]"
                      : "text-red-400"
                  }`}
                >
                  Status: {application?.status || "unseen"}
                </Text>
              </View>
            </View>

            {/*  */}

            <View className="flex flex-row w-[85%] flex-wrap justify-between items-center">
              {/* view application button */}
              <TouchableOpacity
                onPress={handleViewApplication}
                className="py-1 px-4 w-[40%] rounded-full bg-[#4785FF]"
              >
                <Text className="text-white text-[12px] text-center font-[DMSans-SemiBold]">
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <WithdrawModal
        show={showWithdrawModal}
        message={
          "You are about to withdraw this application.\n This action is irreversible, do you wish to continue?"
        }
        onAccept={handleWithdrawApplication}
        onClose={() => setShowWithdrawModal(false)}
      />
    </View>
  );
};

export default ApplicationCard;
