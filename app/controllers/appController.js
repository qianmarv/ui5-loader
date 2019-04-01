const dbServ   = require('../services/DBService.js');
const appServ  = require('../services/AppService.js');
const ProcServ = require('../services/ProcessService.js');

const path = require('path');

async function _getApps(){
  var tiles = await dbServ.getTiles();
  return await appServ.getApps(tiles);
}

async function listApps(ctx, next) {
  ctx.body = await _getApps();
  await next();
}

async function generateApps(ctx, next) {
  let config = await _getApps();
  let sDir  = await dbServ.getRootDir();
  let sFile = path.join(sDir, "appconfig/fioriSandboxConfig");
  await appServ.persist(config, sFile);
  ctx.body = {};
  ctx.status = 201;
  await next();
}

async function syncApp(ctx, next){
  // console.log(`appController=>SyncApp: id=${ctx.params.id}`);
  var sFioriId = ctx.params.id;
  // var oConfig  = await dbServ.getConfiguration();
  // console.log(`appController=>SyncApp: app_path=${oConfig.rootDir}`);
  var oTile = await dbServ.getTile(sFioriId);
  var sDir  = await dbServ.getRootDir();
  var sPath = path.join(sDir, oTile.app_path);

  ctx.body = await ProcServ.gitPull(sPath);

  oTile.last_sync_on = Date.now();
  await dbServ.updateTile(oTile);

  // var config = await _getApps();
  // await appServ.persist(config);

  ctx.status = 201;
  await next();
}

module.exports = {listApps, generateApps, syncApp};
