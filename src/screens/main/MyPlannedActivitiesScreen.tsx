// src/screens/main/MyPlannedActivitiesScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useAppStore } from '../../state/store';
import { Activity } from '../../types/activityTypes';
import InterestedActivityRow from '../../components/activities/InterestedActivityRow';
import { theme } from '../../constants/theme';
import { MyPlannedScreenProps } from '../../navigation/navigationTypes'; // For navigation.navigate

const MyPlannedActivitiesScreen: React.FC<MyPlannedScreenProps<'MyPlannedActivitiesList'>> = ({
  navigation,
}) => {
  const interestedActivityIds = useAppStore(state => state.interestedActivityIds);
  const allActivities = useAppStore(state => state.allActivities);
  const removeInterestedActivity = useAppStore(state => state.removeInterestedActivity);

  const interestedActivities = useMemo(() => {
    return interestedActivityIds
      .map(id => allActivities.find(activity => activity.id === id))
      .filter((activity): activity is Activity => activity !== undefined); // Type guard to filter out undefined
  }, [interestedActivityIds, allActivities]);

  const handleUnmark = (activityId: string, activityTitle: string) => {
    Alert.alert(
      'Remove Activity',
      `Are you sure you want to remove "${activityTitle}" from your planned activities?`,
    );
  };

  if (interestedActivities.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>You haven't marked any activities as interested yet.</Text>
        <Text style={styles.emptySubtitle}>
          Swipe right on activities in the Discover tab to add them here!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={interestedActivities}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <InterestedActivityRow
            activity={item}
            onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
            onUnmark={() => handleUnmark(item.id, item.title)}
          />
        )}
        ListHeaderComponent={<Text style={styles.header}>Your Planned Activities</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  emptyText: {
    ...theme.typography.h2,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  emptySubtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.darkGray,
  },
  header: {
    ...theme.typography.h1,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.background, // To cover items during scroll if sticky
    color: theme.colors.primary,
  },
});

export default MyPlannedActivitiesScreen;
