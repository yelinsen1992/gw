const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const { writeFile } = require('./msfuc.js')

// ejs生成静态html文件
const renderFuc = async (fromPath, buildPath, obj, i) => { // 3个参数依次为：渲染源文件、生成静态文件、动态参数、导航索引
  return new Promise((resolve, reject) => {
    ejs.renderFile(fromPath, { data: obj, curIndex: i }, async(err, str) => {
      if (err) {
        err = false
        resolve(false)
      } else {
        await writeFile(buildPath, str)
        resolve(true)
      }
    })
  })
}

// 创建路径
const mkdir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
// 路径是否存在，不存在则创建
const dirExists = async(dir) => {
  const isExists = await fileInfo(dir)
  // 如果该路径存在且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) { // 如果该路径存在但是文件，返回false
    return false
  }
  // 如果该路径不存在
  const tempDir = path.parse(dir).dir // 拿到上级路径
  // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  const status = await dirExists(tempDir)
  let mkdirStatus
  if (status) {
    mkdirStatus = await mkdir(dir)
  }
  return mkdirStatus
}
// 读取文件所有信息
const fileInfo = async(pathName) => {
  return new Promise((resolve, reject) => {
    fs.stat(pathName, (err, stats) => {
      if (err) {
        resolve(false)
      }
      resolve(stats)
    })
  })
}
// 遍历文件夹
const fsReadDir = async(oldP, newP) => {
  return new Promise((resolve, reject) => {
    fs.readdir(oldP, async(err, files) => {
      if (err) {
        resolve(false)
      }
      for (let i = 0; i < files.length; i++) {
        const flag = (await fileInfo(path.join(oldP, files[i]))).isFile()
        const _flag = (await fileInfo(path.join(oldP, files[i]))).isDirectory()
        if (flag) {
          await dirExists(newP)
          await writeFile(path.join(newP, files[i]), fs.readFileSync(path.join(oldP, files[i])))
        }
        if (_flag) {
          await fsReadDir(path.join(oldP, files[i]), path.join(newP, files[i]))
        }
      }
      resolve(true)
    })
  })
}
// 遍历复制文件或文件夹
const copyFuc = async(oldP, newP) => {
  const a = await fileInfo(oldP)
  if (a.isFile()) { // 文件
    await writeFile(newP, fs.readFileSync(oldP))
    return true
  } else if (a.isDirectory()) { // 目录
    await fsReadDir(oldP, newP)
    return true
  } else {
    return false
  }
}

module.exports = { renderFuc, copyFuc }
