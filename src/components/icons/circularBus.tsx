import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

interface IOwnProps {
  sizeIconBus: number;
  sizeIconCircular: number;
  style?: StyleProp<ViewStyle>;
  colorIcon?: string;
}

const CircularBusIcon: React.FC<IOwnProps> = ({
  sizeIconBus,
  sizeIconCircular,
  colorIcon,
  style,
}) => {
  return (
    <View
      style={
        style || {
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          flex: 1,
        }
      }
    >
      <View
        style={{
          position: "absolute",
          zIndex: 9,
        }}
      >
        <SimpleLineIcons
          name="refresh"
          size={sizeIconCircular}
          color={colorIcon || "#bfbfbf"}
        />
      </View>
      <FontAwesome6
        name="bus-simple"
        size={sizeIconBus}
        color={colorIcon || "#bfbfbf"}
      />
    </View>
  );
};

export default CircularBusIcon;
