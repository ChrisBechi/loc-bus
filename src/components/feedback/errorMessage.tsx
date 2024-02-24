import React, { ReactNode } from "react";
import { DimensionValue, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface IErrorMessage {
  title?: string;
  children?: ReactNode;
  mxText?: number;
}

const ErrorMessage: React.FC<IErrorMessage> = ({ title, children, mxText }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -50,
      }}
    >
      {children || (
        <MaterialCommunityIcons
          name="server-network-off"
          size={50}
          color="#bfbfbf"
        />
      )}
      <Text
        style={{
          fontWeight: "bold",
          color: "#bfbfbf",
          marginTop: 10,
          fontSize: 16,
          textAlign: "center",
          marginHorizontal: mxText || 0,
        }}
      >
        {title || "Não foi possivel completar sua solicitação"}
      </Text>
    </View>
  );
};

export default ErrorMessage;
