'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_gracefulFs2.default.gracefulify(_fs2.default);