'use strict';

let context = require.context('./src/client/actions', true, /\.test\.js?$/);
context.keys().forEach(context);
