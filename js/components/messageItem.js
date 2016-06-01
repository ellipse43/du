import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {socialFormatTime} from '../utils/time';

export default class MessageItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.message} allowFontScaling={true}>
            {this.props.rowData.content}
          </Text>
          <Text>
            {socialFormatTime(this.props.rowData.created)}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    backgroundColor: '#F6F6F6'
  },
  message: {
    fontSize: 20,
    lineHeight: 25,
    marginLeft: 5
  }
});
