// enton.biba@toronto.ca
// access token check

function tokens(request, response, requestBody) {

  // var requestJson;
  // if (requestBody !== null && typeof requestBody === 'object' && !Array.isArray(requestBody)) {
  //   requestJson = requestBody;
  // } else if (typeof requestBody === 'string') {
  //   requestJson = JSON.parse(requestBody);
  // } else {
  //   requestJson = {};
  // }

  if(requestBody !== null){
    var requestJson = JSON.parse(requestBody);
    if(requestJson.token!==null){

      if(requestJson.token=='1225' ||
        requestJson.token=='0401' ||
        requestJson.token=='0317' ||
        requestJson.token=='0701' ||
        requestJson.token=='1231' ||
        requestJson.token=='1031' ||
        requestJson.token=='0229'
      ){
        response.setStatusCode(200);
        var confirmData = new com.google.gson.JsonArray();
        var confirmOBJECT = new com.google.gson.JsonObject();
        confirmOBJECT.addProperty("status", true);
        confirmData.add(confirmOBJECT);
        response.setContent(confirmOBJECT);
      } else{
        response.setStatusCode(500);
        var confirmData = new com.google.gson.JsonArray();
        var confirmOBJECT = new com.google.gson.JsonObject();
        confirmOBJECT.addProperty("status", false);
        confirmData.add(confirmOBJECT);
        response.setContent(confirmOBJECT);
      }

    }
  }

}
