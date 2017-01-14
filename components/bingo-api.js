var $ = require("jquery");
var BingoApi = {};

BingoApi.baseUrl = "/api";

BingoApi.postPhrase = function(phrase) {
    return $.ajax({
        url: BingoApi.baseUrl + "/phrase",
        data: { "phrase": phrase },
        dataType: "json",
        method: "POST"
    }).then(function(response) {
        console.log("response: " + response);
        return response;
    });
};

BingoApi.getPhrases = function() {
    return $.get(BingoApi.baseUrl + "/phrase/all", function(response) {
        return response;
    });
};

BingoApi.deletePhrases = function() {
    return $.ajax({
        url: BingoApi.baseUrl + "/phrase/all",
        dataType: "json",
        method: "DELETE",
    }).then(function(response) {
        return response;
    });
};

module.exports = BingoApi;
