import React from 'react';
import { View, StyleSheet, Text, ListView, RecyclerViewBackedScrollView } from 'react-native';

import MessageItem from './messageItem.js';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const items = ['周末好无聊啊。。。。', '我靠，日子过得这个鸟样，麻痹 如果有天我走去。。。出国去哪呢', '我生气了 😢', '为啥呢？👃', '低调内敛', '成熟稳重', '周末好无聊啊。。。。', '我靠，日子过得这个鸟样', '我生气了 😢', '为啥呢？👃', '低调内敛', '成熟稳重', '周末好无聊啊。。。。', '我靠，日子过得这个鸟样', '我生气了 😢', '为啥呢？👃', '低调内敛', '成熟稳重'];
    this.state = ({items: items, dataSource: ds.cloneWithRows(items)});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newMessage) {
      let items = this.state.items.slice();
      items.unshift(nextProps.newMessage);
      this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
    }
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

  renderRow(rowData: string, sectionID: number, rowID: number) {
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

