import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Modal,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../../../data/colors";
import { SafeAreaView } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { AppContext } from "../../../../context/AppContext";
import MultipleEntryInput from "../../../../components/ui/MultipleEntryInput";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { useForm, Controller } from "react-hook-form";

// yup validation schema

// const advertSchema = yup.object().shape({
//   description: yup
//     .string()
//     .required("Description is required")
//     .min(10, "Description must be at least 10 characters"),
//   title: yup.string().required("Title is required"),
//   duration: yup.string().required("duration is required"),
//   priceAmount: yup.string().required("price amount is required"),
//   totalBudget: yup.string().required("total budget is required"),
//   pricePeriod: yup.string().required("price period is required"),
//   keywords: yup
//     .array()
//     .min(1, "At least one interest is required")
//     .max(5, "You can select up to 5 interests"),
//   hashTags: yup
//     .array()
//     .min(1, "At least one interest is required")
//     .max(5, "You can select up to 5 interests"),
//   advertResponsibilities: yup
//     .array()
//     .min(1, "At least one interest is required")
//     .max(5, "You can select up to 5 interests"),
//   advertRequirements: yup
//     .array()
//     .min(1, "At least one interest is required")
//     .max(5, "You can select up to 5 interests"),
//   handlesToTag: yup
//     .array()
//     .min(1, "At least one interest is required")
//     .max(5, "You can select up to 5 interests"),
// });

const CreateAdvert = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [advertResponsibilities, setAdvertResponsibilities] = useState([]);
  const [advertRequirements, setAdvertRequirements] = useState([]);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Weekly", value: "weekly" },
    { label: "Hourly", value: "hourly" },
    { label: "Fixed", value: "fixed" },
  ]);

  // react hook form controller

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(advertSchema),
  //   defaultValues: {
  //     about: user?.about || "",
  //     companyRegistrationId: user?.companyRegistrationId || "",
  //     nationality: user?.nationality || "",
  //     state: user?.address?.state || "",
  //     city: user?.address?.city || "",
  //     address: user?.address?.residentialAddress || "",
  //     interests: user?.interests || [],
  //   },
  // });

  const [files, setFiles] = useState([]);
  const { setAppLoading, getData } = useContext(AppContext);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("keywords", keywords);

    formData.append("responsibilities", advertResponsibilities);
    formData.append("requirements", advertRequirements);

    // Validate input fields
    if (!title || !description || !duration) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    // Send formData to server
    try {
      setAppLoading(true);
      const token = await getData("authToken");
      const response = await fetch(`${baseUrl}/adverts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
        body: formData,
      });

      console.log(response.json());
      if (response.status === 201) {
        setAppLoading(false);

        Alert.alert("Success", "Advert submitted successfully!");
        navigation.goBack();
      } else {
        setAppLoading(false);

        Alert.alert("Error", "Failed to submit Advert.");
      }
    } catch (error) {
      setAppLoading(false);
      console.error("Error submitting Advert:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit Advert."
      );
    }
  };

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result?.canceled) {
        const assets = result?.assets[0];
        setAttachments((prevAttachments) => [...prevAttachments, assets.name]);

        const file = {
          name: assets.name,
          uri: assets.uri,
          type: assets.mimeType,
          size: assets.size,
          lastModified: assets.lastModified,
        };

        setFiles([...files, file]);
        console.log(attachments, " is atachments ", assets);
      }
    } catch (error) {
      Alert.alert(
        error?.message || "An error occurred while picking document...try again"
      );
      console.log("Error picking document:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: 20,
      }}
    >
      {/* Header */}
      <View className=" pb-5 px-4 w-full flex-row items-center justify-between mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>

        <View>
          <Text
            style={{ color: "#272727" }}
            className="text-black font-[DMSans-Medium] text-lg flex-1"
          >
            Create Advert
          </Text>
        </View>
        <View />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Position Title</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <TextInput
                value={title}
                onChangeText={(value) => setTitle(value)}
                editable={true}
                placeholder="Title: e.g intern front-end developer"
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Duration</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <TextInput
                value={duration}
                onChangeText={(value) => setDuration(value)}
                editable={true}
                placeholder="Duration: 2 weeks"
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Description</Text>
          <View
            style={{
              // height: 44,
              width: "100%",
              borderColor: "#80808070",
              borderWidth: 1,
              borderRadius: 4,
              marginVertical: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <TextInput
              value={description}
              onChangeText={(value) => setDescription(value)}
              editable={true}
              multiline
              placeholder="A detailed description of this position. Make it simple to understand"
              style={{
                minHeight: 300,
                padding: 5,
                // height:312,
                textAlignVertical: "top",
              }}
              className="min-h-[300px]"
            />
          </View>
        </View>

        {/* Job Requirements */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Requirements</Text>
          <>
            <MultipleEntryInput
              label={""}
              onSelectionChange={(selection) =>
                setAdvertRequirements(selection)
              }
              placeholder={"List the job requirements"}
            />
          </>
        </View>

        {/*  */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Intern Responsibilities</Text>
          <>
            <MultipleEntryInput
              label={""}
              onSelectionChange={(selection) =>
                setAdvertResponsibilities(selection)
              }
              placeholder={"Enter the responsibilities of the intern"}
            />
          </>
        </View>

        {/* keywords */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Keywords</Text>
          <>
            <MultipleEntryInput
              label={""}
              onSelectionChange={(selection) => setKeywords(selection)}
              placeholder={"Enter relevant keywords to this role"}
            />
          </>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.primary_blue,
            height: 44,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleSubmit}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Create Advert
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
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

export default CreateAdvert;
