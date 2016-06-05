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
      imgs: imgs
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
      imgs: imgs
    });
  }

  render() {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.message} allowFontScaling={true}>
            {this.state.content}
          </Text>
          <View style={styles.imgs}>
            {this.state.imgs.map((item) => {
              return (
                <Image
                  style={styles.imgItem}
                  source={{uri: `${QINIU_IMG_URI}/${item}`}} />
              )
            })}
          </View>
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
  },
  imgs: {
    flex: 1,
    flexDirection: 'row'
  },
  imgItem: {
    width: 40,
    height: 40,
    marginLeft: 5
  }
});
