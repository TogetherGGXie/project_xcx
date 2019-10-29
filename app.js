//app.js
//本地存储中userinfo key
const USERINFOKEY = "userinfo";

let app = {
  globalData: {
    userInfoKey: USERINFOKEY,
    hasUserInfo: !!wx.getStorageSync(USERINFOKEY), //是否获取用户信息成功标志
    userInfo: wx.getStorageSync(USERINFOKEY), //用户信息
    // domain:"http://localhost:8088",
    domain:"https://server.togethergg.cn",
    cookie:'',
    authority:'',
    userName:'',
    organization:''
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        wx.request({
          url: that.globalData.domain + '/wxUser/decodeUserInfo',
          data: {
            code: code
          },
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            // var openid = res.data.openid //返回openid
            // console.log('openid为' + openid);
            if (res.data.code != 0) {
              wx.showToast({
                title: res.data.msg,
              })
            } else {
              that.globalData.cookie = "JSESSIONID=" + res.data.sessionId
              that.globalData.authority = res.data.authority
              that.globalData.userName = res.data.userName
              that.globalData.organization = res.data.organization
              if(that.globalData.hasUserInfo) {
                that.redirect();
              }
            }
          }
        })
      }
    })
  },
  redirect : function () {
    var that = this;
    if (that.globalData.authority == '' || that.globalData.userName == '' || that.globalData.organization == '') {
      wx.showToast({
        title: '请先完善个人信息！',
        icon: 'none',
        duration: 1000,
        success(data) {
          setTimeout(function () {
            //要延时执行的代码
            wx.reLaunch({
              url: "/pages/user/user",
            })
          }, 1000) //延迟时间
        }
      })
    } else {
      wx.reLaunch({
        url: "/pages/index/index",
      })
    }
  },
  //获取用户信息
  setUserinfo: function (e) {
    //先判断缓存中时候存在用户信息
    let userinfo = wx.getStorageSync(USERINFOKEY)
    if (!userinfo) {
      wx.setStorageSync(USERINFOKEY, e.detail.userInfo)
        // wx.reLaunch({
        //   url: '/pages/index/index'
        // })
      this.redirect()
    } else {
      wx.reLaunch({
        url: '/pages/user/user'
      })
    }
  },
  getUserinfo: function() {
    return wx.getStorageSync(USERINFOKEY)
  },

};


App(app)