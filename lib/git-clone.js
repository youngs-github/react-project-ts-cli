const gitclone = require('git-clone');

/**
 * clone
 */
function download(src, dst, opts) {
  opts = opts || {};
  return new Promise((resolve, reject) => {
    gitclone(src, dst, opts, (error) => {
      if (error) {
        // 异常
        reject(error);
      } else {
        // 下一步
        resolve();
      }
    });
  });
}

module.exports = download;
