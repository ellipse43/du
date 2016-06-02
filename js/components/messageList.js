import React from 'react';
import { View, StyleSheet, Text, ListView, RecyclerViewBackedScrollView } from 'react-native';

import MessageItem from './messageItem.js';
import { MessageModel, messageQuery} from './model.js';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const items = [];
    this.state = ({items: items, dataSource: ds.cloneWithRows(items)});
  }

  componentWillMount() {
    messageQuery.limit(2);
    messageQuery.addDescending('createdAt');
    messageQuery.find().then((items) => {
      this.setState({items: items, dataSource: this.state.dataSource.cloneWithRows(items)});
    }, (error) => {
      console.log(`Error: ${error.code} ${error.message}`);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newMessage === this.props.newMessage) {
      return;
    }
    if (nextProps.newMessage) {
      const msg = MessageModel.new(nextProps.newMessage);
      msg.save().then((msg) => {
        console.log('Create');
      }, (error) => {
        console.log(`Error: ${error.code} ${error.message}`);
      });
      let items = this.state.items.slice();
      items.unshift(msg);
      this.setState({items: items, dataSource: this.state.dataSource.cloneWithRows(items)});
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.newMessage != this.props.newMessage;
  // }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
      />
    )
  }

  renderRow(rowData: Map, sectionID: number, rowID: number) {
    return (
      <MessageItem
        rowData={rowData}
        sectionID={sectionID}
        rowID={rowID}
      />
    )
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  }
});

