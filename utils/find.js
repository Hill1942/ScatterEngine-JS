/**
 * @fileOverview
 * @author kaidi.ykd
 * @date 2014/8/31
 */

var b_search = function(array, start, end, key) {
    if (start > end) {
        return -1;
    }
    var center = Math.floor((start + end) / 2);
    if (key == array[center]) {
        return center;
    } else if (key < array[center]) {
        return b_search(array, start, center - 1, key);
    } else {
        return b_search(array, center + 1, end, key)
    }
};

var b_search_no_recursion = function(array, key) {
    var start = 0;
    var end = array.length - 1;
    while (start <= end) {
        var center = Math.floor((start + end) / 2);
        if (key == array[center]) {
            return center;
        } else if (key < array[center]) {
            end = center - 1;
        } else {
            start = center + 1;
        }
    }
    return -1;
};




