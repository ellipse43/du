'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';

import SettingView from './Setting.js';

class Mine extends Component {
  render() {
    return (
      <View>
        <ScrollView style={styles.scrollView}>
          <SettingView />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    height: 300,
  }
});


export default Mine;
