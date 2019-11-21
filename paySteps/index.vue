<template>
  <div class="confirm-pay">
    <!-- 底部支付栏 -->
    <pay-tab :coupon="couponInfo"
      @handleBuy="handleBuy"
      confirmText="确认支付" />
  </div>
</template>

<script>
import payTab from '@/components/payTab/index'
import decodeXML from '@/common/utils/decodeXML' // 创建订单接口，返回的订单信息需要把'&amp;'转回'&'

export default {
  components: {
    payTab
  },
  data() {
    return {
      couponInfo: {},
      couponRuleId: '',
      merchantName: '',
      coupon: {}
    }
  },
  onLoad(e) {
    const { coupon, couponInfo, couponRuleId } = e
    coupon && (this.coupon = JSON.parse(decodeURIComponent(coupon)))
    couponInfo && (this.couponInfo = JSON.parse(decodeURIComponent(couponInfo)))
    couponRuleId && (this.couponRuleId = JSON.parse(decodeURIComponent(couponRuleId)))
  },

  methods: {
    // 点击支付，调用创建订单信息接口
    async handleBuy() {
      wx.showLoading({
        title: '加载中',
        mask: true
      })

      // 创建订单
      const payInfoRes = await this.createdOrder()
      if(!payInfoRes) return this.hideLoading()
      const payInfo = JSON.parse(decodeXML(payInfoRes.pay_info))  // 支付信息

      // 微信api发起支付
      const payStatusRes = await this.payFunc(payInfo)
      if(payStatusRes=='requestPayment:ok'){
        // 支付成功，发起对账
        this.confirmPayStatus(payInfoRes.orderNumber, payInfo)
      } else if(payStatusRes=='requestPayment:fail cancel'){
        // 取消支付，调接口取消支付信息，释放库存
        this.cancelPay(payInfoRes.orderNumber)
      }else{
        // 支付失败，出现异常报错
        this.showToast('支付失败，请重试')
      }
    },

    // 创建订单接口（传入优惠卷id、xx）（返回订单号、支付信息）
    async createdOrder(){
      const params = {
        couponRuleId: this.couponRuleId,
        presentRecordId: this.presentRecordId // todo, 增加礼品券的使用, 待验证
      }
      const res = await this.$global.request('createPayOrder', params).catch(() => {
        return this.showToast('网络异常...')
      })
      if (res.body.errorCode == 0) return res.body // 创建订单成功，发起支付
      else return this.showToast(res.body.errorMsg) // 创建订单失败，错误提示
    },

    // 微信支付api，只需要传入订单信息
    async payFunc(payInfo) {
      const res = await this.$global.promisify(wx.requestPayment, payInfo).catch(err => {
        return err  // 在catch里return的值会赋值给res，而不是中止整个函数
      })
      return res.errMsg
    },

    // 微信发起支付成功，调用对账接口（传入支付信息、订单号、优惠卷名、商户名、页面？）（返回优惠卷id、积分）
    async confirmPayStatus(orderNumber, payInfo) {
      const params = {
        orderNumber,
        page: '/pages/myOrder/main',
        prepay_id: payInfo.package.substring(10),
        couponName: this.coupon.couponName,
        merchantName: this.merchantName
      }
      const res = await this.$global.request('payStatusForPage', params).catch(() => {
        this.showToast('网络异常...')
      })
      wx.hideLoading()
      // 对账接口报错
      if (res.body.errorCode != '0') return this.showToast(res.body.errorMsg)
      // 对账成功--跳转到相应结果页面(订单详情)
      const { couponRecordId, scoreChange } = res.body
      if (res.body.scoreChange != '-1') wx.redirectTo({url: `/pages/orderDetail/main?score=${scoreChange}&id=${couponRecordId}`})
      else wx.redirectTo({url: `/pages/orderDetail/main?id=${couponRecordId}`}) // 非当日首次购买，无积分
    },

    // 微信没有发起支付，调用取消支付接口，释放库存（传入订单号、优惠卷id、xx）（返回状态）
    async cancelPay(orderNumber) {
      const params4 = {
        couponRuleId: this.couponRuleId,
        orderNumber,
        presentRecordId: this.presentRecordId
      }
      const res = await this.$global.request('cancelBuy', params4).catch(() => {
        this.showToast('网络异常...')
      })
      if (res.body.errorCode == 0) console.log('取消支付成功')
      else console.log(res.body.errMsg, '取消支付接口异常信息')
    },

    showToast(title) {
      wx.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import './index.scss';
</style>
