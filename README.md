# wx_selectArea

### 因小程序picker组件自身的限制，需自行模拟省市区三级联动

---

### 使用方法

- 在目标 `.wxml` 文件中引用 `selectarea.wxml` 文件；

```
<include src="../../selectarea/selectarea.wxml"/>
<template is="selectArea" />
```
- 在目标 `.wxss` 文件中引用 `selectarea.wxss` 文件；

```
@import "../../selectarea/selectarea.wxss";
```

- 在目标 `.js` 文件中引用 `selectarea.js` 文件， 并定义好如下对象；

```
import { SA } from '../../selectarea/selectarea';

const conf = {
    onLoad: function (options) {

        // 若只需省市两级联动，加入配置项，默认为true(省市区三级联动)，可不传:

        const conf = {
            showDistrict: false // 省市两级
        }
        SA.load(this[, conf]); 

    },
    choosearea() { // 页面弹框触发事件
        SA.choosearea(this); 
    },
    tapProvince(e) { // 点击省份
        SA.tapProvince(e, this);
    },
    tapCity(e) { // 点击城市
        SA.tapCity(e, this);
    },
    tapDistrict(e) { // 点击区域
        SA.tapDistrict(e, this);
    },
    cancel() { // 取消选择
        SA.cancel(this);
    },
    confirm(e) { // 确认选择区域
        SA.confirm(e, this);
    }
}

Page(conf);

// 页面data中包含的数据

this.data = {
    address: '',  // 确认时的最终完整地址
    selectedCode: '',  // 确认时的最终选址编码
    selectedProvince: {
        code: 230000,   // 当前选择省份的编码
        fullName: '黑龙江',    // 当前选中省份的全名
        index: 3    // 当前索引
    },
    selectedCity: {
        // 同省份
        ......
    },
    selectedDistrict: {
        // 同省份
        ......
    }
}

```

> 使用示例参考 test 目录
>
>API使用的是http的，故在预览时需开启 '开发环境不校验域名以及TLS版本'，可结合自身项目更改 `.selectarea.js` 文件中的API地址；


### 项目截图

<img src="https://github.com/treadpit/wx_selectArea/blob/master/screenshot/154906d8z81rtbrh4t4ith.gif" width="380px">


### 更新日志：
---
##### ＃20161209

F 遮罩透明度影响选址栏

##### ＃20161208

F 澳门香港地区选址错误
