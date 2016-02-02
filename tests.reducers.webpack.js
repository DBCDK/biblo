'use strict';

let context = require.context('./src/client/reducers', true, /\.test\.js?$/);
context.keys().forEach(context);
