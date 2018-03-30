/**
 * Created by qcrtrash on 2017/11/15.
 */
var mode = 0;
var type = 0;
$(document).ready(function () {
    //init
    analyse(mode, type);
    $('#home').click(function () {
        window.location.reload();
    });
    $('#scattermap').click(function () {
        type = 0;
        analyse(mode, type);
    });
    $('#densitymap').click(function () {
        type = 1;
        analyse(mode, type);
    });
    $('#PCA').click(function () {
        mode = 0;
        analyse(mode, type);
        $('#dropdownMenu').html('PCA<span class="caret"></span>');
    });
    $('#TSNE').click(function () {
        mode = 1;
        analyse(mode, type);
        $('#dropdownMenu').html('TSNE<span class="caret"></span>');
    });
    $('#ISOMAP').click(function () {
        mode = 2;
        analyse(mode, type);
        $('#dropdownMenu').html('ISOMAP<span class="caret"></span>');
    });
    $('#RTE').click(function () {
        mode = 3;
        analyse(mode, type);
        $('#dropdownMenu').html('RTE<span class="caret"></span>');
    });
});

var analyse = function (mode, type) {
    $.getJSON('/ajax_init/', {'mode': mode, 'type': type}, function () {
        if(type == 0) {
            d3.select("svg").selectAll('g').remove();
            scatter();
        }
        else {
            d3.select("svg").selectAll('g').remove();
            density();
        }
    });
};