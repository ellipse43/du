'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableHighlight
} from 'react-native';

class Register extends Component {

  _onRegisterPress() {

  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput placeholder='用户名' style={styles.input} />
        <TextInput placeholder='设置密码' password={true} style={styles.input} />
        <TextInput placeholder='确认密码' password={true} style={styles.input} />
        <TouchableHighlight
          onPress={this._onRegisterPress.bind(this)}
          style={styles.registerBtn} >
          <Text style={styles.registerText}>
            提交
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
  },
  input: {
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#27423D',
    borderRadius: 3,
    borderWidth: 1,
  },
  registerBtn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#27423D',
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 3,
    borderWidth: 1,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});


export default Register;
