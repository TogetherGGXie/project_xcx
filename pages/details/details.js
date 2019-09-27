//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
Page({
  data: {
    project: null,
    isShowUserPannel: false, //是否显示个人中心面板
    userInfo: app.globalData.userInfo,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weekday: '',
    week: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    imgsrcs:null,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 800,
    pageNumber: 1,
    pageSize: 5,
    logList: null,
    pages: 0,
    projectId:'',
    showModal:false,
    viewHistory:null,
    keyword:'', //标签
    keywords:null, //返回的关键字
    idx:-1,
  },

  onLoad:function(options){
    this.setData({
      projectId:options.projectId,
      domain:app.globalData.domain,
      pageNumber: 1,
      imgsrcs: null,
      logList: [],
      pages: 0,
      keyword:'',
      idx:-1,
    })
    this.getProject(options.projectId)
    this.getProjectLogs(options.projectId)
  },
  showUserPannel: function () {
    wx.switchTab({
      url: '../publish/publish'
    })
  },

  getProject:function (e){
    wx.request({
      url: app.globalData.domain+"/project/getProject/"+e,
      header: {
        'Cookie': app.globalData.cookie,
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if(res.data.code == 0) {
          this.setData({
            project: res.data.project,
            // imgsrcs:res.data.img.split(","),
            // keywords:res.data.keywords.split(",")
          })
          if (res.data.project.img != '' && res.data.project.img != null) {
            var imgsrcs = res.data.project.img.split(",")
            for(let i = 0; i < imgsrcs.length; i++) {
              imgsrcs[i] = this.data.domain + '/' + imgsrcs[i]
            }
            this.setData({
              imgsrcs: imgsrcs,
            })
          }
          if (res.data.project.keywords != '' && res.data.project.keywords != null){
            this.setData({
              keywords: res.data.project.keywords.split(","),
            })
          }
          let date = new Date(this.data.project.startTime);
          this.data.weekday=this.data.week[date.getDay()];
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },


  getProjectLogs: function (e) {
    wx.request({
      url: app.globalData.domain + "/projectLog/getLogs",
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: this.data.pageSize,
        projectId: this.data.projectId,
        keyword:this.data.keyword
      },
      header: {
        'Cookie': app.globalData.cookie,
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        var old = this.data.logList;
        var that = this;
        if(res.data.code ==0) {
          for (var i = 0; i < res.data.records.length; i++) {
            if (res.data.records[i].pics != null && res.data.records[i].pics != '') {
              res.data.records[i].pic = that.data.domain + '/' + res.data.records[i].pics.split(",")[0]
              res.data.records[i].pics = res.data.records[i].pics.split(",")
              for (let j = 0; j < res.data.records[i].pics.length; j++) {
                res.data.records[i].pics[j] = that.data.domain + '/' + res.data.records[i].pics[j]
              }
            }
            res.data.records[i].weekday = this.data.week[new Date(res.data.records[i].date).getDay()];
          }
          this.setData({
            logList: old.concat(res.data.records),
            pages: res.data.pages
          })
          if (this.data.pages == this.data.pageNumber || this.data.pages == 0)
            this.setData({
              isEnd: true
            })
          else
            this.data.isEnd = false;
            console.log(this.data.logList)
        // setData data
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
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


  setKeyword: function (e) {
    console.log(e.currentTarget.id)
    if (this.data.keyword == '' || this.data.keyword != this.data.keywords[e.currentTarget.id]) {
      this.setData({
        keyword: this.data.keywords[e.currentTarget.id],
        idx: e.currentTarget.id,
        logList:[]
      })
    } else {
      this.setData({
        keyword: '',
        idx:-1,
        logList:[]
      })
    }
    this.getProjectLogs(this.data.projectId);

  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '../logdetails/logdetails?projectName='+this.data.project.projectName+'&log=' + JSON.stringify(this.getLog(e.currentTarget.id)),
    })
  },

  showView: function(e) {
    console.log(e.currentTarget.id)
    this.setData({
      showModal:true,
    })
    wx.request({
      url: app.globalData.domain + "/viewStatis/getViewHistory?logId=" + e.currentTarget.id,
      header: {
        'Cookie': app.globalData.cookie,
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        this.setData({
          viewHistory: res.data,
        })
        if (res.data.length == 0){
          wx.showToast({
            title: '暂无浏览记录',
            duration:1000,
            icon:'none'
            
          })

        }
      }
    })
  },

  preventTouchMove: function () {
    
  },

  hideModel:function() {
    this.setData({
      showModal: false,
      viewHistory: null,
      logId:null,
    })
  },

  getLog:function(logId) {
    var logList = this.data.logList
    for (var i in logList){
      if (logList[i].logId == logId){
        return logList[i];
      }
    }
  },

  handleProjectImagePreview(e) {
    const idx = e.target.dataset.idx
    const pics = this.data.imgsrcs
    console.log(pics[idx])
    wx.previewImage({
      current: pics[idx],  //当前预览的图片
      urls: pics,  //所有要预览的图片
    })
  },

})

