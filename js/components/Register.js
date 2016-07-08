'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableHighlight,
  Alert,
  ScrollView
} from 'react-native';

import AV from 'avoscloud-sdk';
import HomeView from './Home';

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      repassword: '',
      email: '',
    };
  }

  _onRegisterPress() {
    console.log(this.state.username, this.state.password);

    if (this.state.username.length < 5) {
      Alert.alert('警告', '用户名长度不够');
      return;
    }
    if (this.state.password != this.state.repassword) {
      Alert.alert('警告', '两次密码不匹配');
      return;
    }

    let user = new AV.User();
    user.setUsername(this.state.username);
    user.setNickname(this.state.username);
    user.setPassword(this.state.password);
    user.setEmail(this.state.email);
    user.signUp().then((newUser) => {
      console.log(newUser);
      if (newUser) {
        this.props.navigator.replace({
          component: HomeView,
        })
      }
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TextInput placeholder='邮箱' keyboardType='email-address' autoCorrect={false} autoCapitalize='none' style={styles.input} onChangeText={(email) => this.setState({email})} />
        <TextInput placeholder='用户名' autoCorrect={false} autoCapitalize='none' style={styles.input} onChangeText={(username) => this.setState({username})} />
        <TextInput placeholder='设置密码' password={true} style={styles.input} onChangeText={(password) => this.setState({password})} />
        <TextInput placeholder='确认密码' password={true} style={styles.input} onChangeText={(repassword) => this.setState({repassword})} />
        <TouchableHighlight
          onPress={this._onRegisterPress.bind(this)}
          style={styles.registerBtn} >
          <Text style={styles.registerText}>
            提交
          </Text>
        </TouchableHighlight>
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    height: 300,
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
