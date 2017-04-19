var app = new cot_app("City of Toronto - Watch Your Speed Program (WYSP)");

var docPhone = '416-123-4567';

$(document).ready(function() {
  renderCFrame();
});

function renderCFrame() {
  //ADD ALL THE LINKS YOU WANT TO THE APPLICATION BREADCRUMB
  app.setBreadcrumb([
    {"name":"Living In Toronto", "link": "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=3ea2ba2ae8b1e310VgnVCM10000071d60f89RCRD"},
    {"name": "Transportation", "link" : "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=e10086195a7c1410VgnVCM10000071d60f89RCRD"},
    {"name": "Road Safety", "link" : "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=747c4074781e1410VgnVCM10000071d60f89RCRD"},
    {"name": "Watch Your Speed Program", "link" : "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=70be4681d4002410VgnVCM10000071d60f89RCRD"}
  ]);
  //INCLUDE ANY NECCESSARY JS/CSS LIBRARIES
  //FORMS TYPICALLY USE AT LEAST THE FOLLWOIGN 3 LIBRARIES
  app.includeDatePicker=app.includeFormValidation=app.includePlaceholders=true;
  //RENDER THE FINISHED PAGE AND THEN CALL A CALLBACK FUNCTION WHEN COMPLETE
  app.render(init);
}

function init() {
  app.loadContent({
    "url":"scripts/keywords.json",
    "success":drawContent,
    "dataType":"json",
    "skiproot":true
  });
}

function drawContent() {showApp();}

function showApp() {

  var f = new cot_form({
    "id":"appForm"
  });

  var info = f.addSection(new cot_section({
    "id":"intro",
    "title":app.data["pleaseNotePanelHeading"],
    "class":"panel-info"
  }));

  info.addRow(new cot_row([
    {"id":"introText","title":"","type":"html","html":app.data["Please Note"]}
  ]));

  var ri = f.addSection(new cot_section({
    "id":"contactInfo",
    "title":app.data["ContactInformation"],
    "class":"panel-info"
  }));

  ri.addRow(new cot_row([
    {"id":"firstName","title":app.data["FirstName"],"required":true,"class":"col-xs-12 col-md-4"},
    {"id":"lastName","title":app.data["LastName"],"required":true,"class":"col-xs-12 col-md-4"},
    //{"id":"phone","title":"Daytime Phone","required":true, "value":docPhone, "validationtype":"Phone", preferredCountries:country, "class":"col-xs-12 col-md-4"}
    {"id":"phone","title":app.data["phone"],"required":true, "value":docPhone,"validators":{regexp:{regexp:/^\d{3}-\d{3}-\d{4}$/,message: 'This field must be a valid phone number. (###-###-####)'}},"class":"col-xs-12 col-md-2"}
  ]));

  var notes = f.addSection(new cot_section({
    "id":"",
    "title":""
  }));
  notes.addRow(new cot_row([
    {"id":"note","title":app.data["description"],"type":"textarea", "required":true,}
  ]));
  var actions = f.addSection(new cot_section({
    "id":"submitsection",
    "class":"submitsection"
  }));
  if (typeof app.data["Disclaimer"] != "undefined") {
    actions.addRow(new cot_row([
      {"id":"nocLink","title":"","type":"html","html":app.data["Disclaimer"]}
    ]));
  }
  actions.addRow(new cot_row([
    {"id":"submitBtn","title":"","type":"html","html":getHTMLFragment("html/wysform.html #submit")}
  ]));


  $('#app-content-top').html("");
  f.render({"target":"#app-content-top"});

}

function renderSuccessfulMessage(){
  $('#app-content-bottom').html(app.data["Success Message"]);
}

function renderFailureMessage(){
  $('#app-content-bottom').html(app.data["Failure Message"]);
}

function getHTMLFragment(path) {
  var result;
  jQuery.ajaxSetup({async:false});
  $('#app-content-right').load(path, function(data) {
    result = $('#app-content-right').html();
  });
  $('#app-content-right').html("");
  jQuery.ajaxSetup({async:true});
  return result;
}

function submitForm() {
  $('#appForm').data('formValidation').validate();
  if ($('#appForm').data('formValidation').isValid()) {
    $('#appForm').addClass('hide');
    $('#app-content-bottom').removeClass('hide');
    var oJSON = {};
    var fields = $("#appForm").serializeArray();
    console.log(fields)
    jQuery.each(fields, function(i, field) {
      oJSON[field.name] = field.value;
    });
    console.log(JSON.stringify(oJSON))

    $.ajax({
      url : "/cc_sr_v1/submit/watch_your_speed",
      type : "POST",
      data : JSON.stringify(oJSON),
      dataType: "json",
      contentType: 'application/json',
      success : function(data) {
        console.log(data);
        if((data.EventMessageResponse.Response.StatusCode)==200) {
          renderSuccessfulMessage();
        }
      },
      error: function (jqXHR, exception) {
        renderFailureMessage();
        console.log(jqXHR);
      }
    });
  }
}
