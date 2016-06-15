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
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicatorIOS
} from 'react-native';

import AV from 'avoscloud-sdk';
import qiniu from 'react-native-qiniu';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationView from './Location.js';
import {putPolicy} from '../utils/qiniu';
import {MessageModel} from './Model.js';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      imgs: [],
      animationType: 'none',
      modalVisible: false,
      transparent: true,
    };
  }

  cancel() {
    if (this.state.content.length > 0 || this.state.imgs.length > 0) {

    }
    this.props.navigator.pop();
  }

  save() {
    if (this.state.content.length < 1) {
      Alert.alert('警告', '输入字数太少');
      return;
    }
    const imgs = [];
    this.state.imgs.forEach((item) => {
      if (item.key != null) {
        imgs.push(item.key);
      }
    });

    this.setModalVisible(true);
    const msg = MessageModel.new({content: this.state.content, imgs: imgs});
    msg.set('ACL', new AV.ACL(this.props.currentUser));
    msg.save().then((msg) => {
      this.props.onMessageCreate(msg);
      this.props.navigator.pop();
    }, (error) => {
      console.log(`Error: ${error.code} ${error.message}`);
    });
    this.setModalVisible(false);

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
        this.setModalVisible(true);
        const dataSource = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        const uptoken = putPolicy.token();
        const date = new Date();
        const key = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}/${date.getHours()}/${date.getTime()}.jpeg`;
        const source = {uri: response.uri.replace('file://', ''), isStatic: true, key: key};

        qiniu.rpc.uploadImage(response.uri, key, uptoken, function(resp) {
          this.setModalVisible(false);

          let imgs = this.state.imgs.slice();
          imgs.push(source);
          this.setState({
            imgs: imgs
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    let imgBtn = null;
    if (this.state.imgs.length < 4) {
      imgBtn = <TouchableOpacity style={styles.imageSelect} onPress={this._onImageSelect.bind(this)} ><Text style={styles.addText} >+</Text></TouchableOpacity>
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <View style={styles.modalContaier}>
            <View style={styles.modalEntity}>
              <ActivityIndicatorIOS
                size='large'
                animating={true}
              />
            </View>
          </View>
        </Modal>
        <ScrollView style={styles.scrollView} >
          <View style={styles.core}>
            <TextInput autoCorrect={false} autoCapitalize='none' multiline={true} style={styles.messageInput} ref="content" onChangeText={(content) => this.setState({content: content})} value={this.state.content} />
            <View style={styles.separtor}></View>
            <TouchableOpacity onPress={this.onLocationPress.bind(this)} style={styles.location}>
              <View style={styles.settingContainer}>
                <View style={styles.locationLeft}>
                  <Icon name='ios-locate' size={18} color={'#000000'} style={styles.settingIcon}></Icon>
                  <Text style={styles.settingIconText}>所在位置</Text>
                </View>
                <Icon name='ios-arrow-forward' size={18} color={'#CCCCCC'} style={{marginRight: 10}}></Icon>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.imageTool}>
          {this.state.imgs.map((item, index) => {
            return (
              <Image
                key={index}
                style={styles.avatar}
                source={{uri: item.uri}} />
            )
          })}
          {imgBtn}
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
  modalContaier: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalEntity: {
    width: 200,
    height: 100,
    borderColor: '#EDEDED',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10},
  scollView: {
    height: 300,
  },
  core: {
    borderColor: '#EDEDED',
    borderBottomWidth: 1,
  },
  separtor: {
    marginLeft: 10,
    borderColor: '#EDEDED',
    borderBottomWidth: 1,
  },
  location: {
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  locationLeft: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  settingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingIconText: {
    marginLeft: 10,
    fontSize: 16,
  },
  messageInput: {
    padding: 5,
    height: 80,
    margin: 5,
    fontSize: 18,
    fontFamily: 'Avenir-Light',
  },
  imageTool: {
    marginTop: 10,
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
  },
  imageSelect: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#EDEDED',
    borderWidth: 1,
  },
  avatar: {
    marginRight: 5,
    width: 60,
    height: 60,
  },
  addText: {
    color: '#EDEDED',
  }
})
