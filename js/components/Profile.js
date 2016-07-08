'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import qiniu from 'react-native-qiniu';

import {MessageQuery} from '../utils/Model';
import {Qiniu} from '../utils/Qiniu';
import {MMedia} from '../utils/MMedia';
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

      }).finally(() => {
        StatusBar.setNetworkActivityIndicatorVisible(false);
      });
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
