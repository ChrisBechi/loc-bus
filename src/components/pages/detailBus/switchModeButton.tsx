import React, { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";

export enum EDisplayMode {
  INTINERARY = 1,
  TIMES = 2,
}

interface IOwnProps {
  displayMode: EDisplayMode;
  onDisplayMode: Dispatch<SetStateAction<EDisplayMode>>;
  colorLine: string;
}

const SwitchModeButton: React.FC<IOwnProps> = ({
  displayMode,
  colorLine,
  onDisplayMode,
}) => {
  return (
    <View style={styles.wrapperSwitchBurron}>
      <TouchableOpacity
        style={{
          ...styles.switchButton,
          backgroundColor:
            displayMode === EDisplayMode.INTINERARY ? colorLine : "white",
        }}
        onPress={() => onDisplayMode(EDisplayMode.INTINERARY)}
      >
        <Text
          style={{
            textAlign: "center",
            color: displayMode === EDisplayMode.INTINERARY ? "white" : "black",
          }}
        >
          Itinerário
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.switchButton,
          backgroundColor:
            displayMode === EDisplayMode.TIMES ? colorLine : "white",
        }}
        onPress={() => onDisplayMode(EDisplayMode.TIMES)}
      >
        <Text
          style={{
            textAlign: "center",
            color: displayMode === EDisplayMode.TIMES ? "white" : "black",
          }}
        >
          Horário
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SwitchModeButton;
