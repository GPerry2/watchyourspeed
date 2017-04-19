/* eslint-disable no-unused-vars */
//A sample main js file. Use this as a starting point for your app.
const app = new cot_app("Bike Locker Project");
const configURL = "//www1.toronto.ca/static_files/WebApps/CommonComponents/bike_locker/JSONFeed.js";

let form, config, httpHost;
const form_id = "bike_locker";
let repo;

$(document).ready(function () {
  app.render(function () {initialize();});
  function renderApp(){
    repo = config.default_repo
    httpHost = detectHost();
    loadForm();
    app.setBreadcrumb(app.data['breadcrumbtrail']);
    app.addForm(form,'top');
    initForm();
  }
  function initialize(){
    loadVariables();
  }
  function loadForm(){
     form = new CotForm({
      id: form_id,
       title: 'Bike Locker Application Form',
      useBinding: false,
      sections:getSubmissionSections()
    });
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
  $("#closebtn").click(function(){window.close();});
  $("#printbtn").click(function(){window.print();});
  $("#savebtn").click(function(){
    let hrc_fv = $('#'+ form_id).data('formValidation');
    hrc_fv.validate();
    if(hrc_fv.isValid()){submitForm()}
  });
}
function submitForm(){
 // $("#savebtn").prop('disabled', true);

  let payload = getFormJSON(form_id);
  let queryString = "";
  let postQueryString = config.defaultQueryString ? "/?" + config.defaultQueryString :"";
  let bike_form = $('#'+ form_id);
  /*
  //Post form to Domino
  bike_form.attr(
    {
      'action':'https://dom01d.toronto.ca/inter/uds/bikelockers.nsf/LockerAppl?CreateDocument',
      'method':'post',
      'name':'_LockerAppl'
    }
  );
   bike_form[0].submit();
  */

console.log(queryString)
    $.ajax({
      url: config.httpHost.app_public[httpHost] + config.api_public.post +repo +  postQueryString,
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json; charset=utf-8;',
        'Cache-Control': 'no-cache'
      },
      dataType: 'json',
      success : function(data) {
        if((data.EventMessageResponse.Response.StatusCode)==200) {

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
function getSubmissionSections(){
  let section =    [
    {
      id:"introSection",
      rows:[
        {
          fields:[
            { "id": "introText", "title": "", "type": "html", "html": app.data["IntroText"], "className": "col-xs-12 col-md-12" }
          ]
        }
      ]
    },
    {
      id: "contactInfoSec",
      title: 'Contact Information',
      className: "panel-info",
      rows: [
        {
          fields:	[
            { "id": "txtLAFirstName", "title": "First Name", "required": true , "className": "col-xs-12 col-md-5"},
            { "id": "txtLALastName", "title": "Last Name", "required": true, "className": "col-xs-12 col-md-5" },
            { "id": "txtLATitle", "title": "Title", "className": "col-xs-12 col-md-2" }
          ]
        },
        {
          fields:	[
            { "id": "txtLAPhone1", "title": "Phone", "validationtype":"Phone", "className": "col-xs-12 col-md-6" },
            { "id": "txtLAPhone2", "title": "Alternative Phone", "validationtype":"Phone", "className": "col-xs-12 col-md-6" }
          ]
        },
        {
          fields:	[
            { "id": "txtLaAddress", "title": "Address" },
            { "id": "txtLAEmail", "title": "Email", "validationtype": "Email", "validators": { regexp: { regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: 'This field must be a valid email. (###@###.####)' } } }
          ]
        },
        {
          fields:	[
            { "id": "txtLACity", "title": "City", "required": false , "className": "col-xs-12 col-md-5"},
            { "id": "txtLAProv", "title": "Province", "required": false, "className": "col-xs-12 col-md-5" },
            { "id": "txtLAPostal", "title": "Postal", "className": "col-xs-12 col-md-2" }
          ]
        }

      ]
    },
    {
      id:"LockerSec",
      title:'Locker Location Request',
      className: "panel-info",
      rows: [
        {
          fields:[
            { "id": "cdText1", "title": "", "type": "html", "html": app.data["LockerRequestHelpInfo"], "className": "col-xs-12 col-md-12" }
          ]
        },
        {
          fields:[
            { "id": "lstLALocation1",  "title": "Your Choice", "type": "dropdown", "orientation": "horizontal", "choices": config.locker_locations}
          ]
        },
        {
          fields:[
            { "id": "lstLALocation2",  "title":"Second Choice", "type": "dropdown", "orientation": "horizontal", "choices": config.locker_locations}
          ]
        },
        {
          fields:[
            { "id": "lstLALocation3", "title": "Third Choice", "type": "dropdown", "orientation": "horizontal", "choices":config.locker_locations }
          ]
        }
      ]
    },
    {
      id:"NotesSec",
      title:"Notes",
      className: "panel-info",
      rows: [
        {
          fields:[
            { "id": "cdText5", "title": "", "type": "html", "html": app.data["NOTES"] }
          ]
        }
      ]
    },
    {
      id:"MPHIPPASec",
      title:"",
      className: "panel-info",
      rows: [
        {
          fields:[
            { "id": "cdText5", "title": "", "type": "html", "html": app.data['MPHIPPA'] }
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
              "id": "form_name",
              "type": "html",
              "html": "<input type='hidden'  name='form' value='LockerAppl'>",
              "class": "hidden"
            },
            {
              "id": "ReturnPage",
              "type": "html",
              "html": "<input type='hidden'  name='$$Return' value='[//www.toronto.ca]'>",
              "class": "hidden"
            },
            {
              "id":"SubmissionStatus",
              "type": "html",
              "html": "<input type='hidden'  name='lstStatus' value='New'>",
              "class": "hidden"
            }
            ,
            {
              "id":"SubmissionState",
              "type": "html",
              "html": "<input type='hidden'  name='WCMForms_Name' value=''>",
              "class": "hidden"
            }
          ]
        }
      ]
    }
  ]
  return section;
}


