App({
  /* url方法配置 */
  globalData: {
    setting: {
      domain: "https://xxx.zuozishu.com/",
      default_module: 'index',
      default_controller: 'index',
      default_action: 'index',
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest'}
    }
  },
  /* 用于Thinkphp的请求地址封装方法,类似TP5的url方法,不需要的话可以删掉 */
  url: function (uri, param) {
    if (uri == '') uri = 'index';
    var uriarr = uri.split('/');
    var setting = this.globalData.setting;
    var urlstr = setting.domain;
    switch(uriarr.length){
      case 1:
        urlstr += setting.default_module + '/' + setting.default_controller + '/' + uri;
      break;
      case 2:
        urlstr += setting.default_module + '/' + uri;
      break;
      case 3:
        urlstr += uri;
        break;
      default:
      break;
    }
    if(typeof param == "object"){
      var paramarr = [];
      for(var i in param){
        paramarr.push(encodeURI(i) + '=' +encodeURI(param[i]));
      }
      var paramstr = paramarr.join('&');
    }
    if (typeof paramstr == 'string' && paramstr != '') urlstr += '?'+paramstr;
    return urlstr;
  },
  /* 设置请求头方法以及请求头的cookie */
  header:function(head){
   var headers = typeof this.globalData.setting.headers != 'undefined' ? this.globalData.setting.headers : {'content-type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest'};
   headers['Cookie'] = this.requestCookie();
    if (typeof head != "undefined" && typeof head == 'object'){
      for(var i in head){
       if(i=='Cookie'){
        continue;
       }
        headers[i] = head[i];
      }
    }
    return headers;
  },
  /* 根据cookie名获取本地storage缓存的cookie,若不存在则返回null */
  getCookie: function (key) {
    var cookie = wx.getStorageSync('wynecookie');
    if (typeof cookie != "object") cookie = {};
    if(key==true) return cookie;
    if(typeof cookie[key] != "undefined" && cookie[key]!=null) return cookie[key];
    return null;
  },
  /* 设置Cookie的本地storage缓存 */
  setCookie: function (key, value) {
    var cookie = wx.getStorageSync('wynecookie');
    if(typeof cookie != "object") cookie = {};
    if (key === false) wx.setStorageSync('wynecookie', null);
    if(typeof key != "string") throw 'setCookie first parameter must be string,'+(typeof key)+' given';
    cookie[key] = value;
    if (value == null) {
      delete cookie[key];
    }
    wx.setStorageSync('wynecookie',cookie);
  },
  /* 解析响应头Set-Cookie,并设置储存为本地Storage的Cookie缓存 */
  parseCookie: function(cookie){
    if(typeof cookie != 'string') return false;
    var cookies = cookie.split(/; path=[^,]+,?/);
    delete cookies[cookies.length--];
    for(var i in cookies){
      var cookiea = cookies[i].split('=');
      this.setCookie(cookiea[0],cookiea[1]);
    }
    return true;
  },
  /* 获取cookie头字符串,用于请求头cookie */
  requestCookie:function(){
    var cookie = this.getCookie(true);
    var cookiearr = [];
    for (var i in cookie) {
      cookiearr.push(i + '=' + cookie[i]);
    }
    var cookiestr = cookiearr.join('; ');
    return cookiestr;
  },
  onLaunch: function () {
   /* 备份wx.request */
   var wxrequest = wx.request;
   /* 更改wx.request方法为可写 */
   Object.defineProperty(wx,'request',{
    writable: true
   });
   /* 重写wx.request方法 */
   wx.request = function (obj) {
    /* 获取当前app实例 */
    var apps = getApp();
    /* 若没传入header则定义header对象 */
    if (typeof obj.header == 'undefined') obj.header = {};
    /* 重新设置请求头,调用app实例的header方法,加入cookie和ajax请求头 */
    obj.header = apps.header(obj.header);
    /* 备份成功回调方法 */
    var _success = obj.success;
    /* 重写成功回调方法 */
    obj.success = function (data) {
     /* 调用app实例的parseCookie方法解析并保存cookie */
     apps.parseCookie(data.header['Set-Cookie']);
     /* 调用备份的原成功回调方法 */
     _success(data);
    }
    wxrequest(obj);
   };
  }
});