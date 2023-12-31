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
    const UfficioContMc_SET="UfficioContMcSet";
    const HEADER_ACTION_MODEL = "headerActionModel";
    const OPERATION_TYPE_SEND_SIGN = "INV";
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";

    return BaseController.extend(
    "gestioneabilitazioneeson.controller.SendSignSON",
    {
        formatter: formatter,
        _beneficiario:null,
        _sedeBeneficiario:null,
        _amministrazione:null,
        _indexClassificazioneSON:0,
        _detailShowed:false,
        onInit: function () {
            var self = this;

            var oDetailModel = new JSONModel({
                // detailTableTitle: null,
                total: null,
                checkList: [],
                changeList: [],
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

            var oHeaderActionModel= new JSONModel([
                {
                    ZufficioCont:null,
                    ZvimDescrufficio:null,
                    Zcodord:null,
                    ZcodordDesc:null,
                    Zcdr:null,
                    ZdirigenteAmm:null,
                },
            ]);

            self.configLog();
            self.setModel(oHeaderActionModel,HEADER_ACTION_MODEL);
            self.setModel(oDetailModel, DETAIL_MODEL);    
            self.setModel(oWizardModel, WIZARD_MODEL);
            self.setModel(oDataSONModel, DataSON_MODEL);
            self.setModel(Step3List, STEP3_LIST);
            self.setModel(oClassificazioneModel, CLASSIFICAZIONE_SON_DEEP);
            
            self.getRouter().getRoute("sendSignSON").attachPatternMatched(self._onObjectMatched, self);            
        },

        _onObjectMatched: function (oEvent) {
            var self = this,
                oBundle = self.getResourceBundle(),
                detailModel = self.getView().getModel(DETAIL_MODEL);
                self.getView().setBusy(true);    
            self._indexClassificazioneSON  = 0;    
            self.getUfficioAction();    
            self.getAmministrazioneHeader();
            
            if (self.getModelGlobal(CHECKLIST_MODEL) === undefined/* || self.getModelGlobal("actionModel") === undefined*/) {
                self.getRouter().navTo("listSON");
            }
            
            var tab = self.getView().byId("idIconTabBar");
            var key = tab.getSelectedKey();
            if(key===oBundle.getText("btnSendSign")){
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextSendSign"));
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonEnabled",self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData().Z04Enabled);
            }
            else
                self.getView().getModel(DETAIL_MODEL).setProperty("/buttonEnabled",true);

            var checkList = self.getModelGlobal(CHECKLIST_MODEL).getData();
            setTimeout(() => {                
                detailModel.setProperty("/checkList", checkList);
                detailModel.setProperty("/changeList", checkList);
                detailModel.setProperty("/total", checkList.length);
                if(checkList.length === 1){
                    self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/Zcdr",checkList[0].Fistl);
                }else  
                    self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/Zcdr","");      
                self.getView().setBusy(false);           
            },2000);
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
                        console.log(data);//TODO:da canc
                        self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/ZufficioCont",data.ZufficioCont);
                        self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/ZvimDescrufficio",data.ZvimDescrufficio);
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
            });
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
                case oBundle.getText("btnSendSign"):
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextSendSign"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonEnabled",self.getModelGlobal(self.AUTHORITY_CHECK_SON).getData().Z04Enabled);
                    break;
                case oBundle.getText("btnWorkflow"):
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnStart"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                    // self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",totalRows > 1 ? true : false);
                    self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection",true);
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
                        self.fillWizard(checkList[0],"gestioneabilitazioneeson.view.SendSignSON");
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


            onSendSignUpdateDate: function () {
                var self = this,
                    oBundle=self.getResourceBundle(),
                    checkList = self.getView().getModel(DETAIL_MODEL).getProperty("/changeList"),
                    sendSignSonDt = self.getView().byId("sendSignSonDt"); 

                if(!sendSignSonDt._bValid){
                    sap.m.MessageBox.warning("Inserire una data valida", {
                        title: oBundle.getText("titleDialogWarning"),
                        onClose: function (oAction) {
                        }
                      });
                    return false;   
                }

                for(var i=0; i< checkList.length;i++){
                    var item = checkList[i];
                    if(item.Zdataprot === null){
                        var dt = sendSignSonDt.getDateValue(),
                            sMonth = dt.getMonth()+1,
                            sValue;
                        if(sMonth<10)
                            sMonth = "0" + sMonth;
                        sValue = dt.getFullYear()+ "-" + sMonth +"-"+ dt.getDate();
                        item.Zdataprot = new Date(sValue)
                        console.log(item.Zdataprot);
                    }
                }
                self.getView().getModel(DETAIL_MODEL).setProperty("/changeList", checkList);
              },

              onChangeUpdateDateRow: function (oEvent) {
                var self = this,
                    value = oEvent.getParameters().value,
                    path = oEvent.getSource().getParent().getBindingContextPath(),
                    detailModel = self.getModel(DETAIL_MODEL);
                
                if(value && value !== undefined && value !== ""){
                    var newDate = formatter.formatStringForDate(value); 
                    detailModel.setProperty(path+"/Zdataprot",newDate);    
                }        
                else{
                    detailModel.setProperty(path+"/Zdataprot",null);   
                }    
              },     
              
              onZnumprotsUpdate:function(oEvent){
                var self =this,
                    path = oEvent.getSource().getParent().getBindingContextPath(),
                    detailModel = self.getModel(DETAIL_MODEL);
                
                detailModel.setProperty(path+"/Znumprot",oEvent.getParameters().value); 
              },

        onNavBack:function(oEvent){
            var self = this;
            self.resetForBack("btnSendSign", true);
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
                case oBundle.getText("btnSendSign"):
                    var oDialog = new sap.m.Dialog({
                        title: oBundle.getText("btnSendSign"),
                        state: "Warning",
                        type: "Message",
                        content: [
                          new sap.m.Text({
                            text: oBundle.getText("msgSendSignSon"),
                          }),
                        ],
                        beginButton: new sap.m.Button({
                          text: oBundle.getText("btnOK"),
                          type: "Emphasized",
                          press: function () {
                            self.resetLog();
                            oDialog.close();
                            self.callDeep(OPERATION_TYPE_SEND_SIGN);
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
            
            if(key !== oBundle.getText("btnSendSign")){
                var selectedItem = oTable.getSelectedItem();
                if (selectedItem !== null) {
                    var p = selectedItem.getBindingContextPath();
                    var oTableModel = self.getModel(CHECKLIST_MODEL);
                    var oItem = oTableModel.getObject(p);
                    if(action === oBundle.getText("btnDetail")){
                        self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection",false);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
                        self.fillWizard(oItem,"gestioneabilitazioneeson.view.SendSignSON");
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

        

        callDeep: function (operationType) {
            var self = this,
                oBundle = self.getResourceBundle(),
                oDataModel = self.getModel(),
                detailModel = self.getModel(DETAIL_MODEL),
                list = detailModel.getProperty("/changeList"),
                checklist = JSON.parse(JSON.stringify(list));
                //checklist = Object.assign([], list);
                // checklist = detailModel.getProperty("/checkList");
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
                        title: oBundle.getText("btnSendSign"),
                        onClose: function (oAction) {
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
              urlParameters: {
                    ZuffcontFirm:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZufficioCont") &&
                              self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZufficioCont") !== "" ?
                              self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZufficioCont") : null,
                    Zcdr:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/Zcdr") && 
                        self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/Zcdr") !== "" ? 
                        self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/Zcdr") : null,
                    ZdirigenteAmm: self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZdirigenteAmm") && 
                                  self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZdirigenteAmm") !== "" ? 
                                  self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZdirigenteAmm") : null
                },
            });
        },

    })
})