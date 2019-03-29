/*global sap $*/
sap.ui.define([],function(){
  "use strict";
  var _tiles = [];
  var _invalidate = true;
  return {
    getTiles: function(){
      return new Promise(function(resolve, reject){
        if( _invalidate || _tiles.length === 0 ){
          $.ajax({
            type: "GET",
            url: "/api/tiles",
            async: true
          })
            .done(function(oData){
              _tiles = oData;
              _invalidate = false;
              resolve(oData);

            })
            .fail(function(oError){
              reject(oError);
            });
        }else{
          resolve(_tiles);
        }
      });
    },
    getTileByIndex: function(iIndex){
      return new Promise(function(resolve, reject){
        this.getTiles()
          .then(function(aTiles){
            resolve(aTiles[iIndex]);
          })
          .catch(reject);
      }.bind(this));
    },

    getTileById: function(sFioriId){
      return new Promise(function(resolve, reject){
        this.getTiles()
          .then(function(aTiles){
            resolve(aTiles.find(function(each){
              return each.fiori_id === sFioriId;
            }));
          })
          .catch(reject);
      }.bind(this));
    },
    editTile: function(oTile){
      return new Promise(function(resolve,reject){
        $.ajax({
          type: "POST",
          url: "/api/tile/"+oTile.fiori_id,
          data: oTile,
          async: true
        })
          .done(function(oData){
            _invalidate = true;
            resolve(oData);
          })
          .fail(reject)
        ;
      });
    },
    addTile: function(oTile){
      return new Promise(function(resolve,reject){
        $.ajax({
          type: "PUT",
          url: "/api/tile",
          contentType: 'application/json',
          data: JSON.stringify(oTile),
          async: true
        })
          .done(function(oData){
            _invalidate = true;
            resolve(oData);
          })
          .fail(reject)
        ;
      });
    },

    // addTile: function(oTile){
    
    //   _invalidate = true;
    // },
    // editTile: function(oTile){
    
    //   _invalidate = true;
    // },
    deleteTile: function(sId){
      return new Promise(function(resolve,reject){
        $
          .ajax({
            type: "delete",
            url: `/api/tile/${sId}`,
            async: true
          })
          .done(function(){
            _invalidate = true;
            resolve();
          })
          .fail(reject)
        ;
      });
    },
    syncTile: function(sId){
      return new Promise(function(resolve,reject){
        $
          .ajax({
            type: "get",
            url: `/api/app/sync/${sId}`,
            async: true
          })
          .done(function(oData){
            _invalidate = true;
            resolve(oData);
          })
          .fail(reject)
        ;
      });

    }
  };
});
