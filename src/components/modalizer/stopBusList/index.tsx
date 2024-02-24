import { ContextMap } from "../../../context";
import ItemBusLine, {
  verifySchedule,
} from "../../../components/modalizer/stopBusList/itemBusLine";
import { ILinesInCurrentBuStop, IStopBus } from "../../../components/types";
import React, { ReactNode, memo, useContext, useEffect, useState } from "react";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../service/configRequestAPI";
import { style } from "./style";
import { IDetailBus, IRouteBus, ITimeNextBus } from "./types";

interface IOwnProps {
  currentStopBus: IStopBus;
  linesInCurrentBuStop: ILinesInCurrentBuStop[];
}

const BusStop: React.FC<IOwnProps> = ({
  linesInCurrentBuStop,
  currentStopBus,
}) => {
  const { supabase, authApiSPTrans } = useContext(ContextMap);
  const [listLineBus, setListLineBus] = useState<ReactNode[]>([]);
  const [timeRequestNextBus, setTimeRequestNextBus] = useState<string>("--:--");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDetailRoute = async (line: string) => {
    const { data } = await supabase
      .from("route")
      .select()
      .eq("route_short_name", line);

    return data[0];
  };

  const getDetailBus = async (line: string, direction: number) => {
    const responseTimeNextBus = await api.get<IDetailBus[]>(
      "/Linha/BuscarLinhaSentido",
      {
        params: {
          termosBusca: line,
          sentido: direction,
        },
      }
    );

    return responseTimeNextBus.data[0];
  };

  const getTimeNextBus = async (codline: number, stopId: number) => {
    const responseTimeNextBus = await api.get<ITimeNextBus>("/Previsao", {
      params: {
        codigoParada: stopId,
        codigoLinha: codline,
      },
    });

    setTimeRequestNextBus(responseTimeNextBus.data.hr);

    return responseTimeNextBus;
  };

  const generateItensLine = async () => {
    setIsLoading(true);
    authApiSPTrans()
      .then(async (authResponse) => {
        if (authResponse.data) {
          const listLineBusByStopId = await Promise.all(
            linesInCurrentBuStop.map(async (line, idx) => {
              const lineSeparateId = line.trip_id.split("-");
              const lineNumber = `${lineSeparateId[0]}-${lineSeparateId[1]}`;
              const direction = parseInt(lineSeparateId[2]) + 1;

              try {
                const detailBus = await getDetailBus(lineNumber, direction);

                const timeNextBus = await getTimeNextBus(
                  detailBus.cl,
                  line.stop_id
                );

                const detailRoute = await getDetailRoute(lineNumber);

                const detailLines: IRouteBus = {
                  lineBus: lineNumber,
                  direction: lineSeparateId[2],
                  route: detailRoute,
                  nextBusTime: timeNextBus.data,
                  stopBusId: line.stop_id,
                };

                const isSchedule = await verifySchedule(
                  line.stop_id,
                  lineNumber,
                  lineSeparateId[2],
                  detailLines.nextBusTime?.p?.l[0]?.vs[0]
                );

                return (
                  <ItemBusLine
                    supabase={supabase}
                    key={line.trip_id}
                    data={detailLines}
                    hasSchedule={isSchedule}
                  />
                );
              } catch (error) {
                console.log(error.response.data);
              }
            })
          );

          setListLineBus(listLineBusByStopId);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    generateItensLine();
  }, []);

  return (
    <View style={{ padding: 15, paddingBottom: 20 }}>
      {(isLoading && (
        <View>
          <ActivityIndicator
            color="#0099e1"
            style={{ justifyContent: "center", height: 350 }}
            size="large"
          />
        </View>
      )) || (
        <>
          <View style={style.boxTitle}>
            <Text style={style.title}>{currentStopBus.stop_name}</Text>
          </View>
          <Text style={style.updatedAt}>
            Atualizado em: {timeRequestNextBus}
          </Text>
          {(listLineBus.length === 0 && <></>) || listLineBus}
          <View style={style.wrapperBottomUpdate}>
            <TouchableOpacity
              style={style.bottomUpdate}
              onPress={generateItensLine}
            >
              <SimpleLineIcons
                onPress={generateItensLine}
                name="reload"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default memo(BusStop);
