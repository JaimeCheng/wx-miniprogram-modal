
var animation = wx.createAnimation({
  duration: 200,
  timingFunction: 'linear',
  delay: 0
})

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 组件的初始显隐状态
    showStatus: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.animation = animation
        animation.opacity(0).step()
        // 显示
        if (newVal) {
          this.setData({
            animationData: animation.export(),
            showStatus: newVal
          })
          setTimeout(function () {
            animation.opacity(1).step()
            this.setData({
              animationData: animation.export()
            })
          }.bind(this), 200)
        } else {
          // 取消的动画
          this.setData({
            animationData: animation.export()
          })
          setTimeout(function () {
            this.setData({
              animationData: animation.export(),
              showStatus: false
            })
          }.bind(this), 200)
        }
      }
    },

    // 组件的类型
    type: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setData({
          type: newVal
        })
      }
    },

    // type="prompt"时的表单项
    formItems: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          items: newVal
        })
      }
    },

    // type="prompt"时 是否返回 formId 
    reportSubmit: {
      type: Boolean,
      value: false
    },

    // 是否显示取消按钮(cancelButton)
    showCancel: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.setData({
          showCancel: newVal
        })
      }
    },
    // modal的标题 如果不设置或空则不显示title
    title: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setData({
          title: newVal
        })
      }
    },
    // modal的内容
    content: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setData({
          content: newVal
        })
      }
    },
    // 取消按钮的文字
    cancelText: {
      type: String,
      value: '取消',
      observer: function (newVal, oldVal) {
        this.setData({
          cancelText: newVal
        })
      }
    },
    // 确定按钮的文字
    confirmText: {
      type: String,
      value: '好的',
      observer: function (newVal, oldVal) {
        this.setData({
          confirmText: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {}
  },
  /**
   * 组件的生命周期
   */
  attached: function () {

  },
  ready: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 取消按钮响应事件
    cancelFunc: function () {
      this.setData({
        showStatus: false
      })
      var myEventDetail = {
        confirm: false
      }
      var myEventOption = {}
      this.triggerEvent('complete', myEventDetail, myEventOption)
    },

    // 确定按钮响应事件
    confirmFunc: function (e) {
      this.setData({
        showStatus: false
      })

      var myEventDetail = {
        confirm: true
      }

      if (this.data.type === 'prompt') {
        myEventDetail.formData = e.detail.value
        if (this.data.reportSubmit) {
          myEventDetail.formId = e.detail.formId
        }
        this.triggerEvent('complete', myEventDetail)
      }

      if (this.data.type === 'openSetting') {
        wx.openSetting({
          success: res => {
            myEventDetail.authSetting = res.authSetting
            this.triggerEvent('complete', myEventDetail)
          }
        })
      }

      if (this.data.type === 'getUserInfo') {
        // 同意授权
        if (e.detail.userInfo) {
          myEventDetail.hasUserInfo = true
          myEventDetail.userInfo = e.detail.userInfo
        } else {
          // 拒绝
          myEventDetail.hasUserInfo = false
        }
        this.triggerEvent('complete', myEventDetail)
      }
    }

  }
})
