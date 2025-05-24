import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Keep this if you test further with navigation

const App = () => {
  return (
    // GestureHandlerRootView might not be strictly necessary for this minimal test
    // but keeping it is fine. You can also try with just SafeAreaView.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.text}>Hello Leggo!</Text>
          <Text style={styles.text}>If you see this, the basic app works.</Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'cyan', // Bright color to ensure visibility
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    margin: 10,
  },
});

export default App;