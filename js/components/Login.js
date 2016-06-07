'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Dimensions
} from 'react-native';

class Login extends Component {

  _onLoginPress() {

  }

  _onForgetPasswordPress() {

  }

  _onRegisterPress() {

  }

  render() {

    return (
      <View style={styles.container}>
        <TextInput placeholder='用户名' style={styles.input} />
        <TextInput placeholder='密码' password={true} style={styles.input} />
        <TouchableHighlight
           onPress={this._onLoginPress.bind(this)}
           style={styles.loginBtn} >
           <Text style={styles.loginText}>
             登陆
           </Text>
        </TouchableHighlight>
        <View style={styles.btnGroup} >
          <TouchableHighlight
             onPress={this._onForgetPasswordPress.bind(this)}
             style={styles.forgetBtn} >
             <Text style={styles.loginText}>
               找回密码
             </Text>
          </TouchableHighlight>
          <TouchableHighlight
             onPress={this._onRegisterPress.bind(this)}
             style={styles.registerBtn} >
             <Text style={styles.loginText}>
               注册
             </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const width = Dimensions.get('window').width - 50;
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
  loginBtn: {
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
  btnGroup: {
    flexDirection: 'row',
    alignItems:'center',
  },
  forgetBtn: {
    width: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#27423D',
    height: 40,
    marginLeft: 20,
    marginRight: 5,
    borderRadius: 3,
    borderWidth: 1,
  },
  registerBtn: {
    width: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginTop: 10,
    backgroundColor: '#27423D',
    height: 40,
    marginRight: 20,
    borderRadius: 3,
    borderWidth: 1,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  }
});


export default Login;
