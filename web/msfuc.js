const fs = require('fs')

// 写入文件
const writeFile = async(path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf-8', (err) => {
      if (err) {
        err = false
        resolve(err)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = { writeFile }
