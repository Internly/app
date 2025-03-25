import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Modal,
  ToastAndroid,
  TextInput,
  ScrollView,
} from "react-native";
import SVGImage from "react-native-remote-svg";
import {
  Bubble,
  GiftedChat,
  Send,
  IMessage,
  InputToolbar,
} from "react-native-gifted-chat";
import InChatFileTransfer from "../../../../components/ui/chat/InChatFileTranfer";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons, FontAwesome, Entypo } from "@expo/vector-icons";
import { useAppContext } from "../../../../context/AppContext";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import FormData from "form-data";
import * as Clipboard from "expo-clipboard";
import { colors } from "../../../../data/colors";
import ModalComponent from "../../../../components/modal/Modal";
import EmptyMessage from "../../../../components/ui/chat/ChatEmpty";

const Chat = ({ navigation, route }) => {
  const { user: recipient, chatId } = route?.params;
  const {
    user: sender,
    setAppLoading,
    getData,
    socket,
    messageCount,
    setmessageCount,
  } = useAppContext();
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [fileVisible, setFileVisible] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [files, setFiles] = useState([]);
  const [messageText, setmessageText] = useState("");
  const [filePath, setFilePath] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastSeen, setLastSeen] = useState("loading...");
  const [menuVisible, setMenuVisible] = useState(false);
  const [messageMenuVisible, setMessageMenuVisible] = useState(false);
  const [messageMenuOptions, setMessageMenuOptions] = useState([]);
  const [selectedMessage, setselectedMessage] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [showBlockModal, setshowBlockModal] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const scrollViewRef = useRef(null);
  const DeleteMessageModal = ModalComponent;
  const BlockChatModal = ModalComponent;

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const getChatMessages = async () => {
    try {
      setMessageLoading(true);
      const response = await axios.get(
        `${baseUrl}/chats/messages/student/${chatId}`,
        {
          headers: {
            "x-auth-token": await getData("authToken"),
          },
        }
      );

      const rawMessages = response.data.data || [];

      const transformedMessages = rawMessages.map(transformMessage);
      setMessages(transformedMessages);
      setMessageLoading(false);
    } catch (error) {
      console.log("Failed to fetch messages: ", error?.response?.data);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load messages at the moment"
      );
      setMessageLoading(false);
    }
  };

  console.log("rendering stuff");

  // function to transform message;

  const transformMessage = (message) => {
    return {
      _id: message._id,
      text: message.text,
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.from,
        name: message.fromType,
        avatar: recipient?.avatar || "../../../../../assets/icons/Avatar.png",
      },
      image:
        message.mediaUrls?.find((media) => media.type === "image")?.link || "",
      file: {
        url:
          message.mediaUrls?.find((media) => media.type !== "image")?.link ||
          "",
      },
      video:
        message.mediaUrls?.find((media) => media.type === "video")?.link || "",
      status: message.status || "sent",
      sent: true,
      recieved: message.seen || false,
      isReply: message.isReply,
      referenceChat: message.referenceChat,
      replyTo: message?.referenceChat
        ? {
            _id: message.referenceChat._id,
            text: message.referenceChat.text,
            user: message.referenceChat.user,
          }
        : null,
    };
  };

  useFocusEffect(
    useCallback(() => {
      getChatMessages();
    }, [])
  );

  // connect to socket
  useEffect(() => {
    if (!socket) return;

    socket.emit("join", { chatId, userId: sender._id });

    socket.on("message", (message) => {
      const newMessage = transformMessage(message);
      console.clear();
      console.log(newMessage, " is the new message");
      setmessageCount(messageCount + 1);
      getChatMessages();
      // setMessages((previousMessages) =>
      //   GiftedChat.append(previousMessages, newMessage)
      // );
    });

    socket.on("typing", ({ userId, isTyping }) => {
      setIsTyping(isTyping);

      if (userId !== sender._id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.emit("leave", { chatId });
      socket.off("message");
      socket.off("typing");
    };
  }, [chatId, sender._id, socket]);

  // function to format user's last seen
  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);

    const isToday = now.toDateString() === lastSeenDate.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      lastSeenDate.toDateString();

    if (isToday) {
      return `Today at ${lastSeenDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (isYesterday) {
      return `Yesterday at ${lastSeenDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `on ${lastSeenDate.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} at ${lastSeenDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const ChatHeader = () => {
    return (
      <View style={styles.header} className="justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color={colors.primary_blue} />
        </TouchableOpacity>

        <View className="text-[14px] text-[red] font-[DMSans-Bold]">
          <Text style={styles.headerText}>{recipient?.name}</Text>
          {isTyping ? (
            <Text style={styles.lastSeenText} className="animate-pulse">
              Typing...
            </Text>
          ) : (
            recipient?.lastSeen && (
              <Text style={styles.lastSeenText}>
                {`Last seen: ${formatLastSeen(recipient.lastSeen)}`}
              </Text>
            )
          )}
        </View>
        {recipient?.avatar ? (
          <Image
            source={{
              uri: recipient?.avatar,
            }}
            style={styles.avatar}
          />
        ) : (
          <Image
            source={require("../../../../../assets/icons/Avatar.png")}
            style={styles.avatar}
          />
        )}
      </View>
    );
  };

  const onSend = useCallback(async () => {
    console.log("message text : ", messageText);
    // clear all states
    setImagePath("");
    setIsAttachImage(false);
    setFilePath("");
    setIsAttachFile(false);
    setReplyingMessage(null); // Clear the reply message state
    setFiles([]);

    const tempId = Date.now().toString(); // Temporary ID for the message
    const pendingMessage = {
      _id: tempId,
      text: messageText,
      createdAt: new Date(),
      user: {
        _id: sender._id,
        avatar: sender?.avatar || "",
      },
      image: imagePath,
      file: {
        url: filePath,
      },
      pending: true,
      status: "pending",
      replyTo: replyingMessage
        ? {
            _id: replyingMessage._id,
            text: replyingMessage.text,
            user: replyingMessage.user,
          }
        : null,
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, pendingMessage)
    );

    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("from", sender._id);
    formData.append("fromType", "Brand");
    formData.append("toType", "Influencer");
    formData.append("to", recipient._id);
    formData.append("text", messageText);

    // Append files
    files.forEach((file, index) => {
      formData.append("media", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    if (replyingMessage) {
      formData.append("referenceChatId", replyingMessage._id);
      formData.append("isReply", true);
    }

    try {
      const response = await axios.post(
        `${baseUrl}/chats/message/student/create`,
        formData,
        {
          headers: {
            "x-auth-token": await getData("authToken"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const savedMessage = {
          _id: response.data.data._id,
          text: messageText,
          createdAt: new Date(),
          user: {
            _id: sender._id,
            avatar: sender?.avatar || "",
            userName: `${sender.name}`,
          },
          image: imagePath,
          sent: true,
          file: {
            url: filePath,
          },
          status: "sent",
        };

        console.log(savedMessage, "saved Message");
        setmessageText("");
        getChatMessages();

        socket.emit("message", {
          ...savedMessage,
          chatId,
          pushObject: recipient.pushObject,
        });
      } else {
        throw new Error(response.data.message || "Message creation failed");
      }
    } catch (error) {
      console.log("Failed to send message: ", error);
      ToastAndroid.showWithGravityAndOffset(
        error.response?.data?.message ||
          error.message ||
          "Failed to send message",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }, [
    chatId,
    filePath,
    imagePath,
    isAttachFile,
    isAttachImage,
    recipient._id,
    sender._id,
    replyingMessage,
  ]);

  const renderSend = (props) => (
    <View style={styles.sendContainer}>
      <TouchableOpacity>
        <FontAwesome
          name="paperclip"
          style={styles.paperClip}
          size={28}
          color={colors.primary_blue}
        />
      </TouchableOpacity>
    </View>
  );

  const handleMessageMenuOption = (option) => {
    setMessageMenuVisible(false);
    switch (option) {
      case "Delete":
        // Handle delete chat logic here
        setshowDeleteModal(true);
        break;
      case "Reply":
        // Handle block user logic here
        // Alert.alert("Block User", "User blocked successfully");
        // Set the message to reply to
        setReplyingMessage(selectedMessage);
        break;
      case "Download":
        downloadMedia(selectedMessage);

        break;
      case "Copy":
        copyToClipboard(selectedMessage.text);
        break;
      default:
        break;
    }
  };

  const handleLongPress = (message) => {
    // console.log(message,"currentMessage");
    setselectedMessage(message);
    const options =
      message?.image || message?.file.url
        ? ["Copy", "Reply", "Delete", "Download", "Cancel"]
        : ["Copy", "Reply", "Delete", "Cancel"];
    setMessageMenuOptions(options);
    setMessageMenuVisible(true);
  };

  // download and share media function

  function downloadMedia(message) {
    if (message.image || message.file.url) {
      const url = message.image || message.file.url;
      FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + url.split("/").pop()
      ).then(({ uri }) => {
        Sharing.shareAsync(uri);
      });
    } else {
      Alert.alert("Error", "No media to download");
    }
  }

  // copy text to clipboard function

  async function copyToClipboard(text) {
    await Clipboard.setStringAsync(text);
    ToastAndroid.showWithGravityAndOffset(
      "Text has been copied to clipboard",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  }

  // deleteMessage
  async function deleteMessage() {
    try {
      setshowDeleteModal(false);
      // setAppLoading(true);

      const response = await axios.delete(
        `${baseUrl}/chats/message/student/${selectedMessage._id}`,
        {
          headers: {
            "x-auth-token": await getData("authToken"),
          },
        }
      );

      if (response.status == 200) {
        setAppLoading(false);

        ToastAndroid.showWithGravityAndOffset(
          " Message deleted!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        getChatMessages();
      }
    } catch (error) {
      console.log(error);
      setAppLoading(false);

      ToastAndroid.showWithGravityAndOffset(
        error.response.data.message ||
          error.message ||
          "unable to delete message",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }

  // block chat
  //
  async function blockChat() {
    try {
      setAppLoading(true);
      setshowBlockModal(false);
      const response = await axios.post(
        `${baseUrl}/chats/message/student/block/${chatId}`,
        {},
        {
          headers: {
            "x-auth-token": await getData("authToken"),
          },
        }
      );

      if (response.status == 200) {
        setAppLoading(false);
        ToastAndroid.showWithGravityAndOffset(
          "Chat blocked successfully!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        // getChatMessages();
        navigation.navigate("Chats");
      }
    } catch (error) {
      console.log(error);
      setAppLoading(false);
      ToastAndroid.showWithGravityAndOffset(
        error.response.data.message || error.message || "unable to block chat",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }

  const renderBubble = (props) => {
    const { currentMessage } = props;

    // console.log(currentMessage,"current message")
    const handleScrollToMessage = (referenceChatId) => {
      // Find the message by referenceChatId and scroll to it
      const index = messages.findIndex((msg) => msg._id === referenceChatId);
      if (index !== -1 && scrollViewRef.current) {
        scrollViewRef.current.scrollToIndex({ index, animated: true });
      }
    };

    const renderReferenceChat = () => {
      const referenceMessage = currentMessage.referenceChat;
      if (referenceMessage) {
        return (
          <TouchableOpacity
            onPress={() => handleScrollToMessage(referenceMessage._id)}
          >
            <Bubble
              {...props}
              currentMessage={referenceMessage}
              wrapperStyle={{
                right: {
                  ...styles.replyFooter,
                  borderLeftWidth: 1,
                  borderRadius: 5,
                  marginBottom: -10,
                  marginTop: 10,
                },
                left: {
                  ...styles.replyFooter,
                  borderLeftWidth: 1,
                  borderRadius: 5,
                  marginBottom: -10,
                  marginTop: 10,
                },
              }}
              textStyle={{
                right: styles.replyingToText,
                left: styles.replyingToText,
              }}
            />
          </TouchableOpacity>
        );
      }
      return null;
    };

    if (currentMessage?.file?.url) {
      return (
        <TouchableOpacity
          style={[
            styles.fileContainer,
            currentMessage.user._id === sender._id
              ? styles.fileContainerRight
              : styles.fileContainerLeft,
          ]}
          onPress={() => setFileVisible(true)}
          onLongPress={() => handleLongPress(currentMessage)}
        >
          {currentMessage.isReply && renderReferenceChat()}
          <InChatFileTransfer
            style={styles.inChatFileTransfer}
            filePath={currentMessage.file.url}
          />
          <Text
            style={[
              styles.fileText,
              currentMessage.user._id === sender._id
                ? styles.fileTextRight
                : styles.fileTextLeft,
            ]}
          >
            {currentMessage.text}
          </Text>
          <Text style={styles.textTime} className={`text-white`}>
            {currentMessage.createdAt?.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity>
        {currentMessage.isReply && renderReferenceChat()}
        <Bubble
          {...props}
          wrapperStyle={{
            right: styles.bubbleRight,
            left: styles.bubbleLeft,
          }}
          textStyle={{
            right: styles.bubbleTextRight,
            left: styles.bubbleTextLeft,
          }}
          onLongPress={() => handleLongPress(currentMessage)}
        >
          <Text style={styles.textTime}>
            {currentMessage.status === "pending"
              ? "Sending..."
              : currentMessage.status === "sent"
              ? "Sent"
              : "Seen"}
          </Text>
        </Bubble>
      </TouchableOpacity>
    );
  };

  // function to pick document

  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
      });

      const assets = result?.assets[0];
      const fileUri = assets?.uri;
      const file = {
        name: assets.name,
        uri: assets.uri,
        type: assets.mimeType,
        size: assets.size,
        lastModified: assets.lastModified,
      };
      console.log("is going");

      console.log(files, "old and stuborn files");
      files ? setFiles([...files, file]) : setFiles([file]);

      console.log("is going 2");

      if (fileUri) {
        if (fileUri.match(/\.(jpeg|jpg|png)$/)) {
          setImagePath(fileUri);
          setIsAttachImage(true);
        } else {
          setFilePath(fileUri);
          setIsAttachFile(true);
        }
      }
    } catch (err) {
      console.error("DocumentPicker error: ", err);
    }
  };

  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <>
          {replyingMessage && (
            <View style={styles.replyFooter}>
              <Text style={styles.replyingToText}>
                Replying to: {replyingMessage.text}
              </Text>
              <TouchableOpacity
                onPress={() => setReplyingMessage(null)}
                style={styles.footerButton}
              >
                <Text style={styles.footerButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.chatFooter}>
            <Image
              source={{ uri: imagePath }}
              resizeMode="contain"
              style={styles.footerImage}
            />
            <TouchableOpacity
              onPress={() => setImagePath("")}
              style={styles.footerButton}
            >
              <Text style={styles.footerButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
    if (filePath) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer filePath={filePath} />
          <TouchableOpacity
            onPress={() => setFilePath("")}
            style={styles.footerButton}
          >
            <Text style={styles.footerButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath, replyingMessage]);

  const scrollToBottomComponent = () => (
    <FontAwesome name="angle-double-down" size={22} color="#333" />
  );

  const handleMenuOption = (option) => {
    setMenuVisible(false);
    switch (option) {
      case "Delete Chat":
        // Handle delete chat logic here
        break;
      case "Block User":
        // Handle block user logic here
        setshowBlockModal(true);
        break;
      case "Report User":
        // Handle report user logic here
        Alert.alert("Report User", "User reported successfully");
        break;
      default:
        break;
    }
  };

  const CustomInputToolbar = (props) => {
    const textInputRef = useRef(null);

    const handleInputTextChanged = (text) => {
      setmessageText(text);
      console.log("entered text:", text);
    };

    // Debounced handle for the search input
    const debouncedMessageChange = useCallback(
      (text) => {
        const handler = setTimeout(() => {
          handleInputTextChanged(text);
        }, 300); // Adjust the debounce time (300ms is typical)

        return () => {
          clearTimeout(handler);
        };
      },
      [handleInputTextChanged] // Include handleFilterChange as a dependency
    );

    // Emit 'typing' event when the user is typing
    useEffect(() => {
      if (messageText !== "") {
        socket.emit("typing", {
          chatId: chatId,
          userId: sender._id,
          isTyping: messageText.length > 0,
        });
      }
    }, [messageText]);

    return (
      <View className="w-full flex-row items-center justify-between px-2 pb-10">
        <TouchableOpacity onPress={_pickDocument} style={styles.plusIcon}>
          <SVGImage
            source={{
              uri: "https://res.cloudinary.com/ddgiqvgov/image/upload/v1727302019/app_icons/Add_a8av27.svg",
            }}
            alt="plus icon"
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        {/* Message Input Field */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ flex: 1, marginHorizontal: 5 }}
        >
          <TextInput
            className="bg-[#F8F9FE] rounded-full w-full min-h-[40] px-4"
            placeholder="Type a message..."
            placeholderTextColor="#B0B0B0"
            value={messageText}
            onChangeText={(text) => {
              setmessageText(text);
              debouncedMessageChange(text);
            }} // Handle input change
            ref={textInputRef}
            multiline
            blurOnSubmit={false} // Prevent keyboard from dismissing on submit
            onFocus={() => {
              if (textInputRef.current) {
                textInputRef.current.focus();
              }
            }}
          />
        </ScrollView>

        {/* Send Button */}
        <TouchableOpacity
          onPress={() => {
            onSend([
              {
                text: messageText,
                user: { _id: sender._id },
                createdAt: new Date(),
              },
            ]);
            setmessageText(""); // Clear input field after sending message
          }}
          style={{
            ...styles.sendButton,
            backgroundColor: colors.primary_blue,
          }}
          className="mb-[2] flex items-center justify-center w-[40] h-[40] rounded-full"
        >
          <FontAwesome name="send" size={15} color={"white"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ChatHeader />

      {messages.length > 0 ? (
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: sender._id,
          }}
          renderBubble={renderBubble}
          alwaysShowSend={true}
          renderSend={renderSend}
          renderChatEmpty={EmptyMessage}
          // renderSend={renderSend}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
          renderChatFooter={renderChatFooter}
          // loadEarlier={true}
          renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
        />
      ) : (
        <EmptyMessage isLoading={messageLoading} />
      )}

      {/* chat menu modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            {["Block User", "Cancel"].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMenuOption(option)}
              >
                <Text style={styles.menuItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* message menu modal */}
      <Modal
        visible={messageMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            {messageMenuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMessageMenuOption(option)}
              >
                <Text style={styles.menuItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      <BlockChatModal
        message={`You are about to block this user. Do you wish to continue?`}
        onClose={(e) => {
          setshowBlockModal(false);
        }}
        onAccept={blockChat}
        show={showBlockModal}
      />
      <DeleteMessageModal
        message={`You are about to delete this message. Do you wish to continue?`}
        onClose={(e) => {
          setshowDeleteModal(false);
        }}
        onAccept={deleteMessage}
        show={showDeleteModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 20,
  },
  paperClip: {
    marginTop: 8,
    marginHorizontal: 5,
    transform: [{ rotateY: "180deg" }],
  },
  sendButton: { marginRight: 10 },
  sendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatFooter: {
    shadowColor: "#1F2687",
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    flexDirection: "row",
    padding: 5,
    borderTopRadius: 300,
    backgroundColor: colors.primary_mint,
  },
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  textTime: {
    fontSize: 10,
    color: "white",
    textAlign: "right",
    padding: 10,
    marginLeft: 2,
  },
  buttonFooterChat: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    right: 3,
    top: -2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  buttonFooterChatImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    left: 66,
    top: -4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  textFooterChat: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  headerTextContainer: {},
  headerText: {
    fontFamily: "DMSans-Bold",
    fontSize: 14,
  },
  lastSeenText: {
    fontSize: 12,
    color: "gray",
  },
  footerImage: {
    height: 200,
    width: "100%",
    // height:'100%'
  },
  footerButton: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    right: 3,
    top: -2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  bubbleRight: {
    backgroundColor: "#007AFF",
  },
  bubbleLeft: {
    backgroundColor: "#F8F9FE",
  },
  bubbleTextRight: {
    color: "#fff",
  },
  bubbleTextLeft: {
    color: "#2C2C2E",
  },

  fileContainerRight: {
    backgroundColor: "#007AFF",
  },
  fileContainerLeft: {
    backgroundColor: "#F8F9FE",
  },
  fileTextRight: {
    color: "#fff",
  },
  fileTextLeft: {
    color: "#000",
  },
  menuContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  menu: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 18,
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  replyFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  replyingToText: {
    flex: 1,
    fontStyle: "italic",
    color: "#555",
  },
});

export default Chat;
