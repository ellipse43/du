'use strict';

import React from 'react';
import {View, StyleSheet, Text, ListView, RecyclerViewBackedScrollView, RefreshControl} from 'react-native';

import AV from 'avoscloud-sdk';
import MessageItemView from './MessageItem.js';
import {MessageModel, messageQuery} from './Model.js';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const items = [];
    this.state = {
      isRefreshing: false,
      isEndReached: false,
      isLoading: false,
      items: items,
      dataSource: ds.cloneWithRows(items),
    };
    this.query = new AV.Query('Message');
  }

  componentWillMount() {
    this.query.limit(5);
    this.query.addDescending('createdAt');
    this.query.find().then((items) => {
      this.setState({items: items, dataSource: this.state.dataSource.cloneWithRows(items)});
    }, (error) => {
      console.log(`Error: ${error.code} ${error.message}`);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newMessage === this.props.newMessage) {
      return;
    }

    let items = this.state.items.slice();
    items.unshift(nextProps.newMessage);

    this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items),
    });
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
  }

  _onEndReached() {
    if (this.state.isEndReached) {
      return;
    }
    if (this.state.isLoading) {
      return;
    }
    this.setState({isLoading: true});

    const item = this.state.items[this.state.items.length - 1];
    if (item) {
      this.query.lessThan('objectId', item.get('objectId'));
    }
    this.query.limit(5);
    this.query.addDescending('createdAt');
    this.query.find().then((rs) => {
      if (rs.length < 5) {
        this.setState({isEndReached: true});
      }
      let items = this.state.items.slice();
      items.push.apply(items, rs);
      this.setState({
        isLoading: false,
        items: items,
        dataSource: this.state.dataSource.cloneWithRows(items),
      });
    }, (error) => {
      console.log(`Error: ${error.code} ${error.message}`);
    });
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        onEndReached={this._onEndReached.bind(this)}
        enableEmptySections={true}
      />
    )
  }

  renderRow(rowData: Map, sectionID: number, rowID: number) {
    return (
      <MessageItemView
        rowData={rowData}
        sectionID={sectionID}
        rowID={rowID}
      />
    )
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 2,
    backgroundColor: '#EDEDED'
  }
});

