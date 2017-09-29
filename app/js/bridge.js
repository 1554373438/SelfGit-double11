(function() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  var CLIENT_VERSION = GetQueryString('version')|| '';
  var newIosBridge = CLIENT_VERSION >= '4.4.0' && !isAndroid;

  function setupNewIosBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
  }

  var Bridge = function() {
    var self = this;
    if (window.WebViewJavascriptBridge) {
      this.bridge = WebViewJavascriptBridge;
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
        self.bridge = WebViewJavascriptBridge;
      }, false);
    }
    if (newIosBridge) {
      setupNewIosBridge(function(bridge) {
        self.bridge = bridge;
      });
    }
  };

  Bridge.prototype.send = function(obj, callback) {
    console.log(obj);

    if (this.bridge) {
      if (isAndroid) {
        obj = JSON.stringify(obj);
      }
      if (newIosBridge) {
        this.bridge.callHandler('nonobankIos', obj, callback);
      } else {
        this.bridge.send(obj, callback);
      }
    }
  };

  window.Bridge = Bridge;


  function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return  unescape(r[2]); 
    
    } else {
        return null;
    }
  }
})();
