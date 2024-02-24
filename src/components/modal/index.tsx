import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ModalHeader from "./modelHeader";
import Entypo from "react-native-vector-icons/Entypo";
import { ContextMap } from "@/context";
import { api } from "@/service/configRequestAPI";
import ErrorMessage from "../feedback/errorMessage";
import ItemListSearchLine, { IDataLine } from "./itemListSearchLine";

interface IOwnProps {
  lineSearch: string;
}

const ModalSearchLine: React.FC<IOwnProps> = ({ lineSearch }) => {
  const [listLinesFounds, setListLineFounds] = useState<IDataLine[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, setIsOpen, authApiSPTrans } = useContext(ContextMap);

  useEffect(() => {
    const search = async () => {
      try {
        await authApiSPTrans();
        const response = await api.get(
          `/Linha/Buscar?termosBusca=${lineSearch}`
        );
        setListLineFounds(response.data);
      } catch (error) {
        setListLineFounds(undefined);
      } finally {
      }
    };

    search();
  }, [lineSearch]);

  return (
    isOpen && (
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 3,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "black",
            width: "100%",
            height: "100%",
            opacity: 0.7,
            position: "absolute",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setIsOpen(false)}
          ></TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "white",
            width: "90%",
            height: "50%",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <ModalHeader
            title="Linhas de ônibus"
            onIsOpen={setIsOpen}
            showCloseButton
          />
          {(isLoading && (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          )) || (
            <FlatList
              data={listLinesFounds}
              contentContainerStyle={{
                flex: listLinesFounds?.length > 0 ? 0 : 1,
                padding: 10,
              }}
              renderItem={({ item }) => (
                <ItemListSearchLine
                  key={item.cl}
                  onIsLoading={setIsLoading}
                  data={item}
                />
              )}
              ListEmptyComponent={() =>
                (listLinesFounds && (
                  <ErrorMessage
                    title={`Não encontramos nenhum ônibus com a linha: ${
                      lineSearch || "não informado"
                    }`}
                    mxText={50}
                  >
                    <Entypo name="emoji-sad" size={50} color="#bfbfbf" />
                  </ErrorMessage>
                )) || <ErrorMessage />
              }
            />
          )}
        </View>
      </View>
    )
  );
};

export default ModalSearchLine;
