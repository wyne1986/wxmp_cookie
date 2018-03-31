# weixin mini programs cookie extension
# 微信小程序cookie扩展
* cookie extension for javascript in weixin nodejs
* weixin do not support cookie, this extension use wx.StorageSync to save cookie and get cookie, and rewrite function wx.request(), let it get and set cookie automatic;
* 微信小程序没有cookie机制,这个扩展实现了简单cookie保存和获取,并重写了wx.request方法,让其能自动设置和获取cookie

## how to used? 使用方法
* 在app.js顶部引入即可:```require('src/wyneCookie.js');```
* 如需要给wx.request方法加入钩子,让其能自动设置和获取cookie,则请在引入后,在app.js的App对象的onLaunch方法开头调用方法:```wx.cookie.initRequest();```


### wx.cookie.setCookie(key,value)
* 保存的方法: ```wx.cookie.setCookie('key','value');```
* 如要清除全部cookie,则key传入false即可,如:```wx.cookie.setCookie(false)```
* 如要删除cookie的某一项,则key传入名称且value传入null即可,如```wx.cookie.setCookie('username',null);```
* value值可传入字符串string或对象{},若传入对象则会自动进行encodeURI和JSON.stringify转换,同时获取时也会decodeURI和JSON.parse

### wx.cookie.getCookie(key);
* 获取的方法: ```wx.cookie.getCookie(true);```
* 如果只是要获取cookie中的某一项则传入对应的名称字符串,例如```wx.cookie.getCookie('username')```
* 若有值是JSON序列,则会自动转换成对象。但是服务端的Cookie则不会，若有兴趣的朋友可以完善服务端获取的Cookie转换

### wx.cookie.url(uri,query);
* url地址生成方法,类似thinkphp的url方法,如果不需要可以删除。
* 配置参数在wyneCookie.globalData.setting里,其中domain为域名,default_xxx为类似tp5的默认pathInfo参数名
* 例如wx.cookie.url('index/test/index','username=wyne&pass=123');则返回 domain/index/test/index?username=wyne&pass=123