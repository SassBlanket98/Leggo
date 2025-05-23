// src/components/activities/InterestedActivityRow.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native-web';
import { Activity } from '../../types/activityTypes.ts';
import { theme } from '../../constants/theme.ts';
import Icon from 'react-native-vector-icons/Ionicons.ts';

interface InterestedActivityRowProps {
  activity: Activity;
  onPress: () => void;
  onUnmark: () => void;
}

const InterestedActivityRow: React.FC<InterestedActivityRowProps> = ({
  activity,
  onPress,
  onUnmark,
}) => {
  const formattedDate = new Date(activity.dateTime).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: activity.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {activity.title}
        </Text>
        <Text style={styles.dateTime}>{formattedDate}</Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {activity.location}
        </Text>
      </View>
      <TouchableOpacity onPress={onUnmark} style={styles.unmarkButton}>
        <Icon name="trash-outline" size={24} color={theme.colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: theme.spacing.s,
    marginRight: theme.spacing.m,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  dateTime: {
    ...theme.typography.caption,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.xs,
  },
  location: {
    ...theme.typography.caption,
    color: theme.colors.darkGray,
  },
  unmarkButton: {
    padding: theme.spacing.s,
  },
});

export default InterestedActivityRow;
