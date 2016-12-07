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
        SA.load(this); // 初始化区域
    },
    choosearea() { // 页面弹框触发事件
        SA.choosearea(this); 
    },
    addDot() { // 字符串截取
        SA.addDot(this);
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

```

> 使用示例参考 test 目录
>
>API使用的是http的，故在预览时需开启 '开发环境不校验域名以及TLS版本'，可结合自身项目更改 `.selectarea.js` 文件中的API地址；