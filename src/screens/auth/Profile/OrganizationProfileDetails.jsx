import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { AppContext } from "../../../context/AppContext";
import { colors } from "../../../data/colors";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const profileSchema = yup.object().shape({
  about: yup
    .string()
    .required("About is required")
    .min(10, "About must be at least 10 characters"),
  companyRegistrationId: yup
    .string()
    .required("Company Registration ID is required"),
  nationality: yup.string().required("Nationality is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Residential address is required"),
  // interests: yup
  //   .array()
  //   .min(1, "At least one interest is required")
  //   .max(5, "You can select up to 5 interests"),
});

const CreateOrganizationProfile = () => {
  const { setAppLoading, getData, getUser } = useContext(AppContext);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  async function verifyCompany(companyRegistrationId) {
    try {
      const response = await axios.post(
        "https://searchapp.cac.gov.ng/api/public/public-search/company-business-name-it?page=1&limit=10",
        { searchTerm: companyRegistrationId }
      );

      console.log("response : ", response);

      if (response.status === 200 && response.data.data) {
        if (response.data?.data?.data?.data?.length > 0) {
          return true;
        }
        return true;
      }
      return false;
    } catch (error) {
      ToastAndroid.show(
        error.response?.data?.message ||
          error.message ||
          "Failed to verify company. Verify your company registration ID and try again.",
        ToastAndroid.SHORT
      );
      return false;
    }
  }

  const [interestOpen, setInterestOpen] = useState(false);
  const [interestOptions, setInterestOptions] = useState([
    { label: "Fashion", value: "fashion" },
    { label: "Tech", value: "tech" },
    { label: "Food", value: "food" },
    { label: "Art", value: "art" },
    { label: "Health", value: "health" },
    { label: "Music", value: "music" },
  ]);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const onSubmit = async (data) => {
    const formData = new FormData();

    try {
      setAppLoading(true);
      if (!(await verifyCompany(data.companyRegistrationId))) {
        return Alert.alert(
          "Error",
          "Company registration ID is invalid. Please verify and try again."
        );
      }

      const addressObj = {
        state: data.state,
        city: data.city,
        residentialAddress: data.address,
      };

      console.log("Errors : ", errors);

      formData.append("address", addressObj);
      formData.append("nationality", data.nationality);
      formData.append("companyRegistrationId", data.companyRegistrationId);
      formData.append("monthlyIncome", data.incomeRange);
      formData.append("interests", data.interests);

      const profileData = {
        address: addressObj,
        nationality: data.nationality,
        companyRegistrationId: data.companyRegistrationId,
        interests: data.interests,
        monthlyIncomeRange: data.incomeRange,
        about: data.about,
      };
      const token = await getData("authToken");

      const response = await axios.post(
        `${baseUrl}/organizations/profile/create`,
        profileData,
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
        Alert.alert(
          "Error",
          response.data.message || "Failed to submit profile."
        );
      }
    } catch (error) {
      setAppLoading(false);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to submit profile."
      );
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create organization profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <Controller
          control={control}
          name="about"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ ...styles.inputContainer, marginBottom: 40 }}>
              <Text>About organization</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                  errors.about && styles.errorInput,
                ]}
                placeholder="Tell the world about organization shortly."
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.about && (
                <Text style={styles.errorText}>{errors.about.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="companyRegistrationId"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>Company Registration ID</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.companyRegistrationId && styles.errorInput,
                ]}
                placeholder="NG-98494E"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.companyRegistrationId && (
                <Text style={styles.errorText}>
                  {errors.companyRegistrationId.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="nationality"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>Nationality</Text>
              <TextInput
                style={[styles.input, errors.nationality && styles.errorInput]}
                placeholder="Nigeria"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.nationality && (
                <Text style={styles.errorText}>
                  {errors.nationality.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>State</Text>
              <TextInput
                style={[styles.input, errors.state && styles.errorInput]}
                placeholder="Lagos"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.state && (
                <Text style={styles.errorText}>{errors.state.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>City</Text>
              <TextInput
                style={[styles.input, errors.city && styles.errorInput]}
                placeholder="Ikeja"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>Orgnaization address</Text>
              <TextInput
                style={[styles.input, errors.address && styles.errorInput]}
                placeholder="No 1, oluki highway"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address.message}</Text>
              )}
            </View>
          )}
        />

        {/* <Controller
          control={control}
          name="interests"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>Your Interests</Text>
              <DropDownPicker
                open={interestOpen}
                value={value}
                items={interestOptions}
                zIndex={8}
                setOpen={setInterestOpen}
                setValue={onChange}
                setItems={setInterestOptions}
                multiple
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
              />
              {errors.interests && (
                <Text style={styles.errorText}>{errors.interests.message}</Text>
              )}
            </View>
          )}
        /> */}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.submitButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: "#F0DA6B",
  },
  headerText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  input: {
    height: 44,
    borderColor: "#80808070",
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 6,
    paddingHorizontal: 8,
  },
  multilineInput: {
    minHeight: 80,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary_blue,
    height: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
  },
});

export default CreateOrganizationProfile;
