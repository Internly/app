import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../../../data/colors";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { AppContext } from "../../../../context/AppContext";
import MultipleEntryInput from "../../../../components/ui/MultiEntryInput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CustomInput } from "../../../../components/custom-ui/CustomInput";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  duration: yup.string().required("Duration is required"),
  priceAmount: yup
    .number()
    .typeError("Price amount must be a number")
    .required("Price amount is required"),
  coverLetter: yup.string().required("Cover letter is required"),
});

const EditApplication = ({ route }) => {
  const application = route?.params?.application;

  const [paymentMode, setPaymentMode] = useState(
    application?.paymentMode || "task_based"
  );
  const [pricePeriod, setPricePeriod] = useState(
    application?.pricePeriod || "fixed"
  ); // Default value
  const [attachments, setAttachments] = useState([]);
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [paymentDropDownOpen, setpaymentDropDownOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Weekly", value: "weekly" },
    { label: "Hourly", value: "hourly" },
    { label: "Fixed", value: "fixed" },
  ]);
  const [paymentModes, setPaymentModes] = useState([
    { label: "Upon job completion", value: "onCompletion" },
    { label: "Task(milestone) based ", value: "task_based" },
  ]);
  const [files, setFiles] = useState([]);
  const { setAppLoading, getData } = useContext(AppContext);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("paymentMode", paymentMode);
    formData.append("coverLetter", data.coverLetter);
    formData.append("status", "submitted"); // Default value
    formData.append("duration", data.duration);
    formData.append(
      "price",
      JSON.stringify({ amount: data.priceAmount, period: pricePeriod })
    );
    if (paymentMode === "task_based") {
      console.log(tasks, "tasks jhjgfd");
      formData.append("tasks", JSON.stringify(tasks)); // Append tasks
    }

    files.forEach((file) => {
      formData.append("media", file);
    });

    // Send formData to server
    try {
      setAppLoading(true);
      const token = await getData("authToken");
      const response = await fetch(
        `${baseUrl}/applications/${application?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token,
          },
          body: formData,
        }
      );

      console.log(response.body);
      if (response.status === 200) {
        setAppLoading(false);

        Alert.alert("Success", "Application updated successfully!");
        navigation.navigate("JobStack");
      } else {
        setAppLoading(false);

        Alert.alert("Error", "Failed to submit application.");
      }
    } catch (error) {
      setAppLoading(false);
      console.error("Error submitting application:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit application."
      );
    }
  };

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result?.cancelled) {
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
        console.log(attachments, " is attachments ", assets);
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
      style={{ flex: 1, backgroundColor: "white", paddingVertical: 20 }}
    >
      {/* Header */}
      <View className="p-5 px-4 flex-row items-center justify-between ">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={"black"} />
        </TouchableOpacity>

        <Text
          style={{ color: "#272727" }}
          className="text-black font-[DMSans-Medium] text-[16px] flex-1 ml-2"
        >
          Edit Application
        </Text>
      </View>

      {/* Form */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <CustomInput
            name={"title"}
            label={"Title"}
            defaultValue={application.title}
            control={control}
            placeholder="Title: e.g I am interested in your application"
            showError={errors?.title}
            error={errors?.title?.message}
          />

          <CustomInput
            name={"duration"}
            label={"Duration"}
            control={control}
            placeholder="2 weeks"
            defaultValue={application.duration}
            showError={errors?.duration}
            error={errors?.duration?.message}
          />

          {/* Conditionally render task input fields */}
          {paymentMode === "task_based" && (
            <MultipleEntryInput
              preEntry={application?.tasks}
              label="Tasks (Milestone)"
              onSelectionChange={setTasks}
              placeholder="Enter task details"
            />
          )}

          {/* Price amount input */}
          <CustomInput
            name={"priceAmount"}
            label={"Price Amount($)"}
            keyboardType={"numeric"}
            control={control}
            placeholder="enter value in USD ($)"
            showError={errors?.priceAmount}
            defaultValue={String(application?.price?.amount)}
            error={errors?.priceAmount?.message}
          />

          {/* DropDown for Price Period */}
          {/* <View style={{ zIndex: 400 }}>
            <CustomInput
              name={"pricePeriod"}
              label={"Price Period"}
              customComponent={
                <DropDownPicker
                  open={open}
                  value={pricePeriod}
                  items={items}
                  setOpen={setOpen}
                  setValue={setPricePeriod}
                  setItems={setItems}
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "none",
                    borderWidth: 0,
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#dfdfdf",
                    zIndex: 400,
                  }}
                  zIndex={400}
                  zIndexInverse={300}
                />
              }
            />
          </View> */}

          {/* Cover letter */}
          <CustomInput
            label={"Cover letter"}
            customComponent={
              <Controller
                control={control}
                name="coverLetter"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    defaultValue={application.coverLetter}
                    editable={true}
                    multiline
                    placeholder="A message describing why you're the best fit for this job"
                    style={{
                      minHeight: 300,
                      padding: 5,
                      textAlignVertical: "top",
                    }}
                    className="min-h-[300px]"
                  />
                )}
              />
            }
            showError={errors?.coverLetter}
            error={errors?.coverLetter?.message}
          />

          {/* Attachments */}
          {/* <View style={{ alignItems: "center", marginVertical: 22 }}>
            {attachments.map((uri, index) => (
              <View key={index} style={styles.attachment}>
                <Text style={styles.attachmentText}>{uri}</Text>
                <TouchableOpacity
                  className="rounded-full py-2 px-4"
                  style={{
                    backgroundColor: colors.primary_blue,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    setAttachments((prevAttachments) =>
                      prevAttachments.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Text className=" text-white text-[12px] ">Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={handleFileSelection}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="folder-o" size={14} color={"#272727"} />
                <Text
                  className="text-[12px] text-[#272727] "
                  style={{ marginLeft: 8 }}
                >
                  Attach File
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity
            className="rounded-full py-3 px-4"
            style={{
              backgroundColor: colors.primary_blue,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={{ color: "white", fontSize: 12 }}>
              Submit Application
            </Text>
          </TouchableOpacity>
        </View>
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

export default EditApplication;
