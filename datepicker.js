/**
 * Created by zWX325482 on 2015/12/2.
 */

/**
 * 用targetStr替换掉字符串中所有的regStr
 * @param regStr
 * @param targetStr
 * @returns {String}
 */
String.prototype.replaceAll = function ( regStr, targetStr ) {
    var str = this;
    while(str.indexOf(regStr) != -1) {
        str = str.replace(regStr, targetStr);
    }
    return str;
}

/**
 * 获得uuid唯一标示
 * @private
 */
function _getUuid_() {

    var createUUID = (function(uuidRegEx, uuidReplacer) {
        return function() {
            return "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });
    return createUUID();
}

addCls = function(obj, cls) {

    if(!obj) {
        return;
    }
    var regStr = " "+cls+"$";
    var reg = new RegExp(regStr);

    if(!reg.test(obj.className)) {//如果末尾本来就是有这个class就不用再加了
        obj.className += " "+cls;
    }
}

removeCls = function(obj, cls) {

    if(!obj) {
        return;
    }
    obj.className = obj.className.replace(" "+cls, "");
}

//Object.prototype.addCls = function(cls) {
//    var regStr = " "+cls+"$";
//    var reg = new RegExp(regStr);
//
//    if(!reg.test(this.className)) {//如果末尾本来就是有这个class就不用再加了
//        this.className += " "+cls;
//    }
//}
//Object.prototype.removeCls = function(cls) {
//    this.className = this.className.replace(" "+cls, "");
//}

function DatePicker() {

    this.namespace = _getUuid_();
}

DatePicker.prototype = {

    picker : "",
    config: {},
    selectYear: null,
    selectMonth: null,
    selectDay: null,

    /**
     * 初始化
     * @param c ：初始化的配置信息
     */
    init : function(c) {

        if(!c) {
            c = {};
        }

        this.config = c;
        var date = new Date();

        if(c.from) {
            c.yearFrom = c.from.getFullYear();
            c.monthFrom = c.from.getMonth()+1;
            c.dayFrom = c.from.getDate();
        }

        if(c.to) {
            c.yearTo = c.to.getFullYear();
            c.monthTo = c.to.getMonth()+1;
            c.dayTo = c.to.getDate();
        }

        this.selectYear = this.currentYear = c.year? c.year:date.getFullYear();//c.year||date.getFullYear()
        this.selectMonth = this.currentMonth = c.month? c.month:date.getMonth()+1;
        this.selectDay = this.currentDay = c.day? c.day:date.getDate();

        this.yearFrom = c.yearFrom?c.yearFrom:this.currentYear-15;
        this.yearTo = c.yearTo?c.yearTo:this.currentYear+15;
        this.monthFrom = c.monthFrom?c.monthFrom:1;
        this.monthTo = c.monthTo?c.monthTo:12;
        this.dayFrom = c.dayFrom?c.dayFrom:1;
        this.dayTo = c.dayTo?c.dayTo:28;

        this.valueFormat = c.valueFormat?c.valueFormat:'y-m-d';
        this.format = c.format?c.format:'ymd';
        var title = c.title? c.title:'请选择日期时间';

        this.valueField = c.valueField;

        if(c.valueField) {
            c.valueField.blur();
            c.valueField.readOnly = true;
            var regStr = this.valueFormat.replace("d", "(\\d+)").replace("y", "(\\d+)").replace("m", "(\\d+)");
            var reg = new RegExp(regStr);

            if(c.valueField.value) {//如果输入框本来有值就用输入框的值，否则就用当前值

                if(reg.test(c.valueField.value)) {
                    this.selectYear = this.currentYear = RegExp.$1? RegExp.$1:date.getFullYear();
                    this.selectMonth = this.currentMonth = RegExp.$2? RegExp.$2:date.getMonth()+1;
                    this.selectDay = this.currentDay = RegExp.$3? RegExp.$3:date.getDate();
                }
            }
        }

        this.labelField = c.labelField;

        if(c.labelField) {
            var regStr = this.valueFormat.replace("d", "(\\d+)").replace("y", "(\\d+)").replace("m", "(\\d+)");
            var reg = new RegExp(regStr);

            if(c.labelField.innerHTML) {//如果输入框本来有值就用输入框的值，否则就用当前值

                if(reg.test(c.labelField.innerHTML)) {
                    this.selectYear = this.currentYear = RegExp.$1? RegExp.$1:date.getFullYear();
                    this.selectMonth = this.currentMonth = RegExp.$2? RegExp.$2:date.getMonth()+1;
                    this.selectDay = this.currentDay = RegExp.$3? RegExp.$3:date.getDate();
                }
            }
        }

        this.value = c.value;

        if(c.value) {
            var regStr = this.valueFormat.replace("d", "(\\d+)").replace("y", "(\\d+)").replace("m", "(\\d+)");
            var reg = new RegExp(regStr);

            if(c.value) {//如果输入框本来有值就用输入框的值，否则就用当前值

                if(reg.test(c.value)) {
                    this.selectYear = this.currentYear = RegExp.$1? RegExp.$1:date.getFullYear();
                    this.selectMonth = this.currentMonth = RegExp.$2? RegExp.$2:date.getMonth()+1;
                    this.selectDay = this.currentDay = RegExp.$3? RegExp.$3:date.getDate();
                }
            }
        }

        this.yearTip = c.yearTip? c.yearTip:"-";
        this.monthTip = c.monthTip? c.monthTip:"-";
        this.dayTip = c.dayTip? c.dayTip:"";
        this.cancelText = c.cancelText? c.cancelText:'取消';
        this.okText = c.okText?c.okText:'确定';
        this.okFn = c.okFn? c.okFn:this.emptyFn;
        this.cancelFn = c.cancelFn? c.cancelFn:this.emptyFn;
        this.clickMaskFn = c.clickMaskFn? c.clickMaskFn:this.hide;

        this.needMask = (c.needMask==false|| c.needMask=='false')? c.needMask:true;
        this.autoDestroy = (c.autoDestroy==false|| c.autoDestroy=='false')? c.autoDestroy:true;
        /**
         * 可以通过样式的驼峰命名法同名来覆盖对应的样式
         */
        this.datePickerStyle = c.datePickerStyle? c.datePickerStyle:"";
        this.datePickerMaskStyle = c.datePickerMaskStyle? c.datePickerMaskStyle:"";
        this.datePickerBoxStyle = c.datePickerBoxStyle? c.datePickerBoxStyle:"";
        this.datePickerTitleStyle = c.datePickerTitleStyle? c.datePickerTitleStyle:"";
        this.datePickerPikboxStyle = c.datePickerPikboxStyle? c.datePickerPikboxStyle:"";
        this.datePickerYearBoxStyle = c.datePickerYearBoxStyle? c.datePickerYearBoxStyle:"";
        this.datePickerYearStyle = c.datePickerYearStyle? c.datePickerYearStyle:"";
        this.datePickerYearTipStyle = c.datePickerYearTipStyle? c.datePickerYearTipStyle:"";
        this.datePickerMonthBoxStyle = c.datePickerMonthBoxStyle? c.datePickerMonthBoxStyle:"";
        this.datePickerMonthStyle = c.datePickerMonthStyle? c.datePickerMonthStyle:"";
        this.datePickerMonthTipStyle = c.datePickerMonthTipStyle? c.datePickerMonthTipStyle:"";
        this.datePickerDayBoxStyle = c.datePickerDayBoxStyle? c.datePickerDayBoxStyle:"";
        this.datePickerDayStyle = c.datePickerDayStyle? c.datePickerDayStyle:"";
        this.datePickerDayTipStyle = c.datePickerDayTipStyle? c.datePickerDayTipStyle:"";
        this.datePickerBlueLine1Style = c.datePickerBlueLine1Style? c.datePickerBlueLine1Style:"";
        this.datePickerBlueLine2Style = c.datePickerBlueLine2Style? c.datePickerBlueLine2Style:"";
        this.datePickerFooterStyle = c.datePickerFooterStyle? c.datePickerFooterStyle:"";
        this.datePickerCancelBtnStyle = c.datePickerCancelBtnStyle? c.datePickerCancelBtnStyle:"";
        this.datePickerOkBtnStyle = c.datePickerOkBtnStyle? c.datePickerOkBtnStyle:"";

        this.buttonCouldClick = true;

        this.space = c.space? c.space:84;//默认没一个数字占的高度为84px

        this.picker = '<div _namespace_="'+this.namespace+'" class="date-picker" id="datePicker'+this.namespace+'" style="'+this.datePickerStyle+'">'+
            '<section _namespace_="'+this.namespace+'" class="date-picker-mask" id="datePickerMask'+this.namespace+'" onclick="datePicker.clickMask()" style="'+this.datePickerMaskStyle+'"></section>'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-box" style="'+this.datePickerBoxStyle+'">'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-title" style="'+this.datePickerTitleStyle+'">'+title+'</div>'+
            '<section _namespace_="'+this.namespace+'" class="date-picker-pikbox" style="'+this.datePickerPikboxStyle+'">'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-year-box" id="datePickerYearBox'+this.namespace+'" style="'+this.datePickerYearBoxStyle+'">'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-year" style="'+this.datePickerYearStyle+'">&nbsp;</div>';

        for(var year=this.yearFrom;year<=this.yearTo;year++) {
            this.picker +='<div _namespace_="'+this.namespace+'" class="date-picker-year" style="'+this.datePickerYearStyle+'">'+year+'</div>';
        }

        this.picker +='<div _namespace_="'+this.namespace+'" class="date-picker-year" style="'+this.datePickerYearStyle+'">&nbsp;</div>'+
            '</div>'+
            '<span _namespace_="'+this.namespace+'" class="date-picker-tip" id="datePickerYearTip'+this.namespace+'" style="'+this.datePickerYearTipStyle+'">'+this.yearTip+'</span>'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-month-box" id="datePickerMonthBox'+this.namespace+'" style="'+this.datePickerMonthBoxStyle+'">'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-month" style="'+this.datePickerMonthStyle+'">&nbsp;</div>';

        for(var month=1;month<=12;month++) {
            this.picker +='<div _namespace_="'+this.namespace+'" class="date-picker-month" style="'+this.datePickerMonthStyle+'">'+month+'</div>';
        }

        this.picker +='<div _namespace_="'+this.namespace+'" class="date-picker-month" style="'+this.datePickerMonthStyle+'">&nbsp;</div>'+
            '</div>'+
            '<span _namespace_="'+this.namespace+'" class="date-picker-tip" id="datePickerMonthTip'+this.namespace+'" style="'+this.datePickerMonthTipStyle+'">'+this.monthTip+'</span>'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-day-box" id="datePickerDayBox'+this.namespace+'" style="'+this.datePickerDayBoxStyle+'">'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-day" style="'+this.datePickerDayStyle+'">&nbsp;</div>';

        var isRunYear = this.isRunYear(this.currentYear);
        var runMonthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var days = isRunYear?runMonthDays:monthDays;
        this.DAYS = days;

        //var dayLen = days[this.currentMonth-1];//前面加了1
//console.log(days,this.currentMonth, dayLen);
        for(var day=1;day<=31;day++) {
            this.picker +='<div _namespace_="'+this.namespace+'" class="date-picker-day" style="'+this.datePickerMonthTipStyle+'">'+day+'</div>';
        }

        this.picker +='<div _namespace_="'+this.namespace+'" class="date-picker-day" style="'+this.datePickerMonthTipStyle+'">&nbsp;</div>'+
            '</div>'+
            '<span _namespace_="'+this.namespace+'" class="date-picker-tip" id="datePickerDayTip'+this.namespace+'" style="'+this.datePickerDayTipStyle+'">'+this.dayTip+'</span>'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-blue-line1" style="'+this.datePickerBlueLine1Style+'"></div>'+
            '<div _namespace_="'+this.namespace+'" class="date-picker-blue-line2" style="'+this.datePickerBlueLine2Style+'"></div>'+
            '</section>'+
            '<footer _namespace_="'+this.namespace+'" class="date-picker-footer" style="'+this.datePickerFooterStyle+'">'+
            '<button _namespace_="'+this.namespace+'" class="date-picker-cancelBtn" id="datePickerCancelBtn'+this.namespace+'" style="'+this.datePickerCancelBtnStyle+'">'+this.cancelText+'</button>'+
            '<button _namespace_="'+this.namespace+'" class="date-picker-okBtn" id="datePickerOkBtn'+this.namespace+'" style="'+this.datePickerOkBtnStyle+'">'+this.okText+'</button>'+
            '</footer>'+
            '</div>'+
            '</div>';
    },

    /**
     * 设置控件值
     * @param year：年
     * @param month：月
     * @param day：日
     */
    setValue: function(year, month, day) {

        //检查设置是否在范围内

        if(year<this.yearFrom) {
            this.destroy();
            throw new Error('日期不能小于最小范围');
        } else if(year>this.yearTo) {
            this.destroy();
            throw new Error('日期不能大于最大范围');
        }

        if(year == this.yearFrom) {

            if(month == this.monthFrom) {

                if(day < this.dayFrom) {
                    this.destroy();
                    throw new Error('日期不能小于最小范围');
                }
            } else if(this.selectMonth < this.monthFrom) {
                this.destroy();
                throw new Error('日期不能小于最小范围');
            }
        }

        if(this.selectYear == this.yearTo) {

            if(this.selectMonth == this.monthTo) {

                if(this.selectDay > this.dayTo) {
                    this.destroy();
                    throw new Error('日期不能大于最大范围');
                }
            } else if(this.selectMonth > this.monthTo) {
                this.destroy();
                throw new Error('日期不能大于最大范围');
            }
        }

        if(this.selectMonth==2) {

            if(!this.isRunYear(this.selectYear)) {

                if(this.selectDay >= 29) {//前面选择的是29号（闰年）
                    this.destroy();
                    throw new Error('平年二月为28天，你设置的值超过了28');
                }
            }
        } else if(this.selectMonth==4 || this.selectMonth==6
            || this.selectMonth==9 || this.selectMonth==11) { //小月

            if(this.selectDay == 31) {
                this.destroy();
                throw new Error('小月为30天，你设置的值超过了30');
            }
        }

        if(year) {
            this.scrollDate('Year', year);
            this.selectYear = this.currentYear = year;
        }

        if(month) {
            this.scrollDate('Month', month);
            this.selectMonth = this.currentMonth = month;
        }

        if(day) {
            this.scrollDate('Day', day);
            this.selectDay = this.currentDay = day;
        }
        this.render();
    },

    /**
     * 隐藏控件
     */
    hide: function() {

        var me = this;
        var thisElement = document.getElementById('datePicker'+this.namespace);

        clearInterval(this.yearInterval);
        clearInterval(this.monthInterval);
        clearInterval(this.dayInterval);

        if(!thisElement) {
            return;
        }

        setTimeout(function() {

            if(me.autoDestroy) {
                me.destroy();
                me.isHide = false;
            } else {
                me.isHide = true;
                thisElement.style.display = 'none';
            }
        }, 350);
    },

    /**
     * 通过读取配置信息显示日历控件
     * @param config 配置信息
     */
    show: function(config) {

        if(config) {
            this.init(config);
        }

        var me = this;

        if(!this.isHide) {
            var div = document.createElement('div');
            div.innerHTML = this.picker;
            document.body.appendChild(div);
        }

        var thisElement = document.getElementById('datePicker'+this.namespace);
        if(!thisElement) {
            this.init();
            this.show();
            return;
        }
        thisElement.style.display = 'block';

        var cancelBtn = document.getElementById("datePickerCancelBtn"+this.namespace);
        var okBtn = document.getElementById("datePickerOkBtn"+this.namespace);

        if(navigator.platform.toLowerCase() == "android" || navigator.platform.toLowerCase() == "iphone") {
            eventListener.handle("tap", this.cancel.bind(this));
            eventListener.handle("tap", this.ok.bind(this));
        } else {
            cancelBtn.addEventListener('click', this.cancel.bind(this));
            okBtn.addEventListener('click', this.ok.bind(this));
        }

        this.needMask && (document.getElementById('datePickerMask'+this.namespace).style.display = 'block');
        var scrolltop = this.getElementsByClassName("date-picker-year")[0].offsetTop;
        var scrolltop1 = this.getElementsByClassName("date-picker-year")[1].offsetTop;
        var space = scrolltop1 - scrolltop;
        this.space = space;

        //解决rem每次计算误差，导致元素高度不一致
        var yDs = this.getElementsByClassName("date-picker-year");
        var mDs = this.getElementsByClassName("date-picker-month");
        var dDs = this.getElementsByClassName("date-picker-day");

        for(var i=0;i<yDs.length;i++) {
            yDs[i].style.height = space + "px";
            //yDs[i].style.padding = space/7 + "px";
        }

        for(var i=0;i<mDs.length;i++) {
            mDs[i].style.height = space + "px";
            //mDs[i].style.padding = space/7 + "px";
        }

        for(var i=0;i<dDs.length;i++) {
            dDs[i].style.height = space + "px";
            //dDs[i].style.padding = space/7 + "px";
        }
        //end of 解决rem导致的页面元素高度不一致

        this.rest();//定位到当前日期

        this.addListeners();

        thisElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.cancelBubble = true;
            return false;
        });

        this.isHide = false;
    },

    addListeners: function() {

        var me = this;
        var space = this.space;
        var datePickerYearBox = document.getElementById('datePickerYearBox'+this.namespace);
        var datePickerMonthBox = document.getElementById('datePickerMonthBox'+this.namespace);
        var datePickerDayBox = document.getElementById('datePickerDayBox'+this.namespace);

        me.yearTouchendScrollTop = datePickerYearBox.scrollTop;
        me.MonthTouchendScrollTop = datePickerMonthBox.scrollTop;
        me.dayTouchendScrollTop = datePickerDayBox.scrollTop;

        var isYearOnScroll = false;
        var isMonthOnScroll = false;
        var isDayOnScroll = false;

        me.yearInterval = setInterval(function() {

            if(me.yearTouchendScrollTop == datePickerYearBox.scrollTop) {//滑动完成（过滤平时div没滚动的情况）

                if(isYearOnScroll) {
                    isYearOnScroll = false;//处理完成重置变量
                    var num = Math.round(datePickerYearBox.scrollTop/space);
                    datePickerYearBox.scrollTop = num * space;
                    me.checkLogic('year', num);
                    //clearInterval(me.yearInterval);
                    return;
                }
            } else {
                isYearOnScroll = true;
            }
            me.yearTouchendScrollTop = datePickerYearBox.scrollTop;
        }, 250);

        me.monthInterval = setInterval(function() {

            if(me.monthTouchendScrollTop == datePickerMonthBox.scrollTop) {

                if(isMonthOnScroll) {
                    isMonthOnScroll = false;
                    var num = Math.round(datePickerMonthBox.scrollTop/space);
                    datePickerMonthBox.scrollTop = num * space;
                    me.checkLogic('month', num);
                    //clearInterval(me.monthInterval);
                    return;
                }
            } else {
                isMonthOnScroll = true;
            }
            me.monthTouchendScrollTop = datePickerMonthBox.scrollTop;
        }, 250);

        me.dayInterval = setInterval(function() {

            if(me.dayTouchendScrollTop == datePickerDayBox.scrollTop) {

                if(isDayOnScroll) {
                    isDayOnScroll = false;
                    var num = Math.round(datePickerDayBox.scrollTop/space);
                    datePickerDayBox.scrollTop = num * space;
                    me.checkLogic('day', num);
                    //clearInterval(me.dayInterval);
                    return;
                }
            } else {
                isDayOnScroll = true;
            }
            me.dayTouchendScrollTop = datePickerDayBox.scrollTop;
        }, 250);
    },

    destroy: function () {

        var thisElement = document.getElementById('datePicker'+this.namespace);

        if(thisElement && thisElement.parentElement && thisElement.parentElement) {
            thisElement.parentElement.parentElement.removeChild(thisElement.parentElement);
        }
    },

    /**
     * 重置为当前日期
     */
    rest: function() {

        var space = this.space;
        var yearLen = this.currentYear-this.yearFrom;
        var monthLen = this.currentMonth-1;
        var dayLen = this.currentDay-1;

        var datePickerYearBox = document.getElementById('datePickerYearBox'+this.namespace);

        if(datePickerYearBox) {
            datePickerYearBox.scrollTop = yearLen * space;
        }

        var datePickerMonthBox = document.getElementById('datePickerMonthBox'+this.namespace);

        if(datePickerMonthBox) {
            datePickerMonthBox.scrollTop = monthLen * space;
        }

        var datePickerDayBox = document.getElementById('datePickerDayBox'+this.namespace);

        if(datePickerDayBox) {
            datePickerDayBox.scrollTop = dayLen * space;
        }

        if(datePickerYearBox) {
            this.render();
            this.formatDisplay();
        }
    },

    /**
     * 检查并处理日期范围逻辑
     * @param type : 类型： Year|Month|Day
     * @param index ：值
     */
    checkLogic: function(type, index) {

        switch(type) {

            case 'year':
                this.selectYearDiv = this.getElementsByClassName("date-picker-year")[index+1];

                if(this.selectYearDiv) {
                    this.selectYear = this.selectYearDiv.innerHTML;
                    this.dealOutOfRange();
                }
                break;

            case 'month':
                this.selectMonthDiv = this.getElementsByClassName("date-picker-month")[index+1];

                if(this.selectMonthDiv) {
                    this.selectMonth = this.selectMonthDiv.innerHTML;
                    this.dealOutOfRange();
                }
                break;

            case 'day':
                //第一个为空选项
                this.selectDayDiv = this.getElementsByClassName("date-picker-day")[index+1];

                if(this.selectDayDiv) {
                    this.selectDay = this.selectDayDiv.innerHTML;
                    this.dealOutOfRange();
                }
                break;
        }
        this.render();
    },

    /**
     * 处理日期超出范围的逻辑，将超出范围的日期纠正
     */
    dealOutOfRange: function() {

        //程序设置了开始年和结束年的，不用判断年份小于和大于临界值的情况
        if(this.selectYear == this.yearFrom) {

            if(this.selectMonth == this.monthFrom) {

                if(this.selectDay < this.dayFrom) {
                    this.scrollDate('Day', this.dayFrom);
                }
            } else if(this.selectMonth < this.monthFrom) {
                this.scrollDate('Month', this.monthFrom);

                if(this.selectDay < this.dayFrom) {
                    this.scrollDate('Day', this.dayFrom);
                }
            }
        }

        if(this.selectYear == this.yearTo) {

            if(this.selectMonth == this.monthTo) {

                if(this.selectDay > this.dayTo) {
                    this.scrollDate('Day', this.dayTo);
                }
            } else if(this.selectMonth > this.monthTo) {
                this.scrollDate('Month', this.monthTo);
            }
        }

        if(this.selectMonth==2) {

            if(!this.isRunYear(this.selectYear)) {

                if(this.selectDay > 28) {//前面选择的是29号（闰年）

                    this.scrollDate('Day', 28);
                }
            } else {
                if(this.selectDay > 29) {//前面选择的是29号（闰年）

                    this.scrollDate('Day', 29);
                }
            }
        } else if(this.selectMonth==4 || this.selectMonth==6
            || this.selectMonth==9 || this.selectMonth==11) { //小月

            if(this.selectDay == 31) {
                this.scrollDate('Day', 30);
            }
        }
    },

    getElementsByClassName: function(str) {

        var elems =document.getElementsByClassName(str);
        var result = [];

        for(var i=0;i<elems.length;i++) {
            var e = elems[i];

            if(e.attributes["_namespace_"].value == this.namespace) {
                result.push(e);
            }
        }
        return result;
    },

    /**
     * 判断指定年份是否为闰年
     * @param year 目标年份
     * @returns {boolean} 是否为闰年
     */
    isRunYear: function(year) {

        return (year%4 == 0 && year%100 != 0) || year%400 == 0;
    },

    /**
     * 空方法
     */
    emptyFn: function() {
        //empty
    },

    /**
     * 电脑控件ok类型按钮的响应事件回调方法
     */
    ok: function(e) {

        var okBtn = document.getElementById("datePickerOkBtn"+this.namespace);

        if(e.target != okBtn) {
            return;
        }

        if(this.format == 'y') {//只需要结果中的年的值
            this.valueField && (this.valueField.value = this.addZero(this.selectYear));
            this.labelField && (this.labelField.innerHTML = this.addZero(this.selectYear));

            if(this.okFn(this.addZero(this.selectYear)) != false) {
                this.hide();
            }
        }

        if(this.format == 'ym') {
            this.valueField && (this.valueField.value = (this.valueFormat.replace('y',this.addZero(this.selectYear))
                .replace('m', this.addZero(this.selectMonth))));
            this.labelField && (this.labelField.innerHTML = (this.valueFormat.replace('y',this.addZero(this.selectYear))
                .replace('m', this.addZero(this.selectMonth))));

            if(this.okFn(this.addZero(this.selectYear), this.addZero(this.selectMonth)) != false) {
                this.hide();
            }
        }

        if(this.format == 'ymd') {
            this.valueField && (this.valueField.value = (this.valueFormat.replace('y', this.addZero(this.selectYear))
                .replace('m', this.addZero(this.selectMonth)).replace('d', this.addZero(this.selectDay))));
            this.labelField && (this.labelField.innerHTML = (this.valueFormat.replace('y', this.addZero(this.selectYear))
                .replace('m', this.addZero(this.selectMonth)).replace('d', this.addZero(this.selectDay))));

            if(this.okFn(this.addZero(this.selectYear), this.addZero(this.selectMonth), this.addZero(this.selectDay)) != false) {//如果执行okFn返回的值为false则不执行hide方法
                this.hide();
            }
        }
    },

    /**
     * 点击cancel类型按钮的响应事件回调方法
     */
    cancel: function(e) {

        var cancelBtn = document.getElementById("datePickerCancelBtn"+this.namespace);

        if(e.target != cancelBtn) {
            return;
        }

        if(this.cancelFn() != false) {
            this.hide();
        }
    },

    /**
     * 点击遮罩的回调方法，如果没有则默认执行隐藏控件
     */
    clickMask: function() {

        this.clickMaskFn();
    },

    /**
     * 渲染日期值
     */
    render: function() {

        var yearDivs = this.getElementsByClassName("date-picker-year");
        var len = yearDivs.length;

        for(var i=0;i<len;i++) {

            if(this.selectYear == yearDivs[i].innerHTML) {
                addCls(yearDivs[i], 'date-picker-select');
            } else {
                removeCls(yearDivs[i], 'date-picker-select');
            }
        }

        if(this.format == 'y') {
            return;//只显示年
        }

        var monthDivs = this.getElementsByClassName("date-picker-month");
        var len = monthDivs.length;

        for(var i=0;i<len;i++) {

            if(parseInt(this.selectMonth) == parseInt(monthDivs[i].innerHTML)) {
                addCls(monthDivs[i], 'date-picker-select');
            } else {
                removeCls(monthDivs[i], 'date-picker-select');
            }
        }

        if(this.format == 'ym') {
            return;//只显示年月
        }

        var dayDivs = this.getElementsByClassName("date-picker-day");
        var len = dayDivs.length;

        for(var i=0;i<len;i++) {

            if(parseInt(this.selectDay) == parseInt(dayDivs[i].innerHTML)) {
                addCls(dayDivs[i], 'date-picker-select');
            } else {
                removeCls(dayDivs[i], 'date-picker-select');
            }
        }

        this.disableOutOfRangeDate();
    },

    /**
     * 通过配置调整显示年/年月/年月日的比例
     */
    formatDisplay: function() {

        if(this.format == 'ym') {//不显示天
            document.getElementById('datePickerDayBox'+this.namespace).style.display = 'none';
            document.getElementById('datePickerMonthBox'+this.namespace).style.width = '30%';
            document.getElementById('datePickerYearBox'+this.namespace).style.width = '30%';
            document.getElementById("datePickerDayTip"+this.namespace).style.display = 'none';
        }

        if(this.format == 'y') {
            document.getElementById('datePickerDayBox'+this.namespace).style.display = 'none';
            document.getElementById('datePickerMonthBox'+this.namespace).style.display = 'none';
            document.getElementById('datePickerYearBox'+this.namespace).style.width = '60%';
            document.getElementById("datePickerMonthTip"+this.namespace).style.display = 'none';
            document.getElementById("datePickerDayTip"+this.namespace).style.display = 'none';
        }
    },

    /**
     * 滚动控件使之选择为指定值
     * @param type 类型：Year|Month|Day
     * @param val 指定值
     */
    scrollDate: function(type, val) {
        var datePickerBox = document.getElementById('datePicker'+ type +'Box'+this.namespace);

        if(type == 'Year') {
            datePickerBox.scrollTop = (val - this.yearFrom) * this.space;//从0开始
        } else {
            datePickerBox.scrollTop = (val - 1) * this.space;//从0开始
        }

        eval('this.select'+type+'=val')
    },

    /**
     * 使在给定范围外的日期失效
     */
    disableOutOfRangeDate: function() {

        var disableElements = this.getElementsByClassName('date-picker-disable');
        var len = disableElements.length;

        for(var i=0;i<len;i++) {
            removeCls(disableElements[i], 'date-picker-disable');
        }

        if(this.selectYear == this.yearFrom) {

            for(var i=0;i<this.monthFrom;i++) {
                var disableMonthDiv = this.getElementsByClassName("date-picker-month")[i];//第一个是空的
                addCls(disableMonthDiv, 'date-picker-disable');
            }

            if(this.selectMonth == this.monthFrom) {

                for(var i=0;i<this.dayFrom;i++) {
                    var disableDayDiv = this.getElementsByClassName("date-picker-day")[i];//第一个是空的
                    addCls(disableDayDiv, 'date-picker-disable');
                }
            }
        } else if(this.selectYear == this.yearTo) {

            for(var i=this.monthTo;i<12;i++) {
                var disableMonthDiv = this.getElementsByClassName("date-picker-month")[i+1];//第一个是空的
                addCls(disableMonthDiv, 'date-picker-disable');
            }

            if(this.selectMonth == this.monthTo) {

                for(var i=this.dayTo;i<this.DAYS[this.selectMonth-1];i++) {
                    var disableDayDiv = this.getElementsByClassName("date-picker-day")[i+1];//第一个是空的
                    addCls(disableDayDiv, 'date-picker-disable');
                }
            }
        } else {//中间年份需要置灰不能选的日期，比如2月的31

            var isRunYear = this.isRunYear(this.selectYear);
            var runMonthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var days = isRunYear?runMonthDays:monthDays;

            for(var i=days[this.selectMonth-1];i<31;i++) {//最大最小的中间年份，每月的最大日到31都置灰
                var disableDayDiv = this.getElementsByClassName("date-picker-day")[i+1];//第一个是空的
                addCls(disableDayDiv, 'date-picker-disable');
            }
        }
    },

    getNameSpace: function() {

        return this.namespace;
    },

    addZero: function(num) {

        var num = parseInt(num);
        var result = "";

        if(num < 10) {
            result = "0" + num;
        } else {
            result = num;
        }
        return result;
    }
}

var datePicker = new DatePicker();
//
//function getObjTop(aTarget) {
//
//    var target = aTarget;
//    var top = target.scrollTop;
//    var target = target.parentElement;
//
//    while(target) {
//        top += target.scrollTop;
//        target = target.parentElement;
//    }
//    return top;
//}
