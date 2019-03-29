const dbServ   = require('../services/DBService');
const appServ  = require('../services/AppService');
const ProcServ = require('../services/ProcessService.js');

async function _persist(){
  var tiles = await dbServ.getTiles();
  var apps  = await appServ.getApps(tiles);
  await appServ.persist(apps);
}

async function listTiles(ctx, next) {
  ctx.body = await dbServ.getTiles();
  await next();
}

async function createTile(ctx, next) {
  // console.log(`tileController=>addTile: ${ctx.request.body}`);
  var oTile = ctx.request.body;

  var sRootDir   = await dbServ.getRootDir();
  var sTargetDir = oTile.app_path;
  var sSSHURL = oTile.GitRepositorySSH;
  if(sSSHURL){
    if(!sTargetDir){
      var iIndex = sSSHURL.lastIndexOf("/");
      oTile.app_path = sSSHURL.substr(iIndex+1, sSSHURL.length-iIndex-5);
    }

    await ProcServ.gitClone(sRootDir, sSSHURL, sTargetDir);
    oTile.last_sync_on = Date.now();
  }
  oTile = await dbServ.createTile(oTile);

  await _persist();
  ctx.body = oTile;
  ctx.status = 201;
  await next();
}

async function updateTile(ctx, next){
  console.log(`tileController=>updateTile: ${ctx.params.id}`);

  var sId = ctx.params.id;
  var oTile = await dbServ.updateTile(sId, ctx.request.body);

  await _persist();

  ctx.status = 203;
  await next();

}

async function deleteTile(ctx, next){
  console.log(`tileController=>deleteTile: ${ctx.params.id}`);
  await dbServ.deleteTile(ctx.params.id);

  await _persist();

  ctx.status = 204;
  await next();
}
module.exports = {listTiles, createTile, updateTile, deleteTile};
