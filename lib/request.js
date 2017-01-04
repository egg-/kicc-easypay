'use strict'

var FIELDS = [
  'mall_id', 'mall_nm', 'ci_url', 'pay_type', 'order_no', 'currency', 'return_url', 'window_type', 'charset', 'lang_flag', 'disp_cash_y',
  'product_nm', 'product_amt', 'product_type', 'product_exp',
  'os_cert_flag', 'quota', 'noinst_flag', 'noinst_term', 'set_point_card_yn', 'point_card', 'join_cd', 'kmotion_useyn', 'cert_typ',
  'vacct_bank', 'vacct_end_date', 'vacct_end_tim',
  'memb_user_no', 'user_type', 'user_id', 'user_nm', 'user_mail', 'user_phone1', 'user_phone2', 'user_addr', 'user_define1', 'user_define2', 'user_define3', 'user_define4', 'user_define5', 'user_define6'
]

var normalize = function (param, mode) {
  var prefix = (mode || 'pc').toUpperCase().indexOf('PC') !== -1 ? 'EP_' : 'sp_'
  var values = {}

  for (var i = 0, len = FIELDS.length, key; i < len; i++) {
    key = FIELDS[i]

    if (typeof param[key] !== 'undefined') {
      values[prefix + key] = ['mall_nm', 'product_nm', 'user_nm'].indexOf(key) !== -1 ? encodeURIComponent(param[key]) : param[key]
    }
  }

  return values
}

module.exports = {
  /**
   * @param  {object} param
   * @param  {string} mode PC_TEST, PC_REAL, MOBILE_TEST, MOBILE_REAL
   */
  normalize: function (param, mode) {
    var domain = mode.indexOf('TEST') !== -1 ? 'https://testpg.easypay.co.kr' : 'https://pg.easypay.co.kr'

    return {
      plugin: domain + '/webpay/EasypayCard_Web.js',
      action: domain + '/webpay/MainAction.do',
      param: normalize(param, mode)
    }
  }
}
