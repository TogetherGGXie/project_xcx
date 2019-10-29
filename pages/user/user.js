// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: wx.getStorageSync(app.globalData.userInfoKey),
    hasUserInfo: app.globalData.hasUserInfo,
    isDisabled: true,
    userName:'',
    tmpName:'',
    tmpAuthority:'',
    tmpDepartment:'',
    departmentName:'',
    organizationName: '',
    tmpOrganizationName: '',
    tmpDepartmentName: '',
    multiArray: [["请选择"], ["请选择"]],
    authority: app.globalData.authority,
    orginazition: app.globalData.orginazition,
    authorities: [{ name: "请选择", value: 0 }, { name: "用户", value: 1 }, { name: "管理员", value: 2 }],
    multiIndex: [0,0],
    organizationArray: [],
    organizationList: [],
    departmentArray: [],
    departmentList: [],
    domain: '',
    organizationId : 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasUserInfo: app.getUserinfo() == null || app.getUserinfo() == '' ? false : true,
      userInfo: app.getUserinfo(),
      domain: app.globalData.domain,
      // userName: app.globalData.userName,
      // authority: app.globalData.authority,
      // organization: app.globalData.organization,
      tmpAuthority: 0,
    })
    if(this.data.hasUserInfo) {
      this.getUserInfo();
      this.getOrganization();
    }

    // this.getDepartment();
    // this.cancle()
  },

  bindGetUserInfo: function (e) {
    app.setUserinfo(e)
  },
  getUserInfo : function() {
    wx.request({
      url: this.data.domain + '/wxUser/getUserInfo',
      method: 'GET',
      header: {
        'Cookie': app.globalData.cookie,
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data.userInfo);
        if(res.data.code == 0) {
          this.setData({
            userName: res.data.userInfo.userName,
            tmpName: res.data.userInfo.userName,
            departmentId: res.data.userInfo.organizationId,
            tmpDepartment: res.data.userInfo.organizationId,
            departmentName: res.data.userInfo.departmentName,
            tmpDepartmentName: res.data.userInfo.departmentName,
            organizationName: res.data.userInfo.organizationName,
            tmpOrganizationName: res.data.userInfo.organizationName,
            authority: res.data.userInfo.authority,
            tmpAuthority: res.data.userInfo.authority,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      }
    })
  },


  getOrganization: function() {
    wx.request({
      url: this.data.domain + '/organization/getOrganization',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res=> {
        var organizationList = res.data;
        var organizationArr = organizationList.map(item => {　　　// 此方法将组织名称区分到一个新数组中
          return item.name;
        });
        // organizationArr.unshift('请选择')
        this.setData({
          multiArray: [organizationArr, []],
          organizationList: organizationList,
          organizationArray: organizationArr
        })
        var organizationId = organizationList[0]['id'];　　　　//获取默认的对应的 teach_area_id
        if (organizationId) {
          this.getDepartment(organizationId)　　　　　　// 如果存在调用获取对应的班级数据
        }
      }
    })
  },

  getDepartment: function (e) {
    this.setData({
      organizationId: e
    })
    wx.request({
      url: this.data.domain + '/organization/getDepartment',
      method: 'GET',
      data: {
        organizationId: e
      },
      success: res => {
        var departmentList = res.data;
        var departmentArr = departmentList.map(item => {　　　// 此方法将部门名称区分到一个新数组中
          return item.name;
        });
        let temp = 'multiArray[1]';
        let tempIndex = 'multiIndex[1]'
        departmentArr.unshift('请选择');
        this.setData({
          [temp]: departmentArr,
          departmentList: departmentList,
          departmentArray: departmentArr
        })
      }
    })
  },


  bindMultiPickerColumnChange: function (e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    var tmpOrganizationId = this.data.organizationId;　　　　// 保持之前的校区id 与新选择的id 做对比，如果改变则重新请求数据
    switch (e.detail.column) {
      case 0:
        var organizationList = this.data.organizationList;
        var organizationId = organizationList[e.detail.value]['id'];
        if (tmpOrganizationId != organizationId) {　　　　// 与之前保持的校区id做对比，如果不一致则重新请求并赋新值
          this.searchClassInfo(organizationId);
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var departmentId = 0;
    var departmentList = this.data.departmentList;
    var selectIndex = e.detail.value[1];
    var realIndex = selectIndex - 1;
    if (realIndex < departmentId) {
      this.setData({
        tmpDepartment : 0
      })
    } else {
      this.setData({
        tmpDepartment: departmentList[realIndex]['id'],　　// tmpDepartment 代表着选择的部门对应的id
        tmpDepartmentName: departmentList[realIndex]['name'],
        tmpOrganizationName: this.data.organizationList[e.detail.value[0]]['name']
      })
    }
    this.setData({
      multiIndex: e.detail.value
    })
  },

  inputName(ev) {
    let e = ev.detail;
    this.setData({
      tmpName: e.value
    });
  },


  submit() {
    var that=this;
    if (this.haveChange()){
      if(this.data.tmpName == ''){
        wx.showToast({
          title: '请填写用户名',
        })
      } else if (this.data.tmpAuthority == 0){
        wx.showToast({
          title: '请选择权限',
        })
      } else if (this.data.tmpDepartment == 0) {
        wx.showToast({
          title: '请选择部门',
        })
      }else {
        wx.showModal({
          title: '修改个人信息',
          content: '确认要修改个人信息吗',
          showCancel: true,
          cancelText: '否',
          cancelColor: '',
          confirmText: '是',
          confirmColor: '',
          success: function (res) {
            if (res.cancel) {

            } else {
              that.edit()
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    } else {
      wx.showToast({
        title: '请修改后提交',
        icon: 'none'
      })
    }
  },

  haveChange: function() {
    var data = this.data;
    return data.tmpName != data.userName || data.tmpAuthority != data.authority || data.departmentId != data.tmpDepartment
  },

  edit: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + "/wxUser/editUserInfo",
      header: {
        'Cookie': app.globalData.cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        userName: this.data.tmpName,
        authority: this.data.tmpAuthority,
        organizationId : this.data.tmpDepartment
      },
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000,
          })
          that.setData({
            isDisabled: true,
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
  
  pickAuthority: function (e) {
    console.log(e)
    this.setData({
      tmpAuthority: e.detail.value
    })
  },
  setDisable : function() {
    this.setData({
      isDisabled : !this.data.isDisabled
    })
  },
  cancle: function() {
    this.setData({
      tmpName: this.data.userName,
      tmpAuthority: this.data.authority,
      tmpOrginazition: this.data.orginazitionId,
      tmporganizationName: this.data.organizationName,
      tmpDepartmentName: this.data.departmentName
    })
    this.setDisable();
  }
  
})