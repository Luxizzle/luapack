local proxy_package = {
  loaded = {},
  packages = {}
}
local _require = require

function require(h)
  if (proxy_package.loaded[h]) then
    return proxy_package.loaded[h]
  elseif (proxy_package.packages[h]) then
    proxy_package.loaded[h] = proxy_package.packages[h]()
    return proxy_package.loaded[h]
  else
    return _require(h)
  end
end

proxy_package.packages['463841e40c49d6106ee19cbe3db6ad66'] = function()
print('Hello world!')

require('23da1b45a9c2eed6a4c8c4c62db4bfe2')
require('23da1b45a9c2eed6a4c8c4c62db4bfe2')

require('69bdfcba7dbe708f7f8e7271087002f9')
end;

proxy_package.packages['23da1b45a9c2eed6a4c8c4c62db4bfe2'] = function()
print('hey there from module')

return 'hey there'
end;

proxy_package.packages['69bdfcba7dbe708f7f8e7271087002f9'] = function()
print('from subdirectories!')

return true
end;

require('463841e40c49d6106ee19cbe3db6ad66')
