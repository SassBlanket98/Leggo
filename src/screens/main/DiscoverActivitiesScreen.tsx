// src/screens/main/DiscoverActivitiesScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import SwipeableCardStack, { CardContainerRef } from 'react-native-swipeable-card-stack';
import ActivityCard from '../../components/activities/ActivityCard';
import { useAppStore } from '../../state/store';
import { Activity } from '../../types/activityTypes';
import { theme } from '../../constants/theme';
import { DiscoverScreenProps } from '../../navigation/navigationTypes'; // For navigation.navigate
import Icon from 'react-native-vector-icons/Ionicons';

const DiscoverActivitiesScreen: React.FC<DiscoverScreenProps<'DiscoverActivities'>> = ({
  navigation,
}) => {
  const allActivities = useAppStore(state => state.allActivities);
  const interestedActivityIds = useAppStore(state => state.interestedActivityIds);
  const addInterestedActivity = useAppStore(state => state.addInterestedActivity);
  const removeActivityFromAll = useAppStore(state => state.removeActivityFromAll); // New action to remove from discoverable pool

  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Filter out already interested activities from the discoverable pool
  const discoverableActivities = useMemo(() => {
    return allActivities.filter(act => !interestedActivityIds.includes(act.id));
  }, [allActivities, interestedActivityIds]);

  const cardStackRef = React.useRef<CardContainerRef>(null);

  useEffect(() => {
    // Simulate loading activities initially or if they change
    if (allActivities.length > 0) {
      setIsLoading(false);
    }
    // Reset index if discoverable activities list becomes empty or changes significantly
    setCurrentCardIndex(0);
  }, [allActivities, discoverableActivities]);

  const handleSwipeRight = (activity: Activity) => {
    console.log('Swiped right on:', activity.title);
    addInterestedActivity(activity.id);
    // The library handles removing the card from its internal stack.
    // We might want to remove it from `allActivities` if we don't want it to reappear
    // or manage a separate "seen" list. For now, adding to interested is enough.
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleSwipeLeft = (activity: Activity) => {
    console.log('Swiped left on:', activity.title);
    // Potentially mark as "not interested" or "seen" in the store
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleTapCard = (activity: Activity) => {
    navigation.navigate('ActivityDetail', { activityId: activity.id });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading activities...</Text>
      </View>
    );
  }

  if (
    !discoverableActivities ||
    discoverableActivities.length === 0 ||
    currentCardIndex >= discoverableActivities.length
  ) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noMoreCardsText}>No more activities to discover!</Text>
        <Text style={styles.noMoreCardsSubtitle}>Check back later or suggest your own.</Text>
        {/* Optionally, a button to refresh or go to create activity screen */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        <SwipeableCardStack
          ref={cardStackRef}
          data={discoverableActivities.slice(currentCardIndex)} // Pass only remaining cards
          renderCard={(item: Activity) => (
            <ActivityCard activity={item} onPress={() => handleTapCard(item)} />
          )}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          // onSwipeTop and onSwipeBottom can be added if needed
          // Other props like animationType, disableTopSwipe, etc. can be configured.
          // See react-native-swipeable-card-stack documentation for all options.
          // Example:
          // stackOffsetY={10}
          // stackOffsetX={0}
          // stackSize={3} // Number of cards visible in the stack
          // infiniteSwipe={false}
          // disableRightSwipe={false}
          // disableLeftSwipe={false}
          // cardContainerStyle={styles.cardStackStyle}
          onStackEmpty={() => console.log('Stack is empty!')} // This might be where we show "No more cards"
        />
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => cardStackRef.current?.swipeLeft()}
        >
          <Icon name="close-outline" size={36} color={theme.colors.error} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => cardStackRef.current?.swipeRight()}
        >
          <Icon name="heart-outline" size={36} color={theme.colors.primary} />
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
