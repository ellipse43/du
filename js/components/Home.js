'use strict';

import React from 'react';
import {NavigatorIOS, View, StyleSheet, Text, Image, TouchableHighlight, StatusBar} from 'react-native';
import SideMenu from 'react-native-side-menu';
import MessageList from './MessageList.js';
import MagicView from './Magic.js';
import SettingView from './Setting.js';


export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      newMessage: null,
    };
  }

  messageCreate(content, imgs) {
    this.setState({
      newMessage: {
        content: content,
        imgs: imgs,
    }});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      username: nextProps.username,
    })
  }

  _onAvatarPress() {
    this.props.navigator.push({
      title: '设置',
      component: SettingView,
      navigationBarHidden: false,
    });
  }

  render() {
    let messageList = <MessageList />
    if (this.state.newMessage) {
      messageList = <MessageList newMessage={this.state.newMessage} />
    }

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor='#27423D'
        />
        <View style={styles.header}>
          <TouchableHighlight
            onPress={this._onAvatarPress.bind(this)}
            style={styles.avatar} >
            <Image
              style={styles.avatarImage}
              source={{uri: 'http://o8a6ibmov.bkt.clouddn.com/2016/6/5/23/1465139931467.jpeg'}} />
          </TouchableHighlight>

          <Text style={styles.usernameText}>
            ellipse42
          </Text>
        </View>
        {messageList}
        <MagicView navigator={this.props.navigator} messageCreate={this.messageCreate.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 70,
    backgroundColor: '#27423D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  avatarImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  usernameText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#FFFFFF',
  }
});
