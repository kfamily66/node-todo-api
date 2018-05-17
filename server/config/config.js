var env = process.env.NODE_ENV || "development";

if (env === "test" || env === "development") {
  var config = require("./config.json");
  var configEnv = config[env];
  Object.keys(configEnv).forEach(key => {
    process.env[key] = configEnv[key];
  });
}
