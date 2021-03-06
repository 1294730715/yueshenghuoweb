avalon.ready(function() {
    function q() {
        var n = "GET",
        a = "orders/status/"+o.currentStatus,
        i = null,
        e = function(n) {
			console.log(JSON.stringify(n));
            o.orders = n.result;
            if(o.currentStatus == "ALL"){
            	o.groupsNum = n.result.length;
            }
        },
        r = function() {
			console.log(JSON.stringify(n));
			o.orders = [];
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    function pay(order) {
    	var n = "GET",
        a = "/requestPay/"+order.id,
        i = null,
        e = function(n) {
        	wx.chooseWXPay({
              "timestamp":n.result.timestamp,
              "nonceStr":n.result.nonceStr,
              "package":n.result.pkgStr,
              "signType":n.result.signType,
              "paySign":n.result.signature,
        	    success: function (res) {
                  	notifyPaySuccess();
                  	order.status=1;
        	    }
        	});
        },
        r = function() {
			alert("支付请求失败，请稍后重试！");
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    function notifyPaySuccess() {
    	var n = "GET",
        a = "notifyPayed/"+o.order.id,
        i = null,
        e = function(n) {},
        r = function() {};
        common.invokeApi(n, a, i, null, e, r)
    }
    function orderCancel(order) {
    	var n = "GET",
        a = "/cancelOrder/"+order.id,
        i = null,
        e = function(n) {
           order.status=2;
           order.statusStr="已取消";
           alert("订单已取消");
        },
        r = function() {
			alert("支付取消失败，请稍后重试！");
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    function orderConfirm(order) {
    	var n = "GET",
        a = "/signOrder/"+order.id,
        i = null,
        e = function(n) {
           order.status=6;
           order.statusStr="已签收";
        },
        r = function() {
			alert("支付签收失败，请稍后重试！");
        };
        common.invokeApi(n, a, i, null, e, r)
    }
    var o = avalon.define({
        $id: "root",
        orders: [],
        currentStatus:'ALL',
        groupsNum: 1,
        bg_img:'static/img/bg/bg_orders.jpg',
        dropdownCollapsed: true,
        selectedDropdown: '',
        dropdowns: [
            {
                name: '全部订单',
                value: 'ALL'//根据需要传给后台的查询参数修改这些value
            },
            {
                name: '待付款订单',
                value: 'NEEDPAY'//根据需要传给后台的查询参数修改这些value
            },
            {
                name: '已支付',
                value: 'PAYED'//根据需要传给后台的查询参数修改这些value
            },
            {
                name: '配货中',
                value: 'PREPARE'//根据需要传给后台的查询参数修改这些value
            },
            
            {
                name: '待收货订单',
                value: 'NEEDRECEIVE'//根据需要传给后台的查询参数修改这些value
            },
            {
                name: '已取消订单',
                value: 'CANCELD'//根据需要传给后台的查询参数修改这些value
            }
        ],
        toggleDropdown: function() {
            o.dropdownCollapsed = !o.dropdownCollapsed;
        },
        selectDropdown: function(idx) {
            o.selectedDropdown = o.dropdowns[idx];
            if(o.currentStatus!=o.selectedDropdown.value){
            	o.currentStatus=o.selectedDropdown.value;
            	q();
            }
            //根据选择的筛选条件刷新列表数据
        },
        orderPay: function(order) {
        	pay(order);
        },
        orderCancel: function(order) {
        	if(confirm("确定要取消该订单？")){
        		orderCancel(order);
        	}
        },
        comment: function(order) {
            window.location.href="group/comment.html?orderId="+order.id;
        },
        orderConfirm: function(order) {
        	if(confirm("确定要已收货？")){
        		orderConfirm(order);
        	}
        },
        orderLogistics: function() {
            alert("orderLogistics");
        },
        show:function(page) {
        	o.currentShow = page
        },
        gotoDetail:function(orderid){
        	location.href="orderdetail.html?orderId="+orderid;
        }
    });
    initWechat(['chooseWXPay']) ;
    q(),
    avalon.scan(document.body),
    //share.default_send(),
    FastClick.attach(document.body),
    common.setTitle("商品订单");
});