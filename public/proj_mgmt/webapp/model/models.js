sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function (JSONModel, Device) {
  "use strict";
  return {

    createDeviceModel : function () {
      var oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode("OneWay");
      return oModel;
    },

    createCommentsModel: function() {
      return new JSONModel({ productComments : [] });
    },
    getProjectById: function(sId){
      var aProject = this.getProjects();
      var aFiltered = aProject.filter(function(oProject){
        return oProject.semantic_object = sId;
      });
      return aFiltered.length > 0 ? aFiltered[0] : {};
    },
    getProjects: function(){
      return {
        ProjectCollection: [
          // {
          //   Path: "/home/qianmarv/ws/fin.cons.vecrule",
          //   GitRepositorySSH: "git.wdf.sap.corp:29418/fnf/F2/SH/SHF/fin.cons.vecrule.git",
          //   Title: "Validation Method",
	        //   Namespace: "fin.cons.vecrule",
          //   semantic_object: "ValidationRule",
          //   action: "maintain",
          //   LastPulledAt: new Date(),
          //   LastCommitAt: new Date(),
          //   Enabled: true
          // },
          // {
          //   Path: "/home/qianmarv/ws/proj_mgmt",
          //   GitRepositorySSH: "git.wdf.sap.corp:29418/fnf/F2/SH/SHF/fin.cons.vecrule.git",
          //   Title: "Local Project Management",
	        //   Namespace: "mycompany.myapp.MyWorklistApp",
          //   semantic_object: "Project",
          //   action: "management",
          //   LastPulledAt: new Date(),
          //   LastCommitAt: new Date(),
          //   Enabled: true
          // },
          // {
          //   Path: "/home/qianmarv/ws/dev_matching_method",
          //   GitRepositorySSH: "git.wdf.sap.corp:29418/fnf/F2/SH/SHF/fin.cons.vecrule.git",
          //   Title: "Matching Method - Development",
	        //   Namespace: "fin.ica.matching.method",
          //   semantic_object: "MatchingMethodD",
          //   action: "maintain",
          //   LastPulledAt: new Date(),
          //   LastCommitAt: new Date(),
          //   Enabled: true
          // },
          {
            Path: "/home/qianmarv/ws/stable_matching_method",
            ProjectId: "matching_method",
            GitRepositorySSH: "git.wdf.sap.corp:29418/fnf/F2/SH/SHF/fin.ica.matching.method",
            Title: "Matching Method - Stable",
	          Namespace: "fin.ica.matching.method",
            semantic_object: "MatchingMethodS",
            action: "maintain",
            LastPulledAt: new Date(),
            LastCommitAt: new Date(),
            Enabled: true
          },
          {
            Path: "/home/qianmarv/ws/zwl_icr_manual_assignment",
            ProjectId: "zwl_icr_manual_assignment",
            GitRepositorySSH: "git.wdf.sap.corp:29418/fnf/F2/SH/SHF/tmp.sap.ZWL_ICR_UI430",
            Title: "Matching Manual Assign",
	          Namespace: "tmp.sap.ZWL_ICR_UI430",
            semantic_object: "MatchingMethodA",
            action: "assign",
            LastPulledAt: new Date(),
            LastCommitAt: new Date(),
            Enabled: true
          }
        ]
      };
    }
  };

});
