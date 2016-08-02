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
import MessageView from './Message';
import Audio from './Audio';

export default class Magic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  _onPressButton() {
    this.setState({open: !this.state.open});

  }

  _videoPress() {

  }

  _audioPress() {
    this.setState({open: false});
    this.props.navigator.push({
      title: '动听一刻',
      component: Audio,
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
      rightButtonTitle: '完成',
      onRightButtonPress: () => {
        this.pushComponent && this.pushComponent.save();
      }
    });
  }

  _msgPress() {
    this.setState({open: false});
    this.props.navigator.push({
      title: '表白之心',
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
    });
  }

  render() {
    let funcView = null;
    if (this.state.open === true) {
      funcView = <View>
        <Icon
          name='ios-create'
          onPress={this._msgPress.bind(this)}
          style={styles.message}
        >
        </Icon>
        <Icon
          name='ios-recording'
          onPress={this._audioPress.bind(this)}
          style={styles.audio}
        >
        </Icon>
        <Icon
          name='ios-videocam'
          onPress={this._videoPress.bind(this)}
          style={styles.video}
        >
        </Icon>
        <Icon
          name='ios-close-circle'
          onPress={this._onPressButton.bind(this)}
          style={styles.magic}
        >
        </Icon>
      </View>
    } else {
      funcView = <Icon
        name='ios-add-circle'
        onPress={this._onPressButton.bind(this)}
        style={styles.magic}
      >
      </Icon>
    }
    return (
      <View>
        {funcView}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  message: {
    position: 'absolute',
    bottom: 160,
    right: 15,
    fontSize: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  audio: {
    position: 'absolute',
    bottom: 120,
    right: 15,
    fontSize: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  video: {
    position: 'absolute',
    bottom: 80,
    right: 15,
    fontSize: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  magic: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 56,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});
