import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import AV from 'avoscloud-sdk';

import Message from './components/messages.js';
import Magic from './components/magic.js';

AV.initialize('barRELKtqSJTsSmQp4i4qQGq-gzGzoHsf', 'zfaGe33WatcyWKwnfzvxyyhf')

class du extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Message />
        <Magic />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 20
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('du', () => du);
