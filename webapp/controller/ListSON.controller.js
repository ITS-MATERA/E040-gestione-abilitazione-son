sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox",
    "sap/m/MessageItem",
    "sap/m/MessageView",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Bar",
    "sap/m/Input",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    exportLibrary,
    Spreadsheet,
    MessageBox,
    MessageItem,
    MessageView,
    Button,
    Dialog,
    Bar,
    Input
  ) {
    "use strict";

    const EDM_TYPE = exportLibrary.EdmType;
    var EdmType = sap.ui.export.EdmType;

    const ACTION_MODEL = "actionModel";
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";

    const LISTSON_MODEL = "listSONModel";
    const SON_SET = "SonSet";
    const SON_MODEL_EXPORT = "SONModelExport";
    const TABLE_LISTSON = "idListSonTable";
    const CHECK_ALL = "idCheckSelectAll";
    const Zzamministr_SET = "UserParametersSet";

    return BaseController.extend(
      "gestioneabilitazioneeson.controller.ListSON",
      {
        formatter: formatter,
        onInit: function () {
          var oListSonModel, oActionDisabled;
          oListSonModel = new JSONModel({
            listSonTableTitle:
              this.getResourceBundle().getText("listSonPageTitle"),
            total: 0,
            areFiltersValid: true,
            isSelectedAll: false,
            checkList: [],
            filterRequestEnable: true,
            filterGjahr: null,
          });

          oActionDisabled = new JSONModel({
            DetailEnabled: false,
            CancelSONEnabled: false,
            SendSignSONEnabled: false,
            DeleteSendSignSONEnabled: false,
            SignSONEnabled: false,
            DeleteSignSONEnabled: false,
            RegisterCancelSONEnabled: false,
            DeleteCancelSONEnabled: false,
            ChangeSONEnabled: false,
          });

          var oReloadModel = new JSONModel({
            canRefresh: false,
            isClickStart: false,
          });

          this.setModel(oListSonModel, LISTSON_MODEL);

          this.setModelGlobal(oActionDisabled, ACTION_MODEL);
          this.setModelGlobal(oReloadModel, this.RELOAD_MODEL);

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

          this.getRouter()
            .getRoute("listSON")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
          var self = this,
            reloadModel = self.getModelGlobal(self.RELOAD_MODEL).getData();

          self.getAuthorityCheck(self.FILTER_SON_OBJ, function (callback) {
            if (callback) {
              self.getAmministrazione();
              if (
                reloadModel &&
                reloadModel !== null &&
                reloadModel.canRefresh
              ) {
                self.setPropertyGlobal(self.RELOAD_MODEL, "canRefresh", false);
                location.reload();
              }
            } else {
              self.getRouter().navTo("notAuth", {
                mex: self.getResourceBundle().getText("notAuthText"),
              });
            }
          });
        },

        getAmministrazione: function () {
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
                  self.getView().setBusy(false);
                  console.log(data);
                  if (data && data.Value !== null && data.Value !== "")
                    self.getView().byId("fZzamministr").setValue(data.Value);

                  // self.getView().getModel(DataSON_MODEL).setProperty("/Zzamministr",);
                },
                error: function (error) {
                  console.log(error);
                  self.getView().setBusy(false);
                },
              });
            });
        },

        handleDialogPress: function (oEvent) {
          this.oMessageView.navigateBack();
          this.oDialog.open();
        },
        // ----------------------------- START INITIALIZATION -----------------------------  //
        resetPage: function () {
          //PULIRE ANCHE I FILTRI
          var oListSonModel;
          oListSonModel = new JSONModel({
            listSonTableTitle:
              this.getResourceBundle().getText("listSonPageTitle"),
            total: 0,
            areFiltersValid: true,
            isSelectedAll: false,
            checkList: [],
          });

          this.setModel(oListSonModel, LISTSON_MODEL);

          var oTable = this.getView().byId(TABLE_LISTSON);
          oTable.removeSelections(true);
          var checkBox = this.getView().byId(CHECK_ALL);
          checkBox.setSelected(false);
        },

        resetFilter: function () {
          var self = this,
            oView = self.getView(),
            listSONModel = self.getModel(LISTSON_MODEL),
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
            sFistl = oView.byId("idFilterStruttAmmResp");

          sGjahr.setValue("");
          sZzamministr.setValue("");
          sCapitolo.setValue("");
          sZufficioCont.setValue("");
          sZnumsopFrom.setValue("");
          sZnumsopTo.setValue("");
          sZstatoSop.setSelectedKey("");
          sZstatoSop.setValue(
            self.getResourceBundle().getText("defaultZstatoSop")
          );
          sZdesctipodisp3.setSelectedKey("");
          sZdesctipodisp3.setValue(
            self.getResourceBundle().getText("defaultZtipodisp3")
          );
          sZricann.setSelectedKey(self.getResourceBundle().getText("ItemNO"));
          listSONModel.setProperty("/filterRequestEnable", true);
          sZdatasopFrom.setValue(null),
            sZdatasopTo.setValue(null),
            sZdataprot.setValue(null),
            sZnumprot.setValue(""),
            sBeneficiario.setValue(""),
            sFiposFrom.setValue(""),
            sFiposTo.setValue(""),
            sFistl.setValue("");
        },

        onBeforeRendering: function () {
          var self = this;

          var oTable = self.getView().byId(TABLE_LISTSON);
          oTable._getSelectAllCheckbox().setVisible(false);
        },
        _setEntityProperties() {
          var self = this,
            oView = self.getView();

          self.resetEntityModel(SON_MODEL_EXPORT);
          self.resetEntityModel(SON_SET);

          self._getEntity(false, true);
        },

        _getEntity: function (getAll = false, getKey = false) {
          var self = this,
            obj = {},
            oDataModel = self.getModel(),
            nameModel = null,
            oView = self.getView(),
            oBundle = self.getResourceBundle();
          var listSONModel = self.getModel(LISTSON_MODEL);
          oView.setBusy(true);

          if (getAll) {
            obj = {
              AgrName: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                .AGR_NAME,
              Fikrs: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                .FIKRS,
              Prctr: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                .PRCTR,
            };
            nameModel = SON_MODEL_EXPORT;
          } else {
            obj = {
              AgrName: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                .AGR_NAME,
              Fikrs: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                .FIKRS,
              Prctr: self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                .PRCTR,
            };
            nameModel = SON_SET;
          }

          var headerObject = self.getHeaderFilterSON();

          if (!headerObject.isValidate) {
            oView.setBusy(false);
            MessageBox.warning(
              oBundle.getText(headerObject.validationMessage),
              {
                title: oBundle.getText("titleDialogWarning"),
                onClose: function (oAction) {},
              }
            );
            listSONModel.setProperty("/areFiltersValid", false);
            oView.setBusy(false);
            return false;
          }
          listSONModel.setProperty("/areFiltersValid", true);
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + SON_SET, {
                urlParameters: obj,
                filters: headerObject.filters,
                success: function (data, oResponse) {
                  var message =
                    oResponse.headers["sap-message"] &&
                    oResponse.headers["sap-message"] !== ""
                      ? JSON.parse(oResponse.headers["sap-message"])
                      : null;
                  if (message && message.severity === "error") {
                    oView.setBusy(false);
                    MessageBox.warning(message.message, {
                      title: oBundle.getText("titleDialogWarning"),
                      onClose: function (oAction) {
                        return false;
                      },
                    });
                    return false;
                  }

                  console.log("data", data.results); //TODO:Da canc
                  if (getKey) {
                    var response = oResponse.headers["sap-message"];
                    var mess = !response ? 0 : response;
                    var counter = JSON.parse(mess);

                    console.log("counter", counter.message);
                    listSONModel.setProperty("/total", counter.message);
                  }
                  var res = data.results;
                  if (getAll) {
                    listSONModel.setProperty("/checkList", res);
                    self.fillActionModel(res);
                  }

                  var oModelJson = new sap.ui.model.json.JSONModel();
                  oModelJson.setData(res);
                  oView.setModel(oModelJson, nameModel);

                  var oTable = self.getView().byId(TABLE_LISTSON);

                  var isSelectedAll =
                    listSONModel.getProperty("/isSelectedAll");
                  if (isSelectedAll) {
                    oTable.selectAll();
                  } else {
                    var list = listSONModel.getProperty("/checkList");

                    for (let y = 0; y < res.length; y++) {
                      for (let i = 0; i < list.length; i++) {
                        if (
                          res[y]["Bukrs"] === list[i]["Bukrs"] &&
                          res[y]["Gjahr"] === list[i]["Gjahr"] &&
                          res[y]["Zchiavesop"] === list[i]["Zchiavesop"] &&
                          res[y]["Zstep"] === list[i]["Zstep"] &&
                          res[y]["Ztipososp"] === list[i]["Ztipososp"]
                        ) {
                          oTable.setSelectedItem(oTable.getItems()[y]);
                        }
                      }
                    }
                  }

                  oView.setBusy(false);
                  if (data.results.length === 0) {
                    MessageBox.warning(
                      "Nessun dato soddisfa i criteri di ricerca",
                      {
                        title: oBundle.getText("titleDialogWarning"),
                        onClose: function (oAction) {
                          return false;
                        },
                      }
                    );
                  }
                },
                error: function (error) {
                  oView.setBusy(false);
                },
              });
            });
        },

        onChangeFilterZstatoSop: function (oEvent) {
          var self = this;
          var oBundle = self.getResourceBundle();
          var value = oEvent.getParameter("value"),
            key = oEvent.getSource().getSelectedKey(),
            listSONModel = self.getModel(LISTSON_MODEL);

          if (
            value === oBundle.getText("defaultZstatoSop") ||
            key === "10" ||
            key === "16"
          )
            listSONModel.setProperty("/filterRequestEnable", true);
          else listSONModel.setProperty("/filterRequestEnable", false);
        },
        onUpdateFinished: function (oEvent) {
          console.log("update");
          var sTitle,
            oTable = oEvent.getSource(),
            listSONModel = this.getModel(LISTSON_MODEL),
            iTotalItems = listSONModel.getProperty("/total"),
            areFiltersValid = listSONModel.getProperty("/areFiltersValid");

          if (
            iTotalItems &&
            oTable.getBinding("items").isLengthFinal() &&
            areFiltersValid
          ) {
            sTitle = this.getResourceBundle().getText("listSONPageTitleCount", [
              iTotalItems,
            ]);
          } else {
            sTitle = this.getResourceBundle().getText("listSONPageTitle");
          }
          listSONModel.setProperty("/listSONTableTitle", sTitle);
          var idText = this.getView().byId("idTextTableSON");
          idText.setVisible(true);
        },
        // ----------------------------- END INITIALIZATION -----------------------------  //

        // ----------------------------- START ON CLICK BUTTONS -----------------------------  //

        onDetail: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          this.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("detailSON", {
            action: "Detail",
          });
          // {
          //   check: JSON.stringify(checkList),
          // }
        },
        // onCancelSON_old: function () {
        //   var self = this,
        //     listSONModel = self.getModel(LISTSON_MODEL),
        //     checkList = listSONModel.getProperty("/checkList");

        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(checkList);
        //   this.setModelGlobal(oModelJson, "checkList");

        //   self.resetPage();

        //   console.log(checkList);
        //   self.getRouter().navTo("detailSON", {
        //     action: "CancelSON",
        //   });
        // },
        onCancelSON: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          self.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("cancelSON", {});
        },

        // onSendSignSON_old: function () {
        //   var self = this,
        //     listSONModel = self.getModel(LISTSON_MODEL),
        //     checkList = listSONModel.getProperty("/checkList");

        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(checkList);
        //   this.setModelGlobal(oModelJson, "checkList");

        //   self.resetPage();
        //   console.log(checkList);
        //   self.getRouter().navTo("detailSON", {
        //     action: "SendSign",
        //   });
        // },
        onSendSignSON: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          self.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("sendSignSON", {});
        },

        onDeleteSendSignSON: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          self.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("deleteSendSignSON", {});
        },
        // onDeleteSendSignSON: function () {
        //   var self = this,
        //     listSONModel = self.getModel(LISTSON_MODEL),
        //     checkList = listSONModel.getProperty("/checkList");

        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(checkList);
        //   this.setModelGlobal(oModelJson, "checkList");

        //   self.resetPage();
        //   console.log(checkList);
        //   self.getRouter().navTo("detailSON", {
        //     action: "DeleteSendSign",
        //   });
        // },
        onSignSON: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          self.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("signSON", {});
        },
        // onSignSON_old: function () {
        //   var self = this,
        //     listSONModel = self.getModel(LISTSON_MODEL),
        //     checkList = listSONModel.getProperty("/checkList");

        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(checkList);
        //   this.setModelGlobal(oModelJson, "checkList");

        //   self.resetPage();
        //   console.log(checkList);
        //   self.getRouter().navTo("detailSON", {
        //     action: "Sign",
        //   });
        // },
        onDeleteSignSON: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          self.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("deleteSignSON", {});
        },
        // onDeleteSignSON_old: function () {
        //   var self = this,
        //     listSONModel = self.getModel(LISTSON_MODEL),
        //     checkList = listSONModel.getProperty("/checkList");

        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(checkList);
        //   this.setModelGlobal(oModelJson, "checkList");
        //   self.resetPage();
        //   console.log(checkList);
        //   self.getRouter().navTo("detailSON", {
        //     action: "DeleteSign",
        //   });
        // },
        onRegisterCancelSON: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          self.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("registerCancelSON", {});
        },
        // onRegisterCancelSON_OLD: function () {
        //   var self = this,
        //     listSONModel = self.getModel(LISTSON_MODEL),
        //     checkList = listSONModel.getProperty("/checkList");
        //   self.resetPage();
        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(checkList);
        //   this.setModelGlobal(oModelJson, "checkList");

        //   console.log(checkList);
        //   self.getRouter().navTo("detailSON", {
        //     action: "RegisterCancel",
        //   });
        // },
        onDeleteCancelSON_old: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");
          self.resetPage();
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          this.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("detailSON", {
            action: "DeleteCancel",
          });
        },

        onDeleteCancelSON: function () {
          var self = this,
            listSONModel = self.getModel(LISTSON_MODEL),
            checkList = listSONModel.getProperty("/checkList");

          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(checkList);
          self.setModelGlobal(oModelJson, "checkList");

          console.log(checkList);
          self.getRouter().navTo("deleteCancelSON", {});
        },

        onNavBack: function () {
          // eslint-disable-next-line sap-no-history-manipulation
          var self = this;

          var idText = this.getView().byId("idTextTableSON");
          idText.setVisible(false);
          // oTable.setVisible(false);//giannilecci
          self.resetPage();
          self.resetEntityModel(SON_MODEL_EXPORT);
          self.resetEntityModel(SON_SET);
          self.resetFilter();
          self.getRouter().navTo("startPage");
        },
        onToggle: function () {
          var self = this,
            oView = self.getView(),
            oBundle = self.getResourceBundle();

          var btnArrow = oView.byId("btnToggle");
          var panelFilter = oView.byId("_idVBoxGridToolBar");
          if (btnArrow.getIcon() === "sap-icon://slim-arrow-up") {
            btnArrow.setIcon("sap-icon://slim-arrow-down");
            btnArrow.setTooltip(oBundle.getText("tooltipArrowShow"));
            panelFilter.setVisible(false);
          } else {
            btnArrow.setIcon("sap-icon://slim-arrow-up");
            btnArrow.setTooltip(oBundle.getText("tooltipArrowHide"));
            panelFilter.setVisible(true);
          }
        },

        onBlockToggle: function () {
          var self = this,
            oView = self.getView();

          var btnArrow = oView.byId("btnToggle");
          btnArrow.getEnabled()
            ? btnArrow.setEnabled(false)
            : btnArrow.setEnabled(true);
        },
        onStart: function () {
          var self = this;
          self.getView().setBusy(true);
          self.resetList();
          //var reloadModel = self.getModelGlobal(self.RELOAD_MODEL);
          self._setEntityProperties();
        },

        resetList: function () {
          var self = this,
            oTable = self.getView().byId(TABLE_LISTSON);
          self.getView().getModel(LISTSON_MODEL).setProperty("/checkList", []);
          self
            .getView()
            .getModel(LISTSON_MODEL)
            .setProperty("/isSelectedAll", false);
          oTable.removeSelections(true);

          var oModel = new JSONModel();
          var obj = {
            DetailEnabled: false,
            CancelSONEnabled: false,
            SendSignSONEnabled: false,
            DeleteSendSignSONEnabled: false,
            SignSONEnabled: false,
            DeleteSignSONEnabled: false,
            RegisterCancelSONEnabled: false,
            DeleteCancelSONEnabled: false,
            ChangeSONEnabled: false,
          };
          oModel.setData(obj);
          self.setModelGlobal(oModel, ACTION_MODEL);
        },

        onCheck: function (oEvent) {
          var self = this,
            oTable = self.getView().byId(TABLE_LISTSON);
          var isChecked = oEvent.getParameter("selected"),
            listSONModel = self.getModel(LISTSON_MODEL);
          if (isChecked) {
            self._getEntity(true, false);
            listSONModel.setProperty("/isSelectedAll", true);
            oTable.selectAll();
          } else {
            listSONModel.setProperty("/checkList", []);
            oTable.removeSelections(true);
            listSONModel.setProperty("/isSelectedAll", false);
            self.fillActionModel([]);
          }
        },

        onSelectedItem: function (oEvent) {
          var self = this,
            isSelectedRow = oEvent.getParameter("selected"),
            listSONModel = self.getModel(LISTSON_MODEL),
            oTable = self.getView().byId(TABLE_LISTSON),
            oTableModel = oTable.getModel(SON_SET),
            list = listSONModel.getProperty("/checkList");

          var checkBox = self.getView().byId(CHECK_ALL);
          checkBox.setSelected(false);
          listSONModel.setProperty("/isSelectedAll", false);

          var itemPath = oEvent
            .getParameters()
            .listItem.getBindingContextPath();
          var oItem = oTableModel.getObject(itemPath);
          if (isSelectedRow) {
            // è stata selezionata
            list.push(oItem);
            listSONModel.setProperty("/checkList", list);
          } else {
            // è stata DESELEZIONATA
            var index = list.findIndex(
              (x) =>
                x.Bukrs === oItem.Bukrs &&
                x.Gjahr === oItem.Gjahr &&
                x.Zchiavesop === oItem.Zchiavesop &&
                x.Zstep === oItem.Zstep &&
                x.Ztipososp === oItem.Ztipososp
            );
            if (index > -1) {
              list.splice(index, 1);
            }
            listSONModel.setProperty("/checkList", list);
          }
          self.fillActionModel(list);
        },

        // onSelectedItem_old: function (oEvent) {
        //   var self = this,
        //     oTable = self.getView().byId(TABLE_LISTSON),
        //     listSONModel = self.getModel(LISTSON_MODEL),
        //     isSelectedRow = oEvent.getParameter("selected"),
        //     oTableModel = oTable.getModel(SON_SET),
        //     list = listSONModel.getProperty("/checkList"),
        //     actionModel = self.getModel(ACTION_MODEL),
        //     tableItems = oTable.getItems(),
        //     selectedItems = oTable.getSelectedItems();

        //   var checkBox = self.getView().byId(CHECK_ALL);
        //   checkBox.setSelected(false);
        //   listSONModel.setProperty("/isSelectedAll", false);

        //   if (isSelectedRow) {
        //     for (let i = 0; i < selectedItems.length; i++) {
        //       var p = selectedItems[i].getBindingContextPath();
        //       var oItem = oTableModel.getObject(p);
        //       var gg = list.includes(oItem);
        //       gg ? "" : list.push(oItem);
        //     }
        //     listSONModel.setProperty("/checkList", list);
        //   } else {
        //     var temp = [];

        //     for (let i = 0; i < tableItems.length; i++) {
        //       var t = selectedItems.includes(tableItems[i], 0);
        //       t ? "" : temp.push(tableItems[i]);
        //     }
        //     for (let i = 0; i < temp.length; i++) {
        //       var p = temp[i].getBindingContextPath();
        //       var oItem = oTableModel.getObject(p);

        //       list = list.filter(function (value) {
        //         return !(
        //           value.Bukrs === oItem.Bukrs &&
        //           value.Gjahr === oItem.Gjahr &&
        //           value.Zchiavesop === oItem.Zchiavesop &&
        //           value.Zstep === oItem.Zstep &&
        //           value.Ztipososp === oItem.Ztipososp
        //         );
        //       });
        //     }
        //   }
        //   self.fillActionModel(list);
        //   listSONModel.setProperty("/checkList", list);
        // },

        fillActionModel: function (list) {
          var self = this,
            oModel = new JSONModel(),
            obj,
            oBundle = self.getResourceBundle();

          if (list.length === 0) {
            obj = {
              DetailEnabled: false,
              CancelSONEnabled: false,
              SendSignSONEnabled: false,
              DeleteSendSignSONEnabled: false,
              SignSONEnabled: false,
              DeleteSignSONEnabled: false,
              RegisterCancelSONEnabled: false,
              DeleteCancelSONEnabled: false,
              ChangeSONEnabled: false,
            };
            oModel.setData(obj);
            self.setModelGlobal(oModel, ACTION_MODEL);
            return;
          }

          if (list.length === 1) {
            var first = list[0];
            obj = {
              DetailEnabled: self
                .getModelGlobal(self.AUTHORITY_CHECK_SON)
                .getData().Z03Enabled
                ? true
                : false,
              CancelSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnCancelSON"),
                first
              ),
              SendSignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnSendSign"),
                first
              ),
              DeleteSendSignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnDeleteSendSign"),
                first
              ),
              SignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnSign"),
                first
              ),
              DeleteSignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnDeleteSign"),
                first
              ),
              RegisterCancelSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnRegisterCancel"),
                first
              ),
              DeleteCancelSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnDeleteCancel"),
                first
              ),
              ChangeSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnChangeSON"),
                first
              ),
            };
            oModel.setData(obj);
            self.setModelGlobal(oModel, ACTION_MODEL);
            return;
          }

          if (list.length > 1) {
            var first = list[0];
            var found = list.find((x) => x.ZstatoSop !== first.ZstatoSop);
            if (found) {
              // situazione di diversità NON VEDO NULLA
              obj = {
                DetailEnabled: false,
                CancelSONEnabled: false,
                SendSignSONEnabled: false,
                DeleteSendSignSONEnabled: false,
                SignSONEnabled: false,
                DeleteSignSONEnabled: false,
                RegisterCancelSONEnabled: false,
                DeleteCancelSONEnabled: false,
                ChangeSONEnabled: false,
              };
              oModel.setData(obj);
              self.setModelGlobal(oModel, ACTION_MODEL);
              return;
            }

            obj = {
              DetailEnabled: false,
              CancelSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnCancelSON"),
                first
              ),
              SendSignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnSendSign"),
                first
              ),
              DeleteSendSignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnDeleteSendSign"),
                first
              ),
              SignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnSign"),
                first
              ),
              DeleteSignSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnDeleteSign"),
                first
              ),
              RegisterCancelSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnRegisterCancel"),
                first
              ),
              DeleteCancelSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnDeleteCancel"),
                first
              ),
              ChangeSONEnabled: self.checkStatusEnabled(
                oBundle.getText("btnChangeSON"),
                first
              ),
            };
            oModel.setData(obj);
            self.setModelGlobal(oModel, ACTION_MODEL);
            return;
          }
        },

        checkStatusEnabled: function (state, item) {
          var self = this,
            oBundle = self.getResourceBundle(),
            enabled = false;

          switch (state) {
            case oBundle.getText("btnCancelSON"):
              enabled =
                item.ZstatoSop === "00" &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z07Enabled
                  ? true
                  : false;
              break;
            case oBundle.getText("btnSendSign"):
              enabled =
                item.ZstatoSop === "00" &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z04Enabled
                  ? true
                  : false;
              break;
            case oBundle.getText("btnDeleteSendSign"):
              enabled =
                item.ZstatoSop === "01" &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z05Enabled
                  ? true
                  : false;
              break;
            case oBundle.getText("btnSign"):
              enabled =
                item.ZstatoSop === "01" &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z06Enabled
                  ? true
                  : false;
              break;
            case oBundle.getText("btnDeleteSign"):
              enabled =
                item.ZstatoSop === "02" &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z27Enabled
                  ? true
                  : false;
              break;
            case oBundle.getText("btnRegisterCancel"):
              enabled =
                (item.ZstatoSop === "10" || item.ZstatoSop === "16") &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z08Enabled &&
                item.Zricann === "0000000"
                  ? true
                  : false;
              break;
            case oBundle.getText("btnDeleteCancel"):
              enabled =
                (item.ZstatoSop === "10" || item.ZstatoSop === "16") &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z09Enabled &&
                item.Zricann !== "0000000"
                  ? true
                  : false;
              break;
            case oBundle.getText("btnChangeSON"):
              enabled =
                item.ZstatoSop === "00" &&
                self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData()
                  .Z02Enabled
                  ? true
                  : false;
              break;
            default:
              console.log("default");
          }
          return enabled;
        },

        onRegisterMax: function () {
          var self = this;
        },
        onRegisterSON: function () {
          var self = this;
          self.getRouter().navTo("registerSON");
        },

        onExport: function (oEvent) {
          var self = this,
              aCols, oRowBinding, oSettings, oSheet, oTable;
  
          if (!self._oTable) {
            self._oTable = this.byId("idListSonTable");
          }

          oTable = self._oTable;
          oRowBinding = oTable.getBinding("items");
          var customList = oRowBinding.oList;
          var data = customList.map((x) => {
            var item = x;
            return item;
          });

          oRowBinding.oList = data;
          aCols = self._createColumnConfig();

          oSettings = {
            workbook: {
              columns: aCols,
              hierarchyLevel: "Level",
            },
            dataSource: oRowBinding,
            fileName: "Esportazione Lista SON",
            worker: false, // We need to disable worker because we are using a MockServer as OData Service
            count:data.length || 10000
          };

          oSheet = new sap.ui.export.Spreadsheet(oSettings);
          oSheet.build().finally(function () {
            oSheet.destroy();
          });
          //self._configExport();
        },
        // ----------------------------- END ON CLICK BUTTONS -----------------------------  //

        // ----------------------------- START FORMATTING -----------------------------  //

        handleChangeDatePicker: function (oEvent) {
          var bValid = oEvent.getParameter("valid");

          if (!bValid) {
            oEvent.getSource().setValue("");
            return;
          }
          var newValue = oEvent.getParameter("newValue");
          oEvent.getSource().setValue(newValue);
        },
        // ----------------------------- END FORMATTING -----------------------------  //

        // ----------------------------- START EXPORT -----------------------------  //
        _configExport: function () {
          var oSheet;
          var self = this;
          var oDataModel = self.getModel(),
            oView = self.getView();
          var oBundle = self.getResourceBundle();
          var oTable = self.getView().byId(TABLE_LISTSON),
            listSONModel = this.getModel(LISTSON_MODEL);

          oView.setBusy(true);
          var headerObject = self.getHeaderFilterSON();

          if (!headerObject.isValidate) {
            oView.setBusy(false);
            MessageBox.warning(
              oBundle.getText(headerObject.validationMessage),
              {
                title: oBundle.getText("titleDialogWarning"),
                onClose: function (oAction) {},
              }
            );
            listSONModel.setProperty("/areFiltersValid", false);
            oView.setBusy(false);
            return false;
          }
          listSONModel.setProperty("/areFiltersValid", true);

          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + SON_SET, {
                urlParameters: {},
                filters: headerObject.filters,
                success: async function (data, oResponse) {
                  oView.setBusy(false);
                  var oModelJson = new sap.ui.model.json.JSONModel();
                  oModelJson.setData(data.results);
                  await oView.setModel(oModelJson, SON_MODEL_EXPORT);
                  var oTableModel = oTable.getModel(SON_MODEL_EXPORT);

                  var aCols = self._createColumnConfig();
                  var oSettings = {
                    workbook: {
                      columns: aCols,
                    },
                    dataSource: oTableModel.getData(),
                    fileName: oBundle.getText("listSONPageTitle"),
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
          var self =this,
            aCols = [],
            oBundle = self.getResourceBundle();
  
          var aCols = [
              {
                label: "Chiave SON",
                property: "Zchiavesop",
                type: EdmType.String,
              },
              {
                label: "Data Reg. SON",
                property: "Zdatasop",
                type: EdmType.Date,
                format: "dd.MM.yyyy",
              },
              {
                label: "Denominazione Beneficiario",
                property: "Lifnr",
                type: EdmType.String,
              },
              {
                label: "Posizione Finanziaria",
                property: "Fipos",
                type: EdmType.String,
              },
              {
                label: "Struttura Amministrativa",
                property: "Fistl",
                type: EdmType.String,
              },
              {
                label: "Importo",
                property: "Zimptot",
                type: EdmType.String,
              },
              {
                label: "Tipologia Disposizione",
                property: "Zdesctipodisp3",
                type: EdmType.String,
              },
              {
                label: "Stato SON",
                property: "ZstatoSop",
                type: EdmType.Enumeration,
                valueMap: {
                  "00": oBundle.getText("ZstatoSop00"),
                  "01": oBundle.getText("ZstatoSop01"),
                  "02": oBundle.getText("ZstatoSop02"),
                  "03": oBundle.getText("ZstatoSop03"),
                  "04": oBundle.getText("ZstatoSop04"),
                  "05": oBundle.getText("ZstatoSop05"),
                  "06": oBundle.getText("ZstatoSop06"),
                  "07": oBundle.getText("ZstatoSop07"),
                  "08": oBundle.getText("ZstatoSop08"),
                  "09": oBundle.getText("ZstatoSop09"),
                  "10": oBundle.getText("ZstatoSop10"),
                  "11": oBundle.getText("ZstatoSop11"),
                  "14": oBundle.getText("ZstatoSop14"),
                  "15": oBundle.getText("ZstatoSop15"),
                  "16": oBundle.getText("ZstatoSop16"),
                  "17": oBundle.getText("ZstatoSop17"),
                  "18": oBundle.getText("ZstatoSop18"),
                },
              },
            ];
  
          return aCols;
        },


        // _createColumnConfig: function () {
        //   var self = this;
        //   var sColLabel = "columnName";
        //   var oBundle = self.getResourceBundle();
        //   var aCols = [
        //     {
        //       label: oBundle.getText(sColLabel + "Zchiavesop"),
        //       property: "Zchiavesop",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Zdatasop"),
        //       property: "Zdatasop",
        //       type: EDM_TYPE.Date,
        //       format: "dd.MM.yyyy",
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Lifnr"),
        //       property: "Lifnr",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Fipos"),
        //       property: "Fipos",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Fistl"),
        //       property: "Fistl",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Zimptot"),
        //       property: "Zimptot",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "Ztipodisp3"),
        //       property: "Zdesctipodisp3",
        //       type: EDM_TYPE.String,
        //     },
        //     {
        //       label: oBundle.getText(sColLabel + "ZstatoSop"),
        //       property: "ZstatoSop",
        //       type: EDM_TYPE.Enumeration,
        //       valueMap: {
        //         "00": oBundle.getText("ZstatoSop00"),
        //         "01": oBundle.getText("ZstatoSop01"),
        //         "02": oBundle.getText("ZstatoSop02"),
        //         "03": oBundle.getText("ZstatoSop03"),
        //         "04": oBundle.getText("ZstatoSop04"),
        //         "05": oBundle.getText("ZstatoSop05"),
        //         "06": oBundle.getText("ZstatoSop06"),
        //         "07": oBundle.getText("ZstatoSop07"),
        //         "08": oBundle.getText("ZstatoSop08"),
        //         "09": oBundle.getText("ZstatoSop09"),
        //         10: oBundle.getText("ZstatoSop10"),
        //         11: oBundle.getText("ZstatoSop11"),
        //         14: oBundle.getText("ZstatoSop14"),
        //         15: oBundle.getText("ZstatoSop15"),
        //         16: oBundle.getText("ZstatoSop16"),
        //         17: oBundle.getText("ZstatoSop17"),
        //         18: oBundle.getText("ZstatoSop18"),
        //       },
        //     },
        //   ];

        //   return aCols;
        // },

        // ----------------------------- END EXPORT -----------------------------  //

        onFilterGjahrChange: function (oEvent) {
          var self = this,
            value = oEvent.getParameters().value;

          self
            .getView()
            .getModel(LISTSON_MODEL)
            .setProperty("/filterGjahr", value);
        },
      }
    );
  }
);
