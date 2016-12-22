import { SA } from '../../selectarea/selectarea';
import { Gesture } from '../../utils/util';
const date = new Date()
const years = []
const months = []
const days = []

const conf = {
    data: {
        items: ['开始滑动'],
        out: true
    },
    onLoad: function (options) {
        SA.load(this, {
            showDistrict: false // 省市区三级（true，默认值）／省市两级（false）
        }); // 初始化区域框
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
    },
    touchstart(e) {
        /**
         * 监听touch开始
         */
        Gesture.touchstart(e, this);
    },
    touchmove(e) {
        // 是否为左滑事件
        if (Gesture.isLeftSlide(e, this)) {
            wx.showToast({
                title: '左滑',
                icon: 'success',
                duration: 800
            })
        }
        // 是否为右滑事件
        if (Gesture.isRightSlide(e, this)) {
            wx.showToast({
                title: '右滑',
                icon: 'success',
                duration: 800
            })
        }
    }
}

Page(conf);