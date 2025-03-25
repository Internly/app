import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { styles } from "../../../../components/metrics/styles";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { AppContext, useAppContext } from "../../../../context/AppContext";
import ModalComponent from "../../../../components/modal/Modal";
import { getTimeDifference } from "../../../../components/cards/JobCard";
import axios from "axios";

const AdvertDetails = ({ route }) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [hasExistingApplication, sethasExistingApplication] = useState(false);
  const [existingApplication, setExistingApplication] = useState();
  const { getData, setAppLoading } = useAppContext();
  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const navigation = useNavigation();
  // console.log(route?.params, "route params")
  const advert = route?.params;
  const { user } = useContext(AppContext);

  const AcceptModal = ModalComponent;
  const RejectModal = ModalComponent;

  function acceptOffer() {
    setShowAcceptModal(false);
    navigation.navigate("Application", { id: advert?._id });
  }

  function rejectOffer() {
    setShowRejectModal(false);
  }

  useEffect(() => {
    advert?.adverts?.map((advert, i) => {
      console.log(advert?.student, "advert student");
      if (advert?.student == user._id) {
        sethasExistingApplication(true);
        setExistingApplication(advert);
      }
    });
  }, [advert]);

  // console.log("authToken: ", authToken);
  const handleViewApplication = () => {
    navigation.navigate("ApplicationDetails", {
      advert: existingApplication,
    });
  };
  // create Chat
  async function createChat() {
    const formData = new FormData();
    formData.append("participantAType", "Influencer");
    formData.append("participantBType", "Brand");
    formData.append("participantB", advert?.organization);

    // Validate input fields
    if (!advert?.organization?._id || advert?.organization?._id == undefined) {
      Alert.alert("Error", "Please pass organization id");
      return;
    }

    // Send formData to server
    try {
      setAppLoading(true);
      const token = await getData("authToken");
      const response = await axios.post(
        `${baseUrl}/chats/students/create`,
        {
          participantAType: "Influencer",
          participantBType: "Brand",
          participantB: advert?.organization,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      console.log("response", response?.data);
      if (response.status === 201) {
        setAppLoading(false);

        Alert.alert("Success", "Chat created successfully!");
        navigation.navigate("Chat", {
          user: advert?.organization,
          chatId: response?.data?.chatId,
        });
      } else {
        setAppLoading(false);
        console.log(response?.status);
        Alert.alert("Error", "Failed to create chat.");
      }
    } catch (error) {
      setAppLoading(false);
      console.log("Error creating chat:", error, error?.response?.status);
      if (error?.response?.status === 409) {
        return navigation.navigate("Chat", {
          user: advert?.organization,
          chatId: error?.response?.data?.chatId,
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
        zIndex: 9999,
      }}
    >
      {/* container */}

      <View className="w-[90%]">
        {/* Header */}
        <View className="p-5 px-4 flex-row items-center justify-between mt-4">
          <TouchableOpacity onPress={() => navigation.navigate("JobStack")}>
            <Ionicons name="chevron-back" size={24} color={"black"} />
          </TouchableOpacity>

          <Text
            style={{ color: "#272727" }}
            className="text-black font-[DMSans-Medium] text-xl flex-1 ml-2"
          >
            Details
          </Text>
        </View>

        {/* advert info */}
        <View className="rounded-3xl overflow-auto w-[100%] px-4 flex flex-col items-start">
          {/* organization and payment info */}
          <View className="relative" style={{ width: "auto" }}>
            <View className="flex flex-row py-1 justify-between items-center my-1 w-full">
              {/* organization */}
              <View className="flex flex-row rounded-3xl items-center py-2 ">
                <Image
                  className="rounded-3xl overflow-hidden"
                  style={{
                    width: 30,
                    objectFit: "cover",
                    height: 30,
                  }}
                  source={{ uri: advert?.organization?.avatar }}
                />
                <Text className="text-[#272727] font-[DMSans-Regular] text-[13px] mx-4">
                  {advert?.organization?.name || "Brand name"}
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{ ...styles.textbold }}
            className="text-[#272727] text-lg font-[DMSans-SemiBold] "
          >
            {advert?.title ? advert?.title : "-"}
          </Text>

          <View className="flex flex-row justify-between items-center w-full">
            <Text className="text-[#939393] text-[10px]  font-[DMSans-Medium] ">
              Posted {new Date(advert?.createdAt).toDateString()}
            </Text>
          </View>

          <View className="h-[1] bg-[#4785FF] w-[90%] my-4 " />

          {/* advert details */}

          <Text className="text-[#272727] font-[DMSans-Medium] text-[16px] ">
            Advert details
          </Text>

          <Text
            style={styles.textmedium}
            className="text-xs my-4  text-gray-600"
          >
            {advert?.description}
          </Text>

          {/* requirements */}
          <View className="w-full my-2">
            <Text className="text-[#272727] font-[DMSans-Medium] text-[16px] ">
              Requirements
            </Text>
            <View className="w-full">
              {advert?.requirements?.length > 0 ? (
                advert?.requirements?.map((requirement, i) => (
                  <View key={i} className="flex flex-row items-center my-2">
                    <Text
                      style={styles.textmedium}
                      className="text-xs text-gray-600"
                    >
                      {requirement}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={styles.textmedium}
                  className="text-xs mx-2 text-gray-600"
                >
                  None
                </Text>
              )}
            </View>
          </View>

          {/* Responsibilies */}
          <View className="w-full my-2">
            <Text className="text-[#272727] font-[DMSans-Medium] text-[16px] ">
              Responsibilies
            </Text>
            <View className="w-full">
              {advert?.responsibilties?.length > 0 ? (
                advert?.responsibilties?.map((responsibility, i) => (
                  <View key={i} className="flex flex-row items-center my-2">
                    <Text
                      style={styles.textmedium}
                      className="text-xs mx-2 text-gray-600"
                    >
                      -{responsibility}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={styles.textmedium}
                  className="text-xs mx-2 text-gray-600"
                >
                  None
                </Text>
              )}
            </View>
          </View>

          {/* capmpaign metrics */}
          <View className="h-[1] bg-[#4785FF] w-[90%] my-4 " />

          <View className="flex flex-row gap-2 w-full flex-wrap justify-between items-center">
            {/* Duration */}
            <View className="py-1 px-2 rounded-lg flex flex-col  justify-center">
              <Text className=" text-[#272727] text-[10px] ">Duration</Text>
              <Text className=" text-black text-[13px] font-[DMSans-Black]">
                {advert?.duration}{" "}
              </Text>
            </View>

            {/* Applications */}
            <View className="py-1 px-2 rounded-lg flex flex-col  justify-center">
              <Text className=" text-[#272727] text-[10px] ">Applications</Text>
              <Text className=" text-black text-[13px] font-[DMSans-Black]">
                {advert?.applications?.length || "0"}{" "}
              </Text>
            </View>

            {/* view advert button */}
            {existingApplication?.status == "accepted" ? (
              <TouchableOpacity
                onPress={() => handleViewApplication()}
                className="py-1 px-4 w-[40%] rounded-full bg-[#4785FF]"
              >
                <Text
                  style={[styles.textbold]}
                  className="text-white text-[12px] text-center font-[DMSans-SemiBold]"
                >
                  View your tasks
                </Text>
              </TouchableOpacity>
            ) : hasExistingApplication ? (
              <TouchableOpacity
                onPress={() => handleViewApplication()}
                className="py-1 px-4 w-[40%] rounded-full bg-[#4785FF]"
              >
                <Text
                  style={[styles.textbold]}
                  className="text-white text-[12px] text-center font-[DMSans-SemiBold]"
                >
                  View Application
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setShowAcceptModal(true)}
                className="py-1 px-4 w-[40%] rounded-full bg-[#4785FF]"
              >
                <Text
                  style={[styles.textbold]}
                  className="text-white text-[12px] text-center font-[DMSans-SemiBold]"
                >
                  Send Application
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* tags */}
          <>
            <View className="flex flex-row justify-between items-center mt-3 flex-wrap">
              {advert?.tags?.length > 0 &&
                advert?.tags?.map((tag, i) => (
                  <Text
                    key={i}
                    style={{ flex: 1 }}
                    className="text-[#272727B2] w-full text-center my-2  min-w-[100]  text-[10px]  px-4 py-2 rounded-full bg-[#27272740] mr-2"
                  >
                    {tag}
                  </Text>
                ))}
            </View>
          </>
        </View>

        {/* 
        {existingApplication?.status == "accepted" ? (
          <Text className="text-[11px] w-[90%] text-gray-500 font-[DMSans-Bold] my-2">
            ℹ You advert has been accepted and you are currently a part of
            this advert.
          </Text>
        ) : (
          hasExistingApplication && (
            <Text className="text-[11px] text-gray-500 font-[DMSans-Bold] my-2">
              ℹ You have an existing advert for this advert.
            </Text>
          )
        )} */}
      </View>

      <AcceptModal
        show={showAcceptModal}
        message={
          "You are about to apply for this advert offer, do you wish to continue?"
        }
        onAccept={acceptOffer}
        onClose={() => setShowAcceptModal(false)}
      />
      <RejectModal
        show={showRejectModal}
        message={
          "You are about to reject this advert offer, do you wish to continue?"
        }
        onAccept={rejectOffer}
        onClose={() => setShowRejectModal(false)}
      />
    </ScrollView>
  );
};

export default AdvertDetails;
