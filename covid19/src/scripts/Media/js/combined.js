/**
 * @method getSubmissionSections(form_id)
 * @param form_id {string} - the entity set/collection name
 * @return JSON
 * Returns a cot_form sections array defining the form
 */
let autoSave;
const getSubmissionSections = (form_id, data) => {

  let sections, model, registerFormEvents, registerDataLoadEvents, registerOnSaveEvents, registerPostSaveEvents,
    registerPostErrorEvents, success, defaults = {};
  switch (form_id) {
    case 'Media':
      var editor = void 0;
      sections = [{
        "id": "adminSection",
        "title": "Reference Data",
        "rows": [{
          fields: [{id: "id", bindTo: "id", title: "File Name", disabled: true, required: true}, {
            id: "__ContentType",
            bindTo: "__ContentType",
            title: "Content Type",
            disabled: true,
            required: true
          }, {
            id: "updateMedia", type: "button", title: "Update",
            onclick: function onclick() {
              updateMedia();
            }
          }]
        }, {
          fields: [{
            "id": "ace_editor",
            "type": "html",
            "html": "<div style=\"height:1500px;top: 0;right: 0;bottom: 0;left: 0;\" id=\"myAceEditor\"></div>"
          }]
        }]
      }];
      model = new CotModel({"id": "", "__ContentType": ""});
      registerFormEvents = (data) => {

        editor = ace.edit("myAceEditor");
        editor.setTheme("ace/theme/monokai");
        var dataType = "text";
        if (data.__ContentType === "application/javascript") {
          dataType = "text";
        } else {
        }

        $.ajax({
          "type": "GET",
          "dataType": dataType,
          "headers": {
            "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
            "Cache-Control": "no-cache"
          },
          "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/Media('" + data.id + "')/$value"
        }).success(function (result, status, xhr) {

          var mode = "";

          switch (xhr.getResponseHeader("content-type").split(",")[0]) {
            case "application/javascript":
              mode = "ace/mode/javascript";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "application/json":
              mode = "ace/mode/json";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/css":
              mode = "ace/mode/css";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/html":
              mode = "ace/mode/html";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/plain":
              mode = "ace/mode/text";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
          }
          if (mode != "") {
          } else {
          }
        }).error(function (e) {
          console.warn("error", e);
        });
      };

      const updateMedia = () => {

        var entitySet = "Media";
        var name = data.id;
        var contentType = data.__ContentType;
        var media = editor.getValue();
        var sid = Cookies.get(config.default_repo + ".sid");
        var base = config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/";

        // ADD MEDIA
        function step3(entitySet, name, contentType, media, sid) {
          var defer = $.Deferred();

          contentType = contentType !== 'application/json' ? contentType : 'text/plain';

          var ajaxSetting = {
            contentType: contentType,
            data: media,
            method: 'PUT',
            url: base + entitySet + '(\'' + name + '\')/$value'
          };
          if (sid) {
            ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid};
          }

          $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
            defer.resolve(data, textStatus, jqXHR);
          }, function (jqXHR, textStatus, errorThrown) {
            defer.reject(jqXHR, textStatus, errorThrown);
          });

          return defer.promise();
        }

        // CLEAN UP IF NEEDED
        function step4(entitySet, name, contentType, media, sid) {
          var defer = $.Deferred();

          if (contentType === 'application/json') {
            var ajaxSetting = {
              contentType: contentType,
              data: JSON.stringify({
                '@odata.mediaContentType': contentType,
                __ContentType: contentType,
                id: name
              }),
              method: 'PUT',
              url: base + entitySet + '(\'' + name + '\')'
            };
            if (sid) {
              ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid};
            }

            $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
              defer.resolve(data, textStatus, jqXHR);
            }, function (jqXHR, textStatus, errorThrown) {
              defer.reject(jqXHR, textStatus, errorThrown);
            });
          } else {
            defer.resolve();
          }

          return defer.promise();
        }

        var defer = $.Deferred();
        step3(entitySet, name, contentType, media, sid).then(function (data, textStatus, jqXHR) {

          step4(entitySet, name, contentType, media, sid).then(function (data, textStatus, jqXHR) {

            defer.resolve(data, textStatus, jqXHR);
            hasher.setHash(entitySet + "/" + name + "/?ts=" + new Date().getTime());
          });
        });
      };

      break;
    case 'submissions':

      sections = [
        {
          id: "admin_information",
          title: "",
          className: 'example-form-section panel-default',
          rows: [
            {
              fields: [
                {
                  id: "tabs_container",
                  type: "html",
                  html: `
           <div aria-live="polite" role="status" class="sr-only"></div>
           <div class="row">
        <div class="row">
          <div class="pull-right" id="current_info_section"></div>
        </div>
           </div>
`
                }
              ]
            },
            {
              fields: [
                {
                  id: 'status',
                  title: 'Submission Status',
                  type: 'dropdown',
                  className: 'col-xs-4 hidden',
                  required: true,
                  choices: config.choices.status,
                  bindTo: 'status'
                }
              ]
            }
          ]
        },
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
                  prehelptext: null,
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
                  className: "col-xs-12 col-sm-8",
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
                  title: "Address Exception:",
                  className: "col-xs-12 col-sm-4",
                  bindTo: "nofixedaddress_option",
                  orientation: "horizontal",
                  required: false,
                  infohelp: null,
                  posthelptext: null,
                  placeholder: null,
                  choices: [
                    {
                      value: "Yes",
                      text: "No Fixed Address"
                    },
                    {
                      value: "No",
                      text: "Resides outside Toronto"
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
                          //$('.addressBox').addClass('hidden');

                        }
                        else {
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
        {
          cols: "2",
          id: null,
          title: "Section 4 - Client Call in Details",
          rows: [
            {
              fields:[
                {
                  id:"add_new_contact",
                  type:"button",
                  title:"Add New Client Interaction",
                  addclass:"add_new_contact"
                }
              ]
            },
            {
              fields:[
                {
                  id:"client_contact_container",
                  type:"html",
                  html:`
                     <table id="newContactTable" class="display" style="width:100%">
                              <thead>
                              <tr>
                                <th>Actions</th>
                                <th>Date</th>
                                <th>OLIS Look-up</th>
                                <th>Lab Results</th>
                                <th>Shared Results</th>
                                <th>Self Monitor</th>
                                <th>Self Isolate</th>
                                <th>Isolation Not Required</th>
                                <th>Edu. Info Provided</th>
                                <th>Notes</th>
                              </tr>
                              </thead>
                              <tbody>
                              </tbody>
                            </table>
                  `
                }
              ]
            }
          ]
        },
        {
          cols: "2",
          id: null,
          title: "Section 5 - Public Health Actions",
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
                  callback: function callback(value, validator, $field) {
                    return fixEX(value);
                  }
                }
              }
            },
              {
                id: "client_requests_lab_results",
                type: "radio",
                title: "Client requested copy of lab results",
                className: "col-xs-12 col-sm-6",
                bindTo: "client_requests_lab_results",
                required: true,
                infohelp: null,
                // prehelptext: 'past 14 days prior to onset',
                orientation: 'horizontal',
                placeholder: null,
                choices: config.choices.yesNo,
                validators: {
                  callback: {
                    message: charactersNotAllowed,
                    callback: function callback(value, validator, $field) {
                      return fixEX(value);
                    }
                  }
                }
              },
              {
                id: "client_requests_clearance_letter",
                type: "radio",
                title: "Client requested clearance letter",
                className: "col-xs-12 col-sm-6",
                bindTo: "client_requests_clearance_letter",
                required: true,
                infohelp: null,
                // prehelptext: 'past 14 days prior to onset',
                orientation: 'horizontal',
                placeholder: null,
                choices: config.choices.yesNo,
                validators: {
                  callback: {
                    message: charactersNotAllowed,
                    callback: function callback(value, validator, $field) {
                      return fixEX(value);
                    }
                  }
                }
              },
              {
                id: "lab_results_sent",
                type: "radio",
                title: "Lab results sent",
                className: "col-xs-12 col-sm-6",
                bindTo: "lab_results_sent",
                required: true,
                infohelp: null,
                // prehelptext: 'past 14 days prior to onset',
                orientation: 'horizontal',
                placeholder: null,
                choices: config.choices.yesNoNA,
                validators: {
                  callback: {
                    message: charactersNotAllowed,
                    callback: function callback(value, validator, $field) {
                      return fixEX(value);
                    }
                  }
                }
              },
              {
              id: "clearance_letter_sent",
              type: "radio",
              title: "Clearance letter sent",
              className: "col-xs-12 col-sm-6",
              bindTo: "clearance_letter_sent",
              required: true,
              infohelp: null,
              // prehelptext: 'past 14 days prior to onset',
              orientation: 'horizontal',
              placeholder: null,
              choices: config.choices.yesNoNA,
              validators: {
                callback: {
                  message: charactersNotAllowed,
                  callback: function callback(value, validator, $field) {
                    return fixEX(value);
                  }
                }
              }
            },
              {
              id: "case_status",
              type: "dropdown",
              title: "Case Status",
              className: "col-xs-12 col-sm-4",
              bindTo: "case_status",
              required: true,
              infohelp: null,
              // prehelptext: 'past 14 days prior to onset',
              placeholder: null,
              choices: config.field_choices.case_status,
              validators: {
                callback: {
                  message: charactersNotAllowed,
                  callback: function callback(value, validator, $field) {
                    return fixEX(value);
                  }
                }
              }
            },
              {
              id: "case_classification",
              type: "dropdown",
              title: "Case Classification",
              className: "col-xs-12 col-sm-4",
              bindTo: "case_classification",
              required: false,
              infohelp: null,
              // prehelptext: 'past 14 days prior to onset',
              placeholder: null,
              choices: config.field_choices.case_classification,
              validators: {
                callback: {
                  message: charactersNotAllowed,
                  callback: function callback(value, validator, $field) {
                    return fixEX(value);
                  }
                }
              }
            },
              {
                id:"case_referred_to",
                bindTo:"case_referred_to",
                title:"Referred To",
                className: "col-xs-12 col-sm-4",
                type:"dropdown",
                choices:config.field_choices.case_referred_to
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
                  callback: function callback(value, validator, $field) {
                    return fixEX(value);
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
                  callback: function callback(value, validator, $field) {
                    if (fixEX(value)) {
                      if (/^\d+$/.test(value)) {
                        return true;
                      } else {
                        if (value == '') {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    } else {
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
                  callback: function callback(value, validator, $field) {
                    return fixEX(value);
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
                  callback: function callback(value, validator, $field) {
                    return fixEX(value);
                  }
                }
              }
            }
            ]
          },
            {
              fields:[
                {
                  id:"add_new_note",
                  type:"button",
                  title:"Add New Note",
                  addclass:"add_new_note"
                }
              ]
            },
            {
              fields:[
                    {
                      id:"client_notecontact_container",
                      type:"html",
                      html:`
                     <table id="notesTable" class="display" style="width:100%">
                              <thead>
                              <tr>
                                <th>Date</th>
                                <th>Note</th>
                              </tr>
                              </thead>
                              <tbody>
                              </tbody>
                            </table>
                  `
                    }
                    ]
            }
          ]
        },
        {
          cols: "2",
          id: "uploads",
          className: "panel-default hidden",
          title: "Attachments",
          rows: [{
            fields: [{
              id: 'uploadInfoText',
              type: 'html',
              class: 'col-xs-12',
              html: `Upload area`
            }, {
              id: "supportingDocuments",
              title: 'Choose Files',
              type: 'dropzone',
              class: 'col-xs-12',
              bindTo: 'supportingDocuments',
              required: false,
              htmlAttr: {
                length: totalCharacters
              },

              //posthelptext: 'post help text',
              //prehelptext: 'pre help text',

              use_recaptcha: true,
              recaptcha_sitekey: '6LeN_XIUAAAAAEd8X21vFtkJ3_c7uA0xpUGcrGpe',
              uploadCondition: function uploadCondition() {
                if (cannotSubmit) {
                  return false;
                }

                if (currentStep <= 5) {
                  return false;
                }

                if ($('#covid19_container_form').data('formValidation').$invalidFields.length > 0) {
                  return false;
                }

                if (currentStep == 6) {
                  return true;
                } else {
                  return false;
                }
              },

              options: {
                url: 'https://was-intra-sit.toronto.ca/c3api_upload/upload/covid19/attachments',
                acceptedFiles: 'application/pdf,.pdf,pdf,*.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx,*.doc,*.docx,application/zip',
                timeout: 180000,
                maxFiles: 8,
                maxFilesize: 20,
                // autoProcessQueue: false,
                allowFormsubmitionWithUploadError: true,
                selector: '#cotDropzoneClass2',

                init: function init() {
                  remainingUploadSize = totalUploadSizeLimit;
                  dz_uploader = this;

                  this.on("addedfile", function (file) {

                    var $textDescription = $(file.previewElement).find('textarea')[0];
                    var $textDescriptionID = $($textDescription).attr('id');

                    $($textDescription).attr('length', totalCharacters);
                    // $($textDescription).after('<div class="label label-default totalCharacters"><span class="charactercount_'+$($textDescription).attr('id')+'">'+totalCharacters+'</span> chars remaining</div>');
                    $($textDescription).after('<div class="label label-default totalCharacters"><span class="charactercount_' + $($textDescription).attr('id') + '">' + totalCharacters + '</span> characters remaining</div>');
                    $($textDescription).on("keyup", function (event) {
                      checkTextAreaMaxLength(this, event);
                    });

                    remainingUploadSize -= file.size;

                    if (this.files.length >= this.options.maxFiles) {
                      $(".btn-addFiles").attr("disabled", "true");
                    }

                    if (remainingUploadSize <= 0) {
                      file.status = Dropzone.CANCELED;
                      file.sizeTooLarge = true;
                      this._errorProcessing([file], "You have exceeded the attachment size limit of 20MB. Please remove one or more files.", null);
                    }
                  });

                  this.on("removedfile", function (file) {
                    remainingUploadSize += file.size;

                    // RE-add files
                    var dropzoneFilesCopy = this.files;
                    this.removeAllFiles();
                    var that = this;
                    $.each(dropzoneFilesCopy, function (_, file) {
                      file.status = undefined;
                      file.accepted = undefined;
                      file.isExcess = false;
                      that.addFile(file);
                    });

                    if (this.files.length < this.options.maxFiles) {
                      $(".btn-addFiles").removeAttr("disabled");
                    }
                  });

                  this.on("error", function (file, errorMessage, xhr) {
                    if (xhr != null) {
                      $('.submitBox').removeAttr('disabled');

                      $('#covid19_container').before('    <div id="submitFileUploadError" tabindex="-1">     <div class="">      <div class="alert alert-danger">      We cannot submit your submission at this time. There was an error with file upload, please review this error and try again.      </div>     </div>    </div>   ');
                      $("#submitFileUploadError").focus();
                      window.scrollTo(0, 0);
                    }
                  });
                },

                accept: function accept(file, done) {
                  //console.debug('totalSizeLimit', totalUploadSizeLimit)
                  //console.debug('remainingUploadSize', remainingUploadSize)

                  if (remainingUploadSize <= 0) {
                    file.status = Dropzone.CANCELED;
                    file.sizeTooLarge = true;
                    this._errorProcessing([file], "You have exceeded the attachment size limit of 20MB. Please remove one or more files.", null);
                  } else {
                    done();
                  }
                },
                chunksUploaded: function chunksUploaded(file, done) {
                  uploadedFiles.push({filenane: file.name, status: true});
                },
                fields: [
                  /*
                   {
                    name: 'text01',
                    title: 'Text Field',
                    type: 'text',
                    prehelptext: 'Help text',
                    posthelptext: 'Help text'
                   },
                  */
                  {
                    name: 'fileType',
                    title: 'Attachment Type',
                    type: 'dropdown',
                    choices: [{text: 'Document', value: 'document'}, {
                      text: 'Certification',
                      value: 'certification'
                    }, {text: 'Result', value: 'result'}, {text: 'Other', value: 'other'}]
                    //prehelptext: 'Help text',
                    //posthelptext: 'Help text'
                  }, {
                    name: 'fileDescription',
                    title: 'Attachment Description',
                    type: 'textarea'
                    //prehelptext: 'Help text',
                    //posthelptext: 'Help text'
                  }],
                getFieldsTemplate: function getFieldsTemplate() {
                  var getFieldTemplate = function getFieldTemplate(field) {
                    if (field == null) {
                      return '';
                    }
                    var fieldString = void 0;
                    switch (field.type) {
                      case 'dropdown':
                        fieldString = /* html */'<select title="' + field.title + '" aria-required="' + (field.required === true ? 'true' : 'false') + '" class="form-control' + (field.required === true ? ' required' : '') + '" placeholder="' + (field.placeholder || '') + '" row="' + (field.row || '') + '" col="' + (field.col || '') + '">' + (field.choices || []).map(function (choice) {
                          return '<option value="' + choice.value + '">' + choice.text + '</option>';
                        }) + '</select>';
                        break;
                      case 'textarea':
                        fieldString = /* html */'<textarea title="' + field.title + '" aria-required="' + (field.required === true ? 'true' : 'false') + '" class="form-control' + (field.required === true ? ' required' : '') + '" placeholder="' + (field.placeholder || '') + '" row="' + (field.row || '') + '" col="' + (field.col || '') + '"></textarea>';
                        break;
                      default:
                        fieldString = /* html */'<input title="' + field.title + '" type="' + (field.type || 'text') + '" aria-required="' + (field.required === true ? 'true' : 'false') + '" class="form-control' + (field.required === true ? ' required' : '') + '" placeholder="' + (field.placeholder || '') + '"></input>';
                    }
                    return (/* html */'   <div class="row">    <div data-name="' + field.name + '" class="col-xs-12 form-group form-group-vertical has-feedback">     <div>      <label class="control-label">       <span>' + field.title + '</span>       ' + (field.required !== true ? '<span class="optional">(optional)</span>' : '') + '      </label>      ' + (field.prehelptext != null ? '<p class="helptext prehelptext">' + field.prehelptext + '</p>' : '') + '      <div class="entryField">       ' + fieldString + '      </div>      ' + (field.posthelptext != null ? '<p class="helptext posthelptext">' + field.posthelptext + '</p>' : '') + '     </div>    </div>   </div>  '
                    );
                  };
                  // Add fields to preview template.
                  if (this.options.fields == null) {
                    this.options.fields = [];
                  }
                  var template = '';
                  this.options.fields.forEach(function (field) {
                    template = template + getFieldTemplate(field);
                  });
                  return template;
                },
                setFieldsTemplate: function setFieldsTemplate(file, row) {
                  var _this2 = this;

                  var setFieldTemplate = function setFieldTemplate(field) {
                    var name = (field.name || field.id) + '_' + row;
                    var formGroup = file.previewElement.querySelector('[data-name="' + (field.name || field.id) + '"]');

                    formGroup.setAttribute('id', name + 'Element');
                    formGroup.getElementsByTagName('label')[0].setAttribute('for', name);
                    var describedBy = [];
                    if (field.prehelptext != null) {
                      var id = 'prehelptext_' + name;
                      formGroup.querySelector('.prehelptext').setAttribute('id', id);
                      describedBy.push(id);
                    }
                    if (field.posthelptext != null) {
                      var _id = 'posthelptext_' + name;
                      formGroup.querySelector('.posthelptext').setAttribute('id', _id);
                      describedBy.push(_id);
                    }
                    var element = void 0;
                    switch (field.type) {
                      case 'dropdown':
                        element = formGroup.getElementsByTagName('select')[0];
                        break;
                      case 'textarea':
                        element = formGroup.getElementsByTagName('textarea')[0];
                        break;
                      default:
                        element = formGroup.getElementsByTagName('input')[0];
                    }
                    element.setAttribute('id', name);
                    element.setAttribute('name', name);
                    if (describedBy.length > 0) {
                      element.setAttribute('aria-describedby', describedBy.join(' '));
                    }
                    if (fv) {
                      var elementValidator = field.validator || {};
                      if (field.required) {
                        elementValidator.notEmpty = {
                          message: field.title + ' is required.'
                        };
                      }
                      fv.addField(name, {validators: elementValidator});
                    }
                    if (file.fields[field.name] == null) {
                      // file.fields[field.name] = null;
                    } else {
                      element.value = file.fields[field.name];
                    }
                    $(element).change(function (event) {
                      if (event.currentTarget.value != null && event.currentTarget.value != '') {
                        file.fields[field.name] = event.currentTarget.value;
                      } else {
                        delete file.fields[field.name];
                      }
                      if (_this2.options.onFieldChange != null) {
                        _this2.options.onFieldChange(file, _this2.files);
                      }
                    });
                  };
                  var fv = void 0;
                  var $form = $(file.previewElement).closest('form');
                  if ($form.length > 0) {
                    fv = $form.data('formValidation');
                  }
                  this.options.fields = this.options.fields || [];
                  this.options.fields.forEach(function (field) {
                    setFieldTemplate(field);
                  });
                }
              }
            }]
          }]
        }
      ];
      model = new CotModel({
        "status": "New",
        "external": "no",
        "patient_ontario_health_card_number":"",
        "patient_hospital_mrn":"",
        "patient_firstname":"",
        "patient_middlename":"",
        "patient_lastname":"",
        "patient_dateofbirth":"",
        "patient_gender":"",
        "patient_phone_number":"",
        "patient_email": "",
        "nofixedaddress_option": "",
        "nofixedaddress_option_text": "",
        "patient_mailing_address": "",
        "patient_mailing_address_data": "",
        "patient_mailing_street_number": "",
        "patient_mailing_street_name": "",
        "patient_mailing_suite_number": "",
        "patient_mailing_city": "",
        "patient_mailing_province": "",
        "patient_mailing_postal_code": "",
        "patient_mailing_country": "",
        "patient_mailing_long": "",
        "patient_mailing_lat": "",
        "reported_date":"",
        "reporting_source":"",
        "reporting_source_other":"",
        "reporting_organization":"",
        "reporting_organization_other":"",
        "person_making_the_report":"",
        "comments": "",
        "cpso_number":"",
        "reporting_phone_number":"",
        "reporting_phone_number_extension":"",
        "patient_symptoms":[],
        "patient_symptoms_other":"",
        "patient_onset_date":"",
        "patient_exposures":[],
        "patient_exposures_other":"",
        "patient_specimens_collected":[],
        "patient_specimens_collected_other":"",
        "patient_specimen_collection_date":"",
        "patient_hospital_told_patient_to_selfisolate":"",
        "patient_lab_results":[],
        "patient_lab_results_other": "",
        "patient_travel_affected_area": "",
        "patient_travel_other": "",
        "client_requests_lab_results":"",
        "client_requests_clearance_letter":"",
        "lab_results_sent":"",
        "clearance_letter_sent":"",
        "case_status":"",
        "case_classification":"",
        "case_referred_to":"",
        "iphis_exposure_name":"",
        "iphis_exposure_id":"",
        "iphis_case_id":"",
        "priority":"",
        "supportingDocuments": []
      });
      let user;
      let last_payload = {};
      let current_id;
      let ariaLive;
      let registerAutoSave = function autosave() {
        var payload = model.toJSON();

        delete payload["__CreatedOn"];
        delete payload["__ModifiedOn"];
        delete payload["__Owner"];
        delete payload["__Status"];


        if (JSON.stringify(payload) != JSON.stringify(last_payload)) {
          /*
          delete payload["__CreatedOn"];
          delete payload["__ModifiedOn"];
          delete payload["__Owner"];
          delete payload["__Status"];
          delete payload["id"];
          delete payload["status"];
          */
          last_payload = payload;
          $.ajax({
            "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/submissions('" + data.id + "')",
            "data": JSON.stringify(payload),
            "global": false,
            "type": "PATCH",
            "complete": function (data) {
            },
            "success": function (data) {
              $("#current_info_section").html("Last Modified: " + moment(data.__ModifiedOn).format(config.dateTimeFormat))
            },
            "error": function (request) {
              if (request.status === 403 || request.status === 422 || (request.status === 400 && !request.responseJSON && request.responseText && request.responseText.indexOf('Session id') !== -1 && request.responseText.indexOf('is invalid') !== -1)) {
                if (loginShown === false) {
                  oLogin.showLogin();
                }
              }
              console.warn("error silent save", request);
            },
            "headers": {
              "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
              "Content-Type": "application/json; charset=utf-8;",
              "Cache-Control": "no-cache"
            }
          });
        }
      };

      registerDataLoadEvents = async function (data) {
        if (data && data.id) {
          window.mymodel = model;
        }
      };

      registerFormEvents = (data) => {
        //NEW CONTACT
        let case_id = data.id;
        const customSearch = (searchString) => {
          //return "&$filter=\"" + searchString + "\"" ;
          let ret = "&$filter=";
          ret += "contains(tolower(Material), '" + searchString.toLowerCase() + "') or ";
          ret += "contains(tolower(Material_description), '" + searchString.toLowerCase() + "') or ";
          ret += "contains(tolower(Material_group_description), '" + searchString.toLowerCase() + "') or ";
          ret += "contains(tolower(Total_stock_quantity), '" + searchString.toLowerCase() + "') or";
          ret += "contains(tolower(Material_group), '" + searchString.toLowerCase() + "')";
          return ret;
        };
        const dt_config = {
          serverSide: true, /*tell datatables that this table is going to load data from an api*/
          ajax: (data, callback, settings) => {
            /*implement datatables ajax function*/
            /*build an array of columns that need to be sorted (orderby odata query parameter) based on the data parameter passed in from datatables*/
            let sort = [];
            data.order.forEach((val, i) => {
              if (!settings.aoColumns[val.column].isArray) {
                sort.push(data.columns[val.column].data + " " + val.dir);
              }
            });

            /*build the url*/
            let url = config.httpHost["root"][httpHost] + config.api.get + config.default_repo + "/client_contact" ;
            /*Base URL*/
            url += "?$format=application/json;odata.metadata=none&$count=true";
            /*base query string format and count*/
            url += "&$skip=" + settings._iDisplayStart;
            /*pagination start*/
            url += "&$top=" + settings._iDisplayLength;
            url += "&$filter=case eq '"+case_id+"'";
            /*pagination entities to return*/
            //url += data.search.value !== "" ? "&$search=\"" + data.search.value + "\"" : "";
            if (data.search.value !== "") {
              if (typeof customSearch === "function") {
                url += customSearch(data.search.value);
              } else {
                url += "&$search=\"" + data.search.value + "\"";
              }
            }

            /*if there is a global search add that in*/
            url += sort.length > 0 ? "&$orderby=" + sort.join(",") : "";
            /*if there are columns to sort add them in*/
            console.log(url);
            /*set up the jquery ajax call*/
            let options = {
              url: url,
              type: "GET",
              headers:{
                "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
                "Content-Type": "application/json; charset=utf-8;",
                "Cache-Control": "no-cache"
              },
              success: (response) => {
                /*call callback functin passed in by datatables to render the data*/
                callback({
                  data: response.value,
                  draw: data.draw,
                  recordsTotal: response['@odata.count'],
                  recordsFiltered: response['@odata.count']
                });
              }
            };
            /*request the data from the server*/
            $.ajax(options);
          },
          order: [[1, 'desc']],
          columns: [
            {
              data: "id", render: (data, x, row) => {
                return "<button class='btn btn-default view-contact' id='" + data + "'>Open <span class='sr-only'>" +  "</span></button>"
              }, className:"colSmall", targets: 0, searchable: false, orderable: false
            },
            {data: "date_client_called_hotline",  targets: 1, className:"colMed"},
            {data: "olis_lookup_for_this_client",  targets: 2, orderable:false, className:"colMed"},
            {data: "olis_lookup_results",  targets: 3, orderable:false, className:"colMed"},
            {data: "client_call_in_details_lab_findings_shared_with_client", className:"colMed", targets: 4, orderable:false, width:100},
            {data: "patient_adviced_selfmonitor", width: 125, targets: 4, orderable:false, className:"colMed"},
            {data: "patient_adviced_selfisolate", width: 125, targets: 4, orderable:false, className:"colMed"},
            {data: "client_advised_isolation_no_longer_needed", width: 125, targets: 4, orderable:false, className:"colLarge"},
            {data: "client_health_info_provided", width: 125, targets: 4, orderable:false, className:"colLarge"},
            {data: "client_call_detail_screen_notes", targets: 5, orderable:false , className:"colXL"}
          ]
        };
        const notes_config = {
          serverSide: true, /*tell datatables that this table is going to load data from an api*/
          ajax: (data, callback, settings) => {
            /*implement datatables ajax function*/
            /*build an array of columns that need to be sorted (orderby odata query parameter) based on the data parameter passed in from datatables*/
            let sort = [];
            data.order.forEach((val, i) => {
              if (!settings.aoColumns[val.column].isArray) {
                sort.push(data.columns[val.column].data + " " + val.dir);
              }
            });

            /*build the url*/
            let url = config.httpHost["root"][httpHost] + config.api.get + config.default_repo + "/note" ;
            /*Base URL*/
            url += "?$format=application/json;odata.metadata=none&$count=true";
            /*base query string format and count*/
            url += "&$skip=" + settings._iDisplayStart;
            /*pagination start*/
            url += "&$top=" + settings._iDisplayLength;
            url += "&$filter=case eq '"+case_id+"'";
            /*pagination entities to return*/
            //url += data.search.value !== "" ? "&$search=\"" + data.search.value + "\"" : "";
            if (data.search.value !== "") {
              if (typeof customSearch === "function") {
                url += customSearch(data.search.value);
              } else {
                url += "&$search=\"" + data.search.value + "\"";
              }
            }

            /*if there is a global search add that in*/
            url += sort.length > 0 ? "&$orderby=" + sort.join(",") : "";
            /*if there are columns to sort add them in*/
            console.log(url);
            /*set up the jquery ajax call*/
            let options = {
              url: url,
              type: "GET",
              headers:{
                "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
                "Content-Type": "application/json; charset=utf-8;",
                "Cache-Control": "no-cache"
              },
              success: (response) => {
                /*call callback functin passed in by datatables to render the data*/
                callback({
                  data: response.value,
                  draw: data.draw,
                  recordsTotal: response['@odata.count'],
                  recordsFiltered: response['@odata.count']
                });
              }
            };
            /*request the data from the server*/
            $.ajax(options);
          },
          order: [[0, 'desc']],
          columns: [
            {data: "__CreatedOn",  targets: 0, className:"colMed", render:(data)=>{return moment(data).format("YYYY-MM-DD")}},
            {data: "note", targets: 1, orderable:false , className:"colXL"}
          ]
        };
        let notes_table = $('#notesTable').DataTable(notes_config);
        let this_table = $('#newContactTable').DataTable(dt_config);
        this_table.on('draw.dt', () => {

          $("#newContactTable_length").parent().hide();
          $("#newContactTable_filter").parent().hide();

          let page_length = $(".paginate_button").last().prev().find("a").text();
          let paginationset = $('.pagination').find('.paginate_button');
          paginationset.each(function (index, pageset) {
            let atag = $(pageset).find('a');
            if (index === 0) {
              atag.attr("aria-label", "Previous Page");
            } else if (index === paginationset.length - 1) {
              atag.attr("aria-label", "Next Page");
            } else {

              atag.attr("aria-label", "Page " + atag.text() + " of " + page_length);
            }
          });
        });

        notes_table.on('draw.dt', () => {

          $("#notesTable_length").parent().hide();
          $("#notesTable_filter").parent().hide();

          let page_length = $(".paginate_button").last().prev().find("a").text();
          let paginationset = $('.pagination').find('.paginate_button');
          paginationset.each(function (index, pageset) {
            let atag = $(pageset).find('a');
            if (index === 0) {
              atag.attr("aria-label", "Previous Page");
            } else if (index === paginationset.length - 1) {
              atag.attr("aria-label", "Next Page");
            } else {

              atag.attr("aria-label", "Page " + atag.text() + " of " + page_length);
            }
          });
        });

        $("#maincontent").off('click', '.add_new_note button').on('click', '.add_new_note button', (e) => {

          //NEW CONTACT
          let note_modal = cot_app.showModal({
            "title": "New Note",
            "body": "<div class=\"modal-form\" id=\"new_form_container_div\"></div>",
            "originatingElement": $('#mi-new-submission'),
            "modalSize":"modal-xl",
            "onShow": function () {
              let contact_model = new CotModel({
                "note":""
              });

              let contact_form = new CotForm({
                "id": "po_modal_form",
                useBinding: true,
                sections: [
                  {
                    id: "sec_pr_update",
                    rows: [
                      {
                        fields: [
                          {
                            id: "note",
                            type: "textarea",
                            title: "Note",
                            className: "col-xs-12",
                            bindTo: "note",
                            required: true,
                            infohelp: null,
                            // prehelptext: 'past 14 days prior to onset',
                            placeholder: null,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          }
                        ]
                      },
                      {
                        fields: [
                          {
                            id: "update_pr_price_submit_html",
                            type: "html",
                            html: `<button id="note_submit" class="btn btn-primary">Submit</button>`
                          }
                        ]
                      }
                    ]
                  }
                ],
                success: function (event) {
                  event.preventDefault();
                  let payload = contact_model.toJSON();
                  payload.case = case_id;
                  payload.uname = Cookies.get(config.default_repo + ".cot_uname");
                  payload.createdBy = Cookies.get(config.default_repo + ".firstName") + " " + Cookies.get(config.default_repo + ".lastName");
                  let options = {
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    headers:{
                      "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
                      "Content-Type": "application/json; charset=utf-8;",
                      "Cache-Control": "no-cache"
                    },
                    method: 'POST',
                    url: config.httpHost.app[httpHost] + config.api.get + config.default_repo + "/note",
                    success: (data) => {
                      //router.navigate(submissions + '/' + data.id + '/?ts=' + new Date().getTime(), {trigger: true, replace: true});
                      console.log("new note:", data);
                      $('#notesTable').DataTable().ajax.reload();
                      if (note_modal && note_modal.modal) {
                        note_modal.modal('toggle');
                      }
                    },
                    failure: (gata) => {
                      callHouston("GENERAL_ERROR")
                    },
                  };
                  $.ajax(options)
                }
              });
              contact_form.render({target: '#new_form_container_div'});
              contact_form.setModel(contact_model);

            }
          });


        });
        $("#maincontent").off('click', '.view-contact').on('click', '.view-contact', (e) => {
          e.preventDefault();
          let _this = $(e.target);
          let table = $("#newContactTable").DataTable();
          let form_data = table.row($(e.target).closest("tr")).data();
          let contact_modal = cot_app.showModal({
            "title": "New Client Contact",
            "body": "<div class=\"modal-form\" id=\"new_form_container_div\"></div>",
            "originatingElement": $('#mi-new-submission'),
            "modalSize":"modal-xl",
            "onShow": function () {
              let contact_model = new CotModel({
                "date_client_called_hotline":"",
                "patient_adviced_selfmonitor":"",
                "patient_adviced_selfisolate":"",
                "client_advised_isolation_no_longer_needed":"",
                "olis_lookup_for_this_client":"",
                "olis_lookup_results":"",
                "client_call_in_details_lab_findings_shared_with_client":"",
                "client_health_info_provided":"",
                "client_call_detail_screen_notes":""
              });
              contact_model.set(form_data);
              let contact_form = new CotForm({
                id: "po_modal_form",
                useBinding: true,
                sections: [
                  {
                    id: "sec_pr_update",
                    rows: [
                      {
                        fields: [
                          {
                            id: "date_client_called_hotline",
                            type: "text",
                            title: "Date client called hotline",
                            className: "col-xs-12",
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
                            placeholder: null,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "olis_lookup_for_this_client",
                            type: "text",
                            title: "OLIS Look-up for this client",
                            className: "col-xs-12",
                            bindTo: "olis_lookup_for_this_client",
                            orientation: "horizontal",
                            required: true,
                            infohelp: null,
                            // prehelptext: 'past 14 days prior to onset',
                            placeholder: null,
                            choices: config.choices.yesNoNA,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "olis_lookup_results",
                            type: "text",
                            title: "OLIS Look-up results",
                            className: "col-xs-12",
                            bindTo: "olis_lookup_results",
                            orientation: "horizontal",
                            required: true,
                            infohelp: null,
                            placeholder: null,
                            choices: config.field_choices.covid19_detected,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "client_call_in_details_lab_findings_shared_with_client",
                            type: "text",
                            title: "Lab findings shared with client",
                            className: "col-xs-12",
                            bindTo: "client_call_in_details_lab_findings_shared_with_client",
                            orientation: "horizontal",
                            required: true,
                            infohelp: null,
                            // prehelptext: 'past 14 days prior to onset',
                            placeholder: null,
                            choices: config.choices.yesNoNA,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "patient_adviced_selfmonitor",
                            type: "text",
                            title: "Patient advised to self-monitor",
                            className: "col-xs-12",
                            bindTo: "patient_adviced_selfmonitor",
                            orientation: 'horizontal',
                            required: true,
                            infohelp: null,
                            placeholder: null,
                            choices: config.choices.yesNoNA,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "patient_adviced_selfisolate",
                            type: "text",
                            title: "Patient advised to self-isolate",
                            className: "col-xs-12",
                            bindTo: "patient_adviced_selfisolate",
                            orientation: 'horizontal',
                            required: true,
                            infohelp: null,
                            placeholder: null,
                            choices: config.choices.yesNoNA,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "client_advised_isolation_no_longer_needed",
                            type: "text",
                            title: "Client advised isolation no longer needed",
                            className: "col-xs-12",
                            bindTo: "client_advised_isolation_no_longer_needed",
                            required: true,
                            infohelp: null,
                            prehelptext: null,
                            orientation: 'horizontal',
                            placeholder: null,
                            choices: config.choices.yesNoNA,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "client_health_info_provided",
                            type: "text",
                            title: "Eduaction information provided",
                            className: "col-xs-12",
                            bindTo: "client_health_info_provided",
                            required: true,
                            infohelp: null,
                            prehelptext: null,
                            orientation: 'horizontal',
                            placeholder: null,
                            choices: config.choices.yesNoNA,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          },
                          {
                            id: "client_call_detail_screen_notes",
                            type: "textarea",
                            title: "Notes",
                            className: "col-xs-12",
                            bindTo: "client_call_detail_screen_notes",
                            required: false,
                            infohelp: null,
                            // prehelptext: 'past 14 days prior to onset',
                            placeholder: null,
                            validators: {
                              callback: {
                                message: charactersNotAllowed,
                                callback: function callback(value, validator, $field) {
                                  return fixEX(value);
                                }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ],
                success: function (event) {}
              });
              contact_form.render({target: '#new_form_container_div'});
              contact_form.setModel(contact_model);
              $("#po_modal_form input,textarea").attr("readonly", true)

            }
          });

        });
        $("#maincontent").off('click', '.add_new_contact button').on('click', '.add_new_contact button', (e) => {

        //NEW CONTACT
        let contact_modal = cot_app.showModal({
          "title": "New Client Contact",
          "body": "<div class=\"modal-form\" id=\"new_form_container_div\"></div>",
          "originatingElement": $('#mi-new-submission'),
          "modalSize":"modal-xl",
          "onShow": function () {
            let contact_model = new CotModel({
              "date_client_called_hotline":moment().format("YYYY-MM-DD"),
              "patient_adviced_selfmonitor":"",
              "patient_adviced_selfisolate":"",
              "client_advised_isolation_no_longer_needed":"",
              "olis_lookup_for_this_client":"",
              "olis_lookup_results":"",
              "client_call_in_details_lab_findings_shared_with_client":"",
              "client_health_info_provided":"",
              "client_call_detail_screen_notes":""
            });
            contact_model.set("date_client_called_hotline",moment().format("YYYY-MM-DD"));
            let contact_form = new CotForm({
              "id": "po_modal_form",
              useBinding: true,
              sections: [
                {
                  id: "sec_pr_update",
                  rows: [
                    {
                      fields: [
                        {
                          id: "date_client_called_hotline",
                          type: "datetimepicker",
                          title: "Date client called hotline",
                          className: "col-xs-12",
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
                          placeholder: null,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "olis_lookup_for_this_client",
                          type: "radio",
                          title: "OLIS Look-up for this client",
                          className: "col-xs-12",
                          bindTo: "olis_lookup_for_this_client",
                          orientation: "horizontal",
                          required: true,
                          infohelp: null,
                          // prehelptext: 'past 14 days prior to onset',
                          placeholder: null,
                          choices: config.choices.yesNoNA,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "olis_lookup_results",
                          type: "dropdown",
                          title: "OLIS Look-up results",
                          className: "col-xs-12",
                          bindTo: "olis_lookup_results",
                          orientation: "horizontal",
                          required: true,
                          infohelp: null,
                          placeholder: null,
                          choices: config.field_choices.covid19_detected,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "client_call_in_details_lab_findings_shared_with_client",
                          type: "radio",
                          title: "Lab findings shared with client",
                          className: "col-xs-12",
                          bindTo: "client_call_in_details_lab_findings_shared_with_client",
                          orientation: "horizontal",
                          required: true,
                          infohelp: null,
                          // prehelptext: 'past 14 days prior to onset',
                          placeholder: null,
                          choices: config.choices.yesNoNA,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "patient_adviced_selfmonitor",
                          type: "radio",
                          title: "Patient advised to self-monitor",
                          className: "col-xs-12",
                          bindTo: "patient_adviced_selfmonitor",
                          orientation: 'horizontal',
                          required: true,
                          infohelp: null,
                          placeholder: null,
                          choices: config.choices.yesNoNA,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "patient_adviced_selfisolate",
                          type: "radio",
                          title: "Patient advised to self-isolate",
                          className: "col-xs-12",
                          bindTo: "patient_adviced_selfisolate",
                          orientation: 'horizontal',
                          required: true,
                          infohelp: null,
                          placeholder: null,
                          choices: config.choices.yesNoNA,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "client_advised_isolation_no_longer_needed",
                          type: "radio",
                          title: "Client advised isolation no longer needed",
                          className: "col-xs-12",
                          bindTo: "client_advised_isolation_no_longer_needed",
                          required: true,
                          infohelp: null,
                          prehelptext: null,
                          orientation: 'horizontal',
                          placeholder: null,
                          choices: config.choices.yesNoNA,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "client_health_info_provided",
                          type: "radio",
                          title: "Education information provided",
                          className: "col-xs-12",
                          bindTo: "client_health_info_provided",
                          required: true,
                          infohelp: null,
                          prehelptext: null,
                          orientation: 'horizontal',
                          placeholder: null,
                          choices: config.choices.yesNoNA,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        },
                        {
                          id: "client_call_detail_screen_notes",
                          type: "textarea",
                          title: "Notes",
                          className: "col-xs-12",
                          bindTo: "client_call_detail_screen_notes",
                          required: false,
                          infohelp: null,
                          // prehelptext: 'past 14 days prior to onset',
                          placeholder: null,
                          validators: {
                            callback: {
                              message: charactersNotAllowed,
                              callback: function callback(value, validator, $field) {
                                return fixEX(value);
                              }
                            }
                          }
                        }
                      ]
                    },
                    {
                      fields: [
                        {
                          id: "update_pr_price_submit_html",
                          type: "html",
                          html: `<button id="po_price_submit" class="btn btn-primary">Submit</button>`
                        }
                      ]
                    }
                  ]
                }
              ],
              success: function (event) {
                event.preventDefault();
                let payload = contact_model.toJSON();
                payload.case = case_id;
                payload.uname = Cookies.get(config.default_repo + ".cot_uname");
                payload.createdBy = Cookies.get(config.default_repo + ".firstName") + " " + Cookies.get(config.default_repo + ".lastName");
                let options = {
                  contentType: "application/json",
                  data: JSON.stringify(payload),
                  headers:{
                    "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
                    "Content-Type": "application/json; charset=utf-8;",
                    "Cache-Control": "no-cache"
                  },
                  method: 'POST',
                  url: config.httpHost.app[httpHost] + config.api.get + config.default_repo + "/client_contact",
                  success: (data) => {
                    //router.navigate(submissions + '/' + data.id + '/?ts=' + new Date().getTime(), {trigger: true, replace: true});

                    $('#newContactTable').DataTable().ajax.reload();
                    if (contact_modal && contact_modal.modal) {
                      contact_modal.modal('toggle');
                    }

                  },
                  failure: (gata) => {
                    callHouston("GENERAL_ERROR")
                  },
                };
                $.ajax(options)
              }
            });
            contact_form.render({target: '#new_form_container_div'});
            contact_form.setModel(contact_model);

          }
        });


        });
        $("#maincontent").off('click', '#menu-print').on('click', '#menu-print', (e) => {
          let _this = $(e.target);
          printPDF(config.export_pdf.headerTextRight, config.export_pdf.footerTextLeft, config.export_pdf.watermark)
        });

        ariaLive = document.querySelector('[aria-live="polite"]');
        if (data && data.id) {
          $("#current_info_section").html("Last Modified: " + moment(data.__ModifiedOn).format(config.dateTimeFormat));
          last_payload = model.toJSON();
          delete last_payload["__CreatedOn"];
          delete last_payload["__ModifiedOn"];
          delete last_payload["__Owner"];
          delete last_payload["__Status"];

          autoSave = setInterval(registerAutoSave, 3000);
        } else {

        }
        // auto suggest address
        const handleSelected_address = (evt) => {
          $('#patient_mailing_address').val(evt.text).change();
          $('#patient_mailing_address_data').val(evt.value).change();
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
                      $('#patient_mailing_street_number').val(data.result.rows[0].LO_NUM).change();
                      $('#patient_mailing_street_name').val(data.result.rows[0].LINEAR_NAME + ' ' + data.result.rows[0].LINEAR_NAME_TYPE).change();
                      $('#patient_mailing_suite_number').val('').change();
                      $('#patient_mailing_city').val(data.result.rows[0].CITY).change();
                      $('#patient_mailing_province').val('Ontario').change();
                      $('#patient_mailing_country').val('Canada').change();
                      $('#patient_mailing_postal_code').val(data.result.rows[0].POSTAL_CODE).change();
                      $('#patient_mailing_long').val(data.result.rows[0].LONGITUDE).change();
                      $('#patient_mailing_lat').val(data.result.rows[0].LATITUDE).change();
                      $('#patient_mailing_street_number').attr('disabled', 'disabled');
                      $('#patient_mailing_street_name').attr('disabled', 'disabled');
                      $('#patient_mailing_city').attr('disabled', 'disabled');
                      $('#patient_mailing_province').attr('disabled', 'disabled');
                      $('#patient_mailing_country').attr('disabled', 'disabled');
                      $('#patient_mailing_postal_code').attr('disabled', 'disabled');
                      $('#patient_mailing_long').attr('disabled', 'disabled');
                      $('#patient_mailing_lat').attr('disabled', 'disabled');
                    }
                  }
                }
              }
            })
            .fail(function () {

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


          checkAutoSuggest_Address();
        }
        const checkAutoSuggest_Address = () => {

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

        };
        const handleResults_address = (evt) => {
          $('#patient_mailing_address').val('').change();
          $('#patient_mailing_address_data').val('').change();
          // $('#patient_mailing_city').val('').change();
          // $('#patient_mailing_street_number').val('').change();
          // $('#patient_mailing_province').val('').change();
          // $('#patient_mailing_city').val('').change();

          if (evt.length == 0) {
            $('#cotui-patient_mailing_address').attr('errortext', 'no results found');
          } else {
            $('#cotui-patient_mailing_address').attr('errortext', '');
          }

        }

        const handleSubmit_address = (evt) => {

        };

        const handleInput_address = (evt) => {

          if (document.getElementById('cotui-autosuggest_address').value == "") {
            $('#patient_mailing_address').val('').change();
            $('#patient_mailing_address_data').val('').change();
            $('#cotui-patient_mailing_address').attr('errortext', 'no results found');
          }
          checkAutoSuggest_Address();
        }

        let autoSuggest_address = document.getElementById('cotui-autosuggest_address');
        autoSuggest_address.onresults = handleResults_address;
        autoSuggest_address.onselected = handleSelected_address;
        autoSuggest_address.submit = handleSubmit_address;
        autoSuggest_address.oninput = handleInput_address;
        autoSuggest_address.onclear = (term) => {
          $('#cotui-autosuggest_address').attr('errortext', '');
          $('#cotui-autosuggest_address').val('');
        };
      };

      registerOnSaveEvents = (data) => {
        if (data) {
        } else {
          data.status = "New"
        }
        /*
router.navigate( 'submissions/' + data.id + '/?alert=success&msg=' + 'test 123' + '&ts=' + new Date().getTime(), {
            trigger: true,
            replace: true
          });

         */
      };

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



      break;
  }
  return {
    "sections": sections,
    "model": model,
    "defaults": defaults,
    "success": success,
    "registerDataLoadEvents": registerDataLoadEvents,
    "registerFormEvents": registerFormEvents,
    "registerOnSaveEvents": registerOnSaveEvents,
    "registerPostSaveEvents": registerPostSaveEvents,
    "registerPostErrorEvents": registerPostErrorEvents
  };

};
/**
 *
 * @param formName
 * @param filter
 * @returns {[null,null,null]}
 */
const getColumnDefinitions = (formName, filter) => {
  let columnDefs, view, view_config = {};
  //view_config.lengthMenu = [100, 10, 50, 1000];

  switch (formName) {
    case 'Media':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label='" + desc + "'class='btn btn-sm btn-default view_btn'>Open</button>";
            return view_button;
          }
        },
        {"data": "id", "title": "Name", "filter": false},
        {
          "data": "__ContentType",
          "title": "Content Type",
          "filter": false
        }
      ];
      view = 'Media';
      break;
    case 'submissions':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label=\"" + desc + "\" class=\"btn btn-sm btn-default view_btn\">Open</button>";
            return view_button;
          }
        },
        {"data": "patient_ontario_health_card_number", "title": "OHCN", "filter": true, "type": "text"},
        {"data": "patient_firstname", "title": "First Name", "filter": true, "type": "text"},
        {"data": "patient_lastname", "title": "Last Name", "filter": true, "type": "text"},
        {"data": "patient_dateofbirth", "title": "DOB", "filter": true, "type": "text"},
        {
          "data": "case_status",
          "title": "Case Status",
          "filter": true,
          "type": "dropdown",
          filterChoices: config.choices.status
        },
        {
          "data": "__CreatedOn",
          "title": "Created",
          "filter": true,
          "type": "datetime",
          "sortOrder": "desc",
          "restrict": filter["__CreatedOn"],
          "render": function (data) {
            return moment(data).format(config.dateTimeFormat)
          }
        },
      ];
      view = "submissions";
      break;
    case 'admin_view':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label=\"" + desc + "\" class=\"btn btn-sm btn-default view_btn\">Open</button>";
            return view_button;
          }
        },
        {
          "data": "case_status",
          "title": "Case Status",
          "filter": true,
          "type": "dropdown",
          filterChoices: config.choices.status
        },
        {
          "data": "__CreatedOn",
          "title": "Created",
          "filter": true,
          "type": "datetime",
          "sortOrder": "desc",
          "restrict": filter["__CreatedOn"],
          "render": function (data) {
            return moment(data).format(config.dateTimeFormat)
          }
        },
        {"data": "patient_ontario_health_card_number", "title": "OHCN", "filter": true, "type": "text"},
        {"data": "patient_firstname", "title": "First Name", "filter": true, "type": "text"},
        {"data": "patient_lastname", "title": "Last Name", "filter": true, "type": "text"},
        {"data": "patient_dateofbirth", "title": "DOB", "filter": true, "type": "text"},
        {"data": "patient_phone_number", "title": "Phone", "filter": true, "type": "text"}

      ];
      view = "submissions";
      break;
    case 'mail_merge':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label=\"" + desc + "\" class=\"btn btn-sm btn-default view_btn\">Open</button>";
            return view_button;
          }
        },
        {"data": "client_requests_lab_results", "title": "Results Requested", "filter": true, "type": "dropdown" ,"filterChoices":config.choices.yesNo},
        {"data": "lab_results_sent", "title": "Results Sent", "filter": true, "type": "dropdown" ,"filterChoices":config.choices.yesNo},
        {"data": "client_requests_clearance_letter", "title": "Clearance Letter Requested", "filter": true, "type": "dropdown" ,"filterChoices":config.choices.yesNo},
        {"data": "clearance_letter_sent", "title": "Clearance Letter Sent", "filter": true, "type": "dropdown" ,"filterChoices":config.choices.yesNo},
        {"data": "patient_firstname", "title": "First Name", "filter": true, "type": "text"},
        {"data": "patient_middlename", "title": "Middle Name", "filter": true, "type": "text"},
        {"data": "patient_lastname", "title": "Last Name", "filter": true, "type": "text"},
        {"data": "patient_mailing_address", "title": "Mail Address", "filter": true, "type": "text"},
        {"data": "patient_mailing_street_number", "title": "Street Number", "filter": true, "type": "text"},
        {"data": "patient_mailing_street_name", "title": "Street Name", "filter": true, "type": "text"},
        {"data": "patient_mailing_suite_number", "title": "Suite Number", "filter": true, "type": "text"},
        {"data": "patient_mailing_city", "title": "City", "filter": true, "type": "text"},
        {"data": "patient_mailing_province", "title": "Province", "filter": true, "type": "text"},
        {"data": "patient_mailing_postal_code", "title": "Postal Code", "filter": true, "type": "text"},
        {"data": "patient_mailing_country", "title": "Country", "filter": true, "type": "text"},
        {
          "data": "case_status",
          "title": "Case Status",
          "filter": true,
          "type": "dropdown",
          filterChoices: config.choices.status
        },
        {"data": "patient_ontario_health_card_number", "title": "OHCN", "filter": true, "type": "text"},
        {"data": "patient_dateofbirth", "title": "DOB", "filter": true, "type": "text"},
        {"data": "patient_phone_number", "title": "Phone", "filter": true, "type": "text"},
        {"data": "patient_email", "title": "Email", "filter": true, "type": "text"},
        {
          "data": "__CreatedOn",
          "title": "Created",
          "filter": true,
          "type": "datetime",
          "sortOrder": "desc",
          "restrict": filter["__CreatedOn"],
          "render": function (data) {
            return moment(data).format(config.dateTimeFormat)
          }
        }

      ];
      view = "submissions";
      break;
    case 'export':
      columnDefs = [
        {
          "data": "patient_ontario_health_card_number",
          "title": "patient_ontario_health_card_number",
          "filter": true,
          "type": "text"
        },
        {"data": "patient_firstname", "title": "patient_firstname", "filter": true, "type": "text"},
        {"data": "patient_middlename", "title": "patient_middlename", "filter": true, "type": "text"},
        {"data": "patient_lastname", "title": "patient_lastname", "filter": true, "type": "text"},
        {"data": "patient_dateofbirth", "title": "patient_dateofbirth", "filter": true, "type": "text"},
        {"data": "patient_gender", "title": "patient_gender", "filter": true, "type": "text"},
        {"data": "patient_phone_number", "title": "patient_phone_number", "filter": true, "type": "text"},
        {"data": "patient_hospital_mrn", "title": "patient_hospital_mrn", "filter": true, "type": "text"},
        {"data": "patient_mailing_address", "title": "patient_mailing_address", "filter": true, "type": "text"},
        {
          "data": "patient_mailing_address_data",
          "title": "patient_mailing_address_data",
          "filter": true,
          "type": "text"
        },
        {
          "data": "patient_mailing_street_number",
          "title": "patient_mailing_street_number",
          "filter": true,
          "type": "text"
        },
        /*
        {"data": "patient_mailing_street_name", "title": "patient_mailing_street_name", "filter": true, "type": "text"},
        {
          "data": "patient_mailing_suite_number",
          "title": "patient_mailing_suite_number",
          "filter": true,
          "type": "text"
        },
        {"data": "patient_mailing_city", "title": "patient_mailing_city", "filter": true, "type": "text"},
        {"data": "patient_mailing_province", "title": "patient_mailing_province", "filter": true, "type": "text"},
        {"data": "patient_mailing_postal_code", "title": "patient_mailing_postal_code", "filter": true, "type": "text"},
        {"data": "patient_mailing_country", "title": "patient_mailing_country", "filter": true, "type": "text"},
        {"data": "patient_mailing_long", "title": "patient_mailing_long", "filter": true, "type": "text"},
        {"data": "patient_mailing_lat", "title": "patient_mailing_lat", "filter": true, "type": "text"},
        {"data": "reported_date", "title": "reported_date", "filter": true, "type": "text"},
        {"data": "reporting_source", "title": "reporting_source", "filter": true, "type": "text"},
        {"data": "reporting_source_other", "title": "reporting_source_other", "filter": true, "type": "text"},
        {"data": "reporting_organization", "title": "reporting_organization", "filter": true, "type": "text"},
        {
          "data": "reporting_organization_other",
          "title": "reporting_organization_other",
          "filter": true,
          "type": "text"
        },
        {"data": "person_making_the_report", "title": "person_making_the_report", "filter": true, "type": "text"},
        {"data": "reporting_phone_number", "title": "reporting_phone_number", "filter": true, "type": "text"},
        {
          "data": "reporting_phone_number_extension",
          "title": "reporting_phone_number_extension",
          "filter": true,
          "type": "text"
        },
        {"data": "patient_symptoms", "title": "patient_symptoms", "filter": false, "type": "text"},
        {"data": "patient_symptoms_other", "title": "patient_symptoms_other", "filter": true, "type": "text"},
        {"data": "patient_onset_date", "title": "patient_onset_date", "filter": true, "type": "text"},
        {"data": "patient_exposures", "title": "patient_exposures", "filter": true, "type": "text"},
        {"data": "patient_exposures_other", "title": "patient_exposures_other", "filter": true, "type": "text"},
        {"data": "patient_specimens_collected", "title": "patient_specimens_collected", "filter": true, "type": "text"},
        {
          "data": "patient_specimens_collected_other",
          "title": "patient_specimens_collected_other",
          "filter": true,
          "type": "text"
        },
        {
          "data": "patient_seciment_collection_date",
          "title": "patient_seciment_collection_date",
          "filter": true,
          "type": "text"
        },
        {
          "data": "patient_hospital_told_patient_to_selfisolate",
          "title": "patient_hospital_told_patient_to_selfisolate",
          "filter": true,
          "type": "text"
        },
        {"data": "patient_lab_results", "title": "patient_lab_results", "filter": true, "type": "text"},
        {"data": "cores_unique_id", "title": "cores_unique_id", "filter": true, "type": "text"},
        {
          "data": "patient_adviced_selfmonitor_selfisolate",
          "title": "patient_adviced_selfmonitor_selfisolate",
          "filter": true,
          "type": "text"
        },
        {
          "data": "public_health_actions_lab_findings_shared_with_client",
          "title": "public_health_actions_lab_findings_shared_with_client",
          "filter": true,
          "type": "text"
        },
        {
          "data": "client_advised_isolation_no_longer_needed",
          "title": "client_advised_isolation_no_longer_needed",
          "filter": true,
          "type": "text"
        },
        {"data": "clearance_letter_sent", "title": "clearance_letter_sent", "filter": true, "type": "text"},
        {"data": "case_status", "title": "case_status", "filter": true, "type": "text"},
        {"data": "iphis_exposure_name", "title": "iphis_exposure_name", "filter": true, "type": "text"},
        {"data": "iphis_exposure_id", "title": "iphis_exposure_id", "filter": true, "type": "text"},
        {"data": "case_classification", "title": "case_classification", "filter": true, "type": "text"},
        {"data": "iphis_case_id", "title": "iphis_case_id", "filter": true, "type": "text"},
        {"data": "priority", "title": "priority", "filter": true, "type": "text"},
        {"data": "date_client_called_hotline", "title": "date_client_called_hotline", "filter": true, "type": "text"},
        {
          "data": "client_identity_validation_method",
          "title": "client_identity_validation_method",
          "filter": true,
          "type": "text"
        },
        {"data": "olis_lookup_for_this_client", "title": "olis_lookup_for_this_client", "filter": true, "type": "text"},
        {"data": "olis_lookup_results", "title": "olis_lookup_results", "filter": true, "type": "text"},
        {
          "data": "client_call_in_details_lab_findings_shared_with_client",
          "title": "client_call_in_details_lab_findings_shared_with_client",
          "filter": true,
          "type": "text"
        },
        {"data": "hotline_operator_name", "title": "hotline_operator_name", "filter": true, "type": "text"},
        {
          "data": "client_call_detail_screen_notes",
          "title": "client_call_detail_screen_notes",
          "filter": true,
          "type": "text"
        },
        */
        {
          "data": "__CreatedOn",
          "title": "Created",
          "filter": true,
          "type": "datetime",
          "sortOrder": "desc",
          "restrict": filter["__CreatedOn"],
          "render": function (data) {
            return moment(data).format(config.dateTimeFormat)
          }
        }

      ];
      view = "submissions";
      break;
    default:
      break;
  }
  return [columnDefs, view, view_config];
};
/**
 *
 */
const registerEvents = () => {

//  $(window).on( "unload", ()=>{enhancedLogout()} );
//  $(window).unload(function(){
//    enhancedLogout();
//  });
  $.ajaxSetup({cache: false});

  let cur_user = Cookies.get(config.default_repo + '.cot_uname') && Cookies.get(config.default_repo + '.cot_uname') !== "" ? Cookies.get(config.default_repo + '.cot_uname') : "not set"
  $("<span id=\"user_name_display\" style=\"margin-left:4px;\">" + cur_user + "</span>").insertAfter($("#user_auth_title"));


  $("#maincontent").off("click", ".view_btn").on("click", ".view_btn", function (e) {
    e.preventDefault();
    let row = $(this).closest('tr');
    row.addClass('selected');
    router.navigate(row.attr('data-formName') + '/' + row.attr('data-id') + '/?ts=' + new Date().getTime(), {
      trigger: true,
      replace: true
    });
  });
  $("#maincontent").off('click', '#tabExportCSV').on('click', '#tabExportCSV', function () {
    $(".dt-button.buttons-csv.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportEXCEL').on('click', '#tabExportEXCEL', function () {
    $(".dt-button.buttons-excel.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportPDF').on('click', '#tabExportPDF', function () {
    $(".dt-button.buttons-pdf.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportCopy').on('click', '#tabExportCopy', function () {
    $(".dt-button.buttons-copy.buttons-html5").click();
  });

  // Create New Entry button
  $("#maincontent").off('click', '.btn-createReport').on('click', '.btn-createReport', function () {
    router.navigate($(this).attr('data-id') + '/new/?ts=' + new Date().getTime(), {trigger: true, replace: true});
  });

  $("#maincontent").off('click', '.btn-createNewCase').on('click', '.btn-createNewCase', function () {
    let searchOptions = {};
    let payload = {
      "patient_ontario_health_card_number": "",
      "patient_firstname": "",
      "patient_lastname": "",
      "patient_dateofbirth": "",
      "case_status":"new"
    };
    let options = {
      contentType: "application/json",
      data: JSON.stringify(payload),
      method: 'POST',
      url: config.httpHost.app[httpHost] + config.api.get + config.default_repo + "/submissions",
      success: (data) => {
        router.navigate(submissions + '/' + data.id + '/?ts=' + new Date().getTime(), {trigger: true, replace: true});
      },
      failure: (gata) => {
        callHouston("GENERAL_ERROR")
      },
    };

    let po_model = new CotModel({
      "patient_ontario_health_card_number": "",
      "patient_firstname": "",
      "patient_lastname": "",
      "patient_dateofbirth": ""
    });
    let charactersNotAllowed = 'characters < > % not allowed';

    function fixEX(string) {
      if (/^[^<>%]*$/.test(string)) {
        return true;
      } else {
        return false;
      }
    }

    let po_modal = cot_app.showModal({
      "title": "New Open Data Submission",
      "body": "<div class=\"modal-form\" id=\"new_form_container_div\"></div>",
      "originatingElement": $('#mi-new-submission'),
      "callback": function () {
        return false;
      },
      "onShow": function () {
        let po_form = new CotForm({
          "id": "po_modal_form",
          useBinding: true,
          sections: [
            {
              id: "sec_pr_update",
              rows: [
                {
                  fields: [
                    {
                      id: "patient_ontario_health_card_number",
                      type: "text",
                      title: "Ontario Health Card Number:",
                      bindTo: "patient_ontario_health_card_number",
                      className: "col-xs-12",
                      required: false,
                      infohelp: null,
                      posthelptext: null,
                      placeholder: null,
                      validators: {
                        callback: {
                          message: charactersNotAllowed,
                          callback: function callback(value, validator, $field) {
                            return fixEX(value);
                          }
                        }
                      }
                    },
                    {
                      id: "patient_firstname",
                      type: "text",
                      title: "Client First Name:",
                      bindTo: "patient_firstname",
                      className: "col-xs-12",
                      required: true,
                      infohelp: null,
                      posthelptext: null,
                      placeholder: null,
                      validators: {
                        callback: {
                          message: charactersNotAllowed,
                          callback: function callback(value, validator, $field) {
                            return fixEX(value);
                          }
                        }
                      }
                    },
                    {
                      id: "patient_lastname",
                      type: "text",
                      title: "Client Last Name:",
                      className: "col-xs-12",
                      bindTo: "patient_lastname",
                      required: true,
                      infohelp: null,
                      posthelptext: null,
                      placeholder: null,
                      validators: {
                        callback: {
                          message: charactersNotAllowed,
                          callback: function callback(value, validator, $field) {
                            return fixEX(value);
                          }
                        }
                      }
                    },
                    {
                      id: "patient_dateofbirth",
                      type: "datetimepicker",
                      title: "Date of Birth:",
                      className: "col-xs-12",
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
                      validators: {
                        callback: {
                          message: charactersNotAllowed,
                          callback: function callback(value, validator, $field) {
                            return fixEX(value);
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  fields: [
                    {
                      id: "update_pr_price_submit_html",
                      type: "html",
                      html: `<button id="po_price_submit" class="btn btn-success">Create new case</button>`
                    }
                  ]
                }
              ]
            }
          ],
          success: function (event) {
            event.preventDefault();
            let query = "?$format=application/json;odata.metadata=none&unwrap=true&$skip=0&$top=10&$filter="
            query += "(tolower(patient_firstname) eq '" + po_model.get('patient_firstname').toLowerCase() + "' and tolower(patient_lastname) eq '" + po_model.get('patient_lastname').toLowerCase() + "' and patient_dateofbirth eq '" + po_model.get('patient_dateofbirth') + "')";
            query += " or (patient_ontario_health_card_number eq '" + po_model.get('patient_ontario_health_card_number').toLowerCase() + "')"
            console.log(config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/submissions" + query)
            let options = {
              "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/submissions" + query,
              "async": true,
              "type": "GET",
              "headers": {
                "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
                "Content-Type": "application/json; charset=utf-8;",
                "Cache-Control": "no-cache"
              },
              "success": (data) => {
                const submitFormData = () => {
                  let payload = {}, dateStamp = moment().toISOString();
                  if (po_modal && po_modal.modal) {
                    po_modal.modal('toggle');
                  }
                  payload = po_model.toJSON();
                  payload.case_status="New";
                  $.ajax({
                    "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/submissions",
                    "data": JSON.stringify(payload),
                    "async": true,
                    "type": "POST",
                    "headers": {
                      "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
                      "Content-Type": "application/json; charset=utf-8;",
                      "Cache-Control": "no-cache"
                    }
                  })
                    .success(function (data) {
                      router.navigate('submissions/' + data.id + '/?ts=' + new Date().getTime(), {
                        trigger: true,
                        replace: true
                      });
                    })
                    .error(function (error) {

                    });
                };
                let match = false;
                if (data.length >= 1) {
                  match = true
                }
                let confirmed = false;
                if (match === false) {
                  confirmed = true;
                } else {
                  confirmed = confirm("A duplicate case was found by OHCN or First Name, Last Name and DOB. Create case anyway?");
                }
                if (confirmed === true) {
                  submitFormData();
                }
              },
              "error": (data) => {
                console.log('error', data);
              }
            };
            $.ajax(options);
          }
        });
        po_form.render({target: '#new_form_container_div'});
        po_form.setModel(po_model);
        app.forms["po_modal_form"] = po_form;
      },
      "onShown": function () {

      },
      "onHide": function () {
      },
      "onHidden": function () {
        //deferred.resolve('onHidden');
      }
    });

  });

  // Navigation tab links by report status
  $("#maincontent").off('click', '.tablink').on('click', '.tablink', function () {

    let newRoute = $(this).attr('data-id') + '/?ts=' + new Date().getTime() + '&status=' + $(this).attr('data-status') + '&filter=' + $(this).attr('data-filter');

    router.navigate(newRoute, {trigger: true, replace: true});
  });
  // GLOBAL SEARCH
  $("#maincontent").off('click', '.form-control-clear').on('click', '.form-control-clear', function () {
    $(this).prev('input').val('').focus();
    $(this).hide();
    myDataTable.dt.search("").draw();
  });
  $("#maincontent").off("click", "#btn_global_search").on("click", "#btn_global_search", function () {
    myDataTable.dt.search($("#admin_search").val().trim()).draw();
  });
  $("#maincontent").off("keyup", "#admin_search").on("keyup", "#admin_search", function (event) {
    $(this).next('span').toggle(Boolean($(this).val()));
    if (event.keyCode === 13) {
      $("#btn_global_search").click();
    }
  });
  $("#maincontent").off("focus", "#admin_search").on("focus", "#admin_search", function (e) {
    $("#custom-search-input").addClass("searchfocus");
  });
  $("#maincontent").off("blur", "#admin_search").on("blur", "#admin_search", function (e) {
    $("#custom-search-input").removeClass("searchfocus");
  });

  $(".form-control-clear").hide($(this).prev('input').val());

};

/**
 * Optional. Called when dashboard route is used. Render your custom application dashboard here.
 */

const welcomePage = () => {

  $('.forForm, .forView, #form_pane, #view_pane').hide();
  $('#custom-search-input, #export-menu').hide();
  $('#dashboard_pane, .forDashboard').show();
  if ($('#viewtitle').html() != config.dashboard_title) {
    $("#viewtitle").html($("<span role='alert'>" + config.dashboard_title + "</span>"));
  } else {

  }


  let base_url = config.httpHost.app[httpHost] + config.api.get + config.default_repo + "/";
  let query = "?$format=application/json;odata.metadata=none&$count=true&$select=id,status&$skip=0&$top=1&$filter=";
  let today_d = moment().startOf('day').format();
  let today_end = moment().endOf('day').format();
  let tomorrow_d = moment().add(1, 'day').endOf('day').format();
  let last_week = moment().add(-1, 'weeks').endOf('day').format();
  let last_month = moment().add(-1, 'months').endOf('day').format();
  //let welcome_template = config.welcome_template[httpHost] ? config.welcome_template[httpHost] : src_path + '/html/welcome.html';
  let welcome_template = config.dashboard_template;
  auth(true).then(function (login) {
    tpl('#dashboard_pane', welcome_template, function () {
      $('.forForm, .forView, #form_pane, #view_pane').hide();
      $('.navbar-brand').focus();
      document.title = config.title + " - " + config.dashboard_title;
      let loader = $('<img class="request_loader" src="img/loading.gif" alt="Loading requests count"/>');
      let headers = {
        "Content-Type": "application/json; charset=utf-8;",
        "Cache-Control": "no-cache",
        "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
      };
      let base_url = config.httpHost.app[httpHost] + config.api.get + config.default_repo + "/";
      let query = "?$format=application/json;odata.metadata=none&$count=true&$select=id&$skip=0&$top=1";
      $('.dashboard_count').html(loader);
      let dashboard = config.dashboard;
      $.each(dashboard, function (i, val) {

        let header = $('<span>' + val.title + '</span><span class="dashboard_info_header">(<span class="dashboard_count" ><img class="request_loader" src="img/loading.gif" alt="Loading requests count"/></span>)</span>');
        let h3 = $("#" + val.id);
        h3.html(header);
        let requests = [];
        let headerCount = 0;
        let headerObj = val;

        $.each(val.li, function (i, val) {
          let href = val.href.replace("{{today_d}}", today_d).replace("{{today_end}}", today_end).replace("{{tomorrow_d}}", tomorrow_d).replace("{{last_week}}", last_week).replace("{{last_month}}", last_month);
          let list_item = $('<a href="' + href + '">' + val.title + '</a><span class="dashboard_info">(<span class="dashboard_count" ><img class="request_loader" src="img/loading.gif" alt="Loading requests count"/></span>)</span>');
          let li = $("#" + val.id);
          li.html(list_item);
          let filter = val.filter.replace("{{today_d}}", today_d).replace("{{today_end}}", today_end).replace("{{today_end}}", today_end).replace("{{tomorrow_d}}", tomorrow_d).replace("{{last_week}}", last_week).replace("{{last_month}}", last_month);
          let url = base_url + val.entity + query + (filter ? "&$filter=" + filter : "");
          requests.push(
            $.ajax(
              {
                "headers": headers,
                "url": url,
                "success": function (this_resp) {
                  $("#" + val.id).find(".dashboard_count").html(this_resp["@odata.count"]);
                }
              })
          );
        });

        $.when.apply(undefined, requests).then(function () {
          $.ajax(
            {
              "headers": headers,
              "url": base_url + "submissions" + query,
              "success": function (this_resp) {
                //$("#" + val.id).find(".dashboard_count").html(this_resp["@odata.count"]);
                $("#" + headerObj.id).find(".dashboard_count").html(this_resp["@odata.count"]);
              }
            })
          /*
          let objects = arguments;
          $.each(objects, function (x, group_req) {
           headerCount += group_req[0]["@odata.count"];
           $("#" + headerObj.id).find(".dashboard_count").html(headerCount);
          })
          */
        });
      });
    });
  });
};

/**
 * Optional - If implemented, allows you to override and define your own routes.
 * @returns: backbone router object
 */
/*
const getRoutes = () => {

 return {
  routes: {
   '': 'homePage',
   'noaccess(/)': 'noaccess',
   'dashboard(/)': 'dashboard',
   ':formName(/)': 'frontPage',
   ':formName/new(/)': 'newPage',
   ':formName/:id(/)': 'viewEditPage',
   '*default': 'defautRoute'
  },

  defautRoute: function () {
   if (this.lastFragment !== null) {
    this.navigate(this.lastFragment, {trigger: false});
   } else {
    this.navigate('', {trigger: true});
   }
  },

  route: function (route, name, callback) {
   const oldCallback = callback || (typeof name === 'function') ? name : this[name];
   if (oldCallback !== config.defautRoute) {
    const newCallback = (...args) => {
     config.lastFragment = Backbone.history.fragment;
     oldCallback.call(this, ...args);
    };

    if (callback) {
     callback = newCallback;
    } else if (typeof name === 'function') {
     name = newCallback;
    } else {
     this[name] = newCallback;
    }
   }

   return Backbone.Router.prototype.route.call(this, route, name, callback);
  },
  noaccess: function () {
   noaccess()
  },
  homePage: function () {
   homePage();
  },
  frontPage: function (formName, query) {
   frontPage(formName, query);
  },
  newPage: function (formName, query) {
   newPage(formName, query);
  },
  viewEditPage: function (formName, id, query) {
   viewEditPage(formName, id, query)
  }

 };
};
*/
/**
 * optional - called every time the auth method is called and promise is resolved. Returns a promise.
 * @param oLogin
 * @return jQuery promise
 */


const registerAuthEvents = (oLogin) => {
  let deferred = new $.Deferred();
  let groups = JSON.parse(oLogin.groups);
/*
  if (groups.indexOf("CN=Office-Metro Hall,OU=Distribution Groups,OU=Exchange,OU=Service Accounts,DC=org,DC=ad,DC=toronto,DC=ca") > -1) {
    loadUserView("one");

    deferred.resolve();
  }

 */
  if (groups.indexOf("cn=covid19_admin,ou=production,ou=WCM,ou=Groups,o=Toronto") > -1) {
    loadUserView("one");

    deferred.resolve();
  }
  else if (groups.indexOf("cn=covid19_hotline_staff,ou=production,ou=WCM,ou=Groups,o=Toronto") > -1) {
    $("#export-menu").hide();
    loadUserView("two");
    deferred.resolve();
  }
  else {
    noaccess();
    deferred.reject();
  }

  //
  return deferred.promise();
};

/**
 * optional - called every time OpenView is called to open an entity collection in the datatable. Returns null. Can be used to hook into events on the datatable or other as need for your usecase.
 */
/*
const appInitialize = () =>{};
*/
/**
 * Optional. This can be used to provide custom logic and show/hide differnet components based on the current users access rights (based on your logic and needs). Called in the toggleView method that switches between form, dashboard and datatable views.
 */

const loadUserView = (user_type) => {
  if (!$("#view_pane").is(":visible")) {
    if (autoSave) {
      clearTimeout(autoSave);
    } else {
    }
  } else {
  }

};


/**
 * Optional. If implemented, you can provide your own logic to manage unauthorized access to data or interface. Default, the framework calls noaccess().
 */

/*
const implement_noaccess = () => {};
*/

const printPDF = (headerTextRight, footerTextLeft, watermark) => {
  let data = mymodel.toJSON();
  let content = [];
  let section = {
    style: 'wo_table',
    table: {
      widths: [125, '*'],
      body: []
    },
    layout: 'lightHorizontalLines',
    headerRows: 1
  }

  $(".panel").each(function (i) {

    let this_section = {
      style: 'wo_table',
      table: {
        widths: ['*', '*'],
        body: []
      },
      layout: 'lightHorizontalLines',
      headerRows: 1
    };
    let this_row = [];
    let panel_heading = $(this).find('.panel-heading').text();
    if (panel_heading == "Supporting Documents") {
    } else {
      this_row.push([{
        text: $(this).find('.panel-heading').text(),
        colSpan: 2,
        alignment: 'left',
        style: 'tableHeader'
      }, {}]);
      this_section.table.body.push([{
        text: $(this).find('.panel-heading').text(),
        colSpan: 2,
        alignment: 'left',
        style: 'tableHeader'
      }, {}]);
      $(this).find('.panel-body .row').each(function (index) {

        $(this).find('.form-group:visible').each(function (index, that) {
          $(this).find('.optional').empty();
          let label = $(this).find('.control-label, .staticlabel').text();
          let value = $(this).find('.form-control').val();
          if (value) {

          } else if ($(this).attr('id') === "uploadedFilesV2Element") {
            /*
            let tmp = [];
            $.each(data[$(this).attr('id').replace("Element", "")], function (i,val) {
             tmp.push(val.name);
            });
            value = tmp;
            */
          } else {
            //value = data[$(this).attr('id').replace("Element", "")];
          }
          if (label) {
            let this_row = [label, value];
            this_section.table.body.push(this_row);
          }
        });

        $(this).find('.dropzone:visible').each(function (index) {
          $.each(data[$(this).attr("id")], function (i, val) {
            let row_title = i === 0 ? "Uploaded Files" : "";
            let this_row = [row_title, val.name];
            this_section.table.body.push(this_row);
          });
        });

      });
      content.push(this_section);
    }

  });
  try {

    pdfMake.createPdf({
      watermark: {text: watermark, opacity: 0.05, bold: false},
      header: {
        margin: 10,
        columns: [
          {text: $("#viewtitle").text()},
          {alignment: 'right', text: headerTextRight}
        ]
      },
      footer: function (page, pages) {
        return {
          columns: [
            footerTextLeft,
            {
              alignment: 'right',
              text: [
                {text: page.toString(), italics: true},
                ' of ',
                {text: pages.toString(), italics: true}
              ]
            }
          ],
          margin: [10, 0]
        };
      },
      pageOrientation: 'portrait',
      content: [content],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 5, 0, 5]
        },
        wo_table: {
          fontSize: 10,
          margin: [0, 5, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black'
        }
      }
    }).download($("#viewtitle").text() + ".pdf")

  } catch (e) {

  }
  ;

};


function enhancedLogout() {
  // call to invalidate session
  // GET /session/{session id}?r={user name}
  $.ajax({
    // for v1 Auth session
    // "url": config.httpHost.app[httpHost] + config.api.authPath + config.api.authEndpoint + '/' + oLogin.session.sid + '?r='' + oLogin.username
    // for v2 Auth session
    // end point
    // DELETE /c3api_auth/v2/AuthService.svc/AuthSet('{session id}') --header 'Authorization: {user name}'
    "url": config.httpHost.app[httpHost] + config.api.authPath + config.api.authEndpoint + "('" + oLogin.session.sid + "')",
    "type": "delete",
    "async": false,
    "headers": { "Authorization": oLogin.username }
  })
    .success(function (data, jqXHR) {
      oLogin.logout();
    })
    .error(function (textStatus, error) {
      oLogin.logout();
    })
    .fail(function (textStatus, error) {
      oLogin.logout();
    });
}
