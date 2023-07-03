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
      "sap/ui/core/library"
  ],
  function (BaseController, JSONModel, formatter, MessageBox, History,library,
      Spreadsheet,
      MessageItem,
      MessageView,
      Button,
      Dialog,
      Bar,
      Input,
      coreLibrary) {
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

    const URL_DEEP = "DeepSonSet";
    const URL_VALIDATION_1 = "ValidazioneSonRegW1";
    const URL_VALIDATION_2 = "ValidazioneSonRegW2";
    const URL_VALIDATION_3 = "ValidazioneSonW3";
    const URL_VALIDATION_4 = "ValidazioneSonRegW4";
    const OPERATION_TYPE_INSERT = "INS";
    const CLASSIFICAZIONE_SON_DEEP="classificazioneSonModel";    
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";
    const COS="COS";

    return BaseController.extend(
      "gestioneabilitazioneeson.controller.RegisterSON",
      {
        formatter: formatter,
        onInit: function () {
          var oWizardModel, oDataSONModel, Step3List;
          oWizardModel = new JSONModel({
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
                  Zchiavesop:null,
                  Bukrs:null,
                  Zetichetta:null,
                  Zposizione:null,
                  ZstepSop:null,
                  Zzcig:null,
                  Zzcup:null,
                  Zcpv:null,
                  ZcpvDesc:null,
                  Zcos:null,
                  ZcosDesc:null,
                  Belnr:null,
                  ZimptotClass:null,
                  Zflagcanc:null,
                  ZstatoClass:null,
                  Id:0
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
          console.log("CALL");

          oView.setBusy(true);
          var path = self.getModel().createKey(Zzamministr_SET, {
            Name: "PRC",
          });
          self
            .getModel()
            .metadataLoaded()
            .then(function () {
              oDataModel.read("/" + path, {
                success: function (data, oResponse) {
                  oView.setBusy(false);
                  console.log(data);
                  dataSONModel.setProperty("/Zzamministr", data.Value);
                },
                error: function (error) {
                  oView.setBusy(false);
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
                classificazoneSonDeep = self.getModel(CLASSIFICAZIONE_SON_DEEP).getData(),
                Zchiavesop=wizardModel.getProperty("/Zchiavesop"),
                Bukrs=wizardModel.getProperty("/Bukrs"),
                Zchiavesop=wizardModel.getProperty("/Zchiavesop"),
                ZstepSop=wizardModel.getProperty("/Zstep"),
                step3List = self.getModel(STEP3_LIST).getData();
            
            if(self._indexClassificazioneSON===0){
                self._indexClassificazioneSON = step3List.length;
            }

            // var firstRow = _.clone(step3List[0]);   
            var firstRow = Object.assign({}, step3List[0]);
            
            if(firstRow.Zcos === null || firstRow.Zcos === "" || firstRow.ZimptotClass === null || firstRow.ZimptotClass === ""){
                sap.m.MessageBox.warning(oBundle.getText("msgWizardCodiceGestionaleRequired"), {
                    title: oBundle.getText("titleDialogWarning"),
                    onClose: function (oAction) {
                        return false;
                    },
                });
                return false;
            } 
            
            firstRow.Zchiavesop = Zchiavesop;
            firstRow.Bukrs = Bukrs 
            firstRow.Zetichetta = COS;
            firstRow.ZstepSop = ZstepSop;
            firstRow.Zposizione = "";
            firstRow.Id = self._indexClassificazioneSON+1;             
            self._indexClassificazioneSON=self._indexClassificazioneSON+1;
            step3List.push(firstRow);   
            classificazoneSonDeep.push(firstRow);
            
            step3List[0].Zcos = null;
            step3List[0].ZcosDesc= null;
            step3List[0].ZimptotClass= null;
            step3List[0].Id= 0;

            var sum = 0;
            for(var i=0; i<step3List.length;i++){
                var item = step3List[i].ZimptotClass;
                if(!item || item === null)
                    item= "0";
                item.replace(",",".");
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

        // onAddRow: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     Step3List = self.getModel(STEP3_LIST).getData(),
        //     Zcos = wizardModel.getProperty("/Zcos"),
        //     ZcosdDesc = wizardModel.getProperty("/ZcosdDesc"),
        //     Zimpcos = wizardModel.getProperty("/Zimpcos");

        //   console.log("Zcos", Zcos);
        //   console.log("Zimpcos", Zimpcos);

        //   var id = Step3List.length;

        //   Step3List.push({
        //     Zcos: Zcos,
        //     ZcosDesc: ZcosdDesc,
        //     ZimptotClass: Zimpcos,
        //     Id: id,
        //   });

        //   var sum = null;
        //   for (let i = 0; i < Step3List.length; i++) {
        //     if (i !== 0) {
        //       sum += parseFloat(Step3List[i]["ZimptotClass"]);
        //     }
        //   }
        //   console.log(sum);
        //   wizardModel.setProperty("/Zimptotcos", sum);
        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(Step3List);
        //   console.log(Step3List);
        //   self.setModel(oModelJson, STEP3_LIST);
        // },
        // handleHeaderClose: function (oEvent) {
        //   var self = this;
        //   var oSelectedItem = oEvent.getParameter("selectedItem"),
        //     dialogName = oEvent.getSource().data().dialogName;

        //   var table = sap.ui.getCore().byId(dialogName);

        //   var inputId = table.data("inputId");

        //   var oInput = self.byId(inputId);
        //   console.log("close", inputId);

        //   if (!oSelectedItem) {
        //     //oInput.resetProperty("value");
        //     self.getView().getModel("step3List").setProperty("/Zcos", "");
        //     self.closeDialog();
        //     return;
        //   }
        //   // console.log(oInput.getValue());
        //   // console.log(oSelectedItem.getCells()[0].getTitle());
        //   // oInput.setValue(oSelectedItem.getCells()[0].getTitle());

        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     Step3List = self.getModel(STEP3_LIST).getData();

        //   Step3List[0].Zcos = oSelectedItem.getCells()[0].getTitle();

        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(Step3List);
        //   console.log(Step3List);
        //   self.setModel(oModelJson, STEP3_LIST);

        //   self
        //     .getView()
        //     .getModel("wizardModel")
        //     .setProperty("/Zcos", oSelectedItem.getCells()[0].getTitle());

        //   // console.log(oInput.getValue());
        //   self.closeDialog();
        // },

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

        onSaveAll: function () {
          console.log("Validazione 4");

          var self = this;

          self.validateStep4();

          // if (self.validateStep4() === true) {
          self._setDialogSaveAll("msgRegisterSon");
          // } else {
          //   return false;
          // }
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
            Step3List = self.getModel(STEP3_LIST).getData(),
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
            Zdataprot = wizardModel.getProperty("/Zdataprot"),
            Zcausale = wizardModel.getProperty("/Zcausale"),
            ZE2e = wizardModel.getProperty("/ZE2e"),
            Zlocpag = wizardModel.getProperty("/Zlocpag"),
            Zzonaint = wizardModel.getProperty("/Zzonaint");

          Step3List.splice(0, 1);
          Step3List.forEach((el) => {
            delete el.Id;
          });

          if (Zdataprot !== null) {
            //TO DO : fare cambiamento in base LIST AUTH

            //self.formatter.formateDateForDeep(dtPicker.getDateValue())
            Zdataprot = self._stringtoTimestamp(Zdataprot, ".");
          }

          console.log(Zdataprot);

          var entityRequestBody = {
            Zchiavesop: "hh",
            Bukrs: "",
            Gjahr: "",
            Ztipososp: "",
            OperationType: OPERATION_TYPE_INSERT,
            SonMessageSet: [],
            ClassificazioneSonSet: Step3List,
            SonSet: [
              {
                Bukrs: "",
                Zimptot: !Zimptot || Zimptot === null ? "0" : Zimptot,
                Zidsede: !Zidsede || Zidsede === null ? "" : Zidsede,
                Gjahr:  !Gjahr || Gjahr === null ? "" : Gjahr,
                Zchiavesop: "",
                Zstep: "",
                ZufficioCont:  !ZufficioCont || ZufficioCont === null ? "" : ZufficioCont,
                Zdataprot: !Zdataprot || Zdataprot,
                Znumprot: !Znumprot || Znumprot === null ? "" : Znumprot,
                Lifnr: !Lifnr ||  Lifnr === null ? "" : Lifnr,
                Fipos:  !Fipos || Fipos === null ? "" : Fipos,
                Fistl: !Fistl ||  Fistl === null ? "" : Fistl,
                Ztipodisp3: !Ztipodisp3 || Ztipodisp3 === null ? "" : Ztipodisp3,
                Kostl:  !Kostl || Kostl === null ? "" : Kostl,
                Hkont: !Saknr || Saknr === null ? "" : Saknr,
                Zwels: !Zwels || Zwels === null ? "" : Zwels,
                ZCausaleval: !ZZcausaleval || ZZcausaleval === null ? "" : ZZcausaleval,
                Iban: !Iban || Iban === null ? "" : Iban,
                Swift:  !Swift ||  Swift === null ? "" : Swift,
                Zcoordest: !Zcoordest ||  Zcoordest === null ? "" : Zcoordest,
                Zlocpag: !Zlocpag || Zlocpag === null ? "" : Zlocpag,
                Zcausale: !Zcausale || Zcausale === null ? "" : Zcausale,
                Zzonaint:!Zzonaint ||  Zzonaint === null ? "" : Zzonaint,
                ZE2e: !ZE2e || ZE2e === null ? "" : ZE2e,
              },
            ],
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            success: function (result) {
              self.getView().setBusy(false);
              var arrayMessage = result.SonMessageSet.results;
              var arrayError = arrayMessage.filter((el) => el.Msgty === "E");
              console.log(result.Zchiavesop);
              if (arrayError.length > 0) {
                self._setMessage("titleDialogError", "msgError", "error");
                //return false;
              }
              var first = oBundle.getText("operationOK");
              var second = oBundle.getText("msgNumberSON");
              var text = first + "\n" + second + " " + result.Zchiavesop;
              sap.m.MessageBox.success(text, {
                title: oBundle.getText("msgRegisterSONSuccess"),
                onClose: function (oAction) {},
              });
              // self._setMessage("msgRegisterSONSuccess", "msgError", "success");
              console.log(result.SonMessageSet.results);
            },
            error: function (err) {
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

        onNavBack:function(oEvent){
          var self = this;
            self.resetForBack();
            self.resetLog();
            self.getRouter().navTo("listSON");
        },

        resetForBack:function(){
          var self = this,
              oBundle = self.getResourceBundle();
          
          self.resetDataSONModel();
          self.resetWizardModel(); 
          self.resetStep3(); 
        },

        resetWizardModel:function(){
          var self = this;
          self.getView().getModel(WIZARD_MODEL).setProperty("/isInChange", false);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Step3TableTitle", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Bukrs", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zchiavesop", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zstep",null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ztipososp",null);  
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zzamministr",null);  
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zchiaveopi",null);              
                    
          //step4
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZE2e", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcausale", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Znumprot", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdataprot", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zlocpag", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zzonaint", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/StrasList", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/FirstKeyStras", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zidsede", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ort01", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Regio", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Pstlz", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Land1", null);
          //step3
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zimptotcos", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zimpcos", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcos", null);
          //step1
          self.getView().getModel(WIZARD_MODEL).setProperty("/Gjahr", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZufficioCont", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZvimDescrufficio", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdesctipodisp3", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ztipodisp3", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ztipodisp3List", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/FiposList", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Fipos", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Fistl", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Kostl", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Ltext", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Skat", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Saknr", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zimptot", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZimptotDivisa", null);
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
          self.getView().getModel(WIZARD_MODEL).setProperty("/TaxnumPiva", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zdenominazione", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Banks", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Iban", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zcoordest", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/isZcoordestEditable", false);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Swift", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/PayMode", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZZcausaleval", null);
          self.getView().getModel(WIZARD_MODEL).setProperty("/Zwels",null);  
          self.getView().getModel(WIZARD_MODEL).setProperty("/ZCausaleval",null);  
          var idWizardZdesctipodisp3 = self.getView().byId("idWizardZdesctipodisp3");
          var idWizardFipos = self.getView().byId("idWizardFipos");
          var idWizardStras = self.getView().byId("idWizardStras");
          if(idWizardZdesctipodisp3){
            idWizardZdesctipodisp3.setSelectedKey("");
          }
          if(idWizardFipos){
            idWizardFipos.setSelectedKey("");
          }
          if(idWizardStras){
            idWizardStras.setSelectedKey("");
          }
        },

        resetLog:function(){
            var self = this;
            var oModelJson= new sap.ui.model.json.JSONModel();
            oModelJson.setData([]);
            self.setModel(oModelJson, LOG_MODEL);
            self.setModel(oModelJson, MESSAGE_MODEL);                
        },  

        resetStep3:function(){
            var self = this;
            
            var oModelJson= new sap.ui.model.json.JSONModel();
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
                classificazoneSonDeep = self.getModel(CLASSIFICAZIONE_SON_DEEP).getData(),
                step3List = self.getModel(STEP3_LIST).getData(),
                oTable = self.getView().byId(TABLE_STEP3),
                oTableModel = oTable.getModel(STEP3_LIST),
                selected = oTable.getSelectedContextPaths();

            if(self._indexClassificazioneSON===0){
                self._indexClassificazioneSON = step3List.length;
            }
                
            if(selected.length === 0){
                sap.m.MessageBox.warning(oBundle.getText("msgWizardCodiceGestionaleNoSelection"), {
                    title: oBundle.getText("titleDialogWarning"),
                    onClose: function (oAction) {
                        return false;
                    },
                });
                return false;
            }

            var cloneStep3List = Object.assign([], step3List);
            for(var i=0; i<selected.length;i++){
                var path = selected[i];
                path = path.replace("/","");
                var index =path;// parseInt(path)+1;
                if(index === 0)
                    continue;
                var selectedItem = cloneStep3List[index];
                
                var indexClassificazoneSonDeep = classificazoneSonDeep.findIndex((x)=>x.Id === selectedItem.Id);
                if(indexClassificazoneSonDeep>-1){
                    classificazoneSonDeep.splice(indexClassificazoneSonDeep,1);
                }else{
                    var item = Object.assign({}, selectedItem);
                    item.Zflagcanc = item.Zposizione !== null ? 'X' :null;
                    classificazoneSonDeep.push(item);
                }

                var indiceStep3 = step3List.findIndex((x)=>x.Id === selectedItem.Id);
                step3List.splice(indiceStep3,1)
            }
            
            
            var sum = 0;
            for(var i=0; i<step3List.length;i++){
                var item = step3List[i].ZimptotClass;
                if(!item || item === null)
                    item= "0";
                item.replace(",",".");
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

        // ----------------------------- END MANAGE PAY MODE  -----------------------------  //
        // onCancelRow: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     Step3List = self.getModel(STEP3_LIST).getData(),
        //     oTable = self.getView().byId(TABLE_STEP3),
        //     oTableModel = oTable.getModel(STEP3_LIST),
        //     selected = oTable.getSelectedItem();

        //   var path = selected.getBindingContextPath();
        //   var oItem = oTableModel.getObject(path);
        //   var index = oItem.Id;

        //   index !== 0 ? Step3List.splice(index, 1) : "";

        //   var sum = null;
        //   for (let i = 0; i < Step3List.length; i++) {
        //     if (i !== 0) {
        //       sum += parseFloat(Step3List[i]["ZimptotClass"]);
        //     }
        //   }
        //   console.log(sum);
        //   wizardModel.setProperty("/Zimptotcos", sum);
        //   var oModelJson = new sap.ui.model.json.JSONModel();
        //   oModelJson.setData(Step3List);
        //   console.log(Step3List);
        //   self.setModel(oModelJson, STEP3_LIST);
        // },

        // _getIdElement: function (oEvent) {
        //   var longId = oEvent.getSource().getId();
        //   console.log(longId);
        //   var arrayId = longId.split("-");
        //   var id = arrayId[arrayId.length - 1];
        //   return id;
        // },
        _getIdElementTable: function (oEvent) {
          var longId = oEvent.getSource().getId();
          console.log(longId);
          var arrayId = longId.split("-");
          var id = arrayId[arrayId.length - 2];
          return id;
        },
        // _setMessage: function (sTitle, sText, sType) {
        //   var self = this;
        //   var oBundle = self.getResourceBundle();
        //   var obj = {
        //     title: oBundle.getText(sTitle),
        //     onClose: function (oAction) {},
        //   };
        //   if (sType === "error")
        //     sap.m.MessageBox.error(oBundle.getText(sText), obj);
        //   else if (sType === "success")
        //     sap.m.MessageBox.success(oBundle.getText(sText), obj);
        //   else if (sType === "warning")
        //     sap.m.MessageBox.warning(oBundle.getText(sText), obj);
        // },
        // onLiveChange: function (oEvent) {
        //   var self = this,
        //     sNewValue,
        //     wizardModel = self.getModel(WIZARD_MODEL);

        //   var sInputId = self._getIdElement(oEvent);
        //   console.log(sInputId);
        //   var oInput = self.getView().byId(sInputId);
        //   var sProperty = oInput.data("property");

        //   sNewValue = oEvent.getSource().getValue();
        //   console.log("passa", sProperty);
        //   wizardModel.setProperty("/" + sProperty, sNewValue);
        // },

        onLiveChangeTable: function (oEvent) {
          var self = this,
            sNewValue,
            wizardModel = self.getModel(WIZARD_MODEL);

          var sInputId = self._getIdElementTable(oEvent);
          console.log(sInputId);
          var oInput = self.getView().byId(sInputId);
          var sProperty = oInput.data("property");

          sNewValue = oEvent.getSource().getValue();
          console.log(sNewValue);
          wizardModel.setProperty("/" + sProperty, sNewValue);
        },

        // onLiveChangeZtipodisp3List: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL);
        //   var sNewValue = oEvent.getSource().getSelectedKey();
        //   var sNewDesc = oEvent.getSource().getValue();
        //   wizardModel.setProperty("/Ztipodisp3", sNewValue);
        //   wizardModel.setProperty("/Zdesctipodisp3", sNewDesc);
        //   if (sNewValue !== null) self.fillFipos();
        // },

        // onSubmitGjahr: function (oEvent) {
        //   var self = this;
        //   self.fillZvimDescrufficio();
        //   self.fillZtipodisp3List();
        // },

        // onSubmitZufficioCont: function (oEvent) {
        //   var self = this;
        //   self.fillZvimDescrufficio();
        //   self.fillZtipodisp3List();
        // },
        // onSubmitKostl: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Kostl = wizardModel.getProperty("/Kostl");

        //   if (Kostl !== null) {
        //     oView.setBusy(true);
        //     var path = self.getModel().createKey(KostlMcSet_SET, {
        //       Kostl: Kostl,
        //     });
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + path, {
        //           success: function (data, oResponse) {
        //             oView.setBusy(false);
        //             console.log(data);
        //             wizardModel.setProperty("/Ltext", data.Ltext);
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },
        // fillBanks: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Iban = wizardModel.getProperty("/Iban"),
        //     Zwels = wizardModel.getProperty("/PayMode"),
        //     Lifnr = wizardModel.getProperty("/Lifnr");

        //   console.log("PETRO");

        //   if (Zwels !== null && Iban !== null && Lifnr !== null) {
        //     oView.setBusy(true);
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + ZbanksSet_SET, {
        //           urlParameters: { Iban: Iban, Zwels: Zwels, Lifnr: Lifnr },
        //           success: function (data, oResponse) {
        //             oView.setBusy(false);
        //             console.log(data);
        //             wizardModel.setProperty("/Banks", data.results["Banks"]);
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },
        // onSubmitSakrn: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Saknr = wizardModel.getProperty("/Saknr");
        //   console.log("in sub", Saknr);
        //   if (Saknr !== null) {
        //     oView.setBusy(true);
        //     var path = self.getModel().createKey(ContoCogeSet_SET, {
        //       Saknr: Saknr,
        //     });
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + path, {
        //           success: function (data, oResponse) {
        //             oView.setBusy(false);
        //             console.log(data);
        //             wizardModel.setProperty("/Skat", data.Skat);
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },
        // onSubmitLifnr: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Lifnr = wizardModel.getProperty("/Lifnr");

        //   console.log(Lifnr);
        //   if (Lifnr !== null) {
        //     oView.setBusy(true);
        //     var path = self.getModel().createKey(Beneficiary_SET, {
        //       Lifnr: Lifnr,
        //     });
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + path, {
        //           success: function (data, oResponse) {
        //             console.log(data);
        //             wizardModel.setProperty("/TaxnumCf", data.TaxnumCf);
        //             wizardModel.setProperty("/Taxnumxl", data.Taxnumxl);
        //             wizardModel.setProperty("/NameFirst", data.NameFirst);
        //             wizardModel.setProperty("/NameLast", data.NameLast);
        //             wizardModel.setProperty("/ZzragSoc", data.ZzragSoc);
        //             wizardModel.setProperty("/TaxnumPiva", data.TaxnumPiva);
        //             var type = data.Type === "1" ? true : false;
        //             wizardModel.setProperty("/Type", type);
        //             wizardModel.setProperty("/Zsede", data.Zsede);
        //             wizardModel.setProperty(
        //               "/Zdenominazione",
        //               data.Zdenominazione
        //             );
        //             self.fiilSedeBeneficiario(Lifnr);
        //             self.fillBanks();
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },
        // fiilSedeBeneficiario: function (Lifnr) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView();

        //   var filter = [self.setFilterEQWithKey("Lifnr", Lifnr)];
        //   console.log("filter", filter);
        //   self
        //     .getModel()
        //     .metadataLoaded()
        //     .then(function () {
        //       oDataModel.read("/" + SedeBeneficiario_SET, {
        //         filters: filter,
        //         success: function (data, oResponse) {
        //           oView.setBusy(false);
        //           console.log("sede", data);
        //           wizardModel.setProperty("/StrasList", data.results);
        //           wizardModel.setProperty(
        //             "/FirstKeyStras",
        //             data.results[0]["Stras"]
        //           );
        //         },
        //         error: function (error) {
        //           oView.setBusy(false);
        //         },
        //       });
        //     });
        // },
        // onLiveChangeStras: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Lifnr = wizardModel.getProperty("/Lifnr"),
        //     StrasList = wizardModel.getProperty("/StrasList");

        //   var array = StrasList.filter(
        //     (el) => el.Stras === oEvent.getParameter("value")
        //   );

        //   console.log(array);
        //   if (Lifnr !== null && array.length > 0) {
        //     oView.setBusy(true);
        //     wizardModel.setProperty("/Zidsede", array[0].Zidsede);
        //     var path = self.getModel().createKey(SedeBeneficiario_SET, {
        //       Lifnr: Lifnr,
        //       Zidsede: array[0].Zidsede,
        //     });
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + path, {
        //           success: function (data, oResponse) {
        //             console.log(data);
        //             oView.setBusy(false);
        //             wizardModel.setProperty("/Ort01", data.Ort01);
        //             wizardModel.setProperty("/Regio", data.Regio);
        //             wizardModel.setProperty("/Pstlz", data.Pstlz);
        //             wizardModel.setProperty("/Land1", data.Land1);
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },
        // onSubmitPayMode: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     PayMode = wizardModel.getProperty("/PayMode");

        //   if (PayMode === "ID6 Bonifico c/c estero") {
        //     wizardModel.setProperty("/isZcoordestEditable", true);
        //   }
        //   self.fillBanks();
        // },
        // onSubmitIban: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL);
        //   self.fillBanks();
        // },
        // onSubmitZcoordest: function (oEvent) {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Zcoordest = wizardModel.getProperty("/Zcoordest");

        //   console.log(Lifnr);
        //   if (Zcoordest !== null) {
        //     oView.setBusy(true);
        //     var path = self.getModel().createKey(ZcoordestSet_SET, {
        //       Zcoordest: Zcoordest,
        //     });
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + path, {
        //           success: function (data, oResponse) {
        //             oView.setBusy(false);
        //             console.log(data);
        //             wizardModel.setProperty("/Swift", data.Swift);
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },

        // fillZvimDescrufficio: function () {
        //   var self = this,
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     ZufficioCont = wizardModel.getProperty("/ZufficioCont"),
        //     Gjahr = wizardModel.getProperty("/Gjahr");

        //   if (Gjahr !== null && ZufficioCont !== null) {
        //     var path = self.getModel().createKey(ZufficioCont_SET, {
        //       ZufficioCont: ZufficioCont,
        //       Gjahr: Gjahr,
        //     });

        //     oView.setBusy(true);
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + path, {
        //           success: function (data, oResponse) {
        //             oView.setBusy(false);
        //             wizardModel.setProperty(
        //               "/ZvimDescrufficio",
        //               data.ZvimDescrufficio
        //             );
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   }
        // },

        // fillZtipodisp3List: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Gjahr = wizardModel.getProperty("/Gjahr"),
        //     ZufficioCont = wizardModel.getProperty("/ZufficioCont");

        //   if (Gjahr !== null && ZufficioCont !== null) {
        //     oView.setBusy(true);
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + Ztipodisp3_SET, {
        //           urlParameters: { Gjahr: Gjahr, ZufficioCont: ZufficioCont },
        //           success: function (data, oResponse) {
        //             oView.setBusy(false);
        //             wizardModel.setProperty("/Ztipodisp3List", data.results);
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },
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

        // fillFipos: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     Gjahr = wizardModel.getProperty("/Gjahr"),
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     oView = self.getView(),
        //     Ztipodisp3 = wizardModel.getProperty("/Ztipodisp3"),
        //     ZufficioCont = wizardModel.getProperty("/ZufficioCont");

        //   if (Gjahr !== null && ZufficioCont !== null && Ztipodisp3 !== null) {
        //     oView.setBusy(true);
        //     self
        //       .getModel()
        //       .metadataLoaded()
        //       .then(function () {
        //         oDataModel.read("/" + Fipos_SET, {
        //           urlParameters: {
        //             Gjahr: Gjahr,
        //             ZufficioCont: ZufficioCont,
        //             Ztipodisp3: Ztipodisp3,
        //           },
        //           success: function (data, oResponse) {
        //             oView.setBusy(false);
        //             wizardModel.setProperty("/FiposList", data.results);
        //           },
        //           error: function (error) {
        //             oView.setBusy(false);
        //           },
        //         });
        //       });
        //   } else return false;
        // },

        // goToTwo: function () {
        //   var self = this;
        //   console.log("IN TWO");
        //   this.validateStep1();
        //   // if (!this.validateStep1()) {
        //   //   self._wizard.previousStep();
        //   //   self._setMessage("titleDialogError", "validationFailed", "error");
        //   // } else
        //   self.updateDataSON([
        //     "Gjahr",
        //     "ZufficioCont",
        //     "Fipos",
        //     "Fistl",
        //     "Zdesctipodisp3",
        //     "Zimptot",
        //     "ZimptotDivisa",
        //   ]);
        // },
        // goToThree: function () {
        //   var self = this;
        //   console.log("IN THREE");

        //   // if (!this.validateStep2()) {
        //   //   self._wizard.previousStep();
        //   //   self._setMessage("titleDialogError", "validationFailed", "error");
        //   // } else
        //   self.updateDataSON([
        //     "Lifnr",
        //     "NameFirst",
        //     "NameLast",
        //     "TaxnumPiva",
        //     "ZzragSoc",
        //     "TaxnumCf",
        //   ]);
        //   this.validateStep2();
        // },
        // goToFour: function () {
        //   var self = this;
        //   console.log("IN FOUR");

        //   this.validateStep3();
        //   // if (!this.validateStep3()) {
        //   //   self._wizard.previousStep();
        //   //   self._setMessage("titleDialogError", "validationFailed", "error");
        //   // } else
        // },
        // updateDataSON: function (array) {
        //   var self = this,
        //     valueProperty = null,
        //     dataSONModel = self.getModel(DataSON_MODEL),
        //     wizardModel = self.getModel(WIZARD_MODEL);

        //   for (let i = 0; i < array.length; i++) {
        //     valueProperty = wizardModel.getProperty("/" + array[i]);
        //     dataSONModel.setProperty("/" + array[i], valueProperty);
        //   }
        // },
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
          //value =self.formatter.formatStringForDate(value);
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
        // validateStep1: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     Gjahr = wizardModel.getProperty("/Gjahr"),
        //     Ztipodisp3 = wizardModel.getProperty("/Ztipodisp3"),
        //     ZufficioCont = wizardModel.getProperty("/ZufficioCont"),
        //     Fistl = wizardModel.getProperty("/Fistl"),
        //     Kostl = wizardModel.getProperty("/Kostl"),
        //     Saknr = wizardModel.getProperty("/Saknr"),
        //     Fipos = wizardModel.getProperty("/Fipos"),
        //     Kostl = wizardModel.getProperty("/Kostl"),
        //     Saknr = wizardModel.getProperty("/Saknr");

        //   if (Fipos !== null && Fistl !== null) {
        //     var oParam = {
        //       Fipos: Fipos,
        //       Fistl: Fistl,
        //       Gjahr: Gjahr === null ? "" : Gjahr,
        //       Kostl: Kostl === null ? "" : Kostl, //TEST
        //       Ztipodisp3: Ztipodisp3 === null ? "" : Ztipodisp3,
        //       ZufficioCont: ZufficioCont === null ? "" : ZufficioCont,
        //       Saknr: Saknr === null ? "" : Saknr, //0012111000
        //       AgrName: "",
        //       Fipex: "",
        //       Fikrs: "",
        //       Prctr: "",
        //     };
        //     console.log(oParam);

        //     if (self.validationCall(URL_VALIDATION_1, oParam) === true)
        //       return true;
        //     else return false;
        //   } else {
        //     self._setMessage("titleDialogError", "msgNoRequiredField", "error");
        //     return false;
        //   }
        // },

        // validateStep2: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     Zimptot = wizardModel.getProperty("/Zimptot"),
        //     Iban = wizardModel.getProperty("/Iban"),
        //     Lifnr = wizardModel.getProperty("/Lifnr"),
        //     Zwels = wizardModel.getProperty("/PayMode"),
        //     Zcoordest = wizardModel.getProperty("/Zcoordest"),
        //     ZZcausaleval = wizardModel.getProperty("/ZZcausaleval");

        //   console.log("Number", Zimptot);
        //   // var oParam = {
        //   //   Zimptot: Zimptot,
        //   //   Iban: "",
        //   //   Lifnr: "0010000034",
        //   //   Zcoordest: "",
        //   //   Zwels: "ID6",
        //   //   ZZcausaleval: "",
        //   // };
        //   var oParam = {
        //     Zimptot: Zimptot === null ? 0 : Zimptot,
        //     Iban: Iban === null ? "" : Iban,
        //     Lifnr: Lifnr === null ? "" : Lifnr,
        //     Zcoordest: Zcoordest === null ? "" : Zcoordest,
        //     Zwels: Zwels === null ? "" : Zwels,
        //     ZZcausaleval: ZZcausaleval === null ? "" : ZZcausaleval,
        //   };
        //   console.log("2", oParam);

        //   if (self.validationCall(URL_VALIDATION_2, oParam) === true)
        //     return true;
        //   else return false;
        // },
        // validateStep3: function () {
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     oDataModel = self.getModel(),
        //     Zimptot = wizardModel.getProperty("/Zimptot"),
        //     Step3List = self.getModel(STEP3_LIST).getData(),
        //     Zimptotcos = wizardModel.getProperty("/Zimptotcos");

        //   var len = Step3List.lenght - 1;

        //   if (len > 0) {
        //     console.log("Zimptot", Zimptot);
        //     var oParam = {
        //       Zimptot: Zimptot === null ? 0 : Zimptot,
        //       Zimptotcos: Zimptotcos === null ? 0 : Zimptotcos,
        //     };
        //     // var oParam = {
        //     //   Zimptot: Zimptot,
        //     //   Zimptotcos: ZimptotClass,
        //     // };
        //     console.log(oParam);
        //     if (self.validationCall(URL_VALIDATION_3, oParam) === true)
        //       return true;
        //     else return false;
        //   } else {
        //     self._setMessage("titleDialogError", "msgNoRequiredField", "error");
        //     return false;
        //   }
        // },
        // validateStep4: function () {
        //   console.log("FOUR");
        //   var self = this,
        //     wizardModel = self.getModel(WIZARD_MODEL),
        //     Zlocpag = wizardModel.getProperty("/Zlocpag"),
        //     Zzonaint = wizardModel.getProperty("/Zzonaint"),
        //     Zcausale = wizardModel.getProperty("/Zcausale");
        //   console.log(Zzonaint);

        //   if (Zlocpag !== null && Zzonaint !== null && Zcausale !== null) {
        //     var oParam = {
        //       Zlocpag: Zlocpag === null ? "" : Zlocpag,
        //       Zzonaint: Zzonaint === null ? "" : Zzonaint,
        //     };
        //     console.log(oParam);

        //     if (self.validationCall(URL_VALIDATION_4, oParam) === true)
        //       return true;
        //     else return false;
        //   } else {
        //     self._setMessage("titleDialogError", "msgNoRequiredField", "error");
        //     return false;
        //   }
        // },

        // validationCall: function (url, oParam) {
        //   var self = this,
        //     oDataModel = self.getModel();
        //   self.getView().setBusy(true);
        //   oDataModel.callFunction("/" + url, {
        //     method: "GET",
        //     urlParameters: oParam,
        //     success: function (oData, response) {
        //       console.log(oData);
        //       self.getView().setBusy(false);
        //       var arrayMessage = oData.results;
        //       var arrayError = arrayMessage.filter((el) => el.Msgty === "E");
        //       if (arrayError.length > 0) {
        //         self._setMessage("titleDialogError", "msgError", "error");
        //         return false;
        //       }
        //       return true;
        //     },
        //     error: function (oError) {
        //       self.getView().setBusy(false);
        //       return false;
        //     },
        //   });
        // },

          configLog:function(){
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
                      self.oLogDialog.close()
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
          }



      }
    );
  }
);
