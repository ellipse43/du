'use strict';

import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  NativeModules,
  ScrollView
} from 'react-native';

import qiniu from 'react-native-qiniu';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationView from './Location.js';
import {putPolicy} from '../utils/qiniu';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {content: '', avatarSources: []};
  }

  call() {
    if (this.state.content.length < 1) {
      Alert.alert('警告', '输入字数太少');
      return;
    }
    const imgs = [];
    this.state.avatarSources.forEach((item) => {
      if (item.key != null) {
        imgs.push(item.key);
      }
    });
    this.props.onMessageCreate(this.state.content, imgs);
    this.props.navigator.pop();
  }

  _onImageSelect() {
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
      console.log('Response = ', response);

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
          console.log(JSON.stringify(resp));
          let avatarSources = this.state.avatarSources.slice();
          avatarSources.push(source);
          this.setState({
            avatarSources: avatarSources
          });
        }.bind(this));
      }
    });
  }

  onLocationPress() {
    this.props.navigator.push({
      title: '所在位置',
      component: LocationView,
      barTintColor: '#FFFFFF',
      navigationBarHidden: false,
      leftButtonTitle: '取消',
      onLeftButtonPress: () => {
        this.props.navigator.pop();
      },
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollView} >
        <View style={styles.core}>
          <TextInput autoCorrect={false} autoCapitalize='none' multiline={true} style={styles.messageInput} ref="content" onChangeText={(content) => this.setState({content: content})} value={this.state.content} />
          <View style={styles.separtor}></View>
          <TouchableOpacity onPress={this.onLocationPress.bind(this)}><View style={styles.setting}><Icon name='ios-locate' style={styles.settingIcon}></Icon><Text style={styles.settingIconText}>所在位置</Text></View></TouchableOpacity>
        </View>
        <View style={styles.imageTool}>
        {this.state.avatarSources.map((item, index) => {
          return (
            <Image
              key={index}
              style={styles.avatar}
              source={{uri: item.uri}} />
          )
        })}
        <TouchableOpacity style={styles.imageSelect} onPress={this._onImageSelect.bind(this)} >
          <Text style={styles.addText} >
            +
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scollView: {
    height: 300,
  },
  core: {
    borderColor: '#000000',
    borderBottomWidth: 1,
  },
  separtor: {
    marginLeft: 20,
    borderColor: '#000000',
    borderBottomWidth: 1,
  },
  setting: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginLeft: 10,
    fontSize: 30,
    padding: 5,
  },
  settingIconText: {
    marginLeft: 10,
    fontSize: 16,
  },
  messageInput: {
    padding: 5,
    height: 80,
    // borderColor: '#27423D',
    // borderWidth: 1,
    margin: 5,
    fontSize: 18,
  },
  imageTool: {
    marginTop: 5,
    flex: 1,
    flexDirection: 'row',
  },
  imageSelect: {
    width: 40,
    height: 40,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27423D',
  },
  avatar: {
    marginLeft: 5,
    width: 40,
    height: 40,
  },
  addText: {
    color: '#FFFFFF',
  }
})
