# wx-miniprogram-modal
微信小程序自定义Modal模态框

[![](https://img.shields.io/npm/dm/wx-miniprogram-modal.svg?style=popout)](https://www.npmjs.com/package/wx-miniprogram-modal)[![](https://img.shields.io/badge/dynamic/json.svg?label=version&url=https%3A%2F%2Fraw.githubusercontent.com%2FJaimeCheng%2Fwx-miniprogram-modal%2Fmaster%2Fpackage.json&query=version&colorB=blue&prefix=%20&suffix=%20)](https://www.npmjs.com/package/wx-miniprogram-modal)


 **之所以写这个自定义modal组件，和自定义ActionSheet一样，主要是用于一些开放能力。有些开放能力必须绑定在button上，比如用户授权，这个需求很常见，但是小程序现在已经不支持主动弹出授权框了，所以我们会想先弹出modal用户点击确定再来弹出授权框，小程序原生的Modal确定按钮无法实现，故此组件应运而生。该Modal组件还支持转发，打开设置页的开放能力，同时也扩展了提交表单功能。**

## 安装
#### 1.使用npm安装
直接使用小程序开发工具自带的[```构建npm```](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)，请按下面几个步骤引入：
- 确保项目目录下有package.json文件，已有的跳过这一步
``` bash
$ npm init
```
- 安装
``` bash
$ npm i wx-miniprogram-modal
```
- 在小程序开发者工具中依次找到并点击`工具`->`构建npm`，构建完成后你的项目目录会多出一个`miniprogram_npm`目录，请确保项目设置已勾选`使用npm模块`

- 在使用组件的页面配置json中使用
```js
{
  "usingComponents": {
    "mymodal": "wx-miniprogram-modal"
  }
}
```
#### 2.不使用任何构建工具的普通小程序安装
直接拷贝[wx-miniprogram-modal](https://github.com/JaimeCheng/wx-miniprogram-modal)仓库中的`miniprogram_dist`目录下的代码到项目中的放组件的目录中去，之后使用方法和小程序自定义组件一样了。同样需要在页面配置json中声明：
```js
{
  "usingComponents": {
    "mymodal": "../components/modal/index" // 根据你的目录写
  }
}
```

## 使用
**wxml文件中**
```html
<mymodal type="{{type}}" title='{{title}}' content='{{content}}' form-items="{{items}}"
confirmText='{{confirmText}}' showStatus='{{showModal}}' showCancel="{{showCancel}}" 
bind:complete="onComplete"></mymodal>
```
**js文件中**
```js
// 只列出核心代码
Page({
  data: {
    showModal: false,
    type: 'getUserInfo',
    showCancel: false,
    title: '提示',
    content: '',
    confirmText: '好的',
    items: [{ label: '请输入姓名', name: 'name' }]
  },

  // 完成操作的回调
  onComplete: function (e) {
    //  关闭模态框  这里其实不写也行，组件里已经包含了关闭modal的代码，
    //  但是不写这个的话，该页面的data里的showModal值是不会变仍是true，
   //  如果确定不会造成其他影响，写不写看个人
    this.setData({
      showModal: false,
    })

    if (e.detail.confirm) {
      // 用户点击确定
      // 各个type携带的数据 这里为了方便写到一起了
      
      // 用户授权
      if (this.data.type === 'getUserInfo') {
        if (e.detail.hasUserInfo) {
          // 已经授权
          this.setData({
            hasUserInfo: true,
            userInfo: e.detail.userInfo
          })
          app.globalData.userInfo = e.detail.userInfo
        } else {
          wx.showToast({
            title: '您拒绝了授权',
            icon: 'none'
          })
        }
      }

      // 提交表单
      if (this.data.type === 'prompt') {
        var formData = e.detail.formData
        // eg. { name: 'Jaime'}
      }

      // 打开设置页
      if (this.data.type === 'openSetting') {
        var authSetting = e.detail.authSetting
        // eg. { "scope.userInfo": true}
      }
    } else {
      // 用户点击取消
    }
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 因为自定义组件内不能使用转发回调 所以在这关闭模态框
      // 不写这个 模态框点击转发按钮将不会自动关闭 
      if (res.target.dataset.type === 'modalShare') {
        this.setData({
          showModal: false
        })
      }
    }
    return {
      title: '自定义转发标题',
      path: '/page/index?id=123'
    }
  }
})
```
​                                                                  ![自定义modal演示](https://ws1.sinaimg.cn/large/005z3BWwly1fyulcbtzcng306k0bndr2.gif)

## 参数
| 属性 | 数据类型 | 说明 | 选项 | 默认值 |
| :--: | :--: | :--: | :--: | :--: |
| showStatus | Boolean | modal的显隐状态 | 必填 | — |
| type | String |modal的类型，可选值：`prompt`、`getUserInfo`、`share`、`openSetting` | 必填 | — |
| showCancel | Boolean | 是否显示取消按钮 |  选填 | false |
| confirmText | String | 确定按钮的文字 |  选填 | 好的 |
| cancelText | String | 取消按钮的文字 |  选填 | 取消 |
| title | String | 标题，不写或为空时则不显示title |  选填 | 无 |
| content | String | modal的内容 |  选填 | — |
| formItems | Array | `type='prompt'`时必填的表单项属性，格式: [{label: '输入框label', name: '键名'}, ...] |  选填 | [] |
## 触发事件
| eventName | 说明 |
| :--: | :--: |
| complete | modal完成时触发的事件，`e.detail.confirm`来判断是取消还是确定，`type='prompt'`时携带的数据为`e.detail.formData`; `type='getUserInfo'`时携带的数据为`e.detail.hasUserInfo`,`e.detail.userInfo`; `type='openSetting'`时携带的数据为`e.detail.authSetting`; 具体请看示例|
## 注意事项
1. `type = 'prompt'`时，必须设置表单项属性 `formItems="{{items}}"`；
2. 表单项属性 `formItems`格式如下：
```js
[{label: '请输入姓名', name: 'name'}, 
{label: '请输入邮箱', name: 'email'}]
```
3. `type='share' `页面生命周期需声明`onShareAppMessage`,并且在内部加上以下代码，因为自定义组件内不能使用转发回调 所以在这关闭模态框，不写这个 模态框点击转发按钮后将不会自动关闭；
```js
if (res.from === 'button') {
    if (res.target.dataset.type === 'modalShare') {
      this.setData({
        showModal: false
      })
    }
  }
```
4. `type='getUserInfo'`时，按需求来设定授权modal初始显隐状态。
建议：项目中先`wx.getSetting`查看用户是否已经授权，未授权showStatus初始设为true将主动弹出该弹框，若已授权showStatus初始设为false避免多次弹出；
5. 每个type携带的数据见上文代码示例或下载以下完整示例。
## 示例Demo
[微信小程序自定义组件使用示例整合](https://github.com/JaimeCheng/weapp-components)

