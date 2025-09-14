import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { utils, colors } from '../styles/tw';

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
  const dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
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
            <Text style={[
              utils.textSm, 
              utils.mb2,
              { 
                color: day.isToday ? colors.primary : colors.gray600,
                fontWeight: day.isToday ? '600' : '400'
              }
            ]}>
              {day.day}
            </Text>
            
            {/* Date */}
            <Text style={[
              utils.textLg, 
              utils.fontMedium,
              utils.mb2,
              { 
                color: day.isToday ? colors.primary : colors.gray800,
              }
            ]}>
              {day.date}
            </Text>
            
            {/* Status indicator */}
            <View style={[
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
                      : colors.gray300
              }
            ]}>
              {(day.hasLogged || day.isToday) && !day.isFuture && (
                <View style={[utils.flex1, utils.itemsCenter, utils.justifyCenter]}>
                  <Ionicons 
                    name="leaf" 
                    size={14} 
                    color={colors.white} 
                  />
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const handleChildDropdown = () => {
    // TODO: Implement child selection dropdown
    console.log('Child dropdown pressed');
  };

  const handleMessaging = () => {
    // TODO: Implement messaging functionality
    console.log('Messaging pressed');
  };

  const handleSettings = () => {
    // TODO: Implement settings navigation
    console.log('Settings pressed');
  };

  const handleLogYourDay = () => {
    // TODO: Navigate to logging screen or show modal
    console.log('Log your day pressed');
  };

  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={['top']}>
      {/* Header */}
      <View style={[
        utils.flexRow,
        utils.itemsCenter,
        utils.justifyBetween,
        utils.px6,
        utils.py4,
        { backgroundColor: colors.white, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }
      ]}>
        {/* Child Dropdown */}
        <TouchableOpacity 
          onPress={handleChildDropdown}
          style={[utils.flexRow, utils.itemsCenter, utils.py2, utils.px3, utils.rounded, { backgroundColor: colors.gray100 }]}
        >
          <Text style={[utils.textBase, utils.fontMedium, { color: colors.gray800 }]}>
            Child 1
          </Text>
          <View style={{ marginLeft: 4 }}>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={colors.gray600}
            />
          </View>
        </TouchableOpacity>

        {/* Right Icons */}
        <View style={[utils.flexRow, utils.itemsCenter, { gap: 16 }]}>
          {/* Messaging Icon */}
          <TouchableOpacity 
            onPress={handleMessaging}
            style={[utils.p2]}
          >
            <Ionicons 
              name="chatbubble-outline" 
              size={24} 
              color={colors.gray700}
            />
          </TouchableOpacity>

          {/* Settings Icon */}
          <TouchableOpacity 
            onPress={handleSettings}
            style={[utils.p2]}
          >
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={colors.gray700}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={[utils.flex1]}
        contentContainerStyle={[utils.p6]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[utils.mb6]}>
          {/* Motivational Text and Bird Illustration */}
          <View style={[utils.flexRow, utils.itemsCenter, utils.mb6]}>
            <View style={[utils.flex1, { paddingRight: 16 }]}>
              <Text style={[
                utils.text2xl, 
                utils.fontBold, 
                { color: colors.gray900, lineHeight: 32 }
              ]}>
                Every check-in adds to your asthma insights!
              </Text>
            </View>
            
            {/* Bird Illustration Placeholder */}
            <View style={[
              utils.itemsCenter,
              utils.justifyCenter,
              { 
                width: 120, 
                height: 120, 
                backgroundColor: colors.gray100,
                borderRadius: 60 
              }
            ]}>
              <Ionicons 
                name="leaf-outline" 
                size={48} 
                color={colors.primary} 
              />
              <Text style={[utils.textXs, utils.mt1, { color: colors.gray500 }]}>
                Bird
              </Text>
            </View>
          </View>

          {/* Log Your Day Button */}
          <TouchableOpacity 
            onPress={handleLogYourDay}
            style={[
              utils.flexRow,
              utils.itemsCenter,
              utils.justifyCenter,
              utils.py4,
              utils.px6,
              utils.roundedLg,
              utils.mb6,
              { 
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }
            ]}
          >
            <Text style={[
              utils.textBase, 
              utils.fontMedium, 
              utils.mr2,
              { color: colors.white }
            ]}>
              Log your day
            </Text>
            <View style={[
              utils.itemsCenter,
              utils.justifyCenter,
              { 
                width: 24, 
                height: 24, 
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 12 
              }
            ]}>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>

          {/* Weekly Calendar */}
          <WeeklyCalendarComponent />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;