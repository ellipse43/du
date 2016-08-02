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
import Icon from 'react-native-vector-icons/Ionicons';
import LocationView from './Location';
import {Qiniu} from '../utils/Qiniu';
import {MessageModel} from '../utils/Model';
import {MMedia} from '../utils/MMedia';
import ImagePicker from 'react-native-image-crop-picker';

export default class MessageAudio extends React.Component {

  static STATUS_LOADING = 'loading';
  static STATUS_ERROR = 'error';

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      imgs: [],
      status: MessageAudio.STATUS_LOADING,
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
    this.props.navigator.popToTop();
  }

  save() {
    this.setModalVisible(true);

    const msg = MessageModel.new({content: this.state.content, audio: this.props.audioKey, type: 'audio'});
    msg.set('ACL', new AV.ACL(this.props.currentUser));

    this.props.onMessageCreate(msg);

    msg.save().then((msg) => {
      this.setModalVisible(false);
      this.props.navigator.popToTop();
    }, (error) => {
      this.setState({status: MessageAudio.STATUS_ERROR});
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
    let modalContent = null;
    if (this.state.status === MessageAudio.STATUS_LOADING) {
      modalContent = <ActivityIndicatorIOS size='large' animating={true} />
    } else if (this.status === MessageAudio.STATUS_ERROR) {
      modalContent = <Text>加载错误</Text>;
      this.loadTimer = setTimeout(() => {
        this.setState({status: MessageAudio.STATUS_LOADING});
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
