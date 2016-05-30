import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container} >
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 45
  }
})
