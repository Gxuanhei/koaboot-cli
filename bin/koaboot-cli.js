#!/usr/bin/env node

/**
 * Greated By xuanhei on 2020/9/20
 **/
//相关包引入
const boxen = require('boxen'); // 用于创建控制台盒子
const inquirer = require('inquirer') // 用于命令行与开发者交互
const chalk = require('chalk') // 用于高亮终端打印出的信息
const config = require("../Config/config")
// commander.js 用来处理命令行的工具
const commander = require('commander')

//创建模板
const cliRun = require("./koaboot-cli-create")

//定义选择字符
const promptList = [{
    type: 'list',
    message: '请选择创建的模板:',
    name: 'module',
    choices: [
        "默认模板",
        "使用例子",
        "源码"
    ]
}];


//选择模板函数定义
function RunCli(){
    // 首先执行输出 欢迎语 欢迎使用KoaBootJS
    console.log(boxen('欢迎使用KoaBootJS', {padding: 1, margin: 1, borderStyle: 'classic',borderColor:"green"}));
    inquirer.prompt(promptList).then(answers => {
        // console.log(answers); // 返回的结果
        if(answers.module==="默认模板"){
            config.nowDownUrl = config.Urls.default;
            commander
                .version('1.0.0') // 当你执行 koaboot-cli -V 命令的时候，就会显示：1.0.0
                .command('create <name>')
                .description('创建新项目')
                .action((name)=>{
                    cliRun(name, config.nowDownUrl)
                });
            commander.parse(process.argv) //解析获取输入的参数 例如：koaboot-cli create project-name 中 project-name 就是参数，然后就可以通过program.args拿到这个参数
        }
        if(answers.module==="使用例子"){
            config.nowDownUrl = config.Urls.example;
            commander
                .version('1.0.0') // 当你执行 koaboot-cli -V 命令的时候，就会显示：1.0.0
                .command('create <name>')
                .description('创建新项目')
                .action((name)=>{
                    cliRun(name, config.nowDownUrl)
                });
            commander.parse(process.argv) //解析获取输入的参数 例如：koaboot-cli create project-name 中 project-name 就是参数，然后就可以通过program.args拿到这个参数
        }
        if(answers.module==="源码"){
            console.log(boxen('暂未完成，1s后返回主菜单', {padding: 1, margin: 1, borderStyle: 'classic',borderColor:"green"}));
            setTimeout(()=>{
                config.nowDownUrl = "";
                RunCli();
            },1500)
        }
    })
}



// 程序运行入口
RunCli();