import Promise from 'bluebird';

/**
 * @param {Function} func 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
*/
function promiseHandle(func, options) {
  options = options || {};
  return new Promise((resolve, reject) => {
    if (typeof func !== 'function')
        reject();
    options.success = resolve;
    options.fail = reject;
    func(options);
  });
}

module.exports = {
  Promise: promiseHandle
}
