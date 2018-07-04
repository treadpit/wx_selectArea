[![Dependency status](https://img.shields.io/david/treadpit/wx_selectArea.svg)](https://david-dm.org/treadpit/wx_selectArea)
[![Build Status](https://travis-ci.org/treadpit/wx_selectArea.svg?branch=develop)](https://travis-ci.org/treadpit/wx_selectArea)

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

### 截图

<img src="https://raw.githubusercontent.com/treadpit/wx_selectArea/develop/screenshot/devtool_screenshot.png" width="1000px">

<img src="https://github.com/treadpit/wx_selectArea/blob/master/screenshot/182245dl7zwrbc5rl2g7ls.gif" width="380px">

#### 旧版

> 小程序前期不支持 `picker-view` 组件时，用 `scroll-view` 模拟的联动选择器

<img src="https://github.com/treadpit/wx_selectArea/blob/master/screenshot/154906d8z81rtbrh4t4ith.gif" width="380px">

欢迎反馈...
