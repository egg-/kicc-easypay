'use strict'

var DOMAIN = {
  PC_TEST: 'https://testpg.easypay.co.kr',
  PC_REAL: 'https://pg.easypay.co.kr',
  MOBILE_TEST: 'https://testsp.easypay.co.kr',
  MOBILE_REAL: 'https://sp.easypay.co.kr'
}
var FIELDS = [
  'mall_id', 'mall_nm', 'ci_url', 'pay_type', 'order_no', 'currency', 'return_url', 'window_type', 'charset', 'lang_flag', 'disp_cash_y',
  'product_nm', 'product_amt', 'product_type', 'product_exp',
  'os_cert_flag', 'quota', 'noinst_flag', 'noinst_term', 'set_point_card_yn', 'point_card', 'join_cd', 'kmotion_useyn', 'cert_typ',
  'vacct_bank', 'vacct_end_date', 'vacct_end_tim',
  'memb_user_no', 'user_type', 'user_id', 'user_nm', 'user_mail', 'user_phone1', 'user_phone2', 'user_addr', 'user_define1', 'user_define2', 'user_define3', 'user_define4', 'user_define5', 'user_define6'
]

var normalize = function (param, mode) {
  var prefix = (mode || 'PC_TEST').toUpperCase().indexOf('PC') !== -1 ? 'EP_' : 'sp_'
  var values = {}

  for (var i = 0, len = FIELDS.length, key; i < len; i++) {
    key = FIELDS[i]

    if (typeof param[key] !== 'undefined') {
      // EUC-KR 이슈로 한글이 포함되는 필드는 인코딩.
      values[prefix + key] = ['mall_nm', 'product_nm', 'user_nm', 'user_addr'].indexOf(key) !== -1 ? encodeURIComponent(param[key]) : param[key]
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
    var domain = DOMAIN[mode]
    return {
      plugin: domain + '/webpay/EasypayCard_Web.js',
      action: domain + (mode.indexOf('PC') !== -1 ? '/webpay/MainAction.do' : '/ep8/MainAction.do'),
      param: normalize(param, mode)
    }
  }
}
