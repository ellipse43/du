'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  Image,
  NativeModules,
  StatusBar,
} from 'react-native';

import AV from 'avoscloud-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import FS from 'react-native-fs';
import qiniu from 'react-native-qiniu';
import LoginView from './Login';
import NicknameView from './Nickname';
import {MMedia} from '../utils/MMedia';
import {Qiniu} from '../utils/Qiniu';
import {QINIU_IMG_URI, ImageCachePath} from '../const';


class Setting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
      cacheSize: '0 MB',
    };
  }

  componentDidMount() {
    this.cacheCalculate();
  }

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

  onAvatarPress() {
    MMedia.showImagePicker((response) => {
      StatusBar.setNetworkActivityIndicatorVisible(true);
      const key = Qiniu.genImageKey();
      Qiniu.uploadFile(response.uri, key).then(resp => {
        let user = this.state.currentUser;
        if (user) {
          user.set('avatar', key);
          user.save().then(() => {
            console.log('Save Avatar Success');
          }, (error) => {
            console.log(`Save Avatar Fail: ${error}`);
          });
        }
        this.setState({currentUser: user});
      }).catch(error => {
        // todo
      }).finally(() => {
        StatusBar.setNetworkActivityIndicatorVisible(false);
      });
    });
  }

  onNicknameUpdate(nickname) {
    let user = this.state.currentUser;
    if (user) {
      user.set('nickname', nickname);
      user.save().then(() => {
        console.log('Save Nickname Success');
      }, (error) => {
        console.log(`Save Nickname Fail: ${error}`);
      });
    }
    this.setState({currentUser: user});
  }

  onNicknamePress() {
    this.props.navigator.push({
      title: '昵称',
      barTintColor: '#FFFFFF',
      navigationBarHidden: false,
      component: NicknameView,
      passProps: {
        ref: (component) => {
          this.pushComponent = component;
        },
        nickname: this.state.currentUser.get('nickname'),
        onNicknameUpdate: this.onNicknameUpdate.bind(this),
      },
      leftButtonTitle: '取消',
      onLeftButtonPress: () => {
        this.props.navigator.pop();
      },
      rightButtonTitle: '保存',
      onRightButtonPress: () => {
        this.pushComponent && this.pushComponent.onSavePress();
      },
    });
  }

  cacheCalculate() {
    FS.readDir(ImageCachePath).then((result) => {
      let size = 0;
      result.map((item) => {
        size += item.size;
      });
      this.setState({cacheSize: `${Math.floor(size / 1024 / 1024)} MB`});
    });
  }

  onCacheClean() {
    FS.readDir(ImageCachePath).then((result) => {
      result.map((item) => {
        FS.unlink(item.path);
      });
      this.cacheCalculate();
    });
  }

  render() {
    const nickname = this.state.currentUser.get('nickname');
    const avatar = this.state.currentUser.get('avatar');

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
        >
        <View style={styles.profile}>
          <TouchableHighlight
            onPress={this.onAvatarPress.bind(this)}
            style={styles.avatar}
            underlayColor='#A8A8A8'
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.itemText}>
                头像
              </Text>
              <View style={styles.avatarRight}>
                <Image
                  style={styles.avatarImage}
                  source={{uri: `${QINIU_IMG_URI}/${avatar}`}} />
                <Icon name='ios-arrow-forward' size={18} color={'#CCCCCC'}>
                </Icon>
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.separtor}></View>
          <TouchableHighlight
            onPress={this.onNicknamePress.bind(this)}
            style={styles.nickname}
            underlayColor='#A8A8A8'
          >
            <View style={styles.nicknameContainer}>
              <Text style={styles.itemText}>
                昵称
              </Text>
              <View style={styles.nicknameRight}>
                <Text style={styles.nicknameLabel}>
                  {nickname}
                </Text>
                <Icon name='ios-arrow-forward' size={18} color={'#CCCCCC'}>
                </Icon>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.group}>
          <TouchableHighlight
            onPress={this.onCacheClean.bind(this)}
            style={styles.basic}
            underlayColor='#A8A8A8'
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.itemText}>
                清除缓存
              </Text>
              <View style={styles.basicRight}>
                <Text style={styles.nicknameLabel}>
                  {this.state.cacheSize}
                </Text>
                <Icon name='ios-arrow-forward' size={18} color={'#CCCCCC'}>
                </Icon>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <TouchableHighlight
          onPress={this.onExitPress.bind(this)}
          style={styles.exit}
          underlayColor='#A8A8A8'
        >
          <Text style={styles.exitText}>
            退出登陆
          </Text>
        </TouchableHighlight>
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
  separtor: {
    marginLeft: 10,
    borderColor: '#EDEDED',
    borderBottomWidth: 1,
  },
  profile: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  group: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    height: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarRight: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  avatarImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  nicknameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nicknameRight: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  nicknameLabel: {
    fontSize: 16,
    color: '#BDBDBD',
    marginRight: 10,
  },
  basic: {
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  basicContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  basicRight: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  basicLabel: {
    fontSize: 16,
    color: '#BDBDBD',
    marginRight: 10,
  },
  item: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 14,
  },
  exit: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  exitText: {
    fontSize: 16,
  },
});


export default Setting;
