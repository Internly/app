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
  Modal,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../../../data/colors";
import { SafeAreaView } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { AppContext } from "../../../../context/AppContext";
import MultipleEntryInput from "../../../../components/ui/MultipleEntryInput";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { useToast } from "react-native-toast-notifications";

const EditAdvert = ({ route }) => {
  const { advert } = route.params;
  const toast = useToast();
  const [title, setTitle] = useState(advert?.title || "");
  const [description, setDescription] = useState(advert?.description || "");
  const [totalBudget, setTotalBudget] = useState(advert?.totalBudget || 0);
  const [duration, setDuration] = useState(advert?.duration || "");
  const [priceAmount, setPriceAmount] = useState(advert?.budget?.amount || "");
  const [pricePeriod, setPricePeriod] = useState(
    advert?.budget?.period || "fixed"
  ); // Default value
  const [attachments, setAttachments] = useState([]);
  const [keywords, setKeywords] = useState(advert?.keywords || []);

  const [advertResponsibilities, setAdvertResponsibilities] = useState(
    advert?.responsibilities || []
  );
  const [advertRequirements, setAdvertRequirements] = useState(
    advert?.requirements || []
  );
  const navigation = useNavigation();

  const today = new Date();

  // date states

  const EndDateModal = renderDatePicker;
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(advert?.endDate || "");
  const [endedDate, setEndedDate] = useState("");

  const handleChangeEndDate = (propDate) => {
    setEndedDate(propDate);
  };

  const handleOnPressEndDate = () => {
    setOpenEndDatePicker(!openEndDatePicker);
  };

  // start date

  const StartDateModal = renderDatePicker;

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
  );
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [startedDate, setStartedDate] = useState(advert?.startDate || "");

  const handleChangeStartDate = (propDate) => {
    setStartedDate(propDate);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };
  const [files, setFiles] = useState([]);
  const { setAppLoading, getData } = useContext(AppContext);

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("totalBudget");
    formData.append("keywords", keywords);
    formData.append("responsibilies", advertResponsibilities);
    formData.append("requirements", advertRequirements);

    // Send formData to server
    try {
      setAppLoading(true);
      const token = await getData("authToken");
      const response = await fetch(`${baseUrl}/adverts/update/${advert?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
        body: formData,
      });

      console.log(response.body);
      if (response) {
        setAppLoading(false);

        Alert.alert("Success", "Advert edited successfully!");
        return navigation.goBack();
      }
      setAppLoading(false);
    } catch (error) {
      setAppLoading(false);
      console.error("Error submitting Advert:", error);
      toast.show(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to edit Advert."
      );
    }
  };

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result?.canceled) {
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
        console.log(attachments, " is atachments ", assets);
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
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: 20,
      }}
    >
      {/* Header */}
      <View className=" pb-5 px-4 w-full flex-row items-center justify-between mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>

        <View>
          <Text
            style={{ color: "#272727" }}
            className="text-black font-[DMSans-Medium] text-lg flex-1"
          >
            Edit Advert
          </Text>
        </View>
        <View />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Title</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <TextInput
                value={title}
                onChangeText={(value) => setTitle(value)}
                editable={true}
                placeholder="Title: e.g I am interested in your advert"
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{}}>Duration</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <TextInput
                value={duration}
                onChangeText={(value) => setDuration(value)}
                editable={true}
                placeholder="Duration: 2 weeks"
              />
            </View>
          </View>

          {/* startDate */}
          {/* <View
            style={{
              flexDirection: "column",
              marginBottom: 6
            }}
          >
            <Text style={{}}>Start date</Text>
            <TouchableOpacity
              onPress={handleOnPressStartDate}
              className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2"
            >
              <Text>{selectedStartDate}</Text>
            </TouchableOpacity>
          </View> */}

          {/* end date */}

          {/* <View
            style={{
              flexDirection: "column",
              marginBottom: 6
            }}
          >
            <Text style={{}}>End Date</Text>
            <TouchableOpacity
              onPress={handleOnPressEndDate}
              className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2"
            >
              <Text>{selectedEndDate}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6
            }}
          >
            <Text style={{}}>Price Amount($)</Text>
            <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <TextInput
                value={`${priceAmount}`}
                onChangeText={(value) => setPriceAmount(value)}
                editable={true}
                keyboardType="numeric"
                placeholder="Price: enter value in dollars($)"
              />
            </View>
          </View> */}

          {/* Dropdown for Price Period */}
          {/* <View
            style={{
              flexDirection: "column",
              marginBottom: 6
            }}
          >
            <Text style={{}}>Price Period</Text>
            <>
              <DropDownPicker
                open={open}
                value={pricePeriod}
                items={items}
                setOpen={setOpen}
                setValue={setPricePeriod}
                setItems={setItems}
                zIndex={9}

                // theme="DARK"
              />
            </>
          </View> */}
        </View>

        {/* total budget */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Total budget($)</Text>
          <View
            style={{
              height: 44,
              width: "100%",
              borderColor: "#80808070",
              borderWidth: 1,
              borderRadius: 4,
              marginVertical: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <TextInput
              value={totalBudget}
              onChangeText={(value) => setTotalBudget(value)}
              editable={true}
              keyboardType="numeric"
              placeholder="Total budget: enter value in dollars($)"
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Description</Text>
          <View
            style={{
              // height: 44,
              width: "100%",
              borderColor: "#80808070",
              borderWidth: 1,
              borderRadius: 4,
              marginVertical: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <TextInput
              value={description}
              onChangeText={(value) => setDescription(value)}
              editable={true}
              multiline
              placeholder="A detailed description of this advert. Make it simple to understand"
              style={{
                minHeight: 300,
                padding: 5,
                // height:312,
                textAlignVertical: "top",
              }}
              className="min-h-[300px]"
            />
          </View>
        </View>

        {/* advert Objectives */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Requirements</Text>
          <>
            <MultipleEntryInput
              label={""}
              preEntry={advertRequirements}
              onSelectionChange={(selection) =>
                setAdvertRequirements(selection)
              }
              placeholder={"What are the requirements of this advert"}
            />
          </>
        </View>

        {/* advert deliverables */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Responsibilities</Text>
          <>
            <MultipleEntryInput
              label={""}
              preEntry={advertResponsibilities}
              onSelectionChange={(selection) =>
                setAdvertResponsibilities(selection)
              }
              placeholder={"What are the expected responsibilities "}
            />
          </>
        </View>

        {/* keywords */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}}>Keywords</Text>
          <>
            <MultipleEntryInput
              label={""}
              preEntry={keywords}
              onSelectionChange={(selection) => setKeywords(selection)}
              placeholder={
                "Enter advert keywords, this is necessary for better search"
              }
            />
          </>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.primary_blue,
            height: 44,
            borderRadius: 6,
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
            Update Advert
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

function renderDatePicker({
  visible,
  minimumDate,
  selected,
  onDateChanged,
  onSelectedChange,
  onPress,
}) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000a",
        }}
      >
        <View
          style={{
            margin: 20,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            padding: 35,
            width: "90%",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <DatePicker
            mode="calendar"
            minimumDate={minimumDate}
            selected={selected}
            onDateChanged={onDateChanged}
            onSelectedChange={(date) => onSelectedChange(date)}
            options={{
              backgroundColor: colors.primary,
              textHeaderColor: "#469ab6",
              textDefaultColor: colors.white,
              selectedTextColor: colors.white,
              mainColor: "#469ab6",
              textSecondaryColor: colors.white,
              borderColor: "rgba(122,146,165,0.1)",
            }}
          />

          <TouchableOpacity onPress={onPress}>
            <Text style={{ color: colors.white }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#80808070",
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

export default EditAdvert;
