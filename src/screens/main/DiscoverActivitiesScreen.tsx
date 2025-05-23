// src/screens/main/DiscoverActivitiesScreen.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppStore } from '../../state/store.ts';
import { Activity } from '../../types/activityTypes.ts';
import ActivityCard from '../../components/activities/ActivityCard.tsx';
import { theme } from '../../constants/theme.ts';
import { DiscoverScreenProps } from '../../navigation/navigationTypes.ts'; // For navigation.navigate
import { SwipeableCardStack } from 'react-native-swipeable-card-stack'; // Adjusted import

const DiscoverActivitiesScreen: React.FC<DiscoverScreenProps<'DiscoverActivities'>> = ({
  navigation,
}) => {
  const allActivities = useAppStore(state => state.allActivities);
  const interestedActivityIds = useAppStore(state => state.interestedActivityIds);
  const addInterestedActivity = useAppStore(state => state.addInterestedActivity);
  const removeActivityFromAll = useAppStore(state => state.removeActivityFromAll); // Assuming this exists and is used for swipe left
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Filter out already interested activities from the discoverable pool
  const discoverableActivities = useMemo(() => {
    return allActivities.filter(act => !interestedActivityIds.includes(act.id));
  }, [allActivities, interestedActivityIds]);

  const cardStackRef = useRef<React.ElementRef<typeof SwipeableCardStack>>(null);

  useEffect(() => {
    if (discoverableActivities.length > 0) {
      setIsLoading(false);
    }
    // Reset currentCardIndex when discoverableActivities changes, e.g., after all cards are swiped
    setCurrentCardIndex(0);
  }, [allActivities, discoverableActivities]);

  const handleSwipeRight = (activity: Activity) => {
    addInterestedActivity(activity.id);
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleSwipeLeft = (activity: Activity) => {
    // Optionally, implement a way to "dismiss" an activity without adding to interested
    // For now, just increment index. If you have a removeActivityFromAll or similar:
    // removeActivityFromAll(activity.id); // Or some other logic for left swipe
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleTapCard = (activity: Activity) => {
    navigation.navigate('ActivityDetail', { activityId: activity.id });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Check if there are no more cards to show *after* filtering
  if (discoverableActivities.length === 0 || currentCardIndex >= discoverableActivities.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noMoreCardsText}>No More Activities</Text>
        <Text style={styles.noMoreCardsSubtitle}>
          Check back later or try adjusting your preferences!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        <SwipeableCardStack
          ref={cardStackRef}
          data={discoverableActivities.slice(currentCardIndex)} // Pass only remaining cards
          renderItem={(item: Activity) => (
            <ActivityCard activity={item} onPress={() => handleTapCard(item)} />
          )}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          stackSeparation={15}
          stackScale={5}
          style={styles.cardStackStyle}
        />
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => cardStackRef.current?.swipeLeft()} // Changed to onClick for web compatibility
        >
          <Text>Pass</Text>
          {/* Replace with Icon */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => cardStackRef.current?.swipeRight()} // Changed to onClick for web compatibility
        >
          <Text>Like</Text>
          {/* Replace with Icon */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  deckContainer: {
    flex: 1, // Take up most of the space for the cards
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.m, // Some space at the top
  },
  cardStackStyle: {
    // Optional: if the library needs specific container styling
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  noMoreCardsText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  noMoreCardsSubtitle: {
    ...theme.typography.body,
    color: theme.colors.darkGray,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  actionButton: {
    backgroundColor: theme.colors.background, // Or a subtle color
    padding: theme.spacing.m,
    borderRadius: 50, // Circular buttons
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});

export default DiscoverActivitiesScreen;
