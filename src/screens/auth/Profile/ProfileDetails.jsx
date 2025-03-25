import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { AppContext } from "../../../context/AppContext";
import { colors } from "../../../data/colors";
import axios from "axios";
import {
  organizationFields,
  organizationFormData,
  studentFields,
  studentFormData,
} from "../../../data/profileFields";
import CustomProfileInput from "../../../components/custom-ui/CustomProfileInput";

const CreateProfile = () => {
  const navigation = useNavigation();
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setgender] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [companyTypeOpen, setCompanyTypeOpen] = useState("");

  const [interests, setInterests] = useState([]);
  const [interestOpen, setInterestOPen] = useState(false);
  const { user } = useContext(AppContext);
  const [genderOptions, setGenderOptions] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);
  const [companyTypeOptions, setCompanyTypeOptions] = useState([
    { label: "StartUp", value: "startup" },
    { label: "Unicorn", value: "unicorn" },
    { label: "Government", value: "government" },
  ]);

  const [formInputData, setFormData] = useState(
    user?.accountType === "Organization"
      ? organizationFormData
      : studentFormData
  );

  const onInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputFields =
    user?.accountType === "Organization" ? organizationFields : studentFields;

  const [interestOptions, setInterestOptions] = useState([
    { label: "Fashion", value: "fashion" },
    { label: "Tech", value: "tech" },
    { label: "Food", value: "food" },
    { label: "Art", value: "art" },
    { label: "Health", value: "health" },
    { label: "Music", value: "music" },
  ]);

  const { setAppLoading, getData, getUser } = useContext(AppContext);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const handleSubmit = async () => {
    // Construct address object as JSON string
    const addressObj = {
      state: formInputData.state,
      city: formInputData.city,
      residentialAddress: formInputData.address,
    };

    const studentData = {
      niche: formInputData.niche,
      level: formInputData.level,
      institution: formInputData.institution,
      course: formInputData.course,
      gender: gender,
    };
    const organizationData = {
      organization: formInputData.organization,
      companyId: formInputData.companyId,
      type: companyType,
    };

    const data = {
      address: addressObj,
      nationality: formInputData.nationality,

      about: formInputData.about,
      interests: interests,
    };

    const finalData =
      user?.accountType === "Organization"
        ? { ...data, ...organizationData }
        : { ...data, ...studentData };

    // Send formData to server
    try {
      setAppLoading(true);
      const token = await getData("authToken");

      const response = await axios.post(
        `${baseUrl}/${user?.accountType?.toLowerCase()}s/profile/create`,
        finalData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await getUser();
        setAppLoading(false);

        Alert.alert("Success", "Profile created successfully!");
        navigation.navigate("Dashboard");
      } else {
        setAppLoading(false);
        const responseData = await response.json();
        Alert.alert(
          "Error",
          responseData.message || "Failed to submit profile."
        );
      }
    } catch (error) {
      setAppLoading(false);
      console.log(
        "Error submitting profile:",
        error?.response?.data?.message || error?.message
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit profile."
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingVertical: 20,
      }}
    >
      {/* Header */}
      <View className="py-5 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text className="text-black text-[14px] font-[DMSans-Bold]">
          Create your {user?.accountType?.toLowerCase()} profile
        </Text>
        <View />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {inputFields?.map((field, index) => (
          <CustomProfileInput
            key={index}
            onChange={(value) => {
              onInputChange(field.name, value);
            }}
            value={formInputData[field.name]}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
          />
        ))}

        {user?.accountType === "Organization" ? (
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}} className="my-2">
              Organization type
            </Text>
            <DropDownPicker
              open={companyTypeOpen}
              value={companyType}
              items={companyTypeOptions}
              setOpen={setCompanyTypeOpen}
              setValue={setCompanyType}
              setItems={setCompanyTypeOptions}
              zIndex={10}
              //   setGenderOptions={setGenderOptions}

              // theme="DARK"
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}} className="my-2">
              Gender
            </Text>
            <DropDownPicker
              open={genderOpen}
              value={gender}
              items={genderOptions}
              setOpen={setGenderOpen}
              setValue={setgender}
              setItems={setGenderOptions}
              zIndex={10}
              //   setGenderOptions={setGenderOptions}

              // theme="DARK"
            />
          </View>
        )}

        {/* Dropdown for interests*/}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}} className="my-2">
            Your Interests
          </Text>
          <DropDownPicker
            open={interestOpen}
            value={interests}
            items={interestOptions}
            zIndex={8}
            setOpen={setInterestOPen}
            setValue={setInterests}
            setItems={setInterestOptions}
            multiple={true}
            mode="BADGE"
            badgeDotColors={[
              "#e76f51",
              "#00b4d8",
              "#e9c46a",
              "#e76f51",
              "#8ac926",
              "#00b4d8",
              "#e9c46a",
            ]}
            min={0}
            max={5}
            // theme="DARK"
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.primary_blue,
            height: 44,
            borderRadius: 6,
            marginVertical: 20,
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
            Create Profile
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

export default CreateProfile;
