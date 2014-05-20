/**
 * Progressive slider widget extension for jQuery UI slider
 * Author: Petr Juna
 */

(function($) {

    $.widget("ui.progressiveSlider", $.ui.slider, {
        options : {
            min : 1000,
            max : 100000,
            position : 5000,
            increment : [1,2,5],
            visualSteps : false
        },

        /**
         * Constructor
         * @private
         */
        _create: function() {
            var that = this,
                length = that._getLength(),
                position,
                min = parseInt(that.options.min),
                location;


            var closest = that._closestVal(that._getValues(), that.options.position);
            // Get position of slider according to value
            if ( $.inArray( that.options.position, that._getValues() ) > -1 ) {
                for (var i = 0; i < that._getValues().length; i++) {
                    if (that._getValues()[i] == that.options.position) {
                        position = i;
                        break;
                    }
                }
            } else {
                position = closest;
            }

            this.element.slider({
                min : 0,
                max : length,
                value : position,
                slide : function(e, ui) {
                    that._slide(ui);
                    that._sliderSelection(ui.value);
                },
                stop : function(e, ui) {
                    that._stop(ui);
                }
            });

            this._customize();
            var trackWidth = (position / length * 100);
            this.element.find('.slider-selection').width(trackWidth + '%');
        },

        /**
         * Customize slider structure
         * @param ui
         * @private
         */

        _closestVal : function(a, x) {
            var lo = -1, hi = a.length;
            while (hi - lo > 1) {
                var mid = Math.round((lo + hi)/2);
                if (a[mid] <= x) {
                    lo = mid;
                } else {
                    hi = mid;
                }
            }
            if (a[lo] == x) hi = lo;
            if (lo < 0) lo = 0;
            return lo;
        },



        _setOption: function( key, value ) {
            var position
                , that = this;

            if ( key === "position" ) {
                var closest = that._closestVal(that._getValues(), value);
                if ( $.inArray( value, that._getValues() ) > -1 ) {
                    for (var i = 0; i < that._getValues().length; i++) {
                        if (that._getValues()[i] == value) {
                            position = i;
                            break;
                        }
                    }
                } else {
                    position = closest;
                }



                // console.log('ted ted ted ted ted');
                this.element.slider({
                    min : 0,
                    max : that._getLength(),
                    value : position,
                    slide : function(e, ui) {
                        that._slide(ui);
                        that._sliderSelection(ui.value);
                    },
                    stop : function(e, ui) {
                        that._stop(ui);
                    }
                });
                var trackWidth = (position / that._getLength() * 100);
                this.element.find('.slider-selection').width(trackWidth + '%');
            }

            this._super( key, value );
        },

        _setOptions: function( options ) {
            var that = this;
            $.each( options, function( key, value ) {
                that._setOption( key, value );
            });
        },

        /**
         * Customize slider structure
         * @param ui
         * @private
         */

        _customize : function() {
            this.element.addClass("slider");
            this.element.children().wrapAll("<div class='progressive-slider-track slider-track' />");
            this.element.children('.slider-track').prepend("<div class='progressive-slider-selection slider-selection' />");

            if (this.options.visualSteps) {
                this.element.children('.slider-track').append("<div class='progressive-slider-steps slider-steps' />");
                var steps = this._getValues();
                var width = this.element.width();
                var gap = width / (steps.length - 1);
                var gaps = 0;
                for (var i = 0; i < steps.length; i++) {
                    this.element.children('.slider-track').children('.slider-steps').append("<div class='progressive-slider-step slider-step' style='left:" + gaps + "px;' />");
                    gaps += gap;
                    console.log(gaps);
                }
            }

            this.element.find('.ui-slider-handle').addClass('progressive-slider-handle slider-handle');
        },

        _destroy : function() {
            this.element.slider('destroy');
        },

        _stop : function(ui) {
            var that = this;
            that._trigger('stop', null, {value : that._getValue(ui.value)});
        },

        _slide : function(ui) {
            var that = this;
            that._trigger('slide', null, {value : that._getValue(ui.value)});
        },

        _sliderSelection : function(value) {
            var that = this,
                length = that._getLength();
            var valPercent = value / length * 100;
            that.element.find('.slider-selection').width(valPercent + '%');
        },

        /**
         * Get value
         */
        _getValue : function(position) {
            var that = this,
                values = that._getValues();
            return values[position];
        },

        /**
         * Get value public
         * @returns {*}
         * @private
         */

        /**
         * Get whole array with inc min -> max extremes
         */

        _getValues : function() {
            var that = this;

            if (that.options.steps) {
                return eval(that.options.steps);
            } else {
                var minMaxArray = that._minToMaxArray(),
                    minMaxIncArray = that._minMaxIncArray(minMaxArray);
                return minMaxIncArray;
            }
        },

        /**
         * Prepend min to min -> max array
         * @private
         */

        _prependMin : function(arr) {
            var that = this,
                array = arr,
                min = parseInt(that.options.min);
            if (min < array[0]) array.unshift(min);
            return array;
        },

        /**
         * Append max to min -> max array
         * @private
         */

        _appendMax : function(arr) {
            var that = this,
                array = arr,
                max = parseInt(that.options.max);
            if (max > array[array.length - 1]) array.push(max);
            return array;
        },

        /**
         * Array from minimum to maximum that includes minimum and maximum
         * which doesn't have same mask as defined
         */

        _minMaxIncArray : function(arr) {
            var that = this,
                withMin = that._prependMin(arr),
                withMinMax = that._appendMax(withMin);
            return withMinMax;
        },

        /**
         * Get number of positions
         * @returns {Number|number}
         * @private
         */
        _getLength : function() {
            var that = this,
                length;
            length = that._getValues().length - 1;
            return length;
        },



        /**
         * _toMaxArray
         * @param total
         * @param regExp
         * @private
         */
        _toMaxArray : function() {
            var that = this;
            var min = parseInt(that.options.min);
            var list = eval(that.options.increment);
            // Dividers are array of dividers
            var dividers = [];
            // Variable with count of condition
            var condition = min;
            // Values are array of values
            var values = [];
            // Multiplier 1,10,100...
            var multiple = 1;
            var max = parseInt(that.options.max);
            // Starting value
            var current = 1;
            var reverse;
            // Iterate due condition is that.options.max
            while (condition < max) {
                // Creating list of increasion
                if ($.isArray(list)){

                    for (var i = 0; i < list.length; i++ ) {
                        if ((list.length - 1) == i) {
                            dividers.push(list[0] * multiple);
                        } else {
                            dividers.push(list[i + 1] / 10 * multiple);
                        }
                        condition = dividers[dividers.length - 1];
                        if ((list.length - 1) == i) {
                            reverse = list[0]*10*multiple;
                        } else {
                            reverse = (list[i+1])*multiple;
                        }

                        // Create list of values
                        while (current < reverse) {
                            if (current <= 5) {
                                current = Math.round(current * 10) / 10;
                            } else {
                                current = Math.round(current);
                            }
                            values.push(current);
                            current += condition;
                            if (current >= max) break;
                        }
                        if (current >= max) break;
                    }

                    multiple *= 10;
                    if (current > max) break;

                }else{

                    values.push(condition);
                    condition = parseInt(condition) + parseInt(list);
                }
            }
            return values;
        },

        /**
         *
         */

        _minToMaxArray : function() {
            var that = this,
                values = that._toMaxArray(),
                minimum = [],
                min = that.options.min;
            for (var i = 0; i < values.length; i++)
                if (values[i] >= min) minimum.push(values[i]);
            return minimum;
        }
    });

    $(document).ready(function() {
        $('.js-progressive-slider').progressiveSlider({
            position : 1000,
            steps : [500,600,700,800,900,1000,1200,1400,1600,1800,2000,2500,3000,3500],
            visualSteps : true
        });
    });

})(jQuery);

