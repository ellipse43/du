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
  NativeModules
} from 'react-native';

import AV from 'avoscloud-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import qiniu from 'react-native-qiniu';
import LoginView from './Login.js';
import NicknameView from './Nickname.js';
import {putPolicy} from '../utils/qiniu';
import {QINIU_IMG_URI} from '../const';


class Setting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
    };
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
    const options = {
      title: '',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '选择照片', // specify null or empty string to remove this button
      cameraType: '返回', // 'front' or 'back'
      mediaType: '照片', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      // maxWidth: 100, // photos only
      // maxHeight: 100, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 1, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    NativeModules.ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        const uptoken = putPolicy.token();
        const date = new Date();
        const key = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}/${date.getHours()}/${date.getTime()}.jpeg`;
        const source = {uri: response.uri.replace('file://', ''), isStatic: true, key: key};

        qiniu.rpc.uploadImage(response.uri, key, uptoken, function(resp) {
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
        }.bind(this));
      }
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
  item: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
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
