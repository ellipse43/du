import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
      <Icon
        name='ios-add-circle'
        backgroundColor='#FFBBAA'
        onPress={this._onPressButton.bind(this)} style={styles.magic}
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
  },
});
