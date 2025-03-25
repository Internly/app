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
import { AppContext } from "../../../../../../context/AppContext";
import { colors } from "../../../../../../data/colors";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema
const schema = yup.object().shape({
  nationality: yup.string().required("Nationality is required"),
  state: yup.string().required("State is required"),
  about: yup.string().required("About is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Residential address is required"),
  gender: yup.string().required("Gender is required"),
  incomeRange: yup.string().required("Expected monthly income is required"),
  interests: yup.array().min(1, "At least one interest is required"),
});

const UpdateProfile = () => {
  const { setAppLoading, getData, getUser, user } = useContext(AppContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [genderOpen, setGenderOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);

  const [genderOptions, setGenderOptions] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  const [incomeOptions, setIncomeOptions] = useState([
    { label: "0 - 1,000", value: "0 - 1,000" },
    { label: "1,001 - 5,000", value: "1,001 - 5,000" },
    { label: "5,001 - 10,000", value: "5,001 - 10,000" },
    { label: "10,001 and above", value: "10,001 and above" },
  ]);

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
    try {
      setAppLoading(true);
      const token = await getData("authToken");

      const response = await axios.post(
        `${baseUrl}/students/profile/update`,
        data,
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

        Alert.alert("Success", "Profile Updated successfully!");
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

  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: 20,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        className="m-4 my-0"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color={"black"} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* About field */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>About me</Text>
          <View
            style={{
              width: "100%",
              borderColor: "#80808070",
              borderWidth: 1,
              borderRadius: 4,
              marginVertical: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <Controller
              control={control}
              name="about"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={true}
                  multiline
                  placeholder="Tell the world about yourself shortly."
                  style={{
                    minHeight: 170,
                    padding: 5,
                    textAlignVertical: "top",
                  }}
                  className="min-h-[300px]"
                />
              )}
            />
          </View>
          {errors.about && (
            <Text className="text-red-400 mb-2">{errors.about.message}</Text>
          )}
        </View>

        <View>
          {/* Nationality */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Nationality</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="nationality"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={true}
                    placeholder="Nigeria"
                  />
                )}
              />
            </View>
            {errors.nationality && (
              <Text className="text-red-400 mb-2">
                {errors.nationality.message}
              </Text>
            )}
          </View>

          {/* State */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>State</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={true}
                    placeholder="Lagos"
                  />
                )}
              />
            </View>
            {errors.state && (
              <Text className="text-red-400 mb-2">{errors.state.message}</Text>
            )}
          </View>

          {/* City */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>City</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={true}
                    placeholder="Ikeja"
                  />
                )}
              />
            </View>
            {errors.city && (
              <Text className="text-red-400 mb-2">{errors.city.message}</Text>
            )}
          </View>

          {/* Residential address */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Residential address</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={true}
                    placeholder="No 1, oluki highway"
                  />
                )}
              />
            </View>
            {errors.address && (
              <Text className="text-red-400 mb-2">
                {errors.address.message}
              </Text>
            )}
          </View>

          {/* Dropdown for gender */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Gender</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <DropDownPicker
                  open={genderOpen}
                  value={value}
                  items={genderOptions}
                  setOpen={setGenderOpen}
                  setValue={onChange}
                  setItems={setGenderOptions}
                  zIndex={10}
                />
              )}
            />
            {errors.gender && (
              <Text className="text-red-400 mb-2">{errors.gender.message}</Text>
            )}
          </View>

          {/* Dropdown for interests */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Your Interests</Text>
            <Controller
              control={control}
              name="interests"
              render={({ field: { onChange, value } }) => (
                <DropDownPicker
                  open={interestOpen}
                  value={value}
                  items={interestOptions}
                  zIndex={8}
                  setOpen={setInterestOpen}
                  setValue={onChange}
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
                />
              )}
            />
            {errors.interests && (
              <Text className="text-red-400 mb-2">
                {errors.interests.message}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.primary_blue,
            height: 44,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
          className="my-2"
          onPress={handleSubmit(onSubmit)}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Update Profile
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

export default UpdateProfile;
