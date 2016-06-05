'use strict';

import qiniu from 'react-native-qiniu';

const putPolicy = new qiniu.auth.PutPolicy2(
  {scope: 'du-app'}
);

export {putPolicy};
