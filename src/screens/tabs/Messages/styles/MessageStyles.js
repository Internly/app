import styled from "styled-components";

export const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  background-color: #ffffff;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  alignitem: center;
`;

export const UserImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 10px;
  width: 300px;
`;

export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
  width:"100%"
`;

export const UserName = styled.Text`
  font-size: 13px;
  font-family: DMSans-Bold;
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #272727;
  font-family: DMSans-Light;
`;

export const MessageText = styled.Text`
  font-size: 11px;
  color: #71727A;
  font-family: DMSans-Light;
`;

export const TextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  alignitem: center;
`;

export const UnseenMessage = styled.Text`
  font-size: 14px;
  color: "red";
`;
