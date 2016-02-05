'use strict';

require('./tests.general');

let context = require.context('./src/client/Actions', true, /\.test\.js?$/);
context.keys().forEach(context);
