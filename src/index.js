const fs = require('fs-extra')
const path = require('path')
const md5Hex = require('md5-hex')

const requireTemplate = fs.readFileSync(__dirname+'/require.lua', 'utf8')
const loadTemplate = (hash, data, filePath) => {
  return `proxy_package.packages['${hash}'] = function()
    local __hash = '${hash}'

    ${data}
  end;\n`
}

module.exports.build = build

const requireRegexp = /require\(?(?:"|')([^"']+)(?:"|')\)?/g

function build(mainFile) {
  mainFile = path.resolve(mainFile)
  var mainPath = path.parse(mainFile).dir
  var mainHash = md5Hex(mainFile)

  var packages = new Map()

  function parseFile(file, hash) {
    let fileName = path.basename(file, '.lua')
    let mainPath = path.dirname(file)
    let formattedPath = path.format({
      dir: mainPath,
      name: fileName,
      ext: '.lua'
    })
    let inputData = ''
    if (fs.existsSync(formattedPath)) {
      inputData = fs.readFileSync(formattedPath, 'utf8')
    }
    else {
      throw new Error('require() file not found: ' + file + ' ' + hash)
    }

    packages.set(hash, true) // reserve package

    const outputData = inputData.replace(requireRegexp, (_, match) => {
      var reqPath = path.resolve(mainPath,match)
      var extname = path.extname(reqPath)

      // Port the module name to a path name if needed.
      if (extname != '.lua') {
        reqPath = reqPath.replace(/\./g, '/') + '.lua'
      }

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
