'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Animated,
  Image,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {AudioPlayer} from 'react-native-audio';
import {WINDOW_WIDTH, WINDOW_HEIGHT, QINIU_IMG_URI} from '../const';

class Audiobox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'init',
    };
  }

  componentWillMount() {

  }

  onPress() {
    if (this.state.status === 'init') {
      AudioPlayer.onFinished = (data) => {
        console.log('结束播放');
        this.setState({status: 'init'});
      }
      AudioPlayer.playWithUrl(`${QINIU_IMG_URI}/${this.props.audioKey}`);
      AudioPlayer.setFinishedSubscription();
      this.setState({status: 'playing'});
    } else if (this.state.status === 'playing') {
      this.setState({status: 'pause'});
      AudioPlayer.pause();
    } else if (this.state.status === 'pause') {
      this.setState({status: 'playing'});
      AudioPlayer.unpause();
    }
  }

  render() {
    let iconName = 'play-circle';
    if (this.state.status === 'playing') {
      iconName = 'pause-circle';
    } else if (this.state.status === 'pause') {
      iconName = 'play-circle';
    }

    return (
      <View style={styles.container}>
        <Icon
          name={iconName}
          style={styles.play}
          onPress={this.onPress.bind(this)}
        >
        </Icon>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  play: {
    fontSize: 24,
  },
});


export default Audiobox;
