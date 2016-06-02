import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {socialFormatTime} from '../utils/time';

export default class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {content: this.props.rowData.get('content'), created: this.props.rowData.get('created')};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({content: nextProps.rowData.get('content'), created: nextProps.rowData.get('created')});
  }

  render() {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.message} allowFontScaling={true}>
            {this.state.content}
          </Text>
          <Text>
            {socialFormatTime(this.state.created)}
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
