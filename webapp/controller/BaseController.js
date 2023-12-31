sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/library",
    // "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "../model/formatter",
    "sap/m/MessageItem",
    "sap/m/MessageView",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Bar",
    "sap/m/Input",
    "sap/ui/core/library",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    library,
    Spreadsheet,
    mobileLibrary,
    Filter,
    FilterOperator,
    MessageBox,
    formatter,
    MessageItem,
    MessageView,
    Button,
    Dialog,
    Bar,
    Input,
    coreLibrary
  ) {
    "use strict";

    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";

    const EDM_TYPE = library.EdmType;

    const EQ = sap.ui.model.FilterOperator.EQ;
    const BT = sap.ui.model.FilterOperator.BT;
    const NE = sap.ui.model.FilterOperator.NE;
    const GE = sap.ui.model.FilterOperator.GE;
    const LE = sap.ui.model.FilterOperator.LE;
    const FILTER = sap.ui.model.Filter;

    const ZufficioCont_SET = "UfficioContMcSet";
    const Ztipodisp3_SET = "TipologiaDispSonSet";
    const Fipos_SET = "FiposMcSet";
    const Beneficiary_SET = "BeneficiarioSonSet";
    const SedeBeneficiario_SET = "SedeBeneficiarioSonSet";
    const ZcoordestSet_SET = "ZcoordestSet";
    const Zcos_SET = "CodiceGestionaleMcSet";
    const KostlMcSet_SET = "KostlMcSet";
    const ContoCogeSet_SET = "ContoCogeSet";
    const ZbanksSet_SET = "ZbanksSet";
    const Zzamministr_SET = "UserParametersSet";
    const WIZARD_MODEL = "wizardModel";
    const DataSON_MODEL = "DataModel";
    const STEP3_LIST = "step3List";
    const TABLE_STEP3 = "idTableStep3";
    const URL_DEEP = "DeepSonSet";
    const CLASSIFICAZIONE_SON_SET = "ClassificazioneSonSet";

    const URL_VALIDATION_1 = "ValidazioneSonRegW1";
    const URL_VALIDATION_2 = "ValidazioneSonRegW2";
    const URL_VALIDATION_3 = "ValidazioneSonW3";
    const URL_VALIDATION_4 = "ValidazioneSonRegW4";

    const URL_VALIDATION_D1 = "ValidazioneSonW1";
    const URL_VALIDATION_D2 = "ValidazioneSonW2";
    const URL_VALIDATION_D3 = "ValidazioneSonW3";
    const WIZARD_TYPE_DETAIL = "Detail";
    const OPERATION_TYPE_INSERT = "INS";
    const RELOAD_MODEL = "reloadModel";
    const IbanBeneficiario_SET = "ListaIbanSet";
    const RELOAD_MODEL_AUTH = "reloadModelAuth";
    const CLASSIFICAZIONE_SON_DEEP = "classificazioneSonModel";
    const FILTER_SEM_OBJ = "ZS4_SOSPAUTPERMANENTE_SRV";

    const AUTHORITY_CHECK_ABILITAZIONE = "AuthorityCheckAbilitazione";
    const AUTHORITY_CHECK_SON = "AuthorityCheckSON";

    const COSPR3E027_TIPOFIRMA = "COSPR3E027_TIPOFIRMA";
    const S_TYPE_2 = "2";
    const SON_SET = "SonSet";
    const WORKFLOW_SET = "SonWfSet";
    const OPERATION_TYPE_RETTIFICA = "RET";
    const DETAIL_MODEL = "detailModel";
    const HEADER_ACTION_MODEL = "headerActionModel";
    const COS = "COS";

    return Controller.extend(
      "gestioneabilitazioneeson.controller.BaseController",
      {
        formatter: formatter,
        RELOAD_MODEL: "reloadModel",
        RELOAD_MODEL_AUTH: "reloadModelAuth",
        FILTER_AUTH_OBJ: "Z_GEST_ABI",
        FILTER_SON_OBJ: "Z_GEST_SON",
        AUTHORITY_CHECK_ABILITAZIONE: "AuthorityCheckAbilitazione",
        AUTHORITY_CHECK_SON: "AuthorityCheckSON",
        payMode: [],

        referInputId: null,
        _zcoordest:null,

        getRouter: function () {
          return UIComponent.getRouterFor(this);
        },

        getModel: function (sName) {
          return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        getModelGlobal: function (sName) {
          return this.getOwnerComponent().getModel(sName);
        },
        setPropertyGlobal: function (sName, sProperty, value) {
          if (
            sName === this.RELOAD_MODEL &&
            !this.getOwnerComponent().getModel(sName)
          ) {
            var oReloadModel = new JSONModel({
              canRefresh: false,
            });
            this.setModelGlobal(oReloadModel, sName);
          }

          return this.getOwnerComponent()
            .getModel(sName)
            .setProperty("/" + sProperty, value);
        },

        setModelGlobal: function (oModel, sName) {
          return this.getOwnerComponent().setModel(oModel, sName);
        },

        resetEntityModel: function (nameModel) {
          var self = this;
          var oView = self.getView();
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData([]);
          oView.setModel(oModelJson, nameModel);
        },

        // ----------------------------- START-----------------------------  //

        openDialog: function (dialogPath) {
          if (!this.__dialog) {
            this.__dialog = sap.ui.xmlfragment(dialogPath, this);
            this.getView().addDependent(this.__dialog);
          }
          return this.__dialog;
        },

        closeDialog: function () {
          if (this.__dialog) {
            if (this.__dialog.close) {
              this.__dialog.close();
            }
            this.__dialog.destroy();
            this.__dialog = null;
          }
        },

        // ----------------------------- DIALOG END-----------------------------  //

        // ----------------------------- FOR ACTIVITY CHECK START -----------------------------  //
        getAuthorityCheck: function (object, callback) {
          var self = this,
            oAuthModel = self
              .getOwnerComponent()
              .getModel("ZSS4_CA_CONI_VISIBILITA_SRV"),
            aFilters = [];

          aFilters.push(self.setFilterEQWithKey("SEM_OBJ", FILTER_SEM_OBJ));
          aFilters.push(self.setFilterEQWithKey("AUTH_OBJ", object));

          if (object === self.FILTER_AUTH_OBJ) {
            self
              .getOwnerComponent()
              .getModel("ZSS4_CA_CONI_VISIBILITA_SRV")
              .metadataLoaded()
              .then(function () {
                oAuthModel.read("/ZES_CONIAUTH_SET", {
                  filters: aFilters,
                  success: function (data) {
                    var model = new JSONModel({
                      AGR_NAME: data.results[0].AGR_NAME,
                      FIKRS: data.results[0].FIKRS,
                      BUKRS: data.results[0].BUKRS,
                      PRCTR: data.results[0].PRCTR,
                      Z33Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z33"
                      ),
                      Z01Enabled: self.isIncluded(
                        data.results,
                        "ACTV_1",
                        "Z01"
                      ),
                      Z02Enabled: self.isIncluded(
                        data.results,
                        "ACTV_2",
                        "Z02"
                      ),
                      Z14Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z14"
                      ),
                    });
                    self.setModelGlobal(
                      model,
                      self.AUTHORITY_CHECK_ABILITAZIONE
                    );
                    callback(true);
                    return;
                  },
                  error: function (error) {
                    var model = new JSONModel({
                      AGR_NAME: null,
                      FIKRS: null,
                      BUKRS: null,
                      PRCTR: null,
                      Z33Enabled: false,
                      Z01Enabled: false,
                      Z02Enabled: false,
                      Z14Enabled: false,
                    });
                    self.setModelGlobal(
                      model,
                      self.AUTHORITY_CHECK_ABILITAZIONE
                    );
                    callback(false);
                    return;
                  },
                });
              });
          } else if (object === self.FILTER_SON_OBJ) {
            self
              .getOwnerComponent()
              .getModel("ZSS4_CA_CONI_VISIBILITA_SRV")
              .metadataLoaded()
              .then(function () {
                oAuthModel.read("/ZES_CONIAUTH_SET", {
                  filters: aFilters,
                  success: function (data) {
                    var model = new JSONModel({
                      AGR_NAME: data.results[0].AGR_NAME,
                      FIKRS: data.results[0].FIKRS,
                      BUKRS: data.results[0].BUKRS,
                      PRCTR: data.results[0].PRCTR,
                      Z34Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z34"
                      ),
                      Z01Enabled: self.isIncluded(
                        data.results,
                        "ACTV_1",
                        "Z01"
                      ),
                      Z03Enabled: self.isIncluded(
                        data.results,
                        "ACTV_3",
                        "Z03"
                      ),
                      Z02Enabled: self.isIncluded(
                        data.results,
                        "ACTV_2",
                        "Z02"
                      ),
                      Z07Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z07"
                      ),
                      Z04Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z04"
                      ),
                      Z05Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z05"
                      ),
                      Z06Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z06"
                      ),
                      Z27Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z27"
                      ),
                      Z08Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z08"
                      ),
                      Z09Enabled: self.isIncluded(
                        data.results,
                        "ACTV_4",
                        "Z09"
                      ),
                    });

                    self.setModelGlobal(model, self.AUTHORITY_CHECK_SON);
                    callback(true);
                    return;
                  },
                  error: function (error) {
                    var model = new JSONModel({
                      AGR_NAME: null,
                      FIKRS: null,
                      BUKRS: null,
                      PRCTR: null,
                      Z34Enabled: false,
                      Z01Enabled: false,
                      Z03Enabled: false,
                      Z02Enabled: false,
                      Z07Enabled: false,
                      Z04Enabled: false,
                      Z05Enabled: false,
                      Z06Enabled: false,
                      Z27Enabled: false,
                      Z08Enabled: false,
                      Z09Enabled: false,
                    });
                    self.setModelGlobal(model, self.AUTHORITY_CHECK_SON);
                    callback(false);
                    return;
                  },
                });
              });
          } else {
            var model = new JSONModel({
              AGR_NAME: null,
              FIKRS: null,
              BUKRS: null,
              PRCTR: null,
              Z33Enabled: false,
              Z01Enabled: false,
              Z02Enabled: false,
              Z14Enabled: false,
            });
            self.setModelGlobal(model, self.AUTHORITY_CHECK_ABILITAZIONE);

            model = new JSONModel({
              AGR_NAME: null,
              FIKRS: null,
              BUKRS: null,
              PRCTR: null,
              Z34Enabled: false,
              Z01Enabled: false,
              Z03Enabled: false,
              Z02Enabled: false,
              Z07Enabled: false,
              Z04Enabled: false,
              Z05Enabled: false,
              Z06Enabled: false,
              Z27Enabled: false,
              Z08Enabled: false,
              Z09Enabled: false,
            });
            self.setModelGlobal(model, self.AUTHORITY_CHECK_SON);
            callback(false);
            return;
          }
        },

        isIncluded: function (array, param, value) {
          return array.filter((x) => x[param] === value).length > 0;
        },

        // ----------------------------- FOR ACTIVITY CHECK END -----------------------------  //

        // ----------------------------- START FILTERS -----------------------------  //
        _setFilterEQValue: function (aFilters, sInput) {
          if (sInput && sInput.getValue()) {
            aFilters.push(
              new FILTER(
                sInput.data("searchPropertyModel"),
                EQ,
                sInput.getValue()
              )
            );
          }
        },

        _setFilterEQKey: function (aFilters, sInput) {
          if (sInput && sInput.getSelectedKey()) {
            aFilters.push(
              new FILTER(
                sInput.data("searchPropertyModel"),
                EQ,
                sInput.getSelectedKey()
              )
            );
          }
        },

        getHeaderFilterSON: function () {
          var self = this,
            object = [],
            filters = [],
            oView = self.getView(),
            sGjahr = oView.byId("fGjahr"),
            sZzamministr = oView.byId("fZzamministr"),
            sCapitolo = oView.byId("fCapitolo"),
            sZufficioCont = oView.byId("fZufficioCont"),
            sZnumsopFrom = oView.byId("fZnumsopFrom"),
            sZnumsopTo = oView.byId("fZnumsopTo"),
            sZstatoSop = oView.byId("fZstatoSop"),
            sZdesctipodisp3 = oView.byId("fZdesctipodisp3"),
            sZricann = oView.byId("fZricann"),
            sZdatasopFrom = oView.byId("fZdatasopFrom"),
            sZdatasopTo = oView.byId("fZdatasopTo"),
            sZdataprot = oView.byId("fZdataprot"),
            sZnumprot = oView.byId("fZnumprot"),
            sBeneficiario = oView.byId("fBeneficiario"),
            sFiposFrom = oView.byId("fFiposFrom"),
            sFiposTo = oView.byId("fFiposTo"),
            sFistl = oView.byId("fFistl");

          /*START Validation*/
          object.isValidate = true;

          if (
            !sGjahr.getValue() ||
            sGjahr.getValue() === null ||
            sGjahr.getValue() === ""
          ) {
            object.isValidate = false;
            object.validationMessage = "msgNoRequiredField";
            return object;
          }

          // if (
          //   !sZufficioCont.getValue() ||
          //   sZufficioCont.getValue() === null ||
          //   sZufficioCont.getValue() === ""
          // ) {
          //   object.isValidate = false;
          //   object.validationMessage = "msgNoRequiredField";
          //   return object;
          // }

          if (
            sCapitolo &&
            sCapitolo.getValue() !== null &&
            sCapitolo.getValue() !== "" &&
            sFiposFrom &&
            sFiposFrom.getValue() !== null &&
            sFiposFrom.getValue() !== ""
          ) {
            var substr = sFiposFrom.getValue().substring(4, 8);
            if (sCapitolo.getValue() !== substr) {
              object.isValidate = false;
              object.validationMessage = "msgFiposCapitoloNotValid";
              return object;
            }
          }
          /*STOP Validation*/

          /*Fill Filters*/

          //TO DO - punto aperto Esercizio se MC
          self._setFilterEQValue(filters, sGjahr);
          self._setFilterEQValue(filters, sZzamministr);
          self._setFilterEQValue(filters, sCapitolo);
          self._setFilterEQValue(filters, sZufficioCont);

          sZstatoSop.getSelectedKey() !== "Tutti"
            ? self._setFilterEQKey(filters, sZstatoSop)
            : "";

          sZdesctipodisp3.getSelectedKey() !== "Tutte"
            ? self._setFilterEQKey(filters, sZdesctipodisp3)
            : "";
          sZricann.getSelectedKey() ===
          self.getResourceBundle().getText("ItemYes")
            ? filters.push(
                new FILTER(sZricann.data("searchPropertyModel"), NE, 0)
              )
            : filters.push(
                new FILTER(sZricann.data("searchPropertyModel"), EQ, 0)
              );

          self._setFilterEQValue(filters, sZdataprot);
          self._setFilterEQValue(filters, sZnumprot);
          self._setFilterEQValue(filters, sBeneficiario);
          self._setFilterEQValue(filters, sFistl);

          self.setFilterBT(
            filters,
            "Znumsop",
            sZnumsopFrom?.getValue(),
            sZnumsopTo?.getValue()
          );
          self.setFilterBT(
            filters,
            "Zdatasop",
            sZdatasopFrom?.getValue(),
            sZdatasopTo?.getValue()
          );
          self.setFilterBT(
            filters,
            "Fipos",
            sFiposFrom?.getValue(),
            sFiposTo?.getValue()
          );

          object.filters = filters;
          return object;
        },

        setFilterEQ: function (aFilters, sPropertyModel, sValue) {
          if (sValue) {
            aFilters.push(new Filter(sPropertyModel, EQ, sValue));
          }
        },

        setFilterBT: function (aFilters, sPropertyModel, sValueFrom, sValueTo) {
          if (sValueFrom && sValueTo) {
            aFilters.push(new Filter(sPropertyModel, BT, sValueFrom, sValueTo));
            return;
          }
          if (sValueFrom || sValueTo) {
            this.setFilterEQ(aFilters, sPropertyModel, sValueFrom);
            this.setFilterEQ(aFilters, sPropertyModel, sValueTo);
            return;
          }
        },

        createFilter: function (key, operator, value, useToLower) {
          return new sap.ui.model.Filter(
            useToLower ? "tolower(" + key + ")" : key,
            operator,
            useToLower ? "'" + value.toLowerCase() + "'" : value
          );
        },
        setFilterEQWithKey: function (sKey, sValue) {
          return new sap.ui.model.Filter({
            path: sKey,
            operator: EQ,
            value1: sValue,
          });
        },

        // ----------------------------- END FILTERS -----------------------------  //

        // ----------------------------- START GENERAL-----------------------------  //
        handleHeaderSearch: function (oEvent) {
          var self = this,
            sValue = oEvent.getParameter("value"),
            searchPropertyModel = oEvent.getSource().data().searchPropertyModel,
            oFilter = [],
            qFilters = [];

          oFilter.push(
            self.createFilter(
              searchPropertyModel,
              sap.ui.model.FilterOperator.Contains,
              sValue,
              false
            )
          );
          qFilters = new sap.ui.model.Filter({ filters: oFilter, and: false });
          oEvent.getSource().getBinding("items").filter(qFilters);
        },

        setMessage: function (sTitle, sText, sType) {
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
        // ----------------------------- END GENERAL-----------------------------  //
        // ----------------------------- START LOG -----------------------------  //
        buttonTypeFormatter: function () {
          var self = this;
          var sHighestSeverityIcon;
          var aMessages = self.getView().getModel(LOG_MODEL).getData();

          aMessages.forEach(function (sMessage) {
            switch (sMessage.type) {
              case "Error":
                sHighestSeverityIcon = "Reject";
                break;
              case "Warning":
                sHighestSeverityIcon =
                  sHighestSeverityIcon !== "Reject"
                    ? "Transparent"
                    : sHighestSeverityIcon;
                break;
              case "Success":
                sHighestSeverityIcon =
                  sHighestSeverityIcon !== "Reject" &&
                  sHighestSeverityIcon !== "Transparent"
                    ? "Accept"
                    : sHighestSeverityIcon;
                break;
              default:
                sHighestSeverityIcon = !sHighestSeverityIcon
                  ? "Unstyled"
                  : sHighestSeverityIcon;
                break;
            }
          });

          return sHighestSeverityIcon;
        },

        highestSeverityMessages: function () {
          var self = this;
          var oBundle = self.getResourceBundle();
          var sHighestSeverityIconType = self.buttonTypeFormatter();
          var sHighestSeverityMessageType;

          switch (sHighestSeverityIconType) {
            case "Reject":
              sHighestSeverityMessageType = "Error";
              break;
            case "Transparent":
              sHighestSeverityMessageType = "Warning";
              break;
            case "Accept":
              sHighestSeverityMessageType = "Success";
              break;
            default:
              sHighestSeverityMessageType = !sHighestSeverityMessageType
                ? "Information"
                : sHighestSeverityMessageType;
              break;
          }

          var result = self
            .getView()
            .getModel(LOG_MODEL)
            .getData()
            .reduce(function (iNumberOfMessages, oMessageItem) {
              return oMessageItem.type === sHighestSeverityMessageType
                ? ++iNumberOfMessages
                : iNumberOfMessages;
            }, 0);

          return result + " " + oBundle.getText("msgTitleHandler");
        },

        // Set the button icon according to the message with the highest severity
        buttonIconFormatter: function () {
          var self = this;
          var sIcon;
          var aMessages = self.getView().getModel(LOG_MODEL).getData();

          aMessages.forEach(function (sMessage) {
            switch (sMessage.type) {
              case "Error":
                sIcon = "sap-icon://error";
                break;
              case "Warning":
                sIcon =
                  sIcon !== "sap-icon://error" ? "sap-icon://alert" : sIcon;
                break;
              case "Success":
                sIcon =
                  "sap-icon://error" && sIcon !== "sap-icon://alert"
                    ? "sap-icon://sys-enter-2"
                    : sIcon;
                break;
              default:
                sIcon = !sIcon ? "sap-icon://information" : sIcon;
                break;
            }
          });

          return sIcon;
        },

        filterMessage: function (oEvent) {
          var self = this,
            sValue = oEvent.getParameter("value"),
            messageModel = self.getView().getModel(MESSAGE_MODEL).getData(),
            oModel = new JSONModel();
          if (sValue && sValue.trim().length > 0) {
            var array = messageModel.filter((el) => {
              return el.subtitle.includes(sValue);
            });

            if (array.length > 0) {
              oModel.setData(array);
            } else {
              oModel.setData([]);
            }
          } else {
            oModel.setData(messageModel);
          }
          self.setModel(oModel, LOG_MODEL);
          self.oMessageView.setModel(oModel, LOG_MODEL);
        },
        formatMessage: function (sMessage) {
          var Type, Title;
          if (sMessage.Msgty === "E") {
            Type = "Error";
            Title = "Errore";
          } else if (sMessage.Msgty === "I") {
            Type = "Information";
            Title = "Informazione";
          }

          sMessage["type"] = Type;
          sMessage["title"] = Title;
          sMessage["subtitle"] = sMessage.Text;
          return sMessage;
        },

        isErrorInLog: function (array) {
          var self = this;
          var oModel = new JSONModel();
          var logModel = [];

          if (array.length > 0) {
            array.forEach((el) => {
              logModel.unshift(self.formatMessage(el));
            });

            oModel.setData(logModel);

            self.getView().setModel(oModel, LOG_MODEL);
            self.oMessageView.setModel(oModel, LOG_MODEL);

            var arrayError = array.filter((el) => el.Msgty === "E");

            if (arrayError.length > 0) {
              self.setMessage("titleDialogError", "msgError", "error");
              return false;
            }
            return true;
          } else {
            oModel.setData([]);

            self.getView().setModel(oModel, LOG_MODEL);
            self.oMessageView.setModel(oModel, LOG_MODEL);
            return true;
          }
        },

        configExportMessage: function () {
          var oSheet;
          var self = this;
          var oBundle = self.getResourceBundle();

          var aCols = self.createColumnConfigMessage();
          var oSettings = {
            workbook: {
              columns: aCols,
            },
            dataSource: self.getModel(LOG_MODEL).getData(),
            fileName: oBundle.getText("LOG"),
          };

          oSheet = new Spreadsheet(oSettings);
          oSheet.build().finally(function () {
            oSheet.destroy();
          });
        },
        createColumnConfigMessage: function () {
          var self = this;
          var sColLabel = "columnMessage";
          var oBundle = self.getResourceBundle();
          var aCols = [
            {
              label: oBundle.getText(sColLabel + "Type"),
              property: "title",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "Class"),
              property: "Msgid",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "Number"),
              property: "Msgno",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "Text"),
              property: "Text",
              type: EDM_TYPE.String,
            },
          ];
          return aCols;
        },
        // ----------------------------- END LOG-----------------------------  //

        /*WIZARD - START*/

        // getFipos:function(lvGjahr, lvZufficioCont, lvTipoDisp){
        //   var self =this,
        //       oDataModel = self.getModel();

        //   if(!self.getView().getModel(WIZARD_MODEL) || self.getView().getModel(WIZARD_MODEL) === null )
        //     return;

        //   if(!lvGjahr || lvGjahr === null || lvGjahr === "" ||
        //     !lvZufficioCont || lvZufficioCont === null || lvZufficioCont === "" ||
        //     !lvTipoDisp || lvTipoDisp === null || lvTipoDisp === "" )
        //     return;

        //   self.getModel().metadataLoaded().then(function () {
        //     oDataModel.read("/FiposMcSet", {
        //       urlParameters: {
        //         Gjahr: lvGjahr,
        //         ZufficioCont:lvZufficioCont,
        //         Ztipodisp3:lvTipoDisp
        //       },
        //       success: function (data, oResponse) {
        //           if(data && data.results && data.results>0)
        //             self.getView().getModel(WIZARD_MODEL).setProperty("/Fipos",data.results[0].Fipos);
        //       },
        //       error: function (error) {

        //       },
        //     });
        //   });
        // },

        _getIdElement: function (oEvent) {
          var longId = oEvent.getSource().getId();

          var arrayId = longId.split("-");
          var id = arrayId[arrayId.length - 1];
          return id;
        },

        onSubmitZcodtrib: function(oEvent) {
          //GIANNI
          var self = this,
            oBundle = self.getResourceBundle(),
            oDataModel = self.getModel(),
            wizardModel = self.getModel(WIZARD_MODEL),
            oView = self.getView(),
            Zcodtrib = wizardModel.getProperty("/Zcodtrib");
          if (Zcodtrib && Zcodtrib !== null) {
            var path = oDataModel.createKey("DatiTributoSet", {
              Zcodtrib: Zcodtrib,
              Ztiposogg: ""
            });

            oView.setBusy(true);
            oDataModel
              .metadataLoaded()
              .then(() => {
                oDataModel.read("/" + path, {
                  success: (data, oResponse) => {
                    var message =
                      oResponse.headers["sap-message"] &&
                      oResponse.headers["sap-message"] !== ""
                        ? JSON.parse(oResponse.headers["sap-message"])
                        : null;
                    oView.setBusy(false);    
                    if (message && message.severity === "error") {
                      sap.m.MessageBox.warning(message.message, {
                        title: oBundle.getText("titleDialogWarning"),
                        onClose: function (oAction) {
                          return false;
                        },
                      });
                      return false;
                    }
                    else{
                      wizardModel.setProperty("/Zcodtrib", data.Zcodtrib.toUpperCase());
                      wizardModel.setProperty("/Zcodinps", data.Zcodinps);
                      wizardModel.setProperty("/Zperiodrifda", data.Zperiodrifda);
                      wizardModel.setProperty("/Zperiodrifa", data.Zperiodrifa);
                    }
                  },
                  error: (error) => {
                    oView.setBusy(false);
                    console.log(error);
                  }
                })
              });
          } else {
            wizardModel.setProperty("/Zcodinps", null);
            wizardModel.setProperty("/Zperiodrifda", null);
            wizardModel.setProperty("/Zperiodrifa", null);
          }
        },
        onSubmitZufficioCont: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            ufficioValue = oEvent.getParameters().value;
            wizardModel.setProperty("/Ztipodisp3", null);
            
          if(ufficioValue && ufficioValue !== "" && wizardModel.getData().Gjahr && wizardModel.getData().Gjahr !== "")
            self._checkUfficioOrdinante(ufficioValue, wizardModel.getData().Gjahr);
          // self.fillZvimDescrufficio();
          self.fillZtipodisp3List();
          self.fillFipos();
        },

        _checkUfficioOrdinante:function(ZufficioCont,Gjahr){
          var self =this,
            oBundle = self.getResourceBundle(),
            oDataModel = self.getModel();
          self.getView().setBusy(true);
          oDataModel.callFunction("/CheckUfficioAbilitato", {
                method: "GET",
                urlParameters: {
                  Gjahr: Gjahr,
                  ZufficioCont:ZufficioCont
                },
                success: function (oData, response) {
                  self.getView().setBusy(false);
                  if(oData.results.length>0){
                    var item = oData.results[0];
                    sap.m.MessageBox.warning(item.Text, {
                      title: oBundle.getText("titleDialogWarning"),
                      onClose: function (oAction) {
                        return false;
                      },
                    });
                    return false;
                  }
                },
                error: function (oError) {
                  console.log(oError);
                  self.getView().setBusy(false);
                },
              });
        },


        fillZvimDescrufficio: function () {
          var self = this,
            oDataModel = self.getModel(),
            oView = self.getView(),
            wizardModel = self.getModel(WIZARD_MODEL),
            ZufficioCont = wizardModel.getProperty("/ZufficioCont"),
            Gjahr = wizardModel.getProperty("/Gjahr");

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
                    wizardModel.setProperty(
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
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Gjahr = wizardModel.getProperty("/Gjahr"),
            ZufficioCont = wizardModel.getProperty("/ZufficioCont");
            wizardModel.setProperty("/Ztipodisp3List", []);
            //wizardModel.setProperty("/Ztipodisp3", null);
            //Ztipodisp3
          if (Gjahr !== null && ZufficioCont !== null) {
            oView.setBusy(true);
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + Ztipodisp3_SET, {
                  urlParameters: { Gjahr: Gjahr, ZufficioCont: ZufficioCont },
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    wizardModel.setProperty("/Ztipodisp3List", data.results);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        fillZtipodisp3ListWizard: function (value) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Gjahr = wizardModel.getProperty("/Gjahr"),
            ZufficioCont = wizardModel.getProperty("/ZufficioCont");
            wizardModel.setProperty("/Ztipodisp3List", []);
            //wizardModel.setProperty("/Ztipodisp3", null);
            //Ztipodisp3
          if (Gjahr !== null && ZufficioCont !== null) {
            oView.setBusy(true);
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + Ztipodisp3_SET, {
                  urlParameters: { Gjahr: Gjahr, ZufficioCont: ZufficioCont },
                  success: function (data, oResponse) {
                    
                    wizardModel.setProperty("/Ztipodisp3List", data.results);
                    if(value && value !== ""){
                      var idWizardZdesctipodisp3 = self.getView().byId("idWizardZdesctipodisp3");
                      if(idWizardZdesctipodisp3)
                        idWizardZdesctipodisp3.setSelectedKey(value);
                    } 
                    oView.setBusy(false);                    
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        onLiveChange: function (oEvent) {
          var self = this,
            sNewValue,
            wizardModel = self.getModel(WIZARD_MODEL);

          var sInputId = self._getIdElement(oEvent);

          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");

          sNewValue = oEvent.getSource().getValue();
          wizardModel.setProperty("/" + sProperty, sNewValue);
        },

       
        wizardFiposChange:function(oEvent){
          var self =this,
            value = oEvent.getParameters().value;
          self.getModel(WIZARD_MODEL).setProperty("/Fipos",value ? value : null);          
        },
        
        wizardFistlChange:function(oEvent){
          var self =this,
            value = oEvent.getParameters().value;
          self.getModel(WIZARD_MODEL).setProperty("/Fistl",value ? value : null);      
        },


        onLiveChangeImportoStep1Wizard: function (oEvent) {
          var self = this,
            sNewValue,
            oDataModel = self.getModel(),
            wizardModel = self.getModel(WIZARD_MODEL);

          var sInputId = self._getIdElement(oEvent);

          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");

          sNewValue = oEvent.getSource().getValue();
          wizardModel.setProperty("/" + sProperty, sNewValue);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/ZimptotDivisa", null);
          if (sNewValue !== "") {
            var path = self.getModel().createKey("TvarvcParameterSet", {
              Name: "COSP-R3-FIORI-E018_DIVISA",
            });

            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    self
                      .getView()
                      .getModel(WIZARD_MODEL)
                      .setProperty("/ZimptotDivisa", data.Value);
                  },
                  error: function (error) {},
                });
              });
          }
        },

        onLiveChangePayMode: function (oEvent) {
          var self = this,
            sNewValue,
            wizardModel = self.getModel(WIZARD_MODEL);

          var sInputId = self._getIdElement(oEvent);

          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");

          sNewValue = oEvent.getSource().getValue();

          wizardModel.setProperty("/" + sProperty, sNewValue.toUpperCase());
        },

        onSubmitGjahr: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL);
            wizardModel.setProperty("/Ztipodisp3", null);
          self.fillZvimDescrufficio();
          self.fillZtipodisp3List();
          self.fillFipos();
        },

        onSubmitKostl: function (oEvent) {
          var self = this,
            value = oEvent.getParameters().value,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Kostl = wizardModel.getProperty("/Kostl");

          if(!value || value === null || value === ""){
            wizardModel.setProperty("/Ltext", null);
            wizardModel.setProperty("/Kostl", null);
            return false;
          }  

          if (Kostl !== null) {
            oView.setBusy(true);
            var path = self.getModel().createKey(KostlMcSet_SET, {
              Kostl: Kostl
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);

                    wizardModel.setProperty("/Ltext", data.Ltext);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        onSubmitSakrn: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Saknr = wizardModel.getProperty("/Saknr");
          if (Saknr !== null && Saknr !== "") {
            oView.setBusy(true);
            var path = self.getModel().createKey(ContoCogeSet_SET, {
              Saknr: Saknr,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);

                    wizardModel.setProperty("/Skat", data.Skat);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else {
            wizardModel.setProperty("/Skat", null);
            return false
          };
        },

        onLiveChangeZtipodisp3List: function (oEvent) {
          var self = this;
          var oModelWizard = self.getModel(WIZARD_MODEL);
          var sNewValue = oEvent.getSource().getSelectedKey();
          var sNewDesc = oEvent.getSource().getValue();

          oModelWizard.setProperty("/Ztipodisp3", sNewValue);
          oModelWizard.setProperty("/Zdesctipodisp3", sNewDesc);

          if (sNewValue) {
            self.fillFipos();
          }

          if (sNewValue === "004") {
            oModelWizard.setProperty("/Zimptot", null);
            oModelWizard.setProperty("/ZimptotDivisa", null);
          }
        },

        fillFipos: function () {
          var self = this,
            oBundle = self.getResourceBundle(),
            wizardModel = self.getModel(WIZARD_MODEL),
            Gjahr = wizardModel.getProperty("/Gjahr"),
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Ztipodisp3 = wizardModel.getProperty("/Ztipodisp3"),
            ZufficioCont = wizardModel.getProperty("/ZufficioCont");

          if (
            !Gjahr ||
            Gjahr === null ||
            Gjahr === "" ||
            !ZufficioCont ||
            ZufficioCont === null ||
            ZufficioCont === "" ||
            !Ztipodisp3 ||
            Ztipodisp3 === null ||
            Ztipodisp3 === ""
          ) {
            self.getView().byId("idWizardFipos").setSelectedKey(null);
            self.getView().getModel(DataSON_MODEL).setProperty("/PosizioneFinanziaria", []);
            wizardModel.setProperty("/Fipos", null);
            return false;
          } else {
            oView.setBusy(true);
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                var filter = [
                  self.setFilterEQWithKey("Ztipodisp3", Ztipodisp3),
                  self.setFilterEQWithKey("Gjahr", Gjahr),
                  self.setFilterEQWithKey("ZufficioCont", ZufficioCont),
                ];
                oDataModel.read("/" + Fipos_SET, {
                  filters: filter,
                  // urlParameters: {
                  //   Gjahr: Gjahr,
                  //   ZufficioCont: ZufficioCont,
                  //   Ztipodisp3: Ztipodisp3,
                  // },
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
                          self.getView().byId("idWizardFipos").setSelectedKey(null);
                          self.getView().getModel(DataSON_MODEL).setProperty("/PosizioneFinanziaria", []);
                          wizardModel.setProperty("/Fipos", null);
                          return false;
                        },
                      });
                      return false;
                    } else {
                      oView.setBusy(false);
                      self.getView().getModel(DataSON_MODEL).setProperty("/PosizioneFinanziaria", data.results);
                      // if (data && data.results && data.results.length > 0){
                      //   self.getView().byId("idWizardFipos").setSelectedKey(data.results[0].Fipos);
                      //   wizardModel.setProperty("/Fipos",data.results[0].Fipos);
                      // }
                      // else wizardModel.setProperty("/Fipos", null);
                      wizardModel.setProperty("/Fipos", null);
                    }
                  },
                  error: function (error) {
                    self.getView().byId("idWizardFipos").setSelectedKey(null);
                    self.getView().getModel(DataSON_MODEL).setProperty("/PosizioneFinanziaria", []);
                    wizardModel.setProperty("/Fipos", null);
                    oView.setBusy(false);
                  },
                });
              });
          }
        },

        goToTwo: function (oEvent) {
          var self = this,
            wizardId = oEvent.getSource().getParent().getId(),
            wizard = self.getView().byId(wizardId),
            wizardType = wizard.data("wizardType"),
            wizardModel = self.getView().getModel(WIZARD_MODEL);

          if (!wizardModel.getProperty("/isInChange")) return;

          // if (wizardType !== WIZARD_TYPE_DETAIL) {
            var Gjahr = wizardModel.getProperty("/Gjahr"),
              Ztipodisp3 = wizardModel.getProperty("/Ztipodisp3"),
              ZufficioCont = wizardModel.getProperty("/ZufficioCont"),
              Fistl = wizardModel.getProperty("/Fistl"),
              Kostl = wizardModel.getProperty("/Kostl"),
              Saknr = wizardModel.getProperty("/Saknr"),
              Fipos = wizardModel.getProperty("/Fipos"),
              Zimptot = wizardModel.getProperty("/Zimptot"),
              Trbtr = wizardModel.getProperty("/Trbtr");

            if (Fipos !== null && Fistl !== null) {
              var oParam = {
                Fipos: !Fipos || Fipos === null ? "" : Fipos,
                Fistl: !Fistl || Fistl === null ? "" : Fistl,
                Gjahr: !Gjahr || Gjahr === null ? "" : Gjahr,
                Kostl: !Kostl || Kostl === null ? "" : Kostl, //TEST
                Ztipodisp3:
                  !Ztipodisp3 || Ztipodisp3 === null ? "" : Ztipodisp3,
                ZufficioCont:
                  !ZufficioCont || ZufficioCont === null ? "" : ZufficioCont,
                Saknr: !Saknr || Saknr === null ? "" : Saknr, //0012111000
                AgrName: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .AGR_NAME,
                Fikrs: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .FIKRS,
                Prctr: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .PRCTR,
                Zimptot: Zimptot === '' ? "0" : Zimptot ?? "0",
                Trbtr: Trbtr === '' ? "0" : Trbtr ?? "0",
                ZimptotDivisa: wizardModel.getProperty("/ZimptotDivisa") ?? "",
                Twaer: wizardModel.getProperty("/Twaer") ?? "",
              };

              var oDataModel = self.getModel();
              oDataModel.callFunction("/" + URL_VALIDATION_1, {
                method: "GET",
                urlParameters: oParam,
                success: function (oData, response) {
                  var arrayMessage = oData.results;
                  if (!self.isErrorInLog(arrayMessage)) {
                    wizardModel.setProperty("/btnBackVisible", false);
                    wizard.previousStep();
                    self.handleButtonsVisibility(0);
                    self.getView().setBusy(false);
                  } else {
                    var oModel = new JSONModel();
                    oModel.setData([]);
                    self.setModel(oModel, LOG_MODEL);
                    self.oMessageView.setModel(oModel, LOG_MODEL);

                    self.getView().setBusy(false);
                    self.updateDataSON([
                      "Gjahr",
                      "ZufficioCont",
                      "Fipos",
                      "Fistl",
                      "Zdesctipodisp3",
                      Zimptot && parseFloat(Zimptot) > 0 ? "Zimptot" : "Trbtr",
                      Zimptot && parseFloat(Zimptot) > 0 ? "ZimptotDivisa" :"Twaer",
                    ]);
                  }
                },
                error: function (oError) {
                  self.getView().setBusy(false);
                  wizardModel.setProperty("/btnBackVisible", false);
                  wizard.previousStep();
                  self.handleButtonsVisibility(0);
                },
              });
            } else {
              self._setMessage(
                "titleDialogError",
                "msgNoRequiredField",
                "error",
                wizardType !== WIZARD_TYPE_DETAIL ? "CreateProductWizard" : ""
              );
              return false;
            }
          // } else {
          //   self.updateDataSON([
          //     "Gjahr",
          //     "ZufficioCont",
          //     "Fipos",
          //     "Fistl",
          //     "Zdesctipodisp3",
          //     "Zimptot",
          //     "ZimptotDivisa",
          //   ]);
          // }
        },
        goToThree: function (oEvent) {
          var self = this,
            wizardId = oEvent.getSource().getParent().getId(),
            wizard = self.getView().byId(wizardId),
            wizardType = wizard.data("wizardType");

          var wizardModel = self.getModel(WIZARD_MODEL),
            Zimptot = wizardModel.getProperty("/Zimptot"),
            Iban = wizardModel.getProperty("/Iban"),
            Lifnr = wizardModel.getProperty("/Lifnr"),
            Zwels = wizardModel.getProperty("/PayMode"),
            Zcoordest = wizardModel.getProperty("/Zcoordest"),
            ZZcausaleval = wizardModel.getProperty("/ZZcausaleval"),
            Banks = wizardModel.getProperty("/Banks"),
            Trbtr = wizardModel.getProperty("/Trbtr");

          Trbtr = !Trbtr || Trbtr === null ? 0 : Trbtr;

          if (!wizardModel.getProperty("/isInChange")) return;

          var oParam, url;
          if (wizardType === WIZARD_TYPE_DETAIL) {
            url = URL_VALIDATION_D2;
            oParam = {
              Iban: !Iban || Iban === null ? "" : Iban,
              Lifnr: !Lifnr || Lifnr === null ? "" : Lifnr,
              Zcoordest: !Zcoordest || Zcoordest === null ? "" : Zcoordest,
              Zwels: !Zwels || Zwels === null ? "" : Zwels,
              ZZcausaleval:
                !ZZcausaleval || ZZcausaleval === null ? "" : ZZcausaleval,
              Banks: !Banks || Banks === null ? "" : Banks,
              AliasRgs:
                !wizardModel.getProperty("/Zalias") ||
                wizardModel.getProperty("/Zalias") === null
                  ? ""
                  : wizardModel.getProperty("/Zalias"),
              Flagfruttifero:
                !wizardModel.getProperty("/Zflagfrutt") ||
                wizardModel.getProperty("/Zflagfrutt") === null
                  ? ""
                  : wizardModel.getProperty("/Zflagfrutt"),
              Purpose:
                !wizardModel.getProperty("/Zpurpose") ||
                wizardModel.getProperty("/Zpurpose") === null
                  ? ""
                  : wizardModel.getProperty("/Zpurpose"),
              Zcodtrib:
                !wizardModel.getProperty("/Zcodtrib") ||
                wizardModel.getProperty("/Zcodtrib") === null
                  ? ""
                  : wizardModel.getProperty("/Zcodtrib"),
            };
          } else {
            url = URL_VALIDATION_2;
            oParam = {
              Zimptot: !Zimptot || Zimptot === null ? Trbtr : Zimptot,
              Iban: !Iban || Iban === null ? "" : Iban,
              Lifnr: !Lifnr || Lifnr === null ? "" : Lifnr,
              Zcoordest: !Zcoordest || Zcoordest === null ? "" : Zcoordest,
              Zwels: !Zwels || Zwels === null ? "" : Zwels,
              ZZcausaleval:
                !ZZcausaleval || ZZcausaleval === null ? "" : ZZcausaleval,
              Banks: !Banks || Banks === null ? "" : Banks,
              AliasRgs:
                !wizardModel.getProperty("/Zalias") ||
                wizardModel.getProperty("/Zalias") === null
                  ? ""
                  : wizardModel.getProperty("/Zalias"),
              Flagfruttifero:
                !wizardModel.getProperty("/Zflagfrutt") ||
                wizardModel.getProperty("/Zflagfrutt") === null
                  ? ""
                  : wizardModel.getProperty("/Zflagfrutt"),
              Purpose:
                !wizardModel.getProperty("/Zpurpose") ||
                wizardModel.getProperty("/Zpurpose") === null
                  ? ""
                  : wizardModel.getProperty("/Zpurpose"),
              Zcodtrib:
                !wizardModel.getProperty("/Zcodtrib") ||
                wizardModel.getProperty("/Zcodtrib") === null
                  ? ""
                  : wizardModel.getProperty("/Zcodtrib"),
            };
          }

          var oDataModel = self.getModel();
          self.getView().setBusy(true);
          oDataModel.callFunction("/" + url, {
            method: "GET",
            urlParameters: oParam,
            success: function (oData, response) {
              self.getView().setBusy(false);
              var arrayMessage = oData.results;
              if (!self.isErrorInLog(arrayMessage)) {
                wizard.previousStep();
                self.handleButtonsVisibility(1);
              } else {
                var oModel = new JSONModel();
                oModel.setData([]);
                self.setModel(oModel, LOG_MODEL);
                self.oMessageView.setModel(oModel, LOG_MODEL);
                self.getView().setBusy(false);
                self.updateDataSON([
                  "Lifnr",
                  "NameFirst",
                  "NameLast",
                  "TaxnumPiva",
                  "ZzragSoc",
                  "TaxnumCf",
                ]);

                self
                  .getModel()
                  .metadataLoaded()
                  .then(function () {
                    var filter = [
                      self.setFilterEQWithKey(
                        "Bukrs",
                        wizardModel.getProperty("/Bukrs")
                      ),
                      self.setFilterEQWithKey(
                        "Zchiavesop",
                        wizardModel.getProperty("/Zchiavesop")
                      ),
                    ];
                    oDataModel.read("/" + CLASSIFICAZIONE_SON_SET, {
                      filters: filter,
                      urlParameters: {
                        Gjahr: wizardModel.getProperty("/Gjahr"),
                      },
                      success: function (data, oResponse) {
                        var array = [],
                          aCloneData = [],
                          sum = 0;
                        for (var i = 0; i < data.results.length; i++) {
                          var item = data.results[i];
                          item.Id = i + 1;
                          sum = sum + parseFloat(item.ZimptotClass);
                          array.push(item);
                        }
                        var oModelJson = new sap.ui.model.json.JSONModel();
                        if (array.length === 0) {
                          array.push({
                            Zchiavesop: null,
                            Bukrs: null,
                            Zetichetta: COS,
                            ZstepSop: null,
                            Zposizione: "",
                            Zcos: null,
                            ZcosDesc: null,
                            ZimptotClass: null,
                            Id: 1
                          });
                        }
                        oModelJson.setData(array);
                        self.getView().setModel(oModelJson, STEP3_LIST);
                        self
                          .getView()
                          .getModel(WIZARD_MODEL)
                          .setProperty("/Zimptotcos", sum.toFixed(2));
                        
                        aCloneData = aCloneData.concat(array);
                        var oModelData = new sap.ui.model.json.JSONModel(aCloneData);
                        self.getView().setModel(oModelData, CLASSIFICAZIONE_SON_DEEP);
                      },
                      error: function (error) {
                        var oModelJson = new sap.ui.model.json.JSONModel();
                        oModelJson.setData([]);
                        self.getView().setModel(oModelJson, STEP3_LIST);
                        var oModelData = new sap.ui.model.json.JSONModel([]);
                        self.getView().setModel(oModelData, CLASSIFICAZIONE_SON_DEEP);
                        wizard.previousStep();
                        self.handleButtonsVisibility(1);
                      },
                    });
                  });
              }
            },
            error: function (oError) {
              self.getView().setBusy(false);
              wizard.previousStep();
              self.handleButtonsVisibility(1);
            },
          });
        },

        goToFour: function (oEvent) {
          var self = this,
            oBundle = self.getResourceBundle(),
            wizardId = oEvent.getSource().getParent().getId(),
            wizard = self.getView().byId(wizardId),
            wizardType = wizard.data("wizardType");

          var wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            Zimptot = wizardModel.getProperty("/Zimptot"),
            Trbtr = wizardModel.getProperty("/Trbtr"),
            Step3List = self.getModel(STEP3_LIST).getData(),
            Zimptotcos = wizardModel.getProperty("/Zimptotcos");

          Trbtr = !Trbtr || Trbtr === null ? 0 : Trbtr;

          if (!wizardModel.getProperty("/isInChange")) return;

          var len = Step3List.length;
          var iFirstEmptyRow = Step3List.findIndex((x) => !x.Zcos || !x.ZimptotClass);
          if (len <= 0 || iFirstEmptyRow > -1) {
            sap.m.MessageBox.error(oBundle.getText("msgNoRequiredField"), {
              title: oBundle.getText("titleDialogError"),
              onClose: function (oAction) {
                wizard.previousStep();
                self.handleButtonsVisibility(2);
                return false;
              },
            });
            return false;
            // self._setMessage("titleDialogError", "msgNoRequiredField", "error");
            // wizard.previousStep();
            // self.handleButtonsVisibility(2);
          } else {
            var oParam = {
              Zimptot: !Zimptot || Zimptot === null ? Trbtr : Zimptot,
              Zimptotcos: !Zimptotcos || Zimptotcos === null ? 0 : Zimptotcos,
            };

            var url =
              wizardType === WIZARD_TYPE_DETAIL
                ? URL_VALIDATION_D3
                : URL_VALIDATION_3;
            self.getView().setBusy(true);
            oDataModel.callFunction("/" + url, {
              method: "GET",
              urlParameters: oParam,
              success: function (oData, response) {
                self.getView().setBusy(false);
                var arrayMessage = oData.results;
                if (!self.isErrorInLog(arrayMessage)) {
                  wizard.previousStep();
                  self.handleButtonsVisibility(2);
                }
              },
              error: function (oError) {
                self.getView().setBusy(false);
                wizard.previousStep();
                self.handleButtonsVisibility(2);
              },
            });
          }
        },

        goToFinish: function (wizardId, callback) {
          var self = this,
            wizard = self.getView().byId(wizardId),
            wizardType =
              wizard.data("wizardType") &&
              wizard.data("wizardType") !== null &&
              wizard.data("wizardType") !== ""
                ? wizard.data("wizardType")
                : "";

          var wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            Zlocpag = wizardModel.getProperty("/Zlocpag"),
            Zzonaint = wizardModel.getProperty("/Zzonaint"),
            Zcausale = wizardModel.getProperty("/Zcausale");

          if (
            !Zlocpag ||
            Zlocpag === null ||
            Zlocpag === "" ||
            !Zzonaint ||
            Zzonaint === null ||
            Zzonaint === "" ||
            !Zcausale ||
            Zcausale === null ||
            Zcausale === ""
          ) {
            self._setMessage("titleDialogError", "msgNoRequiredField", "error");
            callback("msgNoRequiredField");
            return;
          }

          if (wizardType !== WIZARD_TYPE_DETAIL) {
            var oParam = {
              Zlocpag: !Zlocpag || Zlocpag === null ? "" : Zlocpag,
              Zzonaint: !Zzonaint || Zzonaint === null ? "" : Zzonaint,
            };

            var url = URL_VALIDATION_4;
            self.getView().setBusy(true);
            oDataModel.callFunction("/" + url, {
              method: "GET",
              urlParameters: oParam,
              success: function (oData, response) {
                self.getView().setBusy(false);
                var arrayMessage = oData.results;
                if (!self.isErrorInLog(arrayMessage)) {
                  callback("ValidationError");
                  return;
                }
                callback("ValidationSuccess");
              },
              error: function (oError) {
                self.getView().setBusy(false);
                callback("ValidationError");
              },
            });
          } else callback("ValidationSuccess");
        },

        getClassificazioneFRomFillWizard(wizardModel) {
          var self = this,
            array = [],
            sum = 0,
            oModel = self.getModel();

          var filters = [
            self.setFilterEQWithKey("Bukrs", wizardModel.getProperty("/Bukrs")),
            self.setFilterEQWithKey(
              "Zchiavesop",
              wizardModel.getProperty("/Zchiavesop")
            ),
          ];

          oModel.read("/" + CLASSIFICAZIONE_SON_SET, {
            filters: filters,
            urlParameters: { Gjahr: wizardModel.getProperty("/Gjahr") },
            success: function (data, oResponse) {
              for (var i = 0; i < data.results.length; i++) {
                var item = data.results[i];
                item.Id = i + 1;
                sum = sum + parseFloat(item.ZimptotClass);
                array.push(item);
              }
              var oModelJson = new sap.ui.model.json.JSONModel();
              oModelJson.setData(array);
              self.getView().setModel(oModelJson, STEP3_LIST);

              // var oModelJson1 = new sap.ui.model.json.JSONModel();
              // oModelJson1.setData(array);
              // self.getView().setModel(oModelJson1, CLASSIFICAZIONE_SON_DEEP);
              self
                .getView()
                .getModel(WIZARD_MODEL)
                .setProperty("/Zimptotcos", sum.toFixed(2));
            },
            error: function (e) {
              var oModelJson = new sap.ui.model.json.JSONModel();
              oModelJson.setData([]);
              self.getView().setModel(oModelJson, STEP3_LIST);
              // var oModelJson1 = new sap.ui.model.json.JSONModel();
              // oModelJson1.setData([]);
              // self.getView().setModel(oModelJson1, CLASSIFICAZIONE_SON_DEEP);
            },
          });
        },

        getClassificazioneFRomFillWizard2(wizardModel) {
          var self = this,
            array = [],
            sum = 0,
            oModel = self.getModel();

          var filters = [
            self.setFilterEQWithKey("Bukrs", wizardModel.getProperty("/Bukrs")),
            self.setFilterEQWithKey(
              "Zchiavesop",
              wizardModel.getProperty("/Zchiavesop")
            ),
          ];

          oModel.read("/" + CLASSIFICAZIONE_SON_SET, {
            filters: filters,
            urlParameters: { Gjahr: wizardModel.getProperty("/Gjahr") },
            success: function (data, oResponse) {
              for (var i = 0; i < data.results.length; i++) {
                var item = data.results[i];
                item.Id = i + 1;
                sum = sum + parseFloat(item.ZimptotClass);
                array.push(item);
              }
              
              var oModelJson1 = new sap.ui.model.json.JSONModel();
              oModelJson1.setData(array);
              self.getView().setModel(oModelJson1, CLASSIFICAZIONE_SON_DEEP);
              self
                .getView()
                .getModel(WIZARD_MODEL)
                .setProperty("/Zimptotcos", sum.toFixed(2));
            },
            error: function (e) {
              var oModelJson1 = new sap.ui.model.json.JSONModel();
              oModelJson1.setData([]);
              self.getView().setModel(oModelJson1, CLASSIFICAZIONE_SON_DEEP);
            },
          });
        },

        _setMessage: function (sTitle, sText, sType, callPrev = "") {
          var self = this;
          var oBundle = self.getResourceBundle();
          var obj = {
            title: oBundle.getText(sTitle),
            onClose: function (oAction) {
              if (callPrev !== "") {
                var wizard = self.getView().byId(callPrev);
                if (wizard) {
                  wizard.previousStep();
                  self.handleButtonsVisibility(0);
                }
              }
            },
          };
          if (sType === "error")
            sap.m.MessageBox.error(oBundle.getText(sText), obj);
          else if (sType === "success")
            sap.m.MessageBox.success(oBundle.getText(sText), obj);
          else if (sType === "warning")
            sap.m.MessageBox.warning(oBundle.getText(sText), obj);
        },

        updateDataSON: function (array) {
          var self = this,
            valueProperty = null,
            dataSONModel = self.getModel(DataSON_MODEL),
            wizardModel = self.getModel(WIZARD_MODEL);

          for (let i = 0; i < array.length; i++) {
            valueProperty = wizardModel.getProperty("/" + array[i]);

            if(array[i] === "Trbtr")
              dataSONModel.setProperty("/Zimptot", valueProperty);
            
            if(array[i] === "Twaer")
              dataSONModel.setProperty("/ZimptotDivisa", valueProperty);
            
            //   Zimptot && parseFloat(Zimptot) > 0 ? "Zimptot" : "Trbtr",
            // Zimptot && parseFloat(Zimptot) > 0 ? "ZimptotDivisa" :"Twaer",

            dataSONModel.setProperty("/" + array[i], valueProperty);
          }
        },

        fiilSedeBeneficiario: function (Lifnr) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView();

          var filter = [self.setFilterEQWithKey("Lifnr", Lifnr)];

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + SedeBeneficiario_SET, {
                filters: filter,
                success: function (data, oResponse) {
                  oView.setBusy(false);

                  wizardModel.setProperty("/StrasList", data.results);
                  if (data.results.length > 0) {
                    wizardModel.setProperty(
                      "/FirstKeyStras",
                      data.results[0]["Stras"]
                    );
                    wizardModel.setProperty(
                      "/Zidsede",
                      data.results[0]["Zidsede"]
                    );
                    wizardModel.setProperty("/Ort01", data.results[0]["Ort01"]);
                    wizardModel.setProperty("/Regio", data.results[0]["Regio"]);
                    wizardModel.setProperty("/Pstlz", data.results[0]["Pstlz"]);
                    wizardModel.setProperty("/Land1", data.results[0]["Land1"]);
                    wizardModel.setProperty(
                      "/Zlocpag",
                      data.results[0].Zlocpag
                    );
                    // if(data.results[0].Regio && data.results[0].Regio !== null && data.results[0].Regio !== ""){
                    //   wizardModel.setProperty("/Zlocpag", data.results[0].Zlocpag);
                    // }
                  } else {
                    wizardModel.setProperty("/FirstKeyStras", "");
                    wizardModel.setProperty("/Zidsede", null);
                    wizardModel.setProperty("/Ort01", "");
                    wizardModel.setProperty("/Regio", "");
                    wizardModel.setProperty("/Pstlz", "");
                    wizardModel.setProperty("/Land1", "");
                  }
                },
                error: function (error) {
                  oView.setBusy(false);
                },
              });
            });
        },
        onLiveChangeStras_: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Lifnr = wizardModel.getProperty("/Lifnr"),
            StrasList = wizardModel.getProperty("/StrasList");

          var array = StrasList.filter(
            (el) => el.Stras === oEvent.getParameter("value")
          );

          if (Lifnr !== null && array.length > 0) {
            oView.setBusy(true);
            wizardModel.setProperty("/Zidsede", array[0].Zidsede);
            var path = self.getModel().createKey(SedeBeneficiario_SET, {
              Lifnr: Lifnr,
              Zidsede: array[0].Zidsede,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    wizardModel.setProperty("/Ort01", data.Ort01);
                    wizardModel.setProperty("/Regio", data.Regio);
                    wizardModel.setProperty("/Pstlz", data.Pstlz);
                    wizardModel.setProperty("/Land1", data.Land1);
                    wizardModel.setProperty("/Zlocpag", data.Zlocpag);
                    // if(data.Regio && data.Regio !== null && data.Regio !== ""){
                    //   wizardModel.setProperty("/Zlocpag", data.Zlocpag);
                    // }
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        onSubmitPayModeChange: function (oEvent) {
          var self = this,
            oDataModel = self.getModel(),
            wizardModel = self.getModel(WIZARD_MODEL),
            // ocontroller = self.getView().byId(oEvent.getParameters().id),
            ocontroller = self.getView().byId("idWizardPayMode"),
            selectedKey = ocontroller.getSelectedKey();

          if (
            selectedKey === "" ||
            wizardModel.getProperty("/Lifnr") === null ||
            wizardModel.getProperty("/Lifnr") === ""
          )
            return false;

          var path = self.getModel().createKey("ZwelsListSet", {
            Lifnr: wizardModel.getProperty("/Lifnr"),
            Zwels: selectedKey,
          });

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                success: function (data, oResponse) {
                  self.resetPayModeRelatedData();
                  wizardModel.setProperty("/PayMode", data.Zwels);
                  wizardModel.setProperty("/Banks", data.Banks);
                  wizardModel.setProperty("/Iban", data.Iban);
                  wizardModel.setProperty("/Swift", data.Swift);
                  wizardModel.setProperty("/Zcoordest", data.ZcoordEst);
                  wizardModel.setProperty("/Zcodprov", data.Zcodprov);

                  wizardModel.setProperty("/isZZcausalevalEditable", data.Banks === 'IT' ? false : true);

                  switch (data.Zwels.toUpperCase()) {
                    case "ID3":
                      wizardModel.setProperty("/isZcoordestEditable", false);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", false);
                      wizardModel.setProperty("/isBicEditable", false);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      wizardModel.setProperty("/Swift", null);
                      wizardModel.setProperty("/Iban", null);
                      break;
                    case "ID4":
                      wizardModel.setProperty("/isZcoordestEditable", false);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", true);
                      wizardModel.setProperty("/isBicEditable", false);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      wizardModel.setProperty("/Swift", null);
                      break;
                    case "ID5":
                      wizardModel.setProperty("/isZcoordestEditable", false);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", true);
                      wizardModel.setProperty("/isBicEditable", false);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      wizardModel.setProperty("/Swift", null);
                      break;
                    case "ID6":
                      wizardModel.setProperty("/isZcoordestEditable", true);
                      // wizardModel.setProperty("/isZZcausalevalEditable", true);
                      wizardModel.setProperty("/isIbanEditable", false);
                      wizardModel.setProperty("/isBicEditable", true);
                      wizardModel.setProperty("/Iban", null);
                      break;
                    case "ID10":
                      wizardModel.setProperty("/isZcoordestEditable", true);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", true);
                      wizardModel.setProperty("/isBicEditable", true);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      break;
                  }
                },
                error: function (error) {
                  self.getView().setBusy(false);
                },
              });
            });
        },

        onSubmitPayMode: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            PayMode = wizardModel.getProperty("/PayMode");

          if (PayMode.toUpperCase() === "ID6") {
            wizardModel.setProperty("/isZcoordestEditable", true);
            wizardModel.setProperty("/isZZcausalevalEditable", true);
            wizardModel.setProperty("/isIbanEditable", false);
            wizardModel.setProperty("/Iban", null);
            wizardModel.setProperty("/isBicEditable", true);
          } else {
            wizardModel.setProperty(
              "/isIbanEditable",
              PayMode.toUpperCase() === "ID3" ? false : true
            );
            wizardModel.setProperty("/isBicEditable", false);
            wizardModel.setProperty("/Iban", null);
            wizardModel.setProperty("/Swift", null);

            wizardModel.setProperty("/Zcoordest", "");
            wizardModel.setProperty("/isZcoordestEditable", false);
            wizardModel.setProperty("/ZZcausaleval", "");
            wizardModel.setProperty("/isZZcausalevalEditable", false);
          }
          self.fillBanks();
        },

        onSubmitIban: function () {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL);
          self.fillBanks();

          self.getView().setBusy(true);
          self.getBancaAccreditoIntermediario(function (callback) {
            self.getView().setBusy(false);
          });
        },

        onSubmitZcoordest: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oBundle = self.getResourceBundle(),
            oView = self.getView(),
            Zcoordest = wizardModel.getProperty("/Zcoordest"),
            Paymode = wizardModel.getProperty("/PayMode");

          if (
            !wizardModel.getProperty("/Lifnr") ||
            wizardModel.getProperty("/Lifnr") === null ||
            wizardModel.getProperty("/Lifnr") === ""
          )
            return false;

          self.fillBanks();
          if (Zcoordest) {
            oView.setBusy(true);
            var path = self.getModel().createKey(ZcoordestSet_SET, {
              Zcoordest: Zcoordest,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  urlParameters: { 
                    Lifnr: wizardModel.getProperty("/Lifnr"),
                    Zwels: Paymode
                  },
                  success: function (data, oResponse) {
                    var message =
                      oResponse.headers["sap-message"] &&
                      oResponse.headers["sap-message"] !== ""
                        ? JSON.parse(oResponse.headers["sap-message"])
                        : null;
                    if (message && message.severity === "error") {
                      sap.m.MessageBox.error(message.message, {
                        title: oBundle.getText("titleDialogError"),
                        onClose: function (oAction) {
                          return;
                        },
                      });
                    }

                    wizardModel.setProperty("/Swift", data.Swift);
                    self.getBancaAccreditoIntermediario(function (callback) {
                      oView.setBusy(false);
                    });
                  },
                  error: function (error) {
                    self.setBancaAccredito(null);
                    self.setIntermediario(null);
                    oView.setBusy(false);
                  },
                });
              });
            } else { 
              wizardModel.setProperty("/Swift", null);
              return false
            };
        },

        getBancaAccreditoIntermediario: function (callback) {
          var self = this,
            oDataModel = self.getModel(),
            wizardModel = self.getModel(WIZARD_MODEL);

          if (
            wizardModel.getProperty("/PayMode") !== "ID6" &&
            wizardModel.getProperty("/PayMode") !== "ID10"
          )
            callback(true);
          else {
            var path = self.getModel().createKey("/BancaAccreditoSet", {
              Lifnr:
                wizardModel.getProperty("/Lifnr") &&
                wizardModel.getProperty("/Lifnr") !== null
                  ? wizardModel.getProperty("/Lifnr")
                  : "",
              Zwels:
                wizardModel.getProperty("/PayMode") &&
                wizardModel.getProperty("/PayMode") !== null
                  ? wizardModel.getProperty("/PayMode")
                  : "",
              Iban:
                wizardModel.getProperty("/Iban") &&
                wizardModel.getProperty("/Iban") !== null
                  ? wizardModel.getProperty("/Iban")
                  : "",
              Zcoordest:
                wizardModel.getProperty("/Zcoordest") &&
                wizardModel.getProperty("/Zcoordest") !== null
                  ? wizardModel.getProperty("/Zcoordest")
                  : "",
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read(path, {
                  urlParameters: { $expand: "Intermediario1" },
                  success: function (data, oResponse) {
                    self.setBancaAccredito(data);
                    self.setIntermediario(data.Intermediario1);
                    callback(true);
                  },
                  error: function (error) {
                    self.setBancaAccredito(null);
                    self.setIntermediario(null);
                    callback(true);
                  },
                });
              });
          }
        },

        setBancaAccredito: function (entity) {
          var self = this;
          //Banca Accredito
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Ziban_b", entity === null ? entity : entity.Zibanb);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zbic_b", entity === null ? entity : entity.Zbicb);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zcoordest_b",
              entity === null ? entity : entity.Zcoordestb
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zdenbanca_b",
              entity === null ? entity : entity.Zdenbanca
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zclearsyst_b",
              entity === null ? entity : entity.Zclearsyst
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Stras_b", entity === null ? entity : entity.Stras);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zcivico_b",
              entity === null ? entity : entity.Zcivico
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Ort01_b", entity === null ? entity : entity.Ort01);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Regio_b", entity === null ? entity : entity.Regio);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Pstlz_b", entity === null ? entity : entity.Pstlz);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Land1_b", entity === null ? entity : entity.Land1);
        },

        setIntermediario: function (entity) {
          var self = this;
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Ziban_i", entity === null ? entity : entity.Zibani);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zbic_i", entity === null ? entity : entity.Zbici);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zcoordest_i",
              entity === null ? entity : entity.Zcoordesti
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zdenbanca_i",
              entity === null ? entity : entity.Zdenbancai
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zclearsyst_i",
              entity === null ? entity : entity.Zclearsysti
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zstras_i",
              entity === null ? entity : entity.Zstrasi
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zcivico_i",
              entity === null ? entity : entity.Zcivicoi
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zort01_i",
              entity === null ? entity : entity.Zort01i
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zregio_i",
              entity === null ? entity : entity.Zregioi
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zpstlz_i",
              entity === null ? entity : entity.Zpstlzi
            );
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty(
              "/Zland1_i",
              entity === null ? entity : entity.Zland1i
            );
        },

        onSubmitLifnr: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Lifnr = wizardModel.getProperty("/Lifnr");

          if (Lifnr && Lifnr !== null) {
            oView.setBusy(true);
            var path = self.getModel().createKey(Beneficiary_SET, {
              Lifnr: Lifnr,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    self.resetPayModeRelatedData();
                    wizardModel.setProperty("/TaxnumCf", data.TaxnumCf);
                    wizardModel.setProperty("/Taxnumxl", data.Taxnumxl);
                    wizardModel.setProperty("/NameFirst", data.NameFirst);
                    wizardModel.setProperty("/NameLast", data.NameLast);
                    wizardModel.setProperty("/ZzragSoc", data.ZzragSoc);
                    wizardModel.setProperty("/TaxnumPiva", data.TaxnumPiva);
                    wizardModel.setProperty(
                      "/Type",
                      data.Type === "1" ? true : false
                    );
                    wizardModel.setProperty("/Zsede", data.Zsede);
                    wizardModel.setProperty(
                      "/Zdenominazione",
                      data.Zdenominazione
                    );
                    wizardModel.setProperty("/Zdurc", data.Zdurc);
                    wizardModel.setProperty("/Zdstatodes", data.Zdstatodes);
                    wizardModel.setProperty("/Zdscadenza", data.Zdscadenza);
                    wizardModel.setProperty("/ZfermAmm", data.ZfermAmm);

                    self.getModalitaPagamento(Lifnr);
                    self.fiilSedeBeneficiario(Lifnr);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        getModalitaPagamento(lifnr) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView();
          oView.setBusy(true);
          var filter = [self.setFilterEQWithKey("Lifnr", lifnr)];
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/ZwelsListSet", {
                async: true,
                urlParameters: { IsDistinct: "X" },
                filters: filter,
                success: function (data, oResponse) {
                  oView.setBusy(false);
                  if (data.results.length > 0) {
                    self
                      .getView()
                      .getModel(DataSON_MODEL)
                      .setProperty("/PayMode", data.results);
                    var pay = data.results[0];

                    wizardModel.setProperty("/PayMode", pay.Zwels);
                    wizardModel.setProperty("/Banks", pay.Banks);
                    wizardModel.setProperty("/Iban", pay.Iban);
                    wizardModel.setProperty("/Swift", pay.Swift);
                    wizardModel.setProperty("/Zcoordest", pay.ZcoordEst);
                    wizardModel.setProperty("/Zcodprov", pay.Zcodprov);

                    wizardModel.setProperty("/isZZcausalevalEditable", pay.Banks === 'IT' ? false : true);

                    switch (pay.Zwels.toUpperCase()) {
                      case "ID3":
                        wizardModel.setProperty("/isZcoordestEditable", false);
                        // wizardModel.setProperty(
                        //   "/isZZcausalevalEditable",
                        //   false
                        // );
                        wizardModel.setProperty("/isIbanEditable", false);
                        wizardModel.setProperty("/isBicEditable", false);
                        wizardModel.setProperty("/ZZcausaleval", "");
                        wizardModel.setProperty("/Swift", null);
                        wizardModel.setProperty("/Iban", null);
                        break;
                      case "ID4":
                        wizardModel.setProperty("/isZcoordestEditable", false);
                        // wizardModel.setProperty(
                        //   "/isZZcausalevalEditable",
                        //   false
                        // );
                        wizardModel.setProperty("/isIbanEditable", true);
                        wizardModel.setProperty("/isBicEditable", false);
                        wizardModel.setProperty("/ZZcausaleval", "");
                        wizardModel.setProperty("/Swift", null);
                        break;
                      case "ID5":
                        wizardModel.setProperty("/isZcoordestEditable", false);
                        // wizardModel.setProperty(
                        //   "/isZZcausalevalEditable",
                        //   false
                        // );
                        wizardModel.setProperty("/isIbanEditable", true);
                        wizardModel.setProperty("/isBicEditable", false);
                        wizardModel.setProperty("/ZZcausaleval", "");
                        wizardModel.setProperty("/Swift", null);
                        break;
                      case "ID6":
                        wizardModel.setProperty("/isZcoordestEditable", true);
                        // wizardModel.setProperty(
                        //   "/isZZcausalevalEditable",
                        //   true
                        // );
                        // if (pay.Banks.toUpperCase() === "IT")
                        //   wizardModel.setProperty(
                        //     "/isZZcausalevalEditable",
                        //     false
                        //   );
                        wizardModel.setProperty("/isIbanEditable", false);
                        wizardModel.setProperty("/isBicEditable", true);
                        wizardModel.setProperty("/Iban", null);
                        break;
                      case "ID10":
                        wizardModel.setProperty("/isZcoordestEditable", true);
                        // wizardModel.setProperty(
                        //   "/isZZcausalevalEditable",
                        //   false
                        // );
                        wizardModel.setProperty("/isIbanEditable", true);
                        wizardModel.setProperty("/isBicEditable", true);
                        wizardModel.setProperty("/ZZcausaleval", "");
                        break;
                    }
                  } else {
                    self
                      .getView()
                      .getModel(DataSON_MODEL)
                      .setProperty("/PayMode", []);
                    wizardModel.setProperty("/Banks", null);
                    wizardModel.setProperty("/Iban", null);
                    wizardModel.setProperty("/Swift", null);
                    wizardModel.setProperty("/Zcoordest", null);
                    wizardModel.setProperty("/Zcodprov", null);
                    wizardModel.setProperty("/isZZcausalevalEditable", false);
                    wizardModel.setProperty("/isZcoordestEditable", false);
                    wizardModel.setProperty("/isIbanEditable", false);
                    wizardModel.setProperty("/isBicEditable", false);

                    // wizardModel.setProperty("/Banks", "");
                    // wizardModel.setProperty("/Iban", "");
                    // wizardModel.setProperty("/Swift", "");
                    // wizardModel.setProperty("/Zcoordest", "");
                    // wizardModel.setProperty("/isZZcausalevalEditable", false);
                    // wizardModel.setProperty("/isZcoordestEditable", false);
                    // wizardModel.setProperty("/isIbanEditable", false);
                    // wizardModel.setProperty("/isBicEditable", false);
                  }
                },
                error: function (error) {
                  oView.setBusy(false);
                },
              });
            });
        },

        getIban(lifnr) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView();
          oView.setBusy(true);
          var filter = [self.setFilterEQWithKey("Lifnr", lifnr)];
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + IbanBeneficiario_SET, {
                filters: filter,
                success: function (data, oResponse) {
                  oView.setBusy(false);
                  if (data.results.length > 0) {
                    wizardModel.setProperty("/Iban", data.results[0].Iban);
                  } else {
                    wizardModel.setProperty("/Iban", "");
                  }
                },
                error: function (error) {
                  oView.setBusy(false);
                },
              });
            });
        },

        fillBanks: function () {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Iban = wizardModel.getProperty("/Iban"),
            Zwels = wizardModel.getProperty("/PayMode"),
            Lifnr = wizardModel.getProperty("/Lifnr"),
            Zcoordest = wizardModel.getProperty("/Zcoordest");

            Zcoordest = !Zcoordest ? '' : Zcoordest;
            Iban = !Iban ? '' : Iban;

          if (Zwels !== null && (Iban || Zcoordest) && Lifnr !== null) {
            oView.setBusy(true);
            var path = self.getModel().createKey(ZbanksSet_SET, {
              Iban: Iban,
              Zwels: Zwels,
              Lifnr: Lifnr,
              Zcoordest: Zcoordest,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);

                    wizardModel.setProperty("/Banks", data.Banks);
                    if (data.Banks.toUpperCase() !== "IT") {
                      self
                        .getView()
                        .getModel(WIZARD_MODEL)
                        .setProperty("/isZZcausalevalEditable", true);
                      } else {
                        self
                          .getView()
                          .getModel(WIZARD_MODEL)
                          .setProperty("/isZZcausalevalEditable", false);
                        wizardModel.setProperty("/ZZcausaleval", null);
                        wizardModel.setProperty("/ZCausaleval", null);
                    }
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else {
            wizardModel.setProperty("/Banks", null);
            self
                .getView()
                .getModel(WIZARD_MODEL)
                .setProperty("/isZZcausalevalEditable", true);
            return false;
          };
        },

        resolveChecklist: function (checklist) {
          var self = this;

          for (var i = 0; i < checklist.length; i++) {
            var item = checklist[i];
            if (
              item.Zdataprot &&
              item.Zdataprot !== null &&
              item.Zdataprot !== ""
            ) {
              if (item.Zdataprot instanceof Date && !isNaN(item.Zdataprot)) {
                item.Zdataprot = self.formatter.formateDateForDeep(
                  item.Zdataprot
                );
              }
              if (item.Zdataprot.includes(".000Z")) {
                item.Zdataprot = item.Zdataprot.replace(".000Z", "");
              }
            }
            if (
              item.Zdatarichann &&
              item.Zdatarichann !== null &&
              item.Zdatarichann !== ""
            ) {
              if (
                item.Zdatarichann instanceof Date &&
                !isNaN(item.Zdatarichann)
              ) {
                item.Zdatarichann = self.formatter.formateDateForDeep(
                  item.Zdatarichann
                );
              }
              if (item.Zdatarichann.includes(".000Z")) {
                item.Zdatarichann = item.Zdatarichann.replace(".000Z", "");
              }
            }
            if (
              item.Zdatasop &&
              item.Zdatasop !== null &&
              item.Zdatasop !== ""
            ) {
              if (item.Zdatasop instanceof Date && !isNaN(item.Zdatasop)) {
                item.Zdatasop = self.formatter.formateDateForDeep(
                  item.Zdatasop
                );
              }
              if (item.Zdatasop.includes(".000Z")) {
                item.Zdatasop = item.Zdatasop.replace(".000Z", "");
              }
            }
          }
          return checklist;
        },

        onWizardNextButton: function (oEvent) {
          var self = this,
            wizardId = oEvent.getSource().data("dataWizardId"),
            wizard = self.getView().byId(wizardId),
            idStepName = wizard.getCurrentStep(),
            currentStep = self.getView().byId(idStepName);

          if (!currentStep || currentStep === null) return false;

          var stepIndex = currentStep.data("dataWizardStepIndex");
          var oNextStep = wizard.getSteps()[parseInt(stepIndex) + 1];

          if (currentStep && !currentStep.bLast) {
            wizard.goToStep(oNextStep, true);
          } else {
            wizard.nextStep();
          }

          self.handleButtonsVisibility(parseInt(stepIndex) + 1);
        },

        onWizardBackButton: function (oEvent) {
          var self = this,
            wizardId = oEvent.getSource().data("dataWizardId"),
            wizard = self.getView().byId(wizardId),
            idStepName = wizard.getCurrentStep(),
            currentStep = self.getView().byId(idStepName);

          if (!currentStep || currentStep === null) return false;

          var stepIndex = currentStep.data("dataWizardStepIndex");
          var oPrevStep = wizard.getSteps()[parseInt(stepIndex) - 1];

          if (oPrevStep) {
            wizard.previousStep();
          }

          self.handleButtonsVisibility(parseInt(stepIndex) - 1);
        },

        handleButtonsVisibility: function (index) {
          var self = this,
            oModel = self.getModel(WIZARD_MODEL);
          switch (index) {
            case 0:
              oModel.setProperty("/btnBackVisible", false);
              oModel.setProperty("/btnNextVisible", true);
              oModel.setProperty("/btnFinishVisible", false);
              break;
            case 1:
              oModel.setProperty("/btnBackVisible", true);
              oModel.setProperty("/btnNextVisible", true);
              oModel.setProperty("/btnFinishVisible", false);
              break;
            case 2:
              oModel.setProperty("/btnBackVisible", true);
              oModel.setProperty("/btnNextVisible", true);
              oModel.setProperty("/btnFinishVisible", false);
              break;
            case 3:
              oModel.setProperty("/btnBackVisible", true);
              oModel.setProperty("/btnNextVisible", false);
              oModel.setProperty("/btnFinishVisible", true);
              break;
            default:
              break;
          }
        },

        downloadFile: function (key) {
          var self = this;
          var URLHelper = mobileLibrary.URLHelper;
          URLHelper.redirect(
            "/sap/opu/odata/sap/ZS4_SOSPAUTPERMANENTE_SRV/FileSet(Key='" +
              key +
              "')/$value",
            true
          );
        },

        downloadFileFromContent: function (doc) {
          var self = this,
            blob = self.Base64toBlob(doc.Content);

          if (window.navigator && window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, doc.FileName);
          } else {
            var linkSource = "data:application/pdf;base64," + doc.Content;
            var downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = doc.FileName;
            downloadLink.click();
          }
        },

        Base64toBlob: function (
          b64Data = null,
          contentType = "application/pdf",
          sliceSize = 512
        ) {
          const byteCharacters = atob(b64Data);
          const byteArrays = [];

          for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
          ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }

          const blob = new Blob(byteArrays, { type: contentType });
          return blob;
        },

        /*WIZARD - END*/

        newAnagraficaBeneficiarioPress: function (oEvent) {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          var newAbObj = {
            countries: [],
            catsBen: [],
            provinces: [],
            Form: {
              PaeseCode: null,
              PaeseDesc: null,
              ProvinciaCode: null,
              ProvinciaDesc: null,
              CategoriaBeneficiario: null,
              RagioneSociale: null,
              Nome: null,
              Cognome: null,
              Via: null,
              Localita: null,
              Civico: null,
              Cap: null,
              SedeLegale: null,
              CodiceFiscale: null,
              PartitaIva: null,
              IdentificativoFiscaleEstero: null,
            },
          };

          self.loadABDefaultInfo(function (callback) {
            if (callback.success) {
              newAbObj.countries = callback.data.countries;
              newAbObj.catsBen = callback.data.catsBen;
              dataSonModel.setSizeLimit(1000);
              dataSonModel.setProperty("/NewAB", newAbObj);
              dataSonModel.setProperty(
                "/NewPayModeButton",
                self._resetNewModalitaPagamentoButtons()
              );

              self.getView().setBusy(false);
              var oDialog = self.openDialog(
                "gestioneabilitazioneeson.view.fragment.anagraficaBeneficiario.NewAnagraficaBeneficiario"
              );
              oDialog.open();
            } else {
              self.getView().setBusy(false);
            }
          });
        },

        loadABDefaultInfo: function (callback) {
          var self = this,
            oDataModel = self.getModel();

          var obj = {
            countries: [],
            catsBen: [],
          };

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/NabPaeseSet", {
                success: function (data, oResponse) {
                  obj.countries = data.results.length > 0 ? data.results : [];
                  oDataModel.read("/NabCategoriaBeneficiarioSet", {
                    success: function (data, oResponse) {
                      obj.catsBen = data.results.length > 0 ? data.results : [];
                      callback({ success: true, data: obj });
                    },
                    error: function (error) {
                      console.log(error); //TODO:da canc
                      callback({ success: false, data: obj });
                    },
                  });
                },
                error: function (error) {
                  console.log(error); //TODO:da canc
                  callback({ success: false, data: obj });
                },
              });
            });
        },

        onNewABPaeseChange: function (oEvent) {
          var self = this,
            oDataModel = self.getModel(),
            desc = oEvent.getParameters().value,
            oController = sap.ui.getCore().byId(oEvent.getParameters().id),
            key = oController.getSelectedKey();

          if (!key || key === null || key === "" || desc === "") {
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/provinces", null);
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/Form/PaeseDesc", null);
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/Form/PaeseCode", null);
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/Form/ProvinciaDesc", null);
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/Form/ProvinciaCode", null);
            return false;
          }

          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/PaeseDesc", desc);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/PaeseCode", key);
          var filters = [self.setFilterEQWithKey("SCountry", key)];
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/NabProvinciaSet", {
                filters: filters,
                success: function (data, oResponse) {
                  self
                    .getView()
                    .getModel(DataSON_MODEL)
                    .setProperty("/NewAB/provinces", data.results);
                  self
                    .getView()
                    .getModel(DataSON_MODEL)
                    .setProperty("/NewAB/Form/ProvinciaDesc", null);
                  self
                    .getView()
                    .getModel(DataSON_MODEL)
                    .setProperty("/NewAB/Form/ProvinciaCode", null);
                },
                error: function (error) {
                  console.log(error); //TODO:da canc
                },
              });
            });
        },

        onNewABProvinciaChange: function (oEvent) {
          var self = this,
            desc = oEvent.getParameters().value,
            oController = sap.ui.getCore().byId(oEvent.getParameters().id),
            key = oController.getSelectedKey();

          if (!key || key === null || key === "" || desc === "") {
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/Form/ProvinciaDesc", null);
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/Form/ProvinciaCode", null);
            return false;
          }
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/ProvinciaDesc", desc);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/ProvinciaCode", key);
        },

        onNewABCategoriaBeneficiarioChange: function (oEvent) {
          var self = this,
            desc = oEvent.getParameters().value,
            oController = sap.ui.getCore().byId(oEvent.getParameters().id),
            key = oController.getSelectedKey(),
            comboTipoFirma = sap.ui.getCore().byId("PagamentoTipoFirma");

          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/Nome", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/Cognome", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/RagioneSociale", null);

          if (comboTipoFirma) {
            comboTipoFirma.setSelectedKey(null);
          }

          if (!key || key === null || key === "" || desc === "") {
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewAB/Form/CategoriaBeneficiario", null);
            self
              .getView()
              .getModel(DataSON_MODEL)
              .setProperty("/NewPayMode", null);
            return false;
          }

          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NewAB/Form/CategoriaBeneficiario", key);

          var oDataModel = self.getModel(),
            dataSonModel = self.getView().getModel(DataSON_MODEL);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/NewModalitaPagamentoSet", {
                urlParameters: { SType: key },
                success: function (data, oResponse) {
                  self.getView().setBusy(false);
                  console.log(data.results);

                  dataSonModel.setProperty("/NewPayMode", data.results);
                  dataSonModel.setProperty(
                    "/NewPayModeButton",
                    self._resetNewModalitaPagamentoButtons()
                  );
                  self.setNewModalitaPagamentoModel();
                },
                error: function (error) {
                  self.getView().setBusy(false);
                },
              });
            });
        },

        newModalitaPagamentoDialogPress: function (oEvent) {
          var self = this,
            oDataModel = self.getModel(),
            wizardModel = self.getView().getModel(WIZARD_MODEL).getData(),
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          if (!wizardModel || wizardModel === null || wizardModel.Lifnr === "")
            return false;

          self.getView().setBusy(false);
          var filter = [self.setFilterEQWithKey("Lifnr", wizardModel.Lifnr)];

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/NewModalitaPagamentoSet", {
                filters: filter,
                success: function (data, oResponse) {
                  self.getView().setBusy(false);
                  console.log(data.results);

                  // if(!data || data.results.length === 0)
                  //   return;

                  dataSonModel.setProperty("/NewPayMode", data.results);
                  dataSonModel.setProperty(
                    "/NewPayModeButton",
                    self._resetNewModalitaPagamentoButtons()
                  );
                  self.setNewModalitaPagamentoModel();

                  var oDialog = self.openDialog(
                    "gestioneabilitazioneeson.view.fragment.modalitaPagamento.NewModalitaPagamento"
                  );
                  oDialog.open();
                },
                error: function (error) {
                  self.getView().setBusy(false);
                },
              });
            });
        },

        onNewModalitaPagamentoChange: function (oEvent) {
          var self = this,
            oDataModel = self.getModel(),
            dataSonModel = self.getView().getModel(DataSON_MODEL),
            oController = sap.ui.getCore().byId(oEvent.getParameters().id),
            selectedItem = oController.getSelectedKey(),
            payModeType = oController.getSelectedItem().data("payModeType"),
            comboTipoFirma = sap.ui.getCore().byId("PagamentoTipoFirma");

          if (selectedItem === "") {
            //TODO azzera il modello della new modalita pagamento
            dataSonModel.setProperty(
              "/NewPayModeButton",
              self._resetNewModalitaPagamentoButtons()
            );
            if (comboTipoFirma) {
              comboTipoFirma.setSelectedKey(null);
            }
            return false;
          }
          self.getView().setBusy(true);

          dataSonModel.setProperty(
            "/NewPayModeButton",
            self._resetNewModalitaPagamentoButtons()
          );
          if (comboTipoFirma) {
            comboTipoFirma.setSelectedKey(null);
          }

          var filter = [
            self.setFilterEQWithKey("Zwels", selectedItem),
            self.setFilterEQWithKey("Lifnr", ""),
          ];
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/ZwelsListSet", {
                filters: filter,
                success: function (data, oResponse) {
                  self.setNewModalitaPagamentoModel(payModeType);
                  if (data.results.length > 0) {
                    dataSonModel.setProperty(
                      "/NewModalitaPagamentoEntity/InizioValidita",
                      data.results[0].ValidFromDats
                    );
                    dataSonModel.setProperty(
                      "/NewModalitaPagamentoEntity/FineValidita",
                      data.results[0].ValidToDats
                    );
                    dataSonModel.setProperty(
                      "/NewModalitaPagamentoEntity/PaeseResidenza",
                      data.results[0].Banks
                    );
                  }
                  dataSonModel.setProperty(
                    "/NewModalitaPagamentoEntity/PayMode",
                    selectedItem
                  );

                  switch (selectedItem) {
                    case "ID1":
                      self.getTipoFirma(COSPR3E027_TIPOFIRMA);
                      dataSonModel.setProperty(
                        "/NewPayModeButton/IbanEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/TipoFirmaEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/btnQuietanzanteEnabled",
                        true
                      );
                      break;
                    case "ID2":
                      dataSonModel.setProperty(
                        "/NewPayModeButton/IbanEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/btnVagliaEnabled",
                        true
                      );
                      break;
                    case "ID3":
                      dataSonModel.setProperty(
                        "/NewPayModeButton/IbanEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/ContoTesoreriaEnabled",
                        true
                      );
                      break;
                    case "ID4":
                      dataSonModel.setProperty(
                        "/NewPayModeButton/IbanEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/EsercizioEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/CapoEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/CapitoloEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/ArticoloEnabled",
                        true
                      );
                      break;
                    case "ID5":
                      dataSonModel.setProperty(
                        "/NewPayModeButton/IbanEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/PaeseResidenzaEnabled",
                        true
                      );
                      break;
                    case "ID6":
                      dataSonModel.setProperty(
                        "/NewPayModeButton/PaeseResidenzaEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/BicEnabled",
                        true
                      );
                      dataSonModel.setProperty(
                        "/NewPayModeButton/CoordinateEstereEnabled",
                        true
                      );
                      break;
                    default:
                      dataSonModel.setProperty(
                        "/NewPayModeButton",
                        self._resetNewModalitaPagamentoButtons()
                      );
                      console.log("default");
                      break;
                  }
                  self.getView().setBusy(false);
                },
                error: function (error) {
                  console.log(error);
                  self.getView().setBusy(false);
                },
              });
            });
        },

        setNewModalitaPagamentoModel: function (type = null) {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          var obj = {
            PayMode: null,
            PayModeType: type,
            Iban: null,
            PaeseResidenza: null,
            TipoFirma: null,
            Bic: null,
            CoordinateEstere: null,
            InizioValidita: null,
            FineValidita: null,
            Esercizio: null,
            Capo: null,
            Capitolo: null,
            Articolo: null,
            ContoTesoreria: null,
            ContoTesoreriaDescrizione: null,
            // Gestione Vaglia
            VCognome: null,
            VNome: null,
            VCodiceFiscale: null,
            VQualifica: null,
            VDataNascita: null,
            VLuogoNascita: null,
            VProvinciaNascita: null,
            VIndirizzo: null,
            VCitta: null,
            VCap: null,
            VProvinciaResidenza: null,
            VTelefono: null,
            //Gestione quietanzante
            QCognome: null,
            QNome: null,
            QCodiceFiscale: null,
            QQualifica: null,
            QDataNascita: null,
            QLuogoNascita: null,
            QProvinciaNascita: null,
            QIndirizzo: null,
            QCitta: null,
            QCap: null,
            QProvinciaResidenza: null,
            QTelefono: null,
          };

          dataSonModel.setProperty("/NewModalitaPagamentoEntity", obj);
        },

        onNewTipoFirmaChange: function (oEvent) {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL),
            oController = sap.ui.getCore().byId(oEvent.getParameters().id),
            selectedKey = oController.getSelectedKey();
          dataSonModel.setProperty(
            "/NewModalitaPagamentoEntity/TipoFirma",
            selectedKey
          );
        },

        getPayModeByLifnr: function (
          lifnr,
          zwels,
          IsDistinct = false,
          callback
        ) {
          var self = this,
            oDataModel = self.getModel();
          if (!lifnr || lifnr === null || lifnr === "") return false;

          var filter = [];
          filter.push(
            new sap.ui.model.Filter(
              "Lifnr",
              sap.ui.model.FilterOperator.EQ,
              lifnr
            )
          );
          if (zwels !== "") {
            filter.push(
              new sap.ui.model.Filter(
                "Zwels",
                sap.ui.model.FilterOperator.EQ,
                zwels
              )
            );
          }

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/ZwelsListSet", {
                async: true,
                urlParameters: { IsDistinct: IsDistinct ? "X" : "" },
                filters: filter,
                success: function (data, oResponse) {
                  //console.log(data.results); //TODO:da canc
                  return callback({ data: data.results, error: false });
                },
                error: function (error) {
                  console.log(error);
                  return callback({ data: error, error: true });
                },
              });
            });
        },

        getTipoFirma: function (name) {
          var self = this,
            oDataModel = self.getModel(),
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          self.getView().setBusy(true);
          var filter = [self.setFilterEQWithKey("Name", name)];
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/ZtipofirmaMcSet", {
                filters: filter,
                success: function (data, oResponse) {
                  self.getView().setBusy(false);
                  dataSonModel.setProperty(
                    "/NewPayModeTipoFirma",
                    data.results
                  );
                },
                error: function (error) {
                  console.log(error);
                  self.getView().setBusy(false);
                },
              });
            });
        },

        _resetNewModalitaPagamentoButtons: function () {
          var self = this;
          return {
            MainMaskVisible: true,
            VagliaMaskVisible: false,
            QuietanzanteMaskVisible: false,
            btnVagliaVisible: true,
            btnQuietanzanteVisible: true,
            IbanEnabled: false,
            BicEnabled: false,
            EsercizioEnabled: false,
            ContoTesoreriaEnabled: false,
            PaeseResidenzaEnabled: false,
            CoordinateEstereEnabled: false,
            CapoEnabled: false,
            TipoFirmaEnabled: false,
            CapitoloEnabled: false,
            ArticoloEnabled: false,
            btnVagliaEnabled: false,
            btnQuietanzanteEnabled: false,
          };
        },

        onNewVaglia: function () {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          dataSonModel.setProperty("/NewPayModeButton/VagliaMaskVisible", true);
          dataSonModel.setProperty("/NewPayModeButton/MainMaskVisible", false);
          dataSonModel.setProperty("/NewPayModeButton/btnVagliaVisible", false);
          dataSonModel.setProperty(
            "/NewPayModeButton/btnQuietanzanteVisible",
            false
          );
          return;
        },

        onNewModalitaPagamentoSave: function (oEvent) {
          var self = this,
            exit = false,
            oDataModel = self.getModel(),
            oBundle = self.getResourceBundle(),
            dataSonModel = self.getView().getModel(DataSON_MODEL),
            wizardModel = self.getView().getModel(WIZARD_MODEL),
            entity = !dataSonModel.getProperty("/NewModalitaPagamentoEntity")
              ? null
              : dataSonModel.getProperty("/NewModalitaPagamentoEntity");

          if (!entity || entity === null) {
            return false;
          }

          if (!entity.PayMode || entity.PayMode === "") return false;

          var selectedItem = dataSonModel.getProperty(
            "/NewModalitaPagamentoEntity/PayMode"
          );

          switch (selectedItem) {
            case "ID1":
              if (
                !entity.TipoFirma ||
                entity.TipoFirma === null ||
                entity.TipoFirma === ""
              ) {
                exit = true;
                sap.m.MessageBox.warning("Tipo firma obbligatorio", {
                  title: oBundle.getText("titleDialogWarning"),
                  onClose: function (oAction) {},
                });
              }

              if (
                entity.PayModeType === S_TYPE_2 &&
                (entity.QNome === null ||
                  entity.QNome === "" ||
                  entity.QCognome === null ||
                  entity.QCognome === "")
              ) {
                exit = true;
                sap.m.MessageBox.warning(
                  "Inserire almeno un quietanzante (Cognome e nome obbligatori)",
                  {
                    title: oBundle.getText("titleDialogWarning"),
                    onClose: function (oAction) {},
                  }
                );
              }
              break;
            case "ID6":
              if (
                !entity.CoordinateEstere ||
                entity.CoordinateEstere === null ||
                entity.CoordinateEstere === ""
              ) {
                exit = true;
                sap.m.MessageBox.warning("Coordinate estere obbligatorio", {
                  title: oBundle.getText("titleDialogWarning"),
                  onClose: function (oAction) {},
                });
              }
              if (
                !entity.VCognome ||
                entity.VCognome === null ||
                entity.VCognome === "" ||
                !entity.VNome ||
                entity.VNome === null ||
                entity.VNome === "" ||
                !entity.VIndirizzo ||
                entity.VIndirizzo === null ||
                entity.VIndirizzo === "" ||
                !entity.VCitta ||
                entity.VCitta === null ||
                entity.VCitta === "" ||
                !entity.VCap ||
                entity.VCap === null ||
                entity.VCap === "" ||
                !entity.VProvinciaResidenza ||
                entity.VProvinciaResidenza === null ||
                entity.VProvinciaResidenza === ""
              ) {
                exit = true;
                sap.m.MessageBox.warning(
                  "Destinatario Vaglia: inserire i campi obbligatori",
                  {
                    title: oBundle.getText("titleDialogWarning"),
                    onClose: function (oAction) {},
                  }
                );
              }

            default:
              console.log("default");
          }

          if (exit) return;

          self.getView().setBusy(true);
          var entityRequest = self.getEntityModalitaPagamento(
            entity,
            wizardModel.getProperty("/Lifnr")
          );
          // var entityRequest = {
          //   Beneficiario: wizardModel.getProperty("/Lifnr"),
          //   ModPagamento:entity.PayMode,
          //   TipoBeneficiario:entity.PayModeType,
          //   DatiPagamento:{
          //     Iban: entity.Iban ? entity.Iban : null,
          //     PaeseResidenza: entity.PaeseResidenza ? entity.PaeseResidenza : null,
          //     TipoFirma: entity.TipoFirma ? entity.TipoFirma : null,
          //     Bic: entity.Bic ? entity.Bic : null,
          //     CoordinateEstere: entity.CoordinateEstere ? entity.CoordinateEstere : null,
          //     InizioValidita: entity.InizioValidita ? self.formatter.formateDateForDeep(entity.InizioValidita): null,
          //     FineValidita: entity.FineValidita ? self.formatter.formateDateForDeep(entity.FineValidita): null,
          //     Esercizio: entity.Esercizio ? entity.Esercizio : null,
          //     Capo: entity.Capo ? entity.Capo : null,
          //     Capitolo: entity.Capitolo ? entity.Capitolo : null,
          //     Articolo: entity.Articolo ? entity.Articolo : null,
          //   },
          //   Quietanzante:{
          //     Nome: entity.QNome ? entity.QNome : null,
          //     Cognome: entity.QCognome ? entity.QCognome : null,
          //     Qualifica: entity.QQualifica ? entity.QQualifica : null,
          //     CodiceFiscale: entity.QCodiceFiscale ? entity.QCodiceFiscale : null,
          //     DataNascita: entity.QDataNascita ? self.formatter.formateDateForDeep(entity.QDataNascita): null,
          //     LuogoNascita: entity.QLuogoNascita ? entity.QLuogoNascita : null,
          //     ProvinciaNascita: entity.QProvinciaNascita ? entity.QProvinciaNascita : null,
          //     Indirizzo: entity.QIndirizzo ? entity.QIndirizzo : null,
          //     Citta: entity.QCitta ? entity.QCitta : null,
          //     Cap: entity.QCap ? entity.QCap : null,
          //     ProvinciaResidenza: entity.QProvinciaResidenza ? entity.QProvinciaResidenza : null,
          //     Telefono: entity.QTelefono ? entity.QTelefono : null
          //   },
          //   DestinatarioVaglia:{
          //     Nome: entity.VNome ? entity.VNome : null,
          //     Cognome: entity.VCognome ? entity.VCognome : null,
          //     Qualifica: entity.VQualifica ? entity.VQualifica : null,
          //     CodiceFiscale: entity.VCodiceFiscale ? entity.VCodiceFiscale : null,
          //     DataNascita: entity.VDataNascita ? self.formatter.formateDateForDeep(entity.VDataNascita): null,
          //     LuogoNascita: entity.VLuogoNascita ? entity.VLuogoNascita : null,
          //     ProvinciaNascita: entity.VProvinciaNascita ? entity.VProvinciaNascita : null,
          //     Indirizzo: entity.VIndirizzo ? entity.QIndirizzo : null,
          //     Citta: entity.VCitta ? entity.VCitta : null,
          //     Cap: entity.VCap ? entity.VCap : null,
          //     ProvinciaResidenza: entity.VProvinciaResidenza ? entity.VProvinciaResidenza : null,
          //     Telefono: entity.VTelefono ? entity.VTelefono : null
          //   }
          // }
          console.log(entityRequest);
          oDataModel.create("/ModalitaPagamentoSet", entityRequest, {
            success: function (data, oResponse) {
              self.getView().setBusy(false);
              var message = JSON.parse(oResponse.headers["sap-message"]);
              if (message.severity === "error") {
                sap.m.MessageBox.error(message.message, {
                  title: oBundle.getText("titleDialogError"),
                  onClose: function (oAction) {
                    return;
                  },
                });
              } else {
                sap.m.MessageBox.success(message.message, {
                  title: oBundle.getText("titleDialogSuccess"),
                  onClose: function (oAction) {
                    self.getModalitaPagamento(
                      wizardModel.getProperty("/Lifnr")
                    );
                    setTimeout(() => {
                      self.fiilSedeBeneficiario(
                        wizardModel.getProperty("/Lifnr")
                      );
                      wizardModel.setProperty("/PayMode", entity.PayMode);
                      self.onCloseNewModalitaPagamento();
                    }, 2000);
                  },
                });
              }

              console.log(data);
              console.log(oResponse);
            },
            error: function (err) {
              console.log(err);
              self.getView().setBusy(false);
            },
            async: true,
            urlParameters: {},
          });
        },

        onNewQuietanzante: function () {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          dataSonModel.setProperty(
            "/NewPayModeButton/QuietanzanteMaskVisible",
            true
          );
          dataSonModel.setProperty("/NewPayModeButton/MainMaskVisible", false);
          dataSonModel.setProperty("/NewPayModeButton/btnVagliaVisible", false);
          dataSonModel.setProperty(
            "/NewPayModeButton/btnQuietanzanteVisible",
            false
          );
          return;
        },

        onCloseNewModalitaPagamento: function () {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          if (dataSonModel.getData().NewPayModeButton.VagliaMaskVisible) {
            dataSonModel.setProperty(
              "/NewPayModeButton/VagliaMaskVisible",
              false
            );
            dataSonModel.setProperty("/NewPayModeButton/MainMaskVisible", true);
            dataSonModel.setProperty(
              "/NewPayModeButton/btnVagliaVisible",
              true
            );
            dataSonModel.setProperty(
              "/NewPayModeButton/btnQuietanzanteVisible",
              true
            );
            return;
          }

          if (dataSonModel.getData().NewPayModeButton.QuietanzanteMaskVisible) {
            dataSonModel.setProperty(
              "/NewPayModeButton/QuietanzanteMaskVisible",
              false
            );
            dataSonModel.setProperty("/NewPayModeButton/MainMaskVisible", true);
            dataSonModel.setProperty(
              "/NewPayModeButton/btnVagliaVisible",
              true
            );
            dataSonModel.setProperty(
              "/NewPayModeButton/btnQuietanzanteVisible",
              true
            );
            return;
          }

          dataSonModel.setProperty("/NewModalitaPagamentoEntity", null);
          dataSonModel.setProperty("/NewPayMode", []);
          dataSonModel.setProperty("/NewPayModeTipoFirma", []);
          dataSonModel.setProperty("/NewPayModeButton", null);
          var oDialgoNewModalitaPagamento = sap.ui
            .getCore()
            .byId("dlgNewModalitaPagamento");
          oDialgoNewModalitaPagamento.close();
          self.getView().setBusy(false);
          self.closeDialog();
        },

        /* ANAGRAFICA BENEFICIARIO - START */
        onCloseNewAnagraficaBeneficiario: function (oEvent) {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          if (dataSonModel.getData().NewPayModeButton.VagliaMaskVisible) {
            dataSonModel.setProperty(
              "/NewPayModeButton/VagliaMaskVisible",
              false
            );
            dataSonModel.setProperty("/NewPayModeButton/MainMaskVisible", true);
            dataSonModel.setProperty(
              "/NewPayModeButton/btnVagliaVisible",
              true
            );
            dataSonModel.setProperty(
              "/NewPayModeButton/btnQuietanzanteVisible",
              true
            );
            return;
          }

          if (dataSonModel.getData().NewPayModeButton.QuietanzanteMaskVisible) {
            dataSonModel.setProperty(
              "/NewPayModeButton/QuietanzanteMaskVisible",
              false
            );
            dataSonModel.setProperty("/NewPayModeButton/MainMaskVisible", true);
            dataSonModel.setProperty(
              "/NewPayModeButton/btnVagliaVisible",
              true
            );
            dataSonModel.setProperty(
              "/NewPayModeButton/btnQuietanzanteVisible",
              true
            );
            return;
          }
          dataSonModel.setProperty("/NewModalitaPagamentoEntity", null);
          dataSonModel.setProperty("/NewPayMode", []);
          dataSonModel.setProperty("/NewPayModeTipoFirma", []);
          dataSonModel.setProperty("/NewPayModeButton", null);
          dataSonModel.setProperty("/NewABLifnr", null);
          var oDialog = sap.ui.getCore().byId("dlgNewAnagraficaBeneficiario");
          oDialog.close();
          self.getView().setBusy(false);
          self.closeDialog();
        },

        validateModalitaPagamento: function (entity) {
          var self = this,
            dataSonModel = self.getView().getModel(DataSON_MODEL);

          var selectedItem = dataSonModel.getProperty(
            "/NewModalitaPagamentoEntity/PayMode"
          );
          switch (selectedItem) {
            case "ID1":
              if (
                !entity.TipoFirma ||
                entity.TipoFirma === null ||
                entity.TipoFirma === ""
              ) {
                return { success: false, message: "Tipo firma obbligatorio" };
              }

              if (
                entity.PayModeType === S_TYPE_2 &&
                (entity.QNome === null ||
                  entity.QNome === "" ||
                  entity.QCognome === null ||
                  entity.QCognome === "")
              ) {
                return {
                  success: false,
                  message:
                    "Inserire almeno un quietanzante (Cognome e nome obbligatori)",
                };
              }
              break;
            case "ID6":
              if (
                !entity.CoordinateEstere ||
                entity.CoordinateEstere === null ||
                entity.CoordinateEstere === ""
              ) {
                return {
                  success: false,
                  message: "Coordinate estere obbligatorio",
                };
              }
              if (
                !entity.VCognome ||
                entity.VCognome === null ||
                entity.VCognome === "" ||
                !entity.VNome ||
                entity.VNome === null ||
                entity.VNome === "" ||
                !entity.VIndirizzo ||
                entity.VIndirizzo === null ||
                entity.VIndirizzo === "" ||
                !entity.VCitta ||
                entity.VCitta === null ||
                entity.VCitta === "" ||
                !entity.VCap ||
                entity.VCap === null ||
                entity.VCap === "" ||
                !entity.VProvinciaResidenza ||
                entity.VProvinciaResidenza === null ||
                entity.VProvinciaResidenza === ""
              ) {
                return {
                  success: false,
                  message: "Destinatario Vaglia: inserire i campi obbligatori",
                };
              }
            default:
              console.log("default");
          }
          return { success: true };
        },

        ktm: function (oEvent) {
          var self = this;
        },

        onNewAnagraficaBeneficiarioSave: function (oEvent) {
          var self = this,
            oBundle = self.getResourceBundle(),
            dataSonModel = self.getView().getModel(DataSON_MODEL),
            entity = !dataSonModel.getProperty("/NewModalitaPagamentoEntity")
              ? null
              : dataSonModel.getProperty("/NewModalitaPagamentoEntity"),
            form = self
              .getView()
              .getModel(DataSON_MODEL)
              .getProperty("/NewAB/Form");

          // DataModel>/NewAB/Form/SedeLegale
          // ;

          if (
            !entity ||
            entity === null ||
            !entity.PayMode ||
            entity.PayMode === ""
          ) {
            sap.m.MessageBox.error("Modalità di pagamento obbligatoria", {
              title: oBundle.getText("titleDialogWarning"),
              onClose: function (oAction) {
                return;
              },
            });
            return;
          }

          var validate = self.validateModalitaPagamento(entity);
          if (!validate.success) {
            sap.m.MessageBox.error(validate.message, {
              title: oBundle.getText("titleDialogWarning"),
              onClose: function (oAction) {
                return;
              },
            });
            return;
          }

          self.getView().setBusy(true);

          var benx =
            self.getView().getModel(DataSON_MODEL).getProperty("/NewABLifnr") &&
            self
              .getView()
              .getModel(DataSON_MODEL)
              .getProperty("/NewABLifnr") !== null &&
            self
              .getView()
              .getModel(DataSON_MODEL)
              .getProperty("/NewABLifnr") !== ""
              ? self
                  .getView()
                  .getModel(DataSON_MODEL)
                  .getProperty("/NewABLifnr")
              : "FITTIZIO";

          var anagraficaBeneficiario = {
            Beneficiario: benx,
            Paese: form.PaeseCode,
            Categoria: form.CategoriaBeneficiario,
            RagioneSociale: form.RagioneSociale,
            Nome: form.Nome,
            Cognome: form.Cognome,
            Via: form.Via,
            NumeroCivico: form.Civico,
            Localita: form.Localita,
            Provincia: form.ProvinciaCode,
            Cap: form.Cap,
            SedeLegale: form.SedeLegale ? "X" : "",
            CodiceFiscale: form.CodiceFiscale,
            PartitaIva: form.PartitaIva,
            IdFiscaleEstero: form.IdentificativoFiscaleEstero,
            BypassSife: null,
          };

          console.log(anagraficaBeneficiario); //TODO:da canc
          self._callSaveOnAnagraficaBeneficiario(
            anagraficaBeneficiario,
            function (callback) {
              if (!callback.success) {
                // C'è STATO UN PROBLEMA
                console.log(callback.message); //TODO:da canc
                self.getView().setBusy(false);
                sap.m.MessageBox.error(callback.message, {
                  title: oBundle.getText("titleDialogError"),
                  onClose: function (oAction) {
                    return;
                  },
                });
              } else {
                if (callback.SifeKO) {
                  // OK MA ERRORE SIFE
                  entityRequest.BypassSife = "X";
                  self._callSaveOnAnagraficaBeneficiario(
                    entityRequest,
                    function (callback) {
                      if (!callback.success) {
                        self.getView().setBusy(false);
                        console.log(callback.message); //TODO:da canc
                        sap.m.MessageBox.error(callback.message, {
                          title: oBundle.getText("titleDialogError"),
                          onClose: function (oAction) {
                            return;
                          },
                        });
                      } else {
                        //dovrebbe essere andato tutto ok
                        self.getView().setBusy(false);
                        console.log(callback.message);
                        switch (callback.severity) {
                          case "Error":
                            sap.m.MessageBox.error(callback.message, {
                              title: oBundle.getText("titleDialogError"),
                              onClose: function (oAction) {
                                return;
                              },
                            });
                            break;
                          case "Warning":
                            sap.m.MessageBox.warning(callback.message, {
                              title: oBundle.getText("titleDialogWarning"),
                              onClose: function (oAction) {
                                return;
                              },
                            });
                            break;
                          case "Success":
                            sap.m.MessageBox.success(callback.message, {
                              title: oBundle.getText("titleDialogSuccess"),
                              onClose: function (oAction) {
                                return;
                              },
                            });
                            break;
                        }
                      }
                    }
                  );
                } else {
                  // dovrebbe essere andato tutto ok
                  self.getView().setBusy(false);
                  console.log(callback.message); //TODO:da canc
                  switch (callback.severity) {
                    case "Error":
                      sap.m.MessageBox.error(callback.message, {
                        title: oBundle.getText("titleDialogError"),
                        onClose: function (oAction) {
                          return;
                        },
                      });
                      break;
                    case "Warning":
                      sap.m.MessageBox.warning(callback.message, {
                        title: oBundle.getText("titleDialogWarning"),
                        onClose: function (oAction) {
                          return;
                        },
                      });
                      break;
                    case "Success":
                      sap.m.MessageBox.success(callback.message, {
                        title: oBundle.getText("titleDialogSuccess"),
                        onClose: function (oAction) {
                          return;
                        },
                      });
                      break;
                  }
                }
              }
            }
          );
        },

        _callSaveOnAnagraficaBeneficiario: function (entityRequest, callback) {
          var self = this,
            oDataModel = self.getModel();

          oDataModel.create("/AnagraficaBeneficiarioSet", entityRequest, {
            success: function (data, oResponse) {
              var sapMessage = JSON.parse(oResponse.headers["sap-message"]);
              if (sapMessage.severity.toUpperCase() === "WARNING")
                callback({
                  success: true,
                  SifeKO: true,
                  message: sapMessage.message,
                });
              else if (sapMessage.severity.toUpperCase() === "ERROR")
                callback({ success: false, message: sapMessage.message });
              else {
                if (data.Beneficiario !== "") {
                  self
                    .getView()
                    .getModel(DataSON_MODEL)
                    .setProperty("/NewABLifnr", data.beneficiario);
                  var mex =
                    "Benificiario " +
                    data.Beneficiario.ToString() +
                    " creato correttamente!";
                  var entityModalitaPagamento = self.getEntityModalitaPagamento(
                    entity,
                    data.Beneficiario
                  );
                  oDataModel.create(
                    "/ModalitaPagamentoSet",
                    entityModalitaPagamento,
                    {
                      success: function (data, oResponse) {
                        var message = JSON.parse(
                          oResponse.headers["sap-message"]
                        );
                        if (message.severity === "error") {
                          mex =
                            mex +
                            "\nCreazione modalità di pagamento non riuscita!";
                          callback({
                            success: true,
                            message: mex,
                            severity: "Warning",
                          });
                        } else {
                          mex =
                            mex +
                            "\nModalità di pagamento creata correttamente";
                          callback({
                            success: true,
                            message: mex,
                            severity: "Success",
                          });
                        }
                      },
                      error: function (err) {
                        console.log(err); //TODO:da canc
                        mex = mex + "\nErrore nella modalità di pagamento!";
                        callback({
                          success: true,
                          message: mex,
                          severity: "Error",
                        });
                      },
                      async: true,
                    }
                  );
                }
              }
            },
            error: function (err) {
              console.log(err);
              // self.getView().setBusy(false);
            },
            async: true,
          });
        },

        getEntityModalitaPagamento(entity, lifnr) {
          var self = this;
          return {
            Beneficiario: lifnr,
            ModPagamento: entity.PayMode,
            TipoBeneficiario: entity.PayModeType,
            DatiPagamento: {
              Iban: entity.Iban ? entity.Iban : null,
              PaeseResidenza: entity.PaeseResidenza
                ? entity.PaeseResidenza
                : null,
              TipoFirma: entity.TipoFirma ? entity.TipoFirma : null,
              Bic: entity.Bic ? entity.Bic : null,
              CoordinateEstere: entity.CoordinateEstere
                ? entity.CoordinateEstere
                : null,
              InizioValidita: entity.InizioValidita
                ? self.formatter.formateDateForDeep(entity.InizioValidita)
                : null,
              FineValidita: entity.FineValidita
                ? self.formatter.formateDateForDeep(entity.FineValidita)
                : null,
              Esercizio: entity.Esercizio ? entity.Esercizio : null,
              Capo: entity.Capo ? entity.Capo : null,
              Capitolo: entity.Capitolo ? entity.Capitolo : null,
              Articolo: entity.Articolo ? entity.Articolo : null,
            },
            Quietanzante: {
              Nome: entity.QNome ? entity.QNome : null,
              Cognome: entity.QCognome ? entity.QCognome : null,
              Qualifica: entity.QQualifica ? entity.QQualifica : null,
              CodiceFiscale: entity.QCodiceFiscale
                ? entity.QCodiceFiscale
                : null,
              DataNascita: entity.QDataNascita
                ? self.formatter.formateDateForDeep(entity.QDataNascita)
                : null,
              LuogoNascita: entity.QLuogoNascita ? entity.QLuogoNascita : null,
              ProvinciaNascita: entity.QProvinciaNascita
                ? entity.QProvinciaNascita
                : null,
              Indirizzo: entity.QIndirizzo ? entity.QIndirizzo : null,
              Citta: entity.QCitta ? entity.QCitta : null,
              Cap: entity.QCap ? entity.QCap : null,
              ProvinciaResidenza: entity.QProvinciaResidenza
                ? entity.QProvinciaResidenza
                : null,
              Telefono: entity.QTelefono ? entity.QTelefono : null,
            },
            DestinatarioVaglia: {
              Nome: entity.VNome ? entity.VNome : null,
              Cognome: entity.VCognome ? entity.VCognome : null,
              Qualifica: entity.VQualifica ? entity.VQualifica : null,
              CodiceFiscale: entity.VCodiceFiscale
                ? entity.VCodiceFiscale
                : null,
              DataNascita: entity.VDataNascita
                ? self.formatter.formateDateForDeep(entity.VDataNascita)
                : null,
              LuogoNascita: entity.VLuogoNascita ? entity.VLuogoNascita : null,
              ProvinciaNascita: entity.VProvinciaNascita
                ? entity.VProvinciaNascita
                : null,
              Indirizzo: entity.VIndirizzo ? entity.QIndirizzo : null,
              Citta: entity.VCitta ? entity.VCitta : null,
              Cap: entity.VCap ? entity.VCap : null,
              ProvinciaResidenza: entity.VProvinciaResidenza
                ? entity.VProvinciaResidenza
                : null,
              Telefono: entity.VTelefono ? entity.VTelefono : null,
            },
          };
        },

        /* ANAGRAFICA BENEFICIARIO - END */

        strutturaAmministrativaLiveChangeHeaderActionModel: function (oEvent) {
          var self = this;
          self
            .getView()
            .getModel("headerActionModel")
            .setProperty("/Zcdr", oEvent.getParameters().value);
        },

        /*REFactoring */
        loadWizardModel() {
          return {
            viewName: null,
            viewId:null,
            btnBackVisible: false,
            btnNextVisible: true,
            btnFinishVisible: false,
            isInChange: false,
            Step3TableTitle: null,
            Bukrs: null,
            Zchiavesop: null,
            Ztipososp: null,
            Zstep: null,
            Zzamministr: null,
            Zchiaveopi: null,
            //step4
            ZE2e: null,
            Zcausale: null,
            Znumprot: null,
            Zdataprot: null,
            Zlocpag: null,
            Zzonaint: null,
            StrasList: null,
            FirstKeyStras: null,
            Zidsede: null,
            Ort01: null,
            Regio: null,
            Pstlz: null,
            Land1: null,
            //step3
            Zimptotcos: null,

            Zimpcos: null,
            Zcos: null,
            //step1
            Gjahr: null,
            ZufficioCont: null,
            ZvimDescrufficio: null,
            Zdesctipodisp3: null,
            Ztipodisp3: null,
            Ztipodisp3List: null,
            FiposList: null,
            Fipos: null,
            Fistl: null,
            Kostl: null,
            Ltext: null,
            Skat: null,
            Saknr: null,
            Hkont: null,
            Zimptot: null,
            ZimptotDivisa: null,
            Trbtr: null,
            Twaer: null,
            //step2
            Lifnr: null,
            TaxnumCf: null,
            NameFirst: null,
            ZzragSoc: null,
            Zsede: null,
            Type: true, //radio btn
            Taxnumxl: null,
            NameLast: null,
            TaxnumPiva: null,
            Zdenominazione: null,
            Banks: null,
            Iban: null,
            Zcoordest: null,
            isZcoordestEditable: false,
            isZZcausalevalEditable: false,
            isIbanEditable: false,
            isBicEditable: false,
            Swift: null,
            PayMode: null,
            ZZcausaleval: null,
            Zwels: null,
            ZCausaleval: null,
            Zflagfrutt: null,
            Zpurpose: null,
            Zalias: null,

            //sezione Versante
            Zcodprov: null,
            Zcodvers: null,
            Zcfcommit: null,
            Zcfvers: null,
            Zcodtrib: null,
            Zperiodrifda: null,
            Zperiodrifa: null,
            Zcodinps: null,
            Zdescvers: null,
            Zdatavers: null,
            Zsedevers: null,
            Zprovvers: null,

            //Banca Accredito
            Ziban_b: null,
            Zbic_b: null,
            Zcoordest_b: null,
            Zdenbanca_b: null,
            Zclearsyst_b: null,
            Stras_b: null,
            Zcivico_b: null,
            Ort01_b: null,
            Regio_b: null,
            Pstlz_b: null,
            Land1_b: null,

            //Intermediario1
            Ziban_i: null,
            Zbic_i: null,
            Zcoordest_i: null,
            Zdenbanca_i: null,
            Zclearsyst_i: null,
            Zstras_i: null,
            Zcivico_i: null,
            Zort01_i: null,
            Zregio_i: null,
            Zpstlz_i: null,
            Zland1_i: null,

            //Intermediario2
            Ziban2: null,
            Zbic2: null,
            Zcoordest2: null,
            Zdenbanca2: null,
            Zclearsyst2: null,
            Zstras2: null,
            Zcivico2: null,
            Zort012: null,
            Zregio2: null,
            Zpstlz2: null,
            Zland12: null,
          };
        },

        loadDataSONModel: function () {
          return {
            ZstatoSop: null,
            Gjahr: null,
            ZufficioCont: null,
            Zdesctipodisp3: null,
            FiposList: null,
            Fipos: null,
            Fistl: null,
            Kostl: null,
            Saknr: null,
            Lifnr: null,
            NameFirst: null,
            NameLast: null,
            Zimptot: null,
            TaxnumPiva: null,
            ZzragSoc: null,
            ZimptotDivisa: null,
            TaxnumCf: null,
            Zzamministr: null,
            PayMode: [],
            NewPayMode: [],
            FlagFruttifero: [],
            PosizioneFinanziaria:[],
            StruttAmministrativa:[]
          };
        },

        resetWizardModel: function () {
          var self = this;
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/isInChange", false);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/viewId", null);  
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/viewName", null);  
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Step3TableTitle", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Bukrs", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zchiavesop", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zstep", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ztipososp", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zzamministr", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zchiaveopi", null);

          //step4
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZE2e", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcausale", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Znumprot", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdataprot", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zlocpag", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zzonaint", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/StrasList", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/FirstKeyStras", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zidsede", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ort01", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Regio", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Pstlz", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Land1", null);
          //step3
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zimptotcos", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zimpcos", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcos", null);
          //step1
          self.getView().getModel(WIZARD_MODEL).setProperty("/Gjahr", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/ZufficioCont", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/ZvimDescrufficio", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zdesctipodisp3", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Ztipodisp3", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Ztipodisp3List", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/FiposList", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Fipos", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Fistl", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Kostl", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ltext", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Skat", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Saknr", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zimptot", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/ZimptotDivisa", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Trbtr", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Twaer", null);
          //step2
          self.getView().getModel(WIZARD_MODEL).setProperty("/Lifnr", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/TaxnumCf", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/NameFirst", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZzragSoc", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zsede", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Type", true); //radio btn
          self.getView().getModel(WIZARD_MODEL).setProperty("/Taxnumxl", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/NameLast", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdurc", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdstatodes", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdscadenza", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZfermAmm", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/TaxnumPiva", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zdenominazione", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Banks", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Iban", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcoordest", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/isZcoordestEditable", false);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/isZZcausalevalEditable", false);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/isIbanEditable", false);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/isBicEditable", false);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Swift", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/PayMode", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/ZZcausaleval", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zwels", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/ZCausaleval", null);

          //nuovi Modalità pagamento
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zalias", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/AccTypeId", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/RegioSosp", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZaccText", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zzposfinent", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zpurpose", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcausben", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zflagfrutt", null);

          //sezione Versante
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcodprov", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcodvers", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcfcommit", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcfvers", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcodtrib", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zperiodrifda", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zperiodrifa", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcodinps", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdescvers", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdatavers", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zsedevers", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zprovvers", null);

          //Banca Accredito
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ziban_b", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zbic_b", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zcoordest_b", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zdenbanca_b", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zclearsyst_b ", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Stras_b", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcivico_b", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ort01_b", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Regio_b", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Pstlz_b", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Land1_b", null);

          //Intermediario1
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ziban_i", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zbic_i", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zcoordest_i", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zdenbanca_i", null);
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/Zclearsyst_i", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zstras_i", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcivico_i", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zort01_i", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zregio_i", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zpstlz_i", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zland1_i", null);

          //Intermediario 2
          var oModelWizard = self.getModel(WIZARD_MODEL);

          oModelWizard.setProperty("/Ziban2", null);
          oModelWizard.setProperty("/Zbic2", null);
          oModelWizard.setProperty("/Zcoordest2", null);
          oModelWizard.setProperty("/Zdenbanca2", null);
          oModelWizard.setProperty("/Zclearsyst2", null);
          oModelWizard.setProperty("/Zstras2", null);
          oModelWizard.setProperty("/Zcivico2", null);
          oModelWizard.setProperty("/Zort012", null);
          oModelWizard.setProperty("/Zregio2", null);
          oModelWizard.setProperty("/Zpstlz2", null);
          oModelWizard.setProperty("/Zland12", null);

          var idWizardZdesctipodisp3 = self
            .getView()
            .byId("idWizardZdesctipodisp3");
          var idWizardFipos = self.getView().byId("idWizardFipos");
          var idWizardStras = self.getView().byId("idWizardStras");
          if (idWizardZdesctipodisp3) {
            idWizardZdesctipodisp3.setSelectedKey("");
          }
          if (idWizardFipos) {
            idWizardFipos.setSelectedKey("");
          }
          if (idWizardStras) {
            idWizardStras.setSelectedKey("");
          }
        },

        resetStep3: function () {
          var self = this;
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData([]);
          self.setModel(oModelJson, STEP3_LIST);

          var oModelJsonCS = new sap.ui.model.json.JSONModel();
          oModelJsonCS.setData([]);
          self.setModel(oModelJsonCS, CLASSIFICAZIONE_SON_DEEP);
        },

        resetDataSONModel: function () {
          var self = this;
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/ZstatoSop", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Gjahr", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/ZufficioCont", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/Zdesctipodisp3", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/FiposList", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Fipos", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Fistl", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Kostl", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Saknr", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Hkont", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Lifnr", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/NameFirst", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/NameLast", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/Zimptot", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/TaxnumPiva", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/ZzragSoc", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/ZimptotDivisa", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/TaxnumCf", null);
          self
            .getView()
            .getModel(DataSON_MODEL)
            .setProperty("/Zzamministr", null);
          self.getView().getModel(DataSON_MODEL).setProperty("/PayMode", []);
          self.getView().getModel(DataSON_MODEL).setProperty("/NewPayMode", []);
          self.getView().getModel(DataSON_MODEL).setProperty("/FlagFruttifero", []);
          self.getView().getModel(DataSON_MODEL).setProperty("/PosizioneFinanziaria", []);
          self.getView().getModel(DataSON_MODEL).setProperty("/StruttAmministrativa", []);
        },

        closeWizardPanel: function () {
          var self = this,
            wizard = self.getView().byId("WizardForDetail"),
            array = document.querySelectorAll(".expanded");

          for (var i = 0; i < array.length; i++) {
            var panel = sap.ui.getCore().byId(array[i].id);
            if (panel.getExpanded()) panel.setExpanded(false);
          }
          wizard.setCurrentStep(wizard.getSteps()[0]);
        },

        resetForBack: function (selectedKeyText, isClearHeader = false) {
          var self = this,
            oBundle = self.getResourceBundle(),
            tab = self.getView().byId("idIconTabBar");
          self._beneficiario = null;
          self._sedeBeneficiario = null;
          self._amministrazione = null;
          self.getView().getModel(DETAIL_MODEL).setProperty("/total", null);
          self.getView().getModel(DETAIL_MODEL).setProperty("/checkList", []);
          self
            .getView()
            .getModel(DETAIL_MODEL)
            .setProperty("/buttonText", null);
          self
            .getView()
            .getModel(DETAIL_MODEL)
            .setProperty("/buttonVisible", false);
          self
            .getView()
            .getModel(DETAIL_MODEL)
            .setProperty("/iconTab", "sap-icon://detail-view");
          self
            .getView()
            .getModel(DETAIL_MODEL)
            .setProperty(
              "/text",
              self.getResourceBundle().getText("btnDetail")
            );
          self
            .getView()
            .getModel(DETAIL_MODEL)
            .setProperty("/key", self.getResourceBundle().getText("btnDetail"));
          self
            .getView()
            .getModel(DETAIL_MODEL)
            .setProperty("/showSelection", false);
          self
            .getView()
            .getModel(DETAIL_MODEL)
            .setProperty("/headerVisible", false);
          if (isClearHeader) self.resetHeaderAction();
          self.resetDataSONModel();
          self.resetWizardModel();
          self.resetStep3();
          if (self._detailShowed) self.closeWizardPanel();
          tab.setSelectedKey(oBundle.getText(selectedKeyText));
        },

        resetHeaderAction: function () {
          var self = this;
          self
            .getView()
            .getModel(HEADER_ACTION_MODEL)
            .setProperty("/ZufficioCont", null);
          self
            .getView()
            .getModel(HEADER_ACTION_MODEL)
            .setProperty("/ZvimDescrufficio", null);
          self
            .getView()
            .getModel(HEADER_ACTION_MODEL)
            .setProperty("/Zcodord", null);
          self
            .getView()
            .getModel(HEADER_ACTION_MODEL)
            .setProperty("/ZcodordDesc", null);
          self
            .getView()
            .getModel(HEADER_ACTION_MODEL)
            .setProperty("/Zcdr", null);
          self
            .getView()
            .getModel(HEADER_ACTION_MODEL)
            .setProperty("/ZdirigenteAmm", null);
          var sendSignSonDt = self.getView().byId("sendSignSonDt");
          if (sendSignSonDt) {
            sendSignSonDt.setValue(null);
          }
        },

        resetLog: function () {
          var self = this;
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData([]);
          self.setModel(oModelJson, LOG_MODEL);
          self.setModel(oModelJson, MESSAGE_MODEL);
        },

        resetPayModeRelatedData: function () {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL);

            wizardModel.setProperty("/Zalias", null);
            wizardModel.setProperty("/AccTypeId", null);
            wizardModel.setProperty("/RegioSosp", null);
            wizardModel.setProperty("/ZaccText", null);
            wizardModel.setProperty("/Zzposfinent", null);
            wizardModel.setProperty("/Zzposfinent", null);
            wizardModel.setProperty("/Zpurpose", null);
            wizardModel.setProperty("/Zflagfrutt", null);
            wizardModel.setProperty("/Zcausben", null);
            //Sezione Versante
            wizardModel.setProperty("/Zcfcommit", null);
            wizardModel.setProperty("/Zcodtrib", null);
            wizardModel.setProperty("/Zperiodrifa", null);
            wizardModel.setProperty("/Zperiodrifda", null);
            wizardModel.setProperty("/Zcodinps", null);
            wizardModel.setProperty("/Zcodvers", null);
            wizardModel.setProperty("/Zcfvers", null);
            wizardModel.setProperty("/Zdescvers", null);
            wizardModel.setProperty("/Zdatavers", null);
            wizardModel.setProperty("/Zprovvers", null);
            wizardModel.setProperty("/Zsedevers", null);
            //Banca Accredito
            wizardModel.setProperty("/Ziban_b", null);
            wizardModel.setProperty("/Zbic_b", null);
            wizardModel.setProperty("/Zcoordest_b", null);
            wizardModel.setProperty("/Zdenbanca_b", null);
            wizardModel.setProperty("/Zclearsyst_b", null);
            wizardModel.setProperty("/Stras_b", null);
            wizardModel.setProperty("/Zcivico_b", null);
            wizardModel.setProperty("/Ort01_b", null);
            wizardModel.setProperty("/Regio_b", null);
            wizardModel.setProperty("/Pstlz_b", null);
            wizardModel.setProperty("/Land1_b", null);
            //Intermediario 1
            wizardModel.setProperty("/Ziban_i", null);
            wizardModel.setProperty("/Zbic_i", null);
            wizardModel.setProperty("/Zcoordest_i", null);
            wizardModel.setProperty("/Zdenbanca_i", null);
            wizardModel.setProperty("/Zclearsyst_i", null);
            wizardModel.setProperty("/Zstras_i", null);
            wizardModel.setProperty("/Zcivico_i", null);
            wizardModel.setProperty("/Zort01_i", null);
            wizardModel.setProperty("/Zregio_i", null);
            wizardModel.setProperty("/Zpstlz_i", null);
            wizardModel.setProperty("/Zland1_i", null);
            //Intermediario 2
            wizardModel.setProperty("/Ziban2", null);
            wizardModel.setProperty("/Zbic2", null);
            wizardModel.setProperty("/Zcoordest2", null);
            wizardModel.setProperty("/Zdenbanca2", null);
            wizardModel.setProperty("/Zclearsyst2", null);
            wizardModel.setProperty("/Zstras2", null);
            wizardModel.setProperty("/Zcivico2", null);
            wizardModel.setProperty("/Zort012", null);
            wizardModel.setProperty("/Zregio2", null);
            wizardModel.setProperty("/Zpstlz2", null);
            wizardModel.setProperty("/Zland12", null);
        },

        setWizardModel: function (data) {
          var self = this;
          var oWizardModel = new JSONModel({
            btnBackVisible: false,
            btnNextVisible: true,
            btnFinishVisible: false,
            isInChange: false,
            Step3TableTitle: null,
            Bukrs: data.Bukrs,
            Zchiavesop: data.Zchiavesop,
            Zstep: data.Zstep,
            Ztipososp: data.Ztipososp,
            Zzamministr: data.Zzamministr,
            Zchiaveopi: data.Zchiaveopi,
            //step4
            ZE2e: data.ZE2e,
            Zcausale: data.Zcausale,
            Znumprot: data.Znumprot,
            Zdataprot: data.Zdataprot,
            Zlocpag: data.Zlocpag,
            Zzonaint: data.Zzonaint,
            StrasList: null,

            //step3
            Zimptotcos: null,
            Zimpcos: data.Zimpcos,
            Zcos: data.Zcos,
            //step1
            Gjahr: data.Gjahr,
            ZufficioCont: data.ZufficioCont,
            ZvimDescrufficio: data.ZvimDescrufficio,
            Zdesctipodisp3: data.Zdesctipodisp3,
            Ztipodisp3: data.Ztipodisp3,
            Ztipodisp3List: null,
            FiposList: null,
            Fipos: null,
            Fistl: null,
            Kostl: data.Kostl,
            Ltext: data.Ltext,
            Skat: data.Skat,
            Saknr: data.Hkont,
            Hkont: data.Hkont,
            Zimptot: data.Zimptot === "0.00" ? null : data.Zimptot,
            ZimptotDivisa: data.ZimptotDivisa,
            Trbtr: data.Trbtr,
            Twaer: data.Twaer,
            //step2
            Lifnr: data.Lifnr,
            TaxnumCf: data.TaxnumCf,
            Banks: data.Banks,
            Iban: data.Iban,
            Zcoordest: data.Zcoordest,
            isZcoordestEditable: false,
            isZZcausalevalEditable: false,
            isIbanEditable: false,
            isBicEditable: false,
            Swift: data.Swift,
            PayMode: data.Zwels,
            ZZcausaleval: data.ZCausaleval,
            Zwels: data.Zwels,
            ZCausaleval: data.ZCausaleval,

            //nuovi modalità pagamento
            Zalias: data.Zalias,
            AccTypeId: data.AccTypeId,
            RegioSosp: data.RegioSosp,
            ZaccText: data.ZaccText,
            Zzposfinent: data.Zzposfinent,
            Zpurpose: data.Zpurpose,
            Zcausben: data.Zcausben,
            Zflagfrutt: data.Zflagfrutt,

            //sezione Versante
            Zcodprov: data.Zcodprov,
            Zcodvers: data.Zcodvers,
            Zcfcommit: data.Zcfcommit,
            Zcfvers: data.Zcfvers,
            Zcodtrib: data.Zcodtrib,
            Zperiodrifda: data.Zperiodrifda,
            Zperiodrifa: data.Zperiodrifa,
            Zcodinps: data.Zcodinps,
            Zdescvers: data.Zdescvers,
            Zdatavers: data.Zdatavers,
            Zsedevers: data.Zsedevers,
            Zprovvers: data.Zprovvers,

            //Banca Accredito
            Ziban_b: data.Zibanb,
            Zbic_b: data.Zbicb,
            Zcoordest_b: data.Zcoordestb,
            Zdenbanca_b: data.Zdenbanca,
            Zclearsyst_b: data.Zclearsyst,
            Stras_b: data.Stras,
            Zcivico_b: data.Zcivico,
            Ort01_b: data.Ort01,
            Regio_b: data.Regio,
            Pstlz_b: data.Pstlz,
            Land1_b: data.Land1,

            //Intermediario1
            Ziban_i: data.Zibani,
            Zbic_i: data.Zbici,
            Zcoordest_i: data.Zcoordesti,
            Zdenbanca_i: data.Zdenbancai,
            Zclearsyst_i: data.Zclearsysti,
            Zstras_i: data.Zstrasi,
            Zcivico_i: data.Zcivicoi,
            Zort01_i: data.Zort01i,
            Zregio_i: data.Zregioi,
            Zpstlz_i: data.Zpstlzi,
            Zland1_i: data.Zland1i,

            //Intermediario 2
            Ziban2: data?.Ziban2,
            Zbic2: data?.Zbic2,
            Zcoordest2: data?.Zcoordest2,
            Zdenbanca2: data?.Zdenbanca2,
            Zclearsyst2: data?.Zclearsyst2,
            Zstras2: data?.Zstras2,
            Zcivico2: data?.Zcivico2,
            Zort012: data?.Zort012,
            Zregio2: data?.Zregio2,
            Zpstlz2: data?.Zpstlz2,
            Zland12: data?.Zland12,
          });


          var fistlControl = self.getView().byId("idWizardFistl");
          fistlControl.setSelectedKey(null);
          var found = fistlControl.getModel("DataModel").getProperty("/StruttAmministrativa").find(x=> x.Fistl === data.Fistl);
          if(found){
            oWizardModel.getData().Fistl = data.Fistl;
            fistlControl.setSelectedKey(data.Fistl);            
          }

          var fiposControl = self.getView().byId("idWizardFipos");
          fiposControl.setSelectedKey(null);
          var foundFipos = fiposControl.getModel("DataModel").getProperty("/PosizioneFinanziaria").find(x=> x.Fipos === data.Fipos);
          if(foundFipos){
            oWizardModel.getData().Fipos = data.Fipos;
            fiposControl.setSelectedKey(data.Fipos);            
          }

          return oWizardModel;
        },

        fillWizard: function (oItem, viewId=null) {
          var self = this,
            oWizardModel,
            fruttiferoSet = [],
            struttAmministrativa=[],
            posizioneFinanziaria=[],
            oDataModel = self.getModel();

          self.getView().setBusy(true);
          self.payMode = [];
          console.log("hello", oItem);

          self.getFruttiferoInfruttifero(function (callback) {
            if (!callback.error) {
              fruttiferoSet = callback.data;
            } else fruttiferoSet = callback.data;
          });

          self.getStrutturaAmministrativa(function(callback){
            struttAmministrativa = callback.data;
          });

          // self.getPosizioneFinanziaria(function(callback){
          //   posizioneFinanziaria = callback.data;
          // });          

          var path = self.getModel().createKey(SON_SET, {
            Bukrs: oItem.Bukrs,
            Gjahr: oItem.Gjahr,
            Zchiavesop: oItem.Zchiavesop,
            Zstep: oItem.Zstep,
            Ztipososp: oItem.Ztipososp,
          });

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                success: function (data, oResponse) {
                  self.getPosizioneFinanziaria(data,function(callback){
                    posizioneFinanziaria = callback.data;
                  }); 
                  self.getBeneficiarioHeader(data.Lifnr);
                  self.getPayModeByLifnr(
                    data.Lifnr,
                    "",
                    true,
                    function (callback) {
                      if (!callback.error) {
                        self.payMode = callback.data;
                      } else self.payMode = [];
                    }
                  );

                  self.getSedeBeneficiario(data.Lifnr, data.Zidsede);
                  // oWizardModel = self.setWizardModel(data);
                  // oWizardModel.viewId = viewId;
                  setTimeout(() => {

                    var oDataSONModel = new JSONModel({
                      ZstatoSop: data.ZstatoSop,
                      Gjahr: data.Gjahr,
                      ZufficioCont: data.ZufficioCont,
                      Zdesctipodisp3: data.Zdesctipodisp3,
                      Fipos: data.Fipos,
                      Fistl: data.Fistl,
                      Kostl: data.Kostl,
                      Saknr: data.Saknr,
                      Lifnr: data.Lifnr,
                      NameFirst: self._beneficiario ? self._beneficiario.NameFirst : "",
                      NameLast: self._beneficiario ? self._beneficiario.NameLast : "",
                      Zimptot: data.Zimptot,
                      ZimptotDivisa: data.ZimptotDivisa,
                      TaxnumPiva: self._beneficiario ? self._beneficiario.TaxnumPiva : "",
                      ZzragSoc: self._beneficiario ? self._beneficiario.ZzragSoc : "",
                      TaxnumCf: self._beneficiario ? self._beneficiario.TaxnumCf : "",
                      Zzamministr: self._amministrazione.Value,
                      PayMode: self.payMode,
                      FlagFruttifero: fruttiferoSet,
                      NewPayMode: [],
                      StruttAmministrativa: struttAmministrativa,
                      PosizioneFinanziaria:posizioneFinanziaria
                    });
                    self.setModel(oDataSONModel, DataSON_MODEL);


                    oWizardModel = self.setWizardModel(data);
                    oWizardModel.viewId = viewId;
                    oWizardModel.getData().viewName = viewId;
                    oWizardModel.getData().FirstKeyStras = self._sedeBeneficiario ? self._sedeBeneficiario.Stras : "";
                    oWizardModel.getData().Zidsede = data.Zidsede;
                    oWizardModel.getData().Ort01 = self._sedeBeneficiario ? self._sedeBeneficiario.Ort01 : "";
                    oWizardModel.getData().Regio = self._sedeBeneficiario ? self._sedeBeneficiario.Regio : "";
                    oWizardModel.getData().Pstlz = self._sedeBeneficiario ? self._sedeBeneficiario.Pstlz : "";
                    oWizardModel.getData().Land1 = self._sedeBeneficiario ? self._sedeBeneficiario.Land1 : "";
                    oWizardModel.getData().NameFirst = self._beneficiario ? self._beneficiario.NameFirst : "";
                    oWizardModel.getData().ZzragSoc = self._beneficiario ? self._beneficiario.ZzragSoc : "";
                    oWizardModel.getData().Zsede = self._beneficiario ? self._beneficiario.Zsede : "";
                    oWizardModel.getData().Type = self._beneficiario && self._beneficiario.Type === "1" ? true : false; //radio btn
                    oWizardModel.getData().TaxnumCf = self._beneficiario ? self._beneficiario.TaxnumCf : "";
                    oWizardModel.getData().Taxnumxl = self._beneficiario ? self._beneficiario.Taxnumxl : "";
                    oWizardModel.getData().NameLast = self._beneficiario ? self._beneficiario.NameLast : "";
                    oWizardModel.getData().TaxnumPiva = self._beneficiario ? self._beneficiario.TaxnumPiva : "";
                    oWizardModel.getData().Zdenominazione = self._beneficiario ? self._beneficiario.Zdenominazione : "";
                    oWizardModel.getData().Zdurc = self._beneficiario?.Zdurc ?? "";
                    oWizardModel.getData().Zdstatodes = self._beneficiario?.Zdstatodes ?? "";
                    oWizardModel.getData().Zdscadenza = self._beneficiario?.Zdscadenza ?? null;
                    oWizardModel.getData().ZfermAmm = self._beneficiario?.ZfermAmm ?? "";
                    
                    self.setModel(oWizardModel, WIZARD_MODEL);      
                    self.fillZtipodisp3ListWizard(self.getModel(WIZARD_MODEL).getProperty("/Ztipodisp3"));              
                    
                    self.getClassificazioneFRomFillWizard(
                      self.getView().getModel(WIZARD_MODEL)
                    );
                    self.getClassificazioneFRomFillWizard2(
                      self.getView().getModel(WIZARD_MODEL)
                    );

                    self.getView().setBusy(false);
                  }, 4500);
                },
                error: function (error) {
                  console.log(error);
                },
              });
            });
        },

        getSedeBeneficiario: function (lifnr, idSede) {
          var self = this,
            oDataModel = self.getModel();

          if (!lifnr || lifnr === null) return false;

          var path = self.getModel().createKey(SedeBeneficiario_SET, {
            Lifnr: lifnr,
            Zidsede: idSede,
          });

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                success: function (data, oResponse) {
                  self._sedeBeneficiario = data;
                },
                error: function (error) {
                  self._sedeBeneficiario = null;
                },
              });
            });
        },

        getBeneficiarioHeader: function (lifnr) {
          var self = this,
            oDataModel = self.getModel();

          if (!lifnr || lifnr === null) return false;

          var path = self.getModel().createKey(Beneficiary_SET, {
            Lifnr: lifnr,
          });

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                success: function (data, oResponse) {
                  self._beneficiario = data;
                },
                error: function (error) {
                  self._beneficiario = null;
                },
              });
            });
        },

        getFruttiferoInfruttifero: function (callback) {
          var self = this,
            oDataModel = self.getModel();

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/FlagFruttiferoSet", {
                success: function (data, oResponse) {
                  callback({ error: false, data: data.results });
                },
                error: function (error) {
                  console.log(error);
                  callback({ error: true, data: [] });
                },
              });
            });
        },
        getStrutturaAmministrativa:function(callback){
          var self = this,
            oDataModel = self.getModel();
          
          self.getModel().metadataLoaded().then(function () {
              oDataModel.read("/PrevalorizzazioneW1Set", {
                success: function (data, oResponse) {
                  callback({ error: false, data: data.results });
                },
                error: function (error) {
                  console.log(error);
                  callback({ error: true, data: [] });
                },
              });
          });
        },

        getPosizioneFinanziaria:function(data,callback){
          var self = this,
            oDataModel = self.getModel();

          var filters = [
            self.setFilterEQWithKey("Ztipodisp3", data.Ztipodisp3),
            self.setFilterEQWithKey("Gjahr", data.Gjahr),
            self.setFilterEQWithKey("ZufficioCont", data.ZufficioCont),
          ];
          self.getModel().metadataLoaded().then(function () {
              oDataModel.read("/FiposMcSet", {
                filters:filters,
                success: function (data, oResponse) {
                  callback({ error: false, data: data.results });
                },
                error: function (error) {
                  console.log(error);
                  callback({ error: true, data: [] });
                },
              });
          });
        },

        fillWorkflow: function (oItem) {
          var self = this,
            oDataModel = self.getModel(),
            oView = self.getView();

          var Zchiavesop = oItem["Zchiavesop"];
          var filter = [self.setFilterEQWithKey("Zchiavesop", Zchiavesop)];
          console.log("filter", filter);
          oView.setBusy(true);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + WORKFLOW_SET, {
                filters: filter,
                success: function (data, oResponse) {
                  oView.setBusy(false);
                  var res = data.results;
                  console.log("result", res);
                  for (var i = 0; i < res.length; i++) {
                    res[i].DataStato = new Date(res[i].DataOraString);
                  }
                  var oModelJson = new sap.ui.model.json.JSONModel();
                  oModelJson.setData(res);
                  self.getView().setModel(oModelJson, "WorkFlow");
                },
                error: function (error) {
                  oView.setBusy(false);
                },
              });
            });
        },

        getAmministrazioneHeader: function () {
          var self = this,
            oDataModel = self.getModel();

          var path = self.getModel().createKey(Zzamministr_SET, {
            Name: "PRC",
          });

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                success: function (data, oResponse) {
                  self._amministrazione = data;
                },
                error: function (error) {
                  self._amministrazione = null;
                },
              });
            });
        },

        onChangeUpdateDate: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL);

          var bValid = oEvent.getParameter("valid");
          if (!bValid) {
            oEvent.getSource().setValue("");
            wizardModel.setProperty("/Zdataprot", null);
            return;
          }
          var value = oEvent.getParameter("newValue");
          value = self.formatter.formatStringForDate(value);
          wizardModel.setProperty("/Zdataprot", value);
        },

        onFlagFruttiferoChange: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            value = oEvent.getSource().getSelectedKey();
          wizardModel.setProperty("/Zflagfrutt", value);
        },

        onChangeSON: function (oEvent) {
          var self = this;
          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/isInChange", true);
        },

        onSaveAll: function () {
          var self = this,
            wizardModel = self.getView().getModel(WIZARD_MODEL);

          if (!wizardModel.getProperty("/isInChange")) return;

          self.goToFinish("WizardForDetail", function (callback) {
            switch (callback) {
              case "ValidationError":
                return false;
                break;
              case "ValidationSuccess":
                self._setDialogSaveAll("msgRettificaSon");
                break;
              default:
                return false;
                break;
            }
          });
        },

        onWizardFinishButton: function (oEvent) {
          var self = this,
            wizardType = oEvent.getSource().data("dataWizardType");

          if (wizardType === "Fine"){
            location.reload();
            return false;
          }
          self.onSaveAll();
        },

        _setDialogSaveAll: function (sMessage) {
          var self = this;
          var oBundle = self.getResourceBundle();
          var oDialog = new sap.m.Dialog({
            title: oBundle.getText("titleDialogWarning"),
            state: "Warning",
            type: "Message",
            content: [
              new sap.m.Text({
                text: oBundle.getText(sMessage),
              }),
            ],
            beginButton: new sap.m.Button({
              text: oBundle.getText("btnOK"),
              type: "Emphasized",
              press: function () {
                oDialog.close();
                self.saveWizard();
              },
            }),
            endButton: new sap.m.Button({
              text: oBundle.getText("btnCancel"),
              type: "Emphasized",
              press: function () {
                oDialog.close();
              },
            }),
            afterClose: function () {
              oDialog.destroy();
            },
          });
          oDialog.open();
        },

        saveWizard: function () {
          var self = this,
            oDataModel = self.getModel(),
            oBundle = self.getResourceBundle(),
            wizardModel = self.getModel(WIZARD_MODEL),
            classificazioneSonList = self
              .getModel(CLASSIFICAZIONE_SON_DEEP)
              .getData(),
            Zchiavesop = wizardModel.getProperty("/Zchiavesop");

          var arrayClassificazioneSonList = [];
          for (var i = 0; i < classificazioneSonList.length; i++) {
            var item = Object.assign({}, classificazioneSonList[i]);
            // var item = classificazioneSonList[i];
            if (
              item.Id === 0 ||
              !item.ZcosDesc ||
              item.ZcosDesc === null ||
              item.ZcosDesc === ""
            )
              continue;
            item.ZcosDesc = item.ZcosDesc.slice(0,30);
            delete item.Id;
            arrayClassificazioneSonList.push(item);
          }

          var bIntermediario1Valorized = self.isIntermediario1Valorized();

          var entityRequestBody = {
            Zchiavesop: Zchiavesop,
            Bukrs: "",
            Gjahr: "",
            Ztipososp: "",
            OperationType: OPERATION_TYPE_RETTIFICA,
            SonMessageSet: [],
            ClassificazioneSonSet: arrayClassificazioneSonList,
            SonSet: [
              {
                Bukrs: wizardModel.getProperty("/Bukrs"),
                ZstatoSop: wizardModel.getProperty("/ZstatoSop"),
                Zimptot: wizardModel.getProperty("/Zimptot"),
                ZimptotDivisa: wizardModel.getProperty("/ZimptotDivisa"),
                Trbtr: wizardModel.getProperty("/Trbtr"),
                Twaer: wizardModel.getProperty("/Twaer"),
                Zidsede: wizardModel.getProperty("/Zidsede"),
                Gjahr: wizardModel.getProperty("/Gjahr"),
                Zchiavesop: wizardModel.getProperty("/Zchiavesop"),
                Zstep: wizardModel.getProperty("/Zstep"),
                Ztipososp: wizardModel.getProperty("/Ztipososp"),
                Zzamministr: wizardModel.getProperty("/Zzamministr"),
                ZufficioCont: wizardModel.getProperty("/ZufficioCont"),
                Znumsop: wizardModel.getProperty("/Znumsop"),
                Zricann: wizardModel.getProperty("/Zricann"),
                Zdatasop:
                  wizardModel.getProperty("/Zdatasop") &&
                  wizardModel.getProperty("/Zdatasop") !== null &&
                  wizardModel.getProperty("/Zdatasop") !== ""
                    ? self.formatter.formateDateForDeep(
                        wizardModel.getProperty("/Zdatasop")
                      )
                    : null,
                Zdataprot:
                  wizardModel.getProperty("/Zdataprot") &&
                  wizardModel.getProperty("/Zdataprot") !== null &&
                  wizardModel.getProperty("/Zdataprot") !== ""
                    ? self.formatter.formateDateForDeep(
                        wizardModel.getProperty("/Zdataprot")
                      )
                    : null,
                Znumprot: wizardModel.getProperty("/Znumprot"),
                Lifnr: wizardModel.getProperty("/Lifnr"),
                Fipos: wizardModel.getProperty("/Fipos"),
                Fistl: wizardModel.getProperty("/Fistl"),
                Ztipodisp3: wizardModel.getProperty("/Ztipodisp3"),
                Kostl: wizardModel.getProperty("/Kostl"),
                Hkont: wizardModel.getProperty("/Hkont"),
                Zwels: wizardModel.getProperty("/PayMode"),
                ZCausaleval: wizardModel.getProperty("/ZZcausaleval"),
                Iban: wizardModel.getProperty("/Iban"),
                Swift: wizardModel.getProperty("/Swift"),
                Zcoordest: wizardModel.getProperty("/Zcoordest"),
                Zlocpag: wizardModel.getProperty("/Zlocpag"),
                Zcausale: wizardModel.getProperty("/Zcausale"),
                Zzonaint: wizardModel.getProperty("/Zzonaint"),
                ZE2e: wizardModel.getProperty("/ZE2e"),
                ZuffcontFirm: wizardModel.getProperty("/ZuffcontFirm"),
                Zcdr: wizardModel.getProperty("/Zcdr"),
                ZdirigenteAmm: wizardModel.getProperty("/ZdirigenteAmm"),
                ZuffcontRicann: wizardModel.getProperty("/ZuffcontRicann"),
                CdrRicann: wizardModel.getProperty("/CdrRicann"),
                ZdirigenteRicann: wizardModel.getProperty("/ZdirigenteRicann"),
                ZuffcontCancricann: wizardModel.getProperty(
                  "/ZuffcontCancricann"
                ),
                CdrCancricann: wizardModel.getProperty("/CdrCancricann"),
                ZdirigenteCancricann: wizardModel.getProperty(
                  "/ZdirigenteCancricann"
                ),
                Zdatarichann:
                  wizardModel.getProperty("/Zdatarichann") &&
                  wizardModel.getProperty("/Zdatarichann") !== null &&
                  wizardModel.getProperty("/Zdatarichann") != ""
                    ? self.formatter.formateDateForDeep(
                        wizardModel.getProperty("/Zdatarichann")
                      )
                    : null,
                Zchiaveopi: wizardModel.getProperty("/Zchiaveopi"),
                Zinvioricann: wizardModel.getProperty("/Zinvioricann"),

                /*Modalità pagamento - campi nuovi*/
                Zalias: wizardModel.getProperty("/Zalias"),
                AccTypeId: wizardModel.getProperty("/AccTypeId"),
                RegioSosp: wizardModel.getProperty("/RegioSosp"),
                ZaccText: wizardModel.getProperty("/ZaccText"),
                Zzposfinent: wizardModel.getProperty("/Zzposfinent"),
                Zpurpose: wizardModel.getProperty("/Zpurpose"),
                Zcausben: wizardModel.getProperty("/Zcausben"),
                Zflagfrutt: wizardModel.getProperty("/Zflagfrutt"),

                //Sezione Versante
                Zcodprov: wizardModel.getProperty("/Zcodprov"),
                Zcfcommit: wizardModel.getProperty("/Zcfcommit"),
                Zcodtrib: wizardModel.getProperty("/Zcodtrib"),
                Zperiodrifda:
                  wizardModel.getProperty("/Zperiodrifda") &&
                  wizardModel.getProperty("/Zperiodrifda") !== null &&
                  wizardModel.getProperty("/Zperiodrifda") != ""
                    ? self.formatter.formateDateForDeep(
                        wizardModel.getProperty("/Zperiodrifda")
                      )
                    : null,
                Zperiodrifa:
                  wizardModel.getProperty("/Zperiodrifa") &&
                  wizardModel.getProperty("/Zperiodrifa") !== null &&
                  wizardModel.getProperty("/Zperiodrifa") != ""
                    ? self.formatter.formateDateForDeep(
                        wizardModel.getProperty("/Zperiodrifa")
                      )
                    : null,
                Zcodinps: wizardModel.getProperty("/Zcodinps"),
                Zcodvers: wizardModel.getProperty("/Zcodvers"),
                Zcfvers: wizardModel.getProperty("/Zcfvers"),
                Zdescvers: wizardModel.getProperty("/Zdescvers"),
                Zdatavers:
                  wizardModel.getProperty("/Zdatavers") &&
                  wizardModel.getProperty("/Zdatavers") !== null &&
                  wizardModel.getProperty("/Zdatavers") != ""
                    ? self.formatter.formateDateForDeep(
                        wizardModel.getProperty("/Zdatavers")
                      )
                    : null,
                Zprovvers: wizardModel.getProperty("/Zprovvers"),
                Zsedevers: wizardModel.getProperty("/Zsedevers"),

                Ziban2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Ziban2")
                  : null,
                Zbic2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zbic2")
                  : null,
                Zcoordest2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zcoordest2")
                  : null,
                Zdenbanca2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zdenbanca2")
                  : null,
                Zclearsyst2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zclearsyst2")
                  : null,
                Zstras2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zstras2")
                  : null,
                Zcivico2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zcivico2")
                  : null,
                Zort012: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zort012")
                  : null,
                Zregio2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zregio2")
                  : null,
                Zpstlz2: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zpstlz2")
                  : null,
                Zland12: bIntermediario1Valorized
                  ? wizardModel.getProperty("/Zland12")
                  : null,
              },
            ],
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            success: function (result) {
              self.getView().setBusy(false);
              var arrayMessage = result.SonMessageSet.results;
              if (!self.isErrorInLog(arrayMessage)) {
                return false;
              }
              var first = oBundle.getText("operationOK");
              var second = oBundle.getText("msgNumberSON", [result.Zchiavesop]);
              var znumsop = self.formatter.deleteFirstZeros(result.SonSet.results[0].Znumsop);
              var text = first + "\n" + second + znumsop;
              sap.m.MessageBox.success(text, {
                title: oBundle.getText("operationOK"),
                onClose: function (oAction) {
                  self.setPropertyGlobal(self.RELOAD_MODEL, "canRefresh", true);
                  self.onNavBack();
                },
              });
              console.log(result.SonMessageSet.results);
            },
            error: function (err) {
              self.getView().setBusy(false);
            },
            async: true,
            urlParameters: {},
          });
        },

        onUpdateFinished: function (oEvent) {
          console.log("update");
          var self = this;
          var sTitle,
            oTable = oEvent.getSource(),
            step3List = self.getModel(STEP3_LIST).getData(),
            wizardModel = self.getModel(WIZARD_MODEL),
            iTotalItems = step3List.length;

          if (
            iTotalItems &&
            oTable.getBinding("items").isLengthFinal() &&
            iTotalItems > 0
          ) {
            sTitle = self
              .getResourceBundle()
              .getText("Step3TableTitleCount", [iTotalItems]);
          } else {
            sTitle = self.getResourceBundle().getText("Step3TableTitle");
          }
          wizardModel.setProperty("/Step3TableTitle", sTitle);
          self.getView().setBusy(false);
        },

        onAddRow: function (oEvent) {
          var self = this,
            oBundle = self.getResourceBundle(),
            wizardModel = self.getModel(WIZARD_MODEL),
            classificazoneSonDeep = self
              .getModel(CLASSIFICAZIONE_SON_DEEP)
              .getData(),
            Zchiavesop = wizardModel.getProperty("/Zchiavesop"),
            Bukrs = wizardModel.getProperty("/Bukrs"),
            Zchiavesop = wizardModel.getProperty("/Zchiavesop"),
            ZstepSop = wizardModel.getProperty("/Zstep"),
            step3List = self.getModel(STEP3_LIST).getData();

          if (self._indexClassificazioneSON === 0) {
            self._indexClassificazioneSON = step3List.length;
          }

          var firstRow = {};
          firstRow.Zchiavesop = Zchiavesop;
          firstRow.Bukrs = Bukrs;
          firstRow.Zetichetta = COS;
          firstRow.ZstepSop = ZstepSop;
          firstRow.Zposizione = "";
          firstRow.Id = self._indexClassificazioneSON + 1;
          self._indexClassificazioneSON = self._indexClassificazioneSON + 1;
          step3List.push(firstRow);
          classificazoneSonDeep.push(firstRow);

          var sum = 0;
          for (var i = 0; i < step3List.length; i++) {
            var item = step3List[i].ZimptotClass;
            if (!item || item === null) item = "0";
            item.replace(",", ".");
            sum = sum + parseFloat(item);
          }
          wizardModel.setProperty("/Zimptotcos", sum.toFixed(2));
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(step3List);
          self.setModel(oModelJson, STEP3_LIST);
          var oModelJsonCS = new sap.ui.model.json.JSONModel();
          oModelJsonCS.setData(classificazoneSonDeep);
          self.setModel(oModelJsonCS, CLASSIFICAZIONE_SON_DEEP);
        },
        //Petro - Start
        onCancelRow: function (oEvent) {
          var self = this,
            oBundle = self.getResourceBundle(),
            wizardModel = self.getModel(WIZARD_MODEL),
            classificazoneSonDeep = self
              .getModel(CLASSIFICAZIONE_SON_DEEP)
              .getData(),
            step3List = self.getModel(STEP3_LIST).getData(),
            oTable = self.getView().byId(TABLE_STEP3),
            oTableModel = oTable.getModel(STEP3_LIST),
            selected = oTable.getSelectedContextPaths();

          if (self._indexClassificazioneSON === 0) {
            self._indexClassificazioneSON = step3List.length;
          }

          if (selected.length === 0) {
            sap.m.MessageBox.warning(
              oBundle.getText("msgWizardCodiceGestionaleNoSelection"),
              {
                title: oBundle.getText("titleDialogWarning"),
                onClose: function (oAction) {
                  return false;
                },
              }
            );
            return false;
          }

          console.log(classificazoneSonDeep);
          console.log(step3List);

          var cloneStep3List = Object.assign([], step3List);
          for (var i = 0; i < selected.length; i++) {
            var path = selected[i];
            path = path.replace("/", "");
            var index = path; // parseInt(path)+1;
            if (index === 0) continue;
            var selectedItem = cloneStep3List[index];

            var indexClassificazoneSonDeep = classificazoneSonDeep.findIndex(
              (x) => x.Id === selectedItem.Id
            );
            if (indexClassificazoneSonDeep > -1) {
              var aRemovedItem = classificazoneSonDeep.splice(indexClassificazoneSonDeep, 1);
              aRemovedItem[0].Zflagcanc = "X";
              classificazoneSonDeep = !aRemovedItem[0].Zposizione ? classificazoneSonDeep : classificazoneSonDeep.concat(aRemovedItem);
            } else {
              var item = Object.assign({}, selectedItem);
              item.Zflagcanc = item.Zposizione !== null ? "X" : null;
              classificazoneSonDeep.push(item);
            }

            var indiceStep3 = step3List.findIndex(
              (x) => x.Id === selectedItem.Id
            );
            indiceStep3 > -1 ? step3List.splice(indiceStep3, 1) : "";
          }
          var sum = 0;
          for (var i = 0; i < step3List.length; i++) {
            var item = step3List[i].ZimptotClass;
            if (!item || item === null) item = "0";
            item.replace(",", ".");
            sum = sum + parseFloat(item);
          }
          wizardModel.setProperty("/Zimptotcos", sum.toFixed(2));
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(step3List);
          self.setModel(oModelJson, STEP3_LIST);
          var oModelJsonCS = new sap.ui.model.json.JSONModel();
          oModelJsonCS.setData(classificazoneSonDeep);
          self.setModel(oModelJsonCS, CLASSIFICAZIONE_SON_DEEP);
        },

        onValueHelpRequestedZcos_old: function (oEvent) {
          var self = this,
            oDataModel = self.getModel(),
            wizardModel = self.getModel(WIZARD_MODEL),
            Gjahr = wizardModel.getProperty("/Gjahr"),
            inputContextPath = oEvent
              .getSource()
              .getBindingInfo("value")
              .binding.getContext()
              .getPath();

          var inputId = oEvent.getSource().data().id;
          var fragmentName = oEvent.getSource().data().fragmentName;
          var path = oEvent.getSource().data().datapathmodel;
          var pathName = oEvent.getSource().data().pathName;
          var dialogName = oEvent.getSource().data().dialogName;
          var oDialog = self.openDialog(
            "gestioneabilitazioneeson.view.fragment.valueHelp.ValueHelp" +
              fragmentName
          );
          console.log(oDialog);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                urlParameters: { Gjahr: Gjahr },
                success: function (data, oResponse) {
                  var oModelJson = new sap.ui.model.json.JSONModel();
                  console.log("data", data);
                  oModelJson.setData(data.results);
                  var oTable = sap.ui.getCore().byId(dialogName);
                  console.log(dialogName);
                  oTable.setModel(oModelJson, pathName);
                  console.log(inputId);
                  if (
                    inputContextPath &&
                    inputContextPath !== null &&
                    inputContextPath !== ""
                  )
                    self.referInputId = inputContextPath;

                  oTable.data("inputId", inputId);
                  oDialog.open();
                },
                error: function (error) {},
              });
            });
        },

        onValueHelpRequestedZcos: function (oEvent) {
          var self = this,
            oDataModel = self.getModel(),
            oModelCodGest = self.getModel("ZSS4_CO_GEST_ANAGRAFICHE_SRV"),
            wizardModel = self.getModel(WIZARD_MODEL),
            Gjahr = wizardModel.getProperty("/Gjahr"),
            aFilters = [],
            inputContextPath = oEvent
              .getSource()
              .getBindingInfo("value")
              .binding.getContext()
              .getPath();

          var inputId = oEvent.getSource().data().id;
          var fragmentName = oEvent.getSource().data().fragmentName;
          var path = oEvent.getSource().data().datapathmodel;
          var pathName = oEvent.getSource().data().pathName;
          var dialogName = oEvent.getSource().data().dialogName;
          var oDialog = self.openDialog(
            "gestioneabilitazioneeson.view.fragment.valueHelp.ValueHelp" +
              fragmentName
          );
          console.log(oDialog);

          var dCurrentDate = new Date();
          var sCurrentDate =
            dCurrentDate.getFullYear().toString() +
            ( dCurrentDate.getMonth() + 1).toString() +
            dCurrentDate.getDate().toString();

          aFilters.push(self.setFilterEQWithKey("ANNO", Gjahr));
          aFilters.push(self.setFilterEQWithKey("FASE", "GEST"));
          aFilters.push(self.setFilterEQWithKey("MC", "X"));
          aFilters.push(self.setFilterEQWithKey("REALE", "R"));
          aFilters.push(self.setFilterEQWithKey("LOEKZ", ""));
          aFilters.push(new FILTER("DATBIS", GE, sCurrentDate));
          aFilters.push(new FILTER("DATAB", LE, sCurrentDate));

          oDataModel.read("/UserParametersSet('BUK')", {
            success: function (data) {
              aFilters.push(self.setFilterEQWithKey("FIKRS", data.Value));
            },
            error: function () {},
          });

          oModelCodGest.read("/" + path, {
            filters: aFilters,
            success: function(data) {
              var aCosData = data.results.reduce((acc, obj) => acc.concat([{
                  Zcos: obj.CODICE_GESTIONALE,
                  ZcosDesc: obj.DESCRIZIONE,
                  Zimptotcos: 0
                }]), []);
              var oModelJson = new sap.ui.model.json.JSONModel(aCosData);
              var oTable = sap.ui.getCore().byId(dialogName);
              oTable.setModel(oModelJson, pathName);
              if (
                  inputContextPath &&
                  inputContextPath !== null &&
                  inputContextPath !== ""
                )
                  self.referInputId = inputContextPath;

                oTable.data("inputId", inputId);
                oDialog.open();
            },
            error: function() {}
          });
        },

        onLiveChangeTable: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oTable = self.getView().byId(TABLE_STEP3),
            oTableModel = oTable.getModel(STEP3_LIST),
            classificazoneSonDeep = self
              .getModel(CLASSIFICAZIONE_SON_DEEP)
              .getData(),
            path = oEvent.getSource().getParent().getBindingContextPath();

          if (path === "") return false;

          if (self._indexClassificazioneSON === 0) {
            self._indexClassificazioneSON = oTableModel.getData().length;
          }

          var item = oTableModel.getObject(path);
          var value = oEvent.getParameters().value;
          value.replace(",", ".");
          value = parseFloat(value).toFixed(2);
          value.replace(".", ",");
          item.ZimptotClass = value;
          self
            .getView()
            .getModel(STEP3_LIST)
            .setProperty(path + "/ZimptotClass", item.ZimptotClass);
          var indexClassificazoneSonDeep = classificazoneSonDeep.findIndex(
            (x) => x.Id === item.Id
          );
          if (indexClassificazoneSonDeep > -1) {
            classificazoneSonDeep.splice(indexClassificazoneSonDeep, 1);
            classificazoneSonDeep.push(item);
          } else {
            classificazoneSonDeep.push(item);
          }

          var step3List = self.getView().getModel(STEP3_LIST).getData();
          var sum = 0;
          for (var i = 0; i < step3List.length; i++) {
            var item = step3List[i].ZimptotClass;
            if (!item || item === null) item = "0";
            item.replace(",", ".");
            sum = sum + parseFloat(item);
          }

          wizardModel.setProperty("/Zimptotcos", sum.toFixed(2));
          var oModelJsonCS = new sap.ui.model.json.JSONModel();
          oModelJsonCS.setData(classificazoneSonDeep);
          self.setModel(oModelJsonCS, CLASSIFICAZIONE_SON_DEEP);
        },

        handleHeaderClose: function (oEvent) {
          var self = this;
          var oSelectedItem = oEvent.getParameter("selectedItem");

          if (!oSelectedItem) {
            self.closeDialog();
            return;
          }

          var self = this;
          self
            .getModel(STEP3_LIST)
            .setProperty(
              self.referInputId + "/Zcos",
              oSelectedItem.getCells()[0].getTitle()
            );
          self
            .getModel(STEP3_LIST)
            .setProperty(
              self.referInputId + "/ZcosDesc",
              oSelectedItem.getCells()[1].getText()
            );

          var currentItem = self
            .getModel(STEP3_LIST)
            .getProperty(self.referInputId);
          var array = self.getModel(CLASSIFICAZIONE_SON_DEEP).getData();

          var item = array.filter((x) => x.Id === currentItem.Id);
          if (item && item.length > 0) {
            item[0].Zcos = self
              .getModel(STEP3_LIST)
              .getProperty(self.referInputId + "/Zcos");
            item[0].ZcosDesc = self
              .getModel(STEP3_LIST)
              .getProperty(self.referInputId + "/ZcosDesc");
          }

          //   step3List = self.getModel(STEP3_LIST).getData();
          // step3List[step3List.length-1].Zcos = oSelectedItem.getCells()[0].getTitle();
          // step3List[step3List.length-1].ZcosDesc = oSelectedItem.getCells()[1].getText();

          // self.getModel(STEP3_LIST).setProperty(self.referInputId + "/Zcos",oSelectedItem.getCells()[0].getTitle());
          // self.getModel(STEP3_LIST).setProperty(self.referInputId + "/ZcosDesc",oSelectedItem.getCells()[1].getText());

          // var oModelJson = new sap.ui.model.json.JSONModel();
          // oModelJson.setData(step3List);
          // console.log(step3List);
          // self.setModel(oModelJson, STEP3_LIST);
          self.closeDialog();
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
              // contentLeft: [oBackButton],
              contentMiddle: [oInputFilter],
              contentRight: [oExportButton],
            }),
            contentHeight: "50%",
            contentWidth: "50%",
            verticalScrolling: false,
          });
        },

        handleDialogPress: function (oEvent) {
          var self = this;
          self.oMessageView.navigateBack();
          self.oLogDialog.open();
        },

        //Petro - End

        isIntermediario1Valorized: function () {
          var self = this;
          var oModelWizard = self.getModel(WIZARD_MODEL);

          if (
            oModelWizard.getProperty("/Ziban_i") ||
            oModelWizard.getProperty("/Zbic_i") ||
            oModelWizard.getProperty("/Zcoordest_i") ||
            oModelWizard.getProperty("/Zdenbanca_i") ||
            oModelWizard.getProperty("/Zclearsyst_i") ||
            oModelWizard.getProperty("/Zstras_i") ||
            oModelWizard.getProperty("/Zcivico_i") ||
            oModelWizard.getProperty("/Zort01_i") ||
            oModelWizard.getProperty("/Zregio_i") ||
            oModelWizard.getProperty("/Zpstlz_i") ||
            oModelWizard.getProperty("/Zland1_i")
          ) {
            return true;
          }

          return false;
        },
        
        handleValueHelpZcoordest:function(oEvent){
          var self =this;
          if(!self._zcoordest){
            self._zcoordest = sap.ui.core.Fragment.load({
              id: self.getView().getId(),
              name: "gestioneabilitazioneeson.view.fragment.valueHelp.ValueHelpZcoordest",
              controller: self
            }).then(function(oDialog){
              return oDialog;
            }.bind(this));
          }
          self._zcoordest.then(function(oDialog){
            var oDataModel = self.getView().getModel(),
              filters=[];
            self.getView().setBusy(true);

            filters.push(new FILTER("Lifnr",EQ,self.getView().getModel(WIZARD_MODEL).getProperty("/Lifnr")));
            filters.push(new FILTER("Zwels",EQ,self.getView().getModel(WIZARD_MODEL).getProperty("/PayMode")));

            oDataModel.read("/ZcoordestSet", {
              filters:filters,
              success: function (data, oResponse) {
                self.getView().setBusy(false);
                //data.results.splice(0, 1);
                var oModelJson = new JSONModel({
                  ZcoordestList:data.results
                });
                oDialog.setModel(oModelJson, "ZcoordestModel");
                oDialog._searchField.setVisible(false);
                oDialog.open();
              },
              error: function (error) {
                self.getView().setBusy(false);
              },
            });            
          });
        },
        
        _handleValueHelpCloseZcoordest:function(oEvent){
          var self =this,
            aSelectedItems = oEvent.getParameter("selectedItems"),
            oInput = self.getView().byId("idWizardZcoordest"),
            sProperty = oInput.data("property"),
            wizardModel = self.getModel(WIZARD_MODEL);

          if (aSelectedItems && aSelectedItems.length > 0) {
            wizardModel.setProperty("/" + sProperty, aSelectedItems[0].getTitle());
            self.onSubmitZcoordest(null);
          }
        },

        onComplete:function(oEvent){
          var self = this;
          console.log("aaaaa");
        },

        acceptOnlyNumber: function (sId) {
          var oInput = this.getView().byId(sId);
          oInput.attachBrowserEvent("keypress", function (oEvent) {
            if (isNaN(oEvent.key)) {
              oEvent.preventDefault();
            }
          });
        },

        notEditable:function(sId){
          var oInput = this.getView().byId(sId);
          oInput.attachBrowserEvent("keydown", function (oEvent) {
            oEvent.preventDefault();
          });
        },

        functionReturnValueAnag:function(obj){
          var self =this,
            wizardModel = self.getView().getModel(WIZARD_MODEL);
          console.log("functionReturnValueAnag");
          console.log(obj);
          if(obj.data.MessageType === "S" && obj.data.Lifnr !== ""){
            console.log(obj.data.Lifnr);//TODO:da canc  
            var data = obj.data;
            wizardModel.setProperty("/Lifnr",data.Lifnr);
            self.onSubmitLifnr();
            var control = self.getView().byId("idWizardPayMode");
            control.setSelectedKey(data.Zwels);
            self._preval(data.Iban, data.ZCoordest);            
          }
        },

        functionReturnValueModPag:function(obj){
          //giannilecci
          var self =this;
          console.log("functionReturnValueModPag");
          console.log(obj);
          
          if(obj.data.MessageType === "S"){
            var data = obj.data.QuietVaglia.results[0];
            if(data.Zwels && data.Zwels !== ""){
              console.log(data.Zwels);
              var control = self.getView().byId("idWizardPayMode");
              control.setSelectedKey(data.Zwels);
              self._preval(data.Iban, data.ZCoordest);
            }
          }
        }, 

        _preval:function(iban, zCoordest){
          var self =this,
            oDataModel = self.getModel(),
            wizardModel = self.getView().getModel(WIZARD_MODEL);

          self.getView().setBusy(true);
          var path = self.getModel().createKey("ZwelsDetailSet", {
            Lifnr: wizardModel.getProperty("/Lifnr"),
            Zwels: wizardModel.getProperty("/PayMode"),
          });

          var urlParameters = {
            Iban: iban && iban !== "" ? iban : "",
            Zcoordest: zCoordest && zCoordest !== "" ? zCoordest : ""
          };

          self.getModel().metadataLoaded().then(function () {
              oDataModel.read("/"+path, {
                urlParameters:urlParameters,
                success: function (data, oResponse) {
                  self.getView().setBusy(false);
                  console.log(data);//TODO:Da canc
                  self.resetPayModeRelatedData();
                  wizardModel.setProperty("/PayMode", data.Zwels);
                  wizardModel.setProperty("/Banks", data.Banks);
                  wizardModel.setProperty("/Iban", data.Iban);
                  wizardModel.setProperty("/Swift", data.Swift);
                  wizardModel.setProperty("/Zcoordest", data.ZcoordEst);
                  wizardModel.setProperty("/Zcodprov", data.Zcodprov);

                  wizardModel.setProperty("/isZZcausalevalEditable", data.Banks === 'IT' ? false : true);

                  switch (data.Zwels.toUpperCase()) {
                    case "ID3":
                      wizardModel.setProperty("/isZcoordestEditable", false);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", false);
                      wizardModel.setProperty("/isBicEditable", false);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      wizardModel.setProperty("/Swift", null);
                      wizardModel.setProperty("/Iban", null);
                      break;
                    case "ID4":
                      wizardModel.setProperty("/isZcoordestEditable", false);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", true);
                      wizardModel.setProperty("/isBicEditable", false);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      wizardModel.setProperty("/Swift", null);
                      break;
                    case "ID5":
                      wizardModel.setProperty("/isZcoordestEditable", false);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", true);
                      wizardModel.setProperty("/isBicEditable", false);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      wizardModel.setProperty("/Swift", null);
                      wizardModel.setProperty("/Iban", data && data.Iban && data.Iban !== "" ? data.Iban : null);
                      break;
                    case "ID6":
                      wizardModel.setProperty("/isZcoordestEditable", true);
                      // wizardModel.setProperty("/isZZcausalevalEditable", true);
                      wizardModel.setProperty("/isIbanEditable", false);
                      wizardModel.setProperty("/isBicEditable", true);
                      wizardModel.setProperty("/Iban", data && data.Iban && data.Iban !== "" ? data.Iban : null);

                      wizardModel.setProperty("/Ziban_b", data && data.Zibanb && data.Zibanb !== "" ? data.Zibanb : null);
                      wizardModel.setProperty("/Zbic_b", data && data.Zbicb && data.Zbicb !== "" ? data.Zbicb : null);
                      wizardModel.setProperty("/Zcoordest_b", data && data.Zcoordestb && data.Zcoordestb !== "" ? data.Zcoordestb : null);
                      wizardModel.setProperty("/Zdenbanca_b", data && data.ZdenBanca && data.ZdenBanca !== "" ? data.ZdenBanca : null);
                      wizardModel.setProperty("/Zclearsyst_b", data && data.ZclearSyst && data.ZclearSyst !== "" ? data.ZclearSyst : null);
                      wizardModel.setProperty("/Stras_b", data && data.Stras && data.Stras !== "" ? data.Stras : null);
                      wizardModel.setProperty("/Zcivico_b", data && data.Zcivico && data.Zcivico !== "" ? data.Zcivico : null);
                      wizardModel.setProperty("/Ort01_b", data && data.Ort01 && data.Ort01 !== "" ? data.Ort01 : null);
                      wizardModel.setProperty("/Regio_b", data && data.Regio && data.Regio !== "" ? data.Regio : null);
                      wizardModel.setProperty("/Pstlz_b", data && data.Pstlz && data.Pstlz !== "" ? data.Pstlz : null);
                      wizardModel.setProperty("/Land1_b", data && data.Land1 && data.Land1 !== "" ? data.Land1 : null);


                      wizardModel.setProperty("/Ziban_b", data && data.Zibanb && data.Zibanb !== "" ? data.Zibanb : null);
                      wizardModel.setProperty("/Zbic_b", data && data.Zbicb && data.Zbicb !== "" ? data.Zbicb : null);
                      wizardModel.setProperty("/Zcoordest_b", data && data.Zcoordestb && data.Zcoordestb !== "" ? data.Zcoordestb : null);
                      wizardModel.setProperty("/Zdenbanca_b", data && data.ZdenBanca && data.ZdenBanca !== "" ? data.ZdenBanca : null);
                      wizardModel.setProperty("/Zclearsyst_b", data && data.ZclearSyst && data.ZclearSyst !== "" ? data.ZclearSyst : null);
                      wizardModel.setProperty("/Stras_b", data && data.Stras && data.Stras !== "" ? data.Stras : null);
                      wizardModel.setProperty("/Zcivico_b", data && data.Zcivico && data.Zcivico !== "" ? data.Zcivico : null);
                      wizardModel.setProperty("/Ort01_b", data && data.Ort01 && data.Ort01 !== "" ? data.Ort01 : null);
                      wizardModel.setProperty("/Regio_b", data && data.Regio && data.Regio !== "" ? data.Regio : null);
                      wizardModel.setProperty("/Pstlz_b", data && data.Pstlz && data.Pstlz !== "" ? data.Pstlz : null);
                      wizardModel.setProperty("/Land1_b", data && data.Land1 && data.Land1 !== "" ? data.Land1 : null);

                      wizardModel.setProperty("/Ziban_i",data && data.Zibani && data.Zibani !== "" ? data.Zibani : null);
                      wizardModel.setProperty("/Zbic_i", data && data.Zbici && data.Zbici !== "" ? data.Zbici : null);
                      wizardModel.setProperty("/Zcoordest_i", data && data.Zcoordesti && data.Zcoordesti !== "" ? data.Zcoordesti : null);
                      wizardModel.setProperty("/Zdenbanca_i",data && data.ZdenBancai && data.ZdenBancai !== "" ? data.ZdenBancai : null);
                      wizardModel.setProperty("/Zclearsyst_i",data && data.ZclearSysti && data.ZclearSysti !== "" ? data.ZclearSysti : null);
                      wizardModel.setProperty("/Stras_i",data && data.Strasi && data.Strasi !== "" ? data.Strasi : null);
                      wizardModel.setProperty("/Zcivico_i",data && data.Zcivicoi && data.Zcivicoi !== "" ? data.Zcivicoi : null);
                      wizardModel.setProperty("/Ort01_i",data && data.Ort01i && data.Ort01i !== "" ? data.Ort01i : null);
                      wizardModel.setProperty("/Regio_i",data && data.Regioi && data.Regioi !== "" ? data.Regioi : null);
                      wizardModel.setProperty("/Pstlz_i",data && data.Pstlzi && data.Pstlzi !== "" ? data.Pstlzi : null);
                      wizardModel.setProperty("/Land1_i",data && data.Land1i && data.Land1i !== "" ? data.Land1i : null);



                      break;
                    case "ID10":
                      wizardModel.setProperty("/isZcoordestEditable", true);
                      // wizardModel.setProperty("/isZZcausalevalEditable", false);
                      wizardModel.setProperty("/isIbanEditable", true);
                      wizardModel.setProperty("/isBicEditable", true);
                      wizardModel.setProperty("/ZZcausaleval", "");
                      break;
                  }
                },
                error: function (error) {
                  self.getView().setBusy(false);
                }
              })
          });
        },


        functionReturnValueMC:function(obj){
          var self = this,
            oWizardModel = self.getModel(WIZARD_MODEL);
          if (obj?.Zcodtrib) {
            oWizardModel.setProperty("/Zcodinps", obj?.Zcodinps);
            oWizardModel.setProperty("/Zperiodrifda", obj?.Zperiodrifda);
            oWizardModel.setProperty("/Zperiodrifa", obj?.Zperiodrifa);
          }
        }

        /**/
      }
    );
  }
);
