'use strict';

import qiniu from 'react-native-qiniu';
import {uuid} from './uuid';

export class Qiniu {

  static uploadFile(uri, key) {
    const putPolicy = new qiniu.auth.PutPolicy2(
      {
        scope: 'du-app',
      }
    );
    const uptoken = putPolicy.token();
    return qiniu.rpc.uploadFile(uri, uptoken, {key: key});
  }

  static genFileKey(format='jpeg') {
    if (['aac', 'jpeg', 'png'].indexOf(format) == -1 ) {
      throw new Error('不支持文件类型');
    }
    const date = new Date();
    const prefix = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}/${date.getHours()}/${date.getTime()}/${uuid()}`;
    console.log('prefix', prefix);
    return `${prefix}.${format}`;
  }
}
