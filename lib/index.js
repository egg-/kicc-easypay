'use strict'

/**
 * @define joinCode
 * JC01 키자니아 삼성제휴
 * JC02 현대카드 M포인트 청구할인
 * JC03 국민카드 아이사랑 카드할인
 * JC04 ARS 신용카드 결제 거래 ONLINE 거래
 * JC05 ARS 신용카드 결제 거래 OFFLINE 거래
 * JC06 세이브 결제 거래
 * JC07 비씨 물품바우처 승인 거래
 * JC08 롯데 청구할인
 */

var request = require('./request')
var response = require('./response')
var client = require('./client')

var CONST = {
  MODE_MOBILE: 'MOBILE',
  MODE_PC: 'PC',
  CURRENCY_KRW: '00',
  TYPE_PAYMENT: 'PAYMENT',
  TYPE_MGR: 'MGR'
}

/**
 * Create Easypay instance
 * @method Easypay
 * @param {object} opts
 * @param {string} opts.id [EP_mall_id, sp_mall_id] 가맹점 ID - KICC에서 부여한 가맹점 ID (필수)
 * @param {string} opts.client 클라이언트 파일 위치. (절대경로)
 * @param {string} opts.cert 인증서 파일 위치. (절대경로)
 * @param {string} opts.logPath 로그파일 저장위치. (절대경로)
 * @param {string} [opts.logLevel] 로그 레벨. 기본값: 1 (옵션)
 * @param {string} [opts.name] [EP_mall_nm, sp_mall_nm] 가맹점명 - 결제창에 표시될 가맹점명 (옵션)
 * @param {string} [opts.ci] [EP_ci_url] 가맹점 CI URL - CI 이미지 파일의 URL (옵션)
 * @param {boolean} [opts.test] test 여부.
 */
function Easypay (opts) {
  var clientOpts = Easypay.validate(opts, ['client', 'cert', 'logPath'], {
    logLevel: 1
  })

  this._mall = Easypay.validate(opts, ['id'], {
    name: '',
    ci: '',
    test: false
  })

  this._client = client.create({
    id: this._mall.id,
    path: clientOpts.client,
    cert: clientOpts.cert,
    logPath: clientOpts.logPath,
    logLevel: clientOpts.logLevel,
    test: this._mall.test
  })
}

/**
 * return Easypay payment instance
 * @method payment
 * @param {string} param.mode PC, MOBILE
 * @param {string} param.order_no 가맹점 주문번호 - 가맹점에서 생성하는 유일한 번호 (필수)
 * @param {string} param.currency 통화코드 -  00 원화 (필수)
 * @param {string} param.return_url 가맹점 callback url - 인증응답 받을 가맹점 URL (필수)
 * @param {string} [param.window_type] 윈도우 타입 iframe (layer popup) / popup (옵션)
 * @param {string} [param.pay_type] 결제수단 - 결제수단표 참조 11: 신용카드, 21: 계좌이체, 22: 무통장입금, 31: 휴대폰, 50: 선불결제, 60: 간편결제 (옵션)
 * @param {string} [param.charset] 가맹점 CharSet - EUC-KR,UTF-8 사용시 대문자 이용 (옵션)
 * @param {string} [param.lang_flag] 영어버전여부 - KOR: 국문, ENG: 영문 (옵션)
 * @param {string} [param.disp_cash_yn] 현금영수증 화면표시여부 N: 미표시, 그 외: DB조회 (옵션)
 * @param {string} param.product_nm 상품명 (필수)
 * @param {string} param.product_amt 상품금액 - 결제금액 반드시 숫자만가능 (필수)
 * @param {string} [param.product_type] 상품구분 0: 실품, 1: 컨텐츠 (옵션)
 * @param {string} [param.product_expr] 서비스기간 YYYYMMDD (옵션)
 * @param {string} param.os_cert_flag 해외카드인증구분(=2) 변경불가
 * @param {string} [param.quota] 할부개월 (카드코드-할부개월) (옵션)
 * @param {string} [param.noinst_flag] 무이자설정 Y: 무이자, N: 일반, DB: NULL (옵션)
 * @param {string} [param.noinst_term] 무이자기간 (카드코드-할부개월) (옵션)
 * @param {string} [param.set_point_card_yn] 카드사포인트 사용여부(Y/N) (옵션)
 * @param {string} [param.point_card] 포인트카드 리스트 (카드코드-더할할부개월) cardSetPointCardYn 값이 Y인 경우 필수. 카드사와 포인트 특약 맺은 부분이 있는 경우 사용. (옵션)
 * @param {string} [param.join_cd] 조인코드 (옵션)
 * @param {string} [param.kmotion_useyn] 국민앱카드 사용여부(Y/N) (옵션)
 * @param {string} [param.cert_type] 인증타입 빈값: 일반, 0: 인증, 1: 비인증 (옵션)
 * @param {string} [param.vacct_bank] 가맹점에서 사용할 가상계좌 은행 리스트. 빈값: DB조회 (옵션)
 * @param {string} [param.vacct_end_date] 가상계좌 입금마감 일자 YYYYMMDD (옵션)
 * @param {string} [param.vacct_end_time] 가상계좌 입금마감 시간 hh24miss (옵션)
 * @param {string} [param.memb_user_no] 가맹점 고객관리번호 (옵션)
 * @param {string} [param.user_type] 사용자 구분 - 1: 일반, 2: 회원 (옵션)
 * @param {string} [param.user_id] 고객ID - 가맹점에서 관리하는 고객 ID (옵션)
 * @param {string} [param.user_nm] 고객명 (옵션)
 * @param {string} [param.user_mail] 고객 연락처1 '-' 없이 입력 (옵션)
 * @param {string} [param.user_phone1] 고객 연락처1 '-' 없이 입력 (옵션)
 * @param {string} [param.user_phone2] 고객 연락처2 '-' 없이 입력 (옵션)
 * @param {string} [param.user_addr] 고객 주소 (옵션)
 * @param {string} [param.user_define1] 예비필드1 (옵션)
 * @param {string} [param.user_define2] 예비필드2 (옵션)
 * @param {string} [param.user_define3] 예비필드3 (옵션)
 * @param {string} [param.user_define4] 예비필드4 (옵션)
 * @param {string} [param.user_define5] 예비필드5 (옵션)
 * @param {string} [param.user_define6] 예비필드6 (옵션)
 */
Easypay.prototype.createPayment = function (param) {
  var required = ['order_no', 'currency', 'return_url', 'product_nm', 'product_amt']
  var options = {
    pay_type: '',
    window_type: 'iframe',
    charset: 'UTF-8',
    lang_flag: 'KOR',
    disp_cash_yn: '',
    product_type: '',
    product_expr: '',
    quota: '',
    noinst_flag: '',
    noinst_term: '',
    set_point_card_yn: '',
    point_card: '',
    join_cd: '',
    kmotion_useyn: '',
    cert_type: '',
    vacct_bank: '',
    vacct_end_date: '',
    vacct_end_time: '',
    memb_user_no: '',
    user_type: '',
    user_id: '',
    user_nm: '',
    user_mail: '',
    user_phone1: '',
    user_phone2: '',
    user_addr: '',
    user_define1: '',
    user_define2: '',
    user_define3: '',
    user_define4: '',
    user_define5: '',
    user_define6: ''
  }

  var mode = (param.mode || 'PC').toUpperCase()
  var values = Easypay.validate(param, required, options)

  // osCertFlag: 변경불가정보.
  values.os_cert_flag = 2
  values.mall_id = this._mall.id
  values.mall_nm = this._mall.name
  values.ci_url = this._mall.ci

  values.product_amt = Number(values.product_amt)

  var data = request.normalize(values, [mode, this._mall.test ? 'TEST' : 'REAL'].join('_'))
  data.response = response.defaults(mode)

  return data
}

/**
 * 승인요청
 * @method execute
 * @param {object} param
 * @param {string} param.req_ip
 * @param {string} param.tr_cd
 * @param {string} param.order_no
 * @param {string} param.encrypt_data
 * @param {string} param.sessionkey
 * @param {string} param.trace_no
 * @param {function} cb
 */
Easypay.prototype.execute = function (param, cb) {
  this._client.execute(param, cb)
}

Easypay.validate = function (param, required, options) {
  var values = {}

  for (var i = 0, length = required.length; i < length; i++) {
    if (typeof param[required[i]] === 'undefined') {
      throw new Error('missing parameter. (' + required[i] + ')')
    }
    values[required[i]] = param[required[i]]
  }

  if (options) {
    for (var key in options) {
      values[key] = param[key] || options[key]
    }
  }

  return values
}

module.exports = {
  create: function (opts) {
    return new Easypay(opts)
  },
  parse: function (param) {
    return response.normalize(param)
  },
  checkType: function (code) {
    if (code === '00101000') {
      return CONST.TYPE_PAYMENT
    } else if (code === '00201000') {
      return CONST.TYPE_MGR
    } else {
      throw new Error('invalid trans code. (' + code + ')')
    }
  },
  CONST: CONST
}
