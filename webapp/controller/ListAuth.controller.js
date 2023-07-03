sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
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
  ],
  function (
    BaseController,
    JSONModel,
    Fragment,
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

    const EDM_TYPE = library.EdmType;

    const ACTION_MODEL = "actionModel";

    const PAGINATOR_MODEL = "paginatorModel";
    const LISTAUTH_MODEL = "listAuthModel";
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";
    const AUTH_SET = "AbilitazioneSet";
    const AUTH_MODEL_EXPORT = "AuthModelExport";

    const TABLE_LISTAUTH = "idListAuthTable";
    const TABLE_CHANGEAUTH = "idChangeAuthTable";
    const CHECK_ALL = "idCheckSelectAll";

    const URL_DEEP = "DeepAbilitazioneSet";
    const OPTION_VALIDATE = "VAL";
    const OPTION_CHANGE = "RET";

    return BaseController.extend(
      "gestioneabilitazioneeson.controller.ListAuth",
      {
        formatter: formatter,

        onInit: function () {
          var self = this;
          var oListAuthModel, oPaginatorModel;
          oListAuthModel = new JSONModel({
            listAuthTableTitle:
              this.getResourceBundle().getText("listAuthPageTitle"),
            total: 0,
            isSelectedAll: false,
            isChange: false,
            checkList: [],
            changeList: [],
            dateForAll: null,
          });
          oPaginatorModel = new JSONModel({
            btnPrevEnabled: false,
            btnFirstEnabled: false,
            btnNextEnabled: false,
            btnLastEnabled: false,
            recordForPageEnabled: false,
            currentPageEnabled: true,
            stepInputDefault: 3,
            currentPage: 1,
            maxPage: 1,
            paginatorSkip: 0,
            paginatorClick: 0,
          });

          this.setModel(oListAuthModel, LISTAUTH_MODEL);
          this.setModel(oPaginatorModel, PAGINATOR_MODEL);

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

          this.oMessageView = new MessageView({
            showDetailsPageHeader: false,
            items: {
              path: "logModel>/",
              template: oMessageTemplate,
            },
          });

          var oExportButton = new Button({
            text: this.getResourceBundle().getText("btnExport"),
            type: "Emphasized",
            visible: true,
            press: function () {
              self.configExportMessage();
            },
          });

          var oInputFilter = new Input({
            placeholder: this.getResourceBundle().getText("msgSearch"),
            visible: true,
            liveChange: function (oEvent) {
              self.filterMessage(oEvent);
            },
          });

          this.oMessageView.setModel(oModel, "logModel");
          this.setModel(oModel, LOG_MODEL);
          this.setModel(oModel, MESSAGE_MODEL);

          this.oDialog = new Dialog({
            resizable: true,
            content: this.oMessageView,
            state: "Error",
            beginButton: new Button({
              press: function () {
                this.getParent().close();
              },
              text: this.getResourceBundle().getText("btnClose"),
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
          this.oMessageView.navigateBack();
          this.oDialog.open();
        },

        // ----------------------------- START INITIALIZATION -----------------------------  //
        onBeforeRendering: function () {
          var self = this;
          self.resetPaginator(PAGINATOR_MODEL);
          self._setEntityProperties();
          var oTable = self.getView().byId(TABLE_LISTAUTH);
          oTable._getSelectAllCheckbox().setVisible(false);
        },

        onUpdateFinished: function (oEvent) {
          var sTitle,
            oTable = oEvent.getSource(),
            listAuthModel = this.getModel(LISTAUTH_MODEL),
            oPaginatorPanel = this.getView().byId("paginatorPanel"),
            iTotalItems = listAuthModel.getProperty("/total"),
            isChange = listAuthModel.getProperty("/isChange");

          if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
            if (isChange) {
              sTitle = this.getResourceBundle().getText(
                "changeAuthPageTitleCount",
                [iTotalItems]
              );
            } else {
              sTitle = this.getResourceBundle().getText(
                "listAuthPageTitleCount",
                [iTotalItems]
              );
            }
          } else {
            if (isChange) {
              sTitle = this.getResourceBundle().getText("changeAuthPageTitle");
            } else {
              sTitle = this.getResourceBundle().getText("listAuthPageTitle");
            }
          }
          listAuthModel.setProperty("/listAuthTableTitle", sTitle);
          oPaginatorPanel.setVisible(!isChange);
          this.getView().setBusy(false);
        },

        _setEntityProperties() {
          var self = this,
            oView = self.getView();
          self.resetEntityModel(AUTH_MODEL_EXPORT);
          self.resetEntityModel(AUTH_SET);
          oView.setBusy(true);
          self._getEntity(false, true);
        },

        _getEntity: function (getAll = false, getKey = false) {
          var self = this,
            obj = {},
            oDataModel = self.getModel(),
            nameModel = null,
            oView = self.getView(),
            paginatorModel = self.getModel(PAGINATOR_MODEL),
            numRecordsForPage = paginatorModel.getProperty("/stepInputDefault"),
            listAuthModel = self.getModel(LISTAUTH_MODEL);

          oView.setBusy(true);

          if (getAll) {
            obj = {
              // AgrName: sAgrName,
            };
            nameModel = AUTH_MODEL_EXPORT;
          } else {
            obj = {
              $top: numRecordsForPage,
              $skip: paginatorModel.getProperty("/paginatorSkip"),
              // AgrName: sAgrName,
            };
            nameModel = AUTH_SET;
          }

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + AUTH_SET, {
                urlParameters: obj,
                success: function (data, oResponse) {
                  console.log("data", data.results);
                  if (getKey) {
                    var counter = JSON.parse(oResponse.headers["sap-message"]);
                    listAuthModel.setProperty("/total", counter.message);
                    self.counterRecords(counter.message);
                  }
                  var res = data.results;
                  var oModelJson = new sap.ui.model.json.JSONModel();
                  oModelJson.setData(res);
                  oView.setModel(oModelJson, nameModel);
                  oView.setBusy(false);

                  getAll ? listAuthModel.setProperty("/checkList", res) : "";
                  var oTable = self.getView().byId(TABLE_LISTAUTH);

                  var isSelectedAll =
                    listAuthModel.getProperty("/isSelectedAll");
                  if (isSelectedAll) {
                    oTable.selectAll();
                  } else {
                    var list = listAuthModel.getProperty("/checkList");

                    for (let y = 0; y < res.length; y++) {
                      for (let i = 0; i < list.length; i++) {
                        if (
                          res[y]["Bukrs"] === list[i]["Bukrs"] &&
                          res[y]["Gjahr"] === list[i]["Gjahr"] &&
                          res[y]["Zchiaveabi"] === list[i]["Zchiaveabi"] &&
                          res[y]["ZstepAbi"] === list[i]["ZstepAbi"]
                        ) {
                          oTable.setSelectedItem(oTable.getItems()[y]);
                        }
                      }
                    }
                  }
                },
                error: function (error) {
                  oView.setBusy(false);
                },
              });
            });
        },

        // ----------------------------- END INITIALIZATION -----------------------------  //
        // ----------------------------- GENERAL  -----------------------------  //
        _setDialogWarning: function (sTitle, sMessage) {
          var self = this;
          var oBundle = self.getResourceBundle();
          var oDialog = new sap.m.Dialog({
            title: oBundle.getText(sTitle),
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
                self._saveChanges("X");
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

        // ----------------------------- END GENERAL  -----------------------------  //

        // ----------------------------- START MANAGE FIPEX - FIPOS DIALOG  -----------------------------  //
        handlePopoverPress: function (oEvent) {
          var self = this;
          var oControl = oEvent.getSource();
          var oDialog = self.openDialog(
            "gestioneabilitazioneeson.view.fragment.dialog.FiposAndFipex"
          );
          oDialog.openBy(oControl);
        },

        handleClosePress: function () {
          this.closeDialog();
        },

        // ----------------------------- END MANAGE FIPEX - FIPOS DIALOG  -----------------------------  //

        // ----------------------------- START ON CLICK BUTTON  -----------------------------  //
        //########   LIST #############//
        onAdd: function () {
          var self = this;
          self.getRouter().navTo("addAuth");
        },
        onNavBack: function () {
          var self = this;
          self.getRouter().navTo("startPage");
        },

        onExport: async function (oEvent) {
          var self = this;
          self._configExport();
        },

        onChange: function () {
          var self = this,
            listAuthModel = self.getModel(LISTAUTH_MODEL),
            listCheck = listAuthModel.getProperty("/checkList");

          listAuthModel.setProperty("/isChange", true);
          listAuthModel.setProperty("/total", listCheck.length);

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(listCheck);
          self.getView().setModel(oModelJson, AUTH_SET);
        },

        onCheck: function (oEvent) {
          var self = this,
            oTable = self.getView().byId(TABLE_LISTAUTH);
          var isChecked = oEvent.getParameter("selected"),
            listAuthModel = self.getModel(LISTAUTH_MODEL);
          if (isChecked) {
            self._getEntity(true, false);
            listAuthModel.setProperty("/isSelectedAll", true);
            oTable.selectAll();
          } else {
            listAuthModel.setProperty("/checkList", []);
            oTable.removeSelections(true);
            listAuthModel.setProperty("/isSelectedAll", false);
          }
        },

        onValidate: function () {
          var self = this,
            listAuthModel = self.getModel(LISTAUTH_MODEL),
            oDataModel = self.getModel(),
            checklist = listAuthModel.getProperty("/checkList");

          var entityRequestBody = {
            Bukrs: "",
            Gjahr: "",
            Zchiaveabi: "key",
            OperationType: OPTION_VALIDATE,
            AbilitazioneSet: checklist,
            AbilitazioneMessageSet: [],
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            success: function (result) {
              self.getView().setBusy(false);
              var arrayMessage = result.AbilitazioneMessageSet.results;
              console.log(arrayMessage);
              var isSuccess = self.isErrorInLog(arrayMessage);
              console.log(isSuccess);
              if (isSuccess) {
                self.setMessage("btnValidate", "msgValidationOK", "success");
                self._resetAfterAction();
              }
              return false;
            },
            error: function (err) {
              self.getView().setBusy(false);

              console.log(err);
            },
            async: true,
            urlParameters: {},
          });
        },

        //########   CHANGE  #############//

        onSaveChanges: function () {
          var self = this;

          self._saveChanges();
        },
        onNavBackChange: function () {
          var self = this,
            oPaginatorPanel = this.getView().byId("paginatorPanel"),
            listAuthModel = self.getModel(LISTAUTH_MODEL);
          listAuthModel.setProperty("/isChange", false);
          oPaginatorPanel.setVisible(true);
          // var oTable = self.getView().byId(TABLE_LISTAUTH);
          // var checkBox = self.getView().byId(CHECK_ALL);
          // checkBox.setSelected(false);
          // self.resetPaginator(PAGINATOR_MODEL);
          // listAuthModel.setProperty("/isSelectedAll", false);
          // oTable.removeSelections(true);
          // listAuthModel.setProperty("/checkList", []);
          self._setEntityProperties();
        },

        onChangeUpdateDateAll: function (oEvent) {
          var self = this,
            listAuthModel = self.getModel(LISTAUTH_MODEL),
            oTable = self.getView().byId(TABLE_CHANGEAUTH),
            oTableModel = oTable.getModel(AUTH_SET),
            value = listAuthModel.getProperty("/dateForAll"),
            dtPicker = self.getView().byId("idDateAllChange"),
            checkList = listAuthModel.getProperty("/checkList");

          var date = self.formatter.formateDateForDeep(dtPicker.getDateValue());
          var changeList = [];
          console.log("data all", date);
          console.log("data all  fff", value);
          checkList.forEach((oItem) => {
            changeList.push({
              Bukrs: oItem.Bukrs,
              Gjahr: oItem.Gjahr,
              Zchiaveabi: oItem.Zchiaveabi,
              ZstepAbi: oItem.ZstepAbi,
              Datbi: date,
            });
          });
          var oItems = oTable.getItems();

          value = self.formatter.formatStringForDate(value);
          console.log("value", value);
          oItems.forEach(function (oItem) {
            var oContext = oItem.getBindingContextPath();

            oTableModel.setProperty(oContext + "/Datbi", value);
          });
          console.log(changeList);
          listAuthModel.setProperty("/changeList", changeList);
        },

        // ----------------------------- END ON CLICK BUTTON  -----------------------------  //
        // ----------------------------- START MANAGE ROW  -----------------------------  //

        onSelectedItem: function (oEvent) {
          var self = this,
            oTable = self.getView().byId(TABLE_LISTAUTH),
            listAuthModel = self.getModel(LISTAUTH_MODEL),
            isSelectedRow = oEvent.getParameter("selected"),
            oTableModel = oTable.getModel(AUTH_SET),
            list = listAuthModel.getProperty("/checkList"),
            tableItems = oTable.getItems(),
            selectedItems = oTable.getSelectedItems();

          var checkBox = self.getView().byId(CHECK_ALL);
          checkBox.setSelected(false);
          listAuthModel.setProperty("/isSelectedAll", false);

          if (isSelectedRow) {
            for (let i = 0; i < selectedItems.length; i++) {
              var p = selectedItems[i].getBindingContextPath();
              var oItem = oTableModel.getObject(p);
              var gg = list.includes(oItem);
              gg ? "" : list.push(oItem);
            }
            listAuthModel.setProperty("/checkList", list);
          } else {
            var temp = [];

            for (let i = 0; i < tableItems.length; i++) {
              var t = selectedItems.includes(tableItems[i], 0);
              t ? "" : temp.push(tableItems[i]);
            }
            for (let i = 0; i < temp.length; i++) {
              var p = temp[i].getBindingContextPath();
              var oItem = oTableModel.getObject(p);

              list = list.filter(function (value) {
                return !(
                  value.Bukrs === oItem.Bukrs &&
                  value.Gjahr === oItem.Gjahr &&
                  value.Zchiaveabi === oItem.Zchiaveabi &&
                  value.ZstepAbi === oItem.ZstepAbi
                );
              });
            }
          }

          listAuthModel.setProperty("/checkList", list);
        },

        onChangeUpdateDateRow: function (oEvent) {
          var self = this,
            dtPicker = self.getView().byId(oEvent.getParameters().id),
            listAuthModel = self.getModel(LISTAUTH_MODEL),
            changeList = listAuthModel.getProperty("/changeList");

          var bValid = oEvent.getParameter("valid");
          if (!bValid) {
            oEvent.getSource().setValue("");
            return;
          }
          var value = oEvent.getParameter("newValue");
          console.log("come arriva", value);
          oEvent.getSource().setValue(value);

          var date = self.formatter.formateDateForDeep(dtPicker.getDateValue());

          console.log("come arriva date", date);

          var oTable = self.getView().byId(TABLE_CHANGEAUTH);
          var oTableModel = oTable.getModel(AUTH_SET);
          var sPath = oEvent.getSource().getParent().getBindingContextPath();
          var oItem = oTableModel.getObject(sPath);

          console.log(changeList);
          var objIndex = changeList.findIndex(
            (value) =>
              value.Bukrs === oItem.Bukrs &&
              value.Gjahr === oItem.Gjahr &&
              value.Zchiaveabi === oItem.Zchiaveabi &&
              value.ZstepAbi === oItem.ZstepAbi
          );

          console.log(objIndex);

          if (objIndex === -1) {
            var newItem = {
              Bukrs: oItem.Bukrs,
              Gjahr: oItem.Gjahr,
              Zchiaveabi: oItem.Zchiaveabi,
              ZstepAbi: oItem.ZstepAbi,
              Datbi: date,
            };

            changeList.push(newItem);
          } else {
            changeList[objIndex].Datbi = date;
          }
          listAuthModel.setProperty("/changeList", changeList);
          console.log("cambio in riga", changeList);
        },
        onChangeUpdateDate: function (oEvent) {
          var self = this,
            listAuthModel = self.getModel(LISTAUTH_MODEL);

          var bValid = oEvent.getParameter("valid");
          if (!bValid) {
            oEvent.getSource().setValue("");
            listAuthModel.setProperty("/dateForAll", null);
            return;
          }
          var value = oEvent.getParameter("newValue");

          listAuthModel.setProperty("/dateForAll", value);
        },

        // ----------------------------- END MANAGE ROW  -----------------------------  //
        // ----------------------------- START MANAGE METHOD  -----------------------------  //

        _resetAfterAction: function () {
          var self = this;
          var oListAuthModel;
          oListAuthModel = new JSONModel({
            listAuthTableTitle:
              this.getResourceBundle().getText("listAuthPageTitle"),
            total: 0,
            isSelectedAll: false,
            isChange: false,
            checkList: [],
            changeList: [],
            dateForAll: null,
          });
          self.setModel(oListAuthModel, LISTAUTH_MODEL);
          self.resetPaginator(PAGINATOR_MODEL);
          self._setEntityProperties();
          var checkBox = self.getView().byId(CHECK_ALL);
          checkBox.setSelected(false);
        },

        _saveChanges: function (flag = "") {
          var self = this,
            listAuthModel = self.getModel(LISTAUTH_MODEL),
            oDataModel = self.getModel(),
            changeList = listAuthModel.getProperty("/changeList");

          console.log(flag);
          console.log("quello che mando", changeList);

          var entityRequestBody = {
            Bukrs: "",
            Gjahr: "",
            Zchiaveabi: "key",
            OperationType: OPTION_CHANGE,
            AbilitazioneSet: changeList,
            AbilitazioneMessageSet: [],
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            success: function (result) {
              self.getView().setBusy(false);
              console.log("result", result);
              var arrayMessage = result.AbilitazioneMessageSet.results;

              var arrayInf = arrayMessage.filter((el) => el.Msgty === "I");
              console.log(arrayInf);
              if (arrayInf.length > 0) {
                var oModel = new JSONModel();

                oModel.setData([self.formatMessage(arrayInf[0])]);
                console.log(oModel);
                self.setModel(oModel, LOG_MODEL);
                self.oMessageView.setModel(oModel, LOG_MODEL);
                self._setDialogWarning("btnChange", "msgShouldChange");
                return false;
              }
              var isSuccess = self.isErrorInLog(arrayMessage);
              console.log(isSuccess);
              if (isSuccess) {
                self.setMessage("btnChange", "operationOK", "success");
                self._resetAfterAction();
              }
            },
            error: function (err) {
              self.getView().setBusy(false);

              console.log(err);
            },
            async: true,
            urlParameters: { Prompt: flag },
          });
        },

        // ----------------------------- END MANAGE METHOD  -----------------------------  //

        // ----------------------------- START PAGINATION -----------------------------  //
        counterRecords: function (data) {
          var self = this,
            paginatorModel = self.getModel(PAGINATOR_MODEL),
            numRecordsForPage = paginatorModel.getProperty("/stepInputDefault");

          if (data > numRecordsForPage) {
            paginatorModel.setProperty("/btnLastEnabled", true);
            self.paginatorTotalPage = data / numRecordsForPage;
            var moduleN = Number.isInteger(self.paginatorTotalPage);
            if (!moduleN) {
              self.paginatorTotalPage = Math.trunc(self.paginatorTotalPage) + 1;
            }
            paginatorModel.setProperty("/maxPage", self.paginatorTotalPage);
          } else {
            paginatorModel.setProperty("/maxPage", 1);
            paginatorModel.setProperty("/btnLastEnabled", false);
          }
        },

        paginateChange: function () {
          var self = this,
            oView = self.getView(),
            paginatorModel = self.getModel(PAGINATOR_MODEL),
            listAuthModel = self.getModel(LISTAUTH_MODEL);
          var listCheck = listAuthModel.getProperty("/checkList");

          var numRecordsForPage =
            paginatorModel.getProperty("/stepInputDefault");
          var skip = paginatorModel.getProperty("/paginatorSkip");
          var listCheckNew = listCheck.slice(skip, skip + numRecordsForPage);
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(listCheckNew);
          oView.setModel(oModelJson, AUTH_SET);
        },

        onFirstPaginator: function (oEvent) {
          var self = this,
            listAuthModel = self.getModel(LISTAUTH_MODEL);
          self.getFirstPaginator(PAGINATOR_MODEL);
          if (listAuthModel.getProperty("/isChange")) {
            self.paginateChange();
          } else {
            self._getEntity();
          }
        },

        onLastPaginator: function (oEvent) {
          var self = this,
            listAuthModel = self.getModel(LISTAUTH_MODEL);
          self.getLastPaginator(PAGINATOR_MODEL);
          if (listAuthModel.getProperty("/isChange")) {
            self.paginateChange();
          } else {
            self._getEntity();
          }
        },

        onChangePage: function (oEvent) {
          var self = this,
            paginatorModel = self.getModel(PAGINATOR_MODEL),
            listAuthModel = self.getModel(LISTAUTH_MODEL),
            maxPage = paginatorModel.getProperty("/maxPage");
          self.getChangePage(PAGINATOR_MODEL, maxPage);
          if (listAuthModel.getProperty("/isChange")) {
            self.paginateChange();
          } else {
            self._getEntity();
          }
        },
        // ----------------------------- END PAGINATION -----------------------------  //
        // ----------------------------- START EXPORT -----------------------------  //
        _configExport: async function () {
          var oSheet;
          var self = this;
          var oDataModel = self.getModel(),
            oView = self.getView();
          var oBundle = self.getResourceBundle();
          var oTable = self.getView().byId(TABLE_LISTAUTH);
          oView.setBusy(true);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + AUTH_SET, {
                urlParameters: {},
                success: async function (data, oResponse) {
                  oView.setBusy(false);
                  var oModelJson = new sap.ui.model.json.JSONModel();
                  oModelJson.setData(data.results);
                  await oView.setModel(oModelJson, AUTH_MODEL_EXPORT);
                  var oTableModel = oTable.getModel(AUTH_MODEL_EXPORT);

                  var aCols = self._createColumnConfig();
                  var oSettings = {
                    workbook: {
                      columns: aCols,
                    },
                    dataSource: oTableModel.getData(),
                    fileName: oBundle.getText("listAuthPageTitle"),
                  };

                  oSheet = new Spreadsheet(oSettings);
                  oSheet.build().finally(function () {
                    oSheet.destroy();
                  });
                },
                error: function (error) {
                  oView.setBusy(false);
                },
              });
            });
        },
        _createColumnConfig: function () {
          var self = this;
          var sColLabel = "columnName";
          var oBundle = self.getResourceBundle();
          var aCols = [
            {
              label: oBundle.getText(sColLabel + "ZufficioCont"),
              property: "ZufficioCont",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "ZvimDescrufficio"),
              property: "ZvimDescrufficio",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "Fipos"),
              property: "Fipos",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "Fistl"),
              property: "Fistl",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "Ztipodisp3"),
              property: "Zdesctipodisp3",
              type: EDM_TYPE.String,
            },
            {
              label: oBundle.getText(sColLabel + "Datab"),
              property: "Datab",
              type: EDM_TYPE.Date,
              formatOptions: {
                pattern: "dd.MM.yyyy",
              },
            },
            {
              label: oBundle.getText(sColLabel + "Datbi"),
              property: "Datbi",
              type: EDM_TYPE.Date,
              formatOptions: {
                pattern: "dd.MM.yyyy",
              },
            },
            {
              label: oBundle.getText(sColLabel + "ZstatoAbi"),
              property: "ZstatoAbi",
              type: EDM_TYPE.Enumeration,
              valueMap: {
                "00": oBundle.getText("ZstatoAbi00"),
                "01": oBundle.getText("ZstatoAbi01"),
                "02": oBundle.getText("ZstatoAbi02"),
              },
            },
          ];

          return aCols;
        },
        // _configExportMessage: function () {
        //   var oSheet;
        //   var self = this;
        //   var oBundle = self.getResourceBundle();

        //   var aCols = self._createColumnConfigMessage();
        //   var oSettings = {
        //     workbook: {
        //       columns: aCols,
        //     },
        //     dataSource: self.getModel(LOG_MODEL).getData(),
        //     fileName: oBundle.getText("LOG"),
        //   };

        //   oSheet = new Spreadsheet(oSettings);
        //   oSheet.build().finally(function () {
        //     oSheet.destroy();
        //   });
        // },
        // _createColumnConfigMessage: function () {
        //   var self = this;
        //   var sColLabel = "columnMessage";
        //   var oBundle = self.getResourceBundle();
        //   var aCols = [
        //     {
        //       label: oBundle.getText(sColLabel + "Type"),
        //       property: "title",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Class"),
        //       property: "Msgid",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Number"),
        //       property: "Msgno",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Text"),
        //       property: "Text",
        //       type: EDM_TYPE.String,
        //     },
        //   ];
        //   return aCols;
        // },

        // ----------------------------- END EXPORT -----------------------------  //
      }
    );
  }
);
