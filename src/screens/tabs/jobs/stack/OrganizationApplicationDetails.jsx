import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { styles } from "../../../../components/metrics/styles";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { colors } from "../../../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AppContext, useAppContext } from "../../../../context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalComponent from "../../../../components/modal/Modal";
import axios from "axios";
import InfoIcon from "../../../../../assets/svgs/info.svg";
import RatingStars from "../../../../components/ui/RatingStars";

const OrganizationApplicationDetails = ({ route }) => {
  const RejectModal = ModalComponent;
  const AcceptModal = ModalComponent;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const navigation = useNavigation();
  // console.log(route?.params?.params?.title)
  const { application } = route?.params;

  const student = application?.student;

  console.log(application, "application");
  const { setAppLoading, getData } = useAppContext();

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  // withdrawApplicationa
  const handleRejectApplication = async () => {
    try {
      setShowRejectModal(false);
      setAppLoading(true);
      const authToken = await getData("authToken");

      const response = await axios.patch(
        `${baseUrl}/applications/${application?._id}/reject`,
        {},
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      if (response.status) {
        setAppLoading(false);

        Alert.alert("Success", "Application rejected successfully!");
        navigation.goBack();
        // Optionally, you can refresh the applications list here
      } else {
        Alert.alert("Error", "Failed to reject application?.");
      }
    } catch (error) {
      setAppLoading(false);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to reject application."
      );
      console.error(
        "Error rejecting application:",
        error?.response?.data?.message || error
      );
    }
  };

  const handleAcceptApplication = async () => {
    try {
      setShowAcceptModal(false);
      setAppLoading(true);
      const authToken = await getData("authToken");

      const response = await axios.patch(
        `${baseUrl}/applications/${application?._id}/accept`,
        {},
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      if (response.status) {
        setAppLoading(false);
        navigation.goBack();
        Alert.alert("Success", "Application accepted successfully!");
        // Optionally, you can refresh the applications list here
      } else {
        Alert.alert("Error", "Failed to accept application?.");
      }
    } catch (error) {
      setAppLoading(false);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to accept application."
      );
      console.error(
        "Error accepting application:",
        error?.response?.data?.message || error
      );
    }
  };

  async function createChat() {
    const formData = new FormData();
    formData.append("participantAType", "Brand");
    formData.append("participantBType", "Influencer");
    formData.append("participantB", application?.student?._id);

    // Validate input fields
    if (!application?.student?._id || application?.student._id == undefined) {
      Alert.alert("Error", "Please pass student id");
      return;
    }

    // Send formData to server
    try {
      setAppLoading(true);
      const token = await getData("authToken");
      const response = await axios.post(
        `${baseUrl}/chats/brands/create`,
        {
          participantAType: "Brand",
          participantBType: "Influencer",
          participantB: application?.student?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      console.log("response", response.data);
      if (response.status === 201) {
        setAppLoading(false);

        Alert.alert("Success", "Chat created successfully!");
        navigation.navigate("Messages", {
          screen: "Chat",
          params: {
            user: application?.student,
            chatId: response?.data?.chatId,
          },
        });
      } else {
        setAppLoading(false);
        console.log(response.status);
        Alert.alert("Error", "Failed to create chat.");
      }
    } catch (error) {
      setAppLoading(false);
      console.log("Error creating chat:", error, error?.response?.status);
      if (error?.response?.status === 409) {
        return navigation.navigate("Messages", {
          screen: "Chat",
          params: {
            user: application?.student,
            chatId: error?.response?.data?.chatId,
          },
        });
      }
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create chat."
      );
    }
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      vertical
      style={{}}
      className="flex-1 bg-[#ffffff] "
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 40,
        paddingHorizontal: 5,
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <View className="p-5 px-4 w-full flex-row items-center gap-4 mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>

        <View>
          <Text
            style={{ color: "#272727" }}
            className="text-black font-[DMSans-Medium] text-xl flex-1"
          >
            Application Details
          </Text>
        </View>
      </View>

      {/* application info */}
      <View className="rounded-3xl overflow-auto w-[100%] px-4 flex flex-col items-start my-4">
        <View className="relative" style={{ width: "auto" }}>
          <View className="flex flex-row py-1 justify-between items-center  w-full">
            {/* student */}
            <View className="flex flex-row rounded-3xl items-center py-2 ">
              <Image
                className="rounded-3xl overflow-hidden"
                style={{
                  width: 40,
                  objectFit: "cover",
                  height: 40,
                }}
                source={{ uri: application?.student?.avatar }}
              />
              <View>
                <Text className="text-[#1F2024] font-[DMSans-Bold] text-[14px] mx-2">
                  {application?.student?.firstName}{" "}
                  {application?.student?.lastName}
                </Text>
                <Text className="text-[#71727A] font-[DMSans-Regular] text-[12px] mx-2">
                  {application?.student?.niche || "Skincare UGC Creator"}
                </Text>
              </View>
            </View>

            {/* rating */}
            {/* rating */}
            <View className=" flex-row items-center">
              <Text className="text-[12px] mx-2 text-gray-500 ">
                {application?.student?.rating || 0} (
                {application?.student?.reviews?.length || 0})
              </Text>
              <RatingStars rating={application?.student?.rating || 0} />
            </View>
          </View>
        </View>

        <Text
          style={{ ...styles.textbold }}
          className="text-black text-base font-[DMSans-Black] "
        >
          {application?.title ? application?.title : "-"}
        </Text>

        <View className="flex  py-1 justify-between items-start w-full">
          <Text className="text-gray-400 text-xs font-[DMSans-Medium] ">
            Submitted: {new Date(application?.submittedAt).toDateString()}
          </Text>
          <View className="flex flex-row items-center">
            <Text
              className={`text-xs font-[DMSans-Medium] ${
                application?.status === "submitted"
                  ? "text-blue-400"
                  : application?.status === "accepted"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              Status: {application?.status || "Unseen"}
            </Text>
          </View>
        </View>

        {/* cover letter */}
        <View>
          <View className="w-full my-2">
            <Text className="text-[#272727] font-[DMSans-Medium] text-[16px] ">
              Cover letter
            </Text>
            <Text
              style={styles.textmedium}
              className="text-xs mt-2 text-left text-gray-600"
            >
              {application?.coverLetter || `No cover letter`}
            </Text>
          </View>
        </View>
      </View>

      {/* navigation */}

      {application?.status == "accepted" ? (
        <View className="flex-row px-6 mt-3 w-screen mb-6 flex-wrap justify-between items-center">
          <View className="flex-row items-center w-[100%] bg-[#EAF2FF] p-2 rounded-xl my-2 ">
            <InfoIcon width={25} height={25} />
            <Text className="text-xs w-fit text-left ml-2  text-[#494A50] font-[DMSans-Regular]">
              This application has been accepted and this student is currently a
              part of your organization.
            </Text>
          </View>

          {/* <TouchableOpacity
            style={{
              backgroundColor: colors.primary_blue,
              width: "100%",
            }}
            onPress={() => {
              navigation?.navigate("HireDetails", {
                hire: { student },
                campaignId: application?.campaign,
              });
            }}
            className="px-10  py-[10] rounded-xl my-1"
          >
            <Text
              style={[styles.textbold]}
              className="text-base text-center text-white"
            >
              Manage student
            </Text>
          </TouchableOpacity> */}
        </View>
      ) : (
        <View className="flex-row px-6 mt-3 w-screen mb-6 flex-wrap justify-between items-center">
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary_blue,
              width: "100%",
            }}
            onPress={() => setShowAcceptModal(true)}
            className="px-10  py-[10] rounded-full ml-2"
          >
            <Text
              style={[styles.textbold]}
              className="text-base text-center text-white"
            >
              Hire student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowRejectModal(true)}
            className="px-10 bg-red-500 py-[10] rounded-full my-2 ml-2 w-full"
          >
            <Text
              style={[styles.textbold]}
              className="text-base text-center text-white"
            >
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <RejectModal
        show={showRejectModal}
        message={
          "You are about to ignore this application.\n Do you wish to continue?"
        }
        onAccept={handleRejectApplication}
        onClose={() => setShowRejectModal(false)}
      />
      <AcceptModal
        show={showAcceptModal}
        message={
          "You are about to accept this application and hire this student.\n Do you wish to continue?"
        }
        onAccept={handleAcceptApplication}
        onClose={() => setShowAcceptModal(false)}
      />
    </ScrollView>
  );
};

export default OrganizationApplicationDetails;
