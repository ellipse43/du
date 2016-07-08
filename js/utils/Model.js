
import AV from 'avoscloud-sdk';
import {PER_PAGE} from '../const';

export let MessageModel = AV.Object.extend('Message');
export let messageQuery = new AV.Query('Message');

export class MessageQuery {

  static paginate(objId) {
    let q = new AV.Query('Message');
    q.limit(PER_PAGE);
    if (objId) {
      q.lessThan('objectId', objId);
    }
    q.addDescending('createdAt');
    return q.find();
  }

  static total() {
    let q = new AV.Query('Message');
    return q.count();
  }
}
