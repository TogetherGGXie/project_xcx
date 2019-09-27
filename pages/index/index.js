//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: wx.getStorageSync(app.globalData.userInfoKey),
    hasUserInfo: app.globalData.hasUserInfo,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 800,
    isShowUserPannel:false, //是否显示个人中心面板
    isEnd:false,
    domain: '',
    searchText: '',
    searchstr: '',
    pageNumber: 1,
    pageSize : 5,
    projectList: [],
    pages: 0,
    authority:''
  },
  onLoad: function () {
    this.setData({
      userInfo: app.getUserinfo(),
      domain: app.globalData.domain,
      searchText: '',
      pageNumber: 1,
      searchstr: '',
      projectList: [],
      pages: 0,
      authority:app.globalData.authority
    });
    this.getProjects();
  },
  getProjects: function() {
    wx.request({
      url: app.globalData.domain + "/project/getAllProjects",
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: this.data.pageSize,
        searchText: this.data.searchText
      },
      header: {
        'Cookie': app.globalData.cookie,
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if(res.data.code != 0){
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          var old = this.data.projectList;
          var that = this;
          for(var i =0;i<res.data.records.length;i++){
            if (res.data.records[i].img != null && res.data.records[i].img != '')
              res.data.records[i].img = this.data.domain + '/' + res.data.records[i].img.split(",")[0]
          }
          this.setData({
            projectList: old.concat(res.data.records),
            pages: res.data.pages
          })
          if (this.data.pages == 0 || this.data.pages == this.data.pageNumber)
            this.setData({
              isEnd: true
            })
          else this.data.isEnd = false;
          // setData data
        }
      }
    })
  },
  showUserPannel: function(){
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

  // 搜索框右侧 事件
  addhandle() {
    console.log('触发搜索框右侧事件')
  },

  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value
    });
  },
  //搜索回调
  endsearchList(e) {
    this.setData({
      projectList:[],
      searchText: this.data.searchstr,
      pageNumber: 1
    });
    this.getProjects();
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
  },
  //清空搜索框
  activity_clear(e) {

    this.setData({
      searchstr: ''
    })
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '正在加载中',
      icon: 'loading',
      duration: 200
    })
    this.setData({
      isEnd:false
    })
    this.onLoad();
    wx.stopPullDownRefresh();
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
          pageNumber: this.data.pageNumber+1
      })
      var that = this;
      // 显示加载图标
      wx.showToast({
        title: '正在加载中',
        icon: 'loading',
        duration: 200
      })
      this.getProjects();
    }

  },
  showDetail: function(e) {
    console.log(e.currentTarget.id),
      wx.navigateTo({
        url: '../details/details?projectId=' + e.currentTarget.id,
      })
  },
  errorFunction: function () {
    this.setData({
      avatar: '/images/default.jpg'
    })
  }
  

})

