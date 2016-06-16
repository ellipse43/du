'use strict';

import React from 'react';
import {NavigatorIOS, View, StyleSheet, Text, Image, TouchableHighlight, StatusBar} from 'react-native';
import SideMenu from 'react-native-side-menu';
import AV from 'avoscloud-sdk';

import MessageList from './MessageList.js';
import MagicView from './Magic.js';
import SettingView from './Setting.js';
import {QINIU_IMG_URI} from '../const';


export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newMessage: null,
      currentUser: null,
    };
  }

  componentWillMount() {
    AV.User.currentAsync().then((currentUser) => {
      this.setState({currentUser});
    });
  }

  onMessageCreate(newMessage) {
    this.setState({newMessage});
  }

  componentWillReceiveProps(nextProps) {

  }

  _onAvatarPress() {
    this.props.navigator.push({
      title: '设置',
      component: SettingView,
      navigationBarHidden: false,
      barTintColor: '#FFFFFF',
      leftButtonTitle: ' ',
      passProps: {
        currentUser: this.state.currentUser,
      },
      rightButtonTitle: '完成',
      onRightButtonPress: () => {
        this.props.navigator.pop();
      },
    });
  }

  render() {
    let messageList = <MessageList />
    if (this.state.newMessage) {
      messageList = <MessageList newMessage={this.state.newMessage} />
    }

    const user = this.state.currentUser;
    const nickname = user ? user.get('nickname') : ``;

    let avatar = null;
    if (user && user.get('avatar')) {
      avatar = <Image style={styles.avatarImage} source={{uri: `${QINIU_IMG_URI}/${user.get('avatar')}`}} />
    } else {
      avatar = <Image style={styles.avatarImage} source={require('../../imageAssets/default-avatar.jpg')} />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableHighlight
            onPress={this._onAvatarPress.bind(this)}
            style={styles.avatar} >
            {avatar}
          </TouchableHighlight>

          <Text style={styles.nicknameText}>
            {nickname}
          </Text>
        </View>
        {messageList}
        <MagicView
          navigator={this.props.navigator}
          onMessageCreate={this.onMessageCreate.bind(this)}
          currentUser={this.state.currentUser}
        />
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 3,
    borderColor: '#000000',
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
  nicknameText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#000000',
  }
});
