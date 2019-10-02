module.exports = {
    apps : [{
      name: "ricky-factory-api",
      script: "./bin/www",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }