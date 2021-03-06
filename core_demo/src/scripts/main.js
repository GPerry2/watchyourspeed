//A sample main js file. Use this as a starting point for your app.
let model;
$(document).ready(function () {

  //some sample es6 stuff:
  const one = 1; //const!
  [one, 2, 3].map(n => n + 1); //anonymous arrow functions (they don't have 'this')!

  let json = {
    prop: 'value',
    blob: {
      deepProp: 'deepValue'
    }
  };
  let {prop, blob: {deepProp}} = json; //destructuring to pull values out of objects!
  console.log(prop, deepProp); //logs value and deepValue

  let newjson = {prop, deepProp}; //easier object literal creation!
  //end sample es6 stuff

  //sample code below to create an app with a form

  //now with Backbone integration, we can bind our form to a model object
  //see the use of useBinding and bindTo attributes below in the form definition
   model = new CotModel({
    'name': {
      'first': '',
      'last': ''
    },
    'phone': '333-000-0000',
    't1':'',
     'location':'',
     'frenchfries':''
  });


  //a sample form
  const form = new CotForm({
    id: 'my_form',
    title: 'My Form',
    success: function(){},
    useBinding: true,
    sections: [
      {
        id: "intro",
        title: "Some intro text" + newjson.prop,
        className: "panel-info",
        rows: [
          {
            fields: [
              {
                id: "introText",
                title: "",
                type: "html",
                html: 'some intro text html'
              }
            ]
          }
        ]
      },
      {
        id: "sectiontwo",
        title: "Samples",
        rows: [
          {
            fields: [
              {
                "id": "firstName",
                "title": "Enter your first name",
                "required": true,
                "placeholder": "John",
                "bindTo":'name.first'
              },
              {
                "id": "phone",
                "title": "Telephone number",
                "required": true,
                "validationtype": "Phone",
                "placeholder": "###-###-####",
                "bindTo": 'phone'
              }
            ]
          },
          {
            fields: [
              {
                "id": "countries",  "title": "Countries you've visited", "type": "multiselect", "multiple": true,
                "choices": [
                  {"text": "Canada", "value": "can"},
                  {"text": "USA", "value": "usa"},
                  {"text": "France", "value": "fra"},
                  {"text": "Australia", "value": "aus"}],
                "options": {
                  "includeSelectAllOption": false,
                  "numberDisplayed": 3,
                  "selectAllValue": "ALL",
                  "nonSelectedText": "Select countries",
                  "allSelectedText": "All"
                }
              },
              {
                "id": "t1",
                "title": "Countries you've visited",
                "type": "checkbox",
                "multiple": true,
                "bintTo":"t1",
                "choices": [
                  {"text": "Canada", "value": "can"},
                  {"text": "USA", "value": "usa"},
                  {"text": "France", "value": "fra"},
                  {"text": "Australia", "value": "aus"}],
                "options": {
                  "includeSelectAllOption": false,
                  "numberDisplayed": 3,
                  "selectAllValue": "ALL",
                  "nonSelectedText": "Select countries",
                  "allSelectedText": "All"
                }
              }
            ]
          },
          {
            fields: [
              {
                "id": "location",
                "bindTo": "location",
                "title": "City you live in",
                "required": true,
                "type": "dropdown",
                "choices": [
                  {
                    "text": "Please select the city you live in...",
                    "value": ""
                  }, {
                    "text": "Toronto",
                    "value": "toronto"
                  }, {
                    "text": "Hamilton",
                    "value": "hamilton"
                  }, {
                    "text": "Other", "value": "other"
                  }
                ]
              },
              {
                "id": "other",
                "title": "Other",
                "required": false
              }
            ]
          },
          {
            fields: [
              {
                "id": "frenchfries",
                "bindTo": "frenchfries",
                "title": "Do you like french fries?",
                "required": true,
                "type": "radio",
                "choices": [{"text": "Yes", "value": "Yes"}, {"text": "No", "value": "No"}],
                "orientation": "horizontal"
              },
              {
                "id":"date",
                "title":"What is today's date?",
                "required":true,
                "type":"datetimepicker",
                "options":{format:'YYYY-MM-DD'}
              }
            ]
          },
          {
            fields: [
              {
                "id":"daterange",
                "title":"Pick a date range",
                "required":false,
                "type":"daterangepicker",
                "options":{}
              }
            ]
          }
        ]
      }
    ]
  });

  const app = new cot_app("My WRP App");
  app.setBreadcrumb([
    {"name": "My WRP App", "link": "#"}
  ]).render(function () {
    app.addForm(form,'top');
    form.setModel(model);
  });
});
