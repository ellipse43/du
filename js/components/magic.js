'use strict';

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import MessageView from './Message.js';

export default class Magic extends React.Component {
  constructor(props) {
    super(props);
  }

  _onPressButton() {
    this.props.navigator.push({
      title: ' ',
      component: MessageView,
      navigationBarHidden: false,
      barTintColor: '#FFFFFF',
      tintColor: '#000000',
      leftButtonTitle: '取消',
      passProps: {
        ref: (component) => {
          this.pushComponent = component;
        },
        onMessageCreate: this.props.onMessageCreate,
        currentUser: this.props.currentUser,
        navigator: this.props.navigator,
      },
      onLeftButtonPress: () => {
        this.pushComponent && this.pushComponent.cancel();
      },
      rightButtonTitle: '发送',
      onRightButtonPress: () => {
        this.pushComponent && this.pushComponent.save();
      }
    })
  }

  render() {
    return (
      <Icon
        name='ios-add-circle'
        onPress={this._onPressButton.bind(this)}
        style={styles.magic}
      >
      </Icon>
    )
  }
}

const styles = StyleSheet.create({
  magic: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 56,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});
