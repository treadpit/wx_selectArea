const defaultOptions = {
  method: 'GET'
};

/**
 * @param {function} fun 接口
 * @param {object} options 接口参数
 * @returns {Promise} Promise对象
 */
function fetch(url) {
  let options = {};
  options.url = url;
  return new Promise((resolve, reject) => {
    options.success = resolve;
    options.fail = reject;
    wx.request({...defaultOptions, ...options});
  });
}

const API = 'http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=';

const conf = {
  addDot: function(arr) {
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
  bindChange: function(e) {
    const currentValue = e.detail.value;
    const self = _getCurrentPage();
    const cv0 = currentValue[ 0 ];
    const cv1 = currentValue[ 1 ];
    const cv2 = currentValue[ 2 ];
    const hideDistrict = self.config.hideDistrict;
    const { value, provinceData } = this.data.areaPicker;
    const provinceCondition = hideDistrict ? value[ 0 ] !== cv0 && value[ 1 ] === cv1 : value[ 0 ] !== cv0 && value[ 1 ] === cv1 && value[ 2 ] === cv2;
    const cityCondition = hideDistrict ? value[ 0 ] === cv0 && value[ 1 ] !== cv1 : value[ 0 ] === cv0 && value[ 1 ] !== cv1 && value[ 2 ] === cv2;
    const districtCondition = hideDistrict ? false : value[ 0 ] === cv0 && value[ 1 ] === cv1 && value[ 2 ] !== cv2;
    if (provinceCondition) {
      // 滑动省份
      fetch(API + provinceData[ cv0 ].code).then((city) => {
        const cityData = city.data.result;
        if (cityData && cityData.length) {
          const dataWithDot = conf.addDot(city.data.result);
          this.setData({
            'areaPicker.cityData': dataWithDot
          });
          return fetch(API + dataWithDot[ 0 ].code);
        } else {
          this.setData({
            'areaPicker.cityData': [],
            'areaPicker.districtData': [],
            'areaPicker.address': provinceData[ cv0 ].fullName,
            'areaPicker.selected': [ provinceData[ cv0 ] ],
          });
        }
      }).then((district) => {
        const districtData = district.data.result;
        const { cityData } = this.data.areaPicker;
        if (districtData && districtData.length > 0) {
          const dataWithDot = conf.addDot(districtData);
          this.setData({
            'areaPicker.districtData': dataWithDot,
            'areaPicker.value': [ cv0, 0, 0 ],
            'areaPicker.address': provinceData[ cv0 ].fullName + ' - ' + cityData[ 0 ].fullName + (hideDistrict ? '' : ' - ' + dataWithDot[ 0 ].fullName),
            'areaPicker.selected': hideDistrict ? [ provinceData[ cv0 ], cityData[ 0 ] ] : [ provinceData[ cv0 ], cityData[ 0 ], dataWithDot[ 0 ] ]
          });
        } else {
          this.setData({
            'areaPicker.districtData': [],
            'areaPicker.value': [ cv0, cv1, 0 ],
            'areaPicker.address': provinceData[ cv0 ].fullName + ' - ' + cityData[ 0 ].fullName,
            'areaPicker.selected': [ provinceData[ cv0 ], cityData[ 0 ] ]
          });
        }
      }).catch((e) => {
        console.error(e);
      });
    } else if (cityCondition) {
      const { provinceData, cityData } = this.data.areaPicker;
      // 滑动城市
      fetch(API + cityData[ cv1 ].code).then((district) => {
        if (!district) return;
        const districtData = district.data.result;
        if (districtData && districtData.length > 0) {
          const dataWithDot = conf.addDot(districtData);
          this.setData({
            'areaPicker.districtData': dataWithDot,
            'areaPicker.value': [ cv0, cv1, 0 ],
            'areaPicker.address': provinceData[ cv0 ].fullName + ' - ' + cityData[ cv1 ].fullName + (hideDistrict ? '' : ' - ' + dataWithDot[ 0 ].fullName),
            'areaPicker.selected': hideDistrict ? [ provinceData[ cv0 ], cityData[ cv1 ] ] : [ provinceData[ cv0 ], cityData[ cv1 ], dataWithDot[ 0 ] ]
          });
        } else {
          this.setData({
            'areaPicker.districtData': [],
            'areaPicker.value': [ cv0, cv1, 0 ],
            'areaPicker.address': provinceData[ cv0 ].fullName + ' - ' + cityData[ cv1 ].fullName,
            'areaPicker.selected': [ provinceData[ cv0 ], cityData[ cv1 ] ]
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
        'areaPicker.address': provinceData[ cv0 ].fullName + ' - ' + cityData[ cv1 ].fullName + (hideDistrict ? '' : ' - ' + districtData[ cv2 ].fullName),
        'areaPicker.selected': hideDistrict ? [ provinceData[ cv0 ], cityData[ cv1 ] ] : [ provinceData[ cv0 ], cityData[ cv1 ], districtData[ cv2 ] ]
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

  fetch(API + '0').then((province) => {
    const firstProvince = province.data.result[ 0 ];
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
    return fetch(API + firstProvince.code);
  }).then((city) => {
    const firstCity = city.data.result[ 0 ];
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
      return fetch(API + firstCity.code);
    } else {
      const { provinceData, cityData } = self.data.areaPicker;
      self.setData({
        'areaPicker.value': [ 0, 0 ],
        'areaPicker.address': provinceData[ 0 ].fullName + ' - ' + cityData[ 0 ].fullName,
        'areaPicker.selected': [ provinceData[ 0 ], cityData[ 0 ] ]
      });
    }
  }).then((district) => {
    if (!district) return;
    const firstDistrict = district.data.result[ 0 ];
    const dataWithDot = conf.addDot(district.data.result);
    const { provinceData, cityData } = self.data.areaPicker;
    self.setData({
      'areaPicker.value': [ 0, 0, 0 ],
      'areaPicker.districtData': dataWithDot,
      'areaPicker.selectedDistrict.index': 0,
      'areaPicker.selectedDistrict.code': firstDistrict.code,
      'areaPicker.selectedDistrict.fullName': firstDistrict.fullName,
      'areaPicker.address': provinceData[ 0 ].fullName + ' - ' + cityData[ 0 ].fullName + ' - ' + firstDistrict.fullName,
      'areaPicker.selected': [ provinceData[ 0 ], cityData[ 0 ], firstDistrict ]
    });
  }).catch((e) => {
    console.error(e);
  });
};
