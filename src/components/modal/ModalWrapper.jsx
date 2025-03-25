import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";

const ModalWrapperComponent = ({ customComponent, show }) => {
  return (
    <Modal transparent animationType="fade" visible={show}>
      <View
        className=" flex flex-col h-full items-center justify-center w-full "
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{width:"100%"}}>{customComponent}</ScrollView>
      </View>
    </Modal>
  );
};

export default ModalWrapperComponent;

// const styles = StyleSheet.create({});
