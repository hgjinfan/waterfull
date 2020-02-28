//小格类
function Grid(dictionary){
    //自己的dom
    this.$dom = null;
    //高度
    this.height;
    //列号
    this.colNumber;
    //自己的模板
    this.dictionary = dictionary;
    //初始化
    this.init();
    //把自己放入数组
    wf.grids.push(this);
}
Grid.prototype.init = function(){
    //模板修正
    // if(this.dictionary.type == "1"){
    //     this.dictionary.url = "http://files.haohaowan.com/yxxj/li_" + this.dictionary.url;
    // }else if(this.dictionary.type=="3"){
    //     this.dictionary.url = "http://files.haohaowan.com/yxxj/sp_" + this.dictionary.url + ".jpg";
    // }else if(this.dictionary.type=="2"){
    //     this.dictionary.url = "http://files.haohaowan.com/yxxj/yy_r1.jpg";
    // }
    this.dictionary.image = this.dictionary.image.replace(/^(\/\/)/, function ($1) {return 'https://'})
    this.dictionary.url = this.dictionary.image

    //数据绑定
    this.$dom = $(wf.compiled(this.dictionary));
    // grid整体初始高度
    this.height = 230 / this.dictionary.width * this.dictionary.height// parseInt(this.dictionary.height) + 46;
    //发出请求
    new ImageProxy(this);
    //上树
    wf.$dom.append(this.$dom);
    //列数
    this.colNumber = _.indexOf(wf.colHeightArr, _.min(wf.colHeightArr));
    //设置css
    this.$dom.css({
        "top" : wf.colHeightArr[this.colNumber],
        "left" : this.colNumber * 242,
        "height" : this.height
    });

    //把自己的高度加上去
    wf.colHeightArr[this.colNumber] += this.height + 20;
}


//图片load.gif代理类
function ImageProxy(grid){
    var height = grid.height - 46;
    var $parentDOM = grid.$dom.find(".pic_box");
    var url = grid.dictionary.url;
    //new出一个新的图片
    var img = new Image();
    //设置src，此时HTTP请求会发出
    img.src = url;
    //设置Loding图
    $parentDOM.css({
        "height": height,
        "background" : "url(images/loading.gif) no-repeat center center"
    });
    //监听load
    $(img).load(function(){
        //修正高度
        var gHeight = Math.round(230 / img.width * img.height + 46);
        if(gHeight!=grid.height){
            grid.height = gHeight;
            $parentDOM.css({
                "height": grid.height - 46
            });
        }
        //上树
        $parentDOM.append($(this));
    });
}
