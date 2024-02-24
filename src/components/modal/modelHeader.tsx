import React from "react";
import { Text, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

interface IOwnProps {
  showCloseButton?: boolean;
  onIsOpen(isOpen: boolean): void;
  title: string;
}

const ModalHeader: React.FC<IOwnProps> = ({
  showCloseButton,
  onIsOpen,
  title,
}) => {
  return (
    <View
      style={{
        padding: 10,
        alignItems: "center",
        marginHorizontal: 10,
      }}
    >
      <Text style={{ fontSize: 21 }}>{title}</Text>
      {showCloseButton && (
        <AntDesign
          name="close"
          style={{
            position: "absolute",
            marginVertical: "auto",
            right: 0,
            top: 9,
          }}
          size={27}
          onPress={() => onIsOpen(false)}
        />
      )}
    </View>
  );
};

export default ModalHeader;
