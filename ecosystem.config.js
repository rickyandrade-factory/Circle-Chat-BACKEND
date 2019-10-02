module.exports = {
    apps : [{
      name: "ricky-factory-api",
      script: "./bin/www",
      env: {
        NODE_ENV: "development",
        PORT: 3007
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }]
  }