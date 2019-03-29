"use strict";

const path = require('path');

const dbPath = '../../db/flpconfig.json';
const db = require(dbPath);
const fs = require('fs');

function fnPadLeft(str,lenght){
  if(str.length >= lenght)
    return str;
  else
    return fnPadLeft("0" +str,lenght);
};
function fnSaveTiles(tiles){
  db.application.tiles = tiles;
  fs.writeFileSync(path.join(__dirname, dbPath), JSON.stringify(db));
};
module.exports = {
  getRootDir: function(){
    return new Promise(function(resolve, reject){
      resolve(db.application.configuration.root_dir);
    });
  },
  getTiles: function(){
    return new Promise(function(resolve, reject){
      resolve(db.application.tiles);
    });
  },
  getTile: function(sId){
    return new Promise(function(resolve, reject){
      var oTile = db.application.tiles.find(function(each){
        return each.fiori_id === sId;
      });
      resolve(oTile);
    });
  },
  updateTile: function(sId, oTile){
    var that = this;
    return new Promise(function(resolve, reject){
      var aTile = db.application.tiles;
      that.getTile(sId).then(function(oOldTile){
        for(var prop in oTile){
          oOldTile[prop] = oTile[prop];
        }
        fnSaveTiles(aTile);
        resolve();
      });
      // for(var i = 0; i < aTile.length; i++){
      //   if(aTile[i].fiori_id === oTile.fiori_id){
      //     aTile[i] = oTile;
      //     break;
      //   }
      // }
    });
  },
  deleteTile: function(sId){
    var that = this;
    return new Promise(function(resolve, reject){
      that.getTiles()
        .then(function(aTile){
          for(var i = 0; i < aTile.length; i++){
            if(aTile[i].fiori_id === sId){
              aTile.splice(i,1);
              fnSaveTiles(aTile);
              break;
            }
          }
          resolve();
        })
        .catch(reject);
    });
  },
  createTile: function(oTile){
    return new Promise(function(resolve ,reject){
      this.getTiles().then(function(aTile){
        if(oTile.fiori_id){
        }else{
          var aTilesC = aTile.filter(function(each){
            return each.fiori_id.substr(0,1) === "X";
          });
          aTilesC.sort();
          var iMaxNum = parseInt(aTilesC[aTilesC.length-1].fiori_id.substr(1,3));
          oTile.fiori_id = `X${fnPadLeft(iMaxNum + 1,3)}`;
          aTile.push(oTile);
          fnSaveTiles(aTile);
          resolve(oTile);
        }
      },reject);
    }.bind(this));
  }
};
