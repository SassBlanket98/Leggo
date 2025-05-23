// src/components/activities/ActivityCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Activity } from '../../types/activityTypes';
import { theme } from '../../constants/theme';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void; // For tapping to see details
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // 90% of screen width
const CARD_HEIGHT = CARD_WIDTH * 1.25; // Maintain an aspect ratio

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress }) => {
  const formattedDate = new Date(activity.dateTime).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={styles.cardContainer}
    >
      <Image source={{ uri: activity.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.categoryBadge}>{activity.category}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {activity.description}
          </Text>
          <Text style={styles.dateTime}>{formattedDate}</Text>
          <Text style={styles.location}>📍 {activity.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: theme.spacing.m,
    backgroundColor: theme.colors.cardBackground,
    overflow: 'hidden', // Ensures image corners are rounded
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: theme.spacing.s, // For stacked appearance if not using a deck swiper that handles it
  },
  image: {
    width: '100%',
    height: '60%', // Allocate portion of card to image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end', // Text at the bottom
    backgroundColor: 'rgba(0,0,0,0.1)', // Slight dark overlay for text readability on image
  },
  textContainer: {
    padding: theme.spacing.m,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background for text block
    borderBottomLeftRadius: theme.spacing.m, // Match card radius
    borderBottomRightRadius: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.background, // White text on overlay
    marginBottom: theme.spacing.xs,
    fontWeight: 'bold',
  },
  categoryBadge: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.spacing.xs,
    alignSelf: 'flex-start',
    overflow: 'hidden', // Ensures borderRadius is applied
    marginBottom: theme.spacing.s,
    fontWeight: 'bold',
  },
  description: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.background, // White text
    marginBottom: theme.spacing.s,
    lineHeight: 20,
  },
  dateTime: {
    ...theme.typography.caption,
    color: theme.colors.lightGray,
    marginBottom: theme.spacing.xs,
  },
  location: {
    ...theme.typography.caption,
    color: theme.colors.lightGray,
  },
});

export default ActivityCard;
