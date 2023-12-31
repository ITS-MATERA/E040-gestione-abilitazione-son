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
    coreLibrary,
    MessageBox
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
        _tipoDispDialog:null,

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
          self._tipoDispDialog = null;

          if (!authModel || authModel === null) {
            self.getAuthorityCheck(self.FILTER_AUTH_OBJ, function (callback) {
              if (callback) {
                self.getFistl();
              } else {
                self.getRouter().navTo("notAuth", {
                  mex: self.getResourceBundle().getText("notAuthText"),
                });
                return;
              }
            });
          }
          else
            self.getFistl();

          var inputDatabControl = self.getView().byId("idInputDatab"); 
          inputDatabControl.setDateValue(new Date());
          self.getModel(ADD_AUTH_MODEL).setProperty("/Datab",formatter.formatStringForDate(inputDatabControl.getValue()));
          self.getTipoDisposizioneModel();
        },

        getTipoDisposizioneModel: function () {
          var self = this;
          var addAuthModel = self.getModel(ADD_AUTH_MODEL);
          var oDataModel = self.getModel();
          var oView = self.getView();

          oView.setBusy(true);

          oDataModel.read("/" + Ztipodisp3_SET, {
            success: function (data, oResponse) {
              oView.setBusy(false);
              data.results.splice(0, 1);
              addAuthModel.setProperty("/Ztipodisp3List", data.results);
            },
            error: function (error) {
              oView.setBusy(false);
            },
          });
        },

        getFistl: function () {
          var self = this,
            oDataModel = self.getModel();

          var path = self.getModel().createKey(FistlMc_SET, {
            Name: "COSPR3FIORIE040_FISTL",
          });

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                success: function (data, oResponse) {
                  if (data && data.Value !== null && data.Value !== "") {
                    self
                      .getView()
                      .getModel("addAuhModel")
                      .setProperty("/Fistl", data.Value);
                  } else
                    self
                      .getView()
                      .getModel("addAuhModel")
                      .setProperty("/Fistl", "");
                },
                error: function (error) {},
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

          var control = self.getView().byId("idInputZtipodisp3");
          control.setTokens([]);
          // cbZtipodisp3.setSelectedKey(null);
          // cbZtipodisp3.setValue(null);

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
          var self = this,
            addAuthModel = self.getModel(ADD_AUTH_MODEL),
            controlIdInputDatbi = self.getView().byId("idInputDatbi");
          self.fillZvimDescrufficio();

          var sNewValue = oEvent.getParameter("value");
          if(sNewValue.length === 4){
            var date =  new Date(sNewValue+"/12/31");
            controlIdInputDatbi.setDateValue(date);
            addAuthModel.setProperty("/" + controlIdInputDatbi.data("property"), date);
          }
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

        onLiveChangeGjahr:function(oEvent){
          var self =this,
            sNewValue = oEvent.getParameter("value"),
            controlIdInputDatbi = self.getView().byId("idInputDatbi"),
            addAuthModel = self.getModel(ADD_AUTH_MODEL);

          var sProperty = oEvent.getSource().data("property");  
          addAuthModel.setProperty("/" + sProperty, sNewValue);

          if(sNewValue.length === 4){
            var date =  new Date(sNewValue+"/12/31");
            controlIdInputDatbi.setDateValue(date);
            addAuthModel.setProperty("/" + controlIdInputDatbi.data("property"), date);
          }
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

          if (Gjahr !== null && ZufficioCont) {
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
          } else {
            addAuthModel.setProperty("/ZvimDescrufficio", null)
          }
        },

        fillZtipodisp3List: function () {
          var self = this,
            oBundle = self.getResourceBundle(),
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
                    var message =
                      oResponse.headers["sap-message"] &&
                      oResponse.headers["sap-message"] !== ""
                        ? JSON.parse(oResponse.headers["sap-message"])
                        : null;
                    if (message && message.severity === "error") {
                      sap.m.MessageBox.warning(message.message, {
                        title: oBundle.getText("titleDialogWarning"),
                        onClose: function (oAction) {
                          return false;
                        },
                      });
                      return false;
                    }
                    data.results.splice(0, 1);
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
            Fipos =
              oControlFilterBarPosFinSpesa.getValue() &&
              oControlFilterBarPosFinSpesa.getValue() !== ""
                ? oControlFilterBarPosFinSpesa.getValue()
                : "",
            Fistl =
              oControlIdFilterStruttAmmResp.getValue() &&
              oControlIdFilterStruttAmmResp.getValue() !== ""
                ? oControlIdFilterStruttAmmResp.getValue()
                : "",
            Fikrs = self
              .getModelGlobal(self.AUTHORITY_CHECK_ABILITAZIONE)
              .getData().FIKRS,
            AgrName = self
              .getModelGlobal(self.AUTHORITY_CHECK_ABILITAZIONE)
              .getData().AGR_NAME,
            Prctr = self
              .getModelGlobal(self.AUTHORITY_CHECK_ABILITAZIONE)
              .getData().PRCTR;

          




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

            MessageBox.warning("Si vuole procedere con la registrazione dell’Abilitazione?", {
              title: "Registrazione abilitazione",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              emphasizedAction: MessageBox.Action.YES,
              onClose: function (oAction) {
                  if (oAction === sap.m.MessageBox.Action.YES) {
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

                  }
                }
              });

            // self.getView().setBusy(true);
            // oDataModel.callFunction("/" + URL_VALIDATION, {
            //   method: "GET",
            //   urlParameters: oParam,
            //   success: function (oData, response) {
            //     self.getView().setBusy(false);
            //     var arrayMessage = oData.results;
            //     var isSuccess = self.isErrorInLog(arrayMessage);
            //     if (isSuccess) {
            //       self._insertMethod();
            //     }
            //   },
            //   error: function (oError) {
            //     self.getView().setBusy(false);
            //   },
            // });
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


        handleValueHelp:function(oEvent){
          var self =this,
            control = self.getView().byId("idInputZtipodisp3");

          control.setTokens([]);
          if(!self._tipoDispDialog){
            self._tipoDispDialog = sap.ui.core.Fragment.load({
              id: self.getView().getId(),
              name: "gestioneabilitazioneeson.view.fragment.valueHelp.ValueHelpTipoDisp",
              controller: self
            }).then(function(oDialog){
              return oDialog;
            }.bind(this));
          }
          self._tipoDispDialog.then(function(oDialog){
            var addAuthModel = self.getModel(ADD_AUTH_MODEL);
            var oDataModel = self.getModel();
            self.getView().setBusy(true);

            oDataModel.read("/" + Ztipodisp3_SET, {
              urlParameters:{"ZufficioCont": !addAuthModel.getData().ZufficioCont || addAuthModel.getData().ZufficioCont === null ? "" : addAuthModel.getData().ZufficioCont},
              success: function (data, oResponse) {
                self.getView().setBusy(false);
                data.results.splice(0, 1);
                addAuthModel.setProperty("/Ztipodisp3List", data.results);
                var oModelJson = new JSONModel({
                  Ztipodisp3List:data.results
                });
                oDialog.setModel(oModelJson, "TipologiaDispModel");
                oDialog._searchField.setVisible(false);
                oDialog.open();
              },
              error: function (error) {
                self.getView().setBusy(false);
              },
            });            
          });
        },

        _handleValueHelpClose:function(oEvent){
          var self =this,
            aSelectedItems = oEvent.getParameter("selectedItems"),
            oMultiInput = self.byId("idInputZtipodisp3");

          if (aSelectedItems && aSelectedItems.length > 0) {
            aSelectedItems.forEach(function (oItem) {
              oMultiInput.addToken(new sap.m.Token({
                key:oItem.getTitle(),
                text: oItem.getDescription()
              }));
            });
          }
        },

        _insertMethod: function () {
          var self = this,
            oDataModel = self.getModel(),
            addAuthModel = self.getModel(ADD_AUTH_MODEL),
            ZufficioCont = addAuthModel.getProperty("/ZufficioCont"),
            Gjahr = addAuthModel.getProperty("/Gjahr"),
            control = self.getView().byId("idInputZtipodisp3"),
            // Fipos = addAuthModel.getProperty("/Fipos"),
            // Fistl = addAuthModel.getProperty("/Fistl"),
            oControlFilterBarPosFinSpesa = self
              .getView()
              .byId("filterBarPosFinSpesa"),
            oControlIdFilterStruttAmmResp = self
              .getView()
              .byId("idFilterStruttAmmResp"),
            Fipos =
              oControlFilterBarPosFinSpesa.getValue() &&
              oControlFilterBarPosFinSpesa.getValue() !== ""
                ? oControlFilterBarPosFinSpesa.getValue()
                : "",
            Fistl =
              oControlIdFilterStruttAmmResp.getValue() &&
              oControlIdFilterStruttAmmResp.getValue() !== ""
                ? oControlIdFilterStruttAmmResp.getValue()
                : "",
            //Ztipodisp3 = addAuthModel.getProperty("/Ztipodisp3"),
            Datab = addAuthModel.getProperty("/Datab"),
            Datbi = addAuthModel.getProperty("/Datbi");

          var listZtipoDisp =  control.getTokens();

          if (
            ZufficioCont === null ||
            Gjahr === null ||
            Fipos === null ||
            Fistl === null ||
            listZtipoDisp.length === 0 ||
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
              // Ztipodisp3: !Ztipodisp3 || Ztipodisp3 === null ? "" : Ztipodisp3,
              Ztipodisp3: null,
              Datab: !DatabTs || DatabTs === null ? "" : DatabTs,
              Datbi: !DatbiTs || DatbiTs === null ? "" : DatbiTs,
              Zchiaveabi: "Zchiaveabi",
              ZstepAbi: "1",
              Bukrs: "S001",
            },
          ];

          var arrDisp =[];
          
          for(var i=0; i<control.getTokens().length;i++){
            var item = control.getTokens()[i];
            arrDisp.push(item.getKey());
          }

          var entityRequestBody = {
            Bukrs: "",
            Gjahr: "",
            Zchiaveabi: "Zchiaveabi",
            OperationType: OPTION_ADD,
            AbilitazioneSet: entity,
            AbilitazioneMessageSet: [],
          };

          var oParam = {
            ZTipoDisp: arrDisp.toString()
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            urlParameters: oParam,
            success: function (result) {
              self.getView().setBusy(false);
              var arrayMessage = result.AbilitazioneMessageSet.results;

              var isSuccess = self.isErrorInLog(arrayMessage);
              if (isSuccess) {
                self.setPropertyGlobal(self.RELOAD_MODEL_AUTH, "canRefresh", true);
                self.onNavBack();
              }
            },
            error: function (err) {
              self.getView().setBusy(false);
            },
            async: true
          });
        },
      }
    );
  }
);
