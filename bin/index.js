#!/usr/bin/env node

const fs = require('fs');
const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');
const program = require('commander');
const inquirer = require('inquirer');

const download = require('../lib/git-clone');
const checkVersion = require('../lib/check-version');

const packageJson = require('../package.json');

/**
 * usage
 */
program
  .name(packageJson.name)
  .usage(chalk.green('<project-name>'))
  .version(packageJson.version);

/**
 * args
 */
program.parse(program.argv);
if (program.args.length < 1) {
  return program.help();
}

/**
 * exit
 */
process.on('exit', () => {
  console.log();
});

/**
 * check
 */
const project = path.resolve(program.args[0]);
if (fs.existsSync(project)) {
  // 目录已存在
  inquirer
    .prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: '目录已存在，继续?'
      }
    ])
    .then((ans) => {
      if (ans.ok) {
        // 确认运行
        init();
      } else {
        console.log();
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error(chalk.red(error));
      process.exit(1);
    });
} else {
  // 目录不存在
  inquirer
    .prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: '即将生成代码，继续?'
      }
    ])
    .then((ans) => {
      if (ans.ok) {
        // 确认运行
        init();
      } else {
        console.log();
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error(chalk.red(error));
      process.exit(1);
    });
}

/**
 * 1、检测版本
 * 2、下载生成
 */
async function init() {
  // 下载
  const spinner = ora('downloading...');
  try {
    // 检测
    await checkVersion('https://registry.npmjs.org/react-project-ts-cli');
    spinner.start();
    await download(
      'https://github.com/youngs-github/react-project-ts.git',
      project,
      {
        checkout: 'master',
        shallow: true
      }
    );
    // 成功
    spinner.stop();
    console.log(chalk.green('创建成功！'));
  } catch (e) {
    // 异常
    spinner.stop();
    console.error(chalk.red(e));
  } finally {
    // 移除.git文件夹
    rimraf.sync(`${project}/.git`);
  }
}
