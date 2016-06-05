import  React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';

import AV from 'avoscloud-sdk';
import qiniu from 'react-native-qiniu';
import HomeView from './components/homeView.js';
import {envs} from './env.js';

const envMap = envs[process.env.NODE_ENV];
AV.initialize(envMap.leancloud.AV_APP_ID, envMap.leancloud.AV_SECRET);
qiniu.conf.ACCESS_KEY = envMap.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = envMap.qiniu.SECRET_KEY;

class du extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: '首页',
          navigationBarHidden: true,
          component: HomeView
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 20
  }
});

AppRegistry.registerComponent('du', () => du);
