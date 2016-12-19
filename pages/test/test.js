import { SA } from '../../selectarea/selectarea';
const conf = {
    data: {

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
    }
}

Page(conf);