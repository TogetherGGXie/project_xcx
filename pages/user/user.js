// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync(app.globalData.userInfoKey),
    newName:'',
    oldName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("开始获得姓名")
    this.getName(),
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  inputName(ev) {
    let e = ev.detail;
    this.setData({
      newName: e.value
    });
  },
  editName() {
    var that=this;
    console.log(this.data.newName)
    if (this.data.newName != this.data.oldName && (this.data.newName != null || this.data.oldName != '')){
      wx.showModal({
        title: '修改姓名',
        content: '确认要将姓名修改为'+this.data.newName+' 吗?',
        showCancel: true,
        cancelText: '否',
        cancelColor: '',
        confirmText: '是',
        confirmColor: '',
        success: function(res) {
          if(res.cancel){

          } else {
            that.edit()
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }
    
  },
  edit: function() {
    wx.request({
      url: app.globalData.domain + "/wxUser/editName",
      header: {
        'Cookie': app.globalData.cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        newName: this.data.newName,
      },
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000,
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1000,
          })
        }

      }
    })
  },
  getName:function() {
    wx.request({
      url: app.globalData.domain + "/wxUser/getName",
      header: {
        'Cookie': app.globalData.cookie,
      },
      success: res =>{
        this.setData({
          newName: res.data,
          oldName: res.data
        })
      }
    })
  }
  
})