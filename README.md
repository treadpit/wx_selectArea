[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fb410b8b15b44a878ce67d5e4f893bea)](https://app.codacy.com/app/treadpit/wx_selectArea?utm_source=github.com&utm_medium=referral&utm_content=treadpit/wx_selectArea&utm_campaign=badger)
[![Dependency status](https://img.shields.io/david/treadpit/wx_selectArea.svg)](https://david-dm.org/treadpit/wx_selectArea)
[![Build Status](https://travis-ci.org/treadpit/wx_selectArea.svg?branch=master)](https://travis-ci.org/treadpit/wx_selectArea)
[![GitHub issues](https://img.shields.io/github/issues/treadpit/wx_selectArea.svg?style=flat-square)](https://github.com/treadpit/wx_selectArea/issues)

# wx_selectArea

地址联动选择器采用微信小程序的 `picker-view` 组件
### 模板引入

提供 `template` [模板引入](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/template.html)

#### 1. 引入`wxml`及`wxss`
```xml
// example.wxml
<import src="../../template/index.wxml"/>
<template is="areaPicker" data="{{...areaPicker}}" />

// example.wxss
@import '../../template/index.wxss';
```
#### 2. 组件初始化

```js
import initAreaPicker, { getSelectedAreaData } from '../../template/index';

const conf = {
	onShow: () => {
    initAreaPicker();
  },
};

Page(conf);
```

##### 2.1 自定义配置

> 目前仅支持是否隐藏第三极选择栏，默认显示

```js
import initAreaPicker from '../../template/index';

const conf = {
	onShow: () => {
    initAreaPicker({
      hideDistrict: true,
    });
  },
};

Page(conf);
```

##### 2.2 获取当前选择的省市区信息

```js
import { getSelectedAreaData } from '../../template/index';

const conf = {
	btnClick() {
		console.table(getSelectedAreaData()); 
	},
};

Page(conf);
```
### 其他

`API` 请求地址在 `config` 文件夹中配置，`GET` 请求接口类似 `https://your.com/api/area?code=123`，服务端返回数据可参考例子中格式即可直接套用模板。

```js

// request

http('https://your.com/api/area?code=0');

// response
{
    "message": "",
    "result": [
        {
            "code": 340000,
            "fullName": "安徽省",
            "mark": "",
            "outofrange": 0,
            "printMark": ""
        },
        {
            "code": 820000,
            "fullName": "澳门特别行政区",
            "mark": "",
            "outofrange": 0,
            "printMark": ""
        },
        ....
    ]
}
```

### 截图

<img src="https://raw.githubusercontent.com/treadpit/wx_selectArea/develop/screenshot/devtool_screenshot.png" width="1000px">