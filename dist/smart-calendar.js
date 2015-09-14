angular.module('smartCalendar', [])
    .factory('smartCalendarHandler', function () {
        function SmartCalendarHandler(options) {
            var config = angular.merge({
                localization: {
                    words: {
                        month: 'Месяц',
                        day: 'День'
                    },
                    months: [
                        {
                            name: 'Январь',
                            shortName: 'янв'
                        },
                        {
                            name: 'Февраль',
                            shortName: 'фев'
                        },
                        {
                            name: 'Март',
                            shortName: 'мар'
                        },
                        {
                            name: 'Апрель',
                            shortName: 'апр'
                        },
                        {
                            name: 'Май',
                            shortName: 'май'
                        },
                        {
                            name: 'Июнь',
                            shortName: 'июн'
                        },
                        {
                            name: 'Июль',
                            shortName: 'июл'
                        },
                        {
                            name: 'Август',
                            shortName: 'авг'
                        },
                        {
                            name: 'Сентябрь',
                            shortName: 'сен'
                        },
                        {
                            name: 'Октябрь',
                            shortName: 'окт'
                        },
                        {
                            name: 'Ноябрь',
                            shortName: 'ноя'
                        },
                        {
                            name: 'Декабрь',
                            shortName: 'дек'
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
                            isToday: false,
                            date: prevDate
                        })
                    }
                    for (i = 1; i <= countDays; i++) {
                        days.push({
                            number: i,
                            currentMonth: true,
                            isToday: (function () {
                                var date = self.createDate();
                                return ((date.getFullYear() == year) && (date.getMonth() == month) && (date.getDate() == i))
                            })(),
                            date: self.createDate(this.year, this.month, i)
                        });
                    }
                    var endWeekday = self.createDate(this.year, this.month, countDays).getDay();
                    var countNextDays = ((7 - endWeekday) < 7) ? (7 - endWeekday) : 0;
                    for (i = 0; i < countNextDays; i++) {
                        days.push({
                            number: i + 1,
                            currentMonth: false,
                            isToday: false,
                            date: self.createDate(this.year, (this.month + 1), i + 1)
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

            this.getMonthName = function (date) {
                return config.localization.months[date.getMonth()].name;
            };

            this.getMonthShortName = function (date) {
                return config.localization.months[date.getMonth()].shortName;
            };

            this.getWeekdayName = function(date) {
                var weekday = ((date.getDay() < 1) ? 6 : date.getDay() - 1);
                return config.localization.days[weekday];
            };

            this.getLocalization = function () {
                return config.localization
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
                <div class="smart-calendar-header">\
                    <div class="smart-calendar-group-button">\
                        <div ng-click="setPrev()" class="smart-calendar-button">\
                            <div class="smart-calendar-icon-prev"></div>\
                            <span ng-bind="getButtonPrevText()"></span>\
                        </div>\
                        <div ng-click="setNext()" class="smart-calendar-button">\
                            <span ng-bind="getButtonNextText()"></span>\
                            <div class="smart-calendar-icon-next"></div>\
                        </div>\
                    </div>\
                    <span ng-bind="getHeaderText()"></span>\
                    <div class="smart-calendar-group-button smart-calendar-floating-right">\
                        <div ng-class="{\'smart-calendar-active-button\': !isShowDayWrap}" ng-click="isShowDayWrap = false" ng-bind="handler.getLocalization().words.month" class="smart-calendar-button"></div>\
                        <div ng-class="{\'smart-calendar-active-button\': isShowDayWrap}" ng-click="isShowDayWrap = true" ng-bind="handler.getLocalization().words.day" class="smart-calendar-button"></div>\
                    </div>\
                </div>\
                <div ng-hide="isShowDayWrap">\
                    <div class="smart-calendar-weekdays">\
                        <div class="smart-calendar-weekday" ng-bind="weekday" ng-repeat="weekday in handler.getLocalization().days"></div>\
                    </div>\
                    <div class="smart-calendar-month-wrap">\
                        <div ng-repeat="day in handler.calendarMonth.days"\
                             ng-click="setActiveDay(day.date)"\
                             ng-class="{\'smart-calendar-month-no-current-month\': !day.currentMonth, \'smart-calendar-month-today\': day.isToday}"\
                             class="smart-calendar-month-day">\
                                <span ng-bind="day.number"></span>\
                        </div>\
                    </div>\
                </div>\
                <div ng-show="isShowDayWrap" class="smart-calendar-day-wrap">\
                    <ul>\
                        <li>\
                            <span class="smart-calendar-event-time"></span>\
                            <span class="smart-calendar-event-name"></span>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
            ',
            controller: function ($scope) {
                $scope.isShowDayWrap = false;

                $scope.getButtonPrevText = function () {
                    var activeDate = $scope.handler.getActiveDate();
                    var prevDate;
                    if ($scope.isShowDayWrap) {
                        prevDate = $scope.handler.createDate(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate() - 1);
                        return prevDate.getDate() + ' ' + $scope.handler.getMonthShortName(prevDate);
                    } else {
                        prevDate = $scope.handler.createDate(activeDate.getFullYear(), activeDate.getMonth() - 1);
                        return $scope.handler.getMonthName(prevDate);
                    }

                };

                $scope.getButtonNextText = function () {
                    var activeDate = $scope.handler.getActiveDate();
                    var nextDate;
                    if ($scope.isShowDayWrap) {
                        nextDate = $scope.handler.createDate(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate() + 1);
                        return nextDate.getDate() + ' ' + $scope.handler.getMonthShortName(nextDate);
                    } else {
                        nextDate = $scope.handler.createDate(activeDate.getFullYear(), activeDate.getMonth() + 1);
                        return $scope.handler.getMonthName(nextDate);
                    }
                };

                $scope.getHeaderText = function () {
                    var activeDate = $scope.handler.getActiveDate();
                    if ($scope.isShowDayWrap) {
                        return $scope.handler.getWeekdayName(activeDate) +
                            ', ' + activeDate.getDate() +
                            ' ' + $scope.handler.getMonthShortName(activeDate) +
                            ' ' + activeDate.getFullYear();
                    } else {
                        return $scope.handler.getMonthName(activeDate) + ' ' + activeDate.getFullYear();
                    }
                };

                $scope.setPrev = function () {
                    var activeDate = $scope.handler.getActiveDate();
                    if ($scope.isShowDayWrap) {
                        activeDate.setDate(activeDate.getDate() - 1)
                    } else {
                        activeDate.setDate(1);
                        activeDate.setMonth(activeDate.getMonth() - 1);
                    }
                    $scope.handler.setActiveDate(activeDate);
                };

                $scope.setNext = function () {
                    var activeDate = $scope.handler.getActiveDate();
                    if ($scope.isShowDayWrap) {
                        activeDate.setDate(activeDate.getDate() + 1)
                    } else {
                        activeDate.setDate(1);
                        activeDate.setMonth(activeDate.getMonth() + 1);
                    }
                    $scope.handler.setActiveDate(activeDate);
                };

                $scope.setActiveDay = function (date) {
                    $scope.handler.setActiveDate(date);
                    $scope.isShowDayWrap = true;
                };
            }
        }
    });