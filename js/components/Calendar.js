'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import Svg, {
  Circle,
  Rect,
} from 'react-native-svg';

import {WINDOW_WIDTH} from '../const';

const gap = 24;

class Calendar extends Component {

  render() {
    let days = [];
    for (let i=1; i<=7; i++) {
      for (let j=1; j<=gap; j++) {
        days.push([i, j])
      }
    }
    let rects = [];
    const date = new Date();
    const week  = date.getDay() == 0 ? 7 : date.getDay();
    days.map(day => {
      if (day[1] == 1 && days[0] > week) {
        // 过滤
      } else {
        rects.push([day[0], day[1]]);
      }
    })

    return (
      <Svg
        width={WINDOW_WIDTH}
        height="200"
        style={styles.calendar}>
        {rects.map(rect => {
          return (
            <Rect
              key={`${rect[0]}${rect[1]}`}
              x={`${(rect[1] - 1) * 12}`}
              y={`${(rect[0] - 1) * 12}`}
              width="10"
              height="10"
              fill="rgb(238, 238, 238)"
              style={styles.rect}
            />
          )
        })}
      </Svg>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: '#FFF',
    marginLeft: (WINDOW_WIDTH - gap * 10 - (gap - 1) * 2) / 2,
    marginTop: 20,
  },
  rect: {
    marginLeft: 5,
  },
});

export default Calendar;
