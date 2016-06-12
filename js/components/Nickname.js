'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Dimensions
} from 'react-native';

class Nickname extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nickname: this.props.nickname,
    };
  }

  onSavePress() {
    // todo: ♤
    this.props.onNicknameUpdate(this.state.nickname);
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <TextInput placeholder={this.state.nickname} autoCorrect={false} autoCapitalize='none' multiline={false} style={styles.nicknameInput} ref="nickname" onChangeText={(nickname) => this.setState({nickname: nickname})} value={this.state.nickname} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  scrollView: {
    height: 300,
  },
  nicknameInput: {
    marginTop: 10,
    paddingLeft: 10,
    width: Dimensions.get('window').width,
    height: 40,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  }
});


export default Nickname;
