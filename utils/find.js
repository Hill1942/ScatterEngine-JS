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

var find_most_word = function(str) {
    var words = str.split(/\s+/);
    var diff_words = [];

    diff_words.push({
        word: words[0],
        num:  1
    });

    for (var i = 1; i < words.length; i++) {
        for (var j = 0; j < diff_words.length; j++) {
            if (words[i] == diff_words[j].word) {
                diff_words[j].num++;
                break;
            }
            if (j == diff_words.length - 1) {
                diff_words.push({
                    word: words[i],
                    num: 1
                });
            }
        }
    }
    var target = diff_words[0];
    for (var k = 1; k < diff_words.length; k++) {
        if (diff_words[k].num > target.num) {
            target = diff_words[k];
        }
    }
    return target.word;
};

var str = "yang kai kai kai di di di di test test test test test haha haha";
console.log(find_most_word(str));








