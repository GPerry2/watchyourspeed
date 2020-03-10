/**
 * @method getSubmissionSections(form_id)
 * @param form_id {string} -  the entity set/collection name
 * @return JSON
 * Returns a cot_form sections array defining the form
 */
let autoSave;
let submitForReview = () => {
  mymodel.set('action', '200');
  $('#submissions').trigger('submit');
};
cot_form.prototype.validatorOptions = (function (validatorOptions) {
  return function (fieldDefinition) {
    const retVal = validatorOptions.call(this, fieldDefinition);
    if (fieldDefinition.excluded != null) {
      retVal.excluded = fieldDefinition.excluded;
    }
    return retVal;
  };
})(cot_form.prototype.validatorOptions);

const getSubmissionSections = (form_id, data) => {

  let sections, model, registerFormEvents, registerDataLoadEvents, registerOnSaveEvents, registerPostSaveEvents,
    registerPostErrorEvents, success, defaults = {};
  switch (form_id) {
    case 'submissions':
      sections = [
        {
          id: "tabs",
          title: "",
          className: "",
          rows: [
            {
              fields: [
                {
                  id: "tabs_container",
                  type: "html",
                  html: `
<div aria-live="polite" role="status" class="sr-only"></div><div class="row">
                  <div class="row"><div class="pull-right" id="current_info_section"></div></div>

<cotui-tabs id="odata_intake" selected="tab00" label="Open Data Submission Form">
    <div data-label="Data Identification" id="tab00">
        <h2 class="sr-only">Data Identification</h2>
    </div>
    <div data-label="Upload Dataset" id="tab01">
        <h2 class="sr-only">Upload Dataset</h2>
    </div>
    <div data-label="Data Dictionary" id="tab02">
        <h2 class="sr-only">Data Dictionary</h2>
    </div>
    <div data-label="Contact Details" id="tab03">
        <h2 class="sr-only">Contact Details</h2>
    </div>
    <div data-label="Approvals" id="tab05">
        <h2 class="sr-only">Approvals</h2>
    </div>
</cotui-tabs>  </div>
`
                }
              ]
            }
          ]
        },
        {
          id: "submitter_information",
          title: "Requester Information",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'firstName',
                  title: 'First Name',
                  type: 'text',
                  required: true,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.firstName,
                  excluded: false,
                  bindTo: 'firstName'
                },
                {
                  id: 'lastName',
                  title: 'Last Name',
                  type: 'text',
                  required: true,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.lastName,
                  excluded: false,
                  bindTo: 'lastName'
                }
              ]
            },
            {
              fields:
                [
                  {
                    id: 'phone',
                    title: 'Phone Number',
                    type: 'phone',
                    required: true,
                    infohelp: config.infohelp.phone,
                    validationMessage: 'Phone numbers must be entered in a valid format', //optional, when validationtype is used or type is set to daterangepicker||datetimepicker, this can be specified to override the default error message
                    options: {preferredCountries: ['ca', 'us']},
                    htmlAttr: {maxLength: 20},
                    excluded: false,
                    bindTo: 'phone'
                  },
                  {
                    id: 'email',
                    title: 'Email',
                    required: true,
                    validationtype: "Email",
                    infohelp: config.infohelp.email,
                    htmlAttr: {maxLength: 254},
                    excluded: false,
                    bindTo: 'email'
                  }
                ]
            }
          ]
        },
        {
          id: "dataset-about",
          title: "About the Dataset",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: "datasetName",
                  bindTo: "datasetName",
                  infohelp: config.infohelp.datasetName,
                  title: "Dataset Name",
                  type: "text",
                  excluded: false,
                  required: true
                },
                {
                  id: "division",
                  bindTo: "division",
                  infohelp: config.infohelp.division,
                  title: "Division/Agency/Corporation ",
                  type: "dropdown",
                  choices: config.choices.divisions,
                  excluded: false,
                  required: true
                },
                {
                  id: "department",
                  bindTo: "department",
                  infohelp: config.infohelp.department,
                  title: "Section",
                  type: "text",
                  excluded: false,
                  required: false
                },
                {
                  id: "unit",
                  bindTo: "unit",
                  title: "Unit",
                  type: "text",
                  excluded: false,
                  required: false
                }
              ]
            },
            {
              fields: [
                {
                  id: "website",
                  bindTo: "website",
                  infohelp: config.infohelp.website,
                  title: "Website URL",
                  type: "text",
                  validationtype: "URL",
                  excluded: false,
                  required: false
                },
                {
                  id: "website_embedded",
                  bindTo: "website_embedded",
                  infohelp: config.infohelp.website_embedded,
                  title: "Toronto.ca URL containing data embedded in digital artifact/report",
                  type: "text",
                  validationtype: "URL",
                  excluded: false,
                  required: false
                }
              ]
            },
            {
              fields: [
                {
                  id: "city_open_data",
                  bindTo: "city_open_data",
                  type: "radio",
                  choices: config.choices.yesNo,
                  required: true,
                  excluded: false,
                  title: "Does this data exist as open information on the City’s public facing infrastructure (e.g. toronto.ca)",
                  orientation: 'horizontal'
                }
              ]
            }
          ]
        },
        {
          id: "dataset-description",
          title: "Describe the data",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: "fullDescription",
                  bindTo: "fullDescription",
                  infohelp: config.infohelp.fullDescription,
                  title: "Full Description",
                  posthelptext: "<span id='fullDescriptionLongMax' class='pull-left'></span><span id='fullDescriptionLongMaxLength' class='pull-right'></span>",
                  htmlAttr: {maxlength: config.long_text_max},
                  type: "textarea",
                  excluded: false,
                  required: true
                }
              ]
            },
            {
              fields: [
                {
                  id: "shortDescription",
                  bindTo: "shortDescription",
                  infohelp: config.infohelp.shortDescription,
                  title: "Short Description",
                  posthelptext: "<span id='shortDescriptionLongMax' class='pull-left'></span><span id='shortDescriptionLongMaxLength' class='pull-right'></span>",
                  htmlAttr: {maxlength: config.short_text_max},
                  type: "textarea",
                  excluded: false,
                  required: true
                },
                {
                  id: "limitations",
                  bindTo: "limitations",
                  infohelp: config.infohelp.limitations,
                  title: "Limitations",
                  posthelptext: "<span id='limitationLongMax' class='pull-left'></span><span id='limitationLongMaxLength' class='pull-right'></span>",
                  htmlAttr: {maxlength: config.limitation_text_max},
                  type: "textarea",
                  excluded: false,
                  required: true
                }
              ]
            },
            {
              fields: [
                {
                  id: "categoryOne",
                  bindTo: "categoryOne",
                  infohelp: config.infohelp.categoryOne,
                  title: "Category 1",
                  type: "dropdown",
                  choices: config.choices.categories,
                  excluded: false,
                  required: true
                },
                {
                  id: "categoryTwo",
                  bindTo: "categoryTwo",
                  infohelp: config.infohelp.categoryTwo,
                  title: "Category 2",
                  type: "dropdown",
                  choices: config.choices.categories,
                  excluded: false,
                  required: false
                },
                {
                  id: "categoryThree",
                  bindTo: "categoryThree",
                  infohelp: config.infohelp.categoryThree,
                  title: "Category 3",
                  type: "dropdown",
                  choices: config.choices.categories,
                  excluded: false,
                  required: false
                }
              ]
            },
            {
              fields: [
                {
                  id: "civicAlignment",
                  bindTo: "civicAlignment",
                  infohelp: config.infohelp.civicAlignment,
                  title: "Civic Issue alignment",
                  type: "dropdown",
                  choices: config.choices.civicIssueAlignment,
                  excluded: false,
                  required: true
                },
                {
                  id: "tags",
                  type: "text",
                  bindTo: "tags",
                  title: "Key Words",
                  choices: config.choices.tags,
                  excluded: false,
                  required: true
                }
              ]
            }
          ]
        },
        {
          id: "dataset-refresh",
          title: "Currency and Refresh Information",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: "refreshFrequency",
                  bindTo: "refreshFrequency",
                  infohelp: config.infohelp.refreshFrequency,
                  title: "Frequency",
                  type: "dropdown",
                  choices: config.choices.Frequency,
                  excluded: false,
                  required: true
                },
                {
                  id: "refreshFrequencyOther",
                  bindTo: "refreshFrequencyOther",
                  infohelp: config.infohelp.refreshFrequencyOther,
                  title: "Other Frequency",
                  type: "text",
                  excluded: false,
                  validators: {
                    callback: {
                      message: "",
                      callback: (input) => {
                        return $("#refreshFrequency").val() === "Other" && input === "" ? {
                          valid: false,
                          message: "Other Frequency Type Required"
                        } : true;
                      }
                    }
                  }
                },
                {
                  id: "refreshStart",
                  bindTo: "refreshStart",
                  infohelp: config.infohelp.refreshStart,
                  title: "Start Period",
                  type: "datetimepicker",
                  options: {
                    format: config.dateFormat
                  },
                  excluded: false,
                  required: true
                },
                {
                  id: "refreshEnd",
                  bindTo: "refreshEnd",
                  infohelp: config.infohelp.refreshEnd,
                  title: "End Period",
                  type: "datetimepicker",
                  options: {
                    format: config.dateFormat
                  },
                  excluded: false,
                  required: true
                }
              ]
            },
            {
              fields: [
                {
                  id: "refreshType",
                  bindTo: "refreshType",
                  infohelp: config.infohelp.refreshType,
                  title: "How will the data get updated?",
                  type: "radio",
                  choices: config.choices.refreshType,
                  excluded: false,
                  required: true
                },
                {
                  id: "refreshNotes",
                  bindTo: "refreshNotes",
                  infohelp: config.infohelp.refreshNotes,
                  title: "Notes",
                  type: "textarea",
                  posthelptext: "<span id='notesLongMax' class='pull-left'></span><span id='notesLongMaxLength' class='pull-right'></span>",
                  htmlAttr: {maxlength: config.notes_text_max},
                  excluded: false,
                  required: true
                }
              ]
            },
            {
              fields: [
                {
                  id: "geospatialEnv",
                  bindTo: "geospatialEnv",
                  infohelp: config.infohelp.geospatialEnv,
                  title: "What environment is your geospatial data currently available in?",
                  type: "text",
                  prehelptext: "Geospatial data ONLY",
                  excluded: false,
                  required: true
                }
              ]
            }
          ]
        },
        {
          id: "dataset-upload",
          title: "Upload your data",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: "currentDataLocation",
                  bindTo: "currentDataLocation",
                  infohelp: config.infohelp.currentDataLocation,
                  title: "Where is the data currently being maintained or stored? ",
                  type: "dropdown",
                  choices: config.choices.dataStorage,
                  required: true,
                  excluded: false,
                },
                {
                  id: "currentDataLocationOther",
                  bindTo: "refreshFrequencyOther",
                  infohelp: config.infohelp.currentDataLocationOther,
                  title: "Other Data Location",
                  type: "text",
                  excluded: false,
                  validators: {
                    callback: {
                      message: "",
                      callback: (input) => {
                        return $("#currentDataLocation").val() === "Other" && input.trim() == "" ? {
                          valid: false,
                          message: "Other Data Location Required"
                        } : true;
                      }
                    }
                  }
                }
              ]
            },
            {
              fields: [

                {
                  id: "currentDataFormat",
                  bindTo: "currentDataFormat",
                  infohelp: config.infohelp.currentDataFormat,
                  title: "Data format ",
                  type: "dropdown",
                  choices: config.choices.Format,
                  excluded: false,
                  required: true
                },
                {
                  id: "currentDataFormatOther",
                  bindTo: "currentDataFormatOther",
                  infohelp: config.infohelp.currentDataFormatOther,
                  title: "Other Data Format",
                  type: "text",
                  excluded: false,
                  validators: {
                    callback: {
                      message: "",
                      callback: (input) => {
                        return $("#currentDataFormat").val() === "Other" && input.trim() == "" ? {
                          valid: false,
                          message: "Other Data Format Required"
                        } : true;
                      }
                    }
                  }
                }
              ]
            },
            {
              fields: [
                {
                  id: "collection_method",
                  bindTo: "collection_method",
                  title: "How is the data collected?",
                  infohelp: config.infohelp.collection_method,
                  type: "textarea",
                  excluded: false,
                  required: true
                }
              ]
            },
            {
              fields: [
                {
                  id: "uploads ",
                  bindTo: 'uploads',
                  type: 'dropzone',
                  infohelp: config.infohelp.uploads,
                  allowFormsubmitionWithUploadError: false,
                  options: {
                    fields: [
                      {
                        title: 'Description',
                        name: 'description',
                        type: 'textarea',
                        required: true
                      }],
                    autoQueue: true,
                    url: config.httpHost.app[httpHost] + config.api.upload + config.default_repo + "/" + data.id
                  }
                }
              ]
            }
          ]
        },
        {
          id: "dataset-dictionary",
          title: "Data Dictionary",
          className: 'panel-default',
          rows: [
            {
              fields: []
            },
            {
              "repeatControl": {
                "id": "datasetDictionary",
                "bindTo": "datasetDictionary",
                "title": "",
                "min": -1,
                "max": -1,
                "rows": [
                  {
                    "fields": [
                      {"id": "Column", "bindTo": "Column", "title": "Field Name", "required": true},
                      {"id": "Label", "bindTo": "Label", "title": "Alias", "required": true},
                      {
                        "id": "Description",
                        "bindTo": "Description",
                        "title": "Field Description",
                        "type": "textarea",
                        "required": true
                      },
                      {"id": "Notes", "bindTo": "Notes", "title": "Notes", "type": "textarea", "required": false}
                    ]
                  }
                ]
              }
            }
          ]
        },
        {
          id: "technical-contact",
          title: "Technical Contact Information",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: "technical_lookup",
                  type: "html",
                  class: "col-xs-4",
                  html: `
                      <cotui-autosuggest
                      id="tc_ldap_lookup"
                        label="Lookup Technical Contact (Data Custodian)"
                        limit="7"
                        icon="fas fa-user"
                        button="Lookup"
                        type="custom"
                        data-api-text="text"
                        data-api-value="value"
                        query=""
                         >
                         <template>
                            <p>
                              {{fullName}} ({{uid}})<br/>
                              {{title}} -
                              {{cotDivision}}
                            </p>
                          </template>
                      </cotui-autosuggest>
                  `
                }
              ]
            },
            {
              fields: [
                {
                  id: 'technicalContactName',
                  title: 'Technical Contact',
                  type: 'text',
                  disabled: true,
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.technicalContact,
                  bindTo: 'technicalContactName'
                },
                {
                  id: 'technicalContactUID',
                  title: 'Technical Contact LDAP ID',
                  type: 'text',
                  disabled: true,
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.technicalContactUID,
                  bindTo: 'technicalContactUID'
                },
                {
                  id: 'technicalContactPhone',
                  title: 'Technical Contact Phone',
                  type: 'text',
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.technicalContactPhone,
                  bindTo: 'technicalContactPhone'
                },
                {
                  id: 'technicalContactEmail',
                  title: 'Technical Contact Email',
                  type: 'text',
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.technicalContactEmail,
                  bindTo: 'technicalContactEmail'
                }
              ]
            }
          ]
        },
        {
          id: "business-contact",
          title: "Business Contact Information",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: "business_lookup",
                  type: "html",
                  class: "col-xs-4",
                  html: `
                      <cotui-autosuggest
                      id="bc_ldap_lookup"
                        label="Lookup Business Contact (Data Steward)"
                        limit="7"
                        icon="fas fa-user"
                        button="Lookup"
                        type="custom"
                        data-api-text="text"
                        data-api-value="value"
                        query=""
                         >
                         <template>
                            <p>
                              {{fullName}} ({{uid}})<br/>
                              {{title}} -
                              {{cotDivision}}
                            </p>
                          </template>
                      </cotui-autosuggest>
                  `
                }
              ]
            },
            {
              fields: [
                {
                  id: 'businessContactName',
                  title: 'Business Contact',
                  type: 'text',
                  disabled: true,
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.businessContact,
                  bindTo: 'businessContactName'
                },
                {
                  id: 'businessContactUID',
                  title: 'Business Contact LDAP ID',
                  type: 'text',
                  disabled: true,
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.businessContactUID,
                  bindTo: 'businessContactUID'
                },
                {
                  id: 'businessContactPhone',
                  title: 'Business Contact Phone',
                  type: 'text',
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.businessContactPhone,
                  bindTo: 'businessContactPhone'
                },
                {
                  id: 'businessContactEmail',
                  title: 'Business Contact Email',
                  type: 'text',
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.businessContactEmail,
                  bindTo: 'businessContactEmail'
                }
              ]
            }
          ]
        },
        {
          id: "public-contact",
          title: "Public Contact Information",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'publicContactName',
                  title: 'Public Contact',
                  type: 'text',
                  required: false,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.publicContact,
                  bindTo: 'publicContactName'
                },
                {
                  id: 'publicContactPhone',
                  title: 'Public Contact Phone',
                  type: 'text',
                  required: false,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.publicContactPhone,
                  bindTo: 'publicContactPhone'
                },
                {
                  id: 'publicContactEmail',
                  title: 'Public Contact Email',
                  type: 'text',
                  required: false,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.publicContactPhone,
                  bindTo: 'publicContactPhone'
                }
              ]
            }
          ]
        },
        {
          id: "dataset-privacy",
          title: "Privacy Review",
          className: 'panel-default',
          rows: [
            {
              fields: []
            }
          ]
        },
        {
          id: "dataset-approvals",
          title: "Approvals",
          className: 'panel-default',
          rows: [
            {
              fields: [
                {
                  id: "approver_lookup",
                  type: "html",
                  class: "col-xs-6",
                  html: `
                      <cotui-autosuggest
                      id="manager_ldap_lookup"
                        label="Select Approver"
                        limit="7"
                        icon="fas fa-user"
                        button="Lookup"
                        type="custom"
                        data-api-text="text"
                        data-api-value="value"
                        query=""
                         >
                         <template>
                            <p>
                              {{givenName}} {{sn}} ({{uid}})<br/>
                              {{title}} -
                              {{cotDivision}}
                            </p>
                          </template>
                      </cotui-autosuggest>
                  `
                }
              ]
            },
            {
              fields: [
                {
                  id: 'approverName',
                  title: 'Approver Name',
                  type: 'text',
                  disabled: true,
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.approverName,
                  bindTo: 'approverName'
                },
                {
                  id: 'approverUID',
                  title: 'Approver LDAP ID',
                  type: 'text',
                  required: true,
                  disabled: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.approverUID,
                  bindTo: 'approverUID'
                },
                {
                  id: 'approverPhone',
                  title: 'Technical Contact Phone',
                  type: 'text',
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.technicalContactPhone,
                  bindTo: 'approverPhone'
                },
                {
                  id: 'approverEmail',
                  title: 'Technical Contact Email',
                  type: 'text',
                  required: true,
                  excluded: false,
                  htmlAttr: {maxLength: 100},
                  infohelp: config.infohelp.technicalContactPhone,
                  bindTo: 'approverEmail'
                }
              ]
            }
          ]
        }
      ];
      model = new CotModel({
        "firstName": "",
        "lastName": "",
        "phone": "",
        "email": "",
        "datasetName": "",
        "division": "",
        "department": "",
        "unit": "",
        "website": "",
        "website_embedded": "",
        "city_open_data": "",
        "currentDataLocation": "",
        "currentDataFormatOther": "",
        "currentDataFormat": "",
        "currentDataFormatOther": "",
        "fullDescription": "",
        "shortDescription": "",
        "limitations": "",
        "categoryOne": "",
        "categoryTwo": "",
        "categoryThree": "",
        "tags": "",
        "civicAlignment": "",
        "refreshFrequency": "",
        "collection_method": "",
        "refreshStart": "",
        "refreshEnd": "",
        "refreshType": "",
        "refreshNotes": "",
        "geospatialEnv": "",
        "uploads": [],
        "approver": {},
        "approverName": "",
        "approverUID": "",
        "approverPhone": "",
        "approverEmail": "",
        "datasetDictionary": new CotCollection([]),
        "technicalContact": {},
        "technicalContactName": "",
        "technicalContactUID": "",
        "technicalContactPhone": "",
        "technicalContactEmail": "",
        "businessContact": {},
        "businessContactName": "",
        "businessContactUID": "",
        "businessContactPhone": "",
        "businessContactEmail": "",
        "publicContactName": "",
        "publicContactPhone": "",
        "publicContactEmail": "",
        "action": "",
        "auditHistory": []
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
              "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
              "Content-Type": "application/json; charset=utf-8;",
              "Cache-Control": "no-cache"
            }
          });
        }
      };

      registerFormEvents = (data) => {

        $("#form_pane").off("err.form.fv", "#submissions").on("err.form.fv", "#submissions", function (e) {
          let message = [];
          let first_section = null;
          let has_error = [];
          $("#submissions .help-block [data-fv-result=INVALID]").each(
            function (i, val) {
              let tab = $(val).closest("div [data-label]");
              first_section = first_section ? first_section : tab.attr('id');
              message.push("" + tab.attr('data-label') + " ");
              has_error.push(tab.attr('id'));
            });
          let tabs = [...new Set(message)];

          cot_app.showModal({
            title: "Form Validation Failed",
            body: "<p>The following tabs have mandatory fields:</p><ul><li>" + tabs.join("<li>") + "</ul>",
            originatingElement: $("#menu-save")
          });

          let select_tab = has_error.indexOf(document.querySelector('cotui-tabs').selected) > -1 ? document.querySelector('cotui-tabs').selected : first_section;


          document.querySelector('cotui-tabs').select(select_tab);

        });

        ariaLive = document.querySelector('[aria-live="polite"]');
        if (data && data.id) {
          $("#current_info_section").html("Last Modified: " + moment(data.__ModifiedOn).format(config.dateTimeFormat));
          if (data.refreshFrequency === "Other") {
            $("#refreshFrequencyOtherElement").show();
          } else {
            $("#refreshFrequencyOtherElement").hide();
          }
          if (data.currentDataLocation === "Other") {
            $("#currentDataLocationOtherElement").show();
          } else {
            $("#currentDataLocationOtherElement").hide();
          }
          if (data.currentDataFormat === "Other") {
            $("#currentDataFormatOtherElement").show();
          } else {
            $("#currentDataFormatOtherElement").hide();
          }

          $("#form_pane").off("change", "#refreshFrequency").on("change", "#refreshFrequency",
            function (e) {
              $("#submissions").formValidation('revalidateField', 'refreshFrequencyOther');
              if ($(this).val() === "Other") {
                $("#refreshFrequencyOtherElement").show();
                ariaLive.innerHTML = "Frequency other selected, please enter the other";

              } else {
                $("#refreshFrequencyOtherElement").hide();
                $("#refreshFrequencyOther").val("").change();
                ariaLive.innerHTML = "Frequency other deselected";
              }

            });

          $("#form_pane").off("change", "#currentDataLocation").on("change", "#currentDataLocation",
            function (e) {
              $("#submissions").formValidation('revalidateField', 'currentDataLocationOther');
              if ($(this).val() === "Other") {
                $("#currentDataLocationOtherElement").show();
                ariaLive.innerHTML = "Current data location other selected, please enter the other value";

              } else {
                $("#currentDataLocationOtherElement").hide();
                $("#currentDataLocationOther").val("").change();
                ariaLive.innerHTML = "Frequency other deselected. Other value cleared.";
              }

            });

          $("#form_pane").off("change", "#currentDataFormat").on("change", "#currentDataFormat",
            function (e) {
              $("#submissions").formValidation('revalidateField', 'currentDataFormatOther');
              if ($(this).val() === "Other") {
                $("#currentDataFormatOtherElement").show();
                ariaLive.innerHTML = "Current Data Format other selected, please enter the other value";

              } else {
                $("#currentDataFormatOtherElement").hide();
                $("#currentDataFormatOther").val("").change();
                ariaLive.innerHTML = "Current Data Format other deselected. Other value cleared.";
              }

            });

          $('#fullDescriptionLongMax').html(config.long_text_max + ' characters maximum');
          $('#fullDescriptionLongMaxLength').html((config.long_text_max - data.fullDescription && data.fullDescription.length ? data.fullDescription.length : 0) + ' characters remaining');
          $('#fullDescription').keyup(function () {
            $('#fullDescriptionLongMaxLength').html(config.long_text_max - $(this).val().length + ' characters remaining');
          });

          $('#shortDescriptionLongMax').html(config.short_text_max + ' characters maximum');
          $('#shortDescriptionLongMaxLength').html((config.short_text_max - data.shortDescription && data.shortDescription.length ? data.shortDescription.length : 0) + ' characters remaining');
          $('#shortDescription').keyup(function () {
            $('#shortDescriptionLongMaxLength').html(config.long_text_max - $(this).val().length + ' remaining');
          });

          $('#limitationLongMax').html(config.limitation_text_max + ' characters maximum');
          $('#limitationLongMaxLength').html((config.limitation_text_max - data.limitations && data.limitations.length ? data.limitations.length : 0) + ' characters remaining');
          $('#limitations').keyup(function () {
            $('#limitationLongMaxLength').html(config.limitation_text_max - $(this).val().length + ' characters remaining');
          });

          $('#notesLongMax').html(config.notes_text_max + ' characters maximum');
          $('#notesLongMaxLength').html((config.notes_text_max - data.refreshNote && data.refreshNotes.length ? data.refreshNotes.length : 0) + ' characters remaining');
          $('#refreshNotes').keyup(function () {
            $('#notesLongMaxLength').html(config.notes_text_max - $(this).val().length + ' characters remaining');
          });

          $("#maincontent").off("click", "#menu-save-continue").on("click", "#menu-save-continue", function (e) {
            e.preventDefault();

            let payload = model.toJSON();
            let id = payload.id;
            $.ajax({
              "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/submissions('" + id + "')",
              "data": JSON.stringify(model.toJSON()),
              "global": true,
              "type": "PATCH",
              "complete": function (data) {

              },
              "success": function (data) {
                $("#current_info_section").html("Last Modified: " + moment(data.__ModifiedOn).format(config.dateTimeFormat));

              },
              "error": function (error) {
                console.warn("error silent save", error);
              },
              "headers": {
                "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
                "Content-Type": "application/json; charset=utf-8;",
                "Cache-Control": "no-cache"
              }
            });
          });

          const handleSelected = (id, res) => {
            //model.set(id + "Name", res.text);
            //model.set(id + "UID", res.value);
            delete res.data["__CreatedOn"];
            delete res.data["__ModifiedOn"];
            delete res.data["__Owner"];
            delete res.data["__Status"];
            model.set(id, res.data);

            $("#" + id + "Name").val(res.text).change();
            $("#" + id + "UID").val(res.value).change();
            $("#" + id + "Phone").val(res.data.telephoneNumber).change();
            $("#" + id + "Email").val(res.data.mail).change();

            $("#submissions")
              .formValidation('revalidateField', id + "Name")
              .formValidation('revalidateField', id + "UID")
              .formValidation('revalidateField', id + "Phone")
              .formValidation('revalidateField', id + "Email");
            ariaLive.innerHTML = id + " selected";

          };

          const customSearch = (query) => {
            query = query.toLowerCase().trim();
            let filter = [];
            let arr_query = query.split(" ").filter(function(v){return v!==''});
            let url =
              config.staff_directory.root +
              config.staff_directory.service +
              config.staff_directory.resource ;
            //url += "?unwrap=true&$skip=0&$top=10&$format=application/json;odata.metadata=none&$search=\"" + query + "\"";
            url +="?unwrap=true&$skip=0&$top=100&$format=application/json;odata.metadata=none&$filter=";
            url +="(";
            arr_query.forEach((val, i)=>{
              filter.push("contains(tolower(sn), '" + val + "')");
              //filter.push("contains(tolower(fullName), '" + val + "')");
              filter.push("contains(tolower(givenName), '" + val+ "')");
              filter.push("contains(tolower(mail), '" + val + "')");
              //filter.push("contains(tolower(title), '" + val + "')");
              filter.push("contains(tolower(uid), '" + val + "')");
            });
            url += filter.join(" or ");
            url +=")";
            url += " and (objectClass eq 'user')";
            url += "&$orderby=sn desc,givenName desc";
            return fetch(encodeURI(url)).then(res => res.json()).then(res => {
              console.log('res',res);
              if(arr_query.length >=1) {
                res.sort((a, b) => {
                  console.log(a.sn);
                  let tmp = 0;
                  if(
                    a.sn.toLowerCase().indexOf(arr_query[1]) >-1
                  ){tmp = -1}
                  //else if(a.sn.toLowerCase().indexOf(arr_query[1]) >-1 ){tmp = -1 }
                  //else if(a.givenName.toLowerCase().indexOf(arr_query[0])){tmp = -1}
                  return tmp;
                });
              }
              console.log('res pre map', res);
              let mymap =  res.map(res => {
                return {
                  text: res.givenName + " " + res.sn,
                  value: res.uid,
                  data: res
                }
              });
              console.log("map",mymap);
              return mymap.slice(0,15);
            });
          };

          let manager_ldap_lookup = document.getElementById('manager_ldap_lookup');
          let tc_ldap_lookup = document.getElementById('tc_ldap_lookup');
          let bc_ldap_lookup = document.getElementById('bc_ldap_lookup');

          if (manager_ldap_lookup) {
            manager_ldap_lookup.onselected = handleSelected.bind(this, "approver");
            manager_ldap_lookup.customSearch = customSearch;
          }
          if (tc_ldap_lookup) {
            tc_ldap_lookup.onselected = handleSelected.bind(this, "technicalContact");
            tc_ldap_lookup.customSearch = customSearch;
          }
          if (bc_ldap_lookup) {
            bc_ldap_lookup.onselected = handleSelected.bind(this, "businessContact");
            bc_ldap_lookup.customSearch = customSearch;
          }

          last_payload = model.toJSON();
          delete last_payload["__CreatedOn"];
          delete last_payload["__ModifiedOn"];
          delete last_payload["__Owner"];
          delete last_payload["__Status"];

          autoSave = setInterval(registerAutoSave, 30000);

          $("#submitter_information").appendTo("#tab00");
          $("#dataset-about").appendTo("#tab00");
          $("#dataset-description").appendTo("#tab00");
          $("#dataset-refresh").appendTo("#tab00");
          $("#dataset-upload").appendTo("#tab01");
          $("#dataset-dictionary").appendTo("#tab02");
          $("#technical-contact").appendTo("#tab03");
          $("#business-contact").appendTo("#tab03");
          $("#public-contact").appendTo("#tab03");
          $("#dataset-privacy").hide();
          $("#dataset-approvals").appendTo("#tab05");

        } else {
          /*New Form load in users credentials*/

        }
      };
      // success: If you want to hijack the framework base functionality to POST/PATCH the entity then implement the success method.
      /*

      success = () => {
        event.preventDefault();
        console.log("Form Success: Now you control the form submission");
      };
      */

      //registerDataLoadEvents: Make modification before form render. Make changes to the model for example. this method can return a promise OR can be implemented without a promise.
      /*
      registerDataLoadEvents = (data) =>{
        console.log("registerDataLoadEvents: Make modification before form render. Make changes to the model for example", data);
      };
      */

      //"registerFormEvents: Do something like add in addition form elements, hide elements ect"
      registerDataLoadEvents = async function (data) {
        if (data && data.id) {
          window.mymodel = model;
        }
      };


      //registerOnSaveEvents: Do something on save like modify the payload before AJAX call . this method can return a promise OR can be implemented without a promise

      registerOnSaveEvents = (data) => {
       // console.log("registerOnSaveEvents: Do something on save like modify the payload before AJAX call.", data, data.action);
        if (data.action) {
          let action = {
            "uid": Cookies.get(config.default_repo + ".cot_uname"),
            "user": Cookies.get(config.default_repo + ".cot_firstName") + " " + Cookies.get(config.default_repo + ".cot_lastName"),
            "logged": moment().format(),
            "action": data.action,
            "actionText": config.status[data.action]
          };
          data.auditHistory.push(action);
          data.status = data.action;
        }
        data.action = "";
      };

      /*
      registerOnSaveEvents = async function (data, formConfig){
        console.log("registerOnSaveEvents: Do something on save like modify the payload before AJAX call.", data);
        let settings = {
          "url": "/c3api_data/v2/DataAccess.svc/odata_intake/submissions?$format=application/json;odata.metadata=none&$count=true&$select=id&$top=1",
          "type": "GET",
          "headers": {
            "Content-Type": "application/json; charset=utf-8;"
          },
          "dataType": "json",
          "success": (get_data) =>{ console.log('Submission count pre-save' , get_data['@odata.count']);}
        };
        let promise = new Promise((resolve, reject) => {
          $.ajax(settings).always(function(){
            console.log("registerDataLoadEvents work is done, now resolve the promise");
            resolve(data);
          });
        });
        await promise;
      };
      */
      //registerPostSaveEvents: Do something post save like change the route or display additional date.
      //Note: If registerPostSaveEvents is implemented, you need to manage the state change after", data);
      //This method can return a promise OR can be implemented without a promise
      /*
      registerPostSaveEvents = (data) => {
        console.log("registerPostSaveEvents: Do something post save like change the route or display additional date. Note: If registerPostSaveEvents is implemented, you need to manage the state change after", data);
        router.navigate(form_id + '/' + data.id + '/?alert=success&msg=save.done&ts=' + new Date().getTime(), {
          trigger: true,
          replace: true
        });
      };
      */
      /*
      registerPostSaveEvents= async function (data, formConfig){
        console.log("registerPostSaveEvents: Do something post save like change the route or display additional date. Note: If registerPostSaveEvents is implemented, you need to manage the state change after", data);
        let settings = {
          "url": "/c3api_data/v2/DataAccess.svc/odata_intake/submissions?$format=application/json;odata.metadata=none&$count=true&$select=id&$top=1",
          "type": "GET",
          "headers": {
            "Content-Type": "application/json; charset=utf-8;"
          },
          "dataType": "json",
          "success": (get_data) =>{ console.log('Post Save submission count:',get_data['@odata.count']);}
        };
        let promise = new Promise((resolve, reject) => {
          $.ajax(settings).always(function(){
            console.log("registerPostSaveEvents work is done, now resolve the promise");
            resolve(data);
          });
        });
        await promise;
      };
      */
      //registerPostErrorEvents: Do something post save error like change the route or display additional date.
      //This method can return a promise OR can be implemented without a promise
      /*
      registerPostErrorEvents = (jqXHR, textStatus) => {
        console.log("registerPostErrorEvents manage ajax errors if required.", jqXHR, textStatus);
      };
      */
      /*
      registerPostErrorEvents= async function (data, formConfig){
        console.log("registerPostErrorEvents: Do something post save error like change the route or display additional date.", data);
        let settings = {
          "url": "https://was-intra-sit.toronto.ca/c3api_data/v2/DataAccess.svc/odata_intake/submissions?$format=application/json;odata.metadata=none&$count=true&$select=id&$top=1",
          "type": "GET",
          "headers": {
            "Content-Type": "application/json; charset=utf-8;"
          },
          "dataType": "json",
          "success": (get_data) =>{ console.log('Post Save submission count:',get_data['@odata.count']);}
        };
        let promise = new Promise((resolve, reject) => {
          $.ajax(settings).always(function(){
            console.log("registerPostErrorEvents work is done, now resolve the promise");
            resolve(data);
          });
        });
        await promise;
      };
      */
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
        {
          data: 'userID',
          title: 'userID',
          filter: false,
          restrict: "userID eq '" + Cookies.get(config.default_repo + ".cot_uname") + "'",
          visible: false
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
        {"data": "datasetName", "title": "Dataset Name", "filter": true, "type": "text"},
        {
          "data": "status", "title": "Status", "filter": true, "type": "dropdown",
          "filterChoices": config.choices.status,
          "render": function (data) {
            return config.status[data]
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
  $.ajaxSetup({cache: false});

  let cur_user = getCookie(config.default_repo + '.cot_uname') && getCookie(config.default_repo + '.cot_uname') !== "" ? getCookie(config.default_repo + '.cot_uname') : "not set"
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
    auth(true).then(function (login) {
      let po_model = new CotModel({"datasetName": "", "status": "Draft"});
      let settings = {
        "url": config.httpHost.auth[httpHost] + config.api.authPath + config.api.authEndpoint + "('" + Cookies.get(config.default_repo + ".sid") + "')",
        "type": "GET",
        "headers": {
          "Content-Type": "application/json; charset=utf-8;"
        },
        "dataType": "json",
        "success": (get_data) => {
        }
      };

      $.ajax(settings).always(function (get_data) {

        let action = {
          "uid": get_data.userID,
          "user": get_data.cotUser.firstName + " " + get_data.cotUser.lastName,
          "logged": moment().format(),
          "action": "100",
          "actionText": config.status["100"]
        };

        po_model
          .set("firstName", get_data.cotUser.firstName)
          .set("lastName", get_data.cotUser.lastName)
          .set("unit", get_data.cotUser.unit)
          .set("department", get_data.cotUser.department)
          .set("division", get_data.cotUser.division)
          .set("userID", get_data.userID)
          .set("employeeNumber", get_data.employeeNumber)
          .set("jobTitle", get_data.jobTitle)
          .set("email", get_data.email)
          .set("fullDescription", "")
          .set("shortDescription", "")
          .set("refreshNotes", "")
          .set("limitations", "")
          .set("status", "100")/*draft*/
          .set("auditHistory", [action]);


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
                          id: "datasetName",
                          bindTo: "datasetName",
                          title: "Dataset Name",
                          type: "text",
                          required: true
                        }
                      ]
                    },
                    {
                      fields: [
                        {
                          id: "update_pr_price_submit_html",
                          type: "html",
                          html: `<button id="po_price_submit" class="btn btn-success">Create new request</button>`
                        }
                      ]
                    }
                  ]
                }
              ],
              success: function (event) {
                event.preventDefault();
                let payload = {}, dateStamp = moment().toISOString();

                if (po_modal && po_modal.modal) {
                  po_modal.modal('toggle');
                }
                payload = po_model.toJSON();
                /*
                delete payload["__CreatedOn"];
                delete payload["__ModifiedOn"];
                delete payload["__Owner"];
                delete payload["__Status"];
                delete payload["id"];
                delete payload["status"];
                */
                $.ajax({
                  "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/submissions",
                  "data": JSON.stringify(payload),
                  "async": true,
                  "type": "POST",
                  "headers": {
                    "Authorization": "AuthSession " + getCookie(config.default_repo + '.sid'),
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

                  })
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
/*
const welcomePage = () => {

  $('.forForm, .forView, #form_pane, #view_pane').hide();
  $('#custom-search-input, #export-menu').hide();
  $('#dashboard_pane, .forDashboard').show();
  if ($('#viewtitle').html() != config.dashboard_title) {
    $("#viewtitle").html($("<span role='alert'>" + config.dashboard_title + "</span>"));
  }
  else {

  }


  let base_url = config.httpHost.app[httpHost] + config.api.get + config.default_repo + "/";
  let query = "?$format=application/json;odata.metadata=none&$count=true&$select=id,status&$skip=0&$top=1&$filter=";
  let today_d = moment().startOf('day').format();
  let today_end = moment().endOf('day').format();
  let tomorrow_d = moment().add(1, 'day').endOf('day').format();
  let last_week = moment().add(-1, 'weeks').endOf('day').format();
  let last_month = moment().add(-1, 'months').endOf('day').format();
  //let welcome_template = config.welcome_template[httpHost]  ? config.welcome_template[httpHost] : src_path + '/html/welcome.html';
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
        });
      });
    });
  });
};
*/
/**
 *  Optional - If implemented, allows you to override and define your own routes.
 *  @returns: backbone router object
 */
/*
const getRoutes = () => {
  console.log('custom getRoutes implemented');
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

/*
const registerAuthEvents = (oLogin) =>{
  let deferred = new $.Deferred();
  console.log('registerAuthEvents', oLogin);
  deferred.resolve();
  return deferred.promise();
};
*/
/**
 *  optional - called every time OpenView is called to open an entity collection in the datatable. Returns null. Can be used to hook into events on the datatable or other as need for your usecase.
 */

const appInitialize = () => {
//if(autoSave){clearTimeout(autoSave);}
};

/**
 * Optional. This can be used to provide custom logic and show/hide differnet components based on the current users access rights (based on your logic and needs). Called in the toggleView method that switches between form, dashboard and datatable views.
 */

const loadUserView = () => {
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
