import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { deviceWidth, styles } from "../metrics/styles";
import { Video } from "expo-av";
import playIcon from "../../../assets/icons/play-icon.png";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/AppContext";

const PostItem = ({ item }) => {
  const postWidth = deviceWidth - 40;
  const videoRef = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const navigation = useNavigation();
  const { setTabBarVisible } = useAppContext();

  return (
    <View style={{ width: deviceWidth }} className=" bg-[#494B4D] p-4 my-[2px]">
      {/* Post information || header */}
      <View className="flex-row items-center">
        <Image source={item.icon} className="h-11 w-11" resizeMode="contain" />

        <Text
          style={styles.textbold}
          className="text-white max-w-[164px] text-sm ml-1"
        >
          {item.author}
        </Text>
      </View>

      {/* Post text */}
      <Text
        style={styles.textmedium}
        numberOfLines={3}
        className="text-white text-sm my-3 ml-[5px] h-[57px]"
      >
        {item.text}
      </Text>

      {/* Post image */}
      {item.type == "image" && (
        <TouchableOpacity
          className="rounded-[22px]"
          underlayColor={"#00000030"}
          onPress={() => {
            navigation.navigate("Home", {
              screen: "ImageExpand",
              params: { image: item.source },
            });
            setTabBarVisible(false);
          }}
        >
          <Image
            source={item.source}
            resizeMode="contain"
            style={{ height: postWidth * 0.7 }}
            className="w-full  bg-gray-900 rounded-[22px]"
          />
        </TouchableOpacity>
      )}

      {/* Post video */}
      {item.type == "video" && (
        <View>
          <Video
            ref={videoRef}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            style={{ height: postWidth * 0.7 }}
            source={{
              uri: item.source,
            }}
            useNativeControls
            isLooping
            resizeMode="cover"
            className="w-full bg-gray-900 rounded-[22px]"
          />

          {/* Play button */}
          {!status.isPlaying ? (
            <TouchableOpacity
              className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center bg-[#00000080] rounded-[22px]"
              onPress={() =>
                status.isPlaying
                  ? videoRef.current.pauseAsync()
                  : videoRef.current.playAsync()
              }
            >
              <Image source={playIcon} className="h-10 w-10" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default PostItem;
