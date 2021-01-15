module.exports = {
  apps : [
    {
      name: "Maksitakip Web App",
      script: "index.js",
      watch: ["."],
      ignore_watch : ["node_modules"],
      env: {
        "PORT": 3000,
        "NODE_ENV": "development",
        "MONGODB_CONN_URI":"mongodb://localhost:27017,localhost:27018,localhost:27019/maksitakip?replicaSet=rs0",
        "MONGODB_DB_NAME": "maksitakip",
        "API_ROOT_KEY": "1234567890",
        "JWT_SECRET": "1234567890"
      }
    }
  ],
};
