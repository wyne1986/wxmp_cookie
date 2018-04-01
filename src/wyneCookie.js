/*
wx.cookie extension
created by wyne, Q366659539
*/
let wyneCookie = {
 /* url方法配置 */
 globalData: {
  setting: {
   domain: "https://lf.zuozishu.com/",
   default_module: 'index',
   default_controller: 'index',
   default_action: 'index',
   headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest' }
  }
 },
 /* 用于Thinkphp的请求地址封装方法,类似TP5的url方法,不需要的话可以删掉 */
 url: function (uri, param) {
  if (uri == '') uri = 'index';
  var uriarr = uri.split('/');
  var setting = this.globalData.setting;
  var urlstr = setting.domain;
  switch (uriarr.length) {
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
  if (typeof param == "object") {
   var paramarr = [];
   for (var i in param) {
    paramarr.push(encodeURI(i) + '=' + encodeURI(param[i]));
   }
   var paramstr = paramarr.join('&');
  }
  if (typeof paramstr == 'string' && paramstr != '') urlstr += '?' + paramstr;
  return urlstr;
 },
 /* 设置请求头方法以及请求头的cookie */
 header: function (head) {
  var headers = typeof this.globalData.setting.headers != 'undefined' ? this.globalData.setting.headers : { 'content-type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest' };
  headers['Cookie'] = this.requestCookie();
  if (typeof head != "undefined" && typeof head == 'object') {
   for (var i in head) {
    if (i == 'Cookie') {
     continue;
    }
    headers[i] = head[i];
   }
  }
  return headers;
 },
 /* 根据cookie名获取本地storage缓存的cookie,若不存在则返回null
  * types='json'时将进行json解析
  */
 getCookie: function (key, types) {
  var cookie = wx.getStorageSync('wynecookie');
  if (typeof cookie != "object") cookie = {};
  if (key == true){
   for (var k in cookie) {
    cookie[k] = this.parseJson(cookie[k]);
   }
  } return cookie;
  if (typeof cookie[key] != "undefined" && cookie[key] != null){
   return this.parseJson(cookie[key]);
  }
  return null;
 },
 /* 设置Cookie的本地storage缓存 */
 setCookie: function (key, value) {
  var cookie = wx.getStorageSync('wynecookie');
  if (typeof cookie != "object") cookie = {};
  if (key === false) { wx.removeStorageSync('wynecookie'); return true; }
  if (typeof key != "string") { throw 'setCookie first parameter key must be string, ' + (typeof key) + ' given.'; return false; }
  if (value == null){
   delete cookie[key];
  } else {
   cookie[key] = typeof value == 'object' ? encodeURI(JSON.stringify(value)) : value;
  }
  wx.setStorageSync('wynecookie', cookie);
  return true;
 },
 /* 解析响应头Set-Cookie,并设置储存为本地Storage的Cookie缓存 */
 parseCookie: function (cookie) {
  if (typeof cookie != 'string') return false;
  var cookies = cookie.split(/; path=[^,]+,?/);
  delete cookies[cookies.length--];
  for (var i in cookies) {
   var cookiea = cookies[i].split('=');
   this.setCookie(cookiea[0], cookiea[1]);
  }
  return true;
 },
 /* 获取cookie头字符串,用于请求头cookie */
 requestCookie: function () {
  var cookie = this.getCookie(true);
  var cookiearr = [];
  for (var i in cookie) {
   cookiearr.push(i + '=' + cookie[i]);
  }
  var cookiestr = cookiearr.join('; ');
  return cookiestr;
 },
 parseJson: function (str) {
  try {
   return JSON.parse(decodeURI(str));
  } catch (e) {
   return str;
  }
 },
 /* 初始化重写wx.request方法,加入cookie处理 */
 initRequest: function () {
  /* 备份wx.request */
  var wxrequest = wx.request;
  /* 更改wx.request方法为可写 */
  Object.defineProperty(wx, 'request', {
   writable: true
  });
  /* 重写wx.request方法 */
  wx.request = function (obj) {
   /* 若没传入header则定义header对象 */
   if (typeof obj.header == 'undefined') obj.header = {};
   /* 重新设置请求头,调用app实例的header方法,加入cookie和ajax请求头 */
   obj.header = wyneCookie.header(obj.header);
   /* 备份成功回调方法 */
   var _success = obj.success;
   /* 重写成功回调方法 */
   obj.success = function (data) {
    /* 调用app实例的parseCookie方法解析并保存cookie */
    wyneCookie.parseCookie(data.header['Set-Cookie']);
    /* 调用备份的原成功回调方法 */
    _success(data);
   }
   wxrequest(obj);
  };
 }
};
wx.cookie = wyneCookie;