'use strict';

require('./tests.general');

let context = require.context('./src/client/Reducers', true, /\.test\.js?$/);
context.keys().forEach(context);
