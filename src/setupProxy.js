const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/api", , "/otherApi"], { target: "https://spikeball-lfg-backend.herokuapp.com/" })
  );
};
