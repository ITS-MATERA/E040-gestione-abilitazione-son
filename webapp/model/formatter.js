sap.ui.define([], function () {
  "use strict";

  return {
    numberUnit: function (sValue) {
      if (!sValue) {
        return "";
      }
      return parseFloat(sValue).toFixed(2);
    },

    dateWizard: function (sValue) {
      console.log(sValue);
      if (!sValue) return;// new Date();

      if(sValue instanceof Date && !isNaN(sValue)){}
      else
        return;
      
      var sMonth = sValue.getMonth()+1;
      if(sMonth<10)
        sMonth = "0" +sMonth;
      sValue = sValue.getFullYear()+ "-" + sMonth +"-"+ sValue.getDate();
      return sValue;
    },

    convertFormattedNumber : function (sValue) {
        if (!sValue) {
            return "";
        }
        
        sValue = sValue.replace(".",",");
        return sValue.toString().replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, ".");            
    },

    formateDateForDeep(dateValue) {
      var self = this,
        value,
        month,
        stringMonth;

      month = dateValue.getMonth() + 1;

      if (month < 10) {
        stringMonth = "0" + month.toString();
      } else stringMonth = month.toString();

      value =
        dateValue.getFullYear().toString() +
        "-" +
        stringMonth +
        "-" +
        dateValue.getDate().toString();

      return value + "T00:00:00";
    },

    formatStringForDate: function (string) {
      console.log("anno", string.substring(6, 10));
      console.log("mese", string.substring(3, 5));
      console.log("giorno", string.substring(0, 2));
      var date = new Date(
        string.substring(6, 10),
        string.substring(3, 5) - 1,
        string.substring(0, 2)
      );
      console.log(date);
      return date;
    },

    formatZstatoAbi: function (sValue) {
      var self = this,
        bundle = self.getResourceBundle();
      var sDesc = "";
      if (sValue) {
        switch (sValue) {
          case "00":
          case "0":
            sDesc = bundle.getText("ZstatoAbi00");
            break;
          case "01":
          case "1":
            sDesc = bundle.getText("ZstatoAbi01");
            break;
          case "02":
          case "2":
            sDesc = bundle.getText("ZstatoAbi02");
            break;
          default:
            sDesc = bundle.getText("ZstatoDefault");
        }
      }

      return sDesc;
    },
    formatZstatoSop: function (sValue) {
      var self = this,
        bundle = self.getResourceBundle();
      var sDesc = "";
      if (sValue) {
        switch (sValue) {
          case "00":
          case "0":
            sDesc = bundle.getText("ZstatoSop00");
            break;
          case "01":
          case "1":
            sDesc = bundle.getText("ZstatoSop01");
            break;
          case "02":
          case "2":
            sDesc = bundle.getText("ZstatoSop02");
            break;
          case "03":
          case "3":
            sDesc = bundle.getText("ZstatoSop03");
            break;
          case "04":
          case "4":
            sDesc = bundle.getText("ZstatoSop04");
            break;
          case "05":
          case "5":
            sDesc = bundle.getText("ZstatoSop05");
            break;
          case "06":
          case "6":
            sDesc = bundle.getText("ZstatoSop06");
            break;
          case "07":
          case "7":
            sDesc = bundle.getText("ZstatoSop07");
            break;
          case "08":
          case "8":
            sDesc = bundle.getText("ZstatoSop08");
            break;
          case "09":
          case "9":
            sDesc = bundle.getText("ZstatoSop09");
            break;
          case "10":
            sDesc = bundle.getText("ZstatoSop10");
            break;
          case "11":
            sDesc = bundle.getText("ZstatoSop11");
            break;
          case "16":
              sDesc = bundle.getText("ZstatoSop16");
              break;  
          default:
            sDesc = bundle.getText("ZstatoDefault");
        }
      }

      return sDesc;
    },
    defaultFormatDate: function (sDate) {
      if (!sDate || sDate === "" || sDate === null) return "";

      return sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "yyyy-MM-dd",
      }).format(new Date());
    },
    formatDate: function (sDate) {
      if (!sDate || sDate === "" || sDate === null) return "";

      return sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "dd.MM.yyyy",
      }).format(new Date(sDate));
    },
  };
});
