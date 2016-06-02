import React from 'react';
import { View, StyleSheet, Text, ListView, RecyclerViewBackedScrollView } from 'react-native';

import MessageItem from './messageItem.js';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const items = [
      {
        author: 'ellipse42',
        content: '马勒戈壁',
        created: Date(),
      }
    ]
    this.state = ({items: items, dataSource: ds.cloneWithRows(items)});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newMessage === this.props.newMessage) {
      return;
    }
    if (nextProps.newMessage) {
      let items = this.state.items.slice();
      items.unshift(nextProps.newMessage);
      this.setState({items: items, dataSource: this.state.dataSource.cloneWithRows(items)});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.newMessage != this.props.newMessage;
  }

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

