/*global location history jQuery sap*/
sap.ui.define([
  "jquery.sap.global",
	"mycompany/myapp/MyWorklistApp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
  "mycompany/myapp/MyWorklistApp/model/models",
	"mycompany/myapp/MyWorklistApp/model/formatter",
	"sap/ui/core/format/DateFormat",
  "mycompany/myapp/MyWorklistApp/model/TileManager",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Button",
	"sap/m/Dialog",
  "sap/m/BusyDialog",
	"sap/m/Text"
], function (
	jQuery, BaseController, JSONModel, History, models, formatter, DateFormat, TileManager, Filter, FilterOperator, Button, Dialog, BusyDialog, Text) {
	"use strict";

	return BaseController.extend("mycompany.myapp.MyWorklistApp.controller.Object", {

		formatter: formatter,

    _model: undefined,

    _fioriId: undefined,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
      var oJSONModel = new JSONModel();
      this._model = oJSONModel;
			this.getView().setModel(oJSONModel);

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			// this.getOwnerComponent().getModel().metadataLoaded().then(function () {
			// 		// Restore original busy indicator delay for the object view
			// 		oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// 	}
			// );
			// Set the initial form to be the display one
		},

		/* =========================================================== */
		/* event onrs                                              */
		/* =========================================================== */
		onEditPress : function () {
			this._toggleButtonsAndView(true);
		},

    onSyncPress : function(oEvent){
      var busyDialog = new BusyDialog();
      	// {
        //   afterClose: function() {
				// 	  busyDialog.destroy();
				//   }
      // }

      busyDialog.open();

      var oSource    = oEvent.getSource(),
          sProjectId = oSource.getBindingContext().getObject().ProjectId;

      jQuery.ajax({
        type: "GET",
        url: "/api/pull/"+sProjectId,
        async: true,
        success : function(data){
          busyDialog.close();
          busyDialog.destroy();
	        var dialog = new Dialog({
				    title: 'Sync Result',
				    type: 'Message',
					  content: new Text({
						  text: data
					  }),
				    beginButton: new Button({
					    text: 'OK',
					    press: function () {
						    dialog.close();
					    }
				    }),
				    afterClose: function() {
					    dialog.destroy();
				    }
			    });

			    dialog.open();
        }
      });
    },

		onCancelPress : function () {

			//Restore the data
			// var oModel = this.getView().getModel();
			// var oData = oModel.getData();

			// oData.ProductCollection[0] = this._oProject;

			// oModel.setData(oData);
			this._toggleButtonsAndView(false);

		},

		onSavePress : function () {
      var oTile = this._model.getData(),
          that = this;
      this._setBusy(true);
      if(this._fioriId === "#"){
        TileManager.addTile(oTile).then(function(oData){
          that._setBusy(false);
          that.getRouter().navTo("object", {
            objectId: oData.fiori_id
          },true);
        });
      }else{
        TileManager.editTile(oTile)
          .then(function(){
          })
          .catch(function(oError){
            throw oError;
          })
          .finally(function(){
            that._setBusy(false);
			      that._toggleButtonsAndView(false);
          });
      }
		},

		_formFragments: {},

		_toggleButtonsAndView : function (bEdit) {
      bEdit ? this._switchToEditMode() : this._switchToDisplayMode();
		},

    _switchToEditMode: function(){
      this.byId('sync').setEnabled(false);
      this.byId('edit').setEnabled(false);
      this.byId('save').setEnabled(true);
      this.byId('cancel').setEnabled(true);
			this._showFormFragment("Edit");
    },
    _switchToDisplayMode: function(){
      this.byId('sync').setEnabled(true);
      this.byId('edit').setEnabled(true);
      this.byId('save').setEnabled(false);
      this.byId('cancel').setEnabled(false);
			this._showFormFragment("Display");
    },

		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "mycompany.myapp.MyWorklistApp.view." + sFragmentName);

			this._formFragments[sFragmentName] = oFormFragment;
			return this._formFragments[sFragmentName];
		},

		_showFormFragment : function (sFragmentName) {
			var oPage = this.byId("page");

			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));
		},

		/**
		 * Event onr  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
      this._fioriId = sObjectId;
      if(sObjectId === "#"){
        this._toggleButtonsAndView(true);
      }else{
        this._toggleButtonsAndView(false);
      }
			this._bindView(sObjectId);
		},


		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
      var oDataModel = this.getModel();

      if(sObjectPath !== '#'){
        this._setBusy(true);
        TileManager.getTileById(sObjectPath)
          .then(function(oTile){
            oDataModel.setData(oTile);
            this._setBusy(false);
          }.bind(this));
      }

			this.getView().bindElement({
				path: "/",
				events: {
					change: this._onBindingChange.bind(this)
				}
			});
		},

    _setBusy: function(bBusy){
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/busy", bBusy);
    },

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}
		}
	});
});
