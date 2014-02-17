/**
 * Progressive slider widget extension for jQuery UI slider
 * By: Petr Juna, Daniel Jankovic
 */

(function($) {

    $.widget("ui.progressiveSlider", $.ui.slider, {
        options : {
            min : 0,
            max : 100000,
            position : 5000
        },

        /**
         * Constructor
         * @private
         */
        _create: function() {
            var that = this,
                length = that._getLength(),
                position,
                min = that.options.min;

            // Get position of slider according to value
            if ( $.inArray( that.options.position, that._getValues() ) > -1 ) {
                for (var i = 0; i < that._getValues().length; i++) {
                    if (that._getValues()[i] == that.options.position) {
                        position = i;
                        break;
                    }
                }
            } else {
                console.log('Position: ' + that.options.position + ' is not known. Please use position value from array: ' + that._getValues());
            }

            this.element.slider({
                min : 0,
                max : length-1,
                value : position,
                slide : function(e, ui) {
                    that._trigger('slide', null, {value : that._getValue(ui.value)});
                    //console.log());
                }
            });
        },

//        slide : function() {
//
//        },

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
            var that = this,
                minMaxArray = that._minToMaxArray(),
                minMaxIncArray = that._minMaxIncArray(minMaxArray);
            return minMaxIncArray;
        },

        /**
         * Prepend min to min -> max array
         * @private
         */

        _prependMin : function(arr) {
            var that = this,
                array = arr,
                min = that.options.min;
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
                max = that.options.max;
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
            length = that._getValues().length;
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
            var min = that.options.min;
            var list = [1,2,5]; //TODO: Do this customisable
            // Dividers are array of dividers
            var dividers = [];
            // Variable with count of condition
            var condition = min;
            // Values are array of values
            var values = [];
            // Multiplier 1,10,100...
            var multiple = 1;
            var max = that.options.max;
            // Starting value
            var current = 1;
            var reverse;
            // Iterate due condition is that.options.max
            while (condition < that.options.max) {
                // Creating list of increasion
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
        $('.js-progressive-slider').progressiveSlider({slide : function(e, ui) {
            console.log('hello this is hte call of slider and sliding :' + ui.value)
        }});
    });

})(jQuery);

