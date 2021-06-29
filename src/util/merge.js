export default function mergeDefaults(config, defaults) {
  if (config === null || config === undefined) return defaults;
  for (var attrname in defaults) {
    if (defaults[attrname].constructor === Object) config[attrname] = mergeDefaults(config[attrname], defaults[attrname]);
    else if (config[attrname] === undefined) config[attrname] = defaults[attrname];
  }
  return config;
}