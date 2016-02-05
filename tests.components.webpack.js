'use strict';

require('./tests.general');

let context = require.context('./src/client/components', true, /\.test\.js?$/);
context.keys().forEach(context);
