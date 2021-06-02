/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {
  conversation,
  Canvas,
} = require('@assistant/conversation');
const functions = require('firebase-functions');

const INSTRUCTIONS = 'Do you want me to change color or pause spinning?';

const CANVAS_URL = 'https://PROJECT_ID.web.app';

const tints = {
  black: 0x000000,
  blue: 0x0000FF,
  green: 0x00FF00,
  cyan: 0x00FFFF,
  indigo: 0x4B0082,
  magenta: 0x6A0DAD,
  maroon: 0x800000,
  grey: 0x808080,
  brown: 0xA52A2A,
  violet: 0xEE82EE,
  red: 0xFF0000,
  purple: 0xFF00FF,
  orange: 0xFFA500,
  pink: 0xFFC0CB,
  yellow: 0xFFFF00,
  white: 0xFFFFFF,
};

const app = conversation({debug: true});

app.handle('welcome', (conv) => {
  if (!conv.device.capabilities.includes('INTERACTIVE_CANVAS')) {
    conv.add('Sorry, this device does not support Interactive Canvas!');
    conv.scene.next.name = 'actions.page.END_CONVERSATION';
    return;
  }
  conv.add('Welcome! Do you want me to change color or pause spinning? ' +
    'You can also tell me to ask you later.');
  conv.add(new Canvas({
    // Update this placeholder string with the URL for your canvas web app.
    url: CANVAS_URL,
    enableFullScreen: true,
    continueTtsDuringTouch: true,
  }));
});

app.handle('fallback', (conv) => {
  conv.add(`I don't understand. You can change my color or pause spinning.`);
  conv.add(new Canvas());
});

app.handle('change_color', (conv) => {
  const color =
    conv.intent.params.color? conv.intent.params.color.resolved : null;
  if (!(color in tints)) {
    conv.add(`Sorry, I don't know that color. Try red, blue, or green!`);
    conv.add(new Canvas());
    return;
  }
  conv.add(`Ok, I changed my color to ${color}. What else?`);
    conv.add(new Canvas({
      data: {
        command: 'TINT',
        tint: tints[color],
      },
    }));
});

app.handle('start_spin', (conv) => {
  conv.add(`Ok, I'm spinning. What else?`);
  conv.add(new Canvas({
    data: {
      command: 'SPIN',
      spin: true,
    },
  }));
});

app.handle('stop_spin', (conv) => {
  conv.add('Ok, I paused spinning. What else?');
  conv.add(new Canvas({
    data: {
      command: 'SPIN',
      spin: false,
    },
  }));
});

app.handle('instructions', (conv) => {
  conv.add(INSTRUCTIONS);
  conv.add(new Canvas());
});

app.handle('restart', (conv) => {
  conv.add(INSTRUCTIONS);
  conv.add(new Canvas({
    data: {
      command: 'RESTART_GAME',
    },
  }));
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
