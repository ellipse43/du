import React from 'react';
import {View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, NativeModules} from 'react-native';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {content: ''};
  }

  call() {
    if (this.state.content.length < 1) {
      Alert.alert('警告', '输入字数太少');
      return;
    }
    this.props.onMessageCreate(this.state.content);
    this.props.navigator.pop();
  }

  _onImageSelect() {
    const options = {
      title: 'Select Avatar', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 100, // photos only
      maxHeight: 100, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    NativeModules.ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

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
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        this.setState({
          avatarSource: source
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <TextInput multiline={true} style={styles.messageInput} ref="content" onChangeText={(content) => this.setState({content: content})} value={this.state.content} />
        <TouchableOpacity style={styles.imageSelect} onPress={this._onImageSelect.bind(this)} >
          <Text>
            +
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 45
  },
  messageInput: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    fontSize: 18
  },
  imageSelect: {
    width: 40,
    height: 40,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFBBAA'
  }
})
