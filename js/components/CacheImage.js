'use strict';

import React from 'react';
import {View, Image, Stylesheet} from 'react-native';
import FS from 'react-native-fs';
import md5 from 'blueimp-md5';
import {QINIU_IMG_URI} from '../const';


// fix: images
const ImageCachePath = FS.CachesDirectoryPath;

export default class CacheImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      source: null,
    };
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  componentDidMount() {
    if (this.props.source) {
      const uri = this.props.source.uri;
      if (true) {
        const filetype = uri.replace(/.*\.(.*)/, '$1');
        const filename = `${md5(uri)}.${filetype}`;
        const filepath = `${ImageCachePath}/${filename}`;
        const downloadURL = `${QINIU_IMG_URI}/${uri}`;

        FS.exists(filepath).then(exists => {
          if (exists) {
            this.setState({source: filepath});
          } else {
            FS.downloadFile({fromUrl: downloadURL, toFile: filepath}).then(res => {
              console.log(res);
              this.setState({source: filepath});
            }).catch(err => {
              console.log(err);
            });
          }
        });
      }
    }
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
