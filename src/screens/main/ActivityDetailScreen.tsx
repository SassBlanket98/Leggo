// src/screens/main/ActivityDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
// Removed direct import of useRoute and RouteProp if not used elsewhere for this specific case

import { useAppStore } from '../../state/store.ts';
import { Activity } from '../../types/activityTypes.ts';
import { theme } from '../../constants/theme.ts';

// Import the specific screen props type from your navigationTypes
// This assumes ActivityDetailScreen is part of either DiscoverStack or MyPlannedStack
// and you've defined corresponding props types like DiscoverScreenProps or MyPlannedScreenProps.

// Let's use a more generic approach if it can be reached from multiple stacks,
// or pick one if you know its primary stack.
// For example, if using DiscoverStackParamList:
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  DiscoverStackParamList,
  MyPlannedStackParamList,
} from '../../navigation/navigationTypes.ts';

// It seems your navigationTypes.ts already sets up CompositeScreenProps.
// Let's refine the type for ActivityDetailScreen based on how it's used in AppNavigator.
// In AppNavigator, ActivityDetail is a screen in DiscoverNavigator and MyPlannedNavigator.

// This type represents the props passed when 'ActivityDetail' is a screen
// in a NativeStack Navigator whose ParamList includes 'ActivityDetail'.
type ActivityDetailScreenProps = NativeStackScreenProps<
  DiscoverStackParamList & MyPlannedStackParamList, // Combine if parameters are identical
  'ActivityDetail'
>;

// If ActivityDetailScreenProps is already well-defined in navigationTypes.ts, you could import that.
// For now, let's define it locally for clarity.

const ActivityDetailScreen: React.FC<ActivityDetailScreenProps> = ({ route }) => {
  // Destructure route from props
  const { activityId } = route.params;

  // ... rest of your component logic remains the same
  const getActivityById = (id: string) =>
    useAppStore.getState().allActivities.find(act => act.id === id);
  const addInterestedActivity = useAppStore(state => state.addInterestedActivity);
  const removeInterestedActivity = useAppStore(state => state.removeInterestedActivity);
  const interestedActivityIds = useAppStore(state => state.interestedActivityIds);

  const [activity, setActivity] = useState<Activity | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    const fetchedActivity = getActivityById(activityId);
    setActivity(fetchedActivity);
    setIsLoading(false);
    if (fetchedActivity) {
      setIsInterested(interestedActivityIds.includes(fetchedActivity.id));
    }
  }, [activityId, interestedActivityIds, getActivityById]); // Added getActivityById to dependencies

  const handleInterested = () => {
    if (activity) {
      addInterestedActivity(activity.id);
      setIsInterested(true);
      Alert.alert('Activity Added', `${activity.title} has been added to your planned activities.`);
    }
  };

  const handleNotInterested = () => {
    if (activity) {
      removeInterestedActivity(activity.id);
      setIsInterested(false);
      Alert.alert(
        'Activity Removed',
        `${activity.title} has been removed from your planned activities.`,
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Activity not found.</Text>
      </View>
    );
  }

  const formattedDate = new Date(activity.dateTime).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: activity.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{activity.title}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.categoryBadge}>{activity.category}</Text>
        </View>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{activity.description}</Text>
        <Text style={styles.label}>Date & Time:</Text>
        <Text style={styles.infoText}>{formattedDate}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.infoText}>{activity.location}</Text>
        <Text style={styles.label}>Suggested by:</Text>
        <Text style={styles.infoText}>{activity.creatorId}</Text>
        <View style={styles.buttonRow}>
          {!isInterested ? (
            <Button
              title="I'm Interested!"
              onPress={handleInterested}
              color={theme.colors.primary}
            />
          ) : (
            <Button
              title="Not Interested Anymore"
              onPress={handleNotInterested}
              color={theme.colors.darkGray}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: theme.spacing.m,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
  },
  categoryBadge: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.secondary,
    color: theme.colors.background,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.s,
    overflow: 'hidden',
    fontWeight: 'bold',
    marginRight: theme.spacing.s,
  },
  label: {
    ...theme.typography.h2,
    fontSize: 18,
    color: theme.colors.text,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.m,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.s,
  },
  buttonRow: {
    marginTop: theme.spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ActivityDetailScreen;

