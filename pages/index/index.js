import {Promise} from '../../utils/util.js';

const API = 'http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=';

Page({
  data: {
    address: "",
    proviceData: [],
    cityData: [],
    districtData: [],
    selectedProvince: {
      index: 0,
      code: 0,
      fullName: ""
    },
    selectedCity: {
      index: 0,
      code: 0,
      fullName: ""
    },
    selectedDistrict: {
      index: 0,
      code: 0,
      fullName: ""
    }
  },
  addDot(arr) {
    if(arr instanceof Array) {
      arr.map(val => {
        if(val.fullName.length > 4) {
          val.fullNameDot = val.fullName.slice(0, 4) + '...';
          return val;
        }else {
          val.fullNameDot = val.fullName;
          return val;
        }
      }) 
    }
  },
  onLoad() {
    Promise(wx.request, {
      url: API + '0',
      method: 'GET'
    }).then((province) => {
      const firstProvince = province.data.result[0];
      this.addDot(province.data.result);
      this.setData({
        proviceData: province.data.result,
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
        'selectedCity.code': firstCity.code,
        'selectedCity.fullName': firstCity.fullName
      });
      return (
        Promise(wx.request, {
          url: API + firstCity.code,
          method: 'GET'
        })
      );
    }).then((district) => {
      const firstDistrict = district.data.result[0];
      this.addDot(district.data.result);
      this.setData({
        districtData: district.data.result,
        'selectedDistrict.code': firstDistrict.code,
        'selectedDistrict.fullName': firstDistrict.fullName
      });
    }).catch((e) => {
      console.log(e);
    })
  },
  tapProvince: function(e) {
    const dataset = e.currentTarget.dataset;
    Promise(wx.request, {
      url: API + dataset.code,
      method: 'GET'
    }).then((city) => {
        this.addDot(city.data.result);
        this.setData({
            cityData: city.data.result,
            'selectedProvince.code': dataset.code,
            'selectedProvince.fullName': dataset.fullName,
            'selectedCity.code': city.data.result[0].code,
            'selectedCity.fullName': city.data.result[0].fullName
        });
        return (
          Promise(wx.request, {
            url: API + city.data.result[0].code,
            method: 'GET'
          })
        );
    }).then((district) => {
        this.addDot(district.data.result);
        this.setData({
            districtData: district.data.result,
            'selectedProvince.index': e.currentTarget.dataset.index,
            'selectedCity.index': 0,
            'selectedDistrict.index': 0,
            'selectedDistrict.code': district.data.result[0].code,
            'selectedDistrict.fullName': district.data.result[0].fullName
        });
    }).catch((e) => {
      console.log(e);
    })
  },
  tapCity: function(e) {
    const dataset = e.currentTarget.dataset;
    Promise(wx.request, {
      url: API + dataset.code,
      method: 'GET'
    }).then((district) => {
       this.addDot(district.data.result);
       this.setData({
            districtData: district.data.result,
            'selectedCity.index': e.currentTarget.dataset.index,
            'selectedCity.code': dataset.code,
            'selectedCity.fullName': dataset.fullName,
            'selectedDistrict.index': 0,
            'selectedDistrict.code': district.data.result[0].code,
            'selectedDistrict.fullName': district.data.result[0].fullName
        });
    }).catch((e) => {
        console.log(e);
    })
  },
  tapDistrict: function(e) {
      const dataset = e.currentTarget.dataset;
      this.setData({
          'selectedDistrict.index': e.currentTarget.dataset.index,
          'selectedDistrict.code': dataset.code,
          'selectedDistrict.fullName': dataset.fullName
      });
  },
  confirm(e) {
    this.setData({
      address: this.data.selectedProvince.fullName + this.data.selectedCity.fullName + this.data.selectedDistrict.fullName,
      isHidden: true
    })
  },
  cancel() {
    this.setData({
      isHidden: true
    })
  }
})
