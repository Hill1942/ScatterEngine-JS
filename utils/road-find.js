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
    function gridClicker(x, y) {
        switch (gridType) {
            case 0:
                mapGrid.rows[y].cells[x].style.backgroundColor = "#ff0000";
                break;
            case 1:
                mapGrid.rows[y].cells[x].style.backgroundColor = "#999999";
                break;
            case 2:
                mapGrid.rows[y].cells[x].style.backgroundColor = "#0000ff";
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
                        gridClicker(this.getAttribute("x"), this.getAttribute("y"));
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
        },
        init: function () {
            this.createGrid(30, 20);
            this.initState();
            this.regEvent();
        }
    }

    app.init();
})();

