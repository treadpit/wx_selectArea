import {Promise} from '../../utils/util.js';

Page({
  data: {
    proviceData: [],
    cityData: [],
    districtData: [],
    selectedProvince: 0,
    selectedCity: 0,
    selectedDistrict: 0,
    user: {
      name: {
        boy: "tom"
      }
    }
  },
  click(e) {
    console.log(e.currentTarget.dataset.info.name);
  },
  addDot(arr) {
    if(arr instanceof Array) {
      arr.map(val => {
        if(val.fullName.length > 4) {
          val.fullName = val.fullName.slice(0, 4) + '...';
          return val;
        }
      }) 
      console.log(arr);
    }
  },
  onLoad() {
    const self = this;
    Promise(wx.request, {
      url: 'http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=0',
      method: 'GET'
    }).then((province) => {
      self.addDot(province.data.result);
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
      self.addDot(city.data.result);
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
      self.addDot(district.data.result);
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
