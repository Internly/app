import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
  TextContainer,
} from "../styles/MessageStyles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../data/colors";
import { styles } from "../../../../components/metrics/styles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAppContext } from "../../../../context/AppContext";
import AnimatedLottieView from "lottie-react-native";
import emptyChats from "../../../../../assets/lottie/emptyChat.json";
import { useFocusEffect } from "@react-navigation/native";

const AllChats = () => {
  const { getData, user, messageCount, socket, storeData } = useAppContext();
  const [chatLoading, setChatLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const getUserChats = async () => {
    try {
      setChatLoading(true);
      const response = await axios.get(`${baseUrl}/chats/student`, {
        headers: {
          "x-auth-token": await getData("authToken"),
        },
      });
      setChats(response?.data?.data || []);
      await storeData(
        "lastFetchedChat",
        JSON.stringify(response?.data?.data || [])
      );
      setChatLoading(false);
    } catch (error) {
      console.log("Failed to fetch adverts: ", error?.response?.data);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load chats at the moment"
      );
      setChatLoading(false);
    }
  };

  // function to fetch cached chats
  const lastFetchedChats = async () => {
    const response = await getData("lastFetchedChat");
    return JSON.parse(response);
  };

  useFocusEffect(
    useCallback(() => {
      // lastFetchedChats().then(result=>console.log(result, "cached"))
      lastFetchedChats().then((result) => {
        setChats(result?.length > 0 && setChats(result));
      });
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      getUserChats();
    }, [messageCount])
  );

  useEffect(() => {
    if (!socket) return;

    const handleSocketEvents = (chatId) => {
      socket.emit("join", { chatId, userId: user._id });
      socket.on("message", (message) => {
        console.log("New message received: ", message);
        getUserChats(); // Refresh the chats when a new message is received
      });
    };

    chats?.forEach(({ chatId }) => {
      handleSocketEvents(chatId);
    });

    return () => {
      chats?.forEach(({ chatId }) => {
        socket.emit("leave", { chatId });
        socket.off("message");
      });
    };
  }, [socket, chats]);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats?.filter((chat) =>
        `${chat.otherParticipant.firstName} ${chat.otherParticipant.lastName}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchValue, chats]);

  return (
    <Container>
      {/* Header */}
      <View className="p-5 px-0 flex-row items-center justify-between ">
        <Text
          style={{ color: "#272727" }}
          className="text-black font-[DMSans-SemiBold] text-[18px] flex-1 ml-2"
        >
          Messages
        </Text>
      </View>

      {chats?.length > 0 ? (
        <>
          <View
            className="w-full my-4 mt-0 flex-col flex-wrap"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <View className="w-full my-4 flex-row pl-4 bg-[#F1F1F2] rounded-full py-1  items-center flex     ">
              <FontAwesome name="search" color={"#2F3036"} size={20} />

              <TextInput
                style={{ borderWidth: 0 }}
                placeholder="Search for chats..."
                className=" min-h-[40px] mx-2 text-xs w-[85%] "
                value={searchValue}
                onChangeText={(value) => setSearchValue(value)}
                textContentType="name"
              />
            </View>
          </View>
          <FlatList
            data={filteredChats}
            keyExtractor={(item) => item.chatId}
            renderItem={({ item }) => (
              <View key={item.chatId} className="w-full ">
                <Card
                  onPress={() =>
                    navigation.navigate("Chat", {
                      user: item.otherParticipant,
                      chatId: item.chatId,
                    })
                  }
                >
                  <UserInfo>
                    <UserImgWrapper>
                      {item?.avatar ? (
                        <Image
                          alt="user-Image"
                          resizeMode="cover"
                          width={50}
                          height={50}
                          source={{ uri: item.avatar }}
                          className="rounded-full w-[50] h-[50]"
                        />
                      ) : (
                        <Image
                          alt="user-Image"
                          resizeMode="contain"
                          width={50}
                          height={50}
                          source={require("../../../../../assets/icons/Avatar.png")}
                          className="rounded-full w-[50] h-[50]"
                        />
                      )}
                    </UserImgWrapper>
                    <TextSection>
                      <UserInfoText>
                        <UserName>{item?.otherParticipant?.name}</UserName>
                        <PostTime>
                          {new Date(
                            item.lastMessage?.createdAt || item?.createdAt
                          ).toLocaleDateString()}
                        </PostTime>
                      </UserInfoText>
                      <TextContainer>
                        <MessageText>
                          {item.lastMessage?.text?.slice(0, 50) ||
                            "👋🏽 Send a message"}
                        </MessageText>
                        {item?.lastMessage?.from?._id === user._id ? (
                          !item?.lastMessage?.seen ? (
                            <FontAwesome name="check" size={9} color={"gray"} />
                          ) : (
                            <FontAwesome
                              name="check"
                              size={9}
                              color={colors.primary_blue}
                            />
                          )
                        ) : (
                          !item?.lastMessage?.seen && (
                            <FontAwesome
                              name="circle"
                              size={9}
                              color={colors.primary_blue}
                            />
                          )
                        )}
                      </TextContainer>
                    </TextSection>
                  </UserInfo>
                </Card>
              </View>
            )}
          />
        </>
      ) : (
        <View className="w-full flex flex-col items-center justify-center">
          <AnimatedLottieView
            source={emptyChats}
            autoPlay
            style={{
              backgroundColor: "transparent",
              width: 300,
              height: 300,
            }}
          />
          <Text
            className="m-2 text-md font-[DMSans-SemiBold] text-center"
            style={{
              color: colors.primary_blue,
              textAlign: "center",
              lineHeight: 27,
            }}
          >
            {chatLoading
              ? "Your chats are loading..."
              : "You have not started any conversation.."}
          </Text>

          <Text
            className="m-2 text-md font-[DMSans-SemiBold] text-center"
            style={{ color: "gray", textAlign: "center", lineHeight: 27 }}
          >
            {"Your conversations appear here"}
          </Text>
        </View>
      )}
    </Container>
  );
};

export default AllChats;
