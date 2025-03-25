import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { styles } from "../../../../components/metrics/styles";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../../../context/AppContext";
import ModalComponent from "../../../../components/modal/Modal";
import axios from "axios";
import { getTimeDifference } from "../../../../components/cards/JobCard";
// import { useToast } from "react-native-toast-notifications";

const OrganizationAdvertDetails = ({ route }) => {
  const advert = route?.params;

  const [amount, setAmount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkAsComplete, setShowMarkAsComplete] = useState(false);
  const { setAppLoading, isAppLoading, getData } = useContext(AppContext);
  const [isHiring, setIsHiring] = useState(advert?.isHiring || true);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const [advertStatus, setadvertStatus] = useState(advert?.status);

  const navigation = useNavigation();

  const EditModal = ModalComponent;
  const DeleteModal = ModalComponent;
  const MarkAsCompleteModal = ModalComponent;
  const [loading, setLoading] = useState(false);

  // base url
  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  // Advert settimgs

  const handleHiringToggle = async () => {
    try {
      const token = await getData("authToken");
      const response = await axios.patch(
        `${baseUrl}/adverts/hire_status/${advert?._id}`,
        { isHiring: !isHiring },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (response.status === 200) {
        setIsHiring(!isHiring);
      }
    } catch (error) {
      console.log("Error updating hiring status:", error);
      Alert.alert("Error", "Failed to update hiring status.");
    }
  };

  const handleCompleteAdvert = async () => {
    setAppLoading(true);
    try {
      const token = await getData("authToken");
      const response = await axios.put(
        `${baseUrl}/adverts/complete/${advert?._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      setAppLoading(false);
      if (response.status === 200) {
        setShowMarkAsComplete(false);
        return setadvertStatus("completed");
      }
      Alert.alert("Error", "Failed to mark advert as complete.");
    } catch (error) {
      setAppLoading(false);

      console.log("Error marking advert as complete:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to mark advert as complete."
      );
    }
  };

  async function deleteAdvert() {
    try {
      setShowDeleteModal(false);
      setAppLoading(true);
      const authToken = await getData("authToken");

      const response = await axios.delete(`${baseUrl}/adverts/${advert?._id}`, {
        headers: {
          "x-auth-token": authToken,
        },
      });
      if (response.status) {
        setAppLoading(false);

        Alert.alert("Success", "Advert withdrawn successfully!");
        navigation.goBack();
        // Optionally, you can refresh the adverts list here
      } else {
        Alert.alert("Error", "Failed to withdraw advert?.");
      }
    } catch (error) {
      setAppLoading(false);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to withdraw advert?."
      );
      console.error(
        "Error withdrawing advert:",
        error?.response?.data?.message || error
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
        paddingHorizontal: 10,
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <View className="p-5 px-4 w-full flex-row items-center justify-between mt-4">
        <TouchableOpacity onPress={() => navigation.navigate("JobStack")}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>

        <View>
          <Text
            style={{ color: "#272727" }}
            className="text-black font-[DMSans-Medium] text-xl flex-1"
          >
            Details
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            setIsSettingsVisible(true);
          }}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.primary_blue}
          />
        </TouchableOpacity>
      </View>
      {/* advert info */}

      {advert?.status === "completed" && (
        <Text className="text-blue-500 font-[DMSans-SemiBold] text-sm m-2">
          ℹ This advert is now complete and no longer active.
        </Text>
      )}

      <View className="rounded-3xl overflow-auto w-[100%] px-4 flex flex-col items-start my-4">
        {/* organization and payment info */}
        <View className="relative" style={{ width: "auto" }}>
          <View className="flex flex-row py-1 justify-between items-center  w-full">
            {/* organization */}
            <View className="flex flex-row rounded-3xl items-center py-2 ">
              <Image
                className="rounded-3xl overflow-hidden"
                style={{
                  width: 35,
                  objectFit: "cover",
                  height: 35,
                }}
                source={{ uri: advert?.organization?.avatar }}
              />
              <Text className="text-[#272727] font-[DMSans-Regular] text-[13px] mx-2">
                {advert?.organization?.name || "Brand name"}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{ ...styles.textbold }}
          className="text-black text-lg font-[DMSans-Black] "
        >
          {advert?.title ? advert?.title : " no advert title"}
        </Text>

        <View
          className="flex flex-row py-1 justify-between mb-1 items-center w-full"
          style
        >
          <Text className="text-gray-400 text-[11px]  font-[DMSans-Medium] ">
            Posted {new Date(advert?.createdAt).toDateString()}
          </Text>
        </View>

        {/* view adverts */}

        {advert?.applications?.length > 0 && (
          <TouchableOpacity
            className="flex flex-row justify-center py-2 mt-1 px-4 rounded-full items-center my-1 w-full "
            onPress={() =>
              navigation.navigate("Applications", {
                id: advert?._id,
                adverts: advert?.applications,
              })
            }
            style={{ backgroundColor: "#FBBB00" }}
          >
            <Text className="text-white text-xs mx-2  font-[DMSans-Medium] ">
              View applications
            </Text>
          </TouchableOpacity>
        )}

        <View className="flex flex-row py-1 items-center my-2 w-full" style>
          <Text className="text-gray-800 text-xs  font-[DMSans-Medium] ">
            Status :{" "}
          </Text>
          {/* <FontAwesome5
            className=""
            size={15}
            name={advert?.isApproved ? "check" : "times-circle"}
            color={advert?.isApproved ? "green" : "red"}
          /> */}
          <Text
            style={{ color: advert?.isApproved ? "#28B446" : "#FBBB00" }}
            className="text-gray-400 text-xs  font-[DMSans-Medium] "
          >
            {advert?.isApproved ? "approved" : "not approved"}
          </Text>
        </View>

        <View className="flex flex-row w-full flex-wrap justify-between items-center">
          {/* Duration */}
          <View className="py-1 px-2 border-[0.8px] border-[#4785FF33] w-[30%] rounded-lg flex flex-col items-center justify-center">
            <Text className=" text-gray-400 text-[10px]">Duration</Text>
            <Text className=" text-black text-xs font-[DMSans-SemiBold]">
              {advert?.duration}{" "}
            </Text>
          </View>

          {/* Applications */}
          <View className="py-1 px-2 border-[0.8px] border-[#4785FF33] w-[30%] rounded-lg flex flex-col items-center justify-center">
            <Text className=" text-gray-400 text-[10px]">Applications</Text>
            <Text className=" text-black text-xs font-[DMSans-SemiBold]">
              {advert?.adverts?.length || "0"}{" "}
            </Text>
          </View>
        </View>
        <View className="h-[0.3px] bg-[#4784ff] w-[100%] my-4 " />

        {/* description */}
        <View>
          <View className="w-full mb-2">
            <Text className="text-[#272727] font-[DMSans-Medium] text-[16px] ">
              Advert description
            </Text>
            <Text
              style={styles.textmedium}
              className="text-xs mt-2  text-gray-600"
            >
              {advert?.description || `-`}
            </Text>
          </View>

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
        </View>
      </View>
      {/* navigation */}
      <View className="flex-row px-6 mt-3 w-screen mb-6 flex-wrap justify-between items-center">
        {advert?.status === "pending" && (
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary_blue,
              width: "100%",
            }}
            onPress={() => setShowEditModal(true)}
            className="px-10  py-[10] rounded-full ml-2 "
          >
            <Text
              style={[styles.textbold]}
              className="text-base text-center text-white"
            >
              Edit
            </Text>
          </TouchableOpacity>
        )}

        {advert?.status != "active" && (
          <TouchableOpacity
            style={{
              // backgroundColor: "red",
              width: "100%",
            }}
            disabled={advertStatus === "completed"}
            onPress={() => setShowDeleteModal(true)}
            className="px-10  py-[10] rounded-full ml-2 bg-red-500 my-2"
          >
            <Text
              style={[styles.textbold]}
              className="text-base text-center text-white"
            >
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <EditModal
        show={showEditModal}
        message={
          "You are about to edit this advert offer, do you wish to continue?"
        }
        onAccept={() => {
          navigation.navigate("EditAdvert", { advert: advert });
        }}
        onClose={() => setShowEditModal(false)}
      />
      <DeleteModal
        show={showDeleteModal}
        message={
          "You are about to delete this advert , do you wish to continue?"
        }
        onAccept={deleteAdvert}
        onClose={() => setShowDeleteModal(false)}
      />

      <MarkAsCompleteModal
        show={showMarkAsComplete}
        message={
          "You are about to mark this advert as completed. Ensure that all tasks have been completed first and you're satisfied with the work done"
        }
        onAccept={handleCompleteAdvert}
        onClose={() => setShowMarkAsComplete(false)}
      />
      {/* camapaign settings */}
      <Modal
        visible={isSettingsVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-[#292928e1] bg-opacity-50">
          <View className="w-[90%] p-5 bg-white rounded-lg">
            <Text className="text-lg font-[DMSans-Bold] mb-4">
              Advert Settings
            </Text>

            {advert?.isApproved && (
              <>
                <View className="flex flex-row justify-between items-center mb-4">
                  <Text className="text-[12px] font-[DMSans-Regular]">
                    {" "}
                    Are you still hiring?{" "}
                  </Text>
                  <Switch
                    value={isHiring}
                    disabled={advertStatus === "completed" ? true : false}
                    onValueChange={handleHiringToggle}
                    thumbColor={isHiring ? "#4caf50" : "#f44336"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                setIsSettingsVisible(false);
              }}
              className="rounded-full py-2 px-4 bg-blue-500"
            >
              <Text className="text-white text-center font-[DMSans-SemiBold]">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default OrganizationAdvertDetails;
