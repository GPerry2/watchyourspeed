//A sample main js file. Use this as a starting point for your app.
const app = new cot_app("Human Rights");
const configURL = "//www1.toronto.ca/static_files/WebApps/CommonComponents/Human_Rights/JSONFeed.js";
let form, config, httpHost;
//let upload_selector = 'admin_dropzone';
const form_id = "hrc";
let myDropzone;
let repo = "human_rights";

$(document).ready(function () {

  app.render(function () {initialize();});
  function renderApp(){
    httpHost = detectHost();
    loadForm();
    app.setBreadcrumb(app.data['breadcrumbtrail']);
    app.addForm(form,'top');
    myDropzone = new Dropzone("div#admin_dropzone" , setupDropzone({ fid:'', form_id:form_id ,url: config.api_public.upload +config.default_repo + '/' + repo}));
    initForm();

  }
  function initialize(){
    loadVariables();
  }
  function loadForm(){
     form = new CotForm({
      id: form_id,
       title: 'Online Complaint Form',
      useBinding: false,
      sections:getSubmissionSections()
    });
     console.log(form);
  }
  function loadVariables(){
    $.ajax({
      url: configURL,
      type: "GET",
      cache: "true",
      dataType:"jsonp",
      jsonpCallback: "callback",
      success: function(data) {
        $.each(data.items, function(i, item) {app.data[item.title] = item.summary;});
        config = app.data.config;
        renderApp();
      },
      error: function() {
        alert("Error: The application was unable to load data.")
      }
    });
  }
  function detectHost() {
    //console.log(window.location.hostname);
    switch (window.location.hostname) {
      case config.httpHost.app_public.dev:
        return 'dev';
      case config.httpHost.app_public.qa:
        return 'qa';
      case config.httpHost.app_public.prod:
        return 'prod';
      default:
        return 'dev';
    }
  }

});
function getFormJSON(form_id) {
  return $("#"+form_id).serializeJSON({ useIntKeysAsArrayIndex: true });
}
function initForm(){
  getGroundFields("");
  $("#typeComplaint").on('change', function () {
    getGroundFields(this.value);
  });
  $('[name=cityEmployee]').on('change', function(){
     employeeToggle(this.value);
  });
  $('#cotEmployeeType').on('change', function(){
    unionToggle(this.value);
  });
  $("#closebtn").click(function(){window.close();});
  $("#printbtn").click(function(){window.print();});
  $("#savebtn").click(function(){

    let hrc_fv = $('#hrc').data('formValidation');
    hrc_fv.validate();
    if(hrc_fv.isValid()){submitForm()}
  });
  employeeToggle("No");
  unionToggle('Non-union');
}
function getGroundFields(typeCompaintVal) {
  var groundChoice = "";
console.log(typeCompaintVal)
// SET THE SELECTION FOR THE SELECTED COMPLAINT TYPE
  switch (typeCompaintVal) {
    case "Access to or use of City of Toronto facilities":
      groundChoice = config.groundAccessFacilities.choices;
      break;
    case "Administration or delivery of City of Toronto services":
      groundChoice = config.groundAdministration.choices;
      break;
    case "Employment with the City of Toronto":
      groundChoice = config.groundEmployment.choices;
      break;
    case "Job application with the City of Toronto":
      groundChoice = config.groundJobApplication.choices;
      break;
    case "Legal contracts with the City of Toronto":
      groundChoice = config.groundLegalContracts.choices;
      break;
    case "Occupancy of City of Toronto-owned accommodations":
      groundChoice = config.groundOccupancy.choices;
      break;
    case "Other":
      groundChoice = "";

      $("#groundElement").hide();
      $("#groundOtherElement").show();
      break;
    default:
      $("#groundElement").hide();
      $("#groundOtherElement").hide();
  }


  $("#groundElement fieldset label").remove();
  if (groundChoice != "") {

    $("#groundElement").show();
    $("#groundOtherElement").hide();

    $.each(groundChoice, function(i, item){
      let newVal ='<label class="vertical entryField checkboxLabel col-xs-12 col-sm-6 col-md-4 col-lg-3"><input name="ground[]" id="ground_' + (i) + '" title="Ground" type="checkbox" ';
      if(i==0){
        newVal += 'class="required"  data-fv-field="ground[]" data-fv-notempty data-fv-message="Ground is required" data-fv-notempty-message="Ground can not be empty" ';
        newVal += 'value="'+ item.text + '">' ;
        newVal += '<i class="form-control-feedback" data-fv-icon-for="ground[]" style="display: none;"></i>'
        newVal += '<span>' + item.text + '</span></label>';
      }else {
        newVal += 'value="'+ item.text + '"><span>' + item.text + '</span></label>';
      }

      $("#groundElement fieldset").append(newVal);
      $('#hrc').data('formValidation').addField($('#ground_'+i))
    });
  }
}
function employeeToggle(val){

  let et_val = $('#cotEmployeeType').val();
  let et =$('#cotEmployeeTypeElement');
  let div = $('#cotDivisionElement');
  let jt = $('#cotJobTypeElement');
  if(val=="Yes"){
    et.show();
    div.show();
    et_val==("Non-union"|"")?jt.hide():jt.show();
  }else{
    $('#cotDivision').val('');
    $('#cotEmployeeType').val('');
    $('#cotJobType').val('');
    et.hide();
    div.hide();
    jt.hide();
  }
}
function unionToggle(val){
  let jt = $('#cotJobTypeElement');
  if(val=="Non-union"){
  jt.hide();
  }else{
    jt.show();
  }
}
function submitForm(){
  $("#savebtn").prop('disabled', true);

  let payload = getFormJSON("hrc");
  payload.uploads = processUploads(myDropzone, repo, false);

  let queryString = payload.uploads[0] ? "?KeepFiles="+ payload.uploads[0].bin_id : "";

  $.ajax({
    url: config.httpHost.app_public[httpHost] + config.api_public.post +repo + queryString,
    type: 'POST',
    data: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=utf-8;',
      'Cache-Control': 'no-cache'
    },
    dataType: 'json',
    success : function(data) {
      console.log(data);
      if((data.EventMessageResponse.Response.StatusCode)==200) {
        console.log(config.messages.submit.done);
        //$(":input").attr("disabled","disabled");
        $(":input").prop("disabled",true);
        $("#printbtn").prop('disabled', false);
        $("#closebtn").prop('disabled', false);
         $('#successFailArea').html(config.messages.submit.done);
      }
    },
    error: function () {
      $('#successFailArea').html(config.messages.submit.fail);
      //console.log('error',jqXHR, exception);
    }
  }).done(function(data) {
    console.log('done',data);
  });
}
function processUploads(DZ, repo, sync){
  let  uploadFiles = DZ.existingUploads?DZ.existingUploads:new Array;
  let _files = DZ.getFilesWithStatus(Dropzone.SUCCESS);
  let syncFiles = sync;
  if (_files.length == 0) {
    //empty
  }else {
    $.each(_files, function (i, row) {
      let json = JSON.parse(row.xhr.response);
      json.name = row.name;
      json.type = row.type;
      json.size = row.size;
      json.bin_id = json.BIN_ID[0];
      delete json.BIN_ID;
      uploadFiles.push(json);
      syncFiles ? '':'';
    });
  }
  return uploadFiles;
}
function setupDropzone(o) {
  let options = $.extend({
    allowImages: true,
    allowDocuments: true,
    maxFiles: 1,
  }, o);

  Dropzone.autoDiscover = false;
  let acceptFiles = options.allowImages ? 'image/gif,image/GIF,image/png,image/PNG,image/jpg,image/JPG,image/jpeg,image/JPEG' : '';
  let  fileTypes = options.allowImages ? 'gif, png, jpg, jpeg' : '';

  if (options.allowDocuments) {
    acceptFiles += (acceptFiles ? ',' : '') + 'application/pdf,application/PDF,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    fileTypes += (fileTypes ? ', ' : '') + 'pdf, doc, docx, xls, xlsx, txt, csv, text';
  }

  options.dictDefaultMessage= "Drop files here or click to upload";
  acceptFiles,
  dictInvalidFileType= "Only the following file types are allowed: " + fileTypes,
  options.addRemoveLinks=true;
  options.maxFilesize= 5;
  options.dictFileTooBig="Maximum size for file attachment is 5 MB";
  options.dictMaxFilesExceeded= "Maximum " + options.maxFiles + " uploaded files";
  return options;
}
function getSubmissionSections(){
  let section =    [
    {
      id: "eligibilitySec",
      title: app.data["Eligibility"] ,
      className: "panel-info",
      rows: [
        {
          fields: [
            { "id": "divisionComplaint","required": true, "title": app.data["Division"], "type": "dropdown", "choices": config.division.choices, "className": "col-xs-12 col-md-6" },
            {
              "id": "typeComplaint",
              "title": app.data["Type of Complaint"],
              "type": "dropdown",
              "className": "col-xs-10 col-md-6",
              "required": true,
              "choices": config.complaintType.choices,
              "posthelptext":app.data["typeComplaintHelpButton"]
            },
            {"id": "ground","required": true ,
              "title": app.data["Ground"] ,
              "prehelptext":app.data["groundHelpButton"],
              "type": "checkbox",
              "choices": [], "className": "col-xs-12 col-md-12" },
            {"id": "groundOther", "title": "", "prehelptext":app.data["groundOtherHelpButton"],  "type": "html", "html": app.data["Ground Other Details"] ,"className": "col-xs-12 col-md-12" }

          ]
        }
      ]
    },

    {
      id: "contactInfoSec",
      title: app.data["Contact information Section"],
      className: "panel-info",
      rows: [
        {
          fields:	[
            { "id": "ciText1", "title": "", "type": "html", "html": app.data["ContactInfoText1"] }
          ]
        },
        {
          fields:	[
            { "id": "firstName", "title": app.data["First Name"], "required": true },
            { "id": "lastName", "title": app.data["Last Name"], "required": true },
            { "id": "title", "title": app.data["Title"]}
          ]
        },
        {
          fields:	[
            { "id": "ciText2", "title": "", "type": "html", "html": app.data["ContactInfoText2"] }
          ]
        },
        {
          fields:	[
            { "id": "phone", "title": app.data["Phone"], "validationtype":"Phone", "className": "col-xs-12 col-md-6" },
            { "id": "altPhone", "title": app.data["Alternative Phone"], "validationtype":"Phone", "className": "col-xs-12 col-md-6" }
          ]
        },
        {
          fields:	[
            { "id": "address", "title": app.data["Address"] },
            { "id": "email", "title": app.data["Email"], "validationtype": "Email", "validators": { regexp: { regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: 'This field must be a valid email. (###@###.####)' } } }
          ]
        },
        {
          fields:[{
            "id": "cityEmployee",
            "orientation":"horizotal",
            "title": app.data["Cot Employee"],
            "type": "radio",
            "value":"No",
            "choices": [{"text":"Yes","value":"Yes"},{"text":"No","value":"No"}],
            "className": "col-xs-12 col-md-6",
          }]
        },
        {
          fields:[
            { "id": "cotDivision", "title": app.data["cotDivision"], "type": "dropdown", "choices": config.division.choices, "className": "col-xs-12 col-md-4" },
            { "id": "cotEmployeeType",  "title": app.data["cotEmployeeType"], "type": "dropdown", "choices": config.cotEmployeeTypeList.choices, "className": "col-xs-12 col-md-4" },
            { "id": "cotJobType",  "title": app.data["union"], "type": "dropdown", "choices": config.cotJobTypeUnionList.choices, "className": "col-xs-12 col-md-4" }
          ]
        }

      ]
    },
    {
      id:"complaintDetailsSec",
      title:app.data["Complaint Details Section"],
      className: "panel-info",
      rows: [
        {
          fields:[
            { "id": "cdText1", "title": "", "type": "html", "html": app.data["ComplaintDetailText1"], "className": "col-xs-12 col-md-12" }
          ]
        },
        {
          fields:[
            { "id": "incidentDate", "title": app.data["Date of the Incident"], "type": "datetimepicker", "options": { format: config.dateFormat, maxDate: new Date() },"className": "col-xs-12 col-md-4" }
          ]
        },
        {
          fields:[
            { "id": "cdText2", "title": "", "type": "html", "html": app.data["ComplaintDetailText2"]}
          ]
        },
        {
          fields:[
            { "id": "explanation", "title": app.data["Explanation"], "type": "textarea" }
          ]
        },
        {
          fields:[
            { "id": "issue", "prehelptext":app.data["issueHelpButton"], "title": app.data["Issue"], "type": "dropdown", "choices": config.issue.choices , "className": "col-xs-12 col-md-6"}
            // { "id": "issueHelp", "title": "", "type": "html", "html": "<button type=\"button\" aria-label=\"Issue help button\" class=\"btn btn-primary btn-xs\" id=\"Issue-help\" onclick=\"javascript:void window.open('html//issueHelp.html','1423842457839','width=500,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');return false;\" >Help</button>" },
          ]
        },
        {
          fields:[
            { "id": "cdText3", "title": "", "type": "html", "html": app.data["ComplaintDetailText3"] }
          ]
        },
        {
          fields:[
            {"id":"docsIntro","title":"File Attachments","type":"html","html":'<section id="attachment"> <div class="dropzone" id="admin_dropzone"></div></section>'}
          ]
        },
        {
          fields:[
            { "id": "complaintDetails", "title": app.data["Complaint Details"], "type": "textarea" }
          ]
        },
        {
          fields:[
            { "id": "resolveCompQ",  "title": app.data["Resolve complaint"], "type": "dropdown", "orientation": "horizontal", "choices": config.choices.yesNoSelect}
          ]
        },
        {
          fields:[
            { "id": "hrtoQ",  "title": app.data["Filed HRTO application"], "type": "dropdown", "orientation": "horizontal", "choices": config.choices.yesNoSelect}
          ]
        },
        {
          fields:[
            { "id": "grievanceQ", "title": app.data["Filed grievance"], "type": "dropdown", "orientation": "horizontal", "choices": config.choices.yesNoSelect }
          ]
        }
      ]
    },
    {
      id:"solutionSec",
      title:"",
      className: "panel-info",
      rows: [
        {
          fields:[
            { "id": "cdText5", "title": "", "type": "html", "html": app.data["ComplaintDetailText7"] }
          ]
        },
        {
          fields:[
            { "id": "moreDetails", "title": app.data["More details"], "type": "textarea" }
          ]
        }
      ]
    },
    {
      id:"resSec",
      className: "panel-info",
      rows:[
        {
          fields:[
            { "id": "resDesired", "title": app.data["Resolution desired"], "prehelptext": "Describe what resolution you would like happen", "type": "textarea"}
          ]
        },
        {
          fields:[
            { "id": "compAgainst", "title": app.data["Complaint against"], "prehelptext": "Please list all names, separated by semi-colons(;)" }
          ]
        },
        {
          fields:[
            { "id": "footer1", "title": "", "type": "html", "html": app.data["ComplaintDetailText6"] }
          ]
        }
      ]
    },
    {
      id:"secActions",
      rows:[
        {
          fields:[
            {
              id:"actionBar",
              type:"html",
              html:`<div className="col-xs-12 col-md-12"><button class="btn btn-success" id="savebtn"><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> ` + config.button.saveReport + `</button>
                    <button class="btn btn-success" id="closebtn"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>Close</button>
                    <button class="btn btn-success" id="printbtn"><span class="glyphicon glyphicon-print" aria-hidden="true"></span>Print</button>
                  </div>`
            },
            {
              id:"successFailRow",
              type:"html",
              className:"col-xs-12 col-md-12",
              html:`<div id="successFailArea" className="col-xs-12 col-md-12"></div>`
            }
          ]
        },
        {
          fields:[
            {
              id:"help_dialog_grounds",
              type:"html",
              html:`  <div class="modal fade" id="groundsHelp" role="dialog"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+app.data["groundsHelpHeader"]+`</h4></div>
                                <div class="modal-body"><p>`+app.data["groundsHelpBody"]+`</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            },
            {
              id:"help_dialog_grounds_other",
              type:"html",
              html:`  <div class="modal fade" id="groundsHelpOther" role="dialog"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+app.data["groundsHelpOtherHeader"]+`</h4></div>
                                <div class="modal-body"><p>`+app.data["groundsHelpOtherBody"]+`</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            },
            {
              id:"help_dialog_Issue",
              type:"html",
              html:`  <div class="modal fade" id="issueComplaintHelp" role="dialog"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+app.data["issueHelpHeader"]+`</h4></div>
                                <div class="modal-body"><p>`+app.data["issueHelpBody"]+`</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            }
            ,
            {
              id:"help_dialog_Type",
              type:"html",
              html:`  <div class="modal fade" id="typeComplaintHelp" role="dialog"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+app.data["typeOfComplaintHelpHeader"]+`</h4></div>
                                <div class="modal-body"><p>`+app.data["typeOfComplaintHelpBody"]+`</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            }
          ]
        }
      ]
    }
  ]
  return section;
}


