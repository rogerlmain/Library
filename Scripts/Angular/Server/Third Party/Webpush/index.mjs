'use strict';

//import vapidHelper from './vapid-helper';
import encryptionHelper from 'web-push/src/encryption-helper';
import WebPushLib from 'web-push/src/web-push-lib';
import WebPushError from 'web-push/src/web-push-error';
import WebPushConstants from 'web-push/src/web-push-constants';

const webPush = new WebPushLib();

export default {
  WebPushError: WebPushError,
  supportedContentEncodings: WebPushConstants.supportedContentEncodings,
  encrypt: encryptionHelper.encrypt,
  getVapidHeaders: vapidHelper.getVapidHeaders,
  generateVAPIDKeys: vapidHelper.generateVAPIDKeys,
  setGCMAPIKey: webPush.setGCMAPIKey,
  setVapidDetails: webPush.setVapidDetails,
  generateRequestDetails: webPush.generateRequestDetails,
  sendNotification: webPush.sendNotification
};
