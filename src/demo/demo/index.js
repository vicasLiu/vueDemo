import Page from 'lib/page.js'

new Page({
    el: '#body',
    components: {
        'page': require('ui/page.vue'),
        'ui-button': require('ui/button.vue'),
        'ui-form': require('ui/form.vue'),
        'ui-field': require('ui/field.vue'),
        'ui-agreement': require('ui/agreement.vue'),
        'ui-product-item': require('ui/product-item.vue'),
    },
    template: `
        <div>
            <page :loading="loading">
                <ui-product-item 
                    v-if="product"
                    :disabled="true"
                    :title="product.productName" 
                    :image="product.productImage"
                    :price="product.productPrice"
                    :id="product.productNo"
                    :button-text=""
                    class="w3-padding"
                    style="background:#FFF;"
                    ></ui-product-item>

                <ui-form>
                    <ui-field label="数量">
                        <div class="w3-right">1</div>
                    </ui-field>
                    <ui-field label="总价">
                        <div class="w3-right price text-large">￥{{product.productPrice}}</div>
                    </ui-field>
                </ui-form>

                <ui-agreement class="w3-margin" :agree.sync="agree">《购买协议》</ui-agreement>

                <ui-button class="w3-margin" :disabled="!agree" type="submit" @tap="buy">
                    提交订单
                </ui-button>
            <page>
        </div>
    `,
    data: {
        agree: true,
        product: null
    },
    methods: {
        // 加载
        load: function(){
            this.post('product/order', {
                productNo: this.params.productNo,
                transCode: this.params.transCode,
            }, function(data){
                this.product = data;
            });
        },
        // 提交
        buy: function(){
            this.post('order/submit', {
                productNo: this.params.productNo,
                transCode: this.params.transCode,
                amount: 1,
                loginName: 'xiaowu'
            }, function(data){
                if(data.url){
                    location.href = data.url;
                }else{
                    throw '';
                }
            });
        }
    },
    ready: function(){
        this.load();
    }
});