import React from 'react';
import { View, StyleSheet, Text, ListView, RecyclerViewBackedScrollView } from 'react-native';

import MessageItem from './messageItem.js';

export default class MessageListView extends React.Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = ({dataSource: ds.cloneWithRows(['周末好无聊啊。。。。', '我靠，日子过得这个鸟样', '我生气了 😢', '为啥呢？👃', '低调内敛', '成熟稳重', '周末好无聊啊。。。。', '我靠，日子过得这个鸟样', '我生气了 😢', '为啥呢？👃', '低调内敛', '成熟稳重', '周末好无聊啊。。。。', '我靠，日子过得这个鸟样', '我生气了 😢', '为啥呢？👃', '低调内敛', '成熟稳重'])});
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

