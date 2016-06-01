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
    console.log('...', content);
    this.setState({newMessage: content});
  }

  render() {
    return (
      <View style={styles.container}>
        <MessageList newMessage={this.state.newMessage} />
        <Magic navigator={this.props.navigator} messageCreate={this.messageCreate.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF'
  }
});
