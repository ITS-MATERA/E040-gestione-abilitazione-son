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

    const DataSON_MODEL = "DataModel";
    const WIZARD_MODEL = "wizardModel";
    const DETAIL_MODEL = "detailModel";
    const ICONTAB_MODEL = "iconTabModel";
    const WORKFLOW_MODEL = "workflowModel";
    const LIST_MODEL = "listTable";
    const UfficioContMcSet_SET = "UfficioContMcSet";

    const Zzamministr_SET = "UserParametersSet";

    const TABLE_STEP3 = "idTableStep3";

    const WORKFLOW_SET = "SonWfSet";
    const URL_DEEP = "DeepSonSet";
    const STEP3_LIST = "step3List";
    const TABLE = "idDetailTable";

    const OPERATION_TYPE_SIGN = "FRM";
    const OPERATION_TYPE_SEND_SIGN = "INV";
    const OPERATION_TYPE_CANCEL_SON = "ANN";
    const OPERATION_TYPE_DELETE_SIGN = "RVF";
    const OPERATION_TYPE_DELETE_SEND_SIGN = "REV";
    const OPERATION_TYPE_DELETE_CANCEL = "CRC";
    const OPERATION_TYPE_REGISTER_CANCEL = "RRC";
    const OPERATION_TYPE_RETTIFICA ="RET";

    const HEADER_ACTION_MODEL = "headerActionModel";

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

    const URL_VALIDATION_1 = "ValidazioneSonRegW1";
    const URL_VALIDATION_2 = "ValidazioneSonRegW2";
    const URL_VALIDATION_3 = "ValidazioneSonW3";
    const URL_VALIDATION_4 = "ValidazioneSonRegW4";
    const OPERATION_TYPE_INSERT = "INS";
    const SON_SET = "SonSet";
    const CHECKLIST_MODEL = "checkList";
    const CLASSIFICAZIONE_SON_DEEP="classificazioneSonModel";
    const LOG_MODEL = "logModel";
    const MESSAGE_MODEL = "messageModel";
    const COS = "COS";

    return BaseController.extend(
      "gestioneabilitazioneeson.controller.DetailSON",
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

            var oIconTabModel = new JSONModel({
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
          self.setModel(oDetailModel, DETAIL_MODEL);    
          self.setModel(oWizardModel, WIZARD_MODEL);
          self.setModel(oDataSONModel, DataSON_MODEL);
          self.setModel(Step3List, STEP3_LIST);
          self.setModel(oClassificazioneModel, CLASSIFICAZIONE_SON_DEEP);
          self.setModel(oIconTabModel, ICONTAB_MODEL);
          self.setModel(oHeaderActionModel,HEADER_ACTION_MODEL);
          self.getRouter().getRoute("detailSON").attachPatternMatched(self._onObjectMatched, self);
            
        },

        _onObjectMatched: function (oEvent) {
            var self = this,
                oBundle = self.getResourceBundle();
                
            self._indexClassificazioneSON  = 0;
            if (self.getModelGlobal("checkList") === undefined || self.getModelGlobal("actionModel") === undefined) {
              self.setPropertyGlobal(self.RELOAD_MODEL,"canRefresh",true);
              self.onNavBack();
            }
            var  detailModel = self.getView().getModel(DETAIL_MODEL),
                 actionList = this.getModelGlobal("actionModel").getData();

            var oIconTabModel = new JSONModel({
              DetailEnabled: true,
              CancelSONEnabled: actionList.CancelSONEnabled,
              SendSignSONEnabled: actionList.SendSignSONEnabled,
              DeleteSendSignSONEnabled: actionList.DeleteSendSignSONEnabled,
              SignSONEnabled: actionList.SignSONEnabled,
              DeleteSignSONEnabled: actionList.DeleteSignSONEnabled,
              RegisterCancelSONEnabled: actionList.RegisterCancelSONEnabled,
              DeleteCancelSONEnabled: actionList.DeleteCancelSONEnabled,
              ChangeSONEnabled: actionList.ChangeSONEnabled,
            });
            self.setModel(oIconTabModel, ICONTAB_MODEL);    
            self.getView().setBusy(true);
            self.getAmministrazioneHeader();
            
            if (self.getModelGlobal(CHECKLIST_MODEL) === undefined/* || self.getModelGlobal("actionModel") === undefined*/) {
                self.getRouter().navTo("listSON");
            }

            self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText","");
            self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
            var tab = self.getView().byId("idIconTabBar");
            var key = tab.getSelectedKey();
            self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",key===oBundle.getText("btnDetail") ? true :false);
            
            var checkList = self.getModelGlobal(CHECKLIST_MODEL).getData();
            setTimeout(() => {       
                self._detailShowed=true;         
                detailModel.setProperty("/checkList", checkList);
                detailModel.setProperty("/total", checkList.length);
                self.fillWizard(checkList[0]);
            },2500);
        },


        onSelectTab: function (oEvent) {
            var self = this,
                oBundle = self.getResourceBundle(),
                detailModel = self.getView().getModel(DETAIL_MODEL),
                checkList = self.getModelGlobal(CHECKLIST_MODEL).getData(),
                totalRows = self.getView().getModel(DETAIL_MODEL).getProperty("/total");
            var tab = self.getView().byId("idIconTabBar");
            var key = tab.getSelectedKey();
            
            self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection",totalRows > 1 ? true : false);
            self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
            switch (key) {
                case oBundle.getText("btnCancelSON"):
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextCancelSON"));
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                  self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
                  break;
                case oBundle.getText("btnSendSign"):
                  detailModel.setProperty("/changeList", checkList);
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextSendSign"));
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                  self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
                  break;
                case oBundle.getText("btnDeleteSendSign"):
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextDeleteSendSign"));
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                  self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
                  break;                    
                case oBundle.getText("btnSign"):
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextSignSON"));
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                  self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                  break;
                case oBundle.getText("btnRegisterCancel"):
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextRegisterCancel"));
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                  self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
                  break;
                case oBundle.getText("btnDeleteCancel"):
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnDeleteCancel"));
                  self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                  self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                  break;   
                case oBundle.getText("btnDeleteSign"):
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnTextDeleteSign"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",true);
                    self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                    break;
                case oBundle.getText("btnWorkflow"):
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnStart"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",totalRows > 1 ? true : false);
                    if(totalRows === 1){                        
                        self.fillWorkflow(checkList[0]);
                    }
                    break;
                  case oBundle.getText("btnFake"):    
                    self._detailShowed=true;               
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",oBundle.getText("btnStart"));
                    self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",totalRows > 1 ? true : false);
                    if(totalRows === 1){
                        self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",true);
                        self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
                        self.fillWizard(checkList[0]);
                    }              
                    tab.setSelectedKey(oBundle.getText("btnDetail"));      
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

        fillWorkflow: function (oItem) {
            var self = this,
              oDataModel = self.getModel(),
              oView = self.getView();
  
            var Zchiavesop = oItem["Zchiavesop"];
            var filter = [
              self.setFilterEQWithKey("Zchiavesop", Zchiavesop),
            ];
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
                    for(var i=0;i<res.length;i++){
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
        
        getBeneficiarioHeader: function(lifnr){
            var self = this,
                oDataModel = self.getModel();

            if(!lifnr || lifnr === null || lifnr === "")
                return false;

            var path = self.getModel().createKey(Beneficiary_SET, {
                Lifnr: lifnr,
            });

            self.getModel().metadataLoaded().then(function () {
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

        getSedeBeneficiario:function(lifnr,idSede){
            var self = this,
                oDataModel = self.getModel();

            if(!lifnr || lifnr === null || lifnr === "")
                return false;

            var path = self.getModel().createKey(SedeBeneficiario_SET, {
                Lifnr: lifnr,
                Zidsede: idSede
            });

            self.getModel().metadataLoaded().then(function () {
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

        getAmministrazioneHeader:function(){
            var self= this,
                oDataModel = self.getModel();

            var path = self.getModel().createKey(Zzamministr_SET, {
                Name: "PRC",
            });

            self.getModel().metadataLoaded().then(function () {
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

            onNavBack:function(oEvent){
              var self = this;
              self.resetForBack("btnDetail",true);
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
                checkList = self.getModelGlobal(CHECKLIST_MODEL).getData(),
                action;                
            self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);
            var title = "",
                contentMessage="",
                operationType="",
                objectParams={},
                hasChangeList = false,
                successTitle="",
                canDownload=false,
                successContent=oBundle.getText("operationOK"),
                son = checkList[0].Zchiavesop;

            switch (key) {
              case oBundle.getText("btnCancelSON"):
                title = oBundle.getText("btnCancelSON");
                contentMessage = oBundle.getText("msgAnnullamentoSon");
                operationType = OPERATION_TYPE_CANCEL_SON;
                hasChangeList = false;
                successTitle=oBundle.getText("btnCancelSON");
                break;
              case oBundle.getText("btnSendSign"):
                title = oBundle.getText("btnSendSign");
                contentMessage = oBundle.getText("msgSendSignSon");
                operationType = OPERATION_TYPE_SEND_SIGN;
                hasChangeList = true;
                successTitle=oBundle.getText("btnSendSign");
                objectParams ={
                  ZuffcontFirm:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZufficioCont"),
                  Zcdr:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/Zcdr"),
                  ZdirigenteAmm:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZdirigenteAmm")
                };
                break;
              case oBundle.getText("btnDeleteSendSign"):
                title = oBundle.getText("btnDeleteSendSign");
                contentMessage = oBundle.getText("msgDeleteSendSignSon");
                operationType = OPERATION_TYPE_DELETE_SEND_SIGN;
                hasChangeList = false;
                successTitle=oBundle.getText("btnDeleteSendSign");                
                break;                    
              case oBundle.getText("btnSign"):
                title = oBundle.getText("btnSign");
                contentMessage = oBundle.getText("msgSignSon");
                operationType = OPERATION_TYPE_SIGN;
                hasChangeList = false;
                successTitle=oBundle.getText("btnSign");
                canDownload=true;
                break;
              case oBundle.getText("btnRegisterCancel"):
                title = oBundle.getText("btnRegisterCancel");
                contentMessage = oBundle.getText("msgRegisterCancel");
                operationType = OPERATION_TYPE_REGISTER_CANCEL;
                hasChangeList = false;
                successTitle=oBundle.getText("btnRegisterCancel");
                objectParams={
                  ZuffcontRicann:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZufficioCont"),
                  CdrRicann:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/Zcdr"),
                  ZdirigenteRicann:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZdirigenteAmm")
                };
                successContent=oBundle.getText("operationOK") + "/n" + "Richiesta di annullamento registrata per il SON N. " + son;
                break;
              case oBundle.getText("btnDeleteCancel"):
                title = oBundle.getText("btnDeleteCancel");
                contentMessage = oBundle.getText("msgDeleteCancel");
                operationType = OPERATION_TYPE_DELETE_CANCEL;
                hasChangeList = false;
                successTitle=oBundle.getText("btnDeleteCancelSON");
                objectParams={
                  ZuffcontCancricann:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZufficioCont"),
                  CdrCancricann:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/Zcdr"),
                  ZdirigenteCancricann:self.getView().getModel(HEADER_ACTION_MODEL).getProperty("/ZdirigenteAmm")
                };
                break;   
              case oBundle.getText("btnDeleteSign"):
                title = oBundle.getText("btnDeleteSign");
                contentMessage = oBundle.getText("msgDeleteSignSon");
                operationType = OPERATION_TYPE_DELETE_SIGN;
                hasChangeList = false;
                successTitle=oBundle.getText("btnDeleteSign");
                break;
              case oBundle.getText("btnDetail"):    
                title = oBundle.getText("btnDetail");
                contentMessage = oBundle.getText("msgRettificaSon");
                operationType = OPERATION_TYPE_RETTIFICA;
                hasChangeList = false;
                successTitle=oBundle.getText("btnChangeSON");      
                break;
              default:
                console.log("default");                   
                break;
            } 
            
            if(key === oBundle.getText("btnDetail") || key === oBundle.getText("btnWorkflow")){
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
              return false;
            }

            var oDialog = new sap.m.Dialog({
              title: title,
              state: "Warning",
              type: "Message",
              content: [
                new sap.m.Text({
                  text: contentMessage,
                }),
              ],
              beginButton: new sap.m.Button({
                text: oBundle.getText("btnOK"),
                type: "Emphasized",
                press: function () {
                  self.resetLog();
                  oDialog.close();
                  self.callDeep(operationType, hasChangeList, objectParams, successTitle, successContent, canDownload);
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
          
          },  

        onZnumprotsUpdate:function(oEvent){
          var self =this,
              path = oEvent.getSource().getParent().getBindingContextPath(),
              detailModel = self.getModel(DETAIL_MODEL);
          
          detailModel.setProperty(path+"/Znumprot",oEvent.getParameters().value); 
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

        callDeep: function (operationType, hasChangeList, objectParams, title, contentMessage, canDownload) {
            var self = this,
                oBundle = self.getResourceBundle(),
                oDataModel = self.getModel(),
                detailModel = self.getModel(DETAIL_MODEL),
                checklist = detailModel.getProperty("/checkList");
               
            if(hasChangeList)
              checklist = detailModel.getProperty("/changeList");
                  
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
                    sap.m.MessageBox.success(contentMessage, {
                        title: title,
                        onClose: function (oAction) {
                          self.downloadSignFile();
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
              urlParameters: objectParams,
            });
        },

        downloadSignFile:function(){
            var self =this,
                detailModel = self.getModel(DETAIL_MODEL),
                checklist = detailModel.getProperty("/checkList");

            for(var i=0; i<checklist.length;i++){
                var item = checklist[i];
                self.downloadFile(item.Zchiavesop);
            }
        },
        
      });
});
