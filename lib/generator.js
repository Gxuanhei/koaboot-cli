/**
 * Greated By xuanhei on 2020/9/20
 **/

const Metalsmith = require('metalsmith') // 静态网站生成器
const shell = require('shelljs');
const {promisify} = require("util");
const exec = promisify(shell.exec);
const rm = require('rimraf').sync // 相当于UNIX的“rm -rf”命令
const ora = require('ora') // 用于命令行上的加载效果
const installDependencies = async (projectName)=>{
    //1. 进入创建的项目目录
    shell.cd(projectName);
    // await exec("dir");
    //2. 执行npm install 指令
    await exec("npm install");

}


module.exports = async (metadata = {}, src, dest = '.',name='') =>{
    console.log(src)
    if (!src) {
        return Promise.reject(new Error(`无效的source：${src}`))
    }
    if(!name){
        return Promise.reject(new Error(`当前项目不存在`))
    }
    await new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => { // 从临时目录复制到项目目录

                const result = metalsmith.metadata;
                // 2.根据用户填写的配置信息编译模板 metal可以用来传递对象
                // 2.1 遍历拿到所有文件
                Reflect.ownKeys(files).forEach(async (filePath,index) => {
                    // 2.2获取当前文件的内容
                    if (filePath.includes('.js') || filePath.includes('.json')) {
                        // console.log(files[filePath].contents.toString());
                        // 2.3 获取当前文件的内容
                        let fileContent = files[filePath].contents.toString()
                        // 2.4 判断当前文件的内容是否需要编译
                        if (fileContent.includes('<%')) {
                            console.log('需要打印')
                            // 通过consolidate这个库来编译需要编译的模板 传两个参数 一个需要编译的内容 第二个数据
                            let resultContent = await render(fileContent, result);
                            files[filePath].contents = Buffer.from(resultContent);
                        }
                    }
                });
                done()
            }).build(err => {
            rm(src) // 删除临时目录
            err ? reject(err) : resolve()
        })
    });

    const spinner = ora('正在安装相关依赖，请稍后...')
    spinner.start()
    await installDependencies(name);
    spinner.succeed();
}
