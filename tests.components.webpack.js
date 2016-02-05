'use strict';

require('./tests.general');

let context = require.context('./src/client/Components', true, /\.test\.js?$/);
context.keys().forEach(context);
