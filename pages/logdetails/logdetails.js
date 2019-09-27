// pages/logdetails/logdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    projectName:'',
    domain:app.globalData.domain,
    pics: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tmp = JSON.parse(options.log)
    this.setData({
      detail: tmp,
      projectName:options.projectName,
    })
    this.viewLog()
  },

  viewLog() {
    wx.request({
      url: app.globalData.domain + "/viewStatis/addView",
      method: 'POST',
      header: {
        'Cookie': app.globalData.cookie,
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data:{
        logId: this.data.detail.logId
      },
      success: res => {
        if(res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 200
          })
        }
      }
    })
  },
  
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const tempFilePaths = this.data.detail.pics
    wx.previewImage({
      current: tempFilePaths[idx],  //当前预览的图片
      urls: tempFilePaths,  //所有要预览的图片
    })
  },
})