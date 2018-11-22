import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class WorkoutScreen extends React.Component {
  static navigationOptions = {
    title: 'Workouts',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>List of available workouts and best times</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
