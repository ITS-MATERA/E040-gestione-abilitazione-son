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
        "z_s4_crossfirma/crossfirma/controls/Firma",
    ],
    function (BaseController, JSONModel, formatter, MessageBox, History,library,
        Spreadsheet,
        MessageItem,
        MessageView,
        Button,
        Dialog,
        Bar,
        Input,
        coreLibrary,
        libFirma) {
        "use strict";
        
    const EDM_TYPE = library.EdmType;

    const DETAIL_MODEL = "detailModel";
    const DataSON_MODEL = "DataModel";
    const WIZARD_MODEL = "wizardModel";
    const CHECKLIST_MODEL = "checkList";
    const DEFAULT_MODEL = "defaultModel";

    const WORKFLOW_SET = "SonWfSet";
    const SON_SET = "SonSet";
    const Beneficiary_SET = "BeneficiarioSonSet";
    const SedeBeneficiario_SET = "SedeBeneficiarioSonSet";
    const Zzamministr_SET = "UserParametersSet";
    const TABLE_STEP3 = "idTableStep3";
    const STEP3_LIST = "step3List";
    const URL_DEEP = "DeepSonSet";
    const OPERATION_TYPE_RETTIFICA ="RET";
    const CLASSIFICAZIONE_SON_DEEP="classificazioneSonModel";
    const COS="COS";

    const OPERATION_TYPE_SIGN = "FRM";      
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";
    

    return BaseController.extend(
    "gestioneabilitazioneeson.controller.SignSON",
    {
        formatter: formatter,
        _beneficiario:null,
        _sedeBeneficiario:null,
        _amministrazione:null,
        _indexClassificazioneSON:0,
        _detailShowed:false,
        libFirma:libFirma,
        onInit: function () {
            var self = this;

            var oDetailModel = new JSONModel({
                // detailTableTitle: null,
                total: null,
                checkList: [],
                // changeList: [],
                // dateForAll: null,
                buttonText: null,
                buttonVisible: false,
                buttonEnabled:false,
                // action: null,
                iconTab: "sap-icon://detail-view",
                text: this.getResourceBundle().getText("btnDetail"),
                key: this.getResourceBundle().getText("btnDetail"),
                // sendSignSON: false,
                // deleteCancel: false,
                // otherColumn: false,
                // showPanel: false,
                // titlePanel: null,
    
                // // isInChange: false,
                // tabSelectedKey: this.getResourceBundle().getText("btnDetail"),
                showSelection: false,
                headerVisible:false
            });

            var oWizardModel = new JSONModel(self.loadWizardModel());

            var oDataSONModel = new JSONModel(self.loadDataSONModel());  

            var Step3List = new JSONModel([
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
            self.configLog();
            self.setModel(oDetailModel, DETAIL_MODEL);    
            self.setModel(oWizardModel, WIZARD_MODEL);
            self.setModel(oDataSONModel, DataSON_MODEL);
            self.setModel(Step3List, STEP3_LIST);
            self.setModel(oClassificazioneModel, CLASSIFICAZIONE_SON_DEEP);
            
            self.getRouter().getRoute("signSON").attachPatternMatched(self._onObjectMatched, self);
            
        },

        _onObjectMatched: function (oEvent) {
            var self = this,
                oBundle = self.getResourceBundle(),
                detailModel = self.getView().getModel(DETAIL_MODEL);
            self._indexClassificazioneSON  = 0;    
            self.getAmministrazioneHeader();
            
            if (self.getModelGlobal(CHECKLIST_MODEL) === undefined/* || self.getModelGlobal("actionModel") === undefined*/) {
                self.getRouter().navTo("listSON");
            }

            self.getView().setBusy(true);
            var tab = self.getView().byId("idIconTabBar");
            var key = tab.getSelectedKey();
            if(key===oBundle.getText("btnSign")){
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextSignSON"));
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonEnabled",self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData().Z06Enabled);
            }
            else
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonEnabled",true);

            var checkList = self.getModelGlobal(CHECKLIST_MODEL).getData();
            if (checkList && checkList.length === 1) {
              self.getView().setBusy(true);
              self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible", true);
              self.fillWizard(checkList[0]);
            }
            
            setTimeout(() => {                
                detailModel.setProperty("/checkList", checkList);
                detailModel.setProperty("/total", checkList.length);
                if (!checkList || checkList.length !== 1)
                  self.getView().setBusy(false);
            },1000);
        },


        onSelectTab: function (oEvent) {
            var self = this,
                oBundle = self.getResourceBundle(),
                checkList = self.getModelGlobal(CHECKLIST_MODEL).getData(),
                totalRows = self.getView().getModel(DETAIL_MODEL).getProperty("/total");
            var tab = self.getView().byId("idIconTabBar");
            var key = tab.getSelectedKey();
            
            self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection",totalRows > 1 ? true : false);
            self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
            self.getView().getModel(DETAIL_MODEL).setProperty("/buttonEnabled",true);
            switch (key) {
                case oBundle.getText("btnSign"):
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextSignSON"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonEnabled",self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData().Z06Enabled);
                    if(totalRows === 1){
                        self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                        self.fillWizard(checkList[0]);
                    }   
                    break;
                case oBundle.getText("btnWorkflow"):
                    self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection", true);
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnStart"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible", true);
                    // self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",totalRows > 1 ? true : false);
                    // if(totalRows === 1){                        
                    //     self.fillWorkflow(checkList[0]);
                    // }
                    break;
                case oBundle.getText("btnDetail"):    
                    self._detailShowed=true;               
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnStart"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",totalRows > 1 ? true : false);
                    if(totalRows === 1){
                        self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
                        self.fillWizard(checkList[0]);
                    }                    
                    break;
                default:
                    console.log("default");
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText","default"); //TODO:non si deve verificare
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
                    self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
                    break;
            }            
        },


            onNavBack:function(oEvent){
                var self = this;
                self.resetForBack("btnSign", false);
                self.resetLog();
                self._detailShowed=false;
                self.getRouter().navTo("listSON");
            },
    

        onAction:function(oEvent){
            var self =this,
                oTable,
                oBundle = self.getResourceBundle(),
                tab = self.getView().byId("idIconTabBar"),
                key = tab.getSelectedKey(),
                action;
            self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);

            switch(key){
                case oBundle.getText("btnSign"):
                    var oDialog = new sap.m.Dialog({
                        title: oBundle.getText("btnSign"),
                        state: "Warning",
                        type: "Message",
                        content: [
                          new sap.m.Text({
                            text: oBundle.getText("msgSignSon"),
                          }),
                        ],
                        beginButton: new sap.m.Button({
                          text: oBundle.getText("btnOK"),
                          type: "Emphasized",
                          press: function () {
                            self.resetLog();
                            oDialog.close();
                            //giannilecci
                            //self.callDeep(OPERATION_TYPE_SIGN);
                            self.checkSignSon();
                            // self.checkSignSon(function(callback){
                            //     if(callback){
                            //         console.log(callback);
                            //         // self.callDeep(OPERATION_TYPE_SIGN);
                            //     }
                            //     else{
                            //         console.log("ktm");
                            //     }
                            // });
                          }
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
                    break;
                case oBundle.getText("btnDetail"):
                    oTable = self.getView().byId("idTableDetail");
                    action = oBundle.getText("btnDetail");
                    break;
                case oBundle.getText("btnWorkflow"):
                    oTable = self.getView().byId("idTableWorkflow");
                    action = oBundle.getText("btnWorkflow");
                    break;
                default:
                    console.log("default") //default     
            } 
            
            if(key !== oBundle.getText("btnSign")){
                var selectedItem = oTable.getSelectedItem();
                if (selectedItem !== null) {
                    var p = selectedItem.getBindingContextPath();
                    var oTableModel = self.getModel(CHECKLIST_MODEL);
                    var oItem = oTableModel.getObject(p);
                    if(action === oBundle.getText("btnDetail")){
                        self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection",false);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
                        self.fillWizard(oItem);
                    }
                    else if(action === oBundle.getText("btnWorkflow")){
                        self.getView().setBusy(true);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection",false);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
                        self.fillWorkflow(oItem);
                    }
                    else{
                        self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
                        //nada per ora
                    }    
                }
            }
        },

       
        checkSignSon:function(callback){
            var self = this,
                oDataModel = self.getModel(),
                detailModel = self.getModel(DETAIL_MODEL),
                checklist = detailModel.getProperty("/checkList");      

            
            for(var i=0; i<checklist.length;i++){
                var item = checklist[i];

              var filter = [self.setFilterEQWithKey("Key", item.Zchiavesop)];
              self.getModel().metadataLoaded().then(function () {
                  oDataModel.read("/FileSet", {
                    filters: filter,
                    success: function (data, oResponse) {
                      console.log(data);
                      if(data.results.length>0)

                      var oRecord = {
                        Base64:data.results[0].Value,
                        FileName: "Modello_Amministrativo_SON_" + item.Zchiavesop + ".pdf",
                        IdDocumento:item.Zchiavesop, //Modello_Amministrativo_SON_
                        Size:"",
                        Type:"application/pdf"
                      }
                      self.getView().setBusy(false);
                      var oConstructor = new self.libFirma();
                      oConstructor.functionStartFirma(self, oRecord,"gestioneabilitazioneeson.view.SignSON" );
                       
                    },
                    error: function (error) {
                      self.getView().setBusy(false);
                      console.log(error);
                    },
                  });
              });
            }                    
        },

        functionReturLibraryFirma:function(obj){
            var self= this,
                oBundle = self.getResourceBundle(),
                detailModel = self.getModel(DETAIL_MODEL),
                checklist = detailModel.getProperty("/checkList");
            console.log(obj);//TODO:da canc
            if(obj && obj[0].Esito !== "OK"){
              sap.m.MessageBox.error(obj[0].Esito, {
                title: oBundle.getText("btnSign"),
                onClose: function (oAction) {  }
              });   
            }
            else{
              // self.callDeep(OPERATION_TYPE_SIGN);//TODO:da verificare
              var list=[];
              var item = checklist.find(x=>x.Zchiavesop === obj[0].IdDocumento);
              console.log(item);
              if(item){
                list.push(item);
                self.callSingleDeep(OPERATION_TYPE_SIGN, list, obj[0]);
              }
            }
        },

        callDeep: function (operationType) {
            var self = this,
                oBundle = self.getResourceBundle(),
                oDataModel = self.getModel(),
                detailModel = self.getModel(DETAIL_MODEL),
                checklist = detailModel.getProperty("/checkList");
            checklist = self.resolveChecklist(checklist);    
   
            var entityRequestBody = {
              Zchiavesop: "",
              Bukrs: "",
              Gjahr: "",
              Ztipososp: "",
              ClassificazioneSonSet: [],
              OperationType: operationType,
              SonSet: checklist,
              SonMessageSet: [],
            };
  
            self.getView().setBusy(true);
            oDataModel.create("/" + URL_DEEP, entityRequestBody, {
              success: function (result) {
                self.getView().setBusy(false);
                var arrayMessage = result.SonMessageSet.results;
                console.log(arrayMessage);
                var isSuccess = self.isErrorInLog(arrayMessage);
                console.log(isSuccess);
                if (isSuccess) {        
                    sap.m.MessageBox.success(oBundle.getText("operationOK"), {
                        title: oBundle.getText("btnSign"),
                        onClose: function (oAction) {
                          self.downloadSignedFile();
                          self.setPropertyGlobal(self.RELOAD_MODEL,"canRefresh",true);
                          self.onNavBack();
                        },
                      });   
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

        callSingleDeep: function (operationType, checklist, documentoFirmato) {
          var self = this,
              oBundle = self.getResourceBundle(),
              oDataModel = self.getModel(),
              detailModel = self.getModel(DETAIL_MODEL);
          checklist = self.resolveChecklist(checklist);    
 
          var entityRequestBody = {
            Zchiavesop: "",
            Bukrs: "",
            Gjahr: "",
            Ztipososp: "",
            ClassificazioneSonSet: [],
            OperationType: operationType,
            SonSet: checklist,
            SonMessageSet: [],
          };

          self.getView().setBusy(true);
          oDataModel.create("/" + URL_DEEP, entityRequestBody, {
            success: function (result) {
              self.getView().setBusy(false);
              var arrayMessage = result.SonMessageSet.results;
              console.log(arrayMessage);
              var isSuccess = self.isErrorInLog(arrayMessage);
              console.log(isSuccess);
              if (isSuccess) {        
                  sap.m.MessageBox.success(oBundle.getText("operationOK"), {
                      title: oBundle.getText("btnSign"),
                      onClose: function (oAction) {
                        self.downloadFileFromContent(documentoFirmato);
                        self.setPropertyGlobal(self.RELOAD_MODEL,"canRefresh",true);
                        self.onNavBack();
                      },
                    });   
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

        downloadSignedFile:function(){
            var self =this,
                detailModel = self.getModel(DETAIL_MODEL),
                checklist = detailModel.getProperty("/checkList");

            for(var i=0; i<checklist.length;i++){
                var item = checklist[i];
                self.downloadFile(item.Zchiavesop);
            }
        },

        
    })
})