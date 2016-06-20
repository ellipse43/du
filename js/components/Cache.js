'use strict';

import Storge from 'react-native-storge';

const cache = new Storge({
  size: 10000,
  defaultExpires: 1000 * 3600 * 24 * 30,
  enableCache: true,
  sync: {

  },
});

global.cache = cache;
