import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../../data/colors";

const Socials = ({ navigation }) => {
  const [facebook, setFacebook] = useState("")
  const [twitter, setTwitter] = useState("")
  const [linkedIn, setLinkedIn] = useState("")
  const [instagram, setInstagram] = useState("")


  return (
    <View className="w-full h-full bg-white py-6">
      {/* Header */}
      {/* <View className="p-5 px-4 flex-row items-center justify-between border-b-[1px] border-b-[#F0DA6B]">
        <TouchableOpacity onPress={() => navigation.navigate("JobStack")}>
          <Ionicons name="chevron-back" size={24} color={"black"} />
        </TouchableOpacity>

        <Text
          style={{ ...styles.textbold, color: colors.primary_blue }}
          className="text-black text-xl flex-1 ml-2"
        >
          Socials
        </Text>
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:24}}>
        <View>
          {/* instagram */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Instagram</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: colors.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={instagram}
                onChangeText={(value) => setInstagram(value)}
                editable={true}
                placeholder="Enter your instagram link here"
              />
            </View>
          </View>

          {/* linkedIn */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>LinkedIn</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: colors.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={linkedIn}
                onChangeText={(value) => setLinkedIn(value)}
                editable={true}
                placeholder="Enter your LinkedIn link here"
              />
            </View>
          </View>

          {/* facebook */}
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Facebook</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: colors.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={facebook}
                onChangeText={(value) => setFacebook(value)}
                editable={true}
                placeholder="Enter your facebook link here"
              />
            </View>
          </View>

          {/* twitter */}

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Twitter</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: colors.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={twitter}
                onChangeText={(value) => setTwitter(value)}
                editable={true}
                placeholder="Enter your twitter link here"
              />
            </View>
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
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Socials;

const styles = StyleSheet.create({});
