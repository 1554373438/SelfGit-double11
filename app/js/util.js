function getAuthorization() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var weeknum = now.getDay();
  var hour = now.getHours();
  var min = parseInt(now.getMinutes() / 5);

  var str = year + "-" + Appendzero(month) + "-" + Appendzero(date) + " " + Appendzero(hour) + "" + min;
  var v = 'm.nonobank.com/msapi/' + str;
  var vMd5 = md5(v);
  return vMd5;
}

function Appendzero(obj) {
  if (obj < 10) {
    return "0" + "" + obj;
  } else {
    return obj;
  }
}


function getSearch(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);

  } else {
    return null;
  }
}

var HOST = /nonobank.com/.test(location.host) ? location.protocol + "//" + location.host + (location.port ? ":" + location.port : "") : "https://m.nonobank.com";
$(document).on('ajaxStart', function() {
  $('#loading').show();
});

$(document).on('ajaxStop', function() {
  $('#loading').hide();
});
var util = {
  getSearch: getSearch,
  getAuthorization: getAuthorization
};
