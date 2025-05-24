// src/screens/main/DiscoverActivitiesScreen.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppStore, AppState } from '../../state/store';
import { Activity } from '../../types/activityTypes';
import ActivityCard from '../../components/activities/ActivityCard';
import { theme } from '../../constants/theme';
import { DiscoverScreenProps } from '../../navigation/navigationTypes';
import SwipeableCardStack from 'react-native-swipeable-card-stack';

const DiscoverActivitiesScreen: React.FC<DiscoverScreenProps<'DiscoverActivities'>> = props => {
  const { navigation } = props; // Destructure from props

  const allActivities = useAppStore((state: AppState) => state.allActivities);
  const interestedActivityIds = useAppStore((state: AppState) => state.interestedActivityIds);
  const addInterestedActivity = useAppStore((state: AppState) => state.addInterestedActivity);

  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const discoverableActivities = useMemo(() => {
    return allActivities.filter(act => !interestedActivityIds.includes(act.id));
  }, [allActivities, interestedActivityIds]);

  const cardStackRef = useRef<SwipeableCardStack>(null);

  useEffect(() => {
    if (allActivities.length > 0) {
      setIsLoading(false);
    }
    setCurrentCardIndex(0);
  }, [allActivities]);

  useEffect(() => {
    if (discoverableActivities.length > 0 || allActivities.length > 0) {
      setIsLoading(false);
    }
  }, [discoverableActivities, allActivities]);

  const handleSwipeRight = (activity: Activity) => {
    if (activity) {
      addInterestedActivity(activity.id);
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handleSwipeLeft = (activity: Activity) => {
    if (activity) {
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

  if (discoverableActivities.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noMoreCardsText}>No More Activities</Text>
        <Text style={styles.noMoreCardsSubtitle}>Check back later or suggest something new!</Text>
      </View>
    );
  }

  if (currentCardIndex >= discoverableActivities.length && discoverableActivities.length > 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noMoreCardsText}>That's all for now!</Text>
        <Text style={styles.noMoreCardsSubtitle}>You've seen all available activities.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        <SwipeableCardStack
          ref={cardStackRef}
          data={discoverableActivities.slice(currentCardIndex)}
          renderItem={(
            item: Activity, // item is an Activity
          ) => <ActivityCard activity={item} onPress={() => handleTapCard(item)} />}
          onSwipedRight={itemIndex =>
            handleSwipeRight(discoverableActivities[currentCardIndex + itemIndex])
          }
          onSwipedLeft={itemIndex =>
            handleSwipeLeft(discoverableActivities[currentCardIndex + itemIndex])
          }
          stackSeparation={15}
          stackScale={5}
          style={styles.cardStackStyle}
          loop={false}
          onSwipedAll={() => {
            console.log('Swiped all cards in the current stack data');
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
    flex: 1,
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
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  actionButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontSize: 18,
  },
});

export default DiscoverActivitiesScreen;
