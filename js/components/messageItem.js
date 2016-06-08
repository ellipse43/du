import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {socialFormatTime} from '../utils/time';
import {QINIU_IMG_URI} from '../const';

export default class MessageItem extends React.Component {
  constructor(props) {
    super(props);

    let imgs = [];
    if (this.props.rowData.get('imgs')) {
      imgs = this.props.rowData.get('imgs');
    }

    this.state = {
      content: this.props.rowData.get('content'),
      created: this.props.rowData.get('created'),
      imgs: imgs,
    };
  }

  componentWillReceiveProps(nextProps) {
    let imgs = [];
    if (nextProps.rowData.get('imgs')) {
      imgs = nextProps.rowData.get('imgs');
    }

    this.setState({
      content: nextProps.rowData.get('content'),
      created: nextProps.rowData.get('created'),
      imgs: imgs,
    });
  }

  render() {
    return (
      <View style={styles.row} key={this.props.rowData.get('ObjectId')} >
        <Text style={styles.message} allowFontScaling={true}>
          {this.state.content}
        </Text>
        <View style={styles.imgs}>
          {this.state.imgs.map((item, index) => {
            return (
              <Image
                key={index}
                style={styles.imgItem}
                source={{uri: `${QINIU_IMG_URI}/${item}`}} />
            )
          })}
        </View>
        <Text style={styles.createdText} >
          {socialFormatTime(this.state.created)}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
  },
  message: {
    fontSize: 15,
    lineHeight: 25,
  },
  imgs: {
    flex: 1,
    flexDirection: 'row',
  },
  imgItem: {
    width: 100,
    height: 100,
    marginTop: 5,
    marginRight: 5
  },
  createdText: {
    fontSize: 10,
    marginTop: 5,
  }
});
