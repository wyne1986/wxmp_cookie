require('src/wyneCookie.js');
App({
  onLaunch: function () {
   wx.cookie.initRequest();
  }
});