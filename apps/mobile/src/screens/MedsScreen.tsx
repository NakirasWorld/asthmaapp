import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { utils, colors } from "../styles/tw";

const MedsScreen: React.FC = () => {
  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={["top"]}>
      <View style={[utils.flex1, utils.itemsCenter, utils.justifyCenter]}>
        <Ionicons name="medical-outline" size={64} color={colors.gray400} />
        <Text
          style={[
            utils.textLg,
            utils.fontMedium,
            utils.mt4,
            { color: colors.gray600, textAlign: "center" },
          ]}
        >
          Medications
        </Text>
        <Text
          style={[
            utils.textSm,
            utils.mt2,
            { color: colors.gray500, textAlign: "center" },
          ]}
        >
          Medication tracking will be implemented here
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MedsScreen;
