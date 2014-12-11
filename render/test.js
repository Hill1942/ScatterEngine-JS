/**
 * Created by kaidi on 14-12-11.
 */

var canvas = document.getElementById("testCanvas");

var ctx = canvas.getContext("2d");

var width = parseInt(canvas.getAttribute("width"));
var height = parseInt(canvas.getAttribute("height"));

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, width, height);

var imageData = ctx.getImageData(0, 0, width, height);
var pixels = imageData.data;

var i = 0;
for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
        pixels[i++] = x / width * 255;
        pixels[i++] = y / height * 255;
        pixels[i++] = 0;
        pixels[i++] = 128;
    }
}
ctx.putImageData(imageData, 0, 0);


