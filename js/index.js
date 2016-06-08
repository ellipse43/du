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
import HomeView from './components/Home.js';
import LoginView from './components/Login.js';
import {envs} from './env.js';

const envMap = envs[process.env.NODE_ENV];
AV.initialize(envMap.leancloud.AV_APP_ID, envMap.leancloud.AV_SECRET);
qiniu.conf.ACCESS_KEY = envMap.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = envMap.qiniu.SECRET_KEY;


class du extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
    }
  }

  componentWillMount() {
    AV.User.currentAsync().then((currentUser) => {
      if (!currentUser) {
        this.setState({
          username: currentUser.get('username'),
        });

        this.refs.nav.replace({
          title: '登录',
          navigationBarHidden: false,
          component: LoginView
        })
      }
    })
  }

  render() {
    return (
      <NavigatorIOS
        ref='nav'
        style={styles.container}
        initialRoute={{
          title: '首页',
          navigationBarHidden: true,
          component: HomeView,
          passProps: {
            username: this.state.username
          }
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
