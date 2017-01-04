'use strict'

var FIELDS = [
  'res_cd',
  'res_msg',
  'tr_cd',
  'ret_pay_type',
  'ret_complex_yn',
  'card_code',
  'card_req_type',
  'card_prefix',
  'card_no_7',
  'eci_code',
  'save_useyn',
  'trace_no',
  'sessionkey',
  'encrypt_data',
  'pnt_cp_cd',
  'spay_cp',
  'prepaid_cp'
]

module.exports = {
  defaults: function (mode) {
    var prefix = mode === 'PC' ? 'EP_' : 'sp_'
    var values = {}

    for (var i = 0, len = FIELDS.length; i < len; i++) {
      values[prefix + FIELDS[i]] = ''
    }

    return values
  },
  normalize: function (param) {
    var prefix = typeof param['EP_res_cd'] !== 'undefined' ? 'EP_' : 'sp_'
    var values = {}

    for (var i = 0, len = FIELDS.length, key; i < len; i++) {
      key = FIELDS[i]
      if (typeof param[prefix + key] !== 'undefined') {
        values[key] = param[prefix + key]
      }
    }

    // normalize resMsg
    // UTF-8 사용가맹점의 경우 한글이 들어가는 값은 모두 decoding 필수
    // 공백 문자인 + 를 처리하기 위해 +('%20') 을 공백으로 치환
    values.res_msg = decodeURIComponent((values.res_msg + '').replace(/\+/g, '%20'))

    return values
  }
}
