$(function() {
  var toastr = {
    active: false,
    info: function(msg) {
      var _this = this;
      if (_this.active) {
        return;
      }
      _this.active = true;
      vm.toastrInfo = msg;
      setTimeout(function() {
        vm.toastrInfo = '';
        _this.active = false;
      }, 3000)
    }
  };
  var bridge = new Bridge();
  // var ruleJSON = null;
  var terminal = util.getSearch('terminal');


  var vm = new Vue({
    el: 'body',
    data: {
      showLoading: false,
      toastrInfo: '',
      // showRule: false,
      // curRule: null,
      activity: {
        end: false,
        time: ['11月9日', '11月10日', '11月11日'],
        depositMoney: 0
      },
      tabItems: [{
        'text': '11月9日',
        'time': '2016-11-09',
        'active': true,
        'content': [],
      }, {
        'text': '11月10日',
        'time': '2016-11-10',
        'active': false,
        'content': [],
      }, {
        'text': '11月11日',
        'time': '2016-11-11',
        'active': false,
        'content': []
      }, ],
      pageData: {},

      winnerList: [],
      isUpdate: false
    },
    methods: {
      init: function() {

        var self = this;
        var sessionId = util.getSearch('sessionId') || '';
        bridge.send({
          type: 'hideAppLoading'
        });
        $.ajax({
          methods: 'POST',
          url: HOST + '/msapi/doubleEleven/getJuCaiHomeInfo',
          dataType: 'json',
          data: {
            sessionId: sessionId
          },
          success: function(res) {
            if (res.flag == 1) {
              // if (!res.data.is_open) {
              //   alert('活动已结束');
              //   return;
              // }
              if (res.data.is_open_second_stage) {
                self.activity.end = true;
                self.activity.time = ['11月12日', '11月13日'];

                self.pageData = res.data;
                return;
              }
              self.pageData = res.data;

              self.selectTab(0);
              self.getDepositMoney();
              self.update();
            }
          }
        });


      },
      selectTab: function(index) {
        var len = this.tabItems.length;
        for (var i = 0; i < len; i++) {
          this.tabItems[i]['active'] = false;
        }
        var curTab = this.tabItems[index];
        curTab.active = true;

        if (curTab.content && curTab.content.length && !this.isUpdate) {
          this.winnerList = curTab.content;
          this.isUpdate = false;
          return;
        }
        this.getWinnerList(index);
      },
      getWinnerList: function(index) {
        var self = this;
        var index = index || 0;
        var curTab = self.tabItems[index];
        var time = curTab['time'];
        console.log('time=' + time);

        $.ajax({
          methods: 'POST',
          url: HOST + '/msapi/doubleEleven/getHomeJuCaiBangInfo',
          dataType: 'json',
          data: {
            time: time
          },
          success: function(res) {
            if (res.flag == 1) {

              self.winnerList = res.data && res.data.juHaoBangInfo;
              curTab.content = res.data && res.data.juHaoBangInfo;
            }
          }
        });
      },
      getDepositMoney: function() {
        var self = this;
        $.ajax({
          methods: 'GET',
          url: HOST + '/msapi/doubleEleven/getCurrentDepositMoneyInfo',
          dataType: 'json',
          success: function(res) {
            if (res.flag == 1) {
              self.activity.depositMoney = res.data && res.data.depositMoney;

            }
          }
        });
      },
      update: function() {
        console.log('update 5 min');
        var self = this;

        setTimeout(function() {
          self.isUpdate = true;
          self.getWinnerList();
          self.getDepositMoney();
        }, 5 * 1000)

      },
      goProductDetail: function(index, type) {
        var self = this;
        if (type == 1) {
          var productArr = self.pageData['dianFengJuHuiInfo'];
        } else {
          var productArr = self.pageData['stagePlanHuiJuInfo'];
        }
        var product = productArr[index];

        bridge.send({
          type: 'productDetail',
          data: {
            fp_id: product['fp_id'],
            fp_title: product['fp_title'],
            fp_type: type
          }
        });

       
      },

      goPage: function(name) {
        if (name == 'activity') {
          _czc.push(['_trackEvent', '其他活动', '点击', 'NB预言家']);
          bridge.send({
            type: 'activity',
            data: {
              name: 'NB预言家', //活动具体名字
              link: 'http://mp.weixin.qq.com/s?__biz=MjM5NjMxMTU0Mg==&mid=503772002&idx=1&sn=af15e0435dac1bc6189fe0a3b7362bb5&chksm=3d196bfb0a6ee2edcdb9a01436f40245f74d78960535642d7b61c76760d59bb29b1061b60041&scene=20#wechat_redirect', //活动页面url
              needLogin: false //是否需要登录 true:需要, false:不需要
            }
          });
        } else {
          if (name == 'specInvest') {
            _czc.push(['_trackEvent', '其他活动', '点击', '0元兑']);
          } else if (name == 'mall') {
            _czc.push(['_trackEvent', '其他活动', '点击', '会员商城']);
          }
          bridge.send({
            type: 'pageSwitch',
            data: {
              name: name,
            }
          });
        }
      },
      goLogin: function() {
        bridge.send({
          type: 'login',
          url: window.location.href
        });
      },

      // showRuleMask: function(name) {
      //   var self = this;
      //   self.showRule = true;
      //   if (ruleJSON) {
      //     self.curRule = ruleJSON[name];
      //     return;
      //   }
      //   if (!ruleJSON) {
      //     $.ajax({
      //       methods: 'GET',
      //       url: './json/rule.json',
      //       dataType: 'json',
      //       success: function(res) {
      //         ruleJSON = res;
      //         self.curRule = ruleJSON[name];
      //       }
      //     });
      //   }
      // },

      // hideRuleMask: function() {
      //   this.showRule = false;
      //   self.curRule = null;
      // }
    }
  });



  vm.init();

})
