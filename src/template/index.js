/**
 * @param {function} fun 接口
 * @param {object} options 接口参数
 * @returns {Promise} Promise对象
 */
function fetch(options) {
  options = options || {};
  return new Promise((resolve, reject) => {
    options.success = resolve;
    options.fail = reject;
    wx.request(options);
  });
}

const API = 'http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=';

const conf = {
  addDot: function (arr) {
    if (arr instanceof Array) {
      const tmp = arr.slice();
      tmp.map(val => {
        if (val.fullName.length > 4) {
          val.fullNameDot = val.fullName.slice(0, 4) + '...';
        } else {
          val.fullNameDot = val.fullName;
        }
      });
      return tmp;
    }
  },
  /**
	 * 滑动事件
	 * @param {object} e 事件对象
	 */
  bindChange: function (e) {
    const currentValue = e.detail.value;
    const { value, provinceData } = this.data.areaPicker;
    const self = _getCurrentPage();
    const hideDistrict = self.config.hideDistrict;
    const provinceCondition = hideDistrict ? value[0] !== currentValue[0] && value[1] === currentValue[1] : value[0] !== currentValue[0] && value[1] === currentValue[1] && value[2] === currentValue[2];
    const cityCondition = hideDistrict ? value[0] === currentValue[0] && value[1] !== currentValue[1] : value[0] === currentValue[0] && value[1] !== currentValue[1] && value[2] === currentValue[2];
    const districtCondition = hideDistrict ? false : value[0] === currentValue[0] && value[1] === currentValue[1] && value[2] !== currentValue[2];
    if (provinceCondition) {
      // 滑动省份
      fetch({
        url: API + provinceData[currentValue[0]].code,
        method: 'GET'
      }).then((city) => {
        const cityData = city.data.result;
        if (cityData && cityData.length) {
          const dataWithDot = conf.addDot(city.data.result);
          this.setData({
            'areaPicker.cityData': dataWithDot
          });
          return (
            fetch({
              url: API + dataWithDot[0].code,
              method: 'GET'
            })
          );
        } else {
          this.setData({
            'areaPicker.cityData': [],
            'areaPicker.districtData': [],
            'areaPicker.address': provinceData[currentValue[0]].fullName,
            'areaPicker.selected': [provinceData[currentValue[0]]],
          });
        }
      }).then((district) => {
        const districtData = district.data.result;
        const { cityData } = this.data.areaPicker;
        if (districtData && districtData.length > 0) {
          const dataWithDot = conf.addDot(districtData);
          this.setData({
            'areaPicker.districtData': dataWithDot,
            'areaPicker.value': [ currentValue[0], 0, 0 ],
            'areaPicker.address': provinceData[currentValue[0]].fullName + ' - ' + cityData[0].fullName + (hideDistrict ? '' : ' - ' + dataWithDot[0].fullName),
            'areaPicker.selected': hideDistrict ? [provinceData[currentValue[0]], cityData[0]] : [provinceData[currentValue[0]], cityData[0], dataWithDot[0]]
          });
        } else {
          this.setData({
            'areaPicker.districtData': [],
            'areaPicker.value': [ currentValue[0], currentValue[1], 0 ],
            'areaPicker.address': provinceData[currentValue[0]].fullName + ' - ' + cityData[0].fullName,
            'areaPicker.selected': [provinceData[currentValue[0]], cityData[0]]
          });
        }
      }).catch((e) => {
        console.error(e);
      });
    } else if (cityCondition) {
      const { provinceData, cityData } = this.data.areaPicker;
      // 滑动城市
      fetch({
        url: API + cityData[currentValue[1]].code,
        method: 'GET'
      }).then((district) => {
        if (!district) return;
        const districtData = district.data.result;
        if (districtData && districtData.length > 0) {
          const dataWithDot = conf.addDot(districtData);
          this.setData({
            'areaPicker.districtData': dataWithDot,
            'areaPicker.value': [ currentValue[0], currentValue[1], 0 ],
            'areaPicker.address': provinceData[currentValue[0]].fullName + ' - ' + cityData[currentValue[1]].fullName + (hideDistrict ? '' : ' - ' + dataWithDot[0].fullName),
            'areaPicker.selected': hideDistrict ? [provinceData[currentValue[0]], cityData[currentValue[1]]] : [provinceData[currentValue[0]], cityData[currentValue[1]], dataWithDot[0]]
          });
        } else {
          this.setData({
            'areaPicker.districtData': [],
            'areaPicker.value': [ currentValue[0], currentValue[1], 0 ],
            'areaPicker.address': provinceData[currentValue[0]].fullName + ' - ' + cityData[currentValue[1]].fullName,
            'areaPicker.selected': [provinceData[currentValue[0]], cityData[currentValue[1]]]
          });
        }
      }).catch((e) => {
        console.error(e);
      });
    } else if (districtCondition) {
      const { cityData, districtData } = this.data.areaPicker;
      // 滑动地区
      this.setData({
        'areaPicker.value': currentValue,
        'areaPicker.address': provinceData[currentValue[0]].fullName + ' - ' + cityData[currentValue[1]].fullName + (hideDistrict ? '' : ' - ' + districtData[currentValue[2]].fullName),
        'areaPicker.selected': hideDistrict ? [provinceData[currentValue[0]], cityData[currentValue[1]]] : [provinceData[currentValue[0]], cityData[currentValue[1]], districtData[currentValue[2]]]
      });
    }
  }
};

function _getCurrentPage() {
  const pages = getCurrentPages();
  const last = pages.length - 1;
  return pages[ last ];
}

export const getSelectedAreaData = () => {
  const self = _getCurrentPage();
  return self.data.areaPicker.selected;
};

export default (config = {}) => {
  const self = _getCurrentPage();
  self.setData({
    'areaPicker.hideDistrict': !config.hideDistrict
  });
  self.config = config;
  self.bindChange = conf.bindChange.bind(self);

  fetch({
    url: API + '0',
    method: 'GET'
  }).then((province) => {
    const firstProvince = province.data.result[0];
    const dataWithDot = conf.addDot(province.data.result);
    /**
		 * 默认选择获取的省份第一个省份数据
		 */
    self.setData({
      'areaPicker.provinceData': dataWithDot,
      'areaPicker.selectedProvince.index': 0,
      'areaPicker.selectedProvince.code': firstProvince.code,
      'areaPicker.selectedProvince.fullName': firstProvince.fullName,
    });
    return (
      fetch({
        url: API + firstProvince.code,
        method: 'GET'
      })
    );
  }).then((city) => {
    const firstCity = city.data.result[0];
    const dataWithDot = conf.addDot(city.data.result);
    self.setData({
      'areaPicker.cityData': dataWithDot,
      'areaPicker.selectedCity.index': 0,
      'areaPicker.selectedCity.code': firstCity.code,
      'areaPicker.selectedCity.fullName': firstCity.fullName,
    });
    /**
		 * 省市二级则不请求区域
		 */
    if (!config.hideDistrict) {
      return (
        fetch({
          url: API + firstCity.code,
          method: 'GET'
        })
      );
    } else {
      const { provinceData, cityData } = self.data.areaPicker;
      self.setData({
        'areaPicker.value': [0, 0],
        'areaPicker.address': provinceData[0].fullName + ' - ' + cityData[0].fullName,
        'areaPicker.selected': [provinceData[0], cityData[0]]
      });
    }
  }).then((district) => {
    if (!district) return;
    const firstDistrict = district.data.result[0];
    const dataWithDot = conf.addDot(district.data.result);
    const { provinceData, cityData } = self.data.areaPicker;
    self.setData({
      'areaPicker.value': [0, 0, 0],
      'areaPicker.districtData': dataWithDot,
      'areaPicker.selectedDistrict.index': 0,
      'areaPicker.selectedDistrict.code': firstDistrict.code,
      'areaPicker.selectedDistrict.fullName': firstDistrict.fullName,
      'areaPicker.address': provinceData[0].fullName + ' - ' + cityData[0].fullName + ' - ' + firstDistrict.fullName,
      'areaPicker.selected': [provinceData[0], cityData[0], firstDistrict]
    });
  }).catch((e) => {
    console.error(e);
  });
};
