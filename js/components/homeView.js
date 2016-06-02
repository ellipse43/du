import React from 'react';
import MessageList from './messageList.js';
import Magic from './magic.js';
import {NavigatorIOS, View, StyleSheet} from 'react-native';


export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {newMessage: undefined};
  }

  messageCreate(content) {
    this.setState({newMessage: {
      author: 'ellipse42',
      content: content,
      created: Date()
    }});
  }
  render() {
    let messageList = <MessageList />
    if (this.state.newMessage) {
      messageList = <MessageList newMessage={this.state.newMessage} />
    }

    return (
      <View style={styles.container}>
        {messageList}
        <Magic navigator={this.props.navigator} messageCreate={this.messageCreate.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
});
