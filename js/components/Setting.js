'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  NavigatorIOS
} from 'react-native';

import AV from 'avoscloud-sdk';
import LoginView from './Login.js';


class Setting extends Component {

  onExitPress() {
    AV.User.logOut();
    // this.props.navigator.pop();
    this.props.navigator.push({
      title: '登录',
      navigationBarHidden: false,
      component: LoginView,
      leftButtonTitle: ' ',
      rightButtonTitle: ' ',
      barTintColor: '#FFFFFF',
    })
  }

  render() {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        onPress={this.onExitPress.bind(this)}
        style={styles.exitBtn} >
        <Text style={styles.exitText}>
        退出
        </Text>
      </TouchableHighlight>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 45,
  },
  exitBtn: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: '#27423D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  exitText: {
    color: '#FFFFFF',
    fontSize: 18,
  }
});


export default Setting;
