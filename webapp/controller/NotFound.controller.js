sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("gestioneabilitazioneeson.controller.NotFound", {
    onLinkPressed: function () {
      this.getRouter().navTo("worklist");
    },
  });
});
