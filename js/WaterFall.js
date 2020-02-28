//瀑布流的管理类
function WarterFall(){
    //大盒子
    this.$dom = $("#waterfall");
    this.$dom.append("<div id='diandian'></div>");
    //页面
    this.page = 1;
    //总列数
    this.colAmount = 3;
    //每个列的总高度
    this.colHeightArr = [0,0,0];
    //编译函数
    this.compiled = _.template($("#template").html());
    //自己的小格格对象
    this.grids = [];
    //节流锁
    this.lock = true;
    //绑定监听
    this.bindEvent();
    //调用第1页
    this.getPage(this.page);
}
//请求某一页的JSON文件
WarterFall.prototype.getPage = function(number){
    var self = this;
    //发出JSON请求
    $.ajax({
        // "dataType" : "jsonp",
        //"url" : "http://yx.xianjian.com/p/api.php?method=wf&api_key=nimakdkeiLdkfen2lidkdlDLLEKd&page=" + number + "&per_page=10&tag=&type=5&order=2&_ksTS=1480315549837_78&jsoncallback=?",
        url: 'https://api2.paixin.com/albums/129/medias?page=' + number + '&size=45&sort=createdAt,desc',
        "success" : function(data){
            var p = data.elements
            _.each(p,function(dictionary){
                // console.log(dictionary)
                new Grid(dictionary);
                // console.log(dictionary);
            });
            var maxH = _.max(self.colHeightArr);
            self.$dom.find("#diandian").css("top", maxH);
            //开锁
            if(p.length != 0){
                self.lock = true;
            }
        }
    });
}
//更改列数，实际上就是重算！重算！重算！重算！重算！重算！重算！重算！重算！重算！重算！重算！重算！
WarterFall.prototype.changeColAmount = function(number){
    this.colAmount = number;
    //立即把自己的高度数组，重新清零
    this.colHeightArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].slice(0,number);
    //让大盒子居中，此时需要重新计算一个宽度
    this.$dom.css("width",242 * number - 12);
    //遍历数组中的每一个grid，这些grid一定已经加载完毕了！
    //因为grid类中，是load之后才push进入数组
    for(var i=0; i<this.grids.length; i++){
        // 最低列号
        var colNumber =_.indexOf(this.colHeightArr, _.min(this.colHeightArr));
        // 重新定位
        this.grids[i].$dom.stop(true).animate({
            "left": colNumber*242, 
            "top": wf.colHeightArr[colNumber]
        }, 1000);
        // 更新高度数组
        this.colHeightArr[colNumber] += parseInt(this.grids[i].height) + 20;
    }
    var maxH=_.max(this.colHeightArr);
    this.$dom.find("#diandian").css("top", maxH);
}
WarterFall.prototype.bindEvent = function(){
    var self = this;
    //窗口宽度
    cacl();
    //窗口改变尺寸
    $(window).bind("resize",cacl);
    //重新计算
    function cacl(){
        //窗口宽度
        var w = $(window).width();
        //计算窗口此时能够容纳多少个列
        var _colAmount = Math.floor((w - 12) / 242);
        if(_colAmount==0){
            _colAmount=1;
        }
        //看看这个列数和当前列数是否不同
        if(_colAmount != self.colAmount){
            self.changeColAmount(_colAmount);
        }
    }
    //窗口卷动
    $(window).scroll(function(){
        //判断节流
        if(!self.lock){
            return;
        }
        //卷动值
        var A = $(window).scrollTop();
        var B = $(window).height();
        var C = $(document).height();
        var rate = (A + B) / C;
        if(rate > 0.7){
            self.getPage(++self.page);
            //关锁
            self.lock = false;
        }
    });
    var i = 0;
    //等待小点点
    setInterval(function(){
        i++;
        if(i > 3){
            i = 0;
        }
        $("#diandian").html("...".substr(0,i));
    },200);
}
