// Copyright (c) 2014 Lei(http://www.leiswork.com). All rights reserved.

/**
 * Convert two different currency based on a real time currency rate
 * @author Lei
 */
"use strict";

var MoneyChanger = (function($) {

    /**
     * The default config
     */
    var config = {
        myCurrencyId: 'myCurrency',
        targetCurrencyId: 'targetCurrency',
        remoteSource: 'freecurrencyconverterapi.com',
        rightArrowButton: 'rightArrowButton',
        leftArrowButton: 'leftArrowButton',
        defaultCurrency: 'CNY',
        defaultTargetCurrency:'USD'
    };

    /**
     * We might have diffrent configs when this module init
     */
    function mergeConfig(config, initConfig) {
        console.log(config);
        for(var k in config) {
            if(initConfig[k] !== config[k] && (typeof initConfig[k] !== 'undefined')) {
                config[k] =  initConfig[k];
            }
        }
        console.log(config);
    }

    var RateQueryer = function() {
        var This = this;
        /**
         * The currrecy types that current source supported
         * Array 
         */
        this.types = null;
        this.requestUrl = '';
        
        this.setTypes = function(types) {
            This.types = types;
        };

        this.queryRate = function(url, data, dataType, handler) {
            this.request('GET', url, data, dataType, handler);
        };

        this.request = function(method, url, data, dataType, handler) {
            if(typeof data === 'undefined') {
               data = null;
            }

            $.ajax({
                type: method,
                url: url,
                dataType: dataType,
                data: data,
                crossDomain: true,
                beforeSend: function() {
                    console.log('before send...');
                },
                success: handler,
                error: function(jqXhr, textStatus, errorThrown) {
                    if(textStatus) {
                        // "timeout", "error", "abort", and "parsererror"
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                },
                complete: function() {
                    console.log('complete...');
                }
            });
        };
    };

    /**
     * Oject extends from RateQueryer
     */
    var FreeCCRateQueryer = function() {
        RateQueryer.call(this);
        var This = this;
        
        this.makeRequestUrl = function(myType, targetType) {
            return 'http://www.freecurrencyconverterapi.com/api/v2/convert?q=' + myType + '_' + targetType + '&compact=y';
        };

        this.setSupportedTypes = function() {
            This.setTypes(types);
        };
    };

    var YahooRateQueryer = function() {
        RateQueryer.call(this);
        var This = this;
        this.makeRequestUrl = function(myType, targetType) {
            return 'http://www.freecurrencyconverterapi.com/api/v2/convert?q=' + myType + '_' + targetType + '&compact=y';
        };

        this.setSupportedTypes = function() {
            var types = currenies;
            console.log(types);
            This.setTypes(types);
        };
    }

    /**
     * The Currency constractor for currency object
     */
    var Currency = function(type) {
        this.type = type || '';
        this.amount = 0;

        this.setAmount = function(amount) {
            this.amount = amount;
        };

        this.convert = function(targetType) {
            console.log(this.amount);
            console.log(targetType);
            var queryer = rater.rateQueryer;
            var url = queryer.makeRequestUrl(this.type, targetType);
            console.log(url);
            queryer.queryRate(url, null, 'json', handler);
            function handler(result) {
                alert(result);
            }
        };
    };

    var rater = {
        myCurrency: null,
        targetCurrency: null,
        rateQueryer: null,

        init: function(initConfig) {
            if(typeof initConfig === 'object') {
                mergeConfig(config, initConfig);
            }

            this.myCurrency = new Currency(config['defaultCurrency']);
            console.log(this.myCurrency.type);
            this.targetCurrency = new Currency(config['defaultTargetCurrency']);
            console.log(this.targetCurrency.type);

            this.rateQueryer = this.getRateQueryer();
            this.rateQueryer.setSupportedTypes();
            this.setCurrency(config['myCurrencyId'], config['defaultCurrency']);
            this.setCurrency(config['targetCurrencyId'], config['defaultTargetCurrency']);
            this.events();
        },

        updateConfig: function(newConfig) {
            config = newConfig;
        },

        events: function() {
            var This = this;
            $('#' + config['rightArrowButton']).click(function(e) {
                e.preventDefault();
                var targetType = $('#' + config['targetCurrencyId']).find('select').val();
                This.myCurrency.setAmount($('#'+config['myCurrencyId']).find('input').val());
                This.myCurrency.convert(targetType);
            });

            $('#' + config['leftArrowButton']).click(function(e) {
                e.preventDefault();
                var type = $('#' + config['myCurrencyId']).find('select').val();
                This.targetCurrency.setAmount($('#'+config['targetCurrencyId']).find('input').val());
                This.targetCurrency.convert(type);
            });
        },

        getRateQueryer: function() {
            switch(config['remoteSource']) {
                case 'freecurrencyconverterapi.com': 
                return new FreeCCRateQueryer;
                break;
                case 'yahoo': 
                return new YahooRateQueryer;
                break;
                default: 
                    throw new Error('Invalid remote query source:' + config['remoteSource']);
            }
        },

        /**
         * @parmas currencyId String currency html area id, this area including select option and input
         */
        setCurrency: function(currencyId, type, amount) {
            var currencyOptions = '';
            var type = type || '';
            for(var currency in this.rateQueryer.types) {
                currencyOptions += '<option' + (type == currency ? ' selected':'') + ' value="' + currency + '">' + currency + '(' + this.rateQueryer.types[currency] + ')</option>' + "\n";
            }
            var area = $('#' + currencyId);
            area.find('select').html(currencyOptions);
            if(typeof amount !== 'undefined') {
                area.find('input').val(amount);
            }
        }
    };

    return rater;

})(jQuery);


