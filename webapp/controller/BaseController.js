sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/library",
    // "sap/ui/core/Fragment",
    // "sap/ui/model/Filter",
    // "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "../model/formatter",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    library,
    Spreadsheet,
    mobileLibrary,
    MessageBox,
    formatter
  ) {
    "use strict";

    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";

    const EDM_TYPE = library.EdmType;

    const EQ = sap.ui.model.FilterOperator.EQ;
    const BT = sap.ui.model.FilterOperator.BT;
    const NE = sap.ui.model.FilterOperator.NE;
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
    const IbanBeneficiario_SET ="ListaIbanSet";
    const RELOAD_MODEL_AUTH = "reloadModelAuth";

    const FILTER_SEM_OBJ = "ZS4_SOSPAUTPERMANENTE_SRV";
    
    const AUTHORITY_CHECK_ABILITAZIONE = "AuthorityCheckAbilitazione";
    const AUTHORITY_CHECK_SON ="AuthorityCheckSON";

    return Controller.extend(
      "gestioneabilitazioneeson.controller.BaseController",
      {
        formatter: formatter,
        RELOAD_MODEL: "reloadModel",
        RELOAD_MODEL_AUTH: "reloadModelAuth",
        FILTER_AUTH_OBJ:"Z_GEST_ABI",
        FILTER_SON_OBJ: "Z_GEST_SON",
        AUTHORITY_CHECK_ABILITAZIONE:"AuthorityCheckAbilitazione",
        AUTHORITY_CHECK_SON:"AuthorityCheckSON",

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
          oModelJson.setData({});
          oView.setModel(oModelJson, nameModel);
        },

        // ----------------------------- START-----------------------------  //

        openDialog: function (dialogPath) {
          console.log(dialogPath);
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
        getAuthorityCheck:function(object, callback){
          var self = this,
              oAuthModel = self.getOwnerComponent().getModel("ZSS4_CA_CONI_VISIBILITA_SRV"),
              aFilters = [];

          aFilters.push(self.setFilterEQWithKey("SEM_OBJ", FILTER_SEM_OBJ));
          aFilters.push(self.setFilterEQWithKey("AUTH_OBJ", object));

          if(object === self.FILTER_AUTH_OBJ){
            self.getOwnerComponent().getModel("ZSS4_CA_CONI_VISIBILITA_SRV")
            .metadataLoaded().then(function () {
              oAuthModel.read("/ZES_CONIAUTH_SET", {
                filters: aFilters,
                success: function (data) {
                  console.log(data.results);
                  var model = new JSONModel({
                      AGR_NAME: data.results[0].AGR_NAME,
                      FIKRS: data.results[0].FIKRS,
                      BUKRS: data.results[0].BUKRS,
                      PRCTR: data.results[0].PRCTR,
                      Z33Enabled: self.isIncluded(data.results, "ACTV_4", "Z33"),
                      Z01Enabled: self.isIncluded(data.results, "ACTV_1", "Z01"),
                      Z02Enabled: self.isIncluded(data.results, "ACTV_2", "Z02"),
                      Z14Enabled: self.isIncluded(data.results, "ACTV_4", "Z14")                      
                  }); 
                  self.setModelGlobal(model, self.AUTHORITY_CHECK_ABILITAZIONE);
                  callback(true);
                  return;
                },
                error:function(error){
                  var model = new JSONModel({
                      AGR_NAME: null,
                      FIKRS: null,
                      BUKRS: null,
                      PRCTR: null,
                      Z33Enabled: false,
                      Z01Enabled: false,
                      Z02Enabled: false,
                      Z14Enabled: false                      
                  }); 
                  self.setModelGlobal(model, self.AUTHORITY_CHECK_ABILITAZIONE);
                  callback(false);
                  return;
                }
              })
            });
          } 
          else if(object === self.FILTER_SON_OBJ){
            self.getOwnerComponent().getModel("ZSS4_CA_CONI_VISIBILITA_SRV")
            .metadataLoaded().then(function () {             
                oAuthModel.read("/ZES_CONIAUTH_SET", {
                  filters: aFilters,
                  success: function (data) {
                    var model = new JSONModel({
                        AGR_NAME: data.results[0].AGR_NAME,
                        FIKRS: data.results[0].FIKRS,
                        BUKRS: data.results[0].BUKRS,
                        PRCTR: data.results[0].PRCTR,
                        Z34Enabled: self.isIncluded(data.results, "ACTV_4", "Z34"),
                        Z01Enabled: self.isIncluded(data.results, "ACTV_1", "Z01"),
                        Z03Enabled: self.isIncluded(data.results, "ACTV_3", "Z03"),
                        Z02Enabled: self.isIncluded(data.results, "ACTV_2", "Z02"),
                        Z07Enabled: self.isIncluded(data.results, "ACTV_4", "Z07"),
                        Z04Enabled: self.isIncluded(data.results, "ACTV_4", "Z04"),
                        Z05Enabled: self.isIncluded(data.results, "ACTV_4", "Z05"),
                        Z06Enabled: self.isIncluded(data.results, "ACTV_4", "Z06"),
                        Z27Enabled: self.isIncluded(data.results, "ACTV_4", "Z27"),
                        Z08Enabled: self.isIncluded(data.results, "ACTV_4", "Z08"),
                        Z09Enabled: self.isIncluded(data.results, "ACTV_4", "Z09"),           
                    }); 
                    console.log(model.getData());
                    self.setModelGlobal(model, self.AUTHORITY_CHECK_SON);
                    callback(true);
                    return;
                  },
                  error:function(error){
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
                  }
                });
            })
          }
          else{
              var model = new JSONModel({
                  AGR_NAME: null,
                  FIKRS: null,
                  BUKRS: null,
                  PRCTR: null,
                  Z33Enabled: false,
                  Z01Enabled: false,
                  Z02Enabled: false,
                  Z14Enabled: false                      
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

        // ----------------------------- START PAGINATION-----------------------------  //
        getChangePage: function (sNameModel, maxPage) {
          var self = this,
            bFirst = false,
            bLast = false,
            paginatorModel = self.getModel(sNameModel),
            numRecordsForPage = paginatorModel.getProperty("/stepInputDefault"),
            currentPage = paginatorModel.getProperty("/currentPage");

          if (currentPage === 0) {
            return;
          }

          paginatorModel.setProperty(
            "/paginatorSkip",
            (currentPage - 1) * numRecordsForPage
          );

          if (currentPage === maxPage) {
            bFirst = true;
            bLast = false;
            if (currentPage === 1) {
              bFirst = false;
            }
          } else if (currentPage === 1) {
            bFirst = false;
            if (currentPage < maxPage) {
              bLast = true;
            }
          } else if (currentPage > maxPage) {
            bFirst = false;
            bLast = false;
          } else {
            if (currentPage > 1) {
              bFirst = true;
            }
            bLast = true;
          }
          paginatorModel.setProperty("/btnLastEnabled", bLast);
          paginatorModel.setProperty("/btnFirstEnabled", bFirst);
        },
        getLastPaginator: function (sNameModel) {
          var self = this,
            paginatorModel = self.getModel(sNameModel),
            numRecordsForPage = paginatorModel.getProperty("/stepInputDefault");

          paginatorModel.setProperty("/btnLastEnabled", false);
          paginatorModel.setProperty("/btnFirstEnabled", true);
          var paginatorClick = self.paginatorTotalPage;

          paginatorModel.setProperty("/paginatorClick", paginatorClick);
          paginatorModel.setProperty(
            "/paginatorSkip",
            (paginatorClick - 1) * numRecordsForPage
          );

          paginatorModel.setProperty(
            "/currentPage",
            self.paginatorTotalPage === 0 ? 1 : self.paginatorTotalPage
          );
        },
        getFirstPaginator: function (sNameModel) {
          var self = this,
            paginatorModel = self.getModel(sNameModel);

          paginatorModel.setProperty("/btnLastEnabled", true);
          paginatorModel.setProperty("/btnFirstEnabled", false);
          paginatorModel.setProperty("/paginatorClick", 0);
          paginatorModel.setProperty("/paginatorSkip", 0);
          paginatorModel.setProperty("/currentPage", 1);
        },
        resetPaginator: function (sNameModel) {
          var self = this,
            paginatorModel = self.getModel(sNameModel);
          paginatorModel.setProperty("/btnFirstEnabled", false);
          paginatorModel.setProperty("/btnNextEnabled", false);
          paginatorModel.setProperty("/btnLastEnabled", false);
          paginatorModel.setProperty("/recordForPageEnabled", false);
          paginatorModel.setProperty("/currentPageEnabled", true);
          paginatorModel.setProperty("/currentPage", 1);
          paginatorModel.setProperty("/maxPage", 1);
          paginatorModel.setProperty("/paginatorClick", 0);
          paginatorModel.setProperty("/paginatorSkip", 0);
        },
        // ----------------------------- END PAGINATION-----------------------------  //
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

        _setFilterBTValue: function (aFilters, sInputFrom, sInputTo) {
          if (
            sInputFrom &&
            sInputFrom.getValue() &&
            sInputTo &&
            sInputTo.getValue()
          ) {
            aFilters.push(
              new FILTER(
                sInputFrom.data("searchPropertyModel"),
                BT,
                sInputFrom.getValue(),
                sInputTo.getValue()
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

        _isOneValueEmpty: function (sValue1, sValue2) {
          if (
            (sValue1.getValue() !== null &&
              sValue1.getValue() !== "" &&
              (sValue2.getValue() === null || sValue2.getValue() === "")) ||
            (sValue2.getValue() !== null &&
              sValue2.getValue() !== "" &&
              (sValue1.getValue() === null || sValue1.getValue() === ""))
          )
            return true;
          else return false;
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

          console.log(sZdataprot.getValue());

          /*START Validation*/
          object.isValidate = true;

          if(!sGjahr.getValue() || sGjahr.getValue() === null || sGjahr.getValue() === "" ){
            object.isValidate = false;
            object.validationMessage = "msgNoRequiredField";
            return object;
          }

          if(!sZufficioCont.getValue() || sZufficioCont.getValue() === null || sZufficioCont.getValue() === "" ){
            object.isValidate = false;
            object.validationMessage = "msgNoRequiredField";
            return object;
          }

          /*Znumsop*/
          if (self._isOneValueEmpty(sZnumsopFrom, sZnumsopTo)) {
            object.isValidate = false;
            object.validationMessage = "msgZnumsopRequiredBoth";
            return object;
          }

          /*Zdatadop*/
          if (self._isOneValueEmpty(sZdatasopFrom, sZdatasopTo)) {
            object.isValidate = false;
            object.validationMessage = "msgZdatasopRequiredBoth";
            return object;
          }

          /*Fipos*/
          if (self._isOneValueEmpty(sFiposFrom, sFiposTo)) {
            object.isValidate = false;
            object.validationMessage = "msgFiposRequiredBoth";
            return object;
          }

          /*STOP Validation*/

          /*Fill Filters*/

          //TO DO - punto aperto Esercizio se MC
          self._setFilterEQValue(filters, sGjahr);
          self._setFilterEQValue(filters, sZzamministr);
          self._setFilterEQValue(filters, sCapitolo);
          self._setFilterEQValue(filters, sZufficioCont);
          self._setFilterBTValue(filters, sZnumsopFrom, sZnumsopTo);
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

          self._setFilterBTValue(filters, sZdatasopFrom, sZdatasopTo);
          self._setFilterEQValue(filters, sZdataprot);
          self._setFilterEQValue(filters, sZnumprot);
          self._setFilterEQValue(filters, sBeneficiario);
          self._setFilterBTValue(filters, sFiposFrom, sFiposTo);
          self._setFilterEQValue(filters, sFistl);

          console.log(filters);

          object.filters = filters;
          return object;
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
          console.log("buttonTypeFormatter", aMessages);

          aMessages.forEach(function (sMessage) {
            switch (sMessage.type) {
              case "Error":
                sHighestSeverityIcon = "Negative";
                break;
              case "Warning":
                sHighestSeverityIcon =
                  sHighestSeverityIcon !== "Negative"
                    ? "Critical"
                    : sHighestSeverityIcon;
                break;
              case "Success":
                sHighestSeverityIcon =
                  sHighestSeverityIcon !== "Negative" &&
                  sHighestSeverityIcon !== "Critical"
                    ? "Success"
                    : sHighestSeverityIcon;
                break;
              default:
                sHighestSeverityIcon = !sHighestSeverityIcon
                  ? "Neutral"
                  : sHighestSeverityIcon;
                break;
            }
          });
          console.log("sHighestSeverityIcon", sHighestSeverityIcon);
          return sHighestSeverityIcon;
        },

        highestSeverityMessages: function () {
          var self = this;
          var oBundle = self.getResourceBundle();
          var sHighestSeverityIconType = self.buttonTypeFormatter();
          var sHighestSeverityMessageType;

          switch (sHighestSeverityIconType) {
            case "Negative":
              sHighestSeverityMessageType = "Error";
              break;
            case "Critical":
              sHighestSeverityMessageType = "Warning";
              break;
            case "Success":
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
              console.log(iNumberOfMessages, oMessageItem);
              return oMessageItem.type === sHighestSeverityMessageType
                ? ++iNumberOfMessages
                : iNumberOfMessages;
            }, 0);
          console.log(self.getView().getModel(LOG_MODEL).getData().length);
          return result + " " + oBundle.getText("msgTitleHandler");
        },

        // Set the button icon according to the message with the highest severity
        buttonIconFormatter: function () {
          var self = this;
          var sIcon;
          var aMessages = self.getView().getModel(LOG_MODEL).getData();
          console.log("buttonIconFormatter", aMessages);
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
          console.log("sIcon", sIcon);
          return sIcon;
        },

        filterMessage: function (oEvent) {
          var self = this,
            sValue = oEvent.getParameter("value"),
            messageModel = self.getView().getModel(MESSAGE_MODEL).getData(),
            oModel = new JSONModel();
          if (sValue && sValue.trim().length > 0) {
            var array = messageModel.filter((el) => {
              console.log("subtitle", el.subtitle);
              return el.subtitle.includes(sValue);
            });
            console.log("array", array);
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
          console.log("pasasaa");
          console.log("array", array);
          if (array.length > 0) {
            array.forEach((el) => {
              logModel.unshift(self.formatMessage(el));
            });

            console.log("logModel UUUUUUU", logModel);
            oModel.setData(logModel);

            self.setModel(oModel, LOG_MODEL);
            self.oMessageView.setModel(oModel, LOG_MODEL);

            var arrayError = array.filter((el) => el.Msgty === "E");

            if (arrayError.length > 0) {
              self.setMessage("titleDialogError", "msgError", "error");
              return false;
            }
            return true;
          } else {
            oModel.setData([]);
            console.log("oModel vuoto", oModel);
            self.setModel(oModel, LOG_MODEL);
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
        _getIdElement: function (oEvent) {
          var longId = oEvent.getSource().getId();
          console.log(longId);
          var arrayId = longId.split("-");
          var id = arrayId[arrayId.length - 1];
          return id;
        },

        onSubmitZufficioCont: function (oEvent) {
          var self = this;
          self.fillZvimDescrufficio();
          self.fillZtipodisp3List();
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

        onLiveChange: function (oEvent) {
          var self = this,
            sNewValue,
            wizardModel = self.getModel(WIZARD_MODEL);

          var sInputId = self._getIdElement(oEvent);
          console.log(sInputId);
          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");

          sNewValue = oEvent.getSource().getValue();
          console.log("passa", sProperty);
          wizardModel.setProperty("/" + sProperty, sNewValue);
        },

        onLiveChangePayMode: function (oEvent) {
          var self = this,
            sNewValue,
            wizardModel = self.getModel(WIZARD_MODEL);

          var sInputId = self._getIdElement(oEvent);
          console.log(sInputId);
          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");

          sNewValue = oEvent.getSource().getValue();
          console.log("passa", sProperty);
          wizardModel.setProperty("/" + sProperty, sNewValue.toUpperCase());
        },

        onSubmitGjahr: function (oEvent) {
          var self = this;
          self.fillZvimDescrufficio();
          self.fillZtipodisp3List();
        },

        onSubmitKostl: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Kostl = wizardModel.getProperty("/Kostl");

          if (Kostl !== null) {
            oView.setBusy(true);
            var path = self.getModel().createKey(KostlMcSet_SET, {
              Kostl: Kostl,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    console.log(data);
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
          console.log("in sub", Saknr);
          if (Saknr !== null) {
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
                    console.log(data);
                    wizardModel.setProperty("/Skat", data.Skat);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        onLiveChangeZtipodisp3List: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL);
          var sNewValue = oEvent.getSource().getSelectedKey();
          var sNewDesc = oEvent.getSource().getValue();
          wizardModel.setProperty("/Ztipodisp3", sNewValue);
          wizardModel.setProperty("/Zdesctipodisp3", sNewDesc);
          if (sNewValue !== null) self.fillFipos();
        },

        fillFipos: function () {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            Gjahr = wizardModel.getProperty("/Gjahr"),
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Ztipodisp3 = wizardModel.getProperty("/Ztipodisp3"),
            ZufficioCont = wizardModel.getProperty("/ZufficioCont");

          if (Gjahr !== null && ZufficioCont !== null && Ztipodisp3 !== null) {
            oView.setBusy(true);
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + Fipos_SET, {
                  urlParameters: {
                    Gjahr: Gjahr,
                    ZufficioCont: ZufficioCont,
                    Ztipodisp3: Ztipodisp3,
                  },
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    wizardModel.setProperty("/FiposList", data.results);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        goToTwo: function (oEvent) {
          var self = this,
            wizardId = oEvent.getSource().getParent().getId(),
            wizard = self.getView().byId(wizardId),
            wizardType = wizard.data("wizardType"),
            wizardModel = self.getView().getModel(WIZARD_MODEL);

          if (!wizardModel.getProperty("/isInChange")) return;

          if (wizardType !== WIZARD_TYPE_DETAIL) {
            console.log(wizardType);
            var Gjahr = wizardModel.getProperty("/Gjahr"),
              Ztipodisp3 = wizardModel.getProperty("/Ztipodisp3"),
              ZufficioCont = wizardModel.getProperty("/ZufficioCont"),
              Fistl = wizardModel.getProperty("/Fistl"),
              Kostl = wizardModel.getProperty("/Kostl"),
              Saknr = wizardModel.getProperty("/Saknr"),
              Fipos = wizardModel.getProperty("/Fipos");

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
                AgrName: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData().AGR_NAME,
                Fikrs:self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData().FIKRS,
                Prctr:self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData().PRCTR                
              };
              var oDataModel = self.getModel();
              oDataModel.callFunction("/" + URL_VALIDATION_1, {
                method: "GET",
                urlParameters: oParam,
                success: function (oData, response) {
                  console.log(oData);
                  self.getView().setBusy(false);
                  var arrayMessage = oData.results;
                  if (!self.isErrorInLog(arrayMessage)) {                    
                    wizard.previousStep();
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
                      "Zimptot",
                      "ZimptotDivisa",
                    ]);
                  }
                },
                error: function (oError) {
                  self.getView().setBusy(false);
                  wizard.previousStep();
                },
              });
            } else {
              self._setMessage(
                "titleDialogError",
                "msgNoRequiredField",
                "error"
              );
              wizard.previousStep();
              return false;
            }
          } else {
            self.updateDataSON([
              "Gjahr",
              "ZufficioCont",
              "Fipos",
              "Fistl",
              "Zdesctipodisp3",
              "Zimptot",
              "ZimptotDivisa",
            ]);
          }
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
            Banks = wizardModel.getProperty("/Banks");

          if (!wizardModel.getProperty("/isInChange")) return;

          var oParam, url;
          if (wizardType === WIZARD_TYPE_DETAIL) {
            url = URL_VALIDATION_D2;
            oParam = {
              Iban: !Iban || Iban === null ? "" : Iban,
              Lifnr: !Lifnr || Lifnr === null ? "" : Lifnr,
              Zcoordest: !Zcoordest || Zcoordest === null ? "" : Zcoordest,
              Zwels: !Zwels || Zwels === null ? "" : Zwels,
              ZZcausaleval: !ZZcausaleval || ZZcausaleval === null ? "" : ZZcausaleval,
              Banks: !Banks || Banks === null ? "" : Banks,
            };
          } else {
            url = URL_VALIDATION_2;
            oParam = {
              Zimptot: !Zimptot || Zimptot === null ? 0 : Zimptot,
              Iban: !Iban || Iban === null ? "" : Iban,
              Lifnr: !Lifnr || Lifnr === null ? "" : Lifnr,
              Zcoordest: !Zcoordest || Zcoordest === null ? "" : Zcoordest,
              Zwels: !Zwels || Zwels === null ? "" : Zwels,
              ZZcausaleval: !ZZcausaleval || ZZcausaleval === null ? "" : ZZcausaleval,
              Banks: !Banks || Banks === null ? "" : Banks, 
            };
          }

          var oDataModel = self.getModel();
          self.getView().setBusy(true);
          oDataModel.callFunction("/" + url, {
            method: "GET",
            urlParameters: oParam,
            success: function (oData, response) {
              console.log(oData);
              self.getView().setBusy(false);
              var arrayMessage = oData.results;
              if (!self.isErrorInLog(arrayMessage)) {                
                wizard.previousStep();
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
                          sum = 0;
                        array.push({
                          Zchiavesop: null,
                          Bukrs: null,
                          Zetichetta: null,
                          Zposizione: null,
                          ZstepSop: null,
                          Zzcig: null,
                          Zzcup: null,
                          Zcpv: null,
                          ZcpvDesc: null,
                          Zcos: null,
                          ZcosDesc: null,
                          Belnr: null,
                          ZimptotClass: null,
                          Zflagcanc: null,
                          ZstatoClass: null,
                          Id: 0,
                        });

                        for (var i = 0; i < data.results.length; i++) {
                          var item = data.results[i];
                          item.Id = i + 1;
                          sum = sum + parseFloat(item.ZimptotClass);
                          array.push(item);
                        }
                        var oModelJson = new sap.ui.model.json.JSONModel();
                        oModelJson.setData(array);
                        self.getView().setModel(oModelJson, STEP3_LIST);
                        self
                          .getView()
                          .getModel(WIZARD_MODEL)
                          .setProperty("/Zimptotcos", sum.toFixed(2));
                      },
                      error: function (error) {
                        console.log(error);
                        var oModelJson = new sap.ui.model.json.JSONModel();
                        oModelJson.setData([]);
                        self.getView().setModel(oModelJson, STEP3_LIST);
                      },
                    });
                  });
              }
            },
            error: function (oError) {
              self.getView().setBusy(false);
              wizard.previousStep();
            },
          });
        },
        
        goToFour: function (oEvent) {
          var self = this,
            wizardId = oEvent.getSource().getParent().getId(),
            wizard = self.getView().byId(wizardId),
            wizardType = wizard.data("wizardType");

          var wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            Zimptot = wizardModel.getProperty("/Zimptot"),
            Step3List = self.getModel(STEP3_LIST).getData(),
            Zimptotcos = wizardModel.getProperty("/Zimptotcos");

          if (!wizardModel.getProperty("/isInChange")) return;

          var len = Step3List.lenght - 1;
          if (len <= 0) {
            self._setMessage("titleDialogError", "msgNoRequiredField", "error");
            return false;
          }

          console.log("Zimptot", Zimptot);
          var oParam = {
            Zimptot: !Zimptot || Zimptot === null ? 0 : Zimptot,
            Zimptotcos: !Zimptotcos || Zimptotcos === null ? 0 : Zimptotcos,
          };

          console.log(oParam);

          var url =
            wizardType === WIZARD_TYPE_DETAIL
              ? URL_VALIDATION_D3
              : URL_VALIDATION_3;
          self.getView().setBusy(true);
          oDataModel.callFunction("/" + url, {
            method: "GET",
            urlParameters: oParam,
            success: function (oData, response) {
              console.log(oData);
              self.getView().setBusy(false);
              var arrayMessage = oData.results;
              if (!self.isErrorInLog(arrayMessage)) {
                wizard.previousStep();
              }
            },
            error: function (oError) {
              self.getView().setBusy(false);
              wizard.previousStep();
            },
          });
        },
        
        goToFinish:function(oEvent, callback){
          var self = this,
              wizardId = oEvent.getSource().getParent().getId(),
              wizard = self.getView().byId(wizardId),
              wizardType = wizard.data("wizardType");
          
          var wizardModel = self.getModel(WIZARD_MODEL),
              oDataModel = self.getModel(),    
              Zlocpag = wizardModel.getProperty("/Zlocpag"),
              Zzonaint = wizardModel.getProperty("/Zzonaint"),
              Zcausale = wizardModel.getProperty("/Zcausale");

          if (!Zlocpag || Zlocpag === null || Zlocpag === "" ||
              !Zzonaint || Zzonaint === null || Zzonaint === "" ||
              !Zcausale || Zcausale === null || Zcausale === "" ) {
            self._setMessage("titleDialogError", "msgNoRequiredField", "error");    
            callback("msgNoRequiredField");
            return;
          }

          var oParam = {
            Zlocpag: !Zlocpag || Zlocpag === null ? "" : Zlocpag,
            Zzonaint: !Zzonaint || Zzonaint === null ? "" : Zzonaint,
          };
          
          var url = wizardType === WIZARD_TYPE_DETAIL ? URL_VALIDATION_D4 : URL_VALIDATION_4;
          self.getView().setBusy(true);
          oDataModel.callFunction("/" + url, {
            method: "GET",
            urlParameters: oParam,
            success: function (oData, response) {
              self.getView().setBusy(false);
              var arrayMessage = oData.results;
              if (!self.isErrorInLog(arrayMessage)){ 
                callback("ValidationError");
                return;
              }
              callback("ValidationSuccess");
            },
            error: function (oError) {
              self.getView().setBusy(false);
              callback("ValidationError");
            }
          });
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

        updateDataSON: function (array) {
          var self = this,
            valueProperty = null,
            dataSONModel = self.getModel(DataSON_MODEL),
            wizardModel = self.getModel(WIZARD_MODEL);

          for (let i = 0; i < array.length; i++) {
            valueProperty = wizardModel.getProperty("/" + array[i]);
            dataSONModel.setProperty("/" + array[i], valueProperty);
          }
        },

        fiilSedeBeneficiario: function (Lifnr) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView();

          var filter = [self.setFilterEQWithKey("Lifnr", Lifnr)];
          console.log("filter", filter);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + SedeBeneficiario_SET, {
                filters: filter,
                success: function (data, oResponse) {
                  oView.setBusy(false);
                  console.log("sede", data);
                  wizardModel.setProperty("/StrasList", data.results);
                  if (data.results.length > 0) {
                    wizardModel.setProperty(
                      "/FirstKeyStras",
                      data.results[0]["Stras"]
                    );
                    wizardModel.setProperty("/Ort01", data.results[0]["Ort01"]);
                    wizardModel.setProperty("/Regio", data.results[0]["Regio"]);
                    wizardModel.setProperty("/Pstlz", data.results[0]["Pstlz"]);
                    wizardModel.setProperty("/Land1", data.results[0]["Land1"]);
                    if(data.results[0].Regio && data.results[0].Regio !== null && data.results[0].Regio !== ""){
                      wizardModel.setProperty("/Zlocpag", data.results[0].Regio);
                    }
                  } else {
                    wizardModel.setProperty("/FirstKeyStras", "");
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
        onLiveChangeStras: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Lifnr = wizardModel.getProperty("/Lifnr"),
            StrasList = wizardModel.getProperty("/StrasList");

          var array = StrasList.filter(
            (el) => el.Stras === oEvent.getParameter("value")
          );

          console.log(array);
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
                    console.log(data);
                    oView.setBusy(false);
                    wizardModel.setProperty("/Ort01", data.Ort01);
                    wizardModel.setProperty("/Regio", data.Regio);
                    wizardModel.setProperty("/Pstlz", data.Pstlz);
                    wizardModel.setProperty("/Land1", data.Land1);
                    if(data.Regio && data.Regio !== null && data.Regio !== ""){
                      wizardModel.setProperty("/Zlocpag", data.Regio);
                    }
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },
        onSubmitPayMode: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            PayMode = wizardModel.getProperty("/PayMode");

          if (PayMode.toUpperCase() === "ID6") {
            wizardModel.setProperty("/isZcoordestEditable", true);
            wizardModel.setProperty("/isZZcausalevalEditable", true);
          } else {
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
        },
        onSubmitZcoordest: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Zcoordest = wizardModel.getProperty("/Zcoordest");

          console.log(Lifnr);
          if (Zcoordest !== null) {
            oView.setBusy(true);
            var path = self.getModel().createKey(ZcoordestSet_SET, {
              Zcoordest: Zcoordest,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    console.log(data);
                    wizardModel.setProperty("/Swift", data.Swift);
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        onSubmitLifnr: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Lifnr = wizardModel.getProperty("/Lifnr");

          console.log(Lifnr);
          if (Lifnr !== null) {
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
                    console.log(data);
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
                    self.getIban(Lifnr);
                    self.fiilSedeBeneficiario(Lifnr);
                    self.fillBanks();
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        
        getIban(lifnr){
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
                }
                else{
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
            Lifnr = wizardModel.getProperty("/Lifnr");

          if (Zwels !== null && Iban !== null && Lifnr !== null) {
            oView.setBusy(true);
            var path = self.getModel().createKey(ZbanksSet_SET, {
              Iban: Iban,
              Zwels: Zwels,
              Lifnr: Lifnr,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    console.log(data);
                    wizardModel.setProperty("/Banks", data.Banks);
                    if(data.Banks.toUpperCase() !== 'IT'){
                      self.getView().getModel(WIZARD_MODEL).setProperty("/isZZcausalevalEditable", true);
                    }else{
                      self.getView().getModel(WIZARD_MODEL).setProperty("/isZZcausalevalEditable", false);
                    }
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
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
            }
          }
          return checklist;
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

        digitalSign:function(){
          var self =this;

        }

        /*WIZARD - END*/
      }
    );
  }
);
