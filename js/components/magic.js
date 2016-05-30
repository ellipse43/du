import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import Message from './message.js';

export default class Magic extends React.Component {
  constructor(props) {
    super(props)
  }

  _onPressButton() {
    this.props.navigator.push({
      title: '❤️独°宣言❤️',
      component: Message,
      navigationBarHidden: false
    })
  }

  render() {
    return (
      <TouchableOpacity style={styles.magic} onPress={this._onPressButton.bind(this)} >
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
