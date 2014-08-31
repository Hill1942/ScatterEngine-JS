/**
 * @fileOverview
 * @author kaidi.ykd
 * @date 2014/8/31
 */


var remove_duplication = function(array) {
    var diffs = [];
    diffs.push(array[0]);
    for (var i = 1; i < array.length; i++) {
        for (var j = 0; j < diffs.length; j++) {
            if (array[i] == diffs[j]) {
                break;
            }
            if (j == diffs.length - 1) {
                diffs.push(array[i]);
            }
        }
    }
    return diffs;
};
