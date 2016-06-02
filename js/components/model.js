
import AV from 'avoscloud-sdk';

export let MessageModel = AV.Object.extend('Message');
export let messageQuery = new AV.Query('Message');
