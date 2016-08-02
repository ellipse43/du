'use strict';

import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Lightbox from 'react-native-lightbox';
import Carousel from 'react-native-looped-carousel';

import CacheImage from './CacheImage';
import Imagebox from './Imagebox';
import Audiobox from './Audiobox';
import {socialFormatTime} from '../utils/Time';
import {QINIU_IMG_URI, WINDOW_WIDTH, WINDOW_HEIGHT} from '../const';

export default class MessageItem extends React.Component {
  constructor(props) {
    super(props);

    let imgs = [];
    if (this.props.rowData.get('imgs')) {
      imgs = this.props.rowData.get('imgs');
    }

    let audio = '';
    if (this.props.rowData.get('audio')) {
      audio = this.props.rowData.get('audio');
    }

    this.state = {
      content: this.props.rowData.get('content'),
      createdStr: socialFormatTime(this.props.rowData.get('createdAt')),
      imgs: imgs,
      audio: audio,
    };
  }

  componentWillReceiveProps(nextProps) {
    let imgs = [];
    if (nextProps.rowData.get('imgs')) {
      imgs = nextProps.rowData.get('imgs');
    }

    let audio = '';
    if (nextProps.rowData.get('audio')) {
      audio = nextProps.rowData.get('audio');
    }

    this.setState({
      content: nextProps.rowData.get('content'),
      createdStr: socialFormatTime(nextProps.rowData.get('createdAt')),
      imgs: imgs,
      audio: audio,
    });
  }

  render() {
    let textView = null;
    if (this.state.content) {
      textView = <Text style={styles.message} allowFontScaling={true}>
        {this.state.content}
      </Text>
    }

    let imgView = null;
    if (this.state.imgs) {
      imgView = <Imagebox imgs={this.state.imgs} />
    }

    let audioView = null;
    if (this.state.audio) {
      audioView = <Audiobox audioKey={this.state.audio} />
    }

    return (
      <View style={styles.row} key={this.props.rowData.get('ObjectId')} >
        {textView}
        {imgView}
        {audioView}
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
