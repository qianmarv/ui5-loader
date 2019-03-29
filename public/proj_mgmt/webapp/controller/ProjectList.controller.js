/*global sap*/
sap.ui.define([
	"mycompany/myapp/MyWorklistApp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
  "mycompany/myapp/MyWorklistApp/model/models",
	"mycompany/myapp/MyWorklistApp/model/formatter",
  "mycompany/myapp/MyWorklistApp/model/TileManager",
	"sap/m/MessageToast"
], function(Controller, JSONModel, models, formatter,TileManager, MessageToast) {
	"use strict";

	return Controller.extend("mycompany.myapp.MyWorklistApp.controller.ProjectList", {
    formatter: formatter,
    _model: undefined,

		onInit : function () {
      var oJSONModel = new JSONModel();
      this._model = oJSONModel;
			this.getView().setModel(oJSONModel);
			this.getRouter().getRoute("projectlist").attachPatternMatched(this._onPatternMatched, this);
		},
    _onPatternMatched : function(){
      this.fillTable();
    },

		fillTable: function() {
      var oTable = this.byId("table");
      oTable.setBusy(true);
      TileManager.getTiles()
        .then(function(oData){
          this._model.setData(oData);
          this._model.refresh();
          oTable.setBusy(false);
        }.bind(this))
        .catch(function(oError){
          throw oError;
        })
        .finally(function(){
          oTable.setBusy(false);
        });
		},

    onRefresh: function(oEvent){
      this.fillTable();
    },

    onDelete: function(oEvent){
      var oTable = this.byId("table"),
          aIndex = oTable.getSelectedIndices(),
          that   = this;
      oTable.setBusy(true);
      TileManager.getTiles()
        .then(function(aTile){
          var aPromise = aIndex.map(function(each){
              var iIndex = each,
                  sId    = aTile[iIndex].fiori_id;
            return TileManager.deleteTile(sId);
          });
          Promise.all(aPromise)
            .then(function(){
              that.onRefresh();
            })
            .catch(function(oError){
              throw oError;
            })
            .finally(function(){
              oTable.setBusy(false);
            });
        });
    },

    onSync: function(oEvent){
      var oTable = this.byId("table"),
          oItem = oEvent.getParameter("item"),
          oTile = oItem.getBindingContext().getObject();
      oTable.setBusy(true);
      TileManager.syncTile(oTile.fiori_id)
        .then(function(oData){
          this.onRefresh();
          MessageToast.show("Sync Finished!");
        }.bind(this))
        .catch(function(oError){
          MessageToast.show("Sync Failed!");
          throw oError;
        })
        .finally(function(){
          oTable.setBusy(false);
        });
    },

    onAddTile: function(oEvent){
      this.getRouter().navTo("object", {
        objectId: "#"
      });
    },

		onNav: function(oEvent) {
      var oSource = oEvent.getSource(),
          oTile   = oSource.getBindingContext().getObject(),
          sFioriId  = oTile.fiori_id;

      // objectId: oEvent.getParameter("row").getIndex()
      this.getRouter().navTo("object", {
        objectId: sFioriId
      });
		}
	});

});
