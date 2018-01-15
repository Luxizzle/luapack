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

