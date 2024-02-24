import { ILinesInCurrentBuStop } from "@/components/types";
import React from "react";
import { Text, View } from "react-native";
import { Modalize, ModalizeProps } from "react-native-modalize";
import { IHandles } from "react-native-modalize/lib/options";

interface IOwnProps {
  refModalizer: React.MutableRefObject<IHandles>;
  children: JSX.Element;
}

const StopBusModalizer: React.FC<IOwnProps> = ({ refModalizer, children }) => {
  return (
    <Modalize
      ref={refModalizer}
      snapPoint={390}
      closeSnapPointStraightEnabled={false}
    >
      {children}
    </Modalize>
  );
};

export default StopBusModalizer;
