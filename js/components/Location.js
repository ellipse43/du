'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Text
} from 'react-native';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {
      position: '',
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((initialPosition) => {
      this.setState({position: initialPosition})
    }, (error) => {
      console.log(error);
    }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.text}>
            {JSON.stringify(this.state.position)}
          </Text>
        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    height: 300,
  },
  text: {
    fontSize: 10,
  }
});


export default Location;
