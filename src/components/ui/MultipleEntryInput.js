import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { colors } from "../../data/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native";

const MultipleEntryInput = ({
  preEntry,
  label,
  onSelectionChange,
  containerStyle,
  containerClassName,
  labelClassName,
  placeholder,
}) => {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState(preEntry || []);

  useEffect(() => {
    onSelectionChange(entries);
    // console.log(entries,"enetr")
  }, [entries]);

  // console.log(entries,"ent")

  return (
    <View className={`w-full ${containerClassName} border border-gray-300 p-4 my-2 rounded-md`} style={containerStyle}>
      <Text className={`${labelClassName} text-gray-600 font-[DMSans-SemiBold] my-2`}>
        {label||""}
      </Text>
      {/* textInput to add new entry */}

      <View className={`flex flex-row items-center justify-between w-full`}>
        <TextInput
          style={styles?.input}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder={placeholder || "Type here to enter a value"}
          className={`border`}
          // keyboardType=""
        />

        <TouchableOpacity
          onPress={() => text !="" && setEntries([text, ...entries])}
          className={`flex flex-row items-center justify-center  border-[${colors.primary_mint}] bg-transparent p-2`}
        >
          <MaterialIcons name="add" size={20} color={colors.primary_mint} />
        </TouchableOpacity>
      </View>
      <View className={`flex flex-col`}>
        {entries?.map((entry, index) => (
          <View
            key={index}
            className={`flex flex-row items-center justify-between w-full my-2`}
          >
            <Text
              className={`text-[${colors.primary_mint}] text-base font-[DMSans-SemiBold] break-words whitespace-break-spaces`}
            >
              {entry}
            </Text>

            <Button
              title="Remove"
              onPress={() => {
                // Remove attachment logic
                setEntries((prevAttachments) =>
                  prevAttachments.filter((_, i) => i !== index)
                );
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default MultipleEntryInput;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width:"90%",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  attachmentText: {
    marginRight: 8,
    maxWidth: "70%",
  },
});
