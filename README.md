# kicc-easypay

[![version](https://img.shields.io/npm/v/kicc-easypay.svg) ![download](https://img.shields.io/npm/dm/kicc-easypay.svg)](https://www.npmjs.com/package/kicc-easypay)

* Node.js 을 위한 KICC Easypay 결제 라이브러리.
* PHP 샘플 코드를 기반으로 작성되어 있으며, 실제 전문 작성을 위한 binary 파일은 미포함.

## Usage

```javascript
var Easypay = require('kicc-easypay')

var easypay = Easypay.create({
  id: 'mall_id',
  name: 'mall_nm',
  ci: 'ci_url',
  test: true,
  client: 'client_file_path',
  cert: 'cert_file_path',
  logPath: 'log_directory_path',
  logLevel: 1
})

// ...
// create payment object
createPayment({
  mode: Easypay.CONST.MODE_PC,
  order_no: orderNo,
  currency: Easypay.CONST.CURRENCY_KRW, // KRW
  return_url: 'https://host/return' + '/' + orderNo,
  pay_type: pay_type || '',
  window_type: window_type || '',
  product_nm: productName,
  product_amt: totalAmount,
  memb_user_no: userId,
  user_id: userId,
  user_nm: userName
})

// ...
var rsp = Easypay.parse(req.body)
var type = Easypay.checkType(rsp.tr_cd)

// 승인요청 전문 실행.
if (type === Easypay.CONST.TYPE_PAYMENT) {
  easypay.execute({
    req_ip: remoteIp,
    tr_cd: rsp.tr_cd,
    order_no: orderNo,
    encrypt_data: rsp.encrypt_data,
    sessionkey: rsp.sessionkey,
    trace_no: rsp.trace_no
  }, cb)
}
```

## Response and Request Field Definition Table

필드명 | 이름
---- | ----
account_no | 계좌번호
accrue_pnt | 누적포인트
acquirer_cd | 매입사코드
acquirer_nm | 매입사명
amount | 총 결제금액
ars_no | 전화번호
auth_id | PhoneID
auth_no | 승인번호
bank_cd | 은행코드
bank_nm | 은행명
billid | 인증번호
bk_pay_yn | 장바구니 결제여부
canc_acq_date | 매입취소일시
canc_date | 취소일시
card_biz_gubun | 신용카드 구분
card_gubun | 신용카드 종류
card_no | 카드번호
cash_auth_no | 현금영수증 승인번호
cash_auth_type | 인증구분
cash_auth_value | 인증번호
cash_issue_type | 현금영수증발행용도
cash_res_cd | 현금영수증 결과코드
cash_res_msg | 현금영수증 결과메세지
cash_tran_date | 현금영수증 승인일시
cno | PG거래번호
complex_yn | 복합결제 유무
cp_cd | 포인트사/쿠폰사
cpon_auth_no | 쿠폰승인번호
cpon_flag | 쿠폰사용유무
cpon_no | 쿠폰번호
cpon_tran_date | 쿠폰승인일시
deduct_pnt | 총차감 포인트
deli_cd | 배송구분[자가:DE01,택배:DE02]
deli_corp_cd | 택배사코드
deli_invoice | 운송장 번호
deli_rcv_nm | 수령인 이름
deli_rcv_tel | 수령인 연락처
deposit_nm | 입금자명
encrypt_data | 암호화 데이타
escrow_yn | 에스크로 사용유무
expire_date | 계좌사용만료일
install_period | 할부개월
issuer_cd | 발급사코드
issuer_nm | 발급사명
memb_user_no | 가맹점 고객일련번호
mgr_account | 환불계좌 번호
mgr_amt | 부분취소/환불요청 금액
mgr_bank_cd | 환불계좌 은행코드
mgr_depositor | 환불계좌 예금주명
mgr_msg | 변경 사유
mgr_paytype | 결제수단
mgr_socno | 환불계좌 주민번호
mgr_subtype | 변경세부구분
mgr_telno | 환불고객 연락처
mgr_txtype | 거래구분
mob_ansim_yn | 안심결제 사용유무
mobile_no | 휴대폰번호
noint | 무이자여부
order_no | 주문번호
order_no | 주문번호
org_cno | 원거래고유번호
part_cancel_yn | 부분취소 가능여부
pay_pnt | 할인/발생포인트
pay_type | 결제수단
payback_pnt | payback 포인트
pnt_auth_no | 포인트승인번호
pnt_tran_date | 포인트승인일시
product_amt | 상품금액
product_nm | 상품명
product_type | 상품정보구분[0:실물,1:컨텐츠]
refund_date | 환불예정일시
rem_amt | 잔액
remain_cpon | 쿠폰잔액
remain_pnt | 잔여한도
req_id | 요청자 ID
req_ip | 요청자 IP
ret_pay_type | 결제수단
sessionkey | 암호화키
stat_cd | 상태코드
stat_msg | 상태메시지
tr_cd | 요청구분
trace_no | 추적고유번호
tran_date | 승인일시
used_cpon | 쿠폰 사용금액
used_pnt | 사용포인트
user_addr | 가맹점 고객 주소
user_id | 고객 ID
user_mail | 고객 E-mail
user_name | 고객명
user_phone1 | 가맹점 고객 연락처1
user_phone2 | 가맹점 고객 연락처2
user_type | 사용자구분구분[1:일반,2:회원]


## Release History

See the [CHANGELOG.md](CHANGELOG.md)


## License

kicc-easypay is licensed under the [MIT license](https://github.com/egg-/kicc-easypay/blob/master/LICENSE).
