// src/screens/main/CreateActivityScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAppStore } from '../../state/store.ts';
import { Activity, ActivityCategory } from '../../types/activityTypes.ts';
import { theme } from '../../constants/theme.ts';
import { CreateActivityTabProps } from '../../navigation/navigationTypes.ts'; // For navigation

const CreateActivityScreen: React.FC<CreateActivityTabProps<'CreateActivity'>> = ({
  navigation,
}) => {
  const addActivityToStore = useAppStore(state => state.addActivity);
  // Assuming apiAddActivity is for a real backend. For mock, we might just use addActivityToStore.
  // const apiAddActivity = useAppStore(state => state.apiAddActivity);
  const currentUser = useAppStore(state => state.currentUser);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState<Date | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState(''); // For MVP, user inputs URL

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (selectedDate: Date) => {
    setDateTime(selectedDate);
    hideDatePicker();
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return false;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter a location.');
      return false;
    }
    if (!dateTime) {
      Alert.alert('Validation Error', 'Please select a date and time.');
      return false;
    }
    if (!imageUrl.trim()) {
      Alert.alert('Validation Error', 'Please enter an image URL.');
      return false;
    }
    // Basic URL validation (very simple)
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid image URL (starting with http:// or https://).',
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    setIsSubmitting(true);

    // Ensure currentUser is available, otherwise assign a default or handle error
    if (!currentUser) {
      Alert.alert('Error', 'User not found. Cannot create activity.');
      setIsSubmitting(false);
      return;
    }

    const newActivityData: Omit<Activity, 'id' | 'creatorId'> = {
      title,
      description,
      category: category!, // Category is validated, so it should exist
      location,
      dateTime: dateTime!.toISOString(), // DateTime is validated
      imageUrl,
    };

    try {
      // For MVP, we'll use a mock ID generation and add directly to store
      const mockId = `activity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const activityWithId: Activity = {
        ...newActivityData,
        id: mockId,
        creatorId: currentUser.userId, // Use current user's ID
      };

      addActivityToStore(activityWithId); // Add to Zustand store

      Alert.alert('Success', 'Activity created successfully!');
      // Reset form or navigate away
      setTitle('');
      setDescription('');
      setCategory(undefined);
      setLocation('');
      setDateTime(undefined);
      setImageUrl('');
      // Consider navigating to Discover or MyPlanned tab
      navigation.navigate('CreateActivity'); // Or to a success/confirmation screen if you have one
    } catch (error) {
      console.error('Failed to create activity:', error);
      Alert.alert('Error', 'Failed to create activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const activityCategories: ActivityCategory[] = [
    'Arts',
    'Food',
    'Learning',
    'Outdoor',
    'Social',
    'Sports',
    'Other',
  ];

  const DateTimePickerModalComponent = DateTimePickerModal as any;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Suggest a New Activity</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Sunset Hike at Griffith Park"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={theme.colors.darkGray}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tell us more about the activity..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor={theme.colors.darkGray}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {activityCategories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, category === cat && styles.categoryButtonSelected]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                category === cat && styles.categoryButtonTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Griffith Observatory Trailhead"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor={theme.colors.darkGray}
      />

      <Text style={styles.label}>Date & Time</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>
          {dateTime ? dateTime.toLocaleString() : 'Select Date and Time'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModalComponent
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()} // Optional: prevent past dates
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/image.jpg"
        value={imageUrl}
        onChangeText={setImageUrl}
        keyboardType="url"
        autoCapitalize="none"
        placeholderTextColor={theme.colors.darkGray}
      />
      <Text style={styles.imagePlaceholderInfo}>
        Please provide a direct link to an image (e.g., from Unsplash, Imgur).
      </Text>

      <View style={styles.submitButtonContainer}>
        {isSubmitting ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Button title="Create Activity" onPress={handleSubmit} color={theme.colors.primary} />
        )}
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
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl * 2, // Extra padding for scroll
  },
  header: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  label: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.cardBackground, // Slightly different background for inputs
    borderColor: theme.colors.lightGray,
    borderWidth: 1,
    borderRadius: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.m : theme.spacing.s, // Adjust padding for Android
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Android
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.m,
  },
  categoryButton: {
    backgroundColor: theme.colors.lightGray,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.spacing.l, // Pill shape
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
  },
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  categoryButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  categoryButtonTextSelected: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  datePickerButton: {
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.lightGray,
    borderWidth: 1,
    borderRadius: theme.spacing.xs,
    padding: theme.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  datePickerButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  imagePlaceholderInfo: {
    ...theme.typography.caption,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.xs,
  },
  submitButtonContainer: {
    marginTop: theme.spacing.xl,
  },
});

export default CreateActivityScreen;
