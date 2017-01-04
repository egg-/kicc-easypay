var escapeshellarg = require('escapeshellarg')
var exec = require('child_process').exec
var qs = require('querystring')
var Iconv = require('iconv').Iconv

var DELI_FS = String.fromCharCode(28)
// not used
// var DELI_GS = String.fromCharCode(29)
// var DELI_RS = String.fromCharCode(30)
var DELI_US = String.fromCharCode(31)

var GW_URL = {
  TEST: 'testgw.easypay.co.kr',
  REAL: 'gw.easypay.co.kr'
}
var GW_PORT = '80'

function parseResponse (str) {
  var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE')
  str = iconv.convert(str).toString()
  return qs.parse(str.split(DELI_US).join('&'))
}

/**
 * @param {object} opts
 * @param {string} opts.id
 * @param {string} opts.path
 * @param {string} opts.cert
 * @param {string} opts.logPath
 * @param {string} opts.logLevel
 */
function Client (opts) {
  this._id = opts.id
  this._plugin = opts.path
  this._cert = opts.cert
  this._logPath = opts.logPath
  this._logLevel = opts.logLevel
  this._gwUrl = GW_URL[opts.test ? 'TEST' : 'REAL']

  this.clearMsg()
}

/**
 * execute 실행전 메시지 초기화.
 * @method clearMsg
 */
Client.prototype.clearMsg = function () {
  this._txReq = ''
  this._reqData = []
  this._resData = []
}

/**
 * 지정된 데이터 위치 반환.
 * @method indexOfReqData
 * @param  {string} name
 * @return {number} -1: 존재하지 않음.
 */
Client.prototype.indexOfReqData = function (name) {
  for (var i = 0, length = this._reqData.length; i < length; i++) {
    if (this._reqData[i][0] === name) {
      return i
    }
  }
  return -1
}

/**
 * set_easypay_deli_us
 * set Request Data
 * @method setReqData
 * @param  {string} name
 * @param  {object} param
 * @example
 * setReqData('mgr_data', {
 * 'mgr_txtype': mgr_txtype,
 * // ...
 * })
 */
Client.prototype.setReqData = function (name, param) {
  var idx = this.indexOfReqData(name)
  if (idx === -1) {
    idx = this._reqData.length - 1
    this._reqData[idx] = []
  }

  for (var key in param) {
    if (param[key] !== '') {
      this._reqData[idx][1] += key + '=' + param[key] + DELI_US
    }
  }
}

/**
 * get_easypay_item
 * retrieve request value
 * @method getReqData
 * @param  {string} name
 */
Client.prototype.getReqData = function (name) {
  var idx = this.indexOfReqData(name)
  return idx !== -1 ? (name + '=' + this._reqData[idx][1]) : ''
}

/**
 * @method execute
 * @param  {object} param
 * @param  {string} param.req_ip
 * @param  {string} param.tr_cd
 * @param  {string} param.order_no
 * @param  {string} [param.encrypt_data]
 * @param  {string} [param.sessionkey]
 * @param  {string} [param.trace_no]
 * @param  {string} [param.id] mall id
 * @param  {Function} cb
 */
Client.prototype.execute = function (param, cb) {
  var command = [this._plugin, '-h', escapeshellarg([
    'order_no=' + param.order_no,
    'cert_file=' + this._cert,
    'mall_id=' + (param.id || this._id),
    'tr_cd=' + param.tr_cd,
    'gw_url=' + this._gwUrl,
    'gw_port=' + GW_PORT,
    'plan_data=' + this._txReq,
    'enc_data=' + (param.encrypt_data || ''),
    'snd_key=' + (param.sessionkey || ''),
    'trace_no=' + (param.trace_no || ''),
    'cust_ip=' + param.req_ip,
    'log_dir=' + this._logPath,
    'log_level=' + this._logLevel
  ].join(','))].join(' ')

  this._setTxReqData()
  exec(command, {
    encoding: 'buffer'
  }, function (err, stdout) {
    if (err) {
      return cb(err)
    }

    cb(null, parseResponse(stdout))
  })
}

Client.prototype._setTxReqData = function () {
  var names = ['pay_data', 'order_data', 'escrow_data', 'mgr_data', 'cach_data']
  for (var i = 0, length = names.length; i < length; i++) {
    this._appendTxReq(this.getReqData(names[i]))
  }
}

// set_easypay_deli_fs
Client.prototype._appendTxReq = function (value) {
  if (value !== '') {
    this._txReq += value + DELI_FS
  }
}

module.exports = {
  create: function (opts) {
    return new Client(opts)
  }
}
