import  React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  NavigatorIOS
} from 'react-native';

import AV from 'avoscloud-sdk';
import qiniu from 'react-native-qiniu';
import HomeView from './components/Home.js';
import LoginView from './components/Login.js';
import SettingView from './components/Setting.js';
import {envs} from './env.js';

const envMap = envs[process.env.NODE_ENV];
AV.initialize(envMap.leancloud.AV_APP_ID, envMap.leancloud.AV_SECRET);
qiniu.conf.ACCESS_KEY = envMap.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = envMap.qiniu.SECRET_KEY;


class du extends Component {

  constructor(props) {
    super(props);
    this.state = {
      component: <HomeView />,
    }
  }

  componentWillMount() {
    AV.User.currentAsync().then((currentUser) => {
      if (!currentUser) {
        this.refs.nav.push({
          title: '登录',
          navigationBarHidden: false,
          component: LoginView,
          leftButtonTitle: ' ',
          barTintColor: '#FFFFFF',
        });
      }
    })
  }

  renderScene(route, navigator) {
    switch(route.code) {
      case 'home':
        return <HomeView
                title={route.title}
                code={route.code}
                navigator={navigator}
              />;
      case 'setting':
        return <SettingView
                name={route.title}
                title={route.title}
                code={route.code}
                navigator={navigator}
                onBack={() => {
                  navigator.pop();
                }}
              />;
      default:
        throw new Error('render error');
    }
  }

  render() {
    // const routeMapper = {
    //   LeftButton: function (route, navigator, index, navState) {
    //     return null;
    //   },
    //   RightButton: function (route, navigator, index, navState) {
    //     return null;
    //   },
    //   Title: function(route, navigator, index, state) {
    //     return (
    //       <Text>
    //         首页
    //       </Text>
    //     )
    //   },
    // };

    // return (
    //   <Navigator
    //     initialRoute={{
    //       title: '首页',
    //       code: 'home',
    //       index: 0,
    //     }}
    //     navigationBar={
    //       <Navigator.NavigationBar
    //         routeMapper={routeMapper}
    //       />
    //     }
    //     renderScene={this.renderScene}
    //     style={styles.container}
    //   />
    // );

    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{
          title: '',
          navigationBarHidden: true,
          component: HomeView
        }}
        style={styles.container}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
});

AppRegistry.registerComponent('du', () => du);
