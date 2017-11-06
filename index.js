var expressExtensionNew = require('express-integrator-extension');
var flows = require('./createFlow');
var systemToken = '4852ed549d4e4a61ab918a91076e4286';
var options = {
  connectors: {
    '59faef50a344a836d92814a5': flows
  },
  systemToken: systemToken,
  port: 5001
};

expressExtensionNew.createServer(options, function(err) {});
