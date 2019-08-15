// pages/pagepublication/pagepublication.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:"",
    startTime:"",
    endTime:"",
    projectList:[],
    pIndex:0,
    projectId: '',
    projectName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSelection();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
   /**
   * 设置日志时间
   */
  getSelection: function() {
    wx.request({
      url: app.globalData.domain +'/project/getProjectNames',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        this.setData({
          projectList: res.data
        })
      // setData data
      }
    })
    
  
  },
  pickProject: function (e) {
    console.log("改之前",this.data.projectId, this.data.projectName),
    this.setData({
      pIndex: e.detail.value,
      projectId: this.data.projectList[e.detail.value].projectId,
      projectName: this.data.projectList[e.detail.value].projectName,
    })
    console.log(this.data.pIndex,this.data.projectId, this.data.projectName)
  },
  setTime: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
   /**
   * 设置开始时间
   */
  setStartTime: function(e){
    this.setData({
      startTime: e.detail.value
    })
  },
   /**
   * 设置结束时间
   */
  setEndTime: function(e){
    this.setData({
      endTime: e.detail.value
    })
  },
  //选择文件
  chooseImage: function(){
    wx.chooseImage({
      success: function(res) {
        console.log(res)
      },
    })
  }
})