sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageItem",
    "sap/m/MessageView",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Bar",
    "sap/m/Input",
    "sap/ui/core/library",
    "sap/m/MessageBox",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    library,
    Spreadsheet,
    MessageItem,
    MessageView,
    Button,
    Dialog,
    Bar,
    Input,
    coreLibrary
  ) {
    "use strict";

    const ADD_AUTH_MODEL = "addAuhModel";
    const ZufficioCont_SET = "UfficioContMcSet";
    const Ztipodisp3_SET = "TipoDispSet";
    const OPTION_ADD = "INS";
    const URL_DEEP = "DeepAbilitazioneSet";
    const URL_VALIDATION = "ValidazioneAbilitazione";
    const FistlMc_SET = "TvarvcParameterSet";
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";

    const EDM_TYPE = library.EdmType;
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

          this.configLog();

          this.getRouter()
            .getRoute("addAuth")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function () {
          var self = this,
              authModel = self.getModelGlobal(self.AUTHORITY_CHECK_ABILITAZIONE);
           
          if(!authModel || authModel === null){
            self.getAuthorityCheck(self.FILTER_AUTH_OBJ, function(callback){
              if(callback){
                self.getFistl();
              }
              else{
                self.getRouter().navTo("notAuth", {mex: self.getResourceBundle().getText("notAuthText")});
              }
            });
          }   
        },
        
        getFistl:function(){
          var self= this,
                oDataModel = self.getModel();

            var path = self.getModel().createKey(FistlMc_SET, {
                Name: "COSPR3FIORIE040_FISTL",
            });

            self.getModel().metadataLoaded().then(function () {
                oDataModel.read("/" + path, {
                    success: function (data, oResponse) {  
                        if(data && data.Value !== null && data.Value !== ""){
                          self.getView().getModel("addAuhModel").setProperty("/Fistl",data.Value);
                        }
                        else
                          self.getView().getModel("addAuhModel").setProperty("/Fistl","");
                      },
                    error: function (error) {
                        console.log(error);
                    },
                });
            });
        },

        configLog: function () {
          var self = this;
          var oMessageTemplate = new MessageItem({
            type: "{logModel>type}",
            title: "{logModel>title}",
            description: "{logModel>description}",
            subtitle: "{logModel>subtitle}",
            counter: "{logModel>counter}",
          });

          var aMockMessages = [];

          var oModel = new JSONModel();

          oModel.setData(aMockMessages);

          self.oMessageView = new MessageView({
            showDetailsPageHeader: false,
            items: {
              path: "logModel>/",
              template: oMessageTemplate,
            },
          });

          var oExportButton = new Button({
            text: self.getResourceBundle().getText("btnExport"),
            type: "Emphasized",
            visible: true,
            press: function () {
              self.configExportMessage();
            },
          });

          var oInputFilter = new Input({
            placeholder: self.getResourceBundle().getText("msgSearch"),
            visible: true,
            liveChange: function (oEvent) {
              self.filterMessage(oEvent);
            },
          });

          self.oMessageView.setModel(oModel, "logModel");
          self.setModel(oModel, LOG_MODEL);
          self.setModel(oModel, MESSAGE_MODEL);

          self.oLogDialog = new Dialog({
            resizable: true,
            content: self.oMessageView,
            state: "Error",
            beginButton: new Button({
              press: function () {
                self.oLogDialog.close();
              },
              text: self.getResourceBundle().getText("btnClose"),
            }),
            customHeader: new Bar({
              contentMiddle: [oInputFilter],
              contentRight: [oExportButton],
            }),
            contentHeight: "50%",
            contentWidth: "50%",
            verticalScrolling: false,
          });
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

          addAuthModel.setProperty("/" + sProperty, sNewValue);
        },
        onLiveChangeZtipodisp3List: function (oEvent) {
          var self = this,
            addAuthModel = self.getModel(ADD_AUTH_MODEL);
          var sNewValue = oEvent.getSource().getSelectedKey();
          var sNewDesc = oEvent.getSource().getValue();
          addAuthModel.setProperty("/Ztipodisp3", sNewValue ? sNewValue : "");
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

          sNewValue = formatter.formatStringForDate(sNewValue);

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
          var self = this;
          self.resetLog();
          self.resetModelPage();
          self.getRouter().navTo("listAuth");
        },

        resetLog: function () {
          var self = this;
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData([]);
          self.setModel(oModelJson, LOG_MODEL);
          self.setModel(oModelJson, MESSAGE_MODEL);
        },

        onSave: function () {
          var self = this,
            oDataModel = self.getModel(),
            oView = self.getView(),
            addAuthModel = self.getModel(ADD_AUTH_MODEL),
            oControlFilterBarPosFinSpesa = self.getView().byId("filterBarPosFinSpesa"),
            oControlIdFilterStruttAmmResp = self.getView().byId("idFilterStruttAmmResp"),
                        
            Gjahr = addAuthModel.getProperty("/Gjahr"),
            Fipos = oControlFilterBarPosFinSpesa.getValue() && oControlFilterBarPosFinSpesa.getValue() !== "" ? oControlFilterBarPosFinSpesa.getValue() : "",
            Fistl = oControlIdFilterStruttAmmResp.getValue() && oControlIdFilterStruttAmmResp.getValue() !== "" ? oControlIdFilterStruttAmmResp.getValue() : "",
            // Fipos = addAuthModel.getProperty("/Fipos"),
            // Fistl = addAuthModel.getProperty("/Fistl"),
            Fikrs = self.getModelGlobal(self.AUTHORITY_CHECK_ABILITAZIONE).getData().FIKRS,
            AgrName = self.getModelGlobal(self.AUTHORITY_CHECK_ABILITAZIONE).getData().AGR_NAME,
            Prctr = self.getModelGlobal(self.AUTHORITY_CHECK_ABILITAZIONE).getData().PRCTR;

          if (Fipos !== null && Fistl !== null) {
            var oParam = {
              // Fipex: !Fipos || Fipos === null ? "" : Fipos,
              Fipos: !Fipos || Fipos === null ? "" : Fipos,
              Fistl: !Fistl || Fistl === null ? "" : Fistl,
              Gjahr: !Gjahr || Gjahr === null ? "" : Gjahr,
              Prctr: !Prctr || Prctr === null ? "" : Prctr,
              AgrName: !AgrName || AgrName === null ? "" : AgrName,
              Fikrs: !Fikrs || Fikrs === null ? "" : Fikrs,
            };
            self.getView().setBusy(true);
            oDataModel.callFunction("/" + URL_VALIDATION, {
              method: "GET",
              urlParameters: oParam,
              success: function (oData, response) {
                self.getView().setBusy(false);
                var arrayMessage = oData.results;
                var isSuccess = self.isErrorInLog(arrayMessage);
                if (isSuccess) {
                  self._insertMethod();
                }
              },
              error: function (oError) {
                self.getView().setBusy(false);
              },
            });
          } else {
            self._setMessage("titleDialogError", "msgNoRequiredField", "error");
            return false;
          }
        },
        handleDialogPress: function (oEvent) {
          var self = this;
          self.oMessageView.navigateBack();
          self.oLogDialog.open();
        },

        _insertMethod: function () {
          var self = this,
            oDataModel = self.getModel(),
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

          var DatabTs = formatter.formateDateForDeep(Datab);
          var DatbiTs = formatter.formateDateForDeep(Datbi);

          var entity = [
            {
              Gjahr: !Gjahr || Gjahr === null ? "" : Gjahr,
              ZufficioCont:
                !ZufficioCont || ZufficioCont === null ? "" : ZufficioCont,
              Fipos: !Fipos || Fipos === null ? "" : Fipos,
              Fistl: !Fistl || Fistl === null ? "" : Fistl,
              Ztipodisp3: !Ztipodisp3 || Ztipodisp3 === null ? "" : Ztipodisp3,
              Datab: !DatabTs || DatabTs === null ? "" : DatabTs,
              Datbi: !DatbiTs || DatbiTs === null ? "" : DatbiTs,
              Zchiaveabi: "Zchiaveabi",
              ZstepAbi: "1",
              Bukrs: "S001",
            },
          ];

          var entityRequestBody = {
            Bukrs: "",
            Gjahr: "",
            Zchiaveabi: "Zchiaveabi",
            OperationType: OPTION_ADD,
            AbilitazioneSet: entity,
            AbilitazioneMessageSet: [],
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            success: function (result) {
              self.getView().setBusy(false);

              var arrayMessage = result.AbilitazioneMessageSet.results;

              var isSuccess = self.isErrorInLog(arrayMessage);
              if (isSuccess) {
                self.setPropertyGlobal(self.RELOAD_MODEL, "canRefresh", true);
                self.onNavBack();
              }
            },
            error: function (err) {
              self.getView().setBusy(false);
            },
            async: true,
            urlParameters: {},
          });
        },
      }
    );
  }
);
