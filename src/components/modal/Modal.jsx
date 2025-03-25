import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../data/colors";
import { styles } from "../metrics/styles";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";


const ModalComponent = ({ message,title, customComponent,cancelText,acceptText, onClose, onAccept,show }) => {
  return (
    <Modal transparent animationType="fade" visible={show}>
      <View
        className=" flex flex-col h-full items-center justify-center w-full "
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <View className="w-[90%] rounded-xl py-4 bg-white shadow-lg shadow-slate-500 min-h-[200px] flex flex-col items-center">
            {/* Icon */}

            <View className="flex flex-row items-center">
            <FontAwesome5 name="info-circle" color={colors.primary_blue} size={20} className=" mx-4" />
            <Text className="text-[16px] text-[#1F2024] mx-2 font-[DMSans-Bold]">
                {title||"Alert"}
            </Text>
            </View>
          {/* message */}
          <Text className="text-sm text-[#71727A] text-center my-2 p-2">
            {message ||
              `This is a modal message, enter a message to see a specific message instead`}
          </Text>
          {/* buttons */}
          <View className="flex-row px-6 mt-3 justify-between items-center">
          <TouchableOpacity
            onPress={e=>{onClose()}}
              className="px-10 border bg-transparent border-red-500 py-[10] rounded-[12px]"
            >
              <Text style={[styles.textbold]} className="text-[12px] font-[DMSans-SemiBold] text-red-500">
                {cancelText||"Cancel"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={e=>{onAccept()}}
              style={{backgroundColor:colors.primary_blue}}
              className="px-10  py-[10] rounded-[12px] mx-2"
            >
              <Text style={[styles.textbold]} className="text-[12px] font-[DMSans-SemiBold] text-white">
                {acceptText||"Continue"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;

// const styles = StyleSheet.create({});
