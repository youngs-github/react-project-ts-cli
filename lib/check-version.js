const chalk = require('chalk');
const semver = require('semver');
const nodefetch = require('node-fetch');

/**
 * 拉取最新版本
 */
function checkVersion(src) {
  return new Promise(async (resolve) => {
    try {
      const res = await nodefetch(src, {
        method: 'get',
        timeout: 2000
      });
      if (res && res.status === 200) {
        const latest = JSON.parse(res.body)['dist-tags'].latest;
        const current = packageJson.version;
        if (semver.lt(current, latest)) {
          console.log(chalk.yellow(`A newer version of ${packageJson.name} is available.`));
          console.log();
          console.log('  latest:    ' + chalk.green(latest));
          console.log('  installed: ' + chalk.red(current));
          console.log();
        }
      }
    } catch (e) {
      // 静默
    } finally {
      resolve();
    }
  });
}

module.exports = checkVersion;
