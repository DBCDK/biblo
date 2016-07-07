'use strict';

require('./tests.general');

let context = require.context('./src/server', true, /\.test\.js?$/);
context.keys().forEach(context);
