import React, { useContext, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import busIcon from "../../../assets/images/bus-icon.png";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import spTransIcon from "../../../assets/images/logo-sptrans.png";
import { SupabaseClient } from "@supabase/supabase-js";
import { useNavigation } from "@react-navigation/native";
import { ContextMap } from "@/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { itemBusLineStyle } from "./style";
import { IRouteBus, IVehicleFound } from "./types";
import { addLeftZero } from "@/utils/complementZero";

interface IOwnProps {
  mtBox?: number;
  data: IRouteBus;
  hasSchedule: boolean;
  supabase: SupabaseClient<any, "public", any>;
}

export const verifySchedule = async (
  stopBusId: number,
  lineBus: string,
  direction: string,
  timeBus?: IVehicleFound
): Promise<boolean> => {
  const keyStorage = `${stopBusId}-${lineBus}-${direction}`;

  const storage = await AsyncStorage.getItem(keyStorage);
  if (storage) {
    const detailSchedule = JSON.parse(storage);
    if (timeBus) {
      if (timeBus.p !== detailSchedule.nextBus.p) {
        await AsyncStorage.removeItem(keyStorage);
        return false;
      } else {
        const currentDateTime = new Date();
        const mountDate = `${currentDateTime.getFullYear()}-${
          currentDateTime.getMonth() + 1
        }-${addLeftZero(currentDateTime.getDate())}T${addLeftZero(
          currentDateTime.getHours()
        )}:${addLeftZero(currentDateTime.getMinutes())}:00`;
        const dateSchedule = detailSchedule.schedule_bus;
        if (mountDate > dateSchedule) {
          await AsyncStorage.removeItem(keyStorage);
          return false;
        } else if (
          detailSchedule.nextBus &&
          timeBus?.t !== detailSchedule.nextBus.t
        ) {
          detailSchedule.nextBus.t = timeBus?.t;
          (detailSchedule.schedule_bus = `${currentDateTime.getFullYear()}-${
            currentDateTime.getMonth() + 1
          }-${currentDateTime.getDate()}T${timeBus?.t}:00`),
            await AsyncStorage.setItem(
              keyStorage,
              JSON.stringify(detailSchedule)
            );
        }
      }
    }
    return true;
  } else {
    return false;
  }
};

const ItemBusLine: React.FC<IOwnProps> = ({
  data,
  supabase,
  mtBox,
  hasSchedule,
}) => {
  const { scheduleNotification } = useContext(ContextMap);
  const [isSchedule, setIsSchedule] = useState<boolean>(hasSchedule);
  const navigation = useNavigation<any>();
  const lineDestination = data?.route?.route_long_name.split("-")[0] || "";

  const style = itemBusLineStyle(mtBox, data);

  let origin;
  let destination;

  const requestItinerary = async () => {
    navigation.navigate("DetailBus", {
      backgroundColorLine: `#${data?.route?.route_color || "0099e1"}`,
      colorTextLine: "white",
      numberLine: data?.lineBus || "----/--",
      direction: data?.direction || "",
      lineDestination,
    });
  };

  if (data.direction === "1") {
    origin = data?.route?.route_long_name.split("-")[0];
    destination = data?.route?.route_long_name.split("-")[1];
  } else {
    origin = data?.route?.route_long_name.split("-")[1];
    destination = data?.route?.route_long_name.split("-")[0];
  }

  const registerSchedule = async (): Promise<boolean> => {
    const date = new Date();
    const keyStorage = `${data.stopBusId}-${data.lineBus}-${data.direction}`;
    const prevision = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}T${data.nextBusTime?.p?.l[0]?.vs[0]?.t}:00`;

    const detailSchedule = JSON.stringify({
      lineBus: data.lineBus,
      direction: data.direction,
      nextBus: data.nextBusTime?.p?.l[0]?.vs[0],
      schedule_bus: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T${data.nextBusTime?.p?.l[0]?.vs[0]?.t}:00`,
    });

    try {
      await AsyncStorage.setItem(keyStorage, detailSchedule);
      return true;
    } catch (error) {
      return false;
    }
  };

  const scheduleBus = async () => {
    const timeBus = data.nextBusTime?.p?.l[0]?.vs[0]?.t;
    const beforeMinute = 2;

    if (timeBus) {
      const timeBusHour = parseInt(timeBus.split(":")[0]);
      const timeBusMinute = parseInt(timeBus.split(":")[1]);
      const date = new Date();
      date.setHours(timeBusHour);
      date.setMinutes(timeBusMinute - beforeMinute);

      const isSchedule = await verifySchedule(
        data.stopBusId,
        data.lineBus,
        data.direction
      );

      if (!isSchedule) {
        await scheduleNotification(
          {
            title: "À caminho!",
            body: `Seu ônibus ${data.lineBus}, está a ${beforeMinute} minuto de chegar no ponto perto de você. Fique atento para não perder o ônibus.`,
          },
          {
            hour: date.getHours(),
            minute: date.getMinutes(),
          }
        );

        const isRegister = await registerSchedule();

        if (isRegister) setIsSchedule(true);
      } else {
        alert("Linha já agendada");
      }
    }
  };

  const verifyAvaliableSchedule = (timeBus?: string) => {
    if (timeBus) {
      const beforeMinute = 2;
      const timeBusHour = parseInt(timeBus.split(":")[0]);
      const timeBusMinute = parseInt(timeBus.split(":")[1]);

      const currentDateTime = new Date();
      const nextBus = new Date();

      nextBus.setHours(timeBusHour);
      nextBus.setMinutes(timeBusMinute - beforeMinute);

      const mountCurrentDate = `${currentDateTime.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })}T${`T${currentDateTime.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })}`}`;

      if (
        `${timeBus}:00` <
        currentDateTime.toLocaleTimeString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        })
      ) {
        nextBus.setDate(nextBus.getDate() + 1);
      }

      const mountNextBusDate = `${nextBus.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })}T${`T${nextBus.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })}`}`;

      if (mountCurrentDate < mountNextBusDate) {
        return true;
      }
    } else {
      return false;
    }
  };

  return (
    <TouchableOpacity onPress={requestItinerary}>
      <View style={style.wrapper}>
        <View style={style.boxInformationLine}>
          <Image style={style.iconBus} source={busIcon} />
          <View style={style.boxText}>
            <Text style={style.textLineBus}>{data.lineBus}</Text>
            <Text style={style.description}>
              <Text style={{ fontWeight: "bold" }}>Ida: </Text>
              {origin || ""}
            </Text>
            <Text style={style.description}>
              <Text style={{ fontWeight: "bold" }}>Volta: </Text>
              {destination || ""}
            </Text>
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 6,
                flexDirection: "row",
                marginRight: 3,
              }}
            >
              <Text style={style.nextBusLabel}>Próximo ônibus: </Text>
              <View style={style.boxTime}>
                <Text style={style.labelTime}>
                  {data.nextBusTime?.p?.l[0]?.vs[0]?.t || "--:--"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {verifyAvaliableSchedule(data.nextBusTime?.p?.l[0]?.vs[0]?.t) ? (
          <MaterialIcon
            name="timer-outline"
            size={35}
            color={isSchedule ? "lightgray" : "#52D3D8"}
            onPress={scheduleBus}
          />
        ) : (
          <Image style={style.iconSPTrans} source={spTransIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemBusLine;
