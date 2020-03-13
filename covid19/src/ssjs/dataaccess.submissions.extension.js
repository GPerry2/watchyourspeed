var email_data = '<!doctype html><html lang="en" xml:lang="en"><head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>{{TITLE}}</title> <style>img{border: none; -ms-interpolation-mode: bicubic; max-width: 100%;}body{background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}table{border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;}table td{font-family: sans-serif; font-size: 14px; vertical-align: top;}.body{background-color: #f6f6f6; width: 100%;}.container{display: block; Margin: 0 auto !important; max-width: 768px; padding: 10px; width: 768px;}.itembox{border:1px solid #eee;border-left:6px solid #eee;padding:10px;margin-bottom:5px}.content{box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;}.main{background: #ffffff; border-radius: 3px; width: 100%;}.wrapper{box-sizing: border-box; padding: 20px;}.content-block{padding-bottom: 10px; padding-top: 10px;}.footer{clear: both; Margin-top: 10px; text-align: center; width: 100%;}.footer td, .footer p, .footer span, .footer a{color: #999999; font-size: 12px; text-align: center;}h1, h2, h3, h4{color: #2F5597; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 15px;}h1{margin-bottom:10px;}h3{margin-top: 25px;}h1{font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize;}p, ul, ol{font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;}p li, ul li, ol li{list-style-position: inside; margin-left: 5px;}a{color: #3498db; text-decoration: underline;}.btn{box-sizing: border-box; width: 100%;}.btn > tbody > tr > td{padding-bottom: 15px;}.btn table{width: auto;}.btn table td{background-color: #ffffff; border-radius: 5px; text-align: center;}.btn a{background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize;}.btn-primary table td{background-color: #3498db;}.btn-primary a{background-color: #3498db; border-color: #3498db; color: #ffffff;}.last{margin-bottom: 0;}.first{margin-top: 0;}.align-center{text-align: center;}.align-right{text-align: right;}.align-left{text-align: left;}.clear{clear: both;}.mt0{margin-top: 0;}.mb0{margin-bottom: 0;}.preheader{color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;}.cot-copyright a{text-decoration: none;}hr{border: 0; border-bottom: 1px solid #f6f6f6; Margin: 20px 0;}@media only screen and (max-width: 620px){table[class=body] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size: 16px !important;}table[class=body] .wrapper, table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}@media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important; border-color: #34495e !important;}}</style></head><body class=""> <table border="0" cellpadding="0" cellspacing="0" class="body" role="presentation"> <tbody> <tr> <td>&nbsp;</td><td class="container"> <div class="content"> <span class="preheader">{{PREHEADER}}</span> <table class="main" role="presentation"> <tbody> <tr> <td class="wrapper"> <header> <div class="header"> <table border="0" cellpadding="0" cellspacing="0" role="presentation"> <tbody> <tr> <td> <h1>{{HEADER}}</h1> </td></tr></tbody> </table> </div></header> <main> <article> <table border="0" cellpadding="0" cellspacing="0" role="presentation"> <tbody> <tr> <td>{{MESSAGE}}</td></tr></tbody> </table> </article> </main> <footer> <div class="footer"> <article> <table border="0" cellpadding="0" cellspacing="0" role="presentation"> <tbody> <tr> <td class="content-block">{{FOOTER}}</td></tr><tr> <td class="content-block"> <span class="apple-link"> City Hall, 100 Queen St. W., Toronto, ON, M5H 2N2</span> <br>This email is an automated confirmation receipt for your submission and replies to this email will may not work. </td></tr><tr> <td class="content-block cot-copyright"> Copyright <a href="https://www.toronto.ca">City of Toronto</a> </td></tr></tbody> </table> </article> </div></footer> </td><td>&nbsp;</td></tr></tbody> </table> </div></td></tr></tbody> </table></body></html>';
var fromEmailAddress = 'formsTEST@toronto.ca';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var currentDate = new Date();
var genID = getRandomInt(1,9)+''+currentDate.getSeconds()+''+currentDate.getMilliseconds();
var refIDgen = getRandomInt(parseInt(genID), 999999999);

function reGEN(){
  var currentDate = new Date();
  var genID = getRandomInt(1,9)+''+currentDate.getSeconds()+''+currentDate.getMilliseconds();
  var refIDgen = getRandomInt(parseInt(genID), 999999999);
  return refIDgen.toFixed(0);
}



// do before
function beforeContentParse(content, request) {
  var idget = refIDgen.toFixed(0);
  var id = currentDate.getFullYear().toString().substr(-2)+idget;
  var id2 = idget;
  var getData = JSON.parse(content.toString());
  content.addProperty('id',id)
  content.addProperty('referenceID',id)
  content.addProperty('refSEQNumber',id2)
  content.addProperty('cores_unique_id',id)
  content.addProperty("status",'new');
  content.addProperty("case_status",'New');

  function checkLatest(checkNumberSet){

    if(checkNumberSet){

      ajax.request({
        headers: {
          "Content-Type": "application/json"
        },
        method: "GET",
        uri: "https://was-intra-qa.toronto.ca/data-access-api-cores/v2/DataAccess.svc/covid19/submissions?$format=json&$select=refSEQNumber&$filter=(refSEQNumber%20eq%20"+checkNumberSet+")&$count=true&$top=1&unwrap=true"
      }, function (response) {

        if(JSON.parse(response.body).length != undefined){
          if(JSON.parse(response.body).length>0){

            //mailClient.send('new increased number already exists regenerating ',JSON.parse(response.body)+' '+checkNumberSet,['ebiba@toronto.ca']);

            //checkNumberSet = checkNumberSet+1;
            checkNumberSet = reGEN

            for (i = 0; i < randomLength(); i++) {
              checkLatest(checkNumberSet);
            }

          } else{

            var newID = Number(checkNumberSet);

            content.addProperty("refSEQNumber",newID);
            var x = currentDate.getFullYear().toString().substr(-2)+reGEN;
            content.addProperty("referenceID",String(x));
            content.addProperty("id",String(x));
            content.addProperty("cores_unique_id",String(x));

            //mailClient.send('number has been set continue saving submission ',JSON.parse(response.body)+' '+checkNumberSet,['ebiba@toronto.ca']);

          }

        } else{
          //mailClient.send('could not generate number service not responding',JSON.parse(response)+' '+checkNumberSet,['ebiba@toronto.ca']);
        }

      }, function (error) {

        var errorCode = JSON.parse(error);
        if(errorCode.code=="409"){
          checkLatest(checkNumberSet);
          //mailClient.send('number exists keep trying',JSON.parse(error)+' '+checkNumberSet,['ebiba@toronto.ca']);
        } else{
          //mailClient.send('could not generate number service not responding',JSON.parse(error)+' '+checkNumberSet,['ebiba@toronto.ca']);
        }

      });

    } else{
      //mailClient.send('could not check if increased claim number exists',checkNumberSet,['ebiba@toronto.ca']);
      throw('could not check if increased number exists');
    }

  }

  function checkSEQUENCE(){

    ajax.request({
      headers: {
        "Content-Type": "application/json"
      },
      method: "GET",
      uri: "https://was-intra-qa.toronto.ca/data-access-api-cores/v2/DataAccess.svc/covid19/submissions?$format=json&$select=refSEQNumber&$filter=(refSEQNumber%20ne%20null)&$orderby=refSEQNumber%20desc&$top=1&unwrap=true"
    }, function (response) {

      //mailClient.send('sequence check found increase by one',response.body,['ebiba@toronto.ca']);

      if(JSON.parse(response.body)[0] != undefined){
        var result = JSON.parse(response.body)[0].refSEQNumber;
        var newID = Number(result)+1;

        for (i = 0; i < randomLength(); i++) {
          checkLatest(newID);
        }

      } else{
        //mailClient.send('no claim ID exists one is being created for first time ','test',['ebiba@toronto.ca']);
        checkLatest(currentDate.getFullYear().toString().substr(-2)+000000000);
      }

    }, function (error) {
      //mailClient.send('sequence check not found create one',JSON.stringify(error),['ebiba@toronto.ca','ebiba@toronto.ca']);
      throw('could not check latest numbers service not responding');
    });
  }

}



function afterCreate(content, request) {
  var getData = JSON.parse(content.toString());
  var id = getData.id;
  var refID = getData.referenceID;

  try{

    var currentDate = new Date();
    var dateFormat = currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getDate();

    content.addProperty("status",'new');
    //var email_title = 'TEST QA - covid19 - Application Number #'+applicantNumber + ' - Reference ID '+refID;
    var email_title = 'TEST QA - covid19 - Reference ID '+refID;
    var email_header = 'New Submission';
    //var email_preheader = 'TEST QA - covid19 - Application Number #'+applicantNumber + ' - Reference ID '+refID;
    var email_preheader = 'TEST QA - covid19 - Reference ID '+refID;
    var email_footer = '';
    var footer_message = '';


    // get full name
    //var fullName = getData.property_first_name + ' ' + getData.property_last_name;

    // get address where installed
    //var addressWhereInstalled = '';
    //if(getData.address_where_installed){
    //    addressWhereInstalled = '<p><strong>Address Where Installed:</strong> ' + getData.address_where_installed + '</p>';
    //}

    // get installed devices
    // var installedDevices = '';
    // if(getData.installed_devices_information){
    //     installedDevices = '<p><strong>Devices Installed:</strong> ';
    //     for (i = 0; i < getData.installed_devices_information.length; i++) {
    //         if((i+1)==getData.installed_devices_information.length){
    //             installedDevices += getData.installed_devices_information[i].replace('backwatervalve','Backwater Valve').replace('sumppump','Sump Pump System').replace('pipeandcap','Pipe Severance and Capping of Foundation Drain');
    //         } else{
    //             installedDevices += getData.installed_devices_information[i].replace('backwatervalve','Backwater Valve').replace('sumppump','Sump Pump System').replace('pipeandcap','Pipe Severance and Capping of Foundation Drain')+', ';
    //         }
    //     }
    //     installedDevices += '</p>';
    // }

    // var streetNumber = '';
    // if(getData.streetNumber){
    //     streetNumber = '<p><strong>Street Number:</strong> ' + getData.streetNumber + '</p>';
    // }

    // var streetName = '';
    // if(getData.streetName){
    //     streetName = '<p><strong>Street Name:</strong> ' + getData.streetName + '</p>';
    // }

    // var city = '';
    // if(getData.city){
    //     city = '<p><strong>City:</strong> ' + getData.city + '</p>';
    // }

    // var province = '';
    // if(getData.province){
    //     province = '<p><strong>Province:</strong> ' + getData.province + '</p>';
    // }

    // var postalCode = '';
    // if(getData.postalCode){
    //     postalCode = '<p><strong>Postal Code:</strong> ' + getData.postalCode + '</p>';
    // }

    // var addressChanged = '';
    // var suiteNumber2 = '';
    // var streetNumber2 = '';
    // var streetName2 = '';
    // var city2 = '';
    // var province2 = '';
    // var postalCode2 = '';

    /*if(getData.addressChanged){
        addressChanged = '<p><hr/></p><p><strong>Address Changed in last 24 months:</strong> ' + getData.addressChanged + '</p>';

        if(getData.suiteNumber2){
            suiteNumber2 = '<p><strong>Suite:</strong> ' + getData.suiteNumber2 + '</p>';
        }

        if(getData.streetNumber2){
            streetNumber2 = '<p><strong>Street Number:</strong> ' + getData.streetNumber2 + '</p>';
        }

        if(getData.streetName2){
            streetName2 = '<p><strong>Street Name:</strong> ' + getData.streetName2 + '</p>';
        }

        if(getData.city2){
            city2 = '<p><strong>City:</strong> ' + getData.city2 + '</p>';
        }

        if(getData.province2){
            province2 = '<p><strong>Province:</strong> ' + getData.province2 + '</p>';
        }

        if(getData.postalCode2){
            postalCode2 = '<p><strong>Postal Code:</strong> ' + getData.postalCode2 + '</p>';
        }

    }
    */

    //var address = suiteNumber+streetNumber+streetName+city+province+postalCode;
    //var address2 = suiteNumber2+streetNumber2+streetName2+city2+province2+postalCode2;

    //var email_message = '<h2>Submission Reference ID: '+refID+',</h2><h3>Property Info</h3>'+addressWhereInstalled+installedDevices+'<h3>Contact Info</h3><p><strong>First Name:</strong> '+getData.firstName+'</p><p><strong>Last Name:</strong> '+getData.lastName+'</p><p><strong>Phone Number:</strong> '+getData.property_telephone_number+'</p><h3>Main Applicant Address or Preferred Mailing Address</h3>'+address+addressChanged+address2+' '+footer_message+'</td></tr></table>';
    //var email_message = '<h2>Submission Reference ID: '+refID+',</h2><h3>Property Info</h3>'+addressWhereInstalled+installedDevices+'<h3>Contact Info</h3><p><strong>First Name:</strong> '+getData.property_first_name+'</p><p><strong>Last Name:</strong> '+getData.property_last_name+'</p><p><strong>Phone Number:</strong> '+getData.property_telephone_number+'</p><p><strong>Alternative Phone Number:</strong> '+getData.property_alternative_telephone_number+'</p><p><strong>Email:</strong> '+getData.property_email_address+'</p>'+footer_message+'</td></tr></table>';
    var email_message = '<h2>Submission Reference ID: '+refID+',</h2><p>Thank-you, the City of Toronto has recieved your submission.</p>'+footer_message+'</td></tr></table>';

    var email_body = email_data.replace('{{TITLE}}',email_title)
      .replace('{{HEADER}}',email_header)
      .replace('{{PREHEADER}}',email_preheader)
      .replace('{{MESSAGE}}',email_message+email_footer)
      .replace('{{FOOTER}}',"");

    var to = [];
    if(getData.property_email_address!==null){
      to[0] = "ebiba@toronto.ca";
      //to[0] = "Shane.Sequeira@toronto.ca";
    } else{
      //to[0] = getData.email.toString();
      to[0] = "mpalerm@toronto.ca";
    }

    var toCC = [];
    toCC[0] = "Enton.Biba@toronto.ca";
    toCC[1] = "mpalerm@toronto.ca";
    //toCC[2] = "";


    // mailClient.createMail()
    // .setSubject(email_title)
    // .setBody(email_body)
    // .setFrom(fromEmailAddress) // optional
    // .setTo(to)
    // .setCc(toCC) //optional
    // //.setBcc(toBCC) //optional
    // .send();

  } catch(e) {
    //mailClient.send('DEV - covid19 - email not sent ',e,['ebiba@toronto.ca']);
    //mailClient.send('DEV - covid19 - email not sent ','test',['ebiba@toronto.ca']);
  }

}
