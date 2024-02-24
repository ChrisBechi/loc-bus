import React from "react";
import { Image, Text, View } from "react-native";
import { styleDefination } from "../../../../pages/detailBus/styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import StopBusTotem from "../../../../assets/images/stop_bus_totem.png";
import CircularBusIcon from "@/components/icons/circularBus";

interface IOwnProps {
  data: {
    stopName: string;
    refs: string;
    isCircular: boolean;
    nextBusTime?: string;
  };
  colorLine: string;
  colorFontLine: string;
  finishBorderRadius: boolean;
}

const ItemIntinerary: React.FC<IOwnProps> = ({
  data,
  colorLine,
  colorFontLine,
  finishBorderRadius,
}) => {
  const style = styleDefination(colorLine, colorFontLine, finishBorderRadius);

  return (
    <View style={style.wrapperListItinerary}>
      <View style={style.wrapperTimeLine}>
        <View style={style.timeLine} />
        <View style={style.boxArrowDown}>
          {(data.isCircular && (
            <CircularBusIcon sizeIconBus={14} sizeIconCircular={33} />
          )) || <AntDesign name="arrowdown" size={25} />}
        </View>
      </View>
      <View style={style.boxInformation}>
        <View style={style.boxLabel}>
          <Text>
            <Text style={style.boldLabel}>Parada: </Text>
            {data.stopName}
          </Text>
          {data.refs && (
            <Text style={{ marginTop: 5 }}>
              <Text style={style.boldLabel}>Referência: </Text>
              {data.refs}
            </Text>
          )}
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 10,
              flexDirection: "row",
              marginRight: 3,
            }}
          >
            <Text style={style.nextBusLabel}>Próximo ônibus: </Text>
            <View style={style.boxTime}>
              <Text style={style.labelTime}>{data.nextBusTime || "--:--"}</Text>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: "flex-end" }}>
          <Image source={StopBusTotem} />
        </View>
      </View>
    </View>
  );
};

export default ItemIntinerary;
