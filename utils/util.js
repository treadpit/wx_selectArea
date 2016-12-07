import Promise from 'bluebird';

/**
 * @param {Function} fun 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
*/
function _Promise (fun, options) {
  options = options || {};
  return new Promise((resolve, reject) => {
    if (typeof fun !== 'function')
        reject();
    options.success = resolve;
    options.fail = reject;
    fun(options);
  });
}

module.exports = {
  Promise: _Promise
}
