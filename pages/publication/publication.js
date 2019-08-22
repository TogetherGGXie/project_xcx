// pages/pagepublication/pagepublication.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:"",
    projectList:[],
    pIndex:0,
    projectId: '',
    projectName:'',
    pics: '',
    index:0,
    tempFilePaths:[],
    content:''
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
  //搜索框输入时触发
  inputContent(ev) {
    let e = ev.detail;
    this.setData({
      content: e.value
    });
  },
  pickProject: function (e) {
    this.setData({
      pIndex: e.detail.value,
      projectId: this.data.projectList[e.detail.value].projectId,
      projectName: this.data.projectList[e.detail.value].projectName,
    })
  },
  setTime: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  chooseimg: function () {
    let _this = this;
    let len = 0;
    if (_this.data.tempFilePaths != null) {
      len = _this.data.tempFilePaths.length;
    }//获取当前已有的图片
    wx.chooseImage({
      count: 3 - len, //最多还能上传的图片数,这里最多可以上传3张
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        let tempFilePathsimg = _this.data.tempFilePaths
        //获取当前已上传的图片的数组
        var tempFilePathsimgs = tempFilePathsimg.concat(tempFilePaths)
        //把当前上传的数组合并到原来的数组中
        _this.setData({
          tempFilePaths: tempFilePathsimgs
        })

      },

      fail: function () {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        })
        return;
      }
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    var old = this.data.tempFilePaths
    old.splice(idx, 1)
    this.setData({
      tempFilePaths: old
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const tempFilePaths = this.data.tempFilePaths
    wx.previewImage({
      current: tempFilePaths[idx],  //当前预览的图片
      urls: tempFilePaths,  //所有要预览的图片
    })
  },

  // addLog: function() {
  //   var count = this.uploadImg();
  //   var length = this.data.tempFilePaths.length;
  //   console.log("count="+count),
  //     console.log("length"+length),
  //     console.log(length == count)
  //   var isValid = this.isValid();
  //   if (isValid && count == length){
  //     console.log(this.data.pics)
  //     post();
  //   }
  // },
  async addLog() {
    let isValid = this.isValid();
    var tempFilePaths = this.data.tempFilePaths;
    var pics = this.data.pics;
    var that = this;
    var count = 0;
    if(isValid) {
      for (var i = 0; i < tempFilePaths.length; i++) {
        await this.uploadImg(tempFilePaths[i]).then((res) => {
          console.log("res="+res)
          pics = pics + res + (i == tempFilePaths.length-1?"":" ") // 图片地址
          that.setData({
            pics: pics
          })
          console.log("第"+i+"次调用后pics="+pics)
          count++
        })
      }
      console.log("上传后"+pics)
      console.log(count)
      if (count == tempFilePaths.length){
        this.post();
      }
      else {
        console.log("count="+count),
          console.log("是否相等="+this.data.tempFilePaths.length)
        wx.showToast({
          title: '图片上传失败',
          icon: 'none',
          duration: 1000//持续的时间
        });
      }
    }else{
      wx.showToast({
        title: '请正确填写日志',
        icon: 'none',
        duration: 1000//持续的时间
      });
    }
  
  },
  isValid: function (){
    var flag = true;
    if (this.data.time == null || this.data.time == '')
      {console.log("1kong");flag = false;}
    if (this.data.projectId == null || this.data.projectId == '')
    { console.log("2kong"); flag = false; }
    if (this.data.content == null || this.data.content == '')
    { console.log("3kong"); flag = false; }
    return flag;
  },
  uploadImg: function(filePath){
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.domain + '/upload', //仅为示例，非真实的接口地址
        filePath: filePath,
        name: 'img',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          folder: 2
        },
        success: function (res) {
          var data = res.data
          if (data != "error") {
            console.log("1上传成功返回"+data);
            resolve(res.data)
          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'fail',
              duration: 1000//持续的时间
            });
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  post: function(){
    console.log("pics" +this.data.pics)
    wx.request({
      url: app.globalData.domain + '/projectLog/addLog',
      method: 'POST',
      header: {
        'Cookie': app.globalData.cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        pics: this.data.pics,
        date: this.data.time,
        projectId: this.data.projectId,
        content: this.data.content
      },
      success: res => {
        console.log(res.data)
        wx.redirectTo({
          url: '../details/details?projectId=' + res.data.projectId ,
        })
      }
    })
  }
})