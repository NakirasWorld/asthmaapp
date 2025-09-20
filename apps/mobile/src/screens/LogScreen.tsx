import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { utils, colors } from "../styles/tw";

const LogScreen: React.FC = () => {
  const handleLogSymptoms = () => {
    // TODO: Navigate to symptom logging screen
    console.log("Log symptoms pressed");
  };

  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={["top"]}>
      <View
        style={[utils.flex1, utils.itemsCenter, utils.justifyCenter, utils.p6]}
      >
        <Ionicons name="create-outline" size={64} color={colors.primary} />
        <Text
          style={[
            utils.textLg,
            utils.fontMedium,
            utils.mt4,
            { color: colors.gray800, textAlign: "center" },
          ]}
        >
          Log Your Symptoms
        </Text>
        <Text
          style={[
            utils.textSm,
            utils.mt2,
            utils.mb8,
            { color: colors.gray500, textAlign: "center" },
          ]}
        >
          Track how you're feeling today
        </Text>

        <TouchableOpacity
          onPress={handleLogSymptoms}
          style={[
            utils.bgPrimary,
            utils.py4,
            utils.px8,
            utils.roundedLg,
            utils.itemsCenter,
            { minWidth: 200 },
          ]}
        >
          <Text
            style={[utils.textBase, utils.fontMedium, { color: colors.white }]}
          >
            Start Logging
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LogScreen;
