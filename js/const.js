'use strict';

import {Dimensions} from 'react-native';
import FS from 'react-native-fs';

const QINIU_IMG_URI = 'http://o8a6ibmov.bkt.clouddn.com';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const PER_PAGE = 10;

const ImageCachePath = FS.CachesDirectoryPath;


export {
  QINIU_IMG_URI,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  PER_PAGE,
  ImageCachePath,
};
