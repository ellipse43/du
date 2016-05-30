import React from 'react';
import MessageList from './messageList.js';
import Magic from './magic.js';
import {NavigatorIOS, View, StyleSheet} from 'react-native';


export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <MessageList />
        <Magic navigator={this.props.navigator} />
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
