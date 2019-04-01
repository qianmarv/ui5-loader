"use strict";

const fs = require('fs');
const path = require('path');
const dbServ   = require('./DBService.js');

module.exports = {
  getApps: function(aTile){
    return new Promise(function(resolve, reject){
      var apps = aTile.filter(function(each){
        return each.enabled && each.app_path && each.semantic_object && each.action;
      });

      var appConfig = apps.reduce(function(config, each){
        var sHash = `${each.semantic_object}-${each.action}`;
        config[sHash] = {
          additionalInformation: `SAPUI5.Component=${each.namespace}`,
          applicationType: "URL",
          url:`/${each.app_path}/webapp`,
          title: each.title
        };
        return config;
      },{});

      resolve({
        "applications": appConfig
      });
    });
  },
  persist: async function(oData){
    // return new Promise(function(resolve, reject){
    let sDir  = await dbServ.getRootDir();
    let sFile = path.join(sDir, "appconfig/fioriSandboxConfig");

    // var file = '/var/www/static/appconfig/fioriSandboxConfig.json';
    fs.writeFileSync(sFile, JSON.stringify(oData));
    return;
    // });
  }
};
