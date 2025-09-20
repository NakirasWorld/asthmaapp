import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors, utils } from "../styles/tw";

import DashboardScreen from "../screens/DashboardScreen";
import MedsScreen from "../screens/MedsScreen";
import LogScreen from "../screens/LogScreen";
import InsightsScreen from "../screens/InsightsScreen";
import EducationScreen from "../screens/EducationScreen";

const Tab = createBottomTabNavigator();

// Custom tab bar component for the special center Log button
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={{ position: "relative" }}>
      {/* Floating Log Button */}
      {state.routes.map((route: any, index: number) => {
        if (route.name === "Log") {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View
              key={index}
              style={{
                position: "absolute",
                top: -28, // Float above the tab bar
                left: "50%",
                transform: [{ translateX: -28 }], // Center the 56px button
                zIndex: 10,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={onPress}
                style={[
                  utils.bgPrimary,
                  utils.itemsCenter,
                  utils.justifyCenter,
                  {
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  },
                ]}
              >
                <Ionicons name="add" size={28} color={colors.white} />
              </TouchableOpacity>
              <Text
                style={[
                  utils.textXs,
                  utils.mt1,
                  {
                    color: isFocused ? colors.primary : colors.gray500,
                    fontWeight: isFocused ? "600" : "400",
                  },
                ]}
              >
                Log
              </Text>
            </View>
          );
        }
        return null;
      })}

      {/* Main Tab Bar */}
      <View
        style={[
          utils.flexRow,
          utils.bgWhite,
          {
            height: 90, // Increased height to accommodate floating button
            paddingBottom: 34, // Extra padding for iPhone home indicator
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.gray200,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          if (route.name === "Log") {
            // Skip the Log button as it's rendered above
            return <View key={index} style={[utils.flex1]} />;
          }

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get icon name based on route
          let iconName: any;
          switch (route.name) {
            case "Home":
              iconName = isFocused ? "home" : "home-outline";
              break;
            case "Meds":
              iconName = isFocused ? "medical" : "medical-outline";
              break;
            case "Insights":
              iconName = isFocused ? "analytics" : "analytics-outline";
              break;
            case "Education":
              iconName = isFocused ? "library" : "library-outline";
              break;
            default:
              iconName = "help-outline";
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[utils.flex1, utils.itemsCenter, utils.py1]}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? colors.primary : colors.gray500}
              />
              <Text
                style={[
                  utils.textXs,
                  utils.mt1,
                  {
                    color: isFocused ? colors.primary : colors.gray500,
                    fontWeight: isFocused ? "600" : "400",
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Meds"
        component={MedsScreen}
        options={{
          tabBarLabel: "Meds",
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{
          tabBarLabel: "Log",
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarLabel: "Insights",
        }}
      />
      <Tab.Screen
        name="Education"
        component={EducationScreen}
        options={{
          tabBarLabel: "Education",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
