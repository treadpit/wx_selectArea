import { Promise } from '../../utils/util';

/**
 *  查询接口
 */
const API = 'http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=';


Page({
  data: {

  },

  addDot: function (arr) {
    if (arr instanceof Array) {
      arr.map(val => {
        if (val.fullName.length > 4) {
          val.fullNameDot = val.fullName.slice(0, 4) + '...';
          return val;
        } else {
          val.fullNameDot = val.fullName;
          return val;
        }
      })
    }
  },
  /**
   * 初始化区域数据
   */
  onLoad: function () {
    this.setData({
      isShow: false, // 显示区域选择框
      showDistrict: true // 默认为省市区三级区域选择
    });
    // if (opt && !opt.showDistrict) {
    //   this.setData({
    //     showDistrict: false
    //   });
    // }
    Promise(wx.request, {
      url: API + '0',
      method: 'GET'
    }).then((province) => {
      const firstProvince = province.data.result[0];
      this.addDot(province.data.result);
      /**
       * 默认选择获取的省份第一个省份数据
       */
      this.setData({
        proviceData: province.data.result,
        'selectedProvince.index': 0,
        'selectedProvince.code': firstProvince.code,
        'selectedProvince.fullName': firstProvince.fullName,
      });
      return (
        Promise(wx.request, {
          url: API + firstProvince.code,
          method: 'GET'
        })
      );
    }).then((city) => {
      const firstCity = city.data.result[0];
      this.addDot(city.data.result);
      this.setData({
        cityData: city.data.result,
        'selectedCity.index': 0,
        'selectedCity.code': firstCity.code,
        'selectedCity.fullName': firstCity.fullName,
      });
      /**
       * 省市二级则不请求区域
       */
      if (this.data.showDistrict) {
        return (
          Promise(wx.request, {
            url: API + firstCity.code,
            method: 'GET'
          })
        );
      } else {
        this.setData({
          value: [0, 0]
        });
        return;
      }
    }).then((district) => {
      const firstDistrict = district.data.result[0];
      this.addDot(district.data.result);
      this.setData({
        value: [0, 0, 0],
        districtData: district.data.result,
        'selectedDistrict.index': 0,
        'selectedDistrict.code': firstDistrict.code,
        'selectedDistrict.fullName': firstDistrict.fullName,
        address: this.data.proviceData[0].fullName + ' - ' + this.data.cityData[0].fullName + ' - ' + district.data.result[0].fullName
      });
    }).catch((e) => {
      console.log(e);
    })
  },
  /**
   * 页面选址触发事件
   */
  choosearea: function () {
    this.setData({
      isShow: true
    })
  },
  /**
   * 滑动事件
   */
  bindChange: function (e) {
    const current_value = e.detail.value, _data = this.data;

    console.log('ddddddddd');

    if (current_value.length > 2) {
      if (this.data.value[0] !== current_value[0] && this.data.value[1] === current_value[1] && this.data.value[2] === current_value[2]) {
        // 滑动省份
        Promise(wx.request, {
          url: API + _data.proviceData[current_value[0]].code,
          method: 'GET'
        }).then((city) => {
          this.addDot(city.data.result);
          this.setData({
            cityData: city.data.result
          })
          return (
            Promise(wx.request, {
              url: API + city.data.result[0].code,
              method: 'GET'
            })
          );
        }).then((district) => {
          if (district.data.result.length > 0) {
            this.addDot(district.data.result);
            this.setData({
              districtData: district.data.result,
              'value[0]': current_value[0],
              'value[1]': 0,
              'value[2]': 0
            })

            this.setData({
              address: this.data.proviceData[current_value[0]].fullName + ' - ' + this.data.cityData[0].fullName + ' - ' + district.data.result[0].fullName
            })
          }


        }).catch((e) => {
          console.log(e);
        })
      } else if (this.data.value[0] === current_value[0] && this.data.value[1] !== current_value[1] && this.data.value[2] === current_value[2]) {
        // 滑动城市
        Promise(wx.request, {
          url: API + _data.cityData[current_value[1]].code,
          method: 'GET'
        }).then((district) => {
          if (district.data.result.length > 0) {
            this.addDot(district.data.result);
            this.setData({
              districtData: district.data.result,
              'value[0]': current_value[0],
              'value[1]': current_value[1],
              'value[2]': 0,
              address: this.data.proviceData[current_value[0]].fullName + ' - ' + this.data.cityData[current_value[1]].fullName + ' - ' + district.data.result[0].fullName
            })
          }
        }).catch((e) => {
          console.log(e);
        })

      } else if (this.data.value[0] === current_value[0] && this.data.value[1] === current_value[1] && this.data.value[2] !== current_value[2]) {
        // 滑动地区

        this.setData({
          value: current_value,
          address: this.data.proviceData[current_value[0]].fullName + ' - ' + this.data.cityData[current_value[1]].fullName + ' - ' + this.data.districtData[current_value[2]].fullName
        })
      }
    }
  }
})
