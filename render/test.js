/**
 * Created by kaidi on 14-12-11.
 */



function testRenderDepth(canvas, scene, camera, maxDepth) {

    var ctx = canvas.getContext("2d");

    var width = parseInt(canvas.getAttribute("width"));
    var height = parseInt(canvas.getAttribute("height"));

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    var imageData = ctx.getImageData(0, 0, width, height);
    var pixels = imageData.data;

    scene.initialize();
    camera.initialize();
    var i = 0;
    for (var y = 0; y < height; y++) {
        var sy = 1 - y / height;
        for (var x = 0; x < width; x++) {
            var sx = x / width;
            var ray = camera.generateRay(sx, sy);
            var result = scene.intersect(ray);
            if (result.geometry) {
                var depth = 255 - Math.min(
                        (result.distance / maxDepth) * 255,
                        255);
                pixels[i    ] = depth;
                pixels[i + 1] = depth;
                pixels[i + 2] = depth;
                pixels[i + 3] = 255;
            }
            i += 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function testRenderNormal(canvas, scene, camera, maxDepth) {

    var ctx = canvas.getContext("2d");

    var width = parseInt(canvas.getAttribute("width"));
    var height = parseInt(canvas.getAttribute("height"));

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    var imageData = ctx.getImageData(0, 0, width, height);
    var pixels = imageData.data;

    scene.initialize();
    camera.initialize();
    var i = 0;
    for (var y = 0; y < height; y++) {
        var sy = 1 - y / height;
        for (var x = 0; x < width; x++) {
            var sx = x / width;
            var ray = camera.generateRay(sx, sy);
            var result = scene.intersect(ray);
            if (result.geometry) {
                pixels[i    ] = (result.normal.x + 1) * 128;
                pixels[i + 1] = (result.normal.y + 1) * 128;
                pixels[i + 2] = (result.normal.z + 1) * 128;
                pixels[i + 3] = 255;
            }
            i += 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}











