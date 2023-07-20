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

            var oWizardModel = new JSONModel({
                btnBackVisible:false,
                btnNextVisible:true,
                btnFinishVisible:false,
                isInChange: false,
                Step3TableTitle: null,
                Bukrs:null,
                Zchiavesop:null,
                Ztipososp:null,
                Zstep:null,
                Zzamministr:null,
                Zchiaveopi:null,
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
                isZZcausalevalEditable:false,
                Swift: null,
                PayMode: null,
                ZZcausaleval: null,
                Zwels:null,
                ZCausaleval:null
            });

            var oDataSONModel = new JSONModel({
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
                PayMode:[],
                NewPayMode:[]
            });  

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

        // getPayModeByLifnr:function(lifnr,callback){
        //   var self =this,
        //       oDataModel = self.getModel();
        //   if(!lifnr || lifnr === null || lifnr === "")
        //       return false;

        //   var filter = [];
        //   filter.push(new sap.ui.model.Filter("Lifnr",sap.ui.model.FilterOperator.EQ,lifnr));

        //   self.getModel().metadataLoaded().then(function () {
        //     oDataModel.read("/ZwelsListSet", {
        //         filters: filter,
        //         success: function (data, oResponse) {
        //             console.log(data.results); //TODO:da canc
        //             return callback({data:data.results, error: false});
        //         },
        //         error: function (error) {
        //           console.log(error)
        //           return callback({data:error, error: true});
        //         },
        //     });
        //   });
        // },

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

        fillWizard: function (oItem) {
            var self = this,
                oWizardModel,
                oDataModel=self.getModel();
            self.getView().setBusy(true);
            self.payMode=[];
            console.log("hello", oItem);//TODO:da canc
            
            var path = self.getModel().createKey(SON_SET, {
                Bukrs: oItem.Bukrs,
                Gjahr: oItem.Gjahr,
                Zchiavesop: oItem.Zchiavesop,
                Zstep: oItem.Zstep,
                Ztipososp: oItem.Ztipososp
            });

            self.getModel().metadataLoaded().then(function () {
                oDataModel.read("/" + path, {
                    success: function (data, oResponse) {
                        self.getBeneficiarioHeader(data.Lifnr);
                        self.getPayModeByLifnr(data.Lifnr,"",true,function(callback){
                          if(!callback.error){
                            self.payMode = callback.data;
                          }
                          else 
                            self.payMode = [];
                        });

                        self.getSedeBeneficiario(data.Lifnr, data.Zidsede);
                        oWizardModel = self.setWizardModel(data);

                        setTimeout(() => {     
                            oWizardModel.getData().FirstKeyStras= self._sedeBeneficiario ? self._sedeBeneficiario.Stras: "";
                            oWizardModel.getData().Zidsede= data.Zidsede;
                            oWizardModel.getData().Ort01= self._sedeBeneficiario ? self._sedeBeneficiario.Ort01 : "";
                            oWizardModel.getData().Regio= self._sedeBeneficiario ? self._sedeBeneficiario.Regio : "";
                            oWizardModel.getData().Pstlz= self._sedeBeneficiario ? self._sedeBeneficiario.Pstlz : "";
                            oWizardModel.getData().Land1= self._sedeBeneficiario ? self._sedeBeneficiario.Land1 : "";
                            oWizardModel.getData().NameFirst= self._beneficiario ? self._beneficiario.NameFirst : "";
                            oWizardModel.getData().ZzragSoc= self._beneficiario ? self._beneficiario.ZzragSoc : "";
                            oWizardModel.getData().Zsede= self._beneficiario ? self._beneficiario.Zsede : "";
                            oWizardModel.getData().Type= self._beneficiario && self._beneficiario.Type === "1" ? true : false; //radio btn
                            oWizardModel.getData().Taxnumxl= self._beneficiario ? self._beneficiario.TaxnumCf : "";
                            oWizardModel.getData().NameLast= self._beneficiario ? self._beneficiario.NameLast : "";
                            oWizardModel.getData().TaxnumPiva= self._beneficiario ? self._beneficiario.TaxnumPiva : "";
                            oWizardModel.getData().Zdenominazione= self._beneficiario ? self._beneficiario.Zdenominazione : "";

                            var oDataSONModel = new JSONModel({
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
                                TaxnumPiva: self._beneficiario ? self._beneficiario.TaxnumPiva : "",
                                ZzragSoc: self._beneficiario ? self._beneficiario.ZzragSoc : "",
                                ZimptotDivisa: oItem.ZimptotDivisa,
                                TaxnumCf: self._beneficiario ? self._beneficiario.TaxnumCf : "",
                                Zzamministr: self._amministrazione.Value,
                                PayMode: self.payMode,
                                NewPayMode:[]
                            });  
                            
                            if(oWizardModel.getData() && oWizardModel.getData().PayMode !== null && oWizardModel.getData().PayMode !== "" && self.payMode.length>0){
                              self.getPayModeByLifnr(data.Lifnr,oWizardModel.getData().PayMode,false, function(callback){
                                if(!callback.error){
                                  var record = callback.data[0];
                                  if(record){
                                    oWizardModel.getData().Banks = oWizardModel.getData().Banks === "" ? record.Banks : oWizardModel.getData().Banks;
                                    oWizardModel.getData().Iban = oWizardModel.getData().Iban === "" ? record.Iban : oWizardModel.getData().Iban;
                                    oWizardModel.getData().Swift = oWizardModel.getData().Swift === "" ? record.Swift : oWizardModel.getData().Swift;
                                    oWizardModel.getData().Zcoordest = oWizardModel.getData().Zcoordest === "" ? record.ZcoordEst : oWizardModel.getData().Zcoordest;                                
                                  }
                                }
                              });                              
                            } 

                            self.setModel(oWizardModel, WIZARD_MODEL);
                            self.setModel(oDataSONModel, DataSON_MODEL);
                            self.getView().setBusy(false);
                        },4000);
                    },
                    error: function (error) {
                        console.log(error)
                    },
                });
            });
          },

          setWizardModel:function(data){
            var self = this;
            var oWizardModel = new JSONModel({
                btnBackVisible:false,
                btnNextVisible:true,  
                btnFinishVisible:false,
                isInChange: false,
                Step3TableTitle: null,
                Bukrs:data.Bukrs,
                Zchiavesop:data.Zchiavesop,
                Zstep:data.Zstep,
                Ztipososp:data.Ztipososp,
                Zzamministr:data.Zzamministr,
                Zchiaveopi:data.Zchiaveopi,
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
                Fipos: data.Fipos,
                Fistl: data.Fistl,
                Kostl: data.Kostl,
                Ltext: data.Ltext,
                Skat: data.Skat,
                Saknr: data.Hkont,
                Hkont: data.Hkont,
                Zimptot: data.Zimptot,
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
                isZZcausalevalEditable:false,
                Swift: data.Swift,
                PayMode: data.Zwels,
                ZZcausaleval: data.ZCausaleval,
                Zwels:data.Zwels,
                ZCausaleval:data.ZCausaleval
                });
                return oWizardModel;
            },

            onNavBack:function(oEvent){
                var self = this;
                self.resetForBack();
                self.resetLog();
                self._detailShowed=false;
                self.getRouter().navTo("listSON");
            },
    
            resetLog:function(){
                var self = this;
                var oModelJson= new sap.ui.model.json.JSONModel();
                oModelJson.setData([]);
                self.setModel(oModelJson, LOG_MODEL);
                self.setModel(oModelJson, MESSAGE_MODEL);                
            },

          resetForBack:function(){
            var self = this,
                oBundle = self.getResourceBundle(),
                tab = self.getView().byId("idIconTabBar");
            self._beneficiario = null;
            self._sedeBeneficiario=null;
            self._amministrazione=null;
            self.getView().getModel(DETAIL_MODEL).setProperty("/total",null);
            self.getView().getModel(DETAIL_MODEL).setProperty("/checkList",[]);
            self.getView().getModel(DETAIL_MODEL).setProperty("/buttonText",null);
            self.getView().getModel(DETAIL_MODEL).setProperty("/buttonVisible",false);
            self.getView().getModel(DETAIL_MODEL).setProperty("/iconTab","sap-icon://detail-view");
            self.getView().getModel(DETAIL_MODEL).setProperty("/text",self.getResourceBundle().getText("btnDetail"));
            self.getView().getModel(DETAIL_MODEL).setProperty("/key",self.getResourceBundle().getText("btnDetail"));
            self.getView().getModel(DETAIL_MODEL).setProperty("/showSelection",false);
            self.getView().getModel(DETAIL_MODEL).setProperty("/headerVisible",false);

            self.resetHeaderAction();
            self.resetDataSONModel();
            self.resetWizardModel(); 
            self.resetStep3();           
            if(self._detailShowed)  
                self.closeWizardPanel();
            tab.setSelectedKey(oBundle.getText("btnDetail"));
          },

          resetHeaderAction:function(){
            var self =this;
            self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/ZufficioCont",null);
            self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/ZvimDescrufficio",null);
            self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/Zcodord",null);
            self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/ZcodordDesc",null);
            self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/Zcdr",null);
            self.getView().getModel(HEADER_ACTION_MODEL).setProperty("/ZdirigenteAmm",null);
            var sendSignSonDt=self.getView().byId("sendSignSonDt");
            if(sendSignSonDt){
                sendSignSonDt.setValue(null);
            }
          },

          closeWizardPanel:function(){
            var self = this,
                wizard = self.getView().byId("WizardForDetail"),
                array = document.querySelectorAll(".expanded");
            
            for(var i=0;i<array.length;i++){
                var panel = sap.ui.getCore().byId(array[i].id);
                if(panel.getExpanded())
                    panel.setExpanded(false);                    
            }
            wizard.setCurrentStep(wizard.getSteps()[0]);
          },

          resetDataSONModel:function(){
            var self = this;
            self.getView().getModel(DataSON_MODEL).setProperty("/Gjahr", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/ZufficioCont", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Zdesctipodisp3", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/FiposList", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Fipos", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Fistl", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Kostl", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Saknr", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Hkont", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Lifnr", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/NameFirst", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/NameLast", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Zimptot", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/TaxnumPiva", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/ZzragSoc", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/ZimptotDivisa", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/TaxnumCf", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/Zzamministr", null);
            self.getView().getModel(DataSON_MODEL).setProperty("/PayMode", []);
            self.getView().getModel(DataSON_MODEL).setProperty("/NewPayMode", []);            
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
            self.getView().getModel(WIZARD_MODEL).setProperty("/isZZcausalevalEditable", false);
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

        onChangeSON:function(oEvent){
            var self = this,
                wizardModel = self.getView().getModel(WIZARD_MODEL).getData();
            self.getView().getModel(WIZARD_MODEL).setProperty("/isInChange", true);            
        },

        onSaveAll: function () {
            var self = this,
                wizardModel = self.getView().getModel(WIZARD_MODEL);
                
            if(!wizardModel.getProperty("/isInChange"))
              return;

            self.goToFinish("WizardForDetail", function(callback){
              switch(callback){
                case 'ValidationError':
                    return false;
                  break;
                case 'ValidationSuccess':
                  self._setDialogSaveAll("msgRettificaSon");
                  break;
                default:
                  return false;
                  break;     
              }           
            });
        },

        onWizardFinishButton:function(oEvent){
          var self =this,
              wizardType = oEvent.getSource().data("dataWizardType");

          if(wizardType === "Fine")
            return false;
          
          self.onSaveAll();
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
              Zchiavesop = wizardModel.getProperty("/Zchiavesop");
              
            var arrayClassificazioneSonList=[];
            for(var i=0;i<classificazioneSonList.length;i++){
                var item = classificazioneSonList[i];
                if(item.Id === 0)
                    continue;
                delete item.Id;
                arrayClassificazioneSonList.push(item);
            }

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
                    ZstatoSop:wizardModel.getProperty("/ZstatoSop"),
                    Zimptot:wizardModel.getProperty("/Zimptot"),
                    Zidsede:wizardModel.getProperty("/Zidsede"),
                    Gjahr:wizardModel.getProperty("/Gjahr"),
                    Zchiavesop:wizardModel.getProperty("/Zchiavesop"),
                    Zstep:wizardModel.getProperty("/Zstep"),
                    Ztipososp:wizardModel.getProperty("/Ztipososp"),
                    Zzamministr:wizardModel.getProperty("/Zzamministr"),
                    ZufficioCont:wizardModel.getProperty("/ZufficioCont"),
                    Znumsop:wizardModel.getProperty("/Znumsop"),
                    Zricann:wizardModel.getProperty("/Zricann"),
                    Zdatasop: wizardModel.getProperty("/Zdatasop") && wizardModel.getProperty("/Zdatasop") !== null && wizardModel.getProperty("/Zdatasop") !== "" ?
                                self.formatter.formateDateForDeep(wizardModel.getProperty("/Zdatasop")):
                                null,
                    Zdataprot: wizardModel.getProperty("/Zdataprot") && wizardModel.getProperty("/Zdataprot") !== null && wizardModel.getProperty("/Zdataprot") !== "" ?
                                self.formatter.formateDateForDeep(wizardModel.getProperty("/Zdataprot")):
                                null,
                    Znumprot:wizardModel.getProperty("/Znumprot"),
                    Lifnr:wizardModel.getProperty("/Lifnr"),
                    Fipos:wizardModel.getProperty("/Fipos"),
                    Fistl:wizardModel.getProperty("/Fistl"),
                    Ztipodisp3:wizardModel.getProperty("/Ztipodisp3"),
                    Kostl:wizardModel.getProperty("/Kostl"),
                    Hkont:wizardModel.getProperty("/Hkont"),
                    Zwels:wizardModel.getProperty("/Zwels"),
                    ZCausaleval:wizardModel.getProperty("/ZCausaleval"),
                    Iban:wizardModel.getProperty("/Iban"),
                    Swift:wizardModel.getProperty("/Swift"),
                    Zcoordest:wizardModel.getProperty("/Zcoordest"),
                    Zlocpag:wizardModel.getProperty("/Zlocpag"),
                    Zcausale:wizardModel.getProperty("/Zcausale"),
                    Zzonaint:wizardModel.getProperty("/Zzonaint"),
                    ZE2e:wizardModel.getProperty("/ZE2e"),
                    ZuffcontFirm:wizardModel.getProperty("/ZuffcontFirm"),
                    Zcdr:wizardModel.getProperty("/Zcdr"),
                    ZdirigenteAmm:wizardModel.getProperty("/ZdirigenteAmm"),
                    ZuffcontRicann:wizardModel.getProperty("/ZuffcontRicann"),
                    CdrRicann:wizardModel.getProperty("/CdrRicann"),
                    ZdirigenteRicann:wizardModel.getProperty("/ZdirigenteRicann"),
                    ZuffcontCancricann:wizardModel.getProperty("/ZuffcontCancricann"),
                    CdrCancricann:wizardModel.getProperty("/CdrCancricann"),
                    ZdirigenteCancricann:wizardModel.getProperty("/ZdirigenteCancricann"),
                    Zdatarichann: wizardModel.getProperty("/Zdatarichann") && wizardModel.getProperty("/Zdatarichann") !== null && wizardModel.getProperty("/Zdatarichann")!= "" ? 
                                        self.formatter.formateDateForDeep(wizardModel.getProperty("/Zdatarichann")):
                                        null,
                    Zchiaveopi:wizardModel.getProperty("/Zchiaveopi"),
                    Zinvioricann:wizardModel.getProperty("/Zinvioricann")
                }
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
                  title: oBundle.getText("operationOK"),
                  onClose: function (oAction) {
                    self.setPropertyGlobal(self.RELOAD_MODEL,"canRefresh",true);
                    self.onNavBack();
                  },
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


        onUpdateFinished: function (oEvent) {
            console.log("update");
            var self =this;
            var sTitle,
              oTable = oEvent.getSource(),
              step3List = self.getModel(STEP3_LIST).getData(),
              wizardModel = self.getModel(WIZARD_MODEL),
              iTotalItems = step3List.length - 1;
  
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
              sTitle = self.getResourceBundle().getText("Step3TableTitleCount", [
                iTotalItems,
              ]);
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


      });
});
