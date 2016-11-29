import {Promise} from '../../utils/util.js';

Page({
  data: {
    proviceData: [],
    cityData: [],
    districtData: [],
    selectedProvince: 0,
    selectedCity: 0,
    selectedDistrict: 0
  },
  onLoad() {
    const self = this;
    Promise(wx.request, {
      url: 'http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=0',
      method: 'GET'
    }).then((province) => {
      self.setData({
        proviceData: province.data.result
      });
      return (
        Promise(wx.request, {
          url: `http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=${province.data.result[0].code}`,
          method: 'GET'
        })
      );
    }).then((city) => {
      self.setData({
        cityData: city.data.result
      });
      return (
        Promise(wx.request, {
          url: `http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=${city.data.result[0].code}`,
          method: 'GET'
        })
      );
    }).then((district) => {
      self.setData({
        districtData: district.data.result
      });
    }).catch((e) => {
      console.log(e);
    })
  },
  tapProvince: function(e) {
    Promise(wx.request, {
      url: `http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=${city.data.result[0].code}`,
      method: 'GET'
    })
    this.setData({
      index: e.detail.value
    })
  },
  tapCity: function(e) {
    // this.setData({
    //   date: e.detail.value
    // })
  },
  tapDistrict: function(e) {
    // this.setData({
    //   time: e.detail.value
    // })
  }
})
