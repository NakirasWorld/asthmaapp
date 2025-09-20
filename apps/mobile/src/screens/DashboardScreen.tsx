import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { utils, colors } from "../styles/tw";

interface DashboardScreenProps {
  // Add any props needed for navigation
}

// Weekly Calendar Component
const WeeklyCalendarComponent: React.FC = () => {
  // Get current date and week
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate the start of the week (Saturday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay - 1); // Go back to Saturday

  // Generate week days
  const weekDays = [];
  const dayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    // Mock logging status - in real app this would come from API
    const hasLogged = Math.random() > 0.3; // Random for demo
    const isToday = date.toDateString() === today.toDateString();
    const isFuture = date > today;

    weekDays.push({
      day: dayNames[i],
      date: date.getDate(),
      hasLogged,
      isToday,
      isFuture,
    });
  }

  return (
    <View>
      <View style={[utils.flexRow, utils.justifyBetween]}>
        {weekDays.map((day, index) => (
          <View key={index} style={[utils.itemsCenter, { minWidth: 40 }]}>
            {/* Day name */}
            <Text
              style={[
                utils.textSm,
                utils.mb2,
                {
                  color: day.isToday ? colors.primary : colors.gray600,
                  fontWeight: day.isToday ? "600" : "400",
                },
              ]}
            >
              {day.day}
            </Text>

            {/* Date */}
            <Text
              style={[
                utils.textLg,
                utils.fontMedium,
                utils.mb2,
                {
                  color: day.isToday ? colors.primary : colors.gray800,
                },
              ]}
            >
              {day.date}
            </Text>

            {/* Status indicator */}
            <View
              style={[
                {
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: day.isFuture
                    ? colors.gray200
                    : day.hasLogged
                    ? colors.success
                    : day.isToday
                    ? colors.warning
                    : colors.gray300,
                },
              ]}
            >
              {(day.hasLogged || day.isToday) && !day.isFuture && (
                <View
                  style={[utils.flex1, utils.itemsCenter, utils.justifyCenter]}
                >
                  <Ionicons name="leaf" size={14} color={colors.white} />
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Medication Card Component
interface MedicationCardProps {
  name: string;
  currentDose: number;
  totalDose: number;
  isCompleted: boolean;
  onPress?: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  name,
  currentDose,
  totalDose,
  isCompleted,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[utils.mb3]} onPress={onPress} disabled={!onPress}>
      <View
        style={[
          utils.flexRow,
          utils.itemsCenter,
          utils.justifyBetween,
          utils.p4,
          utils.roundedLg,
          {
            backgroundColor: colors.white,
            elevation: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
          },
        ]}
      >
        <View style={[utils.flexRow, utils.itemsCenter]}>
          <View
            style={[
              utils.mr3,
              {
                width: 40,
                height: 40,
                backgroundColor: colors.gray100,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Ionicons name="medical" size={20} color={colors.gray600} />
          </View>
          <View>
            <Text
              style={[
                utils.textBase,
                utils.fontMedium,
                { color: colors.gray900 },
              ]}
            >
              {name}
            </Text>
            <Text style={[utils.textSm, { color: colors.gray600 }]}>
              Dose: {currentDose}/{totalDose}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              width: 24,
              height: 24,
              backgroundColor: isCompleted ? colors.success : colors.gray200,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Ionicons
            name="checkmark"
            size={16}
            color={isCompleted ? colors.white : colors.gray500}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  // Mock asthma control status - in real app this would come from API/state
  const isWellControlled = true; // This will determine which image to show

  const handleLogYourDay = () => {
    // TODO: Navigate to logging screen or show modal
    console.log("Log your day pressed");
  };

  return (
    <SafeAreaView style={[utils.flex1, { backgroundColor: "#F1F1F1" }]}>
      {/* Header and Hero Section - White Card */}
      <View
        style={{
          backgroundColor: colors.white,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingBottom: 24,
        }}
      >
        {/* Header */}
        <View
          style={[
            utils.flexRow,
            utils.itemsCenter,
            utils.justifyBetween,
            utils.px6,
            utils.py4,
          ]}
        >
          {/* Child Dropdown */}
          <TouchableOpacity
            style={[
              utils.flexRow,
              utils.itemsCenter,
              utils.px4,
              utils.py2,
              utils.roundedLg,
              { backgroundColor: colors.gray100 },
            ]}
          >
            <Text
              style={[
                utils.textBase,
                utils.fontMedium,
                utils.mr2,
                { color: colors.gray700 },
              ]}
            >
              Maya
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.gray700} />
          </TouchableOpacity>

          {/* Right Side Icons */}
          <View style={[utils.flexRow, utils.itemsCenter, { gap: 16 }]}>
            {/* Messaging Icon */}
            <TouchableOpacity>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={colors.gray700}
              />
            </TouchableOpacity>

            {/* Settings Icon */}
            <TouchableOpacity>
              <Ionicons
                name="settings-outline"
                size={24}
                color={colors.gray700}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={[utils.px6]}>
          {/* Motivational Text, Button, and Bird Illustration */}
          <View style={[utils.flexRow, utils.itemsCenter, utils.mb6]}>
            {/* Left side - Text and Button (70% width) */}
            <View style={[{ flex: 0.9, paddingRight: 16 }]}>
              <Text
                style={[
                  utils.text2xl,
                  utils.fontBold,
                  utils.mb4,
                  { color: colors.gray900, lineHeight: 32 },
                ]}
              >
                Every check-in adds to your asthma insights!
              </Text>

              {/* Log Your Day Button - Half width */}
              <TouchableOpacity
                onPress={handleLogYourDay}
                style={[
                  utils.flexRow,
                  utils.itemsCenter,
                  utils.justifyCenter,
                  utils.py3,
                  utils.px4,
                  utils.roundedLg,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    utils.textSm,
                    utils.fontMedium,
                    utils.mr2,
                    { color: colors.white },
                  ]}
                >
                  Log your day
                </Text>
                <View
                  style={[
                    utils.itemsCenter,
                    utils.justifyCenter,
                    {
                      width: 20,
                      height: 20,
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color={colors.white}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Right side - Bird Illustration (30% width) */}
            <View
              style={[
                utils.itemsCenter,
                utils.justifyCenter,
                {
                  flex: 0.1,
                  height: 120,
                },
              ]}
            >
              <Image
                source={require("../../assets/bird-illustration.png")}
                style={{
                  width: 180,
                  height: 180,
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Weekly Calendar */}
          <WeeklyCalendarComponent />
        </View>
      </View>

      {/* Main Content with Gray Background */}
      <ScrollView
        style={[utils.flex1]}
        contentContainerStyle={[utils.p2, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* Asthma Control Status Section */}
        <View style={[utils.mb6]}>
          <Text
            style={[
              utils.textLg,
              utils.fontSemibold,
              utils.m2,
              { color: colors.gray900 },
            ]}
          >
            Asthma Control Status
          </Text>

          {/* Single Control Status Tile */}
          <View
            style={[
              utils.roundedLg,
              {
                height: 200,
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              },
            ]}
          >
            <Image
              source={
                isWellControlled
                  ? require("../../assets/well-controlled.png")
                  : require("../../assets/poorly-controlled.png")
              }
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 1,
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Additional content */}
        <View style={[utils.m4]}>
          <Text style={[utils.textBase, { color: colors.gray600 }]}>
            Track your symptoms daily to better understand your asthma patterns
            and control level.
          </Text>
        </View>

        {/* Medication Section */}
        <View style={[utils.m2]}>
          <View
            style={[
              utils.flexRow,
              utils.itemsCenter,
              utils.justifyBetween,
              utils.mb4,
            ]}
          >
            <Text
              style={[
                utils.textLg,
                utils.fontSemibold,
                { color: colors.gray900 },
              ]}
            >
              Medication
            </Text>
            <View
              style={[
                utils.px3,
                utils.py1,
                utils.roundedFull,
                { backgroundColor: colors.success },
              ]}
            >
              <Text
                style={[
                  utils.textSm,
                  utils.fontMedium,
                  { color: colors.white },
                ]}
              >
                3/3
              </Text>
            </View>
          </View>

          {/* Medication Items */}
          <MedicationCard
            name="Albuterol Inhaler"
            currentDose={2}
            totalDose={2}
            isCompleted={true}
            onPress={() => console.log("Med 1 pressed")}
          />

          <MedicationCard
            name="Budesonide"
            currentDose={1}
            totalDose={2}
            isCompleted={false}
            onPress={() => console.log("Med 2 pressed")}
          />
        </View>

        {/* Feature Cards */}
        <View style={[utils.mb6]}>
          {/* Weekly Flight Challenge */}
          <TouchableOpacity
            style={[
              utils.p6,
              utils.roundedLg,
              utils.mb4,
              utils.flexRow,
              utils.itemsCenter,
              {
                backgroundColor: "#7CB342",
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                minHeight: 80,
              },
            ]}
          >
            <View style={[utils.mr4, { opacity: 0.3 }]}>
              <Ionicons name="cube-outline" size={40} color={colors.white} />
            </View>
            <View style={[utils.flex1]}>
              <Text
                style={[utils.textLg, utils.fontBold, { color: colors.white }]}
              >
                Weekly Flight Challenge
              </Text>
            </View>
          </TouchableOpacity>

          {/* Reports */}
          <TouchableOpacity
            style={[
              utils.p6,
              utils.roundedLg,
              utils.mb4,
              utils.flexRow,
              utils.itemsCenter,
              {
                backgroundColor: "#FF9800",
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                minHeight: 80,
              },
            ]}
          >
            <View style={[utils.mr4, { opacity: 0.3 }]}>
              <Ionicons
                name="document-text-outline"
                size={40}
                color={colors.white}
              />
            </View>
            <View style={[utils.flex1]}>
              <Text
                style={[utils.textLg, utils.fontBold, { color: colors.white }]}
              >
                Reports
              </Text>
            </View>
          </TouchableOpacity>

          {/* Well Being Tracker */}
          <TouchableOpacity
            style={[
              utils.p6,
              utils.roundedLg,
              utils.mb4,
              utils.flexRow,
              utils.itemsCenter,
              {
                backgroundColor: "#2196F3",
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                minHeight: 80,
              },
            ]}
          >
            <View style={[utils.mr4, { opacity: 0.3 }]}>
              <Ionicons
                name="pie-chart-outline"
                size={40}
                color={colors.white}
              />
            </View>
            <View style={[utils.flex1]}>
              <Text
                style={[utils.textLg, utils.fontBold, { color: colors.white }]}
              >
                Well being Tracker
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
