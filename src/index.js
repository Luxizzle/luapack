const fs = require('fs-extra')
const path = require('path')
const md5Hex = require('md5-hex')

const requireTemplate = fs.readFileSync(__dirname+'/require.lua', 'utf8')
const loadTemplate = (hash, data) => `proxy_package.packages['${hash}'] = function()\n${data}\nend;\n\n`

module.exports.build = build

// maybe parse stuff with luaparse? idk...

const requireRegexp = /require\(?(?:"|')([^"']+)(?:"|')\)?/g

function build(mainFile) {
  mainFile = path.resolve(mainFile)
  var mainPath = path.parse(mainFile).dir
  var mainHash = md5Hex(mainFile)

  var packages = new Map()

  function parseFile(file, hash) {
    const inputData = fs.readFileSync(file, 'utf8')
    let mainPath = path.dirname(file)

    packages.set(hash, true) // reserve package

    const outputData = inputData.replace(requireRegexp, (_, match) => {
      var reqPath = path.resolve(mainPath,match)
      var reqHash = md5Hex(reqPath)

      if (!packages.has(reqHash)) {
        parseFile(reqPath, reqHash)
      }

      return `require('${reqHash}')` // replace file path with hash
    })

    packages.set(hash, outputData)
  }
  
  parseFile(mainFile, mainHash)

  var outputData = requireTemplate

  packages.forEach((data, hash) => {
    outputData += loadTemplate(hash, data)
  })

  outputData += `require('${mainHash}')\n` // require the main file

  return outputData
}

