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
    searchText: '',
    pageNumber: 1,
    pageSize : 10,
    projectList: []
  },
  onLoad: function () {
    this.setData({
      userInfo: app.getUserinfo()
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
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        this.setData({
          projectList: res.data.records
        })
        // setData data
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
  //跳转详情页
  gotoDetail: function() {
    wx.navigateTo({
      url: '/pages/pageopen/pageopen',
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
      searchText: e.detail.value
    });
  },
  //搜索回调
  endsearchList(e) {
    console.log('查询数据')
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchText: ''
    })
  },
  //清空搜索框
  activity_clear(e) {

    this.setData({
      searchText: ''
    })
  },


})

