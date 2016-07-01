'use strict';

import React from 'react';
import {View, Image, Stylesheet} from 'react-native';
import FS from 'react-native-fs';
import md5 from 'blueimp-md5';
import {QINIU_IMG_URI, ImageCachePath} from '../const';


export default class CacheImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      source: null,
      thumbnail: props.thumbnail? true : false,
    };

    this.sourceUpdate = this.sourceUpdate.bind(this);
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  sourceUpdate(source) {
    if (source) {
      const uri = source.uri;
      if (true) {
        const filetype = uri.replace(/.*\.(.*)/, '$1');
        const filename = `${md5(uri)}.${filetype}`;
        let filepath, downloadURL;
        if (this.state.thumbnail) {
          filepath = `${ImageCachePath}/${filename}.200x200`;
          downloadURL = `${QINIU_IMG_URI}/${uri}?imageView2/1/w/200/h/200/q/100`;
        } else {
          filepath = `${ImageCachePath}/${filename}`;
          downloadURL = `${QINIU_IMG_URI}/${uri}`;
        }

        FS.exists(filepath).then(exists => {
          if (exists) {
            this.setState({source: filepath});
          } else {
            FS.downloadFile({fromUrl: downloadURL, toFile: filepath}).then(res => {
              if (res.statusCode == 200) {
                this.setState({source: filepath});
              }
            }).catch(err => {
              console.log('error load', err);
            });
          }
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source.uri == this.props.source.uri) {
      return;
    }
    // 先至为空
    this.setState({source: null});
    this.sourceUpdate(nextProps.source);
  }

  componentDidMount() {
    this.sourceUpdate(this.props.source);
  }

  render() {
    return (
      <Image
        ref={component => this._root=component}
        {...this.props}
        source={{uri: this.state.source}}
      />
    )
  }
}
