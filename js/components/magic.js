import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

export default class Magic extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TouchableOpacity style={styles.magic}>
        <Text>
          ❤️独°宣言❤️
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  magic: {
    alignItems: 'center',
    padding: 20
  }
});
