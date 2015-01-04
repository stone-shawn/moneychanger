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
        this.types = [];
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
            
            /*
              Just want to get from remote before, but some wrong with chrome when request this url.

            var url = 'http://www.freecurrencyconverterapi.com/api/v2/currencies';
            var handler = function(result) {
                // console.log(results);
            };
            this.request('GET', url, null, 'json', handler);
            */
            var types = ['BBD', 'BND', 'HUF', 'JMD', 'FKP', 'MKD', 'NZD', 'WST', 'BTN', 'CUC', 'ALL',
            'GIP', 'AUD', 'PGK', 'AMD', 'CVE', 'TZS', 'BAM', 'LYD', 'RWF', 'SEK', 'OMR', 'RSD', 'LAK', 
            'BSD', 'CNY', 'CRC', 'GEL', 'ERN', 'INR', 'LTL', 'ANG', 'SYP', 'BWP', 'DKK', 'GTQ', 'KWD', 
            'MNT', 'CZK', 'KRW', 'PEN', 'SOS', 'BHD', 'COP', 'HTG', 'LBP', 'MZM', 'QAR', 'BZD', 'KZT', 
            'MUR', 'JOD', 'MRO', 'SLL', 'AWG', 'KYD', 'EEK', 'IDR', 'MWK', 'EUR', 'XPF', 'IRR', 'ILS', 
            'MYR', 'NGN', 'STD', 'AOA', 'BIF', 'HNL', 'LSL', 'MMK', 'PAB', 'PHP', 'ZAR', 'SAR', 'SGD', 
            'RON', 'SRD', 'TWD', 'TOP', 'ARS', 'AZN', 'BYR', 'VEB', 'DZD', 'BGN', 'BOB', 'CAD', 'CLP', 
            'CDF', 'DOP', 'GQE', 'FJD', 'GMD', 'GYD', 'ISK', 'JPY', 'IQD', 'KPW', 'LVL', 'CHF', 'MGA', 
            'MDL', 'MAD', 'NPR', 'NIO', 'PKR', 'PYG', 'SHP', 'SCR', 'SBD', 'LKR', 'TRY', 'THB', 'AED', 
            'VUV', 'YER', 'BDT', 'AFN', 'HRK', 'ETB', 'KMF', 'BRL', 'MVR', 'NOK', 'TTD', 'KHR', 'EGP', 
            'HKD', 'LRD', 'NAD', 'RUB', 'SZL', 'DJF', 'GNF', 'KGS', 'PLN', 'UYU', 'VND', 'GHS', 'KES', 
            'MXN', 'SKK', 'UGX', 'UZS', 'ZMK', 'XDR', 'MOP', 'TJS', 'TND', 'TMM', 'UAH', 'GBP', 'XOF', 
            'XAF', 'USD', 'XCD', 'SDG'];
            This.setTypes(types);
        };
    };


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
            for(var i = 0; i < this.rateQueryer.types.length; i++) {
                currencyOptions += '<option' + (type == this.rateQueryer.types[i] ? ' selected':'') + ' value="' + this.rateQueryer.types[i] + '">' + this.rateQueryer.types[i] + '</option>' + "\n";
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


