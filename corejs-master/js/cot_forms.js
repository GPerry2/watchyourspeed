var browser = navigator.userAgent;
var IEversion = 99;
IEversion = (browser.indexOf("MSIE") > 1) ? parseInt(browser.substr(browser.indexOf("MSIE") + 5, 5)) : IEversion;

var cot_form = function(o) {
    this.id = o.id; //the id to assign this form. this is used for the associated HTML form element id
    this.title = o.title; //if specified, an H2 is added to the top of the form with this text in it
    this.success = o.success; //a function to call after form validation passes
    this.sections = [];
};

cot_form.addDefaultFieldProperties = function(fields) {
    cot_form.fixClassProperty(fields);
    (fields || []).forEach(function(fld){
        fld.type = fld['type'] || 'text';
        fld.id = fld['id'] || Math.random().toString().split('.')[1];
        if(['radio','checkbox','dropdown','multiselect'].indexOf(fld.type) > -1 && !$.isArray(fld['choices'])) {
            throw new Error('Error in field ' + fld['id'] + ': choices property is missing or invalid');
        }
    });
    return fields;
};
//class is a reserved keyword, it should never have been used, and is causing issues in IE now
//here we try fix any instances of usage of class instead of the newer className
cot_form.fixClassProperty = function(objectOrArray) {
    $.each($.makeArray(objectOrArray || []), function(i,o) {
        if(o['className'] === undefined && typeof o['class'] === 'string') { //this is a hack
            o['className'] = o['class'];
            delete o['class'];
        }
    });
}
var cot_section = function(o) {
    cot_form.fixClassProperty(o);
    this.id = o.id;
    this.title = o.title;
    this.className = o['className'];
    this.rows = [];
};

var cot_row = function(o) {
    this.fields = cot_form.addDefaultFieldProperties(o); //this is an array of raw javascript objects describing fields
    /*
    Here are the possible field options:
    {
        type: '', //optional, enum: ['html', 'button', 'static', 'checkbox', 'radio', 'text' (default), 'daterangepicker', 'dropdown', 'multiselect', 'datetimepicker', 'textarea', 'password'], the type of field to add to the row
        id: 'field_one', //required, used to create the dom element id
        title: '', //required except for type=html|button|static|checkbox|radio, the title/label for the field
        className: 'col-xs-6', //optional, override the auto-generated css grid col classes, ex: col-xs-12
                               //NOTE: if type=button, className is applied to button as well. if you DO NOT want this behaviour, you can explicitly specify the btnClass option below
        btnClass: 'success', //optional, only applies when type=button, defaults to 'success', determines the bootstrap btn-x class used to style the button, valid values are here: http://getbootstrap.com/css/#buttons-options
        orientation: 'horizontal', //optional, enum: ['horizontal','vertical']. default is vertical. this affects fields like radio
        addclass: 'additional-class', //optional, append to the auto-generated classes
        required: false, //optional, defaults to false
        infohelp: '', //optional, help text for the field, which is shown via a tooltip for an info icon, only applies when type=text||daterangepicker||dropdown||multiselect||datetimepicker||textarea||password
        prehelptext: '', //optional, help text for the field which is always displayed, in front of the field
        posthelptext: '', //optional, help text for the field which is always displayed, after the field
        validators: {}, //optional, a validator object. see: http://formvalidation.io/validators/, ex: validators: {creditCard: {message: 'Invalid cc value'}}
        validationtype: 'Phone', //optional, enum: ['Phone', 'Email', 'URL','PostalCode'], if specified, this will automatically set the proper validators object
        options: {}, //optional, a raw javascript object,
            //when type=daterangepicker||multiselect||datetimepicker, this is passed into the jquery constructor for the field
             //see http://davidstutz.github.io/bootstrap-multiselect/
             //see http://www.daterangepicker.com/
             //see http://eonasdan.github.io/bootstrap-datetimepicker/
        value: '', //optional, the value or content of this field
        html: '', //optional, the html content, only applies when type=html
        disabled: false, //optional, defaults to false, only applies to fields that can be disabled
        placeholder: '', //optional, a placeholder string for input fields, doesn't apply if validationtype=Phone
        choices: [{text: '', value: ''}], //required when type=radio||checkbox||dropdown||multiselect, an array of text/value pairs, text is required, but value is not (defaults to text)
        multiple: false, //optional, defaults to false, only applies when type=multiselect, determines if multiple selection is allowed
        cols: '50', //optional, when type=textarea this specifies the cols attribute
        rows: '10', //optional, when type=textarea this specifies the rows attribute
        glyphicon: '', //optional, a glyphicon class, only applies when type=button, ex: glyphicon-minus
        onclick: function(){}, //optional, when type=button this specifies an onclick function
        htmlAttr: {}, //optional, when type=text this can be used to pass a set of html attributes, which will be set on the input element using jquery's attr method
    }

     */
    this.type = 'standard';
};

var cot_grid = function(o) {
    cot_form.fixClassProperty(o);
    this.id = (o.id || "") ? o.id : 'grid-' + Math.floor(Math.random() * 100000000);
    this.add = (o.add || "") ? true : false;
    this.className = o['className'];
    this.title = o.title;
    this.headers = o.headers;
    this.fields = cot_form.addDefaultFieldProperties(o.fields);
    this.type = 'grid';
};

cot_form.prototype.addSection = function(o) {
    if (!(o instanceof cot_section)) {
        o = new cot_section(o);
    }
    this.sections.push(o);
    return o;
};

cot_section.prototype.addRow = function(o) {
    if (!(o instanceof cot_row)) {
        o = new cot_row(o);
    }
    this.rows.push(o);
    return this;
};

cot_section.prototype.addGrid = function(o) {
    if (!(o instanceof cot_grid)) {
        o = new cot_grid(o);
    }
    this.rows.push(o);
    return this;
};

cot_form.prototype.render = function(o) {
    /*
    o = {
        target: '#element_id', //required. specify a css selector to where the form should be rendered
        formValidationSettings: {} //optional, when specified, the attributes in here are passed through to the formValidation constructor: http://formvalidation.io/settings/
    }
     */
    var app = this;
    var oVal = { fields: {} };
    var form = document.createElement('form');
    form.id = this.id;
    form.setAttribute("data-fv-framework", "bootstrap");
    form.setAttribute("data-fv-icon-valid", "glyphicon glyphicon-ok");
    form.setAttribute("data-fv-icon-invalid", "glyphicon glyphicon-remove");
    form.setAttribute("data-fv-icon-validating", "glyphicon glyphicon-refresh");

    if (this.title || "") {
        var formHead = form.appendChild(document.createElement('h2'));
        formHead.textContent = this.title;
    }
    $.each(this.sections, function(i, section) {
        var oPanel = form.appendChild(document.createElement('div'));
        oPanel.id = section.id;


        oPanel.className = (section['className'] !== undefined) ? 'panel ' + section.className : "panel panel-default";
        if (section.title || "") {
            var oPanelHead = oPanel.appendChild(document.createElement('div'));
            oPanelHead.className = 'panel-heading';
            var oH3 = oPanelHead.appendChild(document.createElement('h3'));
            var oSpan = oH3.appendChild(document.createElement('span'));
            oSpan.className = "glyphicon glyphicon-th-large";
            oH3.appendChild(document.createElement('span'));
            oH3.textContent = section.title;
        }
        var oPanelBody = oPanel.appendChild(document.createElement('div'));
        oPanelBody.className = 'panel-body';

        $.each(section.rows, function(k, row) {
            var oRow = oPanelBody.appendChild(document.createElement('div'));
            oRow.className = 'row';
            if (row.type == 'grid') {
                app.processGrid(oRow, oVal, row);
            } else {
                $.each(row.fields, function(l, field) {
                    app.processField(oRow, oVal, row, field);
                });
            }
        });
    });
    $(o.target).append(form);

    app.initializeFunctions();

    //INITIATE FORM VALIDATION
    var frm = $('#' + this.id);
    frm.formValidation($.extend({
        excluded: [':not(.multiselect):disabled', ':not(.multiselect):hidden', ':not(.multiselect):not(:visible)'], //exclude all hidden and disabled fields that are not multiselects
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        onSuccess: this.success,
        onError: function(e) {
            console.log('Validation error occurred:', e);
            $($(".has-error input, .has-error select, .has-error button")[0]).focus();
        },
        fields: oVal.fields
    }, o['formValidationSettings'] || {}));
    frm.find("button.fv-hidden-submit").text("hidden submit button");
    frm.find("button.fv-hidden-submit").attr("aria-hidden",true);
};

cot_form.prototype.initializeFunctions = function() {
    var frmID = this.id,
        baseUrl = window['cot_bower_enabled'] === undefined ? '../corev1.1/' : '';
    $.each(this.sections, function(i, section) {
        $.each(section.rows, function(k, row) {
            $.each(row.fields, function(l, field) {
                if (field.type == 'button') { $("#" + field.id).click(function() { field.onclick(); }); }
                if (field.type == 'multiselect') { $("." + field.id + ".multiselect").multiselect(field.options); }
                if (field.validationtype == "Phone") { $('.phonevalidation').intlTelInput({ utilsScript: baseUrl + 'js/utils.js', autoPlaceholder: false, preferredCountries: ['ca'] }); }
                if (field.type == 'daterangepicker') {
                    $(".daterangevalidation").daterangepicker(field.options)
                        .on('show.daterangepicker', function(ev, picker) {
                            $($(picker)[0]).focus();
                        });

                }
                if (field.type == 'datetimepicker') {
                    $("." + field.id + ".datetimepicker")
                        .datetimepicker(field.options)
                        .on("dp.change", function() {
                            var sName = $(this).attr("data-refid");
                            $("#" + frmID).data('formValidation').updateStatus(sName, 'NOT_VALIDATED').validateField(sName);
                        });
                }
            });
        });
    });
    $('[data-toggle="tooltip"]').tooltip({ "html": true, "trigger": "click hover" });
};

cot_form.prototype.processGrid = function(oRow, oVal, row) {
    var app = this,
        oBTN;
    var oGrid = oRow.appendChild(document.createElement('div'));
    oGrid.id = row.id;
    oGrid.className = 'grid-object table-responsive ';
    oGrid.className += row['className'] || '';
    oGrid.className += (row.addclass || '') ? " " + row.addclass : '';
    app[oGrid.id + "-index"] = 0;
    var oGridHead = oGrid.appendChild(document.createElement('h4'));
    oGridHead.className = 'grid-title';
    oGridHead.textContent = row.title;
    var oTable = oGrid.appendChild(document.createElement('table'));
    oTable.className = 'grid-table table table-striped';
    var oTR = oTable.appendChild(document.createElement('tr'));

    //ADD HEADERS
    $.each(row.headers, function(i, header) {
        var oTH = oTR.appendChild(document.createElement('th'));
        oTH.textContent = header.title;
        oTH.id = row.id + "_" + i;
    });
    //ADD AN EXTRA COLUMN WHICH WILL BE USED TO HOLD THE ADD/DELETE BUTTONS
    oTH = oTR.appendChild(document.createElement('th'));
    var oSpan = oTH.appendChild(document.createElement('span'));
    oSpan.className = "sr-only";
    oSpan.textContent = "Add/Remove Rows";

    //ADD FIRST ROW OF GRID
    oTR = oTable.appendChild(document.createElement('tr'));
    oTR.id = row.id + "-row-0";
    oTR.setAttribute('data-row-index', "0");
    $.each(row.fields, function(l, field) {
        var oFieldDiv = oTR.appendChild(document.createElement('td'));
        oFieldDiv.className = "form-group";
        oFieldDiv.className += (field.addclass || '') ? " " + field.addclass : '';
        field.grid = "0";
        field.gridlabel = row.id + "_" + l;
        app.addformfield(app, field, oFieldDiv);
		//create a validator specifically for the zero row.
		var tmpfieldId = field.id;
		field.id = "row[0]." + field.id;
        app.addfieldvalidation(oVal, field);  
		field.id = tmpfieldId;
    });
    //ADD A BUTTON AT THE END OF THE FIRST ROW TO ADD NEW ROWS TO THE GRID
    var oTD = oTR.appendChild(document.createElement('td'));
    oTD.className = 'text-right';
    oBTN = oTD.appendChild(document.createElement('button'));
    oBTN.className = 'btn btn-default grid-add';
    oBTN.type = 'button';
    oBTN.onclick = function() {
        app[oGrid.id + "-index"]++;

        //CLONE THE TEMPLATE TO CREATE A NEW GRID ROW
        var $template = $('#' + oGrid.id + '-template');
        var $clone = $template
            .clone()
            .removeClass('hide')
            .attr('id', oGrid.id + '-row-' + app[oGrid.id + "-index"])
            .attr('data-row-index', app[oGrid.id + "-index"]);

        $clone.html($clone.html().replace(/template/g, app[oGrid.id + "-index"]));
        $clone.insertBefore($template);

        //ADD THE PROPER DELETE FUNCTION TO THE DELETE ROW BUTTON FOR THE NEW ROW
        $clone.find('.grid-minus').click(function() {
            var $row = $(this).parents('tr'),
                $option = $row.find('input');
            $row.remove();
            $('#' + app.id).formValidation('removeField', $option);
        });

        //ADD EACH FIELD IN THE NEW GRID ROW TO THE FORM VALIDATOR
        var arrNewFields = $clone.find('.form-control');
        $.each(arrNewFields, function(i, item) {
            $('#' + app.id).formValidation('addField', $(item), $('#' + app.id).data('formValidation').options.fields[item.name.substring(item.name.lastIndexOf('.') + 1)]);
        });
        app.initializeFunctions();
    };
    oBTN.appendChild(document.createElement('span')).className = 'glyphicon glyphicon-plus';
    var oSpan = oBTN.appendChild(document.createElement('span'));
    oSpan.className = 'sr-only';
    oSpan.textContent = "Add Row";

    //ADD GRID TEMPLATE THAT CAN BE USED TO CREATE NEW ROWS
    oTR = oTable.appendChild(document.createElement('tr'));
    oTR.id = oGrid.id + "-template";
    oTR.className = "hide";
    $.each(row.fields, function(l, field) {
        var oFieldDiv = oTR.appendChild(document.createElement('td'));
        oFieldDiv.className = "form-group";
        oFieldDiv.className += (field.addclass || '') ? " " + field.addclass : '';
        field.grid = "template";
        app.addformfield(app, field, oFieldDiv);
        app.addfieldvalidation(oVal, field);
    });

    //ADD A BUTTON AT THE END OF THE TEMPLATE ROW TO REMOVE A ROW FROM THE GRID
    oTD = oTR.appendChild(document.createElement('td'));
    oTD.className = 'text-right';
    oBTN = oTD.appendChild(document.createElement('button'));
    oBTN.type = 'button';
    oBTN.className = 'btn btn-default grid-minus';
    oSpan = oBTN.appendChild(document.createElement('span'));
    oSpan.className = 'glyphicon glyphicon-minus';
    oSpan = oSpan.appendChild(document.createElement('span'));
    oSpan.className = 'sr-only';
    oSpan.textContent = 'Remove Row';
};

cot_form.prototype.processField = function(oRow, oVal, row, field) {
    var app = this;
    var oLabel, oLabelSpan;
    var intFields = row.fields.length;
    var sClass = (intFields == 1) ? "col-xs-12" : (intFields == 2) ? "col-xs-12 col-sm-6" : (intFields == 3) ? "col-xs-12 col-md-4" : "col-xs-12 col-sm-6 col-md-3";
    var oField = oRow.appendChild(document.createElement('div'));
    oField.id = field.id + 'Element';
    oField.className = field['className'] || sClass;
    oField.className += ' form-group form-group-';
    oField.className += field.orientation || 'vertical';
    oField.className += field.addclass ? " " + field.addclass : '';
    oFieldDiv = oField.appendChild(document.createElement('div'));

    //LABEL
    if (['html','button'].indexOf(field.type) == -1) {
        if (['static','checkbox','radio'].indexOf(field.type) > -1) {
            if (field.title) {
                oLabel = oFieldDiv.appendChild(document.createElement('span'));
                oLabel.className = 'staticlabel';
                oLabel.textContent = field.title + (field.required || field.type == 'static' ? '' : ' (optional)');
            }
        } else {
            oLabel = oFieldDiv.appendChild(document.createElement('label'));
            oLabel.className = 'control-label';
            oLabel.htmlFor = field.id;
            oLabelSpan = oLabel.appendChild(document.createElement('span'));
            oLabelSpan.textContent = field.title + (field.required ? '' : ' (optional)');

            if (field.infohelp || "") {
                oLabelSpan = oLabel.appendChild(document.createElement('span'));
                oLabelSpan.className = 'glyphicon glyphicon-info-sign';
                oLabelSpan.setAttribute('data-toggle', 'tooltip');
                oLabelSpan.setAttribute('data-placement', 'top');
                oLabelSpan.title = field.infohelp;
            }
        }
    }

    app.addprehelptext(field, oFieldDiv);
    app.addformfield(app, field, oFieldDiv);
    app.addposthelptext(field, oFieldDiv);
    app.addfieldvalidation(oVal, field);

};

cot_form.prototype.addprehelptext = function(field, oFieldDiv) {
    //PRE HELP TEXT
    if (field.prehelptext || '') {
        var oHelp = oFieldDiv.appendChild(document.createElement('p'));
        oHelp.className = 'helptext';
        oHelp.innerHTML = field.prehelptext;
    }
};
cot_form.prototype.addformfield = function(app, field, oFieldDiv) {
    var x = app.callFunction(app[field.type + 'FieldRender'], field, oFieldDiv);
    oFieldDiv.appendChild(x);
};

cot_form.prototype.addposthelptext = function(field, oFieldDiv) {
    //POST HELP TEXT
    if (field.posthelptext || '') {
        var oHelp = oFieldDiv.appendChild(document.createElement('p'));
        oHelp.className = 'helptext';
        oHelp.innerHTML = field.posthelptext;
    }
};

cot_form.prototype.addfieldvalidation = function(oVal, field) {
    //ADD VALIDATION
    oVal.fields[field.id] = {};
    oVal.fields[field.id].validators = {};
    if (field.validators || field.required || "") {
        if (field.validators || "") {
            oVal.fields[field.id].validators = field.validators;
        }
    }
    if (field.validationtype == "Phone") {
        oVal.fields[field.id].validators.callback = {};
        oVal.fields[field.id].validators.callback.message = 'This field must be a valid phone number. (###-###-####)';
        oVal.fields[field.id].validators.callback.callback = function(value, validator, $field) {
            //return value === '' || $field.intlTelInput('isValidNumber');
            if (IEversion < 10) {
                if (field.required || value !== "") {
                    if (value.match(/\d{3}-?\d{3}-?\d{4}/)) {
                        if (value.match(/\d{3}-?\d{3}-?\d{4}/)[0] == value) {
                            $field.val(value.replace(/(\d{3})\-?(\d{3})\-?(\d{4})/, '$1-$2-$3'));
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return value === '' || $field.intlTelInput('isValidNumber');
            }
        };
    }
    if (field.validationtype == "Email") { oVal.fields[field.id].validators.emailAddress = { message: 'The value is not a valid email address' }; } 
    if (field.validationtype == "URL") { oVal.fields[field.id].validators.uri = { message: 'The value is not a valid URL (http://xx.xx or https://xx.xx).' }; }
    if (field.validationtype == "PostalCode"){ oVal.fields[field.id].validators.regexp = { regexp: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/i,message: 'This field must be a valid postal code' }; }
    if (field.required || "") {
        oVal.fields[field.id].validators.notEmpty = {};
        oVal.fields[field.id].validators.notEmpty.message = field.title + ' is required and cannot be left blank';
    }
    if (field.type == "daterangepicker") {
        sFMT = 'DD/MM/YYYY';
        if (field.options) {
            if (field.options.format) {
                sFMT = field.options.format;
            }
        }
        oVal.fields[field.id].validators.date = {};
        oVal.fields[field.id].validators.date.format = sFMT;
        oVal.fields[field.id].validators.date.message = 'The date must be in the format' + sFMT;
    }
};

cot_form.prototype.callFunction = function(func) {
    var ret = func.apply(this, Array.prototype.slice.call(arguments, 1));
    return ret;
};

cot_form.prototype.staticFieldRender = function(field, oLabel) {
    var o = document.createElement('p');
    o.name = (field.grid || "") ? "row[0]." + field.id : field.id;
    o.textContent = field.value;
    return o;
};

cot_form.prototype.htmlFieldRender = function(field, oLabel) {
    var o = document.createElement('div');
    o.name = (field.grid || "") ? "row[0]." + field.id : field.id;
    o.innerHTML = field.html;
    return o;
};

cot_form.prototype.textFieldRender = function(field, oLabel, typeOverride) {
    var o = oLabel.appendChild(document.createElement('div'));
    o.className = 'entryField';
    var oField = o.appendChild(document.createElement('input'));
    if (field['htmlAttr']) {
        $(oField).attr(field['htmlAttr']);
    }
    oField.title = field.title;
    oField.type = typeOverride || 'text';
    oField.value = (field.value || "") ? field.value : '';
    oField.disabled = (field.disabled || "") ? "disabled" : false;
    if (field.grid || "") {
        oField.name = "row[" + field.grid + "]." + field.id;
        $(oField).attr("aria-labelledby", field.gridlabel);
    } else {
        oField.name = field.id;
        oField.id = field.id;
    }
    //SET THE REQUIRED FIELD DECLARATVE FORM VALIDATION ATTRIBUTES
    if (field.required) {
        oField.setAttribute("aria-required", "true");
        oField.setAttribute("data-fv-notempty", "true");
        oField.setAttribute("data-fv-notempty-message", "The " + field.title + " field is required and must be filled in before submission.");
        oField.className = 'form-control required';
    } else {
        oField.className = 'form-control';
    }

    //SET THE PLACEHOLDER VALUE
    if (field.validationtype == "Phone") {
        oField.placeholder = '416-555-1212';
        oField.className += " phonevalidation ";
    } else {
        oField.placeholder = (field.placeholder || "") ? field.placeholder : "";
    }

    return o;
};

cot_form.prototype.passwordFieldRender = function(field, oLabel) {
    return this.textFieldRender(field, oLabel, 'password');
};

cot_form.prototype.radioFieldRender = function(field) {
    var o = document.createElement('fieldset');
    o.className = 'form-control';
    if (field.required) {
        o.setAttribute("aria-required", "true");
    }
    var oLegend = o.appendChild(document.createElement('legend'));
    oLegend.className = "sr-only";
    oLegend.textContent = "Select an option for " + field.id;

    $.each(field.choices, function(m, choice) {
        var oDiv = o.appendChild(document.createElement('label'));
        oDiv.className = (field.orientation || '') ? field.orientation : 'vertical';
        oDiv.className += ' entryField radioLabel';
        var oField = oDiv.appendChild(document.createElement('input'));
        if (field.grid || "") {
            oField.name = "row[" + field.grid + "]." + field.id;
            $(oField).attr("aria-labelledby", field.gridlabel);
        } else {
            oField.name = field.id;
            oField.id = field.id + '_' + m;
        }
        oField.title = field.title;
        oField.type = 'radio';
        oField.className = (field.required || "") ? 'required' : '';
        oField.value = choice.hasOwnProperty('value') ? choice.value : choice.text;
        oField.disabled = (field.disabled || "") ? "disabled" : false;
        if (field.value || "") {
            oField.checked = (field.value == oField.value) ? 'checked' : '';
        }
        oDiv.appendChild(document.createElement('span')).innerHTML = choice.text;
    });

    return o;
};

cot_form.prototype.checkboxFieldRender = function(field) {
    var o = document.createElement('fieldset');
    o.className = 'form-control';
    if (field.required) {
        o.setAttribute("aria-required", "true");
    }
    var oLegend = o.appendChild(document.createElement('legend'));
    oLegend.className = "sr-only";
    oLegend.textContent = "Select options for " + field.id;

    $.each(field.choices, function(m, choice) {
        var oDiv = o.appendChild(document.createElement('label'));
        oDiv.className = (field.orientation || '') ? field.orientation : 'vertical';
        oDiv.className += ' entryField checkboxLabel';
        var oField = oDiv.appendChild(document.createElement('input'));
        if (field.grid || "") {
            oField.name = "row[" + field.grid + "]." + field.id;
            $(oField).attr("aria-labelledby", field.gridlabel);
        } else {
            oField.name = field.id;
            oField.id = field.id + '_' + m;
        }
        oField.title = field.title;
        oField.type = 'checkbox';
        oField.className = (field.required || "") ? 'required' : '';
        oField.value = choice.hasOwnProperty('value') ? choice.value : choice.text;
        oField.disabled = (field.disabled || "") ? "disabled" : false;
        if (choice.selected || "") { oField.checked = "checked"; }
        oDiv.appendChild(document.createElement('span')).innerHTML = choice.text;
    });

    return o;
};

cot_form.prototype.dropdownFieldRender = function(field) {
    var o = document.createElement('div');
    o.className = 'entryField';
    var oField = o.appendChild(document.createElement('select'));
    if (field.required) {
        oField.setAttribute("aria-required", "true");
    }
    if (field.grid || "") {
        oField.name = "row[" + field.grid + "]." + field.id;
        $(oField).attr("aria-labelledby", field.gridlabel);
    } else {
        oField.name = field.id;
        oField.id = field.id;
    }
    oField.className = 'form-control';
    $.each(field.choices, function(m, choice) {
        var oOption = oField.appendChild(document.createElement('option'));
        oOption.value = choice.hasOwnProperty('value') ? choice.value : choice.text;
        oOption.text = choice.text;
        if (field.value || "") {
            oOption.selected = (field.value == oOption.value) ? 'selected' : '';
        }
    });
    oField.disabled = (field.disabled || "") ? "disabled" : false;
    return o;
};


cot_form.prototype.multiselectFieldRender = function(field) {
    var o = document.createElement('div');
    o.className = 'entryField';
    var oField = o.appendChild(document.createElement('select'));
    if (field.required) {
        oField.setAttribute("aria-required", "true");
    }
    if (field.grid || "") {
        oField.name = "row[" + field.grid + "]." + field.id;
        $(oField).attr("aria-labelledby", field.gridlabel);
    } else {
        oField.name = field.id;
        oField.id = field.id;
    }
    oField.className = 'form-control hide multiselect ' + field.id;
    oField.multiple = (field.multiple || "") ? 'multiple' : '';
    $.each(field.choices, function(m, choice) {
        var oOption = oField.appendChild(document.createElement('option'));
        oOption.value = choice.hasOwnProperty('value') ? choice.value : choice.text;
        oOption.text = choice.text;
    });
    oField.disabled = (field.disabled || "") ? "disabled" : false;
    return o;
};

cot_form.prototype.daterangepickerFieldRender = function(field) {
    var oField = document.createElement('input');
    if (field.grid || "") {
        oField.name = "row[" + field.grid + "]." + field.id;
        $(oField).attr("aria-labelledby", field.gridlabel);
    } else {
        oField.name = field.id;
        oField.id = field.id;
    }
    oField.type = 'text';
    oField.value = (field.value || "") ? field.value : '';
    oField.className = (field.required || "") ? 'form-control required daterangevalidation' : 'form-control daterangevalidation';
    if (field.required) {
        oField.setAttribute("aria-required", "true");
    }
    oField.disabled = (field.disabled || "") ? "disabled" : false;
    return oField;
};

cot_form.prototype.datetimepickerFieldRender = function(field) {
    var o = document.createElement('div');
    o.className = 'input-group date entryField datetimepicker ' + field.id;
    o.setAttribute("data-refid", field.id);
    var oField = o.appendChild(document.createElement('input'));
    oField.type = 'text';
    if (field.required) {
        oField.setAttribute("aria-required", "true");
        oField.setAttribute("data-fv-notempty", "true");
        oField.setAttribute("data-fv-notempty-message", "The " + field.title + " field is required and must be filled in before submission.");
        oField.className = 'form-control required';
    } else {
        oField.className = 'form-control';
    }
    oField.value = (field.value || "") ? field.value : '';
    if (field.grid || "") {
        oField.name = "row[" + field.grid + "]." + field.id;
        $(oField).attr("aria-labelledby", field.gridlabel);
    } else {
        oField.name = field.id;
        oField.id = field.id;
    }
    oField.className = 'form-control';
    var oSpan = o.appendChild(document.createElement('span'));
    oSpan.className = 'input-group-addon';
    oSpan = oSpan.appendChild(document.createElement('span'));
    oSpan.className = 'glyphicon glyphicon-calendar';
    oField.disabled = (field.disabled || "") ? "disabled" : false;
    return o;
};

cot_form.prototype.textareaFieldRender = function(field) {
    var o = document.createElement('div');
    o.className = 'entryField';
    var oField = o.appendChild(document.createElement('textarea'));
    if (field.grid || "") {
        oField.name = "row[" + field.grid + "]." + field.id;
        $(oField).attr("aria-labelledby", field.gridlabel);
    } else {
        oField.name = field.id;
        oField.id = field.id;
    }
    if (field.cols) {
        oField.cols = field.cols;
    }
    if (field.rows) {
        oField.rows = field.rows;
    }
    oField.title = field.title;
    oField.type = 'text';
    oField.className += (field.required || "") ? 'form-control required' : 'form-control';
    if (field.required) {
        oField.setAttribute("aria-required", "true");
    }
    oField.placeholder = (field.placeholder || "") ? field.placeholder : "";
    oField.value = (field.value || "") ? field.value : '';
    oField.disabled = (field.disabled || "") ? "disabled" : false;
    return o;
};

cot_form.prototype.buttonFieldRender = function(field) {
    var o = document.createElement('button');
    o.type = 'button';
    if (field['className'] && !field['btnClass']) {
        //field['className'] should probably never have been applied here,
        //but to avoid a breaking change, we don't apply field['className'] if the newer field['btnClass'] is used
        o.className = field.className;
    } else {
        o.className = 'btn btn-' + (field['btnClass'] || 'success');
    }
    var oSpan = o.appendChild(document.createElement('span'));
    oSpan.className = (field.glyphicon || "") ? 'glyphicon ' + field.glyphicon : '';
    oSpan = o.appendChild(document.createElement('span'));
    oSpan.textContent = field.title;
    o.disabled = (field.disabled || "") ? "disabled" : false;
    $(o).on('click',field['onclick'] || function(){});
    return o;
};

function getFormValues(selector) {
    var aFields = $(selector).serializeArray();
    var aReturn = [];
    $.each(aFields, function(i, item) {
        if (JSON.stringify(item).indexOf("[template]") < 0) {
            aReturn.push(item);
        }
    });
    return aReturn;
}

/*
A class to supercede and wrap around cot_form.
Example usage:
var f = new CotForm(def); //see below about the def argument
var app = new cot_app('my app');
app.addForm(f, 'bottom');

definition: a complete raw javascript object that defines a cot_form. ex:
{
 //these first three are the same as the properties passed to new cot_form()
 id: 'my_form_id',
 title: 'My Form',
 success: someFunctionDefinedSomewhereElse,

 useBinding: true, //defaults to false, set to true to use data binding with a CotModel object.
                    //use in conjunction with the setModel method of CotForm and the bindTo attribute of field definitions

 sections: [ //an array of sections on the form
  {
   //these first three are the same as the properties passed to new cot_section()
   id: 'section_one',
   title: 'Section One',
   className: 'Some special class'

   rows: [ //an array of rows within the current section
    { //for each row, specify a grid OR an array of fields:
     grid: {
      id: 'grid', //an id for the grid
      add: true, //appears to not be in use
      title: 'grid title', //a title for the grid
      headers: [ //an array of objects with title values, for the grid column headings
       {title: 'Heading 1'},
       {title: 'Heading 2'}
      ],
      fields: [ //an array of fields within the current grid
       {
        //the other properties in here are the same as the ones accepted by new cot_row()
        //for help and documentation, see the definition of new cot_row() above in this file
       }
      ]
     }
     fields: [ //an array of fields within the current row
      {
        bindTo: 'fieldname', //this is only available when using CotForm, specify the name or path of a field to bind to
                             //this only works if type is one of: 'text', 'dropdown', 'textarea', 'checkbox', 'radio'

       //the other properties in here are the same as the ones accepted by new cot_row()
       //for help and documentation, see the definition of new cot_row() above in this file
      }
     ]
    }
   ]
  }
 ]
}
 */
function CotForm(definition) {
    if (!definition) {
        throw new Error('You must supply a form definition');
    }
    this._isRendered = false;
    this._definition = definition;
    this._useBinding = definition['useBinding'] || false;
    this._model = null;
    this.cotForm = new cot_form({
        id: definition['id'] || 'new_form',
        title: definition['title'],
        success: definition['success'] || function () {
        }
    });
    var that = this;
    var bindableTypes = ['text', 'dropdown', 'textarea', 'checkbox', 'radio'];
    $.each(definition['sections'] || [], function (i, sectionInfo) {
        var section = that.cotForm.addSection({
            id: sectionInfo['id'] || 'section' + i,
            title: sectionInfo['title'],
            className: sectionInfo['className']
        });
        $.each(sectionInfo['rows'] || [], function (y, row) {
            if (row['fields']) {
                row['fields'].forEach(function (field) {
                    var type = field['type'] || 'text';
                    if (field['bindTo'] && bindableTypes.indexOf(type) === -1) {
                        throw new Error('Error in field ' + (field['id'] || 'no id') + ', fields of type ' + type + ' cannot use bindTo.');
                    }
                });
                section.addRow(row['fields']);
            } else if (row['grid']) {
                section.addGrid(row['grid']);
            }
        });
    });
}

CotForm.prototype.render = function(options) {
    if (this._isRendered) {
        throw new Error('This form is already rendered');
    }
    if (typeof options == 'string') {
        options = {target: options};
    }
    this.cotForm.render(options);
    this._isRendered = true;
    if (this._useBinding) {
        if (this._model) {
            this._fillFromModel();
        }
        this._watchChanges();
    }
};

CotForm.prototype.setModel = function(object) {
    if (object && typeof object['get'] !== 'function') {
        throw new Error('Model must be a CotModel object');
    }
    this._model = object;
    this._fillFromModel();
};

CotForm.prototype._fillFromModel = function(options) {
    var form = this;
    if (this._isRendered) {
        (this._definition['sections'] || []).forEach(function (sectionInfo) {
            (sectionInfo['rows'] || []).forEach(function (row) {
                (row['fields'] || []).forEach(function (field) {
                    //TODO: support grids
                    if (field['bindTo']) {
                        var value = form._model ? (form._model.get(field['bindTo']) || '') : '';
                        if (['radio', 'checkbox'].indexOf(field['type']) > -1) {
                            $.makeArray(value).forEach(function(val){
                                var fld = $('input[name="' + field['id'] + '"][value="' + val + '"]');
                                if (fld.length) {
                                    fld[0].checked = true;
                                }
                            });
                        } else {
                            $('#' + field['id']).val(value);
                        }
                    }
                });
            });
        });
    }
};
CotForm.prototype._watchChanges = function() {
    var form = this;
    if (this._isRendered) {
        (this._definition['sections'] || []).forEach(function (sectionInfo) {
            (sectionInfo['rows'] || []).forEach(function (row) {
                (row['fields'] || []).forEach(function (field) {
                    //TODO: support grids
                    if (field['bindTo']) {
                        if (field['type'] == 'radio') {
                            $('input[name="' + field['id'] + '"]').on('click', function (e) {
                                if (form._model) {
                                    form._model.set(field['bindTo'], $(e.currentTarget).val());
                                }
                            });
                        } else if (field['type'] == 'checkbox') {
                            $('input[name="' + field['id'] + '"]').on('click', function (e) {
                                if (form._model) {
                                    var value = $(e.currentTarget).val();
                                    var values = $.makeArray(form._model.get(field['bindTo']) || []).slice();
                                    var currentIndex = (values).indexOf(value);
                                    if(e.currentTarget.checked && currentIndex == -1) {
                                        values.push(value);
                                    } else if (!e.currentTarget.checked && currentIndex > -1) {
                                        values.splice(currentIndex, 1);
                                    }
                                    form._model.set(field['bindTo'], values);
                                }
                            });
                        } else {
                            $('#' + field['id']).on('change', function (e) {
                                if (form._model) {
                                    form._model.set(field['bindTo'], $(e.currentTarget).val());
                                }
                            });
                        }
                    }
                });
            });
        });
    }
};

/*
A convenience method to get all of the current form data as a javascript object,
where each key is the name of the field and each value is the value

NOTE: this needs some help, since it is built on $.serializeArray, which does not get values for some empty fields (ex: radio buttons with no selected option)
 */
CotForm.prototype.getData = function () {
    var data = {},
        rowIndexMap = {}; // {stringIndex: intIndex}
    $.each($('#' + this.cotForm.id).serializeArray(), function (i, o) {
        if (o.name.indexOf('row[') !== -1) {
            var sRowIndex = o.name.substring(o.name.indexOf('[') + 1, o.name.indexOf(']'));
            if (sRowIndex !== 'template') {
                var rows = data['rows'] || [];
                var iRowIndex = rowIndexMap[sRowIndex];
                if (iRowIndex === undefined) {
                    rows.push({});
                    iRowIndex = rows.length - 1;
                    rowIndexMap[sRowIndex] = iRowIndex;
                }
                rows[iRowIndex][o.name.split('.')[1]] = o.value;
                data['rows'] = rows;
            }
        } else {
            if (data.hasOwnProperty(o.name)) {
                data[o.name] = $.makeArray(data[o.name]);
                data[o.name].push(o.value);
            } else {
                data[o.name] = o.value;
            }
        }
    });
    return data;
};