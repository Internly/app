import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../data/colors";
import { AppContext } from "../../../context/AppContext";
import { Image } from "react-native";
import axios from "axios";
import img from "../../../../assets/post-images/img_placeholder.png";

import * as DocumentPicker from "expo-document-picker";

export default UploadAvatarPage = () => {
  const [avatar, setAvatar] = useState(null);
  const navigation = useNavigation();
  const { setAppLoading, getData, user, userType } = useContext(AppContext);
  const [file, setFile] = useState();
  const [imageUri, setImageUri] = useState("");

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const uploadAvatar = async () => {
    if (!avatar) {
      Alert.alert(
        "Upload image error",
        "Select an image by tapping the image icon"
      );
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    // Send formData to server
    try {
      setAppLoading(true);
      const token = await getData("authToken");

      console.log(`${baseUrl}/students/upload_avatar`);
      const response = await axios.post(
        `${baseUrl}/${
          user?.accountType?.toLowerCase() || userType
        }s/upload_avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token,
          },
        }
      );

      if (response.status === 201) {
        console.log("response: ", response);
        setAppLoading(false);

        Alert.alert("Success", "Image uploaded sucessfully!");
        navigation.navigate("CreateProfile");
      } else {
        setAppLoading(false);

        Alert.alert("Error", "Failed to upload image.");
      }
    } catch (error) {
      setAppLoading(false);
      console.log("Image upload error:", error?.response?.data);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit advert."
      );
    }
  };

  useEffect(() => {
    // (async () => {
    //   const { status } =
    //     await DocumentPicker.requestMediaLibraryPermissionsAsync();
    //   if (status !== "granted") {
    //     Alert.alert(
    //       "Permission needed",
    //       "Sorry, we need camera roll permissions to make this work!"
    //     );
    //   }
    // })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (!result?.cancelled) {
        const assets = result?.assets[0];

        console.log(assets);
        setAvatar(result?.assets[0]?.uri);

        const file = {
          name: assets.name,
          uri: assets.uri,
          type: assets.mimeType,
          size: assets.size,
          lastModified: assets.lastModified,
        };

        setFile(file);
        console.log(" is atachments ", assets.file);
      }
    } catch (error) {
      Alert.alert(
        error?.message || "An error occurred while picking document...try again"
      );
      console.log("Error picking document:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Header */}
      <View className="py-5 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>
        <Text className="text-black text-[14px] font-[DMSans-Bold]">
          Upload avatar
        </Text>
        <View />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text className="p-4 text-center font-[DMSans-Bold] text-lg">
          Tap the image to select your profile image
        </Text>
        <Text className="p-4 text-center text-gray-500">
          Please select a clear image showing your face.
        </Text>
        <View
          style={{
            alignItems: "center",
            marginVertical: 22,
          }}
        >
          <TouchableOpacity onPress={pickImage}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: colors.primary,
                }}
              />
            ) : (
              <Image
                source={img}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: colors.primary,
                }}
              />
            )}

            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                zIndex: 9999,
              }}
            >
              <MaterialIcons
                name="photo-camera"
                size={32}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={uploadAvatar}
          // disabled={!avatar}
          style={styles.uploadButton}
        >
          <Text
            className=" text-center font-[DMSans-Bold]  "
            style={{ color: "white" }}
          >
            Upload Avatar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CreateProfile");
          }}
          style={styles.skipButton}
        >
          <Text
            className="p-4 text-center font-[DMSans-Regular] text-lg"
            style={{ color: colors.primary_blue }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  avatarContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  chooseButton: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: colors.primary_blue,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: colors.white,
  },
});
