'use strict';

import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Lightbox from 'react-native-lightbox';
import Carousel from 'react-native-looped-carousel';

import CacheImage from './CacheImage';
import Imagebox from './Imagebox';
import {socialFormatTime} from '../utils/Time';
import {QINIU_IMG_URI, WINDOW_WIDTH, WINDOW_HEIGHT} from '../const';

export default class MessageItem extends React.Component {
  constructor(props) {
    super(props);

    let imgs = [];
    if (this.props.rowData.get('imgs')) {
      imgs = this.props.rowData.get('imgs');
    }

    this.state = {
      content: this.props.rowData.get('content'),
      createdStr: socialFormatTime(this.props.rowData.get('createdAt')),
      imgs: imgs,
    };
  }

  componentWillReceiveProps(nextProps) {
    let imgs = [];
    if (nextProps.rowData.get('imgs')) {
      imgs = nextProps.rowData.get('imgs');
    }

    this.setState({
      content: nextProps.rowData.get('content'),
      createdStr: socialFormatTime(nextProps.rowData.get('createdAt')),
      imgs: imgs,
    });
  }

  render() {
    return (
      <View style={styles.row} key={this.props.rowData.get('ObjectId')} >
        <Text style={styles.message} allowFontScaling={true}>
          {this.state.content}
        </Text>
        <Imagebox imgs={this.state.imgs} />
        <Text style={styles.createdText}>
          {this.state.createdStr}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
  },
  message: {
    fontSize: 15,
    lineHeight: 25,
    fontFamily: 'Avenir-Light',
  },
  createdText: {
    fontSize: 10,
    marginTop: 5,
    color: '#C7C7C7',
  }
});
