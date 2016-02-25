'use strict';

require('./tests.general');

let context = require.context('./src/client/Utils', true, /\.test\.js?$/);
context.keys().forEach(context);
