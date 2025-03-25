import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Text,
  Image,
  Alert,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import ModalComponent from "../../../../components/modal/Modal";
import { useAppContext } from "../../../../context/AppContext";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../../../data/colors";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import WithdrawIcon from "../../../../../assets/svgs/withdraw.svg";

const CARD_WIDTH = Math.min(Dimensions.get("screen").width * 0.75, 400);

export default function UserProfile({ navigation }) {
  const { user, setAppLoading, getData, getUser } = useAppContext();
  const [showDeleteProfile, setShowDeleteProfile] = useState(false);
  const DeleteProfile = ModalComponent;
  const [avatar, setAvatar] = useState(null);
  const [showUploadAvatar, setShowUploadAvatar] = useState(false);

  const [file, setFile] = useState();
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
      setShowUploadAvatar(false);
      const token = await getData("authToken");

      console.log(`${baseUrl}/students/upload_avatar`);
      const response = await axios.post(
        `${baseUrl}/students/upload_avatar`,
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

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (!result?.canceled) {
        const assets = result?.assets[0];

        console.log(assets);
        setAvatar(result?.assets[0]?.uri);
        setShowUploadAvatar(true);
        const file = {
          name: assets.name,
          uri: assets.uri,
          type: assets.mimeType,
          size: assets.size,
          lastModified: assets.lastModified,
        };

        setFile(file);
      }
    } catch (error) {
      Alert.alert(
        error?.message || "An error occurred while picking document...try again"
      );
      console.log("Error picking document:", error);
    }
  };
  const stats = [
    { label: "Location", value: user?.nationality },
    {
      label: "Applications",
      value: user?.advertHistory?.length || "0",
    },
    { label: "Connections", value: `${user?.rating}` },
  ];

  function deleteProfile() {
    setShowDeleteProfile(false);
    new Alert.prompt(
      "Alert",
      "Profile deleted, thanks for using our services. Leave a review if you don't mind",
      _,
      "plain-text"
    );
    navigation.navigate("Signin");
  }
  useLayoutEffect(() => {
    getUser();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerAction}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
                navigation.goBack();
              }}
            >
              <FeatherIcon name="chevron-left" size={24} />
            </TouchableOpacity>
          </View>
          <Text className="text-lg text-black font-[DMSans-Bold]">
            My Profile
          </Text>

          {/* <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}>
              <FeatherIcon name="more-vertical" size={24} />
            </TouchableOpacity>
          </View> */}
        </View>

        <ScrollView>
          <View style={styles.content}>
            <View style={styles.profile}>
              <View style={styles.profileTop}>
                <TouchableOpacity style={styles.avatar}>
                  {avatar ? (
                    <Image
                      alt=""
                      source={{
                        uri: avatar,
                      }}
                      style={styles.avatarImg}
                    />
                  ) : user?.avatar ? (
                    <Image
                      alt=""
                      source={{
                        uri: user?.avatar,
                      }}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <Image
                      alt=""
                      source={require("../../../../../assets/icons/Avatar.png")}
                      style={styles.avatarImg}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.changeAvatarIcon}
                    onPress={pickImage}
                  >
                    <FontAwesome
                      name="plus-circle"
                      color={colors.primary_blue}
                      size={24}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.profileBody}>
                  <Text
                    style={styles.profileTitle}
                  >{`${user.firstName} ${user.lastName}`}</Text>

                  <Text style={styles.profileSubtitle}>{user?.email}</Text>
                </View>
              </View>

              <View style={styles.stats} className="mb-4">
                {stats.map(({ label, value }, index) => (
                  <View
                    key={index}
                    style={[
                      styles.statsItem,
                      index === 0 && { borderLeftWidth: 0 },
                    ]}
                  >
                    <Text style={styles.statsItemText}>{label}</Text>

                    <Text style={styles.statsItemValue}>{value}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row w-full items-center justify-between">
                <View>
                  <Text className="text-[14px] text-[#1F2024] font-[DMSans-Regular] ">
                    Profile title
                  </Text>

                  <Text
                    style={styles.profileDescription}
                    className="my-2 text-[12px] font-[DMSans-Regular] text-[#71727A] "
                  >
                    {/* {user?.about} */}
                  </Text>
                </View>
              </View>
              <View className="my-4 w-full">
                <Text className="text-[14px] text-[#1F2024] font-[DMSans-Regular] ">
                  About
                </Text>

                <Text
                  style={styles.profileDescription}
                  className="my-2 text-[12px] font-[DMSans-Regular] text-[#71727A] "
                >
                  {user?.about}
                </Text>

                {user?.interests?.length > 0 && (
                  <>
                    <Text className="text-[14px] text-black font-[DMSans-Regular] my-2">
                      Interests
                    </Text>
                    <View style={styles.profileTags}>
                      {user?.interests?.map((tag, index) => (
                        <TouchableOpacity
                          className="py-1 px-2 bg-[#EAF2FF] rounded-full mr-1 "
                          key={index}
                        >
                          <Text className=" uppercase text-[#4785FF] text-[11px]">
                            {tag}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.contentActions}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  navigation.navigate("Profile");
                }}
                style={{ flex: 1, paddingHorizontal: 6 }}
              >
                <View style={styles.btn} className="rounded-full">
                  <Text className="text-white font-[DMSans-SemiBold] py-2">
                    Edit Profile
                  </Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  setShowDeleteProfile(true);
                }}
                style={{ flex: 1, paddingHorizontal: 6 }}
              >
                <View style={styles.btnPrimary}>
                  <Text style={styles.btnPrimaryText}>Close Account</Text>
                </View>
              </TouchableOpacity> */}
            </View>
          </View>

          <DeleteProfile
            show={showDeleteProfile}
            message={
              "You are about to close your account. This action is irreversible, do you wish to continue?"
            }
            onAccept={deleteProfile}
            onClose={() => setShowDeleteProfile(false)}
          />

          {/* upload avatar */}
          <ModalComponent
            show={showUploadAvatar}
            message={
              "You are about to update your avatar. Ensure it meets all requirements. Do you wish to continue?"
            }
            onAccept={uploadAvatar}
            onClose={() => setShowUploadAvatar(false)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerAction: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerSearch: {
    position: "relative",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerSearchIcon: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  headerSearchInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingLeft: 34,
    width: "100%",
    fontSize: 16,
    fontWeight: "500",
  },
  /** Content */
  content: {
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  contentActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginHorizontal: -6,
    marginBottom: 0,
  },
  /** Profile */
  profile: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  profileTop: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profileBody: {
    width: "100%",
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 17,
    fontFamily: "DMSans-Bold",
    lineHeight: 32,
    color: "#121a26",
    marginBottom: 6,
    width: "100%",
    textAlign: "center",
  },
  profileSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "DMSans-Regular",
    color: "#71727A",
  },
  profileDescription: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    color: "#778599",
  },
  profileTags: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileTagsItem: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
    color: "#266ef1",
    marginRight: 4,
  },
  /** Avatar */
  avatar: {
    position: "relative",
    marginVertical: 7,
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 9999,
  },
  changeAvatarIcon: {
    position: "absolute",
    borderRadius: 100,
    borderColor: "#fff",
    bottom: 0,
    right: -2,
    padding: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  /** Stats */
  stats: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 20,
    borderBottomColor: "#D4D6DD",
    borderBottomWidth: 1,
  },
  statsItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  statsItemText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    color: "#778599",
    marginBottom: 5,
  },
  statsItemValue: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: "#494A50",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary_blue,
  },
  btnText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#266EF1",
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    backgroundColor: "#266EF1",
    borderColor: "#266EF1",
  },
  btnPrimaryText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#fff",
  },
  /** List */
  list: {
    marginTop: 16,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 22,
    color: "#121a26",
  },
  listAction: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: "#778599",
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  /** Card */
  card: {
    width: CARD_WIDTH,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    shadowColor: "#90a0ca",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff1f5",
  },
  cardBody: {
    paddingLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
    color: "#121a26",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    color: "#778599",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  cardFooterText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    color: "#778599",
  },
});
