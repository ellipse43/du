'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  Image
} from 'react-native';

import AV from 'avoscloud-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginView from './Login.js';
import NicknameView from './Nickname.js';

class Setting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
    };
  }

  onExitPress() {
    AV.User.logOut();
    this.props.navigator.push({
      title: '登录',
      navigationBarHidden: false,
      component: LoginView,
      leftButtonTitle: ' ',
      rightButtonTitle: ' ',
      barTintColor: '#FFFFFF',
    })
  }

  onAvatarPress() {

  }

  onNicknameUpdate(nickname) {
    let user = this.state.currentUser;
    if (user) {
      user.set('nickname', nickname);
      user.save().then(() => {
        console.log('Save Nickname Success');
      }, (error) => {
        console.log(`Save Nickname Fail: ${error}`);
      });
    }
    this.setState({currentUser: user});
  }

  onNicknamePress() {
    this.props.navigator.push({
      title: '昵称',
      barTintColor: '#FFFFFF',
      navigationBarHidden: false,
      component: NicknameView,
      passProps: {
        ref: (component) => {
          this.pushComponent = component;
        },
        nickname: this.state.currentUser.get('nickname'),
        onNicknameUpdate: this.onNicknameUpdate.bind(this),
      },
      leftButtonTitle: '取消',
      onLeftButtonPress: () => {
        this.props.navigator.pop();
      },
      rightButtonTitle: '保存',
      onRightButtonPress: () => {
        this.pushComponent && this.pushComponent.onSavePress();
      },
    });
  }

  render() {
    const nickname = this.state.currentUser.get('nickname');
    const avatar = this.state.currentUser.get('avatar');

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
        >
        <View style={styles.profile}>
          <TouchableHighlight
            onPress={this.onAvatarPress.bind(this)}
            style={styles.avatar}>
            <View style={styles.avatarContainer}>
              <Text style={styles.itemText}>
                头像
              </Text>
              <View style={styles.avatarRight}>
                <Image
                  style={styles.avatarImage}
                  source={{uri: avatar}} />
                <Icon name='ios-arrow-forward' size={18} color={'#CCCCCC'}>
                </Icon>
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.separtor}></View>
          <TouchableHighlight
            onPress={this.onNicknamePress.bind(this)}
            style={styles.nickname}>
            <View style={styles.nicknameContainer}>
              <Text style={styles.itemText}>
                昵称
              </Text>
              <View style={styles.nicknameRight}>
                <Text style={styles.nicknameLabel}>
                  {nickname}
                </Text>
                <Icon name='ios-arrow-forward' size={18} color={'#CCCCCC'}>
                </Icon>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          onPress={this.onExitPress.bind(this)}
          style={styles.exit}>
          <Text style={styles.exitText}>
            退出登陆
          </Text>
        </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#EDEDED',
  },
  scrollView: {
    height: 300,
  },
  separtor: {
    marginLeft: 10,
    borderColor: '#EDEDED',
    borderBottomWidth: 1,
  },
  profile: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    height: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarRight: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  avatarImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  nicknameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nicknameRight: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  nicknameLabel: {
    fontSize: 16,
    color: '#BDBDBD',
    marginRight: 10,
  },
  item: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  exit: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  exitText: {
    fontSize: 16,
  },
});


export default Setting;
