import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { styles } from "../../../../components/metrics/styles";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { colors } from "../../../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AppContext, useAppContext } from "../../../../context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalComponent from "../../../../components/modal/Modal";
import axios from "axios";

const ApplicationDetails = ({ route }) => {
  const WithdrawModal = ModalComponent;
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const navigation = useNavigation();
  const { getData, setAppLoading } = useAppContext();
  const { application } = route?.params;

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

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
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to withdraw application.");
      }
    } catch (error) {
      setAppLoading(false);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to withdraw application."
      );
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      vertical
      className="flex-1 bg-[#ffffff]"
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 40,
        zIndex: 9999,
      }}
    >
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

      {/* Application Info */}
      <View className="rounded-3xl overflow-auto w-[100%] px-4 flex flex-col items-start">
        <Text
          style={{ ...styles.textbold }}
          className="text-[#272727] text-lg font-[DMSans-SemiBold] "
        >
          {application?.title ? application?.title : "-"}
        </Text>

        <View className="flex flex-row py-1 justify-between items-center w-full">
          <Text className="text-[#939393] text-[10px]  font-[DMSans-Medium] ">
            Sent: {new Date(application?.submittedAt).toDateString()}
          </Text>
        </View>

        {/* propsal status */}
        <View className="flex flex-row  items-center mt-2 ">
          {application?.status == "accepted" ? (
            <Text className="text-[#28B446] text-[10px] font-[DMSans-Medium] ">
              Status: {application?.status}
            </Text>
          ) : application?.status == "rejected" ? (
            <Text className="text-red-400 text-[10px] font-[DMSans-Medium] ">
              Status: {application?.status}
            </Text>
          ) : (
            <Text className="text-blue-400 text-[10px] font-[DMSans-Medium] ">
              Status: {application?.status}
            </Text>
          )}
        </View>

        {/* divider */}
        <View className="h-[0.37px] bg-[#4784ff] w-full my-4 " />

        {/* cover letter details */}

        <Text className="text-[#272727] font-[DMSans-Medium] text-[16px] ">
          Cover letter
        </Text>

        {/* Cover Letter */}
        <Text style={styles.textmedium} className="text-xs my-2  text-gray-600">
          {application?.coverLetter || `no cover letter`}
        </Text>

        {/* divider */}
        <View className="h-[0.37px] bg-[#4784ff] w-full my-4 " />

        {/* Tasks Section */}
        {application?.tasks && application.tasks.length > 0 && (
          <View className="w-full">
            {application.tasks.map((task, index) => (
              <View key={index + Date.now()} className="w-full my-2">
                {/* <View className="h-[0.37px] bg-[#4784ff] w-full my-4 " /> */}

                <View className=" w-full items-center justify-between flex-row my-1">
                  <Text className="font-[DMSans-Medium] text-[14px] text-[#272727]">
                    Milestone {index + 1}
                  </Text>
                  <View className="items-center flex flex-row">
                    {task?.status == "accepted" ? (
                      <Text className="text-[#28B446] text-[10px] font-[DMSans-Medium] ">
                        Status: {task?.status}
                      </Text>
                    ) : application?.status == "rejected" ? (
                      <Text className="text-red-400 text-[10px] font-[DMSans-Medium] ">
                        Status: {task?.status}
                      </Text>
                    ) : (
                      <Text className="text-blue-400 text-[10px] font-[DMSans-Medium] ">
                        Status: {task?.status}
                      </Text>
                    )}

                    <View className="w-[30px] h-[30px] rounded-full mx-2 bg-[#4785FF] flex items-center justify-center ">
                      <FontAwesome
                        name={
                          task?.status == "accepted"
                            ? "check-circle-o"
                            : "pencil"
                        }
                        color={"white"}
                      />
                    </View>
                  </View>
                </View>

                <View key={index} className="  rounded-md">
                  <Text className="text-[13px] font-[DMSans-Regular] text-left text-[#272727]">
                    {task.title}
                  </Text>
                  <Text className="text-[13px] my-2 font-[DMSans-Regular] text-left text-[#272727]">
                    $ {task.reward}
                  </Text>
                  <Text className="text-[12px] font-[DMSans-Regular] text-left text-[#272727]">
                    {task.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Navigation */}
      {application?.status != "accepted" && (
        <View className="flex-row px-6 mt-3 w-screen mb-6 flex-wrap justify-between items-center">
          <TouchableOpacity
            onPress={() => setShowWithdrawModal(true)}
            className="px-10 border bg-white border-red-400 py-[10] rounded-full my-2 ml-2 w-full"
          >
            <Text
              style={[styles.textbold]}
              className="text-sm text-center text-red-400"
            >
              Delete application
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <WithdrawModal
        show={showWithdrawModal}
        message={
          "You are about to withdraw this application.\n This action is irreversible, do you wish to continue?"
        }
        onAccept={handleWithdrawApplication}
        onClose={() => setShowWithdrawModal(false)}
      />
    </ScrollView>
  );
};

export default ApplicationDetails;
