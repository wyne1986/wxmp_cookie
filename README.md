# weixin mini programs cookie extension
# 微信小程序cookie扩展
* cookie extension for javascript in weixin nodejs
* weixin do not support cookie, this extension use wx.StorageSync to save cookie and get cookie, and rewrite function wx.request(), let it get and set cookie automatic;
* 微信小程序没有cookie机制,这个扩展实现了简单cookie保存和获取,并重写了wx.request方法,让其能自动设置和获取cookie

### setCookie(key,value)
* 保存的方法: const app = getApp();app.setCookie('key','value');
* 如要清楚全部cookie,则key传入false即可; 如要删除cookie的某一项,则key传入名称且value传入null即可

### getCookie(key);
* 获取的方法: const app = getApp();app.getCookie(true);
* 如果只是要获取cookie中的某一项则传入对应的名称字符串

### url(uri,query);
* url地址生成方法,类似thinkphp的url方法,如果不需要可以删除。
* 配置参数在App.globalData.setting里,其中domain为域名,default_xxx为类似tp5的默认pathInfo参数名
* 例如url('index/test/index','username=wyne&pass=123');则返回 domain/index/test/index?username=wyne&pass=123