'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Animated,
  Image,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import CacheImage from './CacheImage';
import {WINDOW_WIDTH, WINDOW_HEIGHT, QINIU_IMG_URI} from '../const';

class Imagebox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animationType: 'none',
      modalVisible: false,
      transparent: true,
      currentIndex: null,
    };
  }

  open(pos) {
    this.setState({
      modalVisible: true,
      currentIndex: pos,
    })
  }

  exit() {
    this.setState({
      modalVisible: false,
    })
  }

  renderImgs(line, imgs) {
    return (
      <View style={styles.imgs}>
        {imgs.map((item, index) => {
          return (
            <Animated.View key={`img${index + line * 2}`} style={{marginRight: 5, marginTop: 5}}>
              <TouchableHighlight
                onPress={this.open.bind(this, index + line * 2)}>
                <CacheImage
                  style={styles.imgItem}
                  source={{uri: `${item}`}} />
              </TouchableHighlight>
            </Animated.View>
          )
        })}
      </View>
    )
  }

  render() {
    const imgLineOne = this.props.imgs.slice(0, 2);
    const imgLineTwo = this.props.imgs.slice(2, 4);

    return (
      <View style={styles.container}>
        <Modal animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}
          >
          <View style={styles.modalContaier}>
            <Carousel autoplay={false} style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT}} chosen={this.state.currentIndex}>
              {this.props.imgs.map((item, index) => {
                return (
                  <TouchableWithoutFeedback onPress={this.exit.bind(this)} key={`carousel${index}`}>
                    <CacheImage
                      style={{flex: 1}}
                      resizeMode='contain'
                      source={{uri:`${item}`}}
                      thumbnail={false}
                    />
                  </TouchableWithoutFeedback>
                )
              })}
            </Carousel>
          </View>
        </Modal>
        {this.renderImgs(0, imgLineOne)}
        {this.renderImgs(1, imgLineTwo)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgItem: {
    width: 100,
    height: 100,
  },
  modalContaier: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  imgs: {
    flexDirection: 'row',
  },
});


export default Imagebox;
