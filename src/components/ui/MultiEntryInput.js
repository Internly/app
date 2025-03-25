import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native";
import axios from "axios";

const MultipleEntryInput = ({
  preEntry,
  label,
  onSelectionChange,
  containerStyle,
  containerClassName,
  labelClassName,
  placeholder
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [reward, setReward] = useState("");
  const [entries, setEntries] = useState(preEntry || []);

  useEffect(() => {
    onSelectionChange(entries);
    console.log(entries, "entries");
  }, [entries]);

  const handleAddEntry = () => {
    if (title && description && duration && reward) {
      const newEntry = { title, description, duration, reward };
      setEntries([newEntry, ...entries]);
      setTitle("");
      setDescription("");
      setDuration("");
      setReward("");
    } else {
      Alert.alert("Task creation failed", "Please fill all fields");
    }
  };

  const handleRemoveEntry = (index) => {
    setEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
  };

  return (
    <View
      className={`w-full ${containerClassName} p-4 my-2 rounded-md`}
      style={containerStyle}
    >
      <Text
        className={`${labelClassName} text-gray-600 font-[DMSans-SemiBold] my-2`}
      >
        {label || "Entry"}
      </Text>
      <Text className=" text-[12px] my-2 text-gray-600">
        You must create at least one task(milestone)
      </Text>
      <View style={styles.input}>
        <TextInput
          className="w-full font-[DMSans-Light] text-[#3a3a3a] text-[12px] "
          value={title}
          onChangeText={(text) => setTitle(text)}
          placeholder="Title"
          placeholderTextColor={"#929292"}
        />
      </View>

      <View style={styles.input}>
        <TextInput
        multiline
          className="w-full font-[DMSans-Light] text-[#3a3a3a] text-[12px] "
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Description"
          placeholderTextColor={"#929292"}

        />
      </View>

      <View style={styles.input}>
        <TextInput
          className="w-full font-[DMSans-Light] text-[#3a3a3a] text-[12px] "
          value={duration}
          onChangeText={(text) => setDuration(text)}
          placeholder="Duration"
          placeholderTextColor={"#929292"}

        />
      </View>

      <View style={styles.input}>
        <TextInput
          className="w-full font-[DMSans-Light] text-[#3a3a3a] text-[12px] "
          value={reward}
          onChangeText={(text) => setReward(text)}
          placeholder="Reward"
          placeholderTextColor={"#929292"}

          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        onPress={handleAddEntry}
        style={{ backgroundColor: colors.primary_blue, width: "100%" }}
        className="px-10 py-[10] rounded-full ml-2 my-4"
      >
        <Text className="text-white text-[13px] font-[DMSans-Regular] text-center ">
          Add Milestone
        </Text>
      </TouchableOpacity>
      <View className={`flex flex-col`}>
        {entries?.map((entry, index) => (
          <View key={index + Date.now()} className="w-full my-2">
            {/* <View className="h-[0.37px] bg-[#4784ff] w-full my-4 " /> */}

            <View className=" w-full items-center justify-between flex-row my-1">
              <Text className="font-[DMSans-Medium] text-[14px] text-[#272727]">
                Milestone {index + 1}
              </Text>

              <TouchableOpacity onPress={()=>handleRemoveEntry(index)} className="w-[30px] h-[30px] rounded-full mx-2 bg-[#4785FF] flex items-center justify-center ">
                <FontAwesome
                  name={
                    entry?.status == "accepted" ? "check-circle-o" : "trash-o"
                  }
                  color={"white"}
                />
              </TouchableOpacity>
            </View>

            <View key={index} className="  rounded-md">
              <Text className="text-[13px] font-[DMSans-Regular] text-left text-[#272727]">
                {entry.title}
              </Text>
              <Text className="text-[13px] my-2 font-[DMSans-Regular] text-left text-[#272727]">
                $ {entry.reward}
              </Text>
              <Text className="text-[12px] font-[DMSans-Regular] text-left text-[#272727]">
                {entry.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MultipleEntryInput;

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "transparent",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22,
    backgroundColor: "#F5F7F9",
    borderRadius: 12,
    marginVertical: 10
  },
  multilineInput: {
    height: 100
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  attachmentText: {
    marginRight: 8,
    maxWidth: "70%"
  }
});
