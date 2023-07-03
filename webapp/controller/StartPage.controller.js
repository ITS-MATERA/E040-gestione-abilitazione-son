sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";
  const SON_SECTION = "sonSection";
  return BaseController.extend(
    "gestioneabilitazioneeson.controller.StartPage",
    {
      onInit: function () {
        var self = this;
        var oSonSectionModelJson = new sap.ui.model.json.JSONModel({
          headerVisible:false
        });

        self.getView().setModel(oSonSectionModelJson,SON_SECTION); 
      },
      onNavBack: function () {
        // eslint-disable-next-line sap-no-history-manipulation
        history.go(-1);
      },
      onAuth: function () {
        var self = this;
        self.getRouter().navTo("listAuth");
      },
      onSON: function () {
        var self = this;
        self.getRouter().navTo("listSON");
      },
    }
  );
});
