import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class MessageItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.message}>
            {this.props.rowData}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F6F6F6'
  },
  message: {
    fontSize: 20,
    marginLeft: 20
  }
});
