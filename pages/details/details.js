//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
Page({
  data: {
    autoplay: true,
    interval: 5000,
    duration: 800,
    project: null,
    isShowUserPannel: false, //是否显示个人中心面板
    userInfo: app.globalData.userInfo,
    hasUserInfo: app.globalData.hasUserInfo,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weekday: '',
    week: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    imgsrcs:[],
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 800,
    pageNumber: 1,
    pageSize: 5,
    logList: [],
    pages: 0,
    projectId:'',
    showModal:false,
    logDetail:null,
  },

  onLoad:function(options){
    this.setData({
      projectId:options.projectId,
      domain:app.globalData.domain,
      pageNumber: 1,
      projectList: [],
      logList: [],
      pages: 0
    })
    this.getProject(options.projectId)
    this.getProjectLogs(options.projectId)
  },
  showUserPannel: function () {
    let isShow = this.data.isShowUserPannel
    if (!isShow) {
      isShow = true
    } else {
      isShow = false
    }
    this.setData({
      isShowUserPannel: isShow
    })
  },
  getProject:function (e){
    wx.request({
      url: app.globalData.domain+"/project/getProject/"+e,
      success: res => {
        console.log(res.data)
        this.setData({
          project:res.data,
          imgsrcs:res.data.img.split(" "),
        })
        // for(var i=0;i<this.data.imgsrcs.length-1;i++){
        //   this.data.imgsrcs[i] = app.globalData.domain+"/"+this.data.imgsrcs[i];
        // } 
        this.data.imgUrls=[];
        this.data.imgUrls=this.data.imgsrcs;
        console.log(this.data.imgsrcs);
        let date = new Date(this.data.project.startTime);
        this.data.weekday=this.data.week[date.getDay()]
      }
    })
  },
  getProjectLogs: function (e) {
    wx.request({
      url: app.globalData.domain + "/projectLog/getLogs",
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: this.data.pageSize,
        projectId: this.data.projectId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        var old = this.data.logList;
        var that = this;
        for (var i = 0; i < res.data.records.length; i++) {
          res.data.records[i].pic = res.data.records[i].pics.split(" ")[0]
          res.data.records[i].pics = res.data.records[i].pics.split(" ")
          res.data.records[i].weekday = this.data.week[new Date(res.data.records[i].date).getDay()];
        }
        this.setData({
          logList: old.concat(res.data.records),
          pages: res.data.pages
        })
        if (this.data.pages == this.data.pageNumber || this.data.pages ==0)
          this.setData({
            isEnd : true
          }) 
          else 
            this.data.isEnd = false;
        // setData data
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pages <= this.data.pageNumber) {
      this.setData({
        isEnd: true
      })
    } else {
      this.setData({
        pageNumber: this.data.pageNumber + 1
      })
      var that = this;
      // 显示加载图标
      wx.showToast({
        title: '正在加载中',
        icon: 'loading',
        duration: 200
      })
      this.getProjectLogs(this.data.projectId);
    }
  },
  showDetail: function (e) {
    console.log(e.currentTarget.id)
    this.setData({
      showModal:true,
      logDetail: this.getLog(e.currentTarget.id)
    })
    console.log(this.data.logDetail)
  },
  preventTouchMove: function () {

  },
  hideModel:function() {
    this.setData({
      showModal: false,
      logDetail: null,
      logId:null,
    })
  },
  getLog:function(logId) {
    console.log("getLog logId="+logId)
    var logList = this.data.logList
    console.log("getLog logList" +logList)
    for (var i in logList){
      if (logList[i].logId == logId){
        return logList[i];
      }
    }
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const pics = this.data.logDetail.pics
    console.log(pics[idx])
    wx.previewImage({
      current: pics[idx],  //当前预览的图片
      urls: pics,  //所有要预览的图片
    })
  },
  handleProjectImagePreview(e) {
    const idx = e.target.dataset.idx
    const pics = this.data.imgUrls
    console.log(pics[idx])
    wx.previewImage({
      current: pics[idx],  //当前预览的图片
      urls: pics,  //所有要预览的图片
    })
  },

})

