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
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicatorIOS
} from 'react-native';

import AV from 'avoscloud-sdk';
import qiniu from 'react-native-qiniu';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationView from './Location';
import {Qiniu} from '../utils/Qiniu';
import {MessageModel} from '../utils/Model';
import {MMedia} from '../utils/MMedia';
import ImagePicker from 'react-native-image-crop-picker';

export default class Message extends React.Component {

  static STATUS_LOADING = 'loading';
  static STATUS_ERROR = 'error';

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      imgs: [],
      status: Message.STATUS_LOADING,
      animationType: 'none',
      modalVisible: false,
      transparent: true,
    };
  }

  componentWillUnmount() {
    this.uploadTimer && clearTimeout(this.uploadTimer);
    this.loadTimer && clearTimeout(this.loadTimer);
  }

  cancel() {
    if (this.state.content.length > 0 || this.state.imgs.length > 0) {

    }
    this.props.navigator.pop();
  }

  save() {
    if (this.state.imgs.length < 1 && this.state.content.length < 1) {
      Alert.alert('警告', '输入字数太少');
      return;
    }
    this.setModalVisible(true);

    const imgs = [];
    this.state.imgs.forEach((item) => {
      if (item.key != null) {
        imgs.push(item.key);
      }
    });

    const msg = MessageModel.new({content: this.state.content, imgs: imgs});
    msg.set('ACL', new AV.ACL(this.props.currentUser));

    this.props.onMessageCreate(msg);

    msg.save().then((msg) => {
      this.setModalVisible(false);
      this.props.navigator.pop();
    }, (error) => {
      this.setState({status: Message.STATUS_ERROR});
    });
  }

  _onImageSelect() {
    MMedia.showImagePicker((response) => {
      this.setModalVisible(true);
      const key = Qiniu.genImageKey();
      const source = {uri: response.uri.replace('file://', ''), isStatic: true, key: key};
      Qiniu.uploadFile(response.uri, key).then(resp => {
        if (this.state.modalVisible) {
          this.setModalVisible(false);
          let imgs = this.state.imgs.slice();
          imgs.push(source);
          this.setState({
            imgs: imgs,
          });
        }
      }).catch(e => {
        this.setModalVisible(false);
      });
    }, () => {
      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 4 - this.state.imgs.length,
      }).then(images => {
        this.setModalVisible(true);
        let index = 0, length = images.length, sources = [], keys = [];
        images.map((img, i) => {
          const key = Qiniu.genImageKey();
          const source = {uri: img.path.replace('file://', ''), isStatic: true, key: key};
          keys.push(key);
          sources.push(source);
        })
        images.map((img, i) => {
          Qiniu.uploadFile(img.path, keys[i]).then(resp => {
            if (this.state.modalVisible && resp.status == 200) {
              index += 1;
              if (index === length) {
                this.setModalVisible(false);
                let imgs = this.state.imgs.slice();
                imgs.push(...sources);
                this.setState({
                  imgs: imgs,
                });
              };
            }
          }).catch(error => {
            this.setModalVisible(false);
          });
        })
      }).catch(e => {});
    });


    this.uploadTimer = setTimeout(() => {
      if (this.state.modalVisible) {
        this.setModalVisible(false);
        Alert.alert('错误', '请求超时!');
      }
    }, 60000);
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

    let modalContent = null;
    if (this.state.status === Message.STATUS_LOADING) {
      modalContent = <ActivityIndicatorIOS size='large' animating={true} />
    } else if (this.status === Message.STATUS_ERROR) {
      modalContent = <Text>加载错误</Text>;
      this.loadTimer = setTimeout(() => {
        this.setState({status: Message.STATUS_LOADING});
        this.setModalVisible(false);
      }, 1);
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
              <ActivityIndicatorIOS size='large' animating={true} />
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
    borderRadius: 10,
  },
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
