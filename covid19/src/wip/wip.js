var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
var IE11Cache = function () {
  if (isIE11) {
    //return '?t='+(new Date).getTime();
    return '';
  } else {
    return '';
  }
}

let charactersNotAllowed = 'characters < > % not allowed';

function fixEX(string) {
  if (/^[^<>%]*$/.test(string)) {
    //console.log(string);
    //console.log('matches');
    return true;
  } else {
    //console.log(string);
    //console.log('no match');
    return false;
  }
}


// $(document).on('click','.datetimepicker input',function(){
//   $(this).parents('.datetimepicker').find('.input-group-addon').click();
// });


//let dateFormat = /(\d\d\d\d\d\d\d\d)/gi;
//let dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/gi;
let dateFormat = /(19|20)[0-9]{2}-((02-(0[1-9]|[1-2][0-9]))|((01|03|05|07|08|10|12)-(0[1-9]|[1-2][0-9]|3[0-1]))|((04|06|09|11)-(0[1-9]|[1-2][0-9]|30)))/g;
let dateFormatText = 'Please provide a valid date format YYYY-MM-DD';

let phoneFormat = /\d/gi;
let phoneFormatText = 'Alpha characters are not allowed in phone format';

let phoneExFormat = /\d/gi;
let phoneExFormatText = 'Alpha characters are not allowed in phone format';


function validateHC(valueGET) {

  var value = valueGET.replace(/-/gi, '').replace(/ /gi, '');
  var sin = value.replace(/[^\d]/g, "");
  var alpha = value.replace(/[^\D]/g, "");

  // console.log(sin);
  // console.log(alpha);

  var HC_LENGTH = 10;
  if (sin && sin.length === HC_LENGTH) {
    var len = HC_LENGTH,
      mul = 0,
      luhnArr = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
      ],
      sum = 0;
    while (len--) {
      sum += luhnArr[mul][parseInt(sin.charAt(len), 10)];
      mul = mul ^ 1;
    }
    if (sum % 10 === 0) {

      if (alpha && alpha != '') {
        if (alpha.length == 2) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }

    } else {
      return false;
    }
  } else {
    return false;
  }
}


// function validateHC (value) {
//   let hcn = value.replace(/-/gi,'');
//   if(hcn.length==10||hcn.length==12){
//     //let hcnregex = /^[0-9].*[a-z][a-z]$/igm;
//     let hcnregex = /(\d\d\d\d\d\d\d\d\d\d[A-Z][A-Z])|(\d\d\d\d\d\d\d\d\d\d-[A-Z][A-Z])|(\d\d\d\d\d\d\d\d\d\d)$/gi
//     if(hcnregex.test(value)){
//       console.log('valid hc');
//       return true;
//     } else{
//       console.log('invalid hc');
//       return false;
//     }
//   } else{
//     console.log('invalid hc');
//     return false;
//   }
// }


let firstLoadPage = true;
let firstLoadPageLocationSet = true;
let originalSearchTerm = false;

let cannotSubmit = true;
let totalCharacters = 4000;
let totalUploadSizeLimit = 20971520;
let remainingUploadSize = totalUploadSizeLimit;
let uploadedFiles = []
let dz_uploader;
let submitRetries = 0;
let dataFirstBeingSent = true;

let supportingDocuments = [];

let CONTRACTORAPI = '';


function errorInputIcon(id) {
  return `
    <i id="iconStatus_${id}" class="form-control-feedback glyphicon glyphicon-remove" aria-hidden="true"></i>
  `;
}

function successInputIcon(id) {
  return `
    <i id="iconStatus_${id}" class="form-control-feedback glyphicon glyphicon-ok" aria-hidden="true"></i>
  `;
}

// show loading
function showLoading() {
  //$('.searchingBox').removeClass('hidden');
  $('#loading-indicator').css('display', 'block');
}

// hide loading
function hideLoading(renderLoad) {
  $('#loading-indicator').css('display', 'none');
}


function checkSpecialKeys(e) {
  if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
    return false;
  else
    return true;
}

function checkTextAreaMaxLength(textBox, e) {
  var maxLength = parseInt($(textBox).attr("length"));
  if (!checkSpecialKeys(e)) {
    if (textBox.value.length > maxLength - 1) textBox.value = textBox.value.substring(0, maxLength);
  }
  $(".charactercount_" + $(textBox).attr('id')).html(maxLength - textBox.value.length);
  return true;
}


// attach radio button value and id to parent div for summary
$(document).on('click', '#covid19_container input[type="radio"]', function () {
  //console.log($(this).val());
  $(this).parents('.form-group.has-feedback').last().attr('data-value', $(this).val()).attr('data-id', this.id)
});


function getLicence(licence, date, callback) {
  //<licenceNo>/<yyyyMMdd>
  $.ajax({
    url: "/*@echo LICENCE_API_URL*/" + licence + '/' + moment(date).format('YYYYMMDD'),
    method: 'POST',
    //headers: {
    // userName: username,
    // password: pass,
    // customerGuid: cid
    //},
    beforeSend: function (xhr) {
      //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
    }
  })
    .done(function (data) {
      // {
      //   name: "",
      //   valid: true,
      //   errMsg: ""
      // }

      if (data.valid) {
        callback([{
          text: data.name,
          value: licence,
          data: data
        }]);
      } else {
        callback([]);
      }

    })
    .fail(function (error) {
      //alert( "error" );
      callback([]);
    })
    .always(function () {
      //alert( "complete" );
    });

}


$(document).on('click', '.typeahead__button--clear', function () {
  $('.typeahead__input--addon').html(errorInputIcon());
  $('#patient_mailing_address').val('');
});


// $(document).on('click','.typeahead__result', function(){
//   console.log('selected');
//   console.log($('cotui-autosuggest').attr('text'));
//   $('#patient_mailing_address').val($('cotui-autosuggest').attr('text'));
//   $('#patient_mailing_address_data').val($('cotui-autosuggest').attr('text'));
// });


let currentStep = 1;
let totalSteps = 4;

//let currentStep = 3; // testing
function progressChange(step) {

  let formID = $(formHtmlIdHashform).data('formValidation');

  // let notEmpty = {
  //   notEmpty: {
  //     message: 'Invoice files is required and cannot be empty',
  //     priority: 1
  //   }
  // }
  // formID.enableFieldValidators('supportingDocuments_backwatervalve',false,notEmpty);
  // formID.enableFieldValidators('supportingDocuments_sumppump',false,notEmpty);
  // formID.enableFieldValidators('supportingDocuments_pipeandcap',false,notEmpty);

  $('#section0').addClass('hidden');

  $('#section1').addClass('hidden');

  $('#section2').addClass('hidden');

  $('#section3').addClass('hidden');

  $('#section4').addClass('hidden');

  $('#uploads').addClass('hidden');

  $('#summaryBox').addClass('hidden');
  $('.submitBox').addClass('hidden');


  // progress bar
  let stepProgress = (step / totalSteps * 100).toFixed(0);
  let stepProgressWidth = (step / totalSteps * 100).toFixed(0);
  if (step == 1) {
    stepProgress = 0;
    stepProgressWidth = 4;
  }
  $('.progress-bar').css('width', stepProgressWidth + '%');
  $('.progress-bar').attr('aria-valuenow', stepProgress);
  $('.progress-bar').html(stepProgress + '%');


  console.log(step);


  if (step == 1) {
    $(".nextButton").attr("data-wt_params", "WT.si_n=covid19;;WT.si_x=1");

    $('.steps').removeClass('active');
    $('.steps').removeClass('final');

    $('#section0').removeClass('hidden');

  } else if (step == 2) {
    $(".nextButton").attr("data-wt_params", "WT.si_n=covid19;;WT.si_x=2");

    $('.steps').removeClass('final');
    $('.steps').addClass('active');

    $('.well').addClass('hidden');
    $('#section1').removeClass('hidden');
  } else if (step == 3) {
    $(".nextButton").attr("data-wt_params", "WT.si_n=covid19;;WT.si_x=3");

    $('.steps').removeClass('final');
    $('.steps').addClass('active');
    $('#section2').removeClass('hidden');

    // } else if(step==4){
    //   $(".nextButton").attr("data-wt_params", "WT.si_n=covid19;;WT.si_x=4");

    //   $('.steps').removeClass('final');
    //   $('.steps').addClass('active');
    //   $('#section3').removeClass('hidden');

    // } else if(step==5){

    //   $(".nextButton").attr("data-wt_params", "WT.si_n=covid19;;WT.si_x=5");

    //   $('.steps').removeClass('final');
    //   $('.steps').addClass('active');
    //   $('#section4').removeClass('hidden');

  } else if (step == 4) {

    //   $(".nextButton").attr("data-wt_params", "WT.si_n=covid19;;WT.si_x=6");

    //   $('.steps').removeClass('final');
    //   $('.steps').addClass('active');
    //   $('#uploads').removeClass('hidden');

    // } else if(step==5){

    $(".nextButton").attr("data-wt_params", "WT.si_n=covid19;;WT.si_x=7");

    $('.steps').removeClass('active');
    $('.steps').addClass('final');

    $('#summaryBox').removeClass('hidden');
    $('.submitBox').removeClass('hidden');

    getSummary();

    cannotSubmit = false;
    $('.submitBox').removeClass('disabled');
    $('.submitBox').removeAttr('disabled');

  } else {
    // do nothing
    $('.steps').removeClass('final');
    $('.steps').removeClass('active');
  }
}


function checkAutoSuggest_Address() {

  $('#addressAutosuggestElement').removeClass('has-error');
  $('#addressAutosuggestElement').removeClass('has-success');
  $('#iconStatus_feedback_addressAutosuggest').remove();
  $('#text_feedback_addressAutosuggest').remove();

  if ($('#patient_mailing_address_data').val() == '') {
    $('#addressAutosuggestElement').addClass('has-error');
    $('#addressAutosuggestElement .typeahead__input--addon').prepend(errorInputIcon('feedback_addressAutosuggest'));
    $('#cotui-autosuggest_address').append(`
        <small id="text_feedback_addressAutosuggest" class="error-help-block">Please select a mailing address</small>
      `);
    $('#patient_mailing_address').focus();
    return false;
  } else {
    $('#addressAutosuggestElement').addClass('has-success');
    $('#addressAutosuggestElement .typeahead__input--addon').prepend(successInputIcon('feedback_addressAutosuggest'));
    $('#text_feedback_addressAutosuggest').remove();
  }

}


function getSummary() {

  // let radioChecks = {};
  // $(formHtmlIdHash+" input[type=radio]:checked").each(function() {
  //   if(this.checked == true){
  //     let id = this.id;
  //     let value = $('#'+this.id).val();
  //     radioChecks[id] = value;
  //     // console.log(this.id);
  //     // console.log($('#'+this.id).val());
  //     // console.log('');
  //   }
  // });
  // console.log(radioChecks);

  showLoading();

  let section1DataGET = $('#section0 .panel-body').clone().html();
  $(section1DataGET).find('cotui-autosuggest').remove();
  let section1Data = $(section1DataGET).html();

  console.log(section1Data);

  let section2DataGET = $('#section1 .panel-body').clone().html();
  $(section2DataGET).find('cotui-autosuggest').remove();
  let section2Data = $(section2DataGET).html();

  let section3DataGET = $('#section2 .panel-body').clone().html();
  $(section3DataGET).find('cotui-autosuggest').remove();
  let section3Data = $(section3DataGET).html();

  // let section4DataGET = $('#section3 .panel-body').clone().html();
  // $(section4DataGET).find('cotui-autosuggest').remove();
  // let section4Data = $(section4DataGET).html();

  // let section5DataGET = $('#section4 .panel-body').clone().html();
  // $(section5DataGET).find('cotui-autosuggest').remove();
  // let section5Data = $(section5DataGET).html();


  // files summary
  let filesAttached = $('#supportingDocuments').val();
  let filesHTML = '';


  if (filesAttached == '') {
    filesHTML = 'No files attached.';
  } else {
    filesHTML += `
        <table id="uploadedFilesBox" class="table table-bordered table-hover">
          <thead>
            <tr>
              <th scope="col">File Name</th>
              <th scope="col">File Type</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
      `;

    // filesArray = dz_uploader.files.map(file=>{
    //   console.log(file);
    //   if(file.status === "error"){
    //   filesHTML += `
    //         <tr>
    //           <th scope="row">${file.name}</th>
    //           <td>${file.type}</td>
    //           <td>${file.status}</td>
    //         </tr>
    //       `;
    //   } else {
    //     //console.log(file)
    //     filesHTML += `
    //         <tr>
    //           <th scope="row">${file.name}</th>
    //           <td>${file.type}</td>
    //           <td>${file.status}</td>
    //         </tr>
    //       `;
    //   }

    // })


    // loop through files
    // let filesArray = JSON.parse(filesAttached);
    // $.each( filesArray, function( key, value ) {
    //   //alert( key + ": " + value );
    //   let fileDescription = '';
    //   //console.log(value.fields.fileDescription);

    //   if(typeof value.fields.fileDescription !== 'undefined'){
    //     fileDescription = value.fields.fileDescription;
    //   }
    //   filesHTML += `
    //     <tr>
    //       <th scope="row">${value.name}</th>
    //       <td>${fileDescription}</td>
    //     </tr>
    //   `;
    // });


    filesHTML += `
          </tbody>
        </table>
      `;

  }


  // let tabs = `

  //     <cotui-tabs id="tabs-to-accordion" selected="0" label="Review Submission Information">
  //         <div data-label="Section 1: Patient Information" id="0">
  //             <h2>Section 1: Patient Information</h2>
  //             ${section1Data}
  //             <div style="clear: both"></div>
  //         </div>
  //         <div data-label="Section 2: Reporting Source" id="1">
  //             <h2>Section 2: Reporting Source</h2>
  //             ${section2Data}
  //             <div style="clear: both"></div>
  //         </div>
  //         <div data-label="Section 3: Patient Health Information" id="2">
  //             <h2>Section 3: Patient Health Information</h2>
  //             ${section3Data}
  //             <div style="clear: both"></div>
  //         </div>
  //     </cotui-tabs>

  // `;


  let tabs = `


                <h2>Section 1: Patient Information</h2>
                ${section1Data}
                <div style="clear: both"></div>

                <h2>Section 2: Reporting Source</h2>
                ${section2Data}
                <div style="clear: both"></div>

                <h2>Section 3: Patient Health Information</h2>
                ${section3Data}
                <div style="clear: both"></div>


    `;


  // <div data-label="Attachments" id="5">
  //     <h2>Attachments</h2>
  //     ${filesHTML}
  //     <div style="clear: both"></div>
  // </div>

  // <div data-label="Section 4: Public Health Actions" id="3">
  //     <h2>Section 4: Public Health Actions</h2>
  //     ${section4Data}
  //     <div style="clear: both"></div>
  // </div>
  // <div data-label="Section 5: Client Call in Details" id="4">
  //     <h2>Section 5: Client Call in Details</h2>
  //     ${section5Data}
  //     <div style="clear: both"></div>
  // </div>


  $('#reviewHTMLElement').html(tabs);


  // radio selection
  // let claimTypeText = $('#claim_typeElement label:eq(1) span').html();
  // if(inputForm.model.get('claim_type')=='A'){
  //   claimTypeText = $('#claim_typeElement label:eq(0) span').html();
  // }


  /* Start - New Implementation to create a "read only / review page" */
  // $('#reviewHTMLElement textarea').replaceWith(function(){
  //     return '<textarea class="form-control fxinput '+this.id+'">'+$('#'+this.id).val().replace(/\n/gi,'<br>')+'</textarea>'
  // });
  // $('#reviewHTMLElement textarea').replaceWith(function() {
  //     return $("<textarea>", {
  //                 "class": this.className,
  //                 html: $(this).html()
  //             });
  // });
  // $('#reviewHTMLElement input').replaceWith(function() {
  //     return $("<input>", {
  //                 "class": this.className,
  //                 html: $(this).html()
  //             });
  // });
  // $('#reviewHTMLElement dropdown').replaceWith(function() {
  //     return $("<dropdown>", {
  //                 "class": this.className,
  //                 html: $(this).html()
  //             });
  // });

  // $('#reviewHTMLElement textarea').attr("readonly", true);
  // $('#reviewHTMLElement input').attr("readonly", true);
  // $('#reviewHTMLElement dropdown').attr("readonly", true);

  // // $('#reviewHTMLElement dropdown').attr("aria-disabled", true);
  // // $('#reviewHTMLElement textarea').attr("aria-disabled", true);
  // // $('#reviewHTMLElement input').attr("aria-disabled", true);

  // // Remove the success style
  // $("#summaryBox *").removeClass("has-success");
  // // Make the UI look like a read only page
  // $('#reviewHTMLElement textarea').css("background", "white");
  // $('#reviewHTMLElement textarea').css("border", "1px solid black");

  // $('#reviewHTMLElement input').css("background", "white");
  // $('#reviewHTMLElement input').css("border", "1px solid black");

  // $('#reviewHTMLElement dropdown').css("background", "white");
  // $('#reviewHTMLElement dropdown').css("border", "1px solid black");
  /* End - New Implementation to create a "read only / review page" - changed */


  $('#reviewHTMLElement textarea').replaceWith(function () {
    return '<span class="form-control fxinput ' + this.id + '">' + $('#' + this.id).val().replace(/\n/gi, '<br>') + '</span>'
  });


  // checkboxes
  $.each($('#reviewHTMLElement input[type="checkbox"]'), function (key, value) {
    //console.log( key + ": " + value );
    $(value).parent('.checkboxLabel').find('input').after('<i class="fas fa-check"></i>');
    $(value).parent('.checkboxLabel').find('input').addClass('hidden');
    if ($('#' + value.id).prop("checked")) {
      $(value).parent('.checkboxLabel').data('id', $('#' + value.id).val());
    } else {
      //$(value).parent('.checkboxLabel').addClass($('#'+value.id).val());
      $(value).parent('.checkboxLabel').addClass('hidden');
      //$('#reviewHTMLElement .form-control .checkboxLabel').remove();
    }

  });


  // if($('#'+this.id).prop("checked")){

  // } else{
  //   $(this).parent('.checkboxLabel').addClass($('#'+this.id).val());
  //   $('#reviewHTMLElement .form-control .checkboxLabel').remove();
  // }


  //$('#reviewHTMLElement input[type="checkbox"]').replaceWith(function(){
  // if(this.checked){
  //   return '<span class="form-control fxinput '+this.id+'">'+$('#'+this.id).val()+'</span>'
  // } else{
  //   $(this).parent('.checkboxLabel').remove();
  //   return '';
  // }

  // if($('#'+this.id).prop("checked")){

  // } else{
  //   $(this).parent('.checkboxLabel').addClass($('#'+this.id).val());
  //   $('#reviewHTMLElement .form-control .checkboxLabel').remove();
  // }

  // console.log(this.id);
  // console.log(this.value);

  // return '<span class="form-control fxinput '+this.id+'">'+$('#'+this.id).val()+'</span>'
  //});


  $('#reviewHTMLElement input[type="radio"]').replaceWith(function () {
    // if(this.checked){
    //   return '<span class="form-control fxinput '+this.id+'">'+$('#'+this.id).val()+'</span>'
    // } else{
    //   $(this).parent('.radioLabel').remove();
    //   return '';
    // }

    //console.log(this.name);
    //console.log($('input[name="'+this.name+'"').prop('checked'));

    //let parentValue = $(this).parent('.radioLabel').addClass($('#'+this.id).val());

    let parentValue = $(this).parents('.form-group.has-feedback').last().attr('data-value');
    //console.log(parentValue);
    //console.log($('#'+this.id).val());

    if (typeof parentValue !== 'undefined') {

      if (parentValue == $('#' + this.id).val()) {
        $(this).parent('.radioLabel').addClass('checked');
      } else {
        $(this).parent('.radioLabel').remove();
      }

    } else {
      $(this).parents('.form-group.has-feedback').last().remove();
    }

    //if($('#'+this.id).prop('checked')){
    // if($('#'+this.id).hasClass('checked')){
    //   $(this).parent('.radioLabel').addClass('strong');
    // }

  });
  $('#reviewHTMLElement input[type="email"]').replaceWith(function () {
    //console.log($('#'+this.id).val());
    if ($('#' + this.id).val() != '') {
      return '<span class="form-control fxinput ' + this.id + '">' + $('#' + this.id).val() + '</span>'
    } else {
      $(this).parents('.form-group.has-feedback').last().remove();
      return '';
    }
  });

  $('#reviewHTMLElement input[type="text"]').replaceWith(function () {
    //console.log($('#'+this.id).val());
    if ($('#' + this.id).val() != '') {
      return '<span class="form-control fxinput ' + this.id + '">' + $('#' + this.id).val() + '</span>'
    } else {
      $(this).parents('.form-group.has-feedback').last().remove();
      return '';
    }
  });

  $('#reviewHTMLElement input[type="tel"]').replaceWith(function () {
    //console.log($('#'+this.id).val());
    if ($('#' + this.id).val() != '') {
      return '<span class="form-control fxinput ' + this.id + '">' + $('#' + this.id).val() + '</span>'
    } else {
      $(this).parents('.form-group.has-feedback').last().remove();
      return '';
    }
  });

  // $('#reviewHTMLElement dropdown').replaceWith(function(){
  //    return '<span class="form-control fxinput '+this.id+'">'+this.value+'</span>'
  // });

  $('#reviewHTMLElement select').replaceWith(function () {

    //return '<span class="form-control fxinput '+this.id+'">'+this.value+'</span>'
    return '<span class="form-control fxinput ' + this.id + '">' + $('#' + this.id).val() + '</span>'
  });

  //$('#reviewHTMLElement .entryField').remove();
  $('#reviewHTMLElement .form-control-feedback').remove();
  $('#reviewHTMLElement .input-group-addon').remove();
  $('#reviewHTMLElement .totalCharacters').remove();

  $('#reviewHTMLElement #addressAutosuggestElement').remove();


  //$('#reviewHTMLElement .form-control .checkboxLabel').remove();


  // if($('#installed_devices_information_0').prop("checked")){
  //   $('#reviewHTMLElement #backwatervalve_contractor_licence_numberElement').removeClass('hidden');
  //   $('#reviewHTMLElement #backwatervalve_subcontractor_licence_numberElement').removeClass('hidden');
  // } else{
  //   $('#reviewHTMLElement #title_section_backwatervalveElement').remove();
  //   $('#reviewHTMLElement #installed_devices_informationElement .form-control .checkboxLabel.backwatervalve').remove();
  // }


  //$('#reviewHTMLElement cotui-autosuggest').remove();


  hideLoading();

}


class HomeForm {
  constructor(container) {
    this.model = new SubmissionModel();
    this.container = container;
    this.cotForm = new CotForm(this.formDefinition());
    this.cotForm.setModel(this.model);
  }

  render() {

    $(formHtmlIdHash).append(this.progressHTML());
    $(formHtmlIdHash).after(this.wizardHTML());
    //$(formHtmlIdHash).after(this.progressHTML());


    $('#sharebutton').remove();

    firstLoadPage = false;

    hideLoading(true);

    $(document).on('click', '.nextButton', function () {
      $('#submitNoticeData').remove();
      window.scrollTo(0, 0);
      // check validation
      if (currentStep == 3) {

        // if(dz_uploader.files.length > 0) {
        //   let errorDidOccur = false;
        //   let maxFileLimitReached = false;
        //   let errorMessage = "";

        //   if (dz_uploader.files.length > dz_uploader.options.maxFiles) {
        //     maxFileLimitReached = true;
        //     errorMessage += "You have exceeded the number of maximum file limit."
        //   }

        //   for(var i=0; i < dz_uploader.files.length; i++) {
        //     var file = dz_uploader.files[i]
        //     if(file.status === "error") {
        //       errorDidOccur = true;
        //     }
        //   }

        //   if (maxFileLimitReached) {
        //     errorMessage += " Please clear all files with errors.";
        //     errorDidOccur = true;
        //   } else {
        //     errorMessage = "Please clear all files with errors.";
        //   }

        //   if (errorDidOccur) {
        //     CotApp.showModal({
        //       title:'Error',
        //       body: errorMessage,
        //       preset: 'alert',
        //       footerButtonsHtml: '',

        //       callback: function(e){
        //         // // clear terms
        //         // if(currentStep == 1){
        //         //   var $el = document.getElementById('covid19_container')
        //         //   var url = $el.parentNode.dataset['redirect'] || '/';
        //         //   window.location.href = url;
        //         // } else {
        //         //   $.removeCookie('terms_cookie_claimforlien_terms_agreed', { path: '/' });
        //         //   location.reload();
        //         // }
        //         return false;
        //       },
        //       originatingElement: $('#supportingDocuments')
        //     })
        //     return false;
        //   }

        // }
      }


      $('.cotui-autosuggest').addClass('has-feedback');
      $('.typeahead__label').addClass('staticlabel');
      $('.typeahead__input').addClass('form-control has-feedback');


      $(formHtmlIdHashform).data('formValidation').validate();

      if ($(formHtmlIdHashform).data('formValidation').$invalidFields.length > 0) {
        if (currentStep == 1) {
          checkAutoSuggest_Address();
        }
        return false;
      } else {
        if (currentStep == 1) {
          checkAutoSuggest_Address();
        }
      }


      if ($('.steps').hasClass('active')) {
        // do nothing
      } else {
        $('.steps').addClass('active');
      }

      if (currentStep >= 0 && currentStep <= 3) {
        currentStep++;
        progressChange(currentStep);
      }

    });


    $(document).on('click', '.previousButton', function () {
      $('#submitNoticeData').remove();

      if (currentStep > 1) {
        currentStep--;
        progressChange(currentStep);
      }

      if ($('.progress').hasClass('final')) {
        return false;
      } else {
        // do nothing
      }
      if ($('.steps').hasClass('active')) {
        // do nothing
      } else {
        $('.steps').addClass('active');
      }
    });


    $(document).on('click', '.cancelButton', function () {

      CotApp.showModal({
        title: 'Are you sure you want to leave?',
        body: 'You will lose any changes you’ve made on this page.',
        preset: 'confirm',
        footerButtonsHtml: '',
        onShown: function () {
          $('.modal-footer .btn:eq(0)').addClass('btn-cancel');
        },
        buttons: {
          cancel: {
            label: 'Stay',
            bootstrapType: ''
          },
          confirm: {
            label: 'Leave',
            bootstrapType: 'danger'
          }
        },
        callback: function (e) {
          // clear terms
          if (currentStep == 1) {
            var $el = document.getElementById('covid19_container')
            var url = "#";
            window.location.href = url;
          } else {
            $.removeCookie('terms_cookie_covid19_terms_agreed', {path: '/'});
            location.reload();
          }
          return false;
        },
        originatingElement: $('.cancelButton')
      });

    });


    $(document).on("keyup", "textarea", function (event) {
      checkTextAreaMaxLength(this, event);
    });


    $(document).on('click', '.submitBox', function () {
      $('.submitBox').attr('disabled', 'true');
      if (cannotSubmit) {
        return false;
        $('.submitBox').removeAttr('disabled');
      }
      showLoading();
      $(formHtmlIdHashform).data('formValidation').validate();
      return false;
    });


    this.cotForm.render({target: this.container});

    // Fix Date MaxLength
    $('.dateInput').attr('maxlength', 10);

    // Accessibility fix shift h3 to h2 for panel-heading
    $('.panel-heading h3').replaceWith(function () {
      return $("<h2>", {
        "class": this.className,
        html: $(this).html()
      });
    });

    $('#section1').addClass("hidden");
    $('#section2').addClass("hidden");
    $('#section3').addClass("hidden");
    $('#section4').addClass("hidden");
    $('#summaryBox').addClass("hidden");

    $('.submitBox').addClass("hidden");


    // auto suggest address
    var handleSelected_address = function (evt) {
      //console.log('Selected', evt)
      //$('.typeahead__input--addon').html(successInputIcon());
      $('#patient_mailing_address').val(evt.text);
      $('#patient_mailing_address_data').val(evt.value);

      //console.log(evt.value);

      $.ajax({
        url: 'https://map.toronto.ca/cotgeocoder/rest/geocoder/findAddressCandidates?f=json&keyString=' + evt.value + '&retRowLimit=1',
        method: 'GET',
        beforeSend: function (xhr) {
          //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        }
      })
        .done(function (data) {
          //$('#'+id).html(JSON.stringify(data));
          if (data) {
            if (data.result) {
              if (data.result.rows) {
                if (data.result.rows.length >= 1) {
                  $('#patient_mailing_street_number').val(data.result.rows[0].LO_NUM);
                  $('#patient_mailing_street_name').val(data.result.rows[0].LINEAR_NAME + ' ' + data.result.rows[0].LINEAR_NAME_TYPE);
                  $('#patient_mailing_suite_number').val('');
                  $('#patient_mailing_city').val(data.result.rows[0].CITY);
                  $('#patient_mailing_province').val('Ontario');
                  $('#patient_mailing_country').val('Canada');
                  $('#patient_mailing_postal_code').val(data.result.rows[0].POSTAL_CODE);
                  $('#patient_mailing_long').val(data.result.rows[0].LONGITUDE);
                  $('#patient_mailing_lat').val(data.result.rows[0].LATITUDE);

                  $('#patient_mailing_street_number').attr('disabled', 'disabled');
                  $('#patient_mailing_street_name').attr('disabled', 'disabled');
                  // $('#patient_mailing_suite_number').attr('disabled','disabled');
                  $('#patient_mailing_city').attr('disabled', 'disabled');
                  $('#patient_mailing_province').attr('disabled', 'disabled');
                  $('#patient_mailing_country').attr('disabled', 'disabled');
                  $('#patient_mailing_postal_code').attr('disabled', 'disabled');
                  $('#patient_mailing_long').attr('disabled', 'disabled');
                  $('#patient_mailing_lat').attr('disabled', 'disabled');

                }
              }
            }
            console.log(data);
          }
        })
        .fail(function () {
          console.log(data);
          $('#patient_mailing_street_number').val('');
          $('#patient_mailing_street_name').val('');
          $('#patient_mailing_suite_number').val('');
          $('#patient_mailing_city').val('');
          $('#patient_mailing_province').val('Ontario');
          $('#patient_mailing_country').val('Canada');
          $('#patient_mailing_postal_code').val('');
          $('#patient_mailing_long').val('');
          $('#patient_mailing_lat').val('');

          $('#patient_mailing_street_number').removeAttr('disabled');
          $('#patient_mailing_street_name').removeAttr('disabled');
          // $('#patient_mailing_suite_number').removeAttr('disabled');
          $('#patient_mailing_city').removeAttr('disabled');
          $('#patient_mailing_province').removeAttr('disabled');
          $('#patient_mailing_country').removeAttr('disabled');
          $('#patient_mailing_postal_code').removeAttr('disabled');
          $('#patient_mailing_long').removeAttr('disabled');
          $('#patient_mailing_lat').removeAttr('disabled');

          $('#patient_mailing_address_data').val(' ');

        })
        .always(function () {

        });


      console.log(evt.value);

      checkAutoSuggest_Address();
    }

    let handleResults_address = function (evt) {
      //console.log('Result', evt)
      //$('.typeahead__button--clear').remove();
      $('#patient_mailing_address').val('');
      $('#patient_mailing_address_data').val('');

      if (evt.length == 0) {
        $('#cotui-patient_mailing_address').attr('errortext', 'no results found');
      } else {
        $('#cotui-patient_mailing_address').attr('errortext', '');
      }

    }

    let handleSubmit_address = function (evt) {
      //console.log('Submit', evt)
    }

    let handleInput_address = function (evt) {
      console.log('Input', evt)
      if (document.getElementById('cotui-autosuggest_address').value == "") {
        $('#patient_mailing_address').val('');
        $('#patient_mailing_address_data').val('');
        $('#cotui-patient_mailing_address').attr('errortext', 'no results found');
      }
      checkAutoSuggest_Address();
    }


    let autoSuggest_address = document.getElementById('cotui-autosuggest_address');
    autoSuggest_address.onresults = handleResults_address;
    autoSuggest_address.onselected = handleSelected_address;
    autoSuggest_address.submit = handleSubmit_address;
    autoSuggest_address.oninput = handleInput_address;

    autoSuggest_address.onclear = function (term) {
      $('#cotui-autosuggest_address').attr('errortext', '');
      $('#cotui-autosuggest_address').val('');
    };


    // // auto suggest backwatervalve contractor
    //   let autoSuggest_backwatervalve_contractor = document.getElementById('cotui-autosuggest_backwatervalve_contractorbusinessnumber');

    //   autoSuggest_backwatervalve_contractor.submit = function(evt){
    //     //console.log('Submit', evt)
    //   }

    //   autoSuggest_backwatervalve_contractor.oninput = function(evt){
    //     checkAutoSuggest_backwatervalve_contractor();
    //   }

    //   autoSuggest_backwatervalve_contractor.onselected = function(term){
    //     //console.log('Selected', term)

    //     $('#backwatervalve_contractor_name').val(term.value);
    //     $('#backwatervalve_contractor_licence_number').val(term.text);

    //     checkAutoSuggest_backwatervalve_contractor()
    //   }

    //   autoSuggest_backwatervalve_contractor.onresults = function(term){
    //     //console.log(term);
    //     if(term.length==0){
    //       $('#cotui-autosuggest_backwatervalve_contractorbusinessnumber').attr('errortext','no results found');
    //     } else{
    //       $('#cotui-autosuggest_backwatervalve_contractorbusinessnumber').attr('errortext','');
    //     }
    //   };

    //   autoSuggest_backwatervalve_contractor.onclear = function(term){
    //     $('#cotui-autosuggest_backwatervalve_contractorbusinessnumber').attr('errortext','');
    //     $('#cotui-autosuggest_backwatervalve_contractorbusinessnumber').val('');
    //   };

    //   autoSuggest_backwatervalve_contractor.customSearch = function(query){
    //     return fetch("/*@echo LICENCE_API_URL*/"+query+'/'+moment($('#backwatervalve_invoice_date').val()).format('YYYYMMDD'),{
    //       method: 'post'
    //     }).then(res=>res.json())
    //     .then(res=>{

    //       let customData = [];

    //       if(res.valid){
    //         customData.push({
    //           //id: query,
    //           //text: query + ' - ' + res.name,
    //           text: query,
    //           value: res.name,
    //           data: res
    //         });
    //       }
    //       return customData
    //     });

    //   };


    let optionalDIV = '<span class="optional">(optional)</span>';

    // $('#cotui-autosuggest_backwatervalve_subcontractorbusinessnumber label.typeahead__label').html('Sub Contractor Business Licence Number:'+optionalDIV);

  }

  setModel(model) {
    this.model = model;
    this.cotForm.setModel(model);
  }

  summaryHTML() {
    let html = `
      <i class="fas fa-spinner fa-spin"></i> Loading
    `;
    return html;
  }

  uploadInfoText() {
    let html = `
      <p>The following attachments should comply with the following:</p>
      <ul>
        <li>All attachments must be submitted in <i class="far fa-file-pdf"></i> PDF, <i class="far fa-file-word"></i> Word or <i class="far fa-file-archive"></i> Zip format. </li>
        <li>There is a maximum limit of 8 files.</li>
        <li>There is a file size limit of 10MB per file.</li>
        <li>You can remove any file you have attached by clicking Delete.</li>
      </ul>
      <p>To upload files, follow these steps for each document:</p>
      <ul>
        <li>Choose your file(s) from your computer or device. Once you select it, it will upload.</li>
        <li>Add description of file.</li>
        <li>Attach the file(s) by clicking Next.</li>
      </ul>
      <p>All files will be scanned at the time of submission. Infected or corrupted files will not be attached to the submission.</p>
    `;
    return html;
  }

  progressHTML() {
    let html = `

      <div class="progress" style="height: 20px;">
        <div class="progress-bar" role="progressbar" style="width: 5%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
      </div>

    `;
    return html;
  }

  wizardHTML() {
    let html = `

      <div class="steps">
      <div class="row">
        <div class="col-xs-6">
          <button class="previousButton pull-left btn btn-default btn-lg" type="button">
            Previous
          </button>
        </div>
        <div class="col-xs-6">
          <div class="pull-right">
            <button class="cancelButton pull-left btn btn-cancel btn-lg mr-2" type="button">
              Cancel
            </button>
            <button class="nextButton pull-left btn btn-primary btn-lg" data-wt_params="WT.si_n=covid19;;WT.si_x=1" type="button">
            Next
            </button>
            <button class="submitBox pull-left btn btn-primary btn-lg" data-wt_params="WT.si_n=covid19;;WT.si_x=6;;WT.si_cs=1" type="button" class="btn btn-primary btn-lg">
              Submit
            </button>
          </div>

        </div>
      </div>
      </div>

    `;
    return html;
  }

  formDefinition() {
    let formId = formHtmlId + '_form';
    //const maxNumberOfComments = 4;

    let formDef = {
      id: formId, //required, a unique ID for this form
      //title: 'Example Form', //optional, a title to display at the top of the form
      rootPath: '/*@echo SRC_PATH*//', //optional, only required for forms using validationtype=Phone fields
      success: (event) => {

        if (cannotSubmit) {
          return false;
        }

        if (currentStep <= 3) {
          return false;
        }
        if ($(formHtmlIdHashform).data('formValidation').$invalidFields.length > 0) {
          return false;
        }


        // let filesWithErrors = dz_uploader.files.filter(function (file) { return file.status === Dropzone.ERROR;});
        // if (filesWithErrors.length > 0) {
        //   let fileNames = '';
        //   filesWithErrors.forEach(function(file) {
        //     if (fileNames) {
        //       fileNames += "<li>" + file.name + "</li>";
        //     } else {
        //       fileNames = "<li>" + file.name + "</li>";
        //     }
        //   });
        //   fileNames += "";

        //   CotApp.showModal({
        //     title:'Error',
        //     body: 'The from is being submitted please note there was an error with uploading these files: <ul>' + fileNames + '</ul>',
        //     preset: 'alert',
        //     footerButtonsHtml: '',

        //     callback: function(e){
        //       // // clear terms
        //       // if(currentStep == 1){
        //       //   var $el = document.getElementById('covid19_container')
        //       //   var url = $el.parentNode.dataset['redirect'] || '/';
        //       //   window.location.href = url;
        //       // } else {
        //       //   $.removeCookie('terms_cookie_claimforlien_terms_agreed', { path: '/' });
        //       //   location.reload();
        //       // }
        //       //return false;
        //     },
        //     originatingElement: $('.submitBox')
        //   })

        //   document.getElementById('loading-indicator').remove();

        //   //return false;
        // }

        // console.log('SUCCESS');
        if (event) {
          event.preventDefault(); //this prevents the formvalidation library from auto-submitting if all fields pass validation
        }


        let valuesToSubmit = this.model ? this.model.toJSON() : this.cotForm.getData();


        // FIX DA - column size

        //var parts = valuesToSubmit.description_of_premises.match(/.{1,32000}/gi);
        // var part1,part2;

        // if( valuesToSubmit.description_of_premises && valuesToSubmit.description_of_premises.length > 32000){
        //   part1 = valuesToSubmit.description_of_premises.substring(0,32000);
        //   part2 = valuesToSubmit.description_of_premises.substring(32000);
        // } else {
        //   part1 = valuesToSubmit.description_of_premises
        //   part2 =""
        // }

        // valuesToSubmit['description_of_premises0']=part1;
        // valuesToSubmit['description_of_premises1']=part2;
        // delete valuesToSubmit.description_of_premises;

        let finalSupportingDocuments = [];
        // valuesToSubmit.supportingDocuments.forEach( function(uploadDetails) {
        //   uploadDetails.errorMessage = null;
        //   finalSupportingDocuments.push(uploadDetails);
        // } );
        // valuesToSubmit.supportingDocuments = finalSupportingDocuments;


        // console.log(part1, part2)
        /*
        // console.log(valuesToSubmit);
        if(parts){
          if(parts.length > 0){
            delete valuesToSubmit.description_of_premises;
          }
          parts.forEach((part,ndx)=>{
            valuesToSubmit['description_of_premises'+ndx]=part;
          })
        } else {
          valuesToSubmit['description_of_premises0']=valuesToSubmit.description_of_premises;
          valuesToSubmit['description_of_premises1']="";
          delete valuesToSubmit.description_of_premises;
        }
        */


        valuesToSubmit.patient_mailing_address = $('#cotui-autosuggest_address').attr('text');
        valuesToSubmit.patient_mailing_address_data = $('#cotui-autosuggest_address').attr('value');

        // valuesToSubmit.property_first_name = $('#property_first_name').val();
        // valuesToSubmit.property_last_name = $('#property_last_name').val();


        let stringifySubmission = JSON.stringify(valuesToSubmit);
        // stringifySubmission.captcha = 'test';


        console.log(valuesToSubmit);


        //console.log('submit not available');
        //document.getElementById('loading-indicator').remove();
        //return false;


        let successHTML = function (referenceID, id, uploadedFiles) {

          //console.log(uploadedFiles);

          // files summary
          let filesHTML = '';

          // if(dz_uploader.files.length==0){
          //   filesHTML = '';
          // } else{
          //   filesHTML += `
          //     <table id="uploadedFilesBox" class="table table-bordered table-hover">
          //       <thead>
          //         <tr>
          //           <th scope="col">File Name</th>
          //           <th scope="col">Description</th>
          //         </tr>
          //       </thead>
          //       <tbody>
          //   `;

          //   filesArray = dz_uploader.files.map(file=>{
          //     if(file.status === "error"){
          //     filesHTML += `
          //           <tr>
          //             <th scope="row">${file.name}</th>
          //             <td>${file.status}</td>
          //           </tr>
          //         `;
          //     } else {
          //       //console.log(file)
          //       filesHTML += `
          //           <tr>
          //             <th scope="row">${file.name}</th>
          //             <td>${file.status}</td>
          //           </tr>
          //         `;
          //     }

          //   })

          //   filesHTML += `
          //       </tbody>
          //     </table>
          //   `;

          // }


          return `
          <div id="submitBox" class="panel cot-form confirmationBOX panel-default">
              <div class="panel-heading">
                  <h3>Submission</h3>
              </div>
              <div class="panel-body">
                  <div class="row">
                      <div id="confirmationElement" class="col-xs-12 form-group form-group-vertical">
                          <p>Your request has been successfully submitted to the City of Toronto.</p>
                          <p>
                            Your Reference Number is: <strong>${referenceID}</strong>
                          </p>
                      </div>
              </div>
                ${uploadedFiles.length > 0 ? `
                  <table class="table">
                    <caption>Submitted files</caption>
                    <thead>
                      <tr><th>File Name</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      ${uploadedFiles.map(file => {
            return `<tr><td>${file.name}</td><td>${file.status === 'success' ? 'Uploaded Successfuly' : 'Upload Error'}</td></tr>`
          }).join('')}
                    </tbody>
                  </table>
                  ` : ''
          }
            </div>
          </div>

          <button id="submitAnother" class="btn btn-default btn-lg btn-submit" type="button">
            Submit Another Request
          </button>
        `
        };

        let submitNoticeData = `
          <div id="submitNoticeData" tabindex="-1">
            <div class="">
              <div class="alert alert-danger">
                We cannot process your submission at this time, please check your internet connection and try again later.
              </div>
            </div>
          </div>
        `;

        $(document).on('click', '#submitAnother', function (e) {
          location.reload();
          return false;
        });

        var app = this

        function submitForm(bin) {

          $('#submitNoticeData').remove();

          let that = app;
          grecaptcha.ready(function () {
            grecaptcha.execute('/*@echo RECAPTCHA_SITEKEY*/').then(function (token) {
              //var uploadedFiles = dz_uploader.files;
              // stringifySubmission.supportingDocuments = bin

              console.log(stringifySubmission);
              //return false;

              $.ajax({
                method: "POST",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                cache: false,
                url: "/*@echo RECAPTCHA_API_URL*/" + IE11Cache(),
                headers: {
                  // "Content-Type": "application/json",
                  // "captchaResponseToken":token,
                  // "cot_recaptcha_config":"/*@echo COT_RECAPTCHA_CONFIG_TOKEN*/"
                  //"Origin": "www.toronto.ca",
                  "Content-Type": "application/json",
                  "g-recaptcha-response": token,
                },
                data: stringifySubmission,
                success: (submitResponseData) => {
                  currentModel = that.model.toJSON();
                  //var res = JSON.parse(submitResponseData.body);
                  var res = submitResponseData;
                  var successID = res.id;
                  var referenceID = res.referenceID

                  var $html = successHTML(referenceID, successID, uploadedFiles)

                  $('.progress').remove();
                  $('.steps').remove();
                  $('#submitNoticeData').remove();
                  hideLoading();

                  $('#covid19_container').html($html);

                  // $('#covid19_container [data-download]').click(evt=>{
                  //   // $('.js-downloadFinalPdf').attr('disabled', 'true');

                  //   if($(evt.target).attr('data-downloading')==='true') return false;

                  //   $(evt.target).attr('data-downloading','true')
                  //   $(evt.target).append(' <i id="loading-download" class="fas fa-spinner fa-spin"><span class="sr-only">Loading</span></i>')
                  //   grecaptcha.ready(function() {
                  //     grecaptcha.execute('/*@echo RECAPTCHA_SITEKEY*/').then(function(token) {

                  //       $.ajax({
                  //         //url: `/*@echo PDF_API*/`,
                  //         url: "/*@echo RECAPTCHA_API_URL*/?t=" + IE11Cache(),
                  //         method: "POST",
                  //         type:"POST",
                  //         cache: false,
                  //         headers:{
                  //           'Content-Type':'application/json',
                  //           "captchaResponseToken":token,
                  //           "cot_recaptcha_config":"3e8c0acc-770f-4606-84f1-71b4c9170cc6"
                  //         },
                  //         data:JSON.stringify({
                  //           "id":successID
                  //         })
                  //       }).then(response=>{
                  //         var res = JSON.parse(response.body);
                  //         let filename = `claimlein-form12__${referenceID}.pdf`;

                  //         if(res){


                  //           // Tempory workaround for cases when backend sends a response.body wrapped in an array
                  //           if (!res.BIN_ID) {
                  //             if (Array.isArray(res) && res[0]) {
                  //               res = res[0];
                  //             } else {
                  //               console.log('ERROR');
                  //               document.getElementById('loading-download').remove();
                  //               $(evt.target).attr('data-downloading','false');
                  //               $('.js-downloadFinalPdf').removeAttr('disabled');
                  //               return false;
                  //             }
                  //           }


                  //           $.ajax({
                  //             url:  `/*@echo DOWNLOAD_API*/${res.BIN_ID[0].file_name}`+IE11Cache(),
                  //             method: "GET",
                  //             type:"GET",
                  //             cache: false,
                  //             headers:{
                  //               'Content-Type':'application/json',
                  //               "Content-Disposition": `attachment; filename=${filename}`,
                  //               "captchaResponseToken":token,
                  //               "cot_recaptcha_config":"3e8c0acc-770f-4606-84f1-71b4c9170cc6"
                  //             },
                  //             error(data) {
                  //               $('.js-downloadFinalPdf').removeAttr('disabled');
                  //               console.log('ERROR', data);
                  //             },
                  //             fail(data) {
                  //               $('.js-downloadFinalPdf').removeAttr('disabled');
                  //               console.log('ERROR', data);
                  //             },
                  //             success(data) {
                  //               let finalData = data; //file data here
                  //               //let filename = `claimlein-form12__${referenceID}.pdf`;

                  //                 let blob = new Blob([finalData],{
                  //                     type: 'application/pdf;charset=utf-8;'
                  //                 });

                  //                 // if(window.navigator.msSaveOrOpenBlob) {
                  //                 //     navigator.msSaveOrOpenBlob(blob, filename + '.pdf');
                  //                 // } else {
                  //                     let linkEXPORT = document.createElement("a");
                  //                     linkEXPORT.style.display = 'none';
                  //                     document.body.appendChild(linkEXPORT);
                  //                     if(linkEXPORT.download !== undefined) {
                  //                         //linkEXPORT.setAttribute('href', URL.createObjectURL(blob));
                  //                         linkEXPORT.setAttribute('href', `/*@echo DOWNLOAD_API*/${res.BIN_ID[0].file_name}`);
                  //                         linkEXPORT.setAttribute('download', filename);
                  //                         linkEXPORT.click();
                  //                     } else {
                  //                         // pdf = 'data:application/pdf;charset=utf-8,' + finalData;
                  //                         // window.open(encodeURI(pdf));
                  //                         linkEXPORT.setAttribute('href', `/*@echo DOWNLOAD_API*/${res.BIN_ID[0].file_name}`);
                  //                         linkEXPORT.setAttribute('download', filename);
                  //                         linkEXPORT.click();
                  //                     }
                  //                     document.body.removeChild(linkEXPORT);
                  //                 //}
                  //                 $('.js-downloadFinalPdf').removeAttr('disabled');
                  //             }
                  //           })


                  //         } else {
                  //           document.getElementById('loading-download').remove();
                  //           $(evt.target).attr('data-downloading','false');
                  //         }

                  //       }).then(res=>{
                  //         document.getElementById('loading-download').remove();
                  //         $(evt.target).attr('data-downloading','false');
                  //       })


                  //    })
                  //   })
                  // })

                },
                error: (err) => {
                  hideLoading();

                  $('#submitNoticeData').remove();

                  console.log("Error! - ", err);


                  // //$('.steps').before(submitNoticeData);

                  // $('#covid19_container').before(submitNoticeData);
                  // window.scrollTo(0,0);
                  // $("#submitNoticeData").focus();

                  // $('.submitBox').removeAttr('disabled');

                  //if(err.response.statusCode=='409'){
                  if (err.code == '409') {
                    if (window.submitRetries < 10) {
                      // resubmit since claim number already exists
                      //$('#submitForm').removeAttr('disabled');
                      //$('#submitForm').removeClass('disabled');
                      $('.submitBox').click();
                      window.submitRetries++;
                      dataFirstBeingSent = true;
                    } else {
                      //$('#submitForm').removeAttr('disabled');
                      //$('#submitForm').removeClass('disabled');
                      $('#covid19_container').before(submitNoticeData);
                      window.scrollTo(0, 0);
                      $("#submitNoticeData").focus();
                      dataFirstBeingSent = true;
                    }
                  } else {
                    //$('#submitForm').removeAttr('disabled');
                    //$('#submitForm').removeClass('disabled');
                    $('#covid19_container').before(submitNoticeData);
                    window.scrollTo(0, 0);
                    $("#submitNoticeData").focus();
                    dataFirstBeingSent = true;
                  }


                  $('.submitBox').removeAttr('disabled');


                },
                fail: (err) => {
                  hideLoading();

                  $('#submitNoticeData').remove();

                  // if(err.response.statusCode=='409'){
                  if (err.code == '409') {
                    if (window.submitRetries < 10) {
                      // resubmit since claim number already exists
                      $('.submitBox').removeAttr('disabled');
                      $('.submitBox').removeClass('disabled');
                      $('.submitBox').click();
                      window.submitRetries++;
                      dataFirstBeingSent = true;
                    } else {
                      $('.submitBox').removeAttr('disabled');
                      $('.submitBox').removeClass('disabled');
                      $('#covid19_container').before(submitNoticeData);
                      window.scrollTo(0, 0);
                      $("#submitNoticeData").focus();
                      dataFirstBeingSent = true;
                    }
                  } else {
                    $('.submitBox').removeAttr('disabled');
                    $('.submitBox').removeClass('disabled');
                    $('#covid19_container').before(submitNoticeData);
                    window.scrollTo(0, 0);
                    $("#submitNoticeData").focus();
                    dataFirstBeingSent = true;
                  }


                  $('.submitBox').removeAttr('disabled');

                }
              });


            });
          })

        }


        /*

               cotDropzone.uploadAndCallback = function (cbk) {
                var step2 = function step2() {
                  if (cbk) {
                    cbk({
                      "delete": cotDropzone.dropzone.deletedFiles || [],
                      keep: cotDropzone.dropzone.files.filter(function (file) {
                        return file.status === Dropzone.SUCCESS && file.xhr != null;
                      })
                    });
                  }
                };
               }

        */


        //  if(dz_uploader.files.length > 0){

        // // grecaptcha.ready(function() {
        // //   grecaptcha.execute('/*@echo RECAPTCHA_SITEKEY*/').then(function(token) {
        //     console.log(token)
        //     dz_uploader.on('sending',function(file,xhr,formData){
        //     console.log('sending',file,xhr,formData);
        //     //console.log(token)


        //     //xhr.setRequestHeader("captchaResponseToken",token);
        //     //xhr.setRequestHeader('Custom-Meta', token);

        //     })
        // //   })

        // // });

        // dz_uploader.on('queuecomplete',function(){
        //console.log('queuecomplete',this);
        // var bin = $('#supportingDocuments').val()
        //console.log("HHHHH", bin)
        //   submitForm(bin);
        // });

        // dz_uploader.processQueue();


        // if($('#supportingDocuments').get(0)){
        //   $('#supportingDocuments').get(0).cotDropzone.uploadAndCallback(
        //     function() {
        //       submitForm();
        //     }
        //   )
        // }

        //  } else {
        submitForm();
        //  }


      },
      useBinding: true,
      sections: [

        // {
        //   cols: "2",
        //   id: 'directUploadFeed',
        //   title: "Direct Data Upload",
        //   rows: [
        //       {
        //         fields: [

        //           {
        //             id: "directupload_box",
        //             type: "html",
        //             html: `

        //               <p>You may also import your own excel spreadsheet data which will replace the whole form and submit the data file to the City of Toronto automatically.</p>

        //               <div>
        //                 <button id="excelDataFeed" class="btn btn-lg btn-success">UPLOAD EXCEL DATA FEED</button>
        //               </div>

        //               <hr/>

        //               <div>
        //                 <strong>Status:</strong><span id="directDataStatus"></span>
        //               </div>

        //               <small>
        //                 The data feed must conform to the following excel spreadsheet for processing and is limited to 10 MB per transmittion.
        //               </small>


        //             `,
        //             className: "col-xs-12",
        //           },

        //         ]
        //       }
        //   ],
        // },


        {
          cols: "2",
          id: null,
          title: "Section 1: Patient Information",
          rows: [
            {
              fields: [

                {
                  id: "patient_ontario_health_card_number",
                  type: "text",
                  title: "Ontario Health Card Number and Version Code:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_ontario_health_card_number",
                  required: false,
                  infohelp: null,
                  prehelptext: "example format ####-###-###-AA or ####-###-###",
                  placeholder: null,
                  validators: {
                    callback: {
                      message: "Not a valid ontario health card number",
                      callback: (value, validator, $field) => {
                        if (validateHC(value.replace(/ /gi, ''))) {
                          return fixEX(value)
                        } else {
                          if (value == '') {
                            return fixEX(value);
                          } else {
                            return false;
                          }
                        }
                      }
                    }
                  }
                },


                {
                  id: "patient_hospital_mrn",
                  type: "text",
                  title: "Hospital MRN Number:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_hospital_mrn",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_firstname",
                  type: "text",
                  title: "Client First Name:",
                  className: "col-xs-12 col-sm-4",
                  bindTo: "patient_firstname",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_middlename",
                  type: "text",
                  title: "Client Middle Name:",
                  className: "col-xs-12 col-sm-4",
                  bindTo: "patient_middlename",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_lastname",
                  type: "text",
                  title: "Client Last Name:",
                  className: "col-xs-12 col-sm-4",
                  bindTo: "patient_lastname",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_dateofbirth",
                  type: "datetimepicker",
                  title: "Date of Birth:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_dateofbirth",
                  maxlength: 10,
                  options: {
                    format: 'YYYY-MM-DD',
                    maxDate: new moment().format("YYYY-MM-DD"),
                    keepInvalid: true,
                    useStrict: true
                  },
                  htmlAttr: {
                    length: 10
                  },
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  //validators: {
                  // regexp: {
                  //   regexp: dateFormat,
                  //   message: dateFormatText
                  // },
                  // callback: {
                  //   message: charactersNotAllowed,
                  //   callback: (value, validator, $field) => {
                  //     return fixEX(value);
                  //   }
                  // }
                  //}
                },


                {
                  id: "patient_gender",
                  type: "dropdown",
                  title: "Gender:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_gender",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  choices: [
                    {
                      value: "Male",
                      text: "Male"
                    },
                    {
                      value: "Female",
                      text: "Female"
                    },
                    {
                      value: "Transgender",
                      text: "Transgender"
                    },
                    {
                      value: "Other",
                      text: "Other"
                    },
                    {
                      value: "Unknown",
                      text: "Unknown"
                    }
                  ],
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "divider_1",
                  type: "html",
                  html: "<hr/>",
                  className: "col-xs-12",
                },


                {
                  id: "addressAutosuggest",
                  type: "html",
                  className: "col-xs-12 col-sm-9",
                  html: `
                        <cotui-autosuggest
                          label="Mailing Address:"
                          limit="5"
                          icon="fas fa-map-marker-alt"
                          button="Lookup"
                          type="api"
                          data-api.attr-value="KEYSTRING"
                          data-api.attr-text="ADDRESS"
                          data-api.attr-array="result.rows"
                          data-api.url="https://map.toronto.ca/cotgeocoder/rest/geocoder/suggest?f=json&addressOnly=0&retRowLimit=100&searchString={QUERY}"
                          id="cotui-autosuggest_address"
                          >
                        </cotui-autosuggest>
                      `
                },
                {
                  id: "patient_mailing_address_data",
                  type: "text",
                  title: "Address data:",
                  className: "col-xs-12 hidden",
                  bindTo: "patient_mailing_address_data",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "nofixedaddress_option",
                  type: "radio",
                  title: "No Fixed Address:",
                  className: "col-xs-12 col-sm-3",
                  bindTo: "nofixedaddress_option",
                  orientation: "horizontal",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  choices: [
                    {
                      value: "Yes",
                      text: "Yes"
                    },
                    {
                      value: "No",
                      text: "No"
                    },
                  ],
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        //console.log(value);

                        $('#nofixedaddress_option_textElement').addClass('hidden');

                        if (value == 'Yes') {
                          $('#nofixedaddress_option_textElement').removeClass('hidden');

                          $('#patient_mailing_street_number').val('');
                          $('#patient_mailing_street_name').val('');
                          $('#patient_mailing_suite_number').val('');
                          $('#patient_mailing_city').val('');
                          $('#patient_mailing_province').val('Ontario');
                          $('#patient_mailing_country').val('Canada');
                          $('#patient_mailing_postal_code').val('');
                          $('#patient_mailing_long').val('');
                          $('#patient_mailing_lat').val('');

                          $('#patient_mailing_street_number').removeAttr('disabled');
                          $('#patient_mailing_street_name').removeAttr('disabled');
                          // $('#patient_mailing_suite_number').removeAttr('disabled');
                          $('#patient_mailing_city').removeAttr('disabled');
                          $('#patient_mailing_province').removeAttr('disabled');
                          $('#patient_mailing_country').removeAttr('disabled');
                          $('#patient_mailing_postal_code').removeAttr('disabled');
                          $('#patient_mailing_long').removeAttr('disabled');
                          $('#patient_mailing_lat').removeAttr('disabled');

                          $('#patient_mailing_address_data').val(' ');
                          $('#cotui-autosuggest_address').val(' ');
                          $('#cotui-autosuggest_address .typeahead__input').val(' ');

                          $('#cotui-autosuggest_address ').addClass('disabled');
                          $('.addressBox').addClass('hidden');

                          // let notEmpty = {
                          //   notEmpty: {
                          //     message: 'Phone number is required and cannot be empty',
                          //     priority: 1
                          //   }
                          // }
                          // formID.enableFieldValidators('patient_phone_number',true,notEmpty);

                        } else {
                          $('#nofixedaddress_option_textElement').addClass('hidden');

                          $('#patient_mailing_street_number').val('');
                          $('#patient_mailing_street_name').val('');
                          $('#patient_mailing_suite_number').val('');
                          $('#patient_mailing_city').val('');
                          $('#patient_mailing_province').val('Ontario');
                          $('#patient_mailing_country').val('Canada');
                          $('#patient_mailing_postal_code').val('');
                          $('#patient_mailing_long').val('');
                          $('#patient_mailing_lat').val('');

                          $('#patient_mailing_street_number').attr('disabled', 'disabled');
                          $('#patient_mailing_street_name').attr('disabled', 'disabled');
                          // $('#patient_mailing_suite_number').attr('disabled','disabled');
                          $('#patient_mailing_city').attr('disabled', 'disabled');
                          $('#patient_mailing_province').attr('disabled', 'disabled');
                          $('#patient_mailing_country').attr('disabled', 'disabled');
                          $('#patient_mailing_postal_code').attr('disabled', 'disabled');
                          $('#patient_mailing_long').attr('disabled', 'disabled');
                          $('#patient_mailing_lat').attr('disabled', 'disabled');

                          $('#patient_mailing_address_data').val('');
                          $('#cotui-autosuggest_address').val('');
                          $('#cotui-autosuggest_address .typeahead__input').val('');

                          $('#cotui-autosuggest_address ').removeClass('disabled');
                          $('.addressBox').removeClass('hidden');

                          // let notEmpty = {
                          //   notEmpty: {
                          //     message: 'Phone number is required and cannot be empty',
                          //     priority: 1
                          //   }
                          // }
                          // formID.enableFieldValidators('patient_phone_number',false,notEmpty);

                        }

                        return true;

                      }
                    }
                  }
                },


                {
                  id: "nofixedaddress_option_text",
                  type: "textarea",
                  title: "Specify any address information:",
                  className: "col-xs-12 col-sm-12 hidden",
                  bindTo: "nofixedaddress_option_text",
                  required: false,
                  disabled: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_mailing_street_number",
                  type: "text",
                  title: "Street Number:",
                  className: "col-xs-12 col-sm-2 addressBox",
                  bindTo: "patient_mailing_street_number",
                  required: true,
                  disabled: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },

                {
                  id: "patient_mailing_street_name",
                  type: "text",
                  title: "Street Name:",
                  className: "col-xs-12 col-sm-8 addressBox",
                  bindTo: "patient_mailing_street_name",
                  required: true,
                  disabled: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },

                {
                  id: "patient_mailing_suite_number",
                  type: "text",
                  title: "Suite / Unit:",
                  className: "col-xs-12 col-sm-2 addressBox",
                  bindTo: "patient_mailing_suite_number",
                  disabled: false,
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_mailing_city",
                  type: "text",
                  title: "City:",
                  className: "col-xs-12 col-sm-4 addressBox",
                  bindTo: "patient_mailing_city",
                  required: true,
                  disabled: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },

                {
                  id: "patient_mailing_province",
                  type: "text",
                  title: "Province:",
                  className: "col-xs-12 col-sm-4 addressBox",
                  bindTo: "patient_mailing_province",
                  required: true,
                  disabled: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },

                {
                  id: "patient_mailing_postal_code",
                  type: "text",
                  title: "Postal Code:",
                  className: "col-xs-12 col-sm-4 addressBox",
                  bindTo: "patient_mailing_postal_code",
                  required: true,
                  disabled: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },

                {
                  id: "patient_mailing_long",
                  type: "text",
                  title: "Long:",
                  className: "col-xs-12 col-sm-4 hidden",
                  bindTo: "patient_mailing_long",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },

                {
                  id: "patient_mailing_lat",
                  type: "text",
                  title: "Lat:",
                  className: "col-xs-12 col-sm-4 hidden",
                  bindTo: "patient_mailing_lat",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_phone_number",
                  type: "phone",
                  title: "Phone Number:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_phone_number",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: phoneFormatText,
                      callback: (value, validator, $field) => {
                        if (phoneFormat.test(value)) {
                          return fixEX(value);
                        } else {
                          return false;
                        }
                      }
                    }
                  }
                },


                {
                  id: "patient_email",
                  type: "email",
                  title: "Email Address:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_email",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


              ]
            }
          ],
        },


        {
          cols: "2",
          id: null,
          title: "Section 2: Reporting Source",
          rows: [
            {
              fields: [

                {
                  id: "reported_date",
                  type: "datetimepicker",
                  title: "Reported Date:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "reported_date",
                  maxlength: 10,
                  options: {
                    format: 'YYYY-MM-DD',
                    maxDate: new moment().format("YYYY-MM-DD"),
                    keepInvalid: true,
                    useStrict: true
                  },
                  htmlAttr: {
                    length: 10
                  },
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  // validators: {
                  //   regexp: {
                  //     regexp: dateFormat,
                  //     message: dateFormatText
                  //   },
                  //   // callback: {
                  //   //   message: charactersNotAllowed,
                  //   //   callback: (value, validator, $field) => {
                  //   //     return fixEX(value);
                  //   //   }
                  //   // }
                  // }
                },

                {
                  id: "reporting_source",
                  type: "dropdown",
                  title: "Reporting Source",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "reporting_source",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  choices: [
                    {
                      value: "Hospital physician / Infection Prevention and Control",
                      text: "Hospital physician / Infection Prevention and Control"
                    },
                    {
                      value: "Assessment Centre",
                      text: "Assessment Centre"
                    },
                    {
                      value: "Physician Office",
                      text: "Physician Office"
                    },
                    {
                      value: "TPH Staff",
                      text: "TPH Staff"
                    },
                    {
                      value: "Other",
                      text: "Other"
                    },
                  ],
                  validators: {
                    callback: {
                      message: "",
                      callback: (value, validator, $field) => {
                        $('#cpso_numberElement').addClass('hidden');
                        $('#reporting_source_otherElement').addClass('hidden');

                        if (value == 'Physician Office') {
                          $('#cpso_numberElement').removeClass('hidden');
                        } else {
                          $('#cpso_numberElement').addClass('hidden');
                          $('#cpso_number').val('');
                        }

                        if (value == 'Other') {
                          $('#reporting_source_otherElement').removeClass('hidden');
                        } else {
                          $('#reporting_source_otherElement').addClass('hidden');
                          $('#reporting_source_other').val('');
                        }

                        return true;
                      }
                    }
                  }
                },


                {
                  id: "reporting_source_other",
                  type: "text",
                  title: "Other Reporting Source:",
                  className: "col-xs-6 col-sm-6 hidden",
                  bindTo: "reporting_source_other",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "cpso_number",
                  type: "text",
                  title: "CPSO Number:",
                  className: "col-xs-6 col-sm-6 hidden",
                  bindTo: "cpso_number",
                  required: false,
                  // maxlength: 6,
                  // htmlAttr: {
                  //     length: 6
                  // },
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: "Alpha characters are not allowed",
                      callback: (value, validator, $field) => {
                        // check if number only
                        let digitOnly = /(\d)$/gi;
                        if (digitOnly.test(value)) {
                          if (value == '') {
                            return true;
                          } else {
                            return fixEX(value)
                          }
                        } else {
                          if (value == '') {
                            return fixEX(value)
                          } else {
                            return false;
                          }
                        }
                      }
                    }
                  }
                },


                {
                  id: "reporting_organization",
                  type: "dropdown",
                  title: "Reporting Organization",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "reporting_organization",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  choices: [
                    {
                      value: "Hospital for Sick Children",
                      text: "Hospital for Sick Children"
                    },
                    {
                      value: "Humber River Hospital",
                      text: "Humber River Hospital"
                    },
                    {
                      value: "Michael Garron Hospital",
                      text: "Michael Garron Hospital"
                    },
                    {
                      value: "Hospital for Sick Children",
                      text: "Hospital for Sick Children"
                    },
                    {
                      value: "Mount Sinai Hospital",
                      text: "Mount Sinai Hospital"
                    },
                    {
                      value: "North York General Hospital",
                      text: "North York General Hospital"
                    },
                    {
                      value: "Scarborough Health Network-Birchmount Hospital",
                      text: "Scarborough Health Network-Birchmount Hospital"
                    },
                    {
                      value: "Scarborough Health Network-Centenary Hospital",
                      text: "Scarborough Health Network-Centenary Hospital"
                    },
                    {
                      value: "Scarborough Health Network-General Hospital",
                      text: "Scarborough Health Network-General Hospital"
                    },
                    {
                      value: "St. Joseph’s Health Centre",
                      text: "St. Joseph’s Health Centre"
                    },
                    {
                      value: "St. Michael’s Hospital",
                      text: "St. Michael’s Hospital"
                    },
                    {
                      value: "Sunnybrook Health Sciences Centre",
                      text: "Sunnybrook Health Sciences Centre"
                    },
                    {
                      value: "Trillium Health Partners",
                      text: "Trillium Health Partners"
                    },
                    {
                      value: "UHN-Princess Margaret Hospital",
                      text: "UHN-Princess Margaret Hospital"
                    },
                    {
                      value: "UHN-Toronto Western Hospital",
                      text: "UHN-Toronto Western Hospital"
                    },
                    {
                      value: "UHN-Toronto General Hospital",
                      text: "UHN-Toronto General Hospital"
                    },
                    {
                      value: "William Osler Health System",
                      text: "William Osler Health System"
                    },
                    {
                      value: "Toronto Public Health",
                      text: "Toronto Public Health"
                    },
                    {
                      value: "Other",
                      text: "Other"
                    },
                  ],
                  validators: {
                    callback: {
                      message: "",
                      callback: (value, validator, $field) => {
                        $('#reporting_organization_otherElement').addClass('hidden');
                        $('#reporting_organization_other').val('');
                        if (value == 'Other') {
                          $('#reporting_organization_otherElement').removeClass('hidden');
                        } else {
                          $('#reporting_organization_otherElement').addClass('hidden');
                          $('#reporting_organization_other').val('');
                        }
                        return true;
                      }
                    }
                  }
                },


                {
                  id: "reporting_organization_other",
                  type: "text",
                  title: "Other Reporting Organization:",
                  className: "col-xs-6 col-sm-6 hidden",
                  bindTo: "reporting_organization_other",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "person_making_the_report",
                  type: "text",
                  title: "Person Making the Report:",
                  className: "col-xs-6 col-sm-6",
                  bindTo: "person_making_the_report",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "reporting_phone_number",
                  type: "phone",
                  title: "Phone Number:",
                  className: "col-xs-6 col-sm-6",
                  bindTo: "reporting_phone_number",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: phoneFormatText,
                      callback: (value, validator, $field) => {
                        if (phoneFormat.test(value)) {
                          return fixEX(value);
                        } else {
                          return false;
                        }
                      }
                    }
                  }
                },

                {
                  id: "reporting_phone_number_extension",
                  type: "text",
                  title: "Extension:",
                  className: "col-xs-6 col-sm-6",
                  bindTo: "reporting_phone_number_extension",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  maxlength: 6,
                  htmlAttr: {
                    length: 6
                  },
                  validators: {
                    callback: {
                      message: phoneExFormatText + ' and up to 6 digits',
                      callback: (value, validator, $field) => {
                        if (phoneExFormat.test(value)) {
                          if (phoneExFormat.length > 6) {
                            return false;
                          } else {
                            if (value == '') {
                              return true;
                            } else {
                              return fixEX(value)
                            }
                          }
                        } else {
                          if (value == '') {
                            return fixEX(value)
                          } else {
                            return false;
                          }
                        }
                      }
                    }
                  }
                },


              ]
            }
          ],
        },

        {
          cols: "2",
          id: null,
          title: "Section 3: Patient Health Information",
          rows: [
            {
              fields: [
                {
                  id: "patient_symptoms",
                  type: "checkbox",
                  title: "Symptoms",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_symptoms",
                  required: true,
                  orientation: 'horizontal',
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  choices: [
                    {
                      value: "Fever",
                      text: "Fever"
                    },
                    {
                      value: "Difficulty Breathing/SOB",
                      text: "Difficulty Breathing/SOB"
                    },
                    {
                      value: "Cough",
                      text: "Cough"
                    },
                    {
                      value: "Fatigue",
                      text: "Fatigue"
                    },
                    {
                      value: "Headache",
                      text: "Headache"
                    },
                    {
                      value: "Sore Throat",
                      text: "Sore Throat"
                    },
                    {
                      value: "Other",
                      text: "Other"
                    },
                  ],
                  validators: {
                    callback: {
                      message: "",
                      callback: (value, validator, $field) => {
                        console.log(value);
                        // $('#patient_symptoms_otherElement').addClass('hidden');
                        // $('#patient_onset_dateElement').addClass('hidden');

                        // if(value==''){
                        //   $('#patient_onset_dateElement').addClass('hidden');
                        // } else{
                        //   $('#patient_onset_dateElement').removeClass('hidden');
                        // }

                        $('#patient_symptoms_otherElement').addClass('hidden');
                        $('#patient_symptoms_other').val('');

                        if ($('#patient_symptoms_0').prop('checked') ||
                          $('#patient_symptoms_1').prop('checked') ||
                          $('#patient_symptoms_2').prop('checked') ||
                          $('#patient_symptoms_3').prop('checked') ||
                          $('#patient_symptoms_4').prop('checked') ||
                          $('#patient_symptoms_5').prop('checked') ||
                          $('#patient_symptoms_6').prop('checked')
                        ) {
                          if ($('#patient_symptoms_6').prop('checked')) {
                            $('#patient_symptoms_otherElement').removeClass('hidden');
                          } else {
                            $('#patient_symptoms_otherElement').addClass('hidden');
                            $('#patient_symptoms_other').val('');
                          }
                          $('#patient_onset_dateElement').removeClass('hidden');
                        } else {
                          $('#patient_onset_dateElement').addClass('hidden');
                          $('#patient_onset_date').val('');
                        }


                        // if(value=='Other'){
                        //   $('#patient_symptoms_otherElement').removeClass('hidden');
                        // } else{
                        //   $('#patient_symptoms_otherElement').addClass('hidden');
                        // }

                        return true;
                      }
                    }
                  }
                },


                {
                  id: "patient_onset_date",
                  type: "datetimepicker",
                  title: "Earliest Symptoms Onset Date:",
                  className: "col-xs-12 col-sm-6 hidden",
                  bindTo: "patient_onset_date",
                  maxlength: 10,
                  options: {
                    format: 'YYYY-MM-DD',
                    maxDate: new moment().format("YYYY-MM-DD"),
                    keepInvalid: true,
                    useStrict: true
                  },
                  htmlAttr: {
                    length: 10
                  },
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  // validators: {
                  //   regexp: {
                  //     regexp: dateFormat,
                  //     message: dateFormatText
                  //   },
                  //   // callback: {
                  //   //   message: charactersNotAllowed,
                  //   //   callback: (value, validator, $field) => {
                  //   //     return fixEX(value);
                  //   //   }
                  //   // }
                  // }
                },


                {
                  id: "patient_symptoms_other",
                  type: "textarea",
                  title: "Other Symptoms:",
                  className: "col-xs-12 col-sm-12 hidden",
                  bindTo: "patient_symptoms_other",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_exposures",
                  type: "checkbox",
                  title: "Exposures",
                  className: "col-xs-12 col-sm-12",
                  bindTo: "patient_exposures",
                  // orientation: 'horizontal',
                  required: true,
                  infohelp: null,
                  prehelptext: 'past 14 days prior to onset',
                  placeholder: null,
                  choices: [
                    {
                      value: "Travel to an affected country",
                      text: "Travel to an affected country"
                    },
                    {
                      value: "Travel to another country",
                      text: "Travel to another country"
                    },
                    {
                      value: "Was on a cruise ship",
                      text: "Was on a cruise ship"
                    },
                    {
                      value: "Have close contact with a confirmed or probable case of COVID-19",
                      text: "Have close contact with a confirmed or probable case of COVID-19"
                    },
                    {
                      value: "Have close contact with a person with acute respiratory illness who has been to an affected area* within 14 days prior to their illness onset",
                      text: "Have close contact with a person with acute respiratory illness who has been to an affected area* within 14 days prior to their illness onset"
                    },
                    {
                      value: "Have laboratory exposure to biological material (e.g. primary clinical specimens, virus culture isolates) known to contain COVID-19",
                      text: "Have laboratory exposure to biological material (e.g. primary clinical specimens, virus culture isolates) known to contain COVID-19"
                    },
                    {
                      value: "Other",
                      text: "Other"
                    },
                  ],
                  validators: {
                    callback: {
                      message: "",
                      callback: (value, validator, $field) => {
                        //console.log(value);

                        // $('#patient_exposures_otherElement').addClass('hidden');
                        // $('#patient_travel_affected_areaElement').addClass('hidden');
                        // $('#patient_travel_otherElement').addClass('hidden');

                        // if(value=='Other'){
                        //   $('#patient_exposures_otherElement').removeClass('hidden');
                        // } else{
                        //   $('#patient_exposures_otherElement').addClass('hidden');
                        // }

                        // if(value=='Travel to an affected area'){
                        //   $('#patient_travel_affected_areaElement').removeClass('hidden');
                        // } else{
                        //   $('#patient_travel_affected_areaElement').addClass('hidden');
                        // }

                        // if(value=='Travel to another country'){
                        //   $('#patient_travel_otherElement').removeClass('hidden');
                        // } else{
                        //   $('#patient_travel_otherElement').addClass('hidden');
                        // }


                        if ($('#patient_exposures_0').prop('checked')) {
                          $('#patient_travel_affected_areaElement').removeClass('hidden');
                        } else {
                          $('#patient_travel_affected_areaElement').addClass('hidden');
                          $('#patient_travel_affected_area').val('');
                        }

                        if ($('#patient_exposures_1').prop('checked')) {
                          $('#patient_travel_otherElement').removeClass('hidden');
                        } else {
                          $('#patient_travel_otherElement').addClass('hidden');
                          $('#patient_travel_other').val('');
                        }

                        if ($('#patient_exposures_6').prop('checked')) {
                          $('#patient_exposures_otherElement').removeClass('hidden');
                        } else {
                          $('#patient_exposures_otherElement').addClass('hidden');
                          $('#patient_exposures_other').val('');
                        }

                        return true;
                      }
                    }
                  }
                },


                {
                  id: "patient_travel_affected_area",
                  type: "dropdown",
                  title: "Please select travel affected country:",
                  className: "col-xs-12 col-sm-6 hidden",
                  bindTo: "patient_travel_affected_area",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  choices: [
                    {
                      value: "China",
                      text: "China"
                    },
                    {
                      value: "Iran",
                      text: "Iran"
                    },
                    {
                      value: "Italy",
                      text: "Italy"
                    },
                    {
                      value: "South Korea",
                      text: "South Korea"
                    },
                    {
                      value: "USA",
                      text: "USA"
                    },
                  ],
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        // $('#patient_travel_affected_otherElement').addClass('hidden');
                        // $('#patient_travel_affected_other').val('');

                        // if($('#patient_travel_affected_area').val()=='Other'){
                        //   $('#patient_travel_affected_otherElement').removeClass('hidden');
                        // } else{
                        //   $('#patient_travel_affected_otherElement').addClass('hidden');
                        // }

                        return true;
                      }
                    }
                  }
                },


                // {
                //   id: "patient_travel_affected_other",
                //   type: "textarea",
                //   title: "Please specify another travel affected area:",
                //   className: "col-xs-12 col-sm-6 hidden",
                //   bindTo: "patient_travel_affected_other",
                //   required: true,
                //   infohelp: null,
                //   posthelptext: null,
                //   placeholder: null,
                //   validators: {
                //     callback: {
                //       message: charactersNotAllowed,
                //       callback: (value, validator, $field) => {
                //         return fixEX(value)
                //       }
                //     }
                //   }
                // },


                {
                  id: "patient_travel_other",
                  type: "textarea",
                  title: "Please specify another country:",
                  className: "col-xs-12 col-sm-6 hidden",
                  bindTo: "patient_travel_other",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_exposures_other",
                  type: "textarea",
                  title: "Other Exposures:",
                  className: "col-xs-12 col-sm-12 hidden",
                  bindTo: "patient_exposures_other",
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_specimens_collected",
                  type: "checkbox",
                  title: "Specimens Collected",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_specimens_collected",
                  orientation: 'horizontal',
                  required: true,
                  infohelp: null,
                  // prehelptext: 'past 14 days prior to onset',
                  placeholder: null,
                  choices: [
                    {
                      value: "Throat swab",
                      text: "Throat swab"
                    },
                    {
                      value: "Nasopharyngeal Swab",
                      text: "Nasopharyngeal Swab"
                    },
                    // {
                    //     value: "Other",
                    //     text: "Other"
                    // },
                  ],
                  validators: {
                    callback: {
                      message: "",
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                      //callback: (value, validator, $field) => {
                      // if(value=='Other'){
                      //   $('#patient_specimens_collected_other').show();
                      // } else{
                      //   $('#patient_specimens_collected_other').hide();
                      // }
                      //return true;
                      //}
                    }
                  }
                },


                // {
                //   id: "patient_specimens_collected_other",
                //   type: "text",
                //   title: "Other Specimens:",
                //   className: "col-xs-12 col-sm-12 hidden",
                //   bindTo: "patient_specimens_collected_other",
                //   required: true,
                //   infohelp: null,
                //   posthelptext: null,
                //   placeholder: null,
                //   validators: {
                //     callback: {
                //       message: charactersNotAllowed,
                //       callback: (value, validator, $field) => {
                //         return fixEX(value)
                //       }
                //     }
                //   }
                // },


                {
                  id: "patient_specimen_collection_date",
                  type: "datetimepicker",
                  title: "Specimen Collection Date:",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_specimen_collection_date",
                  maxlength: 10,
                  options: {
                    format: 'YYYY-MM-DD',
                    maxDate: new moment().format("YYYY-MM-DD"),
                    keepInvalid: true,
                    useStrict: true
                  },
                  htmlAttr: {
                    length: 10
                  },
                  required: true,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  // validators: {
                  //   regexp: {
                  //     regexp: dateFormat,
                  //     message: dateFormatText
                  //   },
                  //   // callback: {
                  //   //   message: charactersNotAllowed,
                  //   //   callback: (value, validator, $field) => {
                  //   //     return fixEX(value);
                  //   //   }
                  //   // }
                  // }
                },


                {
                  id: "patient_hospital_told_patient_to_selfisolate",
                  type: "radio",
                  title: "Healthcare Provider / Organization told patient to self-isolate?",
                  className: "col-xs-12 col-sm-6",
                  bindTo: "patient_hospital_told_patient_to_selfisolate",
                  required: true,
                  orientation: 'horizontal',
                  infohelp: null,
                  // prehelptext: 'past 14 days prior to onset',
                  placeholder: null,
                  choices: [
                    {
                      value: "Yes",
                      text: "Yes"
                    },
                    {
                      value: "No",
                      text: "No"
                    },
                  ],
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "patient_lab_results",
                  type: "checkbox",
                  title: "Patient Health Status",
                  className: "col-xs-12 col-sm-12",
                  bindTo: "patient_lab_results",
                  required: true,
                  // orientation: 'horizontal',
                  infohelp: null,
                  // prehelptext: 'past 14 days prior to onset',
                  placeholder: null,
                  choices: [
                    {
                      value: "Hospitalized",
                      text: "Hospitalized"
                    },
                    {
                      value: "non-ICU (connect with Infection Prevention & Control to ensure appropriate precautions are in place)",
                      text: "non-ICU (connect with Infection Prevention & Control to ensure appropriate precautions are in place)"
                    },
                    {
                      value: "Admitted to ICU (connect with Infection Prevention & Control to ensure appropriate precautions are in place)",
                      text: "Admitted to ICU (connect with Infection Prevention & Control to ensure appropriate precautions are in place)"
                    },
                    {
                      value: "ED Visit only and discharged",
                      text: "ED Visit only and discharged"
                    },
                    {
                      value: "Currently in the ED (if being discharged please advise to self isolate)",
                      text: "Currently in the ED (if being discharged please advise to self isolate)"
                    },
                    {
                      value: "Deceased",
                      text: "Deceased"
                    },
                    {
                      value: "Other",
                      text: "Other"
                    },
                  ],
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        $('#patient_lab_results_otherElement').addClass('hidden');
                        $('#patient_lab_results_other').val('');

                        if ($('#patient_lab_results_6').prop('checked')) {
                          $('#patient_lab_results_otherElement').removeClass('hidden');
                        } else {
                          $('#patient_lab_results_otherElement').addClass('hidden');
                          $('#patient_lab_results_other').val('');
                        }

                        return true;
                      }
                    }
                  }
                },


                {
                  id: "patient_lab_results_other",
                  type: "textarea",
                  title: "Other Patient Health Status",
                  className: "col-xs-12 col-sm-6 hidden",
                  bindTo: "patient_lab_results_other",
                  required: true,
                  orientation: 'horizontal',
                  infohelp: null,
                  // prehelptext: 'past 14 days prior to onset',
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


                {
                  id: "comments",
                  type: "textarea",
                  title: "Comments:",
                  className: "col-xs-12 col-sm-12",
                  bindTo: "comments",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  validators: {
                    callback: {
                      message: charactersNotAllowed,
                      callback: (value, validator, $field) => {
                        return fixEX(value)
                      }
                    }
                  }
                },


              ]
            }
          ],
        },


        /*
                  {
                    cols: "2",
                    id: null,
                    title: "Section 4 - Public Health Actions",
                    rows: [
                      {
                        fields: [

                          {
                              id: "cores_unique_id",
                              type: "text",
                              title: "CORES Unique ID",
                              className: "col-xs-12 col-sm-12 hidden",
                              bindTo: "cores_unique_id",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                          {
                              id: "patient_advised_selfmonitor_selfisolate",
                              type: "checkbox",
                              title: "Patient advised to self-monitor or self-isolate",
                              className: "col-xs-12 col-sm-6",
                              bindTo: "patient_advised_selfmonitor_selfisolate",
                              orientation: 'horizontal',
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Yes",
                                      text: "Yes"
                                  },
                                  {
                                      value: "No",
                                      text: "No"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                          {
                              id: "public_health_actions_lab_findings_shared_with_client",
                              type: "checkbox",
                              title: "Lab findings shared with client",
                              className: "col-xs-12 col-sm-6",
                              bindTo: "public_health_actions_lab_findings_shared_with_client",
                              required: true,
                              infohelp: null,
                              orientation: 'horizontal',
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Yes",
                                      text: "Yes"
                                  },
                                  {
                                      value: "No",
                                      text: "No"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },



                          {
                              id: "client_advised_isolation_no_longer_needed",
                              type: "checkbox",
                              title: "Client advised isolation no longer needed",
                              className: "col-xs-12 col-sm-6",
                              bindTo: "client_advised_isolation_no_longer_needed",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              orientation: 'horizontal',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Yes",
                                      text: "Yes"
                                  },
                                  {
                                      value: "No",
                                      text: "No"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "clearance_letter_sent",
                              type: "checkbox",
                              title: "Clearance letter sent",
                              className: "col-xs-12 col-sm-6",
                              bindTo: "clearance_letter_sent",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              orientation: 'horizontal',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Yes",
                                      text: "Yes"
                                  },
                                  {
                                      value: "No",
                                      text: "No"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "case_status",
                              type: "dropdown",
                              title: "Case Status",
                              className: "col-xs-12 col-sm-6",
                              bindTo: "case_status",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Open",
                                      text: "Open"
                                  },
                                  {
                                      value: "Closed",
                                      text: "Closed"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "case_classification",
                              type: "dropdown",
                              title: "Case Classification",
                              className: "col-xs-12 col-sm-6",
                              bindTo: "case_classification",
                              required: false,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "PUI",
                                      text: "PUI"
                                  },
                                  {
                                      value: "DNM",
                                      text: "DNM"
                                  },
                                  {
                                      value: "Became a Case",
                                      text: "Became a Case"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "iphis_exposure_name",
                              type: "text",
                              title: "iPHIS Exposure Name",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "iphis_exposure_name",
                              required: false,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "iphis_exposure_id",
                              type: "text",
                              title: "iPHIS Exposure ID",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "iphis_exposure_id",
                              required: false,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    if(fixEX(value)){
                                      if(/^\d+$/.test(value)){
                                        return true;
                                      } else{
                                        if(value==''){
                                          return true;
                                        } else{
                                          return false;
                                        }
                                      }
                                    } else{
                                      return false;
                                    }
                                  }
                                }
                              }
                          },


                          {
                              id: "iphis_case_id",
                              type: "text",
                              title: "iPHIS Case ID",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "iphis_case_id",
                              required: false,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "priority",
                              type: "text",
                              title: "Priority",
                              className: "col-xs-12 col-sm-12 hidden",
                              bindTo: "priority",
                              required: false,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                          {
                              id: "public_health_actions_screen_notes",
                              type: "textarea",
                              title: "Notes",
                              className: "col-xs-12 col-sm-12",
                              bindTo: "public_health_actions_screen_notes",
                              required: false,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                        ]
                      }
                    ]
                  },

                  {
                    cols: "2",
                    id: null,
                    title: "Section 5 - Client Call in Details",
                    rows: [
                      {
                        fields: [

                          {
                              id: "date_client_called_hotline",
                              type: "datetimepicker",
                              title: "Date client called hotline",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "date_client_called_hotline",
                              orientation: "horizontal",
                              maxlength: 10,
                              options: {
                                format: 'YYYY-MM-DD',
                                maxDate: new moment().format("YYYY-MM-DD"),
                                keepInvalid: true,
                                useStrict: true
                              },
                              htmlAttr: {
                                  length: 10
                              },
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                          {
                              id: "client_identity_validation_method",
                              type: "dropdown",
                              title: "Client identity validation method",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "client_identity_validation_method",
                              orientation: "horizontal",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "OHCN",
                                      text: "OHCN"
                                  },
                                  {
                                      value: "Assessment Centre Code",
                                      text: "Assessment Centre Code"
                                  },
                                  {
                                      value: "OLI",
                                      text: "OLI"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                          {
                              id: "olis_lookup_for_this_client",
                              type: "checkbox",
                              title: "OLIS Look-up for this client",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "olis_lookup_for_this_client",
                              orientation: "horizontal",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Yes",
                                      text: "Yes"
                                  },
                                  {
                                      value: "No",
                                      text: "No"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },



                          {
                              id: "olis_lookup_results",
                              type: "dropdown",
                              title: "OLID Loop-up results",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "olis_lookup_results",
                              orientation: "horizontal",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "COVID-19 Detected",
                                      text: "COVID-19 Detected"
                                  },
                                  {
                                      value: "COVID-19 Not Detected",
                                      text: "COVID-19 Not Detected"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "client_call_in_details_lab_findings_shared_with_client",
                              type: "checkbox",
                              title: "Lab findings shared with client",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "client_call_in_details_lab_findings_shared_with_client",
                              orientation: "horizontal",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Yes",
                                      text: "Yes"
                                  },
                                  {
                                      value: "No",
                                      text: "No"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },


                          {
                              id: "hotline_operator_name",
                              type: "dropdown",
                              title: "Hotline Operator Name",
                              className: "col-xs-12 col-sm-4",
                              bindTo: "hotline_operator_name",
                              orientation: "horizontal",
                              required: true,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              choices: [
                                  {
                                      value: "Name",
                                      text: "Name"
                                  },
                                  {
                                      value: "Name",
                                      text: "Name"
                                  },
                              ],
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                          {
                              id: "client_call_detail_screen_notes",
                              type: "textarea",
                              title: "Notes",
                              className: "col-xs-12 col-sm-12",
                              bindTo: "client_call_detail_screen_notes",
                              required: false,
                              infohelp: null,
                              // prehelptext: 'past 14 days prior to onset',
                              placeholder: null,
                              validators: {
                                callback: {
                                  message: charactersNotAllowed,
                                  callback: (value, validator, $field) => {
                                    return fixEX(value)
                                  }
                                }
                              }
                          },

                        ]
                      }
                    ]
                  },

        */

        // {
        //     cols: "2",
        //     id: "uploads",
        //     className: "panel-default hidden",
        //     title: "Attachments",
        //     rows: [
        //       {
        //         fields:
        //         [
        //           {
        //             id: 'uploadInfoText',
        //             type: 'html',
        //             class: 'col-xs-12',
        //             html: this.uploadInfoText(),
        //           },

        //           {
        //             id: "supportingDocuments",
        //             title: 'Choose Files',
        //             type: 'dropzone',
        //             class: 'col-xs-12',
        //             bindTo: 'supportingDocuments',
        //             required: false,
        //             htmlAttr: {
        //               length: totalCharacters
        //             },

        //             //posthelptext: 'post help text',
        //             //prehelptext: 'pre help text',

        //             use_recaptcha: true,
        //             recaptcha_sitekey: '/* @echo RECAPTCHA_SITEKEY */',
        //             uploadCondition: function() {
        //               // console.log('UPLOAD CONDITION');
        //               if(cannotSubmit){
        //                 return false;
        //               }

        //               if(currentStep<=5){
        //                 return false;
        //               }

        //               if($('#covid19_container_form').data('formValidation').$invalidFields.length>0){
        //                 return false;
        //               }

        //               // console.log('TRUE');
        //               if(currentStep == 6){
        //                 return true;
        //               } else {
        //                 return false;
        //               }

        //             },


        //             options: {
        //               url: '/*@echo UPLOAD_API*/',
        //               acceptedFiles: 'application/pdf,.pdf,pdf,*.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx,*.doc,*.docx,application/zip',
        //               timeout: 180000,
        //               maxFiles: 8,
        //               maxFilesize: 20,
        //               // autoProcessQueue: false,
        //               allowFormsubmitionWithUploadError: true,
        //               selector: '#cotDropzoneClass2',

        //               init(){
        //                 remainingUploadSize = totalUploadSizeLimit;
        //                 dz_uploader = this;

        //                 this.on("addedfile", function(file) {
        //                   //console.log("added", file);

        //                   var $textDescription = $(file.previewElement).find('textarea')[0]
        //                   var $textDescriptionID = $($textDescription).attr('id')

        //                   $($textDescription).attr('length',totalCharacters);
        //                   // $($textDescription).after('<div class="label label-default totalCharacters"><span class="charactercount_'+$($textDescription).attr('id')+'">'+totalCharacters+'</span> chars remaining</div>');
        //                   $($textDescription).after('<div class="label label-default totalCharacters"><span class="charactercount_'+$($textDescription).attr('id')+'">'+totalCharacters+'</span> characters remaining</div>');
        //                   $($textDescription).on("keyup",function(event){
        //                     checkTextAreaMaxLength(this,event);
        //                   });

        //                   remainingUploadSize -= file.size;

        //                   if (this.files.length >= this.options.maxFiles) {
        //                     $(".btn-addFiles").attr("disabled", "true");
        //                   }

        //                   if (remainingUploadSize <= 0) {
        //                     file.status = Dropzone.CANCELED;
        //                     file.sizeTooLarge = true;
        //                     this._errorProcessing([file],  "You have exceeded the attachment size limit of 20MB. Please remove one or more files.", null);
        //                   }

        //                 });

        //                 this.on("removedfile", function(file) {
        //                   remainingUploadSize += file.size;

        //                   // RE-add files
        //                   var dropzoneFilesCopy = this.files;
        //                   this.removeAllFiles();
        //                   let that = this;
        //                   $.each(dropzoneFilesCopy, function(_, file) {
        //                       file.status = undefined;
        //                       file.accepted = undefined;
        //                       file.isExcess = false;
        //                       that.addFile(file);
        //                   });

        //                   if (this.files.length < this.options.maxFiles) {
        //                     $(".btn-addFiles").removeAttr("disabled");
        //                   }
        //                 });

        //                 this.on("error", function(file, errorMessage, xhr) {
        //                   if (xhr != null) {
        //                     $('.submitBox').removeAttr('disabled');

        //                     $('#covid19_container').before(`
        //                       <div id="submitFileUploadError" tabindex="-1">
        //                         <div class="">
        //                           <div class="alert alert-danger">
        //                           We cannot submit your submission at this time. There was an error with file upload, please review this error and try again.
        //                           </div>
        //                         </div>
        //                       </div>
        //                     `);
        //                     $("#submitFileUploadError").focus();
        //                     window.scrollTo(0,0);
        //                   }
        //                 });
        //               },
        //               accept: function(file, done) {
        //                 //console.debug('totalSizeLimit', totalUploadSizeLimit)
        //                 //console.debug('remainingUploadSize', remainingUploadSize)

        //                 if (remainingUploadSize <= 0) {
        //                   file.status = Dropzone.CANCELED;
        //                   file.sizeTooLarge = true;
        //                   this._errorProcessing([file],  "You have exceeded the attachment size limit of 20MB. Please remove one or more files.", null);
        //                 }else {
        //                   done();
        //                 }
        //               },
        //               chunksUploaded:function(file,done){
        //                 uploadedFiles.push({filenane: file.name , status: true})
        //               },
        //               fields: [
        //               /*
        //                 {
        //                   name: 'text01',
        //                   title: 'Text Field',
        //                   type: 'text',
        //                   prehelptext: 'Help text',
        //                   posthelptext: 'Help text'
        //                 },
        //               */
        //                 {
        //                   name: 'fileType',
        //                   title: 'Attachment Type',
        //                   type: 'dropdown',
        //                   choices: [
        //                     {text: 'Document', value: 'document'},
        //                     {text: 'Certification', value: 'certification'},
        //                     {text: 'Result', value: 'result'},
        //                     {text: 'Other', value: 'other'}
        //                   ],
        //                   //prehelptext: 'Help text',
        //                   //posthelptext: 'Help text'
        //                 },
        //                 {
        //                   name: 'fileDescription',
        //                   title: 'Attachment Description',
        //                   type: 'textarea',
        //                   //prehelptext: 'Help text',
        //                   //posthelptext: 'Help text'
        //                 }
        //               ],
        //               getFieldsTemplate() {
        //                 const getFieldTemplate = (field) => {
        //                     if (field == null) {
        //                         return '';
        //                     }
        //                     let fieldString;
        //                     switch (field.type) {
        //                         case 'dropdown':
        //                             fieldString = /* html */ `<select title="${field.title}" aria-required="${field.required === true ? 'true' : 'false'}" class="form-control${field.required === true ? ' required' : ''}" placeholder="${field.placeholder || ''}" row="${field.row || ''}" col="${field.col || ''}">${(field.choices || []).map((choice) => `<option value="${choice.value}">${choice.text}</option>`)}</select>`;
        //                             break;
        //                         case 'textarea':
        //                             fieldString = /* html */ `<textarea title="${field.title}" aria-required="${field.required === true ? 'true' : 'false'}" class="form-control${field.required === true ? ' required' : ''}" placeholder="${field.placeholder || ''}" row="${field.row || ''}" col="${field.col || ''}"></textarea>`;
        //                             break;
        //                         default:
        //                             fieldString = /* html */ `<input title="${field.title}" type="${field.type || 'text'}" aria-required="${field.required === true ? 'true' : 'false'}" class="form-control${field.required === true ? ' required' : ''}" placeholder="${field.placeholder || ''}"></input>`;
        //                     }
        //                     return /* html */ `
        //                     <div class="row">
        //                       <div data-name="${field.name}" class="col-xs-12 form-group form-group-vertical has-feedback">
        //                         <div>
        //                           <label class="control-label">
        //                             <span>${field.title}</span>
        //                             ${field.required !== true ? '<span class="optional">(optional)</span>' : ''}
        //                           </label>
        //                           ${field.prehelptext != null ? '<p class="helptext prehelptext">' + field.prehelptext + '</p>' : ''}
        //                           <div class="entryField">
        //                             ${fieldString}
        //                           </div>
        //                           ${field.posthelptext != null ? '<p class="helptext posthelptext">' + field.posthelptext + '</p>' : ''}
        //                         </div>
        //                       </div>
        //                     </div>
        //                   `;
        //                 }
        //                 // Add fields to preview template.
        //                 if (this.options.fields == null) {
        //                     this.options.fields = [];
        //                 }
        //                 let template = '';
        //                 this.options.fields.forEach((field) => {
        //                     template = template + getFieldTemplate(field);
        //                 });
        //                 return template;
        //               },
        //               setFieldsTemplate(file, row) {
        //                 const setFieldTemplate = (field) => {
        //                     const name = `${field.name || field.id}_${row}`;
        //                     const formGroup = file.previewElement.querySelector(`[data-name="${field.name || field.id}"]`);
        //                     console.log(formGroup);
        //                     formGroup.setAttribute('id', `${name}Element`);
        //                     formGroup.getElementsByTagName('label')[0].setAttribute('for', name);
        //                     const describedBy = [];
        //                     if (field.prehelptext != null) {
        //                         const id = `prehelptext_${name}`;
        //                         formGroup.querySelector('.prehelptext').setAttribute('id', id);
        //                         describedBy.push(id)
        //                     }
        //                     if (field.posthelptext != null) {
        //                         const id = `posthelptext_${name}`;
        //                         formGroup.querySelector('.posthelptext').setAttribute('id', id);
        //                         describedBy.push(id)
        //                     }
        //                     let element;
        //                     switch (field.type) {
        //                         case 'dropdown':
        //                             element = formGroup.getElementsByTagName('select')[0];
        //                             break;
        //                         case 'textarea':
        //                             element = formGroup.getElementsByTagName('textarea')[0];
        //                             break;
        //                         default:
        //                             element = formGroup.getElementsByTagName('input')[0];
        //                     }
        //                     element.setAttribute('id', name);
        //                     element.setAttribute('name', name);
        //                     if (describedBy.length > 0) {
        //                         element.setAttribute('aria-describedby', describedBy.join(' '));
        //                     }
        //                     if (fv) {
        //                         const elementValidator = field.validator || {};
        //                         if (field.required) {
        //                             elementValidator.notEmpty = {
        //                                 message: field.title + ' is required.'
        //                             };
        //                         }
        //                         fv.addField(name, { validators: elementValidator });
        //                     }
        //                     if (file.fields[field.name] == null) {
        //                         // file.fields[field.name] = null;
        //                     } else {
        //                         element.value = file.fields[field.name];
        //                     }
        //                     $(element).change((event) => {
        //                         if (event.currentTarget.value != null && event.currentTarget.value != '') {
        //                             file.fields[field.name] = event.currentTarget.value;
        //                         } else {
        //                             delete file.fields[field.name];
        //                         }
        //                         if (this.options.onFieldChange != null) {
        //                             this.options.onFieldChange(file, this.files);
        //                         }
        //                     });
        //                 }
        //                 let fv;
        //                 const $form = $(file.previewElement).closest('form');
        //                 if ($form.length > 0) {
        //                     fv = $form.data('formValidation');
        //                 }
        //                 this.options.fields = this.options.fields || [];
        //                 this.options.fields.forEach((field) => {
        //                     setFieldTemplate(field);
        //                 });
        //               }
        //             }
        //           }
        //         ]
        //       }
        //     ],
        // },

        {
          id: "summaryBox",
          title: "Review Submission Information",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'reviewHTML',
                  type: 'html',
                  html: this.summaryHTML()
                }
              ]
            }
          ]
        }

        /*
        {
          id: "submitBox",
          title: "Ready to submit?",
          className: 'submitBOX panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'submit_button',
                  type: 'button',
                  btnClass: 'primary btn-lg', //optional, only applies when type=button, defaults to 'success', determines the bootstrap btn-x class used to style the button, valid values are here: http://getbootstrap.com/css/#buttons-options
                  // glyphicon: 'glyphicon-thumbs-up',
                  title: 'Submit',
                  onclick: function(){ //optional, when type=button this specifies an onclick function
                    $(formHtmlIdHash).data('formValidation').validate(); //attempt form submission, if validation is successful, the success event is called
                    return false;
                  }
                }
              ]
            }
          ]
        }
        */

      ]
    }

    return formDef;
  }

}



