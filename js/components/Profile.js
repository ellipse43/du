'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  NativeModules,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import qiniu from 'react-native-qiniu';

import {MessageQuery} from './Model';
import {putPolicy} from '../utils/qiniu';
import {QINIU_IMG_URI} from '../const';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
      messageNumber: '',
    };
  }

  componentWillMount() {
    MessageQuery.total().then((number) => {
      this.setState({messageNumber: number});
    });
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

        StatusBar.setNetworkActivityIndicatorVisible(true);
        qiniu.rpc.uploadFile(response.uri, uptoken, {key: key}).then(resp => {
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

        }).finally(() => {
          StatusBar.setNetworkActivityIndicatorVisible(false);
        });
      }
    });
  }

  render() {
    const avatar = this.state.currentUser.get('avatar');

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={{marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={this.onAvatarPress.bind(this)}
            >
              <Image
                style={styles.avatarImage}
                source={{uri: `${QINIU_IMG_URI}/${avatar}`}} />
            </TouchableOpacity>

            <View style={styles.panel}>
              <TouchableOpacity style={styles.panelBtn}>
                <Text style={{}}>
                  {this.state.messageNumber}
                </Text>
                <Text style={styles.panelBtnLabel}>
                  帖子
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.panelBtn}>
                <Text style={{}}>
                  0
                </Text>
                <Text style={styles.panelBtnLabel}>
                  关注者
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.panelBtn}>
                <Text style={{}}>
                  0
                </Text>
                <Text style={styles.panelBtnLabel}>
                  关注
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  avatarImage: {
    marginLeft: 10,
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
  },
  panel: {
    flexDirection: 'row',
    marginRight: 40,
    height: 60,
    width: 150,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelBtn: {
    alignItems: 'center',
  },
  panelBtnLabel: {
    fontSize: 12,
    color: '#ABABAB',
  }
});


export default Profile;
