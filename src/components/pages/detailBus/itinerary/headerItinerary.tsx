import { ContextMap } from "../../../../context";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styleHeader } from "../../../../pages/detailBus/styles";
import { useNavigation } from "@react-navigation/native";

interface IOwnProps {
  colorLine: string;
  numberStopBus: number;
  shapeId: string;
  updatedRequest?: string;
  lineNumber: string;
}

const HeaderItinerary: React.FC<IOwnProps> = ({
  colorLine,
  numberStopBus,
  shapeId,
  updatedRequest,
  lineNumber,
}) => {
  const { getLineRoute, refModalize } = useContext(ContextMap);
  const navigation = useNavigation<any>();

  const styleHeaderFlatList = styleHeader(colorLine);

  return (
    <View style={styleHeaderFlatList.wrapperHeaderSubInfo}>
      <TouchableOpacity
        style={styleHeaderFlatList.buttonSeeRoute}
        onPress={() => {
          getLineRoute(shapeId, colorLine, lineNumber).then(() => {
            refModalize?.current?.close();
            navigation.navigate("/");
          });
        }}
      >
        <Text style={{ color: "white" }}>Ver trajeto</Text>
      </TouchableOpacity>
      <View>
        <Text
          style={{
            textAlign: "right",
            fontWeight: "bold",
          }}
        >
          Total de paradas: {numberStopBus}
        </Text>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          Hora da atualização: {updatedRequest || "--:--"}
        </Text>
      </View>
    </View>
  );
};

export default HeaderItinerary;
