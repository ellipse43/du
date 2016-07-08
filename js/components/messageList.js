'use strict';

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  ActivityIndicatorIOS,
} from 'react-native';

import AV from 'avoscloud-sdk';
import MessageItemView from './MessageItem';
import {
  MessageModel,
  MessageQuery,
} from '../utils/Model';
import {PER_PAGE} from '../const';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const items = [];
    this.state = {
      isRefreshing: false,
      isEndReached: false,
      isBottomReached: false,
      isLoading: true,
      items: items,
      dataSource: ds.cloneWithRows(items),
    };
  }

  componentWillMount() {
    MessageQuery.paginate().then((items) => {
      this.setState({
        items: items,
        dataSource: this.state.dataSource.cloneWithRows(items),
        isLoading: false,
      });
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
    if (this.state.isBottomReached) {
      return;
    }

    this.setState({isLoading: true});

    let objId = null;
    const item = this.state.items[this.state.items.length - 1];
    if (item) {
      objId = item.get('objectId');
    }
    MessageQuery.paginate(objId).then((rs) => {
      if (rs.length < PER_PAGE) {
        this.setState({isBottomReached: true});
      }
      let items = this.state.items.slice();
      items.push.apply(items, rs);
      this.setState({
        isLoading: false,
        isEndReached: false,
        items: items,
        dataSource: this.state.dataSource.cloneWithRows(items),
      });
    }, (error) => {
      console.log(`Error: ${error.code} ${error.message}`);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0}
          enableEmptySections={true}
          renderFooter={this.renderFooter.bind(this)}
        />
      </View>
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

  renderFooter() {
    let loadingView = null;
    if (this.state.isLoading) {
      loadingView =
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', height: 40}}>
          <ActivityIndicatorIOS
            size='small'
            animating={true}
            style={{padding: 5}}
          />
          <Text style={{backgroundColor: '#FFFFFF'}}>
            正在加载...
          </Text>
        </View>;
    }
    return loadingView;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  separator: {
    height: 2,
    backgroundColor: '#EDEDED'
  },
});

