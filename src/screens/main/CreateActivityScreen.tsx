// src/screens/main/CreateActivityScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { useAppStore } from '../../state/store';
import { Activity, ActivityCategory } from '../../types/activityTypes'; // Assuming ActivityCategory is defined in activityTypes.ts
import { theme } from '../../constants/theme';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CreateActivityTabProps } from '../../navigation/navigationTypes'; // For navigation

// Define categories in types/activityTypes.ts or constants
// export type ActivityCategory = 'Outdoor' | 'Social' | 'Food' | 'Learning' | 'Arts' | 'Sports' | 'Other';
const categories: ActivityCategory =;

const CreateActivityScreen: React.FC<CreateActivityTabProps<'CreateActivity'>> = ({ navigation }) => {
  const addActivityToStore = useAppStore(state => state.addActivity);

  const = useState('');
  const = useState('');
  const [category, setCategory] = useState<ActivityCategory | undefined>(undefined);
  const [location, setLocation] = useState('');
  const = useState<Date | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState(''); // For MVP, user inputs URL

  const = useState(false);
  const = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (selectedDate: Date) => {
    setDateTime(selectedDate);
    hideDatePicker();
  };

  const validateForm = (): boolean => {
    if (!title.trim()) { Alert.alert('Validation Error', 'Title is required.'); return false; }
    if (!description.trim()) { Alert.alert('Validation Error', 'Description is required.'); return false; }
    if (!category) { Alert.alert('Validation Error', 'Category is required.'); return false; }
    if (!location.trim()) { Alert.alert('Validation Error', 'Location is required.'); return false; }
    if (!dateTime) { Alert.alert('Validation Error', 'Date and Time are required.'); return false; }
    if (!imageUrl.trim()) { Alert.alert('Validation Error', 'Image URL is required (for MVP).'); return false; }
    // Basic URL validation (very simple)
    if (!imageUrl.startsWith('http://') &&!imageUrl.startsWith('https://')) {
        Alert.alert('Validation Error', 'Please enter a valid Image URL (starting with http:// or https://).');
        return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const newActivity: Omit<Activity, 'id' | 'creatorId'> = {
      title,
      description,
      category: category!, // Assert category is defined due to validation
      location,
      dateTime: dateTime!.toISOString(), // Assert dateTime is defined
      imageUrl,
    };

    // In a real app, this would be an API call
    // For MVP, we directly add to the store
    // The store's addActivity action will generate an ID and mock creatorId
    try {
        const createdActivity = await useAppStore.getState().apiAddActivity(newActivity); // Assuming apiAddActivity in store
        Alert.alert('Success', `Activity "${createdActivity.title}" created!`);
        // Reset form
        setTitle('');
        setDescription('');
        setCategory(undefined);
        setLocation('');
        setDateTime(undefined);
        setImageUrl('');
        // Optionally navigate away, e.g., to Discover or MyPlannedActivities
        // navigation.navigate('DiscoverTab', { screen: 'DiscoverActivities' });
    } catch (error) {
        Alert.alert('Error', 'Could not create activity.');
        console.error("Error creating activity:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Suggest a New Activity</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Activity Title" placeholderTextColor={theme.colors.darkGray}/>

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Detailed description of the activity" multiline numberOfLines={4} placeholderTextColor={theme.colors.darkGray}/>

      <Text style={styles.label}>Category</Text>
      {/* Simple Picker using TouchableOpacity buttons for MVP */}
      <View style={styles.categoryContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={}
            onPress={() => setCategory(cat)}
          >
            <Text style={}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>


      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g., Central Park" placeholderTextColor={theme.colors.darkGray}/>

      <Text style={styles.label}>Date & Time</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>
          {dateTime? dateTime.toLocaleString() : 'Select Date & Time'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()} // Optional: prevent past dates
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://example.com/image.jpg" keyboardType="url" placeholderTextColor={theme.colors.darkGray}/>
      <Text style={styles.imagePlaceholderInfo}>For MVP: Please provide a direct URL to an image.</Text>


      <View style={styles.submitButtonContainer}>
        {isSubmitting? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
            <Button title="Suggest Activity" onPress={handleSubmit} color={theme.colors.primary} disabled={isSubmitting} />
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
    paddingVertical: theme.spacing.m, // Increased padding for better touch
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
  },
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
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
  },
  datePickerButtonText: {
   ...theme.typography.body,
    color: theme.colors.text,
  },
  imagePlaceholderInfo: {
   ...theme.typography.caption,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.m,
  },
  submitButtonContainer: {
    marginTop: theme.spacing.xl,
  }
});

export default CreateActivityScreen;