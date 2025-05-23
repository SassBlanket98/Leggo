// src/screens/main/DiscoverActivitiesScreen.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppStore, AppState } from '../../state/store'; // Added AppState
import { Activity } from '../../types/activityTypes';
import ActivityCard from '../../components/activities/ActivityCard';
import { theme } from '../../constants/theme';
import { DiscoverScreenProps } from '../../navigation/navigationTypes';
import SwipeableCardStack from 'react-native-swipeable-card-stack'; // Assuming named export

const DiscoverActivitiesScreen: React.FC<DiscoverScreenProps<'DiscoverActivities'>> = ({
  navigation,
}) => {
  const allActivities = useAppStore((state: AppState) => state.allActivities);
  const interestedActivityIds = useAppStore((state: AppState) => state.interestedActivityIds);
  const addInterestedActivity = useAppStore((state: AppState) => state.addInterestedActivity);
  // const removeActivityFromAll = useAppStore((state: AppState) => state.removeActivityFromAll); // Keep if used

  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const discoverableActivities = useMemo(() => {
    return allActivities.filter(act => !interestedActivityIds.includes(act.id));
  }, [allActivities, interestedActivityIds]);

  const cardStackRef = useRef<SwipeableCardStack>(null); // Typed the ref

  useEffect(() => {
    // Ensure activities are loaded, Zustand store initializes them
    if (allActivities.length > 0) {
        setIsLoading(false);
    }
    setCurrentCardIndex(0); // Reset index when discoverable activities change
  }, [allActivities]); // Depend on allActivities to re-evaluate loading and discoverable


  // This effect handles the case where initially allActivities might be empty
  // and then get populated by the store.
  useEffect(() => {
    if (discoverableActivities.length > 0 || allActivities.length > 0) { // Check allActivities too
      setIsLoading(false);
    }
  }, [discoverableActivities, allActivities]);


  const handleSwipeRight = (activity: Activity) => {
    if (activity) { // Ensure activity is defined
        addInterestedActivity(activity.id);
        setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handleSwipeLeft = (activity: Activity) => { // Ensure activity is defined
    if (activity) {
        // For now, just advancing the index.
        // If you implement 'dismiss', you'd call removeActivityFromAll(activity.id) or similar.
        setCurrentCardIndex(prev => prev + 1);
    }
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

  if (discoverableActivities.length === 0) { // Check discoverable, not currentCardIndex here
    return (
      <View style={styles.centered}>
        <Text style={styles.noMoreCardsText}>No More Activities</Text>
        <Text style={styles.noMoreCardsSubtitle}>
          Check back later or suggest something new!
        </Text>
      </View>
    );
  }

  // This condition handles when all discoverable cards have been swiped
  if (currentCardIndex >= discoverableActivities.length && discoverableActivities.length > 0) {
    return (
        <View style={styles.centered}>
            <Text style={styles.noMoreCardsText}>That's all for now!</Text>
            <Text style={styles.noMoreCardsSubtitle}>
                You've seen all available activities.
            </Text>
        </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        <SwipeableCardStack
          ref={cardStackRef}
          data={discoverableActivities.slice(currentCardIndex)}
          renderItem={( activity: Activity ) => ( // item is an Activity
            <ActivityCard activity={activity} onPress={() => handleTapCard(activity)} />
          )}
          onSwipedRight={(itemIndex) => handleSwipeRight(discoverableActivities[currentCardIndex + itemIndex])}
          onSwipedLeft={(itemIndex) => handleSwipeLeft(discoverableActivities[currentCardIndex + itemIndex])}
          stackSeparation={15}
          stackScale={5}
          style={styles.cardStackStyle}
          loop={false} // Important: Set to false to not loop when out of cards
          onSwipedAll={() => {
            // This callback is useful if you don't want to manage currentCardIndex manually for "no more cards"
            // For now, our currentCardIndex logic handles it.
            console.log("Swiped all cards in the current stack data");
          }}
        />
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (cardStackRef.current && discoverableActivities.length > currentCardIndex) {
                 cardStackRef.current.swipeLeft();
            }
          }}
        >
          <Text style={styles.actionButtonText}>PASS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (cardStackRef.current && discoverableActivities.length > currentCardIndex) {
                cardStackRef.current.swipeRight();
            }
          }}
        >
          <Text style={styles.actionButtonText}>LIKE</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.m,
  },
  cardStackStyle: {
     flex: 1, // Ensure the stack takes up available space
     width: '100%',
     alignItems: 'center',
     justifyContent: 'center',
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
    paddingVertical: theme.spacing.l, // Increased padding
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background, // Match background
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  actionButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: 30, // More circular
    elevation: 4, // Slightly more shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120, // Ensure buttons have a decent size
  },
   actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary, // Or choose a different color
    fontSize: 18,
  }
});

export default DiscoverActivitiesScreen;