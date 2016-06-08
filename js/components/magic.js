import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import MessageView from './Message.js';

export default class Magic extends React.Component {
  constructor(props) {
    super(props);
  }

  _onPressButton() {
    this.props.navigator.push({
      title: '独',
      component: MessageView,
      navigationBarHidden: false,
      barTintColor: '#FFFFFF',
      tintColor: '#27423D',
      leftButtonTitle: '取消',
      passProps: {
        ref: (component) => {
          this.pushComponent = component
        },
        onMessageCreate: this.props.messageCreate
      },
      onLeftButtonPress: () => {
        this.props.navigator.pop();
      },
      rightButtonTitle: '发送',
      onRightButtonPress: () => {
        this.pushComponent && this.pushComponent.call();
      }
    })
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this._onPressButton.bind(this)} >
        <Image
          style={styles.magicImage}
          source={{uri: ''}} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 30,
    backgroundColor: '#27423D',
  },
  magicImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
