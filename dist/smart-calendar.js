angular.module('smartCalendar', [])
    .factory('smartCalendarHandler', function () {
        function SmartCalendarHandler(options) {
            var config = angular.merge({
                localization: {
                    months: [
                        {
                            name: 'Январь',
                            shortName: 'Янв'
                        },
                        {
                            name: 'Февраль',
                            shortName: 'Фев'
                        },
                        {
                            name: 'Март',
                            shortName: 'Мар'
                        },
                        {
                            name: 'Апрель',
                            shortName: 'Апр'
                        },
                        {
                            name: 'Май',
                            shortName: 'Май'
                        },
                        {
                            name: 'Июнь',
                            shortName: 'Июн'
                        },
                        {
                            name: 'Июль',
                            shortName: 'Июл'
                        },
                        {
                            name: 'Август',
                            shortName: 'Авг'
                        },
                        {
                            name: 'Сентябрь',
                            shortName: 'Сен'
                        },
                        {
                            name: 'Октябрь',
                            shortName: 'Окт'
                        },
                        {
                            name: 'Ноябрь',
                            shortName: 'Ноя'
                        },
                        {
                            name: 'Декабрь',
                            shortName: 'Дек'
                        }
                    ],
                    days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                }
            }, options);
            var self = this;
            var activeDate = null;

            this.createDate = function (year, month, day, hours, minutes, seconds, milliseconds) {
                var date = new Date();
                var setters = ['setFullYear', 'setMonth', 'setDate', 'setHours', 'setMinutes', 'setSeconds', 'setMilliseconds'];
                for (var i = 0; i <= 6; i++) {
                    if (arguments.length > i) {
                        date[setters[i]](arguments[i]);
                    }
                }
                return date;
            };

            this.calendarMonth = {
                calc: function (year, month) {
                    this.year = year;
                    this.month = month;

                    var countDays = self.createDate(this.year, this.month + 1, 0).getDate();
                    var startWeekday = self.createDate(this.year, this.month, 1).getDay();
                    var countPrevDays = ((startWeekday - 1) >= 0) ? (startWeekday - 1) : 6;
                    var days = [];
                    for (var i = 0; i < countPrevDays; i++) {
                        var prevDate = self.createDate(this.year, this.month + 1, ((countDays + (countPrevDays - i) - 1) * -1));
                        days.push({
                            number: prevDate.getDate(),
                            currentMonth: false,
                            active: false,
                            dayMonth: prevDate.getMonth(),
                            dayYear: prevDate.getFullYear()
                        })
                    }
                    for (i = 1; i <= countDays; i++) {
                        days.push({
                            number: i,
                            currentMonth: true,
                            active: false,
                            dayMonth: this.month,
                            dayYear: this.year,
                            isToday: (function () {
                                var date = self.createDate();
                                return ((date.getFullYear() == year) && (date.getMonth() == month) && (date.getDate() == i))
                            })()
                        });
                    }
                    var endWeekday = self.createDate(this.year, this.month, countDays).getDay();
                    var countNextDays = ((7 - endWeekday) < 7) ? (7 - endWeekday) : 0;
                    for (i = 0; i < countNextDays; i++) {
                        var nextDate = self.createDate(this.year, (this.month + 1), 1);
                        days.push({
                            number: i + 1,
                            currentMonth: false,
                            active: false,
                            dayMonth: nextDate.getMonth(),
                            dayYear: nextDate.getFullYear()
                        })
                    }
                    this.days = days;
                }
            };

            this.setActiveDate = function (date) {
                activeDate = date;
                this.calendarMonth.calc(date.getFullYear(), date.getMonth())
            };

            this.setActiveDate(this.createDate());

            this.getActiveDate = function () {
                return activeDate;
            };

            this.getMonthName = function(date) {
                return config.localization.months[date.getMonth()].name;
            };

            this.getWeekdays = function () {
                return config.localization.days
            }
        }

        return function (options) {
            return new SmartCalendarHandler(options)
        }
    })
    .directive('smartCalendar', function () {
        return {
            restrict: 'E',
            scope: {
                handler: '='
            },
            template: '\
            <div class="smart-calendar">\
                <h4>{{ handler.getMonthName(handler.createDate(handler.calendarMonth.year, handler.calendarMonth.month)) }} {{ handler.calendarMonth.year }}</h4>\
                <div class="smart-calendar-weekdays">\
                    <div class="smart-calendar-weekday" ng-bind="weekday" ng-repeat="weekday in handler.getWeekdays()"></div>\
                </div>\
                <div class="smart-calendar-wrap">\
                    <div ng-repeat="day in handler.calendarMonth.days"\
                         ng-click="setActiveDay(day)"\
                         ng-class="{\'smart-calendar-month-no-current-month\': !day.currentMonth, \'smart-calendar-month-today\': day.isToday}"\
                         class="smart-calendar-month-day">\
                            <span ng-bind="day.number"></span>\
                    </div>\
                </div>\
            </div>\
            ',
            controller: function ($scope) {

            }
        }
    });