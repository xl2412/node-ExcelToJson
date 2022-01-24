#!/usr/bin/env node

var program = require("commander");
const inquirer = require("inquirer");
const pkg = require("./package.json");
import {handleExcelToJson} from './index'

program.version(pkg.version, "-v, --version").parse(process.argv);

let fileUrl;

inquirer.prompt([askForFileUrl()]);

const askForFileUrl = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fileUrl",
        message: "请输入文件地址：",
      },
    ])
    .then((answer) => {
      fileUrl = JSON.parse(JSON.stringify(answer)).fileUrl;
      handleExcelToJson(fileUrl);
    });
};
