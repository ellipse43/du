import  React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';

import AV from 'avoscloud-sdk';
import HomeView from './components/homeView.js';

AV.initialize('barRELKtqSJTsSmQp4i4qQGq-gzGzoHsz', 'zfaGe33WatcyWKwnfzvxyyhx');

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
