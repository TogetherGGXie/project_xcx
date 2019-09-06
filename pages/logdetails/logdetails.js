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
    domain: app.globalData.domain,
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
    if(tmp.pics!='' && tmp.pics!=null){
      this.setData({
        pics: tmp.pic.split(","),
      })
      console.log(app.globalData.domain)
      for(let i = 0; i < this.data.pics.length; i++){
        let param = 'pics[' + i + ']';
        this.setData({
          [param] : app.globalData.domain + "/" + this.data.pics[i],
        })

      }
    }
    console.log(this.data.detail)
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
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const tempFilePaths = this.data.pics
    wx.previewImage({
      current: tempFilePaths[idx],  //当前预览的图片
      urls: tempFilePaths,  //所有要预览的图片
    })
  },
})