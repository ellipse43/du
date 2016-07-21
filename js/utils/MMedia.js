'use strict';

import {NativeModules} from 'react-native';

export class MMedia {

  static showImagePicker(func, customEvent) {
    const options = {
      title: '',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '',
      customButtons: {
        '照片': 'photo',
      },
      cameraType: '返回',
      mediaType: '照片',
      videoQuality: 'high',
      durationLimit: 10,
      aspectX: 2,
      aspectY: 1,
      quality: 1,
      angle: 0,
      allowsEditing: false,
      noData: false,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    NativeModules.ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      } else if (response.customButton) {
        customEvent();
      } else {
        func(response);
      }
    });
  }

}
