module.exports = {
  apps : [
    {
      name: "Maksitakip Web App",
      script: "index.js",
      watch: true,
      env: {
        "PORT": 3000,
        "NODE_ENV": "development",
      }
    }
  ],
};
