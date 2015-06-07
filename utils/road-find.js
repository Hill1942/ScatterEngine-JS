/**
 * @fileOverview
 * @author kaidi.ykd
 * @date 2014/8/26
 */

(function () {
    var mapGrid = document.getElementById("map");

    var astarBtn = document.getElementById("astar");
    var bfsBtn = document.getElementById("bfs");
    var dfsBtn = document.getElementById("dfs");

    var setStartBtn = document.getElementById("setStartBtn");
    var setObstacleBtn = document.getElementById("setObstacleBtn");
    var setEndBtn = document.getElementById("setEndBtn");

    var speedText = document.getElementById("speedText");
    var startBtn = document.getElementById("startBtn");
    var resetBtn = document.getElementById("resetBtn");

    var methodID = 0;  // a star
    var gridType = 0;  // origin point

    var startPoint = {
        x: 0,
        y: 0,
        p: null,
        g_value: 0
    };
    var endPoint = {
        x: 0,
        y: 0
    };
    var obstacles = [];
    var openTable = [];
    var closeTable = [];

    function getRoundPoints(x, y) {
        var array = new Array();
        array.push({ x: x - 1, y: y - 1 });
        array.push({ x: x    , y: y - 1 });
        array.push({ x: x + 1, y: y - 1 });
        array.push({ x: x - 1, y: y });
        array.push({ x: x + 1, y: y });
        array.push({ x: x - 1, y: y + 1 });
        array.push({ x: x    , y: y + 1 });
        array.push({ x: x + 1, y: y + 1 });

        return array;
    }

    function isInOpenTable(x, y) {
        for (var i = 0; i < openTable.length; i++) {
            if (openTable[i].x == x &&
                openTable[i].y == y) {
                return true;
            }
        }
        return false;
    }

    function isInCloseTable(x, y) {
        for (var i = 0; i < closeTable.length; i++) {
            if (closeTable[i].x == x &&
                closeTable[i].y == y) {
                return true;
            }
        }
        return false;
    }

    function isInObstacles(x, y) {
        for (var i = 0; i < obstacles.length; i++) {
            if (obstacles[i].x == x &&
                obstacles[i].y == y) {
                return true;
            }
        }
        return false;
    }

    function gridClicker(x, y) {
        switch (gridType) {
            case 0:
                mapGrid.rows[y].cells[x].style.backgroundColor = "#ff0000";
                startPoint.x = x;
                startPoint.y = y;
                break;
            case 1:
                mapGrid.rows[y].cells[x].style.backgroundColor = "#999999";
                
                break;
            case 2:
                mapGrid.rows[y].cells[x].style.backgroundColor = "#0000ff";
                endPoint.x = x; 
                endPoint.y = y;
                break;
        }
    }

    function methodBtnClicker() {
        astarBtn.style.backgroundColor = "#FF6565";
        bfsBtn.style.backgroundColor = "#FF6565";
        dfsBtn.style.backgroundColor = "#FF6565";
        this.style.backgroundColor = "#00E56B";
        switch (this.id) {
            case "astar":
                methodID = 0;
                break;
            case "bfs":
                methodID = 1;
                break;
            case "dfs":
                methodID = 2;
                break;
        }
    }

    function setGridBtnClicker() {
        setStartBtn.style.backgroundColor = "#FF6565";
        setObstacleBtn.style.backgroundColor = "#FF6565";
        setEndBtn.style.backgroundColor = "#FF6565";
        this.style.backgroundColor = "#00E56B";
        switch (this.id) {
            case "setStartBtn":
                gridType = 0;
                break;
            case "setObstacleBtn":
                gridType = 1;
                break;
            case "setEndBtn":
                gridType = 2;
                break;
        }
    }

    function getParentGrid(x, y) {
        for (var i = 0; i < closeTable.length; i++) {
            if (closeTable[i].x == x &&
                closeTable[i].y == y) {
                return closeTable[i].p;
            }
        }
        return null;
    }
    function findRoad() {
        openTable.push(startPoint);
        astar_find();
        var grid = closeTable[closeTable.length - 1].p;
        while (grid != null) {
            var x = grid.x;
            var y = grid.y;
            mapGrid.rows[y].cells[x].style.backgroundColor = "#00ffff";
            grid = getParentGrid(x, y);
        }
    }

    function astar_find() {
        if (isInCloseTable(endPoint.x, endPoint.y)) {
            return;
        }
        var minF_point = openTable[0];
        for (var i = 1; i < openTable.length; i++) {
            if (openTable[i].f_value < minF_point.f_value) {
                minF_point = openTable[i];
            }
        }
        closeTable.push(minF_point);
        for (var j = 0; j < openTable.length; j++) {
            if (openTable[j].x == minF_point.x &&
                openTable[j].y == minF_point.y) {
                openTable.splice(j, 1);
            }
        }

        var roundPoints = getRoundPoints(minF_point.x, minF_point.y);
        for (var k = 0; k < roundPoints.length; k++) {
            if (isInCloseTable(roundPoints[k].x, roundPoints[k].y) || 
                isInObstacles(roundPoints[k].x, roundPoints[k].y)) {
                continue;
            }
            if (isInOpenTable(roundPoints[k].x, roundPoints[k].y)) {
                var new_gValue = minF_point.g_value + 
                    (Math.abs(minF_point.x - roundPoints[k].x) +
                        Math.abs(minF_point.y - roundPoints[k].y) == 1 ?
                        minF_point.g_value + 10 : minF_point.g_value + 14);
                if (new_gValue < roundPoints[k].g_value) {
                    roundPoints[k].p = minF_point;
                }
            } else {
                var g = (Math.abs(minF_point.x - roundPoints[k].x) +
                        Math.abs(minF_point.y - roundPoints[k].y)) == 1 ?
                        minF_point.g_value + 10 : minF_point.g_value + 14;
                var h = (Math.abs(endPoint.x - startPoint.x) + 
                        Math.abs(endPoint.y - endPoint.y)) * 10;
                var f = g + h;
                openTable.push({
                    x: roundPoints[k].x,
                    y: roundPoints[k].y,
                    p: { x: minF_point.x, y: minF_point.y },
                    g_value: g,
                    h_value: h,
                    f_value: f
                });
            }
        }
        astar_find();
    }

    var app = {
        createGrid: function (width, height) {
            var tableGrid = document.getElementById("map");
            for (var i = 0; i < height; i++) {
                var trElement = document.createElement("tr");
                for (var j = 0; j < width; j++) {
                    var tdElement = document.createElement("td");
                    tdElement.setAttribute("x", j);
                    tdElement.setAttribute("y", i);
                    tdElement.bgColor = "#ffffff";
                    tdElement.width = 25;
                    tdElement.height = 25;
                    tdElement.onclick = function () {
                        gridClicker(parseInt(this.getAttribute("x")), parseInt(this.getAttribute("y")));
                    }
                    trElement.appendChild(tdElement);
                }
                tableGrid.appendChild(trElement);
            }
        },
        initState: function() {
            astarBtn.style.backgroundColor = "#00E56B";
            setStartBtn.style.backgroundColor = "#00E56B";
        },
        regEvent: function() {
            astarBtn.onclick = methodBtnClicker;
            bfsBtn.onclick = methodBtnClicker;
            dfsBtn.onclick = methodBtnClicker;
            setStartBtn.onclick = setGridBtnClicker;
            setObstacleBtn.onclick = setGridBtnClicker;
            setEndBtn.onclick = setGridBtnClicker;

            startBtn.onclick = findRoad;
        },
        init: function () {
            this.createGrid(30, 20);
            this.initState();
            this.regEvent();


        }
    }

    app.init();
})();

