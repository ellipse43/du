import React from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';

export default class Message extends React.Component {
  constructor(props) {
    super(props);

    const route = this.props.navigator.navigationContext.currentRoute;
    route.onRightButtonPress = () => {
      this.call();
    };
    this.props.navigator.replace(route);
    this.state = {content: ''};
  }

  call() {
    // console.log(this.state.content);
    if (this.state.content.length < 1) {
      Alert.alert('警告', '输入字数太少');
      return;
    }
    this.props.navigator.pop();
    this.props.onMessageCreate(this.state.content);
  }

  render() {
    return (
      <View style={styles.container} >
        <TextInput multiline={true} style={styles.messageInput} ref="content" onChangeText={(content) => this.setState({content: content})} value={this.state.content} />
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
  }
})
