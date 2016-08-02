'use strict';

import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import MessageAudioView from './MessageAudio';
import {Qiniu} from '../utils/Qiniu';
import {WINDOW_WIDTH} from '../const';

const COLOR_ENABLE = '#27423D';
const COLOR_UNENABLE = 'grey';

class Audio extends Component {

  state = {
    cond: 'init',
    currentTime: 0,
    totalTime: 0,
    recording: false,
    stoppedRecording: false,
    stoppedPlaying: false,
    playing: false,
    finished: false
  };

  componentDidMount() {

    let audioPath = `${AudioUtils.DocumentDirectoryPath}/tmp.aac'`;

    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampMleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac"
    });

    AudioRecorder.onProgress = (data) => {
      this.setState({currentTime: Math.floor(data.currentTime)});
      // 这里应该有bug，播放时间对不上
      console.log('**', this.state.totalTime, data.currentTime);
      if (this.state.cond == 'play' && this.state.totalTime - 1 <= data.currentTime) {
        this.setState({
          cond: 'init',
        })
      }
      if (this.state.cond == 'record') {
        this.setState({
          totalTime: data.currentTime,
        })
      }
    };
    AudioRecorder.onFinished = (data) => {
      this.setState({finished: data.finished});
      console.log(`Finished recording: ${data.finished}`);
      // 结束&上传七牛
      const key = Qiniu.genFileKey('aac');
      Qiniu.uploadFile(audioPath, key).then(resp => {
        console.log(`音频${key}上传成功`);
        // 补充其他信息
        this.props.navigator.push({
          title: '表白之心',
          component: MessageAudioView,
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
            audioPath: audioPath,
            audioKey: key,
          },
          onLeftButtonPress: () => {
            this.pushComponent && this.pushComponent.cancel();
          },
          rightButtonTitle: '发送',
          onRightButtonPress: () => {
            this.pushComponent && this.pushComponent.save();
          }
        });
      }).catch(e => {
        console.log('音频上传失败', e);
      });
    };
  }

  cancel() {
    this.props.navigator.pop();
  }

  onPress(cond) {
    console.log('**press**');
    const state_cond = this.state.cond;
    if (cond === 'init') {
      // init
    } else if (cond === 'record') {
      if (state_cond === 'play') {
        AudioRecorder.stopPlaying();
      }
      AudioRecorder.startRecording();
    } else if (cond === 'pause') {
      if (state_cond === 'play') {
        AudioRecorder.stopPlaying();
      } else if (state_cond === 'record') {
        AudioRecorder.pauseRecording();
      }
    } else if (cond === 'play') {
      AudioRecorder.playRecording();
    }
    this.setState({
      cond: cond,
    })
  }

  save() {
    const state_cond = this.state.cond;

    if (state_cond === 'play') {
      AudioRecorder.stopPlaying();
    }
    if (state_cond === 'record') {
      AudioRecorder.pauseRecording();
    }
    if (state_cond === 'init' || this.state.totalTime < 2) {
      Alert.alert('警告', '还未开始录入或时间少于2秒');
      return;
    }
    // 回调Finished
    AudioRecorder.stopRecording();
  }

  render() {
    const cond = this.state.cond;
    let toolView = null;
    if (cond === 'init') {
      toolView = <View>
        <Icon
          name='ios-pause'
          color={COLOR_UNENABLE}
          style={styles.pause}>
        </Icon>
        <Icon
          name='ios-mic'
          color={COLOR_ENABLE}
          onPress={this.onPress.bind(this, 'record')}
          style={styles.mic}>
        </Icon>
        <Icon
          name='ios-play'
          color={COLOR_UNENABLE}
          style={styles.play}>
        </Icon>
      </View>
    } else if (cond === 'record') {
      toolView = <View>
        <Icon
          name='ios-pause'
          color={COLOR_ENABLE}
          onPress={this.onPress.bind(this, 'pause')}
          style={styles.pause}>
        </Icon>
        <Icon
          name='ios-mic'
          color={COLOR_UNENABLE}
          style={styles.mic}>
        </Icon>
        <Icon
          name='ios-play'
          color={COLOR_UNENABLE}
          style={styles.play}>
        </Icon>
      </View>
    } else if (cond === 'pause') {
      toolView = <View>
        <Icon
          name='ios-pause'
          color={COLOR_UNENABLE}
          style={styles.pause}>
        </Icon>
        <Icon
          name='ios-mic'
          color={COLOR_ENABLE}
          onPress={this.onPress.bind(this, 'record')}
          style={styles.mic}>
        </Icon>
        <Icon
          name='ios-play'
          color={COLOR_ENABLE}
          onPress={this.onPress.bind(this, 'play')}
          style={styles.play}>
        </Icon>
      </View>
    } else if (cond === 'play') {
      toolView = <View>
        <Icon
          name='ios-pause'
          color={COLOR_ENABLE}
          onPress={this.onPress.bind(this, 'pause')}
          style={styles.pause}>
        </Icon>
        <Icon
          name='ios-mic'
          color={COLOR_ENABLE}
          onPress={this.onPress.bind(this, 'record')}
          style={styles.mic}>
        </Icon>
        <Icon
          name='ios-play'
          color={COLOR_UNENABLE}
          style={styles.play}>
        </Icon>
      </View>
    }
    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <Text style={styles.progress}>
            {this.state.currentTime}
          </Text>
        </View>
        {toolView}
      </View>
    );
  }
}

const fontSize = 56;
const gap = 70;
const left = WINDOW_WIDTH / 2 - 20;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: "#fff"
  },
  button: {
    padding: 20
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  },
  mic: {
    position: 'absolute',
    bottom: 40,
    right: left,
    fontSize: 56,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  pause: {
    position: 'absolute',
    bottom: 40,
    right: left + gap,
    fontSize: 56,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  play: {
    position: 'absolute',
    bottom: 40,
    right: left - gap,
    fontSize: 56,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  }
});

export default Audio;
