/**
 * @method getSubmissionSections(form_id)
 * @param form_id {string} -  the entity set/collection name
 * @return JSON
 * Returns a cot_form sections array defining the form
 */
const getSubmissionSections = (form_id, data) => {

  let sections, model, registerFormEvents, registerDataLoadEvents, registerOnSaveEvents, registerPostSaveEvents, registerPostErrorEvents, success, defaults = {};
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
          id: "submitter_information",
          title: "Your Information",
          className: 'example-form-section panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'fullName',
                  title: 'Full Name',
                  type: 'text',
                  className: 'col-xs-12',
                  required: true,
                  htmlAttr: {maxLength: 100},
                  bindTo: 'fullName'
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
                    infohelp: 'Ex: 416-555-5555',
                    validationMessage: 'Phone numbers must be entered in a valid format', //optional, when validationtype is used or type is set to daterangepicker||datetimepicker, this can be specified to override the default error message
                    options: {preferredCountries: ['ca', 'us']},
                    htmlAttr: {maxLength: 20},
                    bindTo: 'phone'
                  },
                  {
                    id: 'email',
                    title: 'Email',
                    type: 'email',
                    required: true,
                    infohelp: 'Ex: you@me.com',
                    htmlAttr: {maxLength: 254},
                    bindTo: 'email'
                  }
                ]
            }
          ]
        }
      ];
      model = new CotModel({
        "fullName": "",
        "phone": "",
        "email": ""
      });


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
      registerDataLoadEvents = async function (data){
        console.log("registerDataLoadEvents: Make modification before form render. Make changes to the model for example", data);
        let settings = {
          "url": "/c3api_data/v2/DataAccess.svc/covid19/submissions?$format=application/json;odata.metadata=none&$count=true&$select=id&$top=1",
          "type": "GET",
          "headers": {
            "Content-Type": "application/json; charset=utf-8;"
          },
          "dataType": "json",
          "success": (get_data) =>{ console.log('Submission count data load events: ' , get_data['@odata.count']);}
        };
        let promise = new Promise((resolve, reject) => {
          $.ajax(settings).always(function(){
            console.log("registerDataLoadEvents work is done, now resolve the promise");
            resolve(data);
          });
        });
        await promise;
      };

      //"registerFormEvents: Do something like add in addition form elements, hide elements ect"
      registerFormEvents = (data) => {
        console.log("registerFormEvents: Do something like add in addition form elements, hide elements ect", data);
      };

      //registerOnSaveEvents: Do something on save like modify the payload before AJAX call . this method can return a promise OR can be implemented without a promise
      /*
      registerOnSaveEvents = (data) => {
        console.log("registerOnSaveEvents: Do something on save like modify the payload before AJAX call.", data);
      };
      */
      registerOnSaveEvents = async function (data, formConfig){
        console.log("registerOnSaveEvents: Do something on save like modify the payload before AJAX call.", data);
        let settings = {
          "url": "/c3api_data/v2/DataAccess.svc/covid19/submissions?$format=application/json;odata.metadata=none&$count=true&$select=id&$top=1",
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
      registerPostSaveEvents= async function (data, formConfig){
        console.log("registerPostSaveEvents: Do something post save like change the route or display additional date. Note: If registerPostSaveEvents is implemented, you need to manage the state change after", data);
        let settings = {
          "url": "/c3api_data/v2/DataAccess.svc/covid19/submissions?$format=application/json;odata.metadata=none&$count=true&$select=id&$top=1",
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

      //registerPostErrorEvents: Do something post save error like change the route or display additional date.
      //This method can return a promise OR can be implemented without a promise
      /*
      registerPostErrorEvents = (jqXHR, textStatus) => {
        console.log("registerPostErrorEvents manage ajax errors if required.", jqXHR, textStatus);
      };
      */
      registerPostErrorEvents= async function (data, formConfig){
        console.log("registerPostErrorEvents: Do something post save error like change the route or display additional date.", data);
        let settings = {
          "url": "https://was-intra-sit.toronto.ca/c3api_data/v2/DataAccess.svc/covid19/submissions?$format=application/json;odata.metadata=none&$count=true&$select=id&$top=1",
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

      break;
  }
  return {
    "sections": sections,
    "model": model,
    "defaults": defaults,
    "success":success,
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
        {"data": "fullName", "title": "Full Name", "filter": true, "type": "text"},
        {"data": "email", "title": "Email", "filter": true, "type": "text"},
        {"data": "phone", "title": "Phone", "filter": true, "type": "text"}
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
    router.navigate(row.attr('data-formName') + '/' + row.attr('data-id') + '/?ts=' + new Date().getTime(), {trigger: true, replace: true});
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

  // Navigation tab links by report status
  $("#maincontent").off('click', '.tablink').on('click', '.tablink', function () {

    let newRoute = $(this).attr('data-id') + '/?ts=' + new Date().getTime() + '&status=' + $(this).attr('data-status') + '&filter=' + $(this).attr('data-filter');

    router.navigate(newRoute , {trigger: true, replace: true});
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
/*
const appInitialize = () =>{console.log('appInitialize')};
*/
/**
 * Optional. This can be used to provide custom logic and show/hide differnet components based on the current users access rights (based on your logic and needs). Called in the toggleView method that switches between form, dashboard and datatable views.
 */
/*
const loadUserView = () => {};
*/

/**
 * Optional. If implemented, you can provide your own logic to manage unauthorized access to data or interface. Default, the framework calls noaccess().
 */

/*
const implement_noaccess = () => {};
*/
