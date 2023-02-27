sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
    // "use strict";

    return Controller.extend("employees.controller.App", {

        onInit: function () {
            var oJSONModel1 = new sap.ui.model.json.JSONModel();
            var oView = this.getView();
            //var    oResourceBundle = oView.getModel("i18n").getResourceBundle();
            oJSONModel1.loadData("localService/mockdata/Employees.json");
            oView.setModel(oJSONModel1);
            
            //! OJO. Cada instancia de un JSONModel solo puede contener un modelo.
            //Instanciamos y seteamos a la vista el modelo los datos de la tabla de examenes
            var oJSONModel2 = new sap.ui.model.json.JSONModel();
            oJSONModel2.loadData("localService/mockdata/Tests.json");
            this.getView().setModel(oJSONModel2, "modeloTests");
        },

        onValidate: function (oEvent) {
            console.log(oEvent.getParameters());
            // this.byId("inputEmployee");
            var sValue = oEvent.getParameter("newValue");
             var oInput = oEvent.getSource();
            console.log(oInput);
            if (sValue.length === oInput.getMaxLength()) {
                // oInput.setDescription("Ok");
                // this.getView().byId("labelCountry").setVisible(true);
                // this.getView().byId("selectCountry").setVisible(true);
            } else {
                // oInput.setDescription("Not Ok");
                // this.getView().byId("labelCountry").setVisible(false);
                // this.getView().byId("selectCountry").setVisible(false);
            }
        },

        onFilter: function () {
            //Recuperamos el modelo
            var oJSONModel = this.getView().getModel().getData();
            var aFilters = [];

            if (oJSONModel.EmployeeId) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("EmployeeID", FilterOperator.Contains, oJSONModel.EmployeeId),
                        new Filter("FirstName", FilterOperator.Contains, oJSONModel.EmployeeId)
                    ],
                    and: false
                }));
            }

            if (oJSONModel.CountryKey) {
                aFilters.push(new Filter("Country", FilterOperator.EQ, oJSONModel.CountryKey));
            }
            var oTable = this.byId("tableEmployee");
              var  otuBinding = oTable.getBinding("items");
              otuBinding.filter(aFilters);

            let iAmount = otuBinding.aIndices.length;
            this.getView().byId("tableEmployee").setHeaderText("Employees: (" + iAmount + ")");
        },

        getRegistros: function () {

            sap.m.MessageToast.show("Mira la Consola");

            //! a) array de registros de una propiedad de un modelo json (esta propiedad que recuperamos no tiene porque estar bindeada a ningún listado en la vista, aunque el modelo si estará seteado a la vista).
            console.log("%c this.getView().getModel().getProperty('/Students/contact_info/phone_numbers');", "color:yellow");
            var array_getProperty = this.getView().getModel().getProperty("/Students/contact_info/phone_numbers");
            console.log(array_getProperty);

            console.log("%c this.getView().getModel().getData()['Students']['contact_info']['phone_numbers'];", "color:yellow");
            var array_getData_con_brackets = this.getView().getModel().getData()["Students"]["contact_info"]["phone_numbers"];
            console.log(array_getData_con_brackets);

            console.log("%c this.getView().getModel().getData().Students.contact_info.phone_numbers;", "color:yellow");
            var array_getData_sin_brackets = this.getView().getModel().getData().Students.contact_info.phone_numbers;
            console.log(array_getData_sin_brackets);
            console.log("\n");



            //! b) this.getView().byId('tableEmployee').getItems().map(ItemSAPUI5 => ItemSAPUI5.getBindingContext().getObject())
            console.log("%c this.getView().byId('tableEmployee').getItems().map(ItemSAPUI5 => ItemSAPUI5.getBindingContext().getObject())", "color:yellow");
            var oTable = this.getView().byId("tableEmployee");
            var aEntitySetItemsSAPUI5 = oTable.getItems();
            // EntitySet=tabla → Es un array que contiene los registros=entidades=obj.json=items=rows_tabla
            var aEntitySetObjJSON = aEntitySetItemsSAPUI5.map(ItemSAPUI5 => ItemSAPUI5.getBindingContext().getObject());
            console.log(aEntitySetObjJSON);
            console.log("\n");



            //! c) this.getView().byId('tableEmployee').getItems().map( ItemSAPUI5 => ItemSAPUI5.getBindingContext().getProperty('FirstName') )
            console.log("%c this.getView().byId('tableEmployee').getItems().map( ItemSAPUI5 => ItemSAPUI5.getBindingContext().getProperty('FirstName') )", "color:yellow");
            var aEntitySetObjJSON = aEntitySetItemsSAPUI5.map(ItemSAPUI5 => ItemSAPUI5.getBindingContext().getProperty('FirstName'));
            console.log(aEntitySetObjJSON);
            console.log("\n");




            console.log("%c this.getView().byId('tableEmployee').getBinding('items').getContexts().map( element => element.getObject() ) ", "color:yellow;");
            //! d) array de registros oJSON partiendo de getBinding("boundPropertyName")
            const oBinding = oTable.getBinding("items"); 
            aEntitySetItemsSAPUI5 = oBinding.getContexts().map(element => element.getObject()); 
            console.log(aEntitySetItemsSAPUI5); 
            console.log("\n");

            // for (var i = 0; i < items.length; i++) {
            //     var itemContext = items[i].getBindingContext();
            //     if (itemContext) {
            //         boundItems.push(itemContext.getObject());
            //     }
            // }

            console.log("%c d) array de registros oJSON partiendo de getData()", "color:yellow;");
            //! e) array de registros oJSON partiendo de getData()
            var oDefaultModel = this.getView().getModel().getData();
            var retrieve_prop_Employees = oDefaultModel["Employees"];
            console.log(retrieve_prop_Employees); 
            console.log(JSON.stringify(retrieve_prop_Employees)); 
        },


        onClearFilter: function () {

            var oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId","");
            oModel.setProperty("/CountryKey");

            var oTable = this.byId("tableEmployee");
            var  omyBinding = oTable.getBinding("items");
            omyBinding.filter([]);

            this.getView().byId("tableEmployee").setHeaderText("Employees: (" + oModel.getProperty("/Amount") + ")");


        },

        onMessage: function (oEvent) {
            let oBindingContext = oEvent.getSource().getBindingContext();
            console.log(oBindingContext.getObject());
            new sap.m.MessageToast.show(oBindingContext.getObject().PostalCode);
        },

        onRadioButtonSelect: function(oEvent) {
            var sSelectedText = oEvent.getSource().getText();
            sap.m.MessageToast.show("You have pressed the radio button with text = '" + sSelectedText + "'");
        }



    });
});
