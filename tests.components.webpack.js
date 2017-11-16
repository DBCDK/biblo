'use strict';

require('./tests.general');

const context = require.context('./src/client/components', true, /\.test\.js?$/);
context.keys().forEach(context);
