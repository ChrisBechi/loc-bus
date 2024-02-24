import React, { useContext } from "react";
import { Image, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import busIcon from "../../assets/images/bus-icon.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ContextMap } from "@/context";
import CircularBusIcon from "../icons/circularBus";
import { api } from "@/service/configRequestAPI";

export interface IDataLine {
  cl: number; // codigo da linha
  lc: boolean; // se é circular
  lt: string; // primeira parte do numero da linha
  sl: number; // 1 - ida  2 - volta
  tl: number; // segunda parte do numero da linha
  tp: string; // indo para
  ts: string; // voltande de
}

interface IOwnProps {
  data: IDataLine;
  onIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemListSearchLine: React.FC<IOwnProps> = ({ data, onIsLoading }) => {
  const { onLoadingPositionBus } = useContext(ContextMap);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        marginBottom: 5,
        padding: 10,
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={() =>
        onLoadingPositionBus(
          `${data.lt}-${data.tl}-${data.sl - 1}`,
          data.cl,
          onIsLoading
        )
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {(data.lc && (
          <CircularBusIcon
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 50,
              flex: 0,
            }}
            sizeIconBus={20}
            sizeIconCircular={48}
            colorIcon="black"
          />
        )) || <Image source={busIcon} style={{ width: 45, height: 45 }} />}
        <View style={{ marginLeft: data.lc ? 5 : 10 }}>
          <View
            style={{
              backgroundColor: "red",
              width: 65,
              paddingHorizontal: 5,
              paddingVertical: 3,
              marginBottom: 3,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: "bold",
                color: "white",
              }}
            >{`${data.lt}-${data.tl}`}</Text>
          </View>
          <Text>{`Ida: ${data.sl === 1 ? data.tp : data.ts}`}</Text>
          <Text>{`Volta: ${data.sl === 1 ? data.ts : data.tp}`}</Text>
        </View>
      </View>
      <MaterialIcons name="arrow-forward-ios" size={20} />
    </TouchableOpacity>
  );
};

export default ItemListSearchLine;
