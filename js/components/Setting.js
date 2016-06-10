'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions
} from 'react-native';

import AV from 'avoscloud-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginView from './Login.js';


class Setting extends Component {

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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
        >

        <View style={styles.item}>
          <Icon.Button
            name='ios-log-out'
            color='#000000'
            backgroundColor='#FFFFFF'
            iconStyle={styles.icon}
            borderRadius={0}
            onPress={this.onExitPress.bind(this)}
          >
            <Text style={styles.text}>
              头像
            </Text>
          </Icon.Button>
        </View>

        <View style={styles.item}>
          <Icon.Button
            name='ios-log-out'
            color='#000000'
            backgroundColor='#FFFFFF'
            iconStyle={styles.icon}
            borderRadius={0}
            onPress={this.onExitPress.bind(this)}
          >
            <Text style={styles.text}>
              昵称
            </Text>
          </Icon.Button>
        </View>

        <View style={styles.item}>
          <Icon.Button
            name='ios-log-out'
            color='#000000'
            backgroundColor='#FFFFFF'
            iconStyle={styles.icon}
            borderRadius={0}
            onPress={this.onExitPress.bind(this)}
          >
            <Text style={styles.text}>
              退出登陆
            </Text>
          </Icon.Button>
        </View>
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
  item: {
    marginTop: 10,
    width: Dimensions.get('window').width
  },
  icon: {
  },
  text: {
    fontSize: 16,
    color: '#000000',
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
