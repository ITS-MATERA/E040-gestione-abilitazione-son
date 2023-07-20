sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
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
    formatter,
    MessageBox,
    History,
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
    const UfficioContMc_SET="UfficioContMcSet";
    const FistlMc_SET = "TvarvcParameterSet";
    const URL_DEEP = "DeepSonSet";
    const URL_VALIDATION_1 = "ValidazioneSonRegW1";
    const URL_VALIDATION_2 = "ValidazioneSonRegW2";
    const URL_VALIDATION_3 = "ValidazioneSonW3";
    const URL_VALIDATION_4 = "ValidazioneSonRegW4";
    const OPERATION_TYPE_INSERT = "INS";
    const CLASSIFICAZIONE_SON_DEEP = "classificazioneSonModel";
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";
    const COS = "COS";

    return BaseController.extend(
      "gestioneabilitazioneeson.controller.RegisterSON",
      {
        formatter: formatter,
        _indexClassificazioneSON:0,
        onInit: function () {
          var oWizardModel, oDataSONModel, Step3List;
          oWizardModel = new JSONModel({
            btnBackVisible:false,
            btnNextVisible:true,
            btnFinishVisible:false,
            isInChange: true,
            Step3TableTitle: null,
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
            isZZcausalevalEditable:false,
            Swift: null,
            PayMode: null,
            ZZcausaleval: null,
          });
          oDataSONModel = new JSONModel({
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
            PayMode:[]
          });
          Step3List = new JSONModel([
            {
              Zcos: null,
              ZcosDesc: null,
              ZimptotClass: null,
              Id: 0,
            },
          ]);

          var oClassificazioneModel = new JSONModel([
            {
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
            },
          ]);

          this.configLog();
          this.setModel(oWizardModel, WIZARD_MODEL);
          this.setModel(oDataSONModel, DataSON_MODEL);
          this.setModel(Step3List, STEP3_LIST);
          this.setModel(oClassificazioneModel, CLASSIFICAZIONE_SON_DEEP);

          this.getRouter()
            .getRoute("registerSON")
            .attachPatternMatched(this._onObjectMatched, this);

          this._wizard = this.getView().byId("CreateProductWizard");
        },
        onBeforeRendering: function () {
          var self = this;
          var oTable = self.getView().byId(TABLE_STEP3);
          oTable._getSelectAllCheckbox().setVisible(false);
        },
        _onObjectMatched: function (oEvent) {
          var self = this,
            dataSONModel = self.getModel(DataSON_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView();
            oView.setBusy(true);
          console.log("CALL");
          self.getAmministrazione();
          self.getUfficioAction(); 
          self.getFistl();          

          setTimeout(() => {                
            oView.setBusy(false);
          },2000);
        },

        getAmministrazione:function(){
          var self =this,
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
                  console.log(data);
                  self.getView().getModel(DataSON_MODEL).setProperty("/Zzamministr",data.Value);
                },
                error: function (error) {
                  // oView.setBusy(false);
                },
              });
            });
        },

        getUfficioAction:function(){
            var self= this,
                oDataModel = self.getModel();

            var path = self.getModel().createKey(UfficioContMc_SET, {
                ZufficioCont: "",
            });

            self.getModel().metadataLoaded().then(function () {
                oDataModel.read("/" + path, {
                    success: function (data, oResponse) {                      
                        self.getView().getModel(WIZARD_MODEL).setProperty("/ZufficioCont",data.ZufficioCont);
                        self.getView().getModel(WIZARD_MODEL).setProperty("/ZvimDescrufficio",data.ZvimDescrufficio);
                        self.getView().getModel(DataSON_MODEL).setProperty("/ZufficioCont",data.ZufficioCont);
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
            });
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
                        self.getView().getModel(WIZARD_MODEL).setProperty("/Fistl",data.Value);
                        self.getView().getModel(DataSON_MODEL).setProperty("/Fistl",data.Value);
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
            });
        },

        onSubmitZcos: function (oEvent) {
          var self = this,
            wizardModel = self.getModel(WIZARD_MODEL),
            oDataModel = self.getModel(),
            oView = self.getView(),
            Gjahr = wizardModel.getProperty("/Gjahr");

          var Zcos = oEvent.getParameter("value");

          console.log("ff", oEvent.getParameter("value"));
          if (Zcos !== null && Gjahr !== null) {
            oView.setBusy(true);
            var path = self.getModel().createKey(Zcos_SET, {
              Gjahr: Gjahr,
            });
            self
              .getModel()
              .metadataLoaded()
              .then(function () {
                oDataModel.read("/" + path, {
                  success: function (data, oResponse) {
                    oView.setBusy(false);
                    console.log(data);
                    wizardModel.setProperty("/TaxnumCf", data.TaxnumCf);
                    wizardModel.setProperty("/Taxnumxl", data.Taxnumxl);
                    wizardModel.setProperty("/NameFirst", data.NameFirst);
                    wizardModel.setProperty("/NameLast", data.NameLast);
                    wizardModel.setProperty("/ZzragSoc", data.ZzragSoc);
                    wizardModel.setProperty("/TaxnumPiva", data.TaxnumPiva);
                    var type = data.Type === "1" ? true : false;
                    wizardModel.setProperty("/Type", type);
                    wizardModel.setProperty("/Zsede", data.Zsede);
                    wizardModel.setProperty(
                      "/Zdenominazione",
                      data.Zdenominazione
                    );
                  },
                  error: function (error) {
                    oView.setBusy(false);
                  },
                });
              });
          } else return false;
        },

        // almost global -- only  specific   urlParameters: { Gjahr: Gjahr },

        onValueHelpRequestedZcos: function (oEvent) {
          var self = this,
            oDataModel = self.getModel(),
            wizardModel = self.getModel(WIZARD_MODEL),
            Gjahr = wizardModel.getProperty("/Gjahr");
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
                  oTable.data("inputId", inputId);
                  oDialog.open();
                },
                error: function (error) {},
              });
            });
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

          // var firstRow = _.clone(step3List[0]);
          var firstRow = Object.assign({}, step3List[0]);

          if (
            firstRow.Zcos === null ||
            firstRow.Zcos === "" ||
            firstRow.ZimptotClass === null ||
            firstRow.ZimptotClass === ""
          ) {
            sap.m.MessageBox.warning(
              oBundle.getText("msgWizardCodiceGestionaleRequired"),
              {
                title: oBundle.getText("titleDialogWarning"),
                onClose: function (oAction) {
                  return false;
                },
              }
            );
            return false;
          }

          firstRow.Zchiavesop = Zchiavesop;
          firstRow.Bukrs = Bukrs;
          firstRow.Zetichetta = COS;
          firstRow.ZstepSop = ZstepSop;
          firstRow.Zposizione = "";
          firstRow.Id = self._indexClassificazioneSON + 1;
          self._indexClassificazioneSON = self._indexClassificazioneSON + 1;
          step3List.push(firstRow);
          classificazoneSonDeep.push(firstRow);

          step3List[0].Zcos = null;
          step3List[0].ZcosDesc = null;
          step3List[0].ZimptotClass = null;
          step3List[0].Id = 0;

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

        handleHeaderClose: function (oEvent) {
          var self = this;
          var oSelectedItem = oEvent.getParameter("selectedItem");

          if (!oSelectedItem) {
            self.closeDialog();
            return;
          }

          var self = this,
            step3List = self.getModel(STEP3_LIST).getData();
          step3List[0].Zcos = oSelectedItem.getCells()[0].getTitle();
          step3List[0].ZcosDesc = oSelectedItem.getCells()[1].getText();
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData(step3List);
          console.log(step3List);
          self.setModel(oModelJson, STEP3_LIST);
          self.closeDialog();
        },

        onSaveAll: function (oEvent) {
          console.log("Validazione 4");
          var self = this;

          self.goToFinish(oEvent, function(callback){
            switch(callback){
              case 'ValidationError':
                  return false;
                break;
              case 'ValidationSuccess':
                self._setDialogSaveAll("msgRegisterSon");
                break;
              default:
                return false;
                break;     
            }           
          });
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
            classificazioneSonList = self.getModel(CLASSIFICAZIONE_SON_DEEP).getData(),
            // Step3List = self.getModel(STEP3_LIST).getData(),
            Gjahr = wizardModel.getProperty("/Gjahr"),
            Ztipodisp3 = wizardModel.getProperty("/Ztipodisp3"),
            ZufficioCont = wizardModel.getProperty("/ZufficioCont"),
            Fistl = wizardModel.getProperty("/Fistl"),
            Kostl = wizardModel.getProperty("/Kostl"),
            Fipos = wizardModel.getProperty("/Fipos"),
            Saknr = wizardModel.getProperty("/Saknr"), //step1
            Lifnr = wizardModel.getProperty("/Lifnr"),
            Zwels = wizardModel.getProperty("/PayMode"),
            Zcoordest = wizardModel.getProperty("/Zcoordest"),
            ZZcausaleval = wizardModel.getProperty("/ZZcausaleval"),
            Iban = wizardModel.getProperty("/Iban"),
            Swift = wizardModel.getProperty("/Swift"),
            Zimptot = wizardModel.getProperty("/Zimptot"),
            Zidsede = wizardModel.getProperty("/Zidsede"),
            Znumprot = wizardModel.getProperty("/Znumprot"),
            Zcausale = wizardModel.getProperty("/Zcausale"),
            ZE2e = wizardModel.getProperty("/ZE2e"),
            Zlocpag = wizardModel.getProperty("/Zlocpag"),
            Zzonaint = wizardModel.getProperty("/Zzonaint"),
            Zdataprot = wizardModel.getProperty("/Zdataprot") && wizardModel.getProperty("/Zdataprot") !== null && wizardModel.getProperty("/Zdataprot") !== "" ?
                        self.formatter.formateDateForDeep(wizardModel.getProperty("/Zdataprot")):
                        null;
        
          var arrayClassificazioneSonList=[];
          for(var i=0;i<classificazioneSonList.length;i++){
              var item = classificazioneSonList[i];
              if(item.Id === 0)
                  continue;
              delete item.Id;
              delete item.Bukrs;
              // delete item.Zchiavesop;
              delete item.ZstepSop;
              item.Zchiavesop ="FITTIZIO";
              arrayClassificazioneSonList.push(item);
          }

          var entityRequestBody = {
            Zchiavesop: "FITTIZIO",
            Bukrs: "",
            Gjahr: "",
            Ztipososp: "",
            OperationType: OPERATION_TYPE_INSERT,
            SonMessageSet: [],
            ClassificazioneSonSet: arrayClassificazioneSonList,
            SonSet: [
              {
                Bukrs: "",
                Zimptot: !Zimptot || Zimptot === null ? "0" : Zimptot,
                Zidsede: !Zidsede || Zidsede === null ? "" : Zidsede,
                Gjahr: !Gjahr || Gjahr === null ? "" : Gjahr,
                Zchiavesop: "FITTIZIO",
                Zstep: "",
                ZufficioCont: !ZufficioCont || ZufficioCont === null ? "" : ZufficioCont,
                Zdataprot: Zdataprot,
                Znumprot: !Znumprot || Znumprot === null ? "" : Znumprot,
                Lifnr: !Lifnr || Lifnr === null ? "" : Lifnr,
                Fipos: !Fipos || Fipos === null ? "" : Fipos,
                Fistl: !Fistl || Fistl === null ? "" : Fistl,
                Ztipodisp3: !Ztipodisp3 || Ztipodisp3 === null ? "" : Ztipodisp3,
                Kostl: !Kostl || Kostl === null ? "" : Kostl,
                Hkont: !Saknr || Saknr === null ? "" : Saknr,
                Zwels: !Zwels || Zwels === null ? "" : Zwels,
                ZCausaleval: !ZZcausaleval || ZZcausaleval === null ? "" : ZZcausaleval,
                Iban: !Iban || Iban === null ? "" : Iban,
                Swift: !Swift || Swift === null ? "" : Swift,
                Zcoordest: !Zcoordest || Zcoordest === null ? "" : Zcoordest,
                Zlocpag: !Zlocpag || Zlocpag === null ? "" : Zlocpag,
                Zcausale: !Zcausale || Zcausale === null ? "" : Zcausale,
                Zzonaint: !Zzonaint || Zzonaint === null ? "" : Zzonaint,
                ZE2e: !ZE2e || ZE2e === null ? "" : ZE2e,
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
              var second = oBundle.getText("msgNumberSON");
              var text = first + "\n" + second + " " + result.Zchiavesop;
              sap.m.MessageBox.success(text, {
                title: oBundle.getText("msgRegisterSONSuccess"),
                onClose: function (oAction) {
                  self.downloadFile(result.Zchiavesop);
                  self.setPropertyGlobal(self.RELOAD_MODEL,"canRefresh",true);
                  self.onNavBack();
                },
              });
            
            },
            error: function (err) {
              console.log(err);
              self.getView().setBusy(false);
            },
            async: true,
            urlParameters: {},
          });
        },

        // ----------------------------- START MANAGE PAY MODE -----------------------------  //
        handlePopoverPress: function (oEvent) {
          var self = this;
          var oControl = oEvent.getSource();
          var oDialog = self.openDialog(
            "gestioneabilitazioneeson.view.fragment.DialogPayMode"
          );
          oDialog.openBy(oControl);
        },

        handleClosePress: function () {
          this.closeDialog();
        },

        onNavBack: function (oEvent) {
          var self = this;
          self.resetForBack();
          self.resetLog();
          self.getRouter().navTo("listSON");
        },

        closeWizardPanel:function(){
          var self = this,
              wizard = self.getView().byId("CreateProductWizard"),
              array = document.querySelectorAll(".expanded");
          
          for(var i=0;i<array.length;i++){
              var panel = sap.ui.getCore().byId(array[i].id);
              if(panel.getExpanded())
                  panel.setExpanded(false);                    
          }
          wizard.setCurrentStep(wizard.getSteps()[0]);
        },

        resetForBack: function () {
          var self = this,
            oBundle = self.getResourceBundle();

          self.resetDataSONModel();
          self.resetWizardModel();
          self.resetStep3(); 
          self.closeWizardPanel();
        },

        resetDataSONModel: function () {
          var self = this;
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

        },

        resetWizardModel: function () {
          var self = this;

          self.getView().getModel(WIZARD_MODEL).setProperty("/btnBackVisible", false);
          self.getView().getModel(WIZARD_MODEL).setProperty("/btnNextVisible", true);
          self.getView().getModel(WIZARD_MODEL).setProperty("/btnFinishVisible", false);


          self
            .getView()
            .getModel(WIZARD_MODEL)
            .setProperty("/isInChange", true);
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

        resetLog: function () {
          var self = this;
          var oModelJson = new sap.ui.model.json.JSONModel();
          oModelJson.setData([]);
          self.setModel(oModelJson, LOG_MODEL);
          self.setModel(oModelJson, MESSAGE_MODEL);
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
              classificazoneSonDeep.splice(indexClassificazoneSonDeep, 1);
            } else {
              var item = Object.assign({}, selectedItem);
              item.Zflagcanc = item.Zposizione !== null ? "X" : null;
              classificazoneSonDeep.push(item);
            }

            var indiceStep3 = step3List.findIndex(
              (x) => x.Id === selectedItem.Id
            );
            step3List.splice(indiceStep3, 1);
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

        onLiveChangeTable: function (oEvent) {
            var self = this,
                wizardModel = self.getModel(WIZARD_MODEL),
                oTable = self.getView().byId(TABLE_STEP3),
                oTableModel = oTable.getModel(STEP3_LIST),
                classificazoneSonDeep = self.getModel(CLASSIFICAZIONE_SON_DEEP).getData(),
                path = oEvent.getSource().getParent().getBindingContextPath();

            if(path ==="")
                return false;

            if(self._indexClassificazioneSON===0){
                self._indexClassificazioneSON = oTableModel.getData().length;
            }

            var item = oTableModel.getObject(path);
            item.ZimptotClass = oEvent.getParameters().value;

            var indexClassificazoneSonDeep = classificazoneSonDeep.findIndex((x)=>x.Id === item.Id);
            if(indexClassificazoneSonDeep>-1){
                classificazoneSonDeep.splice(indexClassificazoneSonDeep,1);
                classificazoneSonDeep.push(item);
            }else{                
                classificazoneSonDeep.push(item);
            }

            var step3List = oTable.getModel(STEP3_LIST).getData();
            var sum = 0;
            for(var i=0; i<step3List.length;i++){
                var item = step3List[i].ZimptotClass;
                if(!item || item === null)
                    item= "0";
                item.replace(",",".");
                sum = sum + parseFloat(item);
            }
            
            wizardModel.setProperty("/Zimptotcos", sum.toFixed(2));
            var oModelJsonCS = new sap.ui.model.json.JSONModel();
            oModelJsonCS.setData(classificazoneSonDeep);
            self.setModel(oModelJsonCS, CLASSIFICAZIONE_SON_DEEP);
        },

        // ----------------------------- END MANAGE PAY MODE  -----------------------------  //
        
        onUpdateFinished: function (oEvent) {
          console.log("update");
          var sTitle,
            oTable = oEvent.getSource(),
            step3List = this.getModel(STEP3_LIST).getData(),
            wizardModel = this.getModel(WIZARD_MODEL),
            iTotalItems = step3List.length - 1;

          if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
            sTitle = this.getResourceBundle().getText("Step3TableTitleCount", [
              iTotalItems,
            ]);
          } else {
            sTitle = this.getResourceBundle().getText("Step3TableTitle");
          }
          wizardModel.setProperty("/Step3TableTitle", sTitle);
          this.getView().setBusy(false);
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
          value =self.formatter.formatStringForDate(value);
          wizardModel.setProperty("/Zdataprot", value);
        },


        _stringtoTimestamp: function (dateString, formatDelimiter) {
          var dateTimeParts = dateString.split(formatDelimiter);
          var date = new Date(
            dateTimeParts[2],
            parseInt(dateTimeParts[1], 10) - 1,
            dateTimeParts[0]
          );
          return date;
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
      }
    );
  }
);
