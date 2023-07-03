sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageBox",
  ],
  function (BaseController, JSONModel, formatter) {
    "use strict";

    const ADD_AUTH_MODEL = "addAuhModel";
    const ZufficioCont_SET = "UfficioContMcSet";
    const Ztipodisp3_SET = "TipoDispSet";
    const OPTION_ADD = "INS";
    const URL_DEEP = "DeepAbilitazioneSet";
    return BaseController.extend(
      "gestioneabilitazioneeson.controller.AddAuth",
      {
        formatter: formatter,

        onInit: function () {
          var oAddAuthModel;
          oAddAuthModel = new JSONModel({
            Gjahr: null,
            ZufficioCont: null,
            ZvimDescrufficio: null,
            Fipos: null,
            Fistl: null,
            Ztipodisp3: null,
            Ztipodisp3List: null,
            Datab: null,
            Datbi: null,
          });
          this.setModel(oAddAuthModel, ADD_AUTH_MODEL);
        },

        resetModelPage: function () {
          var self = this,
            addAuthModel = self.getModel(ADD_AUTH_MODEL);
          var oAddAuthModel = new JSONModel({
            Gjahr: null,
            ZufficioCont: null,
            ZvimDescrufficio: null,
            Fipos: null,
            Fistl: null,
            Ztipodisp3: null,
            Ztipodisp3List: null,
            Datab: null,
            Datbi: null,
          });
          self.setModel(oAddAuthModel, ADD_AUTH_MODEL);

          var cbZtipodisp3 = self.getView().byId("idInputZtipodisp3");
          cbZtipodisp3.setSelectedKey(null);
          cbZtipodisp3.setValue(null);

          var dpDatab = self.getView().byId("idInputDatab");
          dpDatab.setValue(null);
          var dpDatbi = self.getView().byId("idInputDatbi");
          dpDatbi.setValue(null);
        },

        _getIdElement: function (oEvent) {
          var longId = oEvent.getSource().getId();
          var arrayId = longId.split("-");
          var id = arrayId[arrayId.length - 1];
          return id;
        },

        _setMessage: function (sTitle, sText, sType) {
          var self = this;
          var oBundle = self.getResourceBundle();
          var obj = {
            title: oBundle.getText(sTitle),
            onClose: function (oAction) {},
          };
          if (sType === "error")
            sap.m.MessageBox.error(oBundle.getText(sText), obj);
          else if (sType === "success")
            sap.m.MessageBox.success(oBundle.getText(sText), obj);
          else if (sType === "warning")
            sap.m.MessageBox.warning(oBundle.getText(sText), obj);
        },

        onSubmitGjahr: function (oEvent) {
          var self = this;
          self.fillZvimDescrufficio();
        },

        onSubmitZufficioCont: function (oEvent) {
          var self = this;
          self.fillZvimDescrufficio();
          self.fillZtipodisp3List();
        },

        onLiveChange: function (oEvent) {
          var self = this,
            sNewValue,
            addAuthModel = self.getModel(ADD_AUTH_MODEL);

          var sInputId = self._getIdElement(oEvent);
          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");

          if (sProperty !== "Ztipodisp3") {
            sNewValue = oEvent.getParameter("value");
          } else {
            sNewValue = oInput.getSelectedKey();
          }
          console.log(sNewValue);

          addAuthModel.setProperty("/" + sProperty, sNewValue);
        },
        onLiveChangeZtipodisp3List: function (oEvent) {
          var self = this,
            addAuthModel = self.getModel(ADD_AUTH_MODEL);
          var sNewValue = oEvent.getSource().getSelectedKey();
          var sNewDesc = oEvent.getSource().getValue();
          addAuthModel.setProperty("/Ztipodisp3", sNewValue);
          addAuthModel.setProperty("/Zdesctipodisp3", sNewDesc);
        },

        handleChangeDatePicker: function (oEvent) {
          var self = this,
            addAuthModel = self.getModel(ADD_AUTH_MODEL);
          var bValid = oEvent.getParameter("valid");

          if (!bValid) {
            oEvent.getSource().setValue("");
            return;
          }
          var sInputId = self._getIdElement(oEvent);
          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");
          var sNewValue = oEvent.getParameter("newValue");
          oEvent.getSource().setValue(sNewValue);

          addAuthModel.setProperty("/" + sProperty, sNewValue);
        },

        fillZvimDescrufficio: function () {
          var self = this,
            oDataModel = self.getModel(),
            oView = self.getView(),
            addAuthModel = self.getModel(ADD_AUTH_MODEL),
            ZufficioCont = addAuthModel.getProperty("/ZufficioCont"),
            Gjahr = addAuthModel.getProperty("/Gjahr");

          if (Gjahr !== null && ZufficioCont !== null) {
            var path = self.getModel().createKey(ZufficioCont_SET, {
              ZufficioCont: ZufficioCont,
              Gjahr: Gjahr,
            });

            oView.setBusy(true);
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    addAuthModel.setProperty(
                      "/ZvimDescrufficio",
                      data.ZvimDescrufficio
                    );
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          }
        },

        fillZtipodisp3List: function () {
          var self = this,
            addAuthModel = self.getModel(ADD_AUTH_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            ZufficioCont = addAuthModel.getProperty("/ZufficioCont");

          if (ZufficioCont !== null) {
            oView.setBusy(true);
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + Ztipodisp3_SET, {
                  urlParameters: { ZufficioCont: ZufficioCont },
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    console.log("List tipo ", data.results);
                    addAuthModel.setProperty("/Ztipodisp3List", data.results);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        onNavBack: function () {
          // eslint-disable-next-line sap-no-history-manipulation
          history.go(-1);
        },

        _stringtoTimestamp: function (dateString, formatDelimiter) {
          var dateTimeParts = dateString.split(formatDelimiter);
          console.log(dateTimeParts);
          var date = new Date(
            dateTimeParts[2],
            parseInt(dateTimeParts[1], 10) - 1,
            dateTimeParts[0]
          );
          return date;
        },
        onSave: function () {
          var self = this,
            oDataModel = self.getModel(),
            oView = self.getView(),
            addAuthModel = self.getModel(ADD_AUTH_MODEL),
            ZufficioCont = addAuthModel.getProperty("/ZufficioCont"),
            Gjahr = addAuthModel.getProperty("/Gjahr"),
            Fipos = addAuthModel.getProperty("/Fipos"),
            Fistl = addAuthModel.getProperty("/Fistl"),
            Ztipodisp3 = addAuthModel.getProperty("/Ztipodisp3"),
            Datab = addAuthModel.getProperty("/Datab"),
            Datbi = addAuthModel.getProperty("/Datbi");

          if (
            ZufficioCont === null ||
            Gjahr === null ||
            Fipos === null ||
            Fistl === null ||
            Ztipodisp3 === null ||
            Datab === null ||
            Datbi === null
          ) {
            self._setMessage("titleDialogError", "msgNoRequiredField", "error");
            return null;
          }

          var DatabTs = self._stringtoTimestamp(Datab, "-");
          var DatbiTs = self._stringtoTimestamp(Datbi, "-");

          var entity = [
            {
              Gjahr: "" + Gjahr + "",
              ZufficioCont: "" + ZufficioCont + "",
              Fipos: "" + Fipos + "",
              Fistl: "" + Fistl + "",
              Ztipodisp3: "" + Ztipodisp3 + "",
              Datab: DatabTs,
              Datbi: DatbiTs,
              Zchiaveabi: "" + "AA",
              ZstepAbi: "" + 1 + "",
              Bukrs: "" + "ssa",
            },
          ];

          var entityRequestBody = {
            Bukrs: "" + "",
            Gjahr: "" + "",
            Zchiaveabi: "" + "AA",
            OperationType: OPTION_ADD,
            AbilitazioneSet: entity,
            AbilitazioneMessageSet: [],
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            success: function (result) {
              self.getView().setBusy(false);

              var arrayMessage = result.AbilitazioneMessageSet.results;
              var arrayError = arrayMessage.filter((el) => el.Msgty === "E");
              console.log(result);
              if (arrayError.length > 0) {
                self._setMessage("titleDialogError", "msgError", "error");
                return false;
              }
              self.resetModelPage();
              self.getRouter().navTo("listAuth");

              console.log(result.AbilitazioneMessageSet.results);
            },
            error: function (err) {
              self.getView().setBusy(false);

              console.log(err);
            },
            async: true,
            urlParameters: {},
          });
        },
      }
    );
  }
);
