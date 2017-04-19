"use strict";
/*
* switch between domino/cc api
* repo
* httpHost.app_public
* api_public.post
*
* */
callback({
  "items": [
    {
      "title":"config",
      "summary":
        {
          'dateTimeFormat': 'MM/DD/YYYY hh:mm',
          'dateFormat': 'MM/DD/YYYY',
          'default_repo': 'bike_lockers',
          'button': {
            'submit': 'Submit',
            'submitPublic': 'Submit Public',
            'createNewEntry': 'Create New',
            'viewSubmissions': 'View Submissions',
            'print': 'Print',
            'exportCsv': 'Export to CSV',
            'exportExcel': 'Export to Excel',
            'viewEdit': 'View / Edit',
            'delete': 'Delete',
            'addNewItem': 'Add New Item',
            'removeItem': 'Remove Item',
            'clearItem': 'Clear Item',
            'saveReport': 'Submit',
            'save': 'Save',
            'notifyReport': 'Notify Captain',
            //     'submitReport': 'Submit to Administrator',
            'submitReport': 'Submit',
            'submitPublicReport': 'Submit Public',
            'approveReport': 'Approve',
            'rejectReport': 'Reject',
            'removeReport': 'Remove Record',
            'removeTitle': 'Remove Item',
            'createReport': 'Create Report',
            'reports': 'Reports'
          },
         // 'repo':'bike_locker',
          'repo':'LockerAppl',
          'defaultQueryString':'computeWithForm=true',
          'httpHost': {
            'app': {
              'local':'https://was-intra-sit.toronto.ca',
              'dev': 'https://was-intra-sit.toronto.ca',
              'qa': 'https://was-intra-qa.toronto.ca',
              'prod': 'https://insideto-secure.toronto.ca'
            },
            'app_public': {
              'local':'https://was-inter-sit.toronto.ca',
              'dev':'https://dom01d.toronto.ca/inter/uds/bikelockers.nsf',
             // 'dev': 'https://was-inter-sit.toronto.ca',
              'qa': 'https://was-inter-qa.toronto.ca',
              'prod': 'https://secure.toronto.ca'
            },
            'eventDispatcher': {
              'dev': 'http://cheetah-b4.corp.toronto.ca:5680',
              'qa': 'https://esb1qa.toronto.ca:5680',
              'prod': 'https://esb1.toronto.ca:5680'
            }
          },
          'api': {
            'get': '/cc_sr_admin_v1/retrieve/eventrepo/',
            'post': '/cc_sr_admin_v1/submit/',
            'put': '/cc_sr_admin_v1/submit/eventrepo/',
            'delete': '/cc_sr_admin_v1/submit/eventrepo/',
            'email': '/cc_sr_admin_v1/submit/csu_email',
            'eventDispatcher': '/rest/COTEventDispatcher_V2/REST',
            'upload':'/cc_sr_admin_v1/upload/'
          },
          'api_public':{
            // 'post': '/cc_sr_v1/submit/',
            'post': '/rest.xsp/restapi/',
            'upload':'/cc_sr_v1/upload/'
          },
          'groups': {
            'csu_g': 'G',
            'csu_admin': 'testweb1'
          },
          'messages': {
            'current': '',
            'load': {
              'fail': '<strong>Unable to load!</strong> Report could not be retrieved. Please try again.'
            },
            'save': {
              'done': '<strong>Saved!</strong> This report was successfully saved.',
              'fail': '<strong>Unable to save!</strong> This report could not be saved. Please try again.'
            },
            'notify': {
              'done': '<strong>Notified!</strong> This report was successfully sent to the Emergency Management Captain.',
              'fail': '<strong>Unable to notify!</strong> This report could not be sent to the Emergency Management Captain. Please try again.'
            },
            'submit': {
              'done': '<strong>Submitted!</strong> This report was successfully sent to the Administrator.',
              'fail': '<strong>Unable to submit!</strong> This report could not be submitted to the Administrator. Please try again.'
            },
            'approve': {
              'done': '<strong>Approved!</strong> This report was successfully approved.</div>',
              'fail': '<strong>Unable to approve!</strong> This report could not be approved. Please try again.'
            },
            'reject': {
              'done': '<strong>Rejected!</strong> This report was successfully rejected and assigned back to the incident manager.',
              'fail': '<strong>Unable to reject!</strong> This report could not be rejected. Please try again.'
            },
            'delete': {
              'done': '<strong>Deleted!</strong> Report was successfully deleted.',
              'fail': '<strong>Unable to delete!</strong> This report could not be deleted. Please try again.'
            },
            'noSubmissionsFound': 'No submissions found.',
            'fadeOutTime': 8000
          },
          'auth': {
            'login': '<h2><strong>Session timeout!</strong> Please log in to access this application.</h2>',
            'group': '<h2><strong>Unauthorized!</strong> You don\'t have sufficient group permissions to view this application.</h2>'
          },
          'status': {
            'Draft': 'Yes',
            'Submitted': 'Submitted',
            'Approved': 'Approved',
            'Deleted': 'Deleted',
            'Yes': 'New',
            'Ongoing':'Submitted',
            'Closed':'Approved',
            'Search':'Global Search',
            'All': 'All',
            'DraftHRC': 'New',
            'YesHRC':'New',
            'SubmittedHRC': 'Ongoing',
            'ApprovedHRC': 'Closed',
            'DeletedHRC': 'Deleted'
          },
          'modal': {
            'confirmRemoveReport': 'Are you sure you want to permanently remove this record?',
            'confirmRemoveTitle': 'Are you sure you want to remove this item from the Human Rights Complaints application?',
            'confirmCreateReport': 'Please select report type and report year.',
            'reportType': 'Report Type',
            'reportYear': 'Report Year'
          },
          'locker_locations':[
            {"text":"Select...", value:""},
            {"text":"Bayview Station", value:"Bayview Station"},
            {"text":"City Hall", value:"City Hall"},
            {"text":"Downsview Subway Station", value:"Downsview Subway Station"},
            {"text":"Eglinton GO Station", value:"Eglinton GO Station"},
            {"text":"Etobicoke Civic Centre", value:"Etobicoke Civic Centre"},
            {"text":"Exhibition Place", value:"Exhibition Place"},
            {"text":"Finch GO Station", value:"Finch GO Station"},
            {"text":"Finch Subway Station", value:"Finch Subway Station"},
            {"text":"Guildwood GO Station", value:"Guildwood GO Station"},
            {"text":"Kennedy Station", value:"Kennedy Station"},
            {"text":"Long Branch GO Station", value:"Long Branch GO Station"},
            {"text":"Metro Hall", value:"Metro Hall"},
            {"text":"North York Civic Centre", value:"North York Civic Centre"},
            {"text":"OISE", value:"OISE"},
            {"text":"Rouge Hill GO Station", value:"Rouge Hill GO Station"},
            {"text":"Scarborough Civic Centre", value:"Scarborough Civic Centre"},
            {"text":"Scarborough GO Station", value:"Scarborough GO Station"},
            {"text":"St Lawrence Market", value:"St Lawrence Market"},
            {"text":"Toronto Island Ferry Docks", value:"Toronto Island Ferry Docks"},
            {"text":"Yorkdale Subway", value:"Yorkdale Subway"}
          ]
        }
    },
    {
    "title": "breadcrumbtrail",
    "summary": [{
      "name": "Living in Toronto",
      "link": "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=3ea2ba2ae8b1e310VgnVCM10000071d60f89RCRD"
    }, {
      "name": "Cycling",
      "link": "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=b343970aa08c1410VgnVCM10000071d60f89RCRD"
    }, {
      "name": "Bicycle Parking",
      "link": "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=daf4970aa08c1410VgnVCM10000071d60f89RCRD"
    }]
  },
    {
      "title":"MPHIPPA",
      "summary":"The personal information on this form is collected under the authority of the City of Toronto Act, 2006, s. 136, and By-law No. 765-2006. The information is used to process your application for a bicycle locker, to manage the Bicycle Locker Project, and for aggregate statistical reporting. Questions about this collection can be directed to Bicycle Promotions Coordinator, City Planning, 850 Coxwell Avenue, Toronto, Ontario, M4C 5R1. Telephone: 416-392-1143."
    },
    {
      "title":"NOTES",
      "summary":"<ul> <li>Lockers are assigned on a first-come/first-serve basis. <li>Locker costs $10 + 13% HST per month (minimum 4 month term, maximum 1 year). <li>See here for information on the Bicycle Locker Terms of Use Agreement. <li>The Bicycle Locker Project is a component of the Toronto Bike Plan presented by the City of Toronto and focusing on bicycle commuting and other cycling themes carried out within the goals of the Bike Plan. <li>Locker payments and key pick up must be taken care of in-person and by appointment only at 850 Coxwell Ave, 1st Floor. Office Hours: 9:00 A.M. - 4:30 P.M. Monday to Friday. </ul>"
    },
    {
      "title":"LockerRequestHelpInfo",
      "summary":""
    },
    {
      "title":"IntroText",
      "summary":'<ul><li><a href="http://www.toronto.ca/cycling">www.toronto.ca/cycling</a></li><li><a href="mailto:bikelocker@toronto.ca">bikelocker@toronto.ca</a></li></ul>'
    }

]
});
