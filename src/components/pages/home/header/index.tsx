import { ContextMap, IHistory, IPlotLocationBus } from "@/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

interface IOwnProps {
  setLineSearch: React.Dispatch<React.SetStateAction<string>>;
}

const HeaderHome: React.FC<IOwnProps> = ({ setLineSearch }) => {
  //state
  const [listHistory, setListHistory] = useState<IHistory[]>([]);
  const [overlayer, setOverlayer] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  // Hooks
  const navigation = useNavigation<any>();
  const refInputText = useRef<TextInput>();
  const {
    setIsOpen,
    plotMarkerInMap,
    visibleHandleHeader,
    onLoadingPositionBus,
    refAnimationHistory,
    refAnimationOpacity,
    refAnimationOverlay,
  } = useContext(ContextMap);

  useEffect(() => {
    const getHistory = async () => {
      const history = await AsyncStorage.getItem("historyBus");
      if (history) {
        const decodeList = JSON.parse(history);
        setListHistory(decodeList);
      }
    };

    getHistory();
  }, [plotMarkerInMap]);

  return (
    <>
      <Animated.View
        style={{
          backgroundColor: "#e2001a",
          position: "absolute",
          height: refAnimationOverlay,
          width: "100%",
          top: 0,
          opacity: refAnimationOpacity,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          zIndex: 2,
        }}
      ></Animated.View>
      {overlayer && (
        <TouchableOpacity
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 1,
          }}
          onPress={() => refInputText.current.blur()}
        />
      )}
      <SafeAreaView
        style={{
          position: "absolute",
          zIndex: 2,
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            marginHorizontal: 50,
            paddingHorizontal: 15,
            borderRadius: 20,
            overflow: "hidden",
            marginTop: 10,
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Ionicons name="search-sharp" size={18} />
          <TextInput
            style={{
              paddingVertical: 13,
              paddingHorizontal: 10,
              marginHorizontal: 5,
              flex: 1,
            }}
            ref={refInputText}
            keyboardType="default"
            returnKeyType="search"
            onPressIn={() => {
              visibleHandleHeader(true);
              setOverlayer(true);
            }}
            onBlur={() => {
              visibleHandleHeader(false);
              setOverlayer(false);
            }}
            onSubmitEditing={(value) => {
              if (value.nativeEvent.text) {
                setLineSearch(value.nativeEvent.text);
                setIsOpen(true);
              }
            }}
            placeholder="Pesquisar linha"
          />
        </View>
        <Animated.View
          style={{
            height: refAnimationHistory,
            backgroundColor: "white",
            marginHorizontal: 3,
            marginBottom: 3,
            borderRadius: 5,
          }}
        >
          <FlatList
            data={listHistory}
            contentContainerStyle={{
              padding: 5,
              flexDirection: "row",
            }}
            keyboardShouldPersistTaps="handled"
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const direction = parseInt(item.intinerary.slice(-1));
              return (
                <TouchableOpacity
                  style={{
                    height: "100%",
                    width: 60,
                    alignItems: "center",
                    padding: 5,
                  }}
                  onPress={() =>
                    onLoadingPositionBus(item.intinerary, item.cl, setLoad)
                  }
                >
                  <FontAwesome6Icon
                    name="bus-simple"
                    size={30}
                    color={direction ? "#3439ca" : "#2ca12c"}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      marginTop: 3,
                      color: direction ? "#3439ca" : "#2ca12c",
                      fontWeight: "bold",
                    }}
                  >
                    {item.intinerary?.slice(0, -2)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default HeaderHome;
