sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";
  const SON_SECTION = "sonSection";
  return BaseController.extend(
    "gestioneabilitazioneeson.controller.StartPage",
    {
      onNavBack: function () {
        history.go(-1);
      },
      onAuth: function () {
        var self = this;

        self.getAuthorityCheck(self.FILTER_AUTH_OBJ, function (callback) {
          if (callback) {
            self.getRouter().navTo("listAuth");
          }
        });
      },
      onSON: function () {
        var self = this;

        self.getAuthorityCheck(self.FILTER_SON_OBJ, function (callbackSON) {
          if (callbackSON) {
            self.getRouter().navTo("listSON");
          }
        });
      },
    }
  );
});
