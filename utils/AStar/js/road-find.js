/**
 * @fileOverview  lalala
 * @author kaidiyang
 * @date 2016/11/02
 */

(function () {

    var GRID_TYPE = {
        "Start":    0,
        "Obstacle": 1,
        "End":      2
    }

    var mapGrid        = $("map")
    var astarBtn       = $("astar")
    var bfsBtn         = $("bfs")
    var dfsBtn         = $("dfs")
    var setStartBtn    = $("setStartBtn")
    var setObstacleBtn = $("setObstacleBtn")
    var setEndBtn      = $("setEndBtn")
    var speedText      = $("speedText")
    var startBtn       = $("startBtn")
    var resetBtn       = $("resetBtn")

    var methodID       = 0  // a star
    var gridType       = GRID_TYPE.Start  // origin point
    var isMapMouseDown = false

    var gridWidth      = 50
    var gridHeight     = 35

    var startPoint = {
        x: 0,
        y: 0,
        p: null,
        g_value: 0
    }
    var endPoint = {
        x: 0,
        y: 0
    }
    var obstacles  = []
    var openTable  = []
    var closeTable = []

    function shuffle(a) {
        var j, x, i
        for (i = a.length; i > 0; i--) {
            j = Math.floor(Math.random() * i)
            x = a[i - 1]
            a[i - 1] = a[j]
            a[j] = x
        }
    }

    function resetBtnClicker() {
        obstacles  = []
        openTable  = []
        closeTable = []
        startPoint = { x: 0, y: 0, p: null, g_value: 0 }
        endPoint   = { x: 0, y: 0 }
        for (var i = 0; i < 35; i++) {
            for (var j = 0; j < 50; j++) {
                mapGrid.rows[i].cells[j].style.backgroundColor = "#ffffff";
            }
        }
    }

    function getRoundPoints(x, y) {
        var array = [];

        function myPush(x, y) {
            if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) {
                return
            }

            array.push({ x: x, y: y})
        }

        //myPush(x, y)
        myPush(x - 1,  y - 1)
        myPush(x    ,  y - 1)
        myPush(x + 1,  y - 1)
        myPush(x - 1,  y)
        myPush(x + 1,  y)
        myPush(x - 1,  y + 1)
        myPush(x    ,  y + 1)
        myPush(x + 1,  y + 1)

        shuffle(array)

        return array
    }

    function isInOpenTable(x, y) {
        for (var i = 0; i < openTable.length; i++) {
            if (openTable[i].x == x &&
                openTable[i].y == y) {
                return true
            }
        }
        return false
    }

    function isInCloseTable(x, y) {
        for (var i = 0; i < closeTable.length; i++) {
            if (closeTable[i].x == x &&
                closeTable[i].y == y) {
                return true
            }
        }
        return false
    }

    function isInObstacles(x, y) {
        for (var i = 0; i < obstacles.length; i++) {
            if (obstacles[i].x == x &&
                obstacles[i].y == y) {
                return true
            }
        }
        return false
    }

    function setGridBtnClicker() {
        setStartBtn.style.backgroundColor    = "#999999"
        setObstacleBtn.style.backgroundColor = "#999999"
        setEndBtn.style.backgroundColor      = "#999999"
        this.style.backgroundColor           = "#FF6565"
        switch (this.id) {
            case "setStartBtn":
                gridType = GRID_TYPE.Start
                break
            case "setObstacleBtn":
                gridType = GRID_TYPE.Obstacle
                break
            case "setEndBtn":
                gridType = GRID_TYPE.End
                break
        }
    }

    function methodBtnClicker() {
        astarBtn.style.backgroundColor = "#999999"
        bfsBtn.style.backgroundColor   = "#999999"
        dfsBtn.style.backgroundColor   = "#999999"
        this.style.backgroundColor     = "#FF6565"
        switch (this.id) {
            case "astar":
                methodID = 0
                break
            case "bfs":
                methodID = 1
                break
            case "dfs":
                methodID = 2
                break
        }
    }

    function findRoad() {
        switch (methodID) {
            case 0:   //astar
                openTable.push(startPoint)
                astar_find()
                break
            case 1:   //bfs
                closeTable.push(startPoint)
                bfs_find(startPoint)
                //methodID = 1
                break
            case 2:    //dfs
                closeTable.push(startPoint)
                dfs_find(startPoint)
                //methodID = 2
                break
        }



    }

    function geneRoad() {
        var grid = closeTable[closeTable.length - 1]
        if (methodID == 0) {
            grid = closeTable[closeTable.length - 1].p
        }
        while (grid != null ) {
            var x = grid.x
            var y = grid.y
            if (x == startPoint.x && y == startPoint.y) {
                return
            }
            mapGrid.rows[y].cells[x].style.backgroundColor = "#00ffff"
            //grid = getParentGrid(x, y)
            grid = grid.p
        }
    }

    function astar_find() {
        if (isInCloseTable(endPoint.x, endPoint.y)) {
            geneRoad()
            return
        }
        var minF_point = openTable[0]
        for (var i = 1; i < openTable.length; i++) {
            if (openTable[i].f_value < minF_point.f_value) {
                minF_point = openTable[i]
            }
        }
        closeTable.push(minF_point)
        //console.log("mf: (" + minF_point.x + ", " + minF_point.y + ")" + ", and f: " + minF_point.f_value)
        for (var j = 0; j < openTable.length; j++) {
            if (openTable[j].x == minF_point.x && openTable[j].y == minF_point.y) {
                if ( (minF_point.x == startPoint.x && minF_point.y == startPoint.y) ||
                     (minF_point.x == endPoint.x && minF_point.y == endPoint.y)) {
                } else {
                    mapGrid.rows[minF_point.y].cells[minF_point.x].style.backgroundColor = "#ffff00"
                }
                openTable.splice(j, 1)
            }
        }

        var roundPoints = getRoundPoints(minF_point.x, minF_point.y)
        for (var k = 0; k < roundPoints.length; k++) {
            var currX = roundPoints[k].x;
            var currY = roundPoints[k].y;
            if (isInCloseTable(currX, currY) || isInObstacles(currX, currY)) {
                continue
            }
            if (isInOpenTable(currX, currY)) {
                var new_gValue = (Math.abs(minF_point.x - currX) + Math.abs(minF_point.y - currY) == 1 ?
                        minF_point.g_value + 10 : minF_point.g_value + 14)
                if (new_gValue < roundPoints[k].g_value) {
                    roundPoints[k].p = minF_point
                    console.log("hit")
                }
            } else {
                var g = (Math.abs(minF_point.x - currX) + Math.abs(minF_point.y - currY)) == 1 ?
                        minF_point.g_value + 10 : minF_point.g_value + 14
                var h = (Math.abs(endPoint.x - currX) + Math.abs(endPoint.y - currY)) * 10
                var f = g + h
                openTable.push({
                    x: currX,
                    y: currY,
                    p: minF_point,
                    g_value: g,
                    h_value: h,
                    f_value: f
                })
                var currGrid = mapGrid.rows[currY].cells[currX];
                if (currGrid) {
                    if (currX == endPoint.x && currY == endPoint.y) {
                        continue
                    }
                    currGrid.style.backgroundColor = "#00ff00"
                }
            }
        }

        setTimeout(function() {
            astar_find()
        }, parseInt(speedText.value))

    }

    function bfs_find(curr) {
        closeTable.push(curr);
        if (curr.x != startPoint.x || curr.y != startPoint.y) {
            mapGrid.rows[curr.y].cells[curr.x].style.backgroundColor = "#ffff00"
        }

        var roundPoints = getRoundPoints(curr.x, curr.y)
        for (var k = 0; k < roundPoints.length; k++) {
            var tmpX = roundPoints[k].x;
            var tmpY = roundPoints[k].y;
            if (isInCloseTable(tmpX, tmpY) || isInOpenTable(tmpX, tmpY) || isInObstacles(tmpX, tmpY)) {
                continue
            }

            if (tmpX == endPoint.x && tmpY == endPoint.y) {
                geneRoad()
                return
            } else {
                openTable.push({
                    x: tmpX,
                    y: tmpY,
                    p: curr
                })
                var currGrid = mapGrid.rows[tmpY].cells[tmpX]
                if (currGrid) {
                    if (tmpX == endPoint.x && tmpY == endPoint.y) {
                        continue
                    }
                    currGrid.style.backgroundColor = "#00ff00"
                }
            }
        }

        var next = openTable.shift()

        setTimeout(function() {
            bfs_find(next)
        }, parseInt(speedText.value))
    }

    function dfs_find(curr) {
        closeTable.push(curr);
        if (curr.x != startPoint.x || curr.y != startPoint.y) {
            mapGrid.rows[curr.y].cells[curr.x].style.backgroundColor = "#ffff00"
        }

        var roundPoints = getRoundPoints(curr.x, curr.y)
        for (var k = 0; k < roundPoints.length; k++) {
            var tmpX = roundPoints[k].x;
            var tmpY = roundPoints[k].y;
            if (isInCloseTable(tmpX, tmpY) || isInOpenTable(tmpX, tmpY) || isInObstacles(tmpX, tmpY)) {
                continue
            }

            if (tmpX == endPoint.x && tmpY == endPoint.y) {
                geneRoad()
                return
            } else {
                openTable.push({
                    x: tmpX,
                    y: tmpY,
                    p: curr
                })
                var currGrid = mapGrid.rows[tmpY].cells[tmpX]
                if (currGrid) {
                    if (tmpX == endPoint.x && tmpY == endPoint.y) {
                        continue
                    }
                    currGrid.style.backgroundColor = "#00ff00"
                }
            }
        }

        var next = openTable.pop()

        setTimeout(function() {
            dfs_find(next)
        }, parseInt(speedText.value))
    }

    function createGrid(x, y, size) {
        var tdElement     = document.createElement("td")
        tdElement.bgColor = "#ffffff"
        tdElement.width   = size
        tdElement.height  = size
        tdElement.setAttribute("x", x)
        tdElement.setAttribute("y", y)
        tdElement.onclick = function() {
            switch (gridType) {
                case GRID_TYPE.Start:
                    this.style.backgroundColor = "#ff0000"
                    startPoint.x = x
                    startPoint.y = y
                    break
                case GRID_TYPE.Obstacle:
                    this.style.backgroundColor = "#999999"

                    break
                case GRID_TYPE.End:
                    this.style.backgroundColor = "#0000ff"
                    endPoint.x = x
                    endPoint.y = y
                    break
            }
        }
        tdElement.onmousemove = function() {
            if (isMapMouseDown && gridType == GRID_TYPE.Obstacle) {
                this.style.backgroundColor = "#999999"
                obstacles.push({ x: this.getAttribute("x"), y: this.getAttribute("y") })
            }
        }

        return tdElement
    }

    var app = {
        createMap: function (width, height, size) {
            for (var i = 0; i < height; i++) {
                var trElement = document.createElement("tr")
                for (var j = 0; j < width; j++) {
                    trElement.appendChild(createGrid(j, i, size))
                }
                mapGrid.appendChild(trElement)
            }
        },
        initState: function() {
            astarBtn.style.backgroundColor    = "#FF6565"
            setStartBtn.style.backgroundColor = "#FF6565"
        },
        regEvent: function() {
            astarBtn.onclick       = methodBtnClicker
            bfsBtn.onclick         = methodBtnClicker
            dfsBtn.onclick         = methodBtnClicker
            setStartBtn.onclick    = setGridBtnClicker
            setObstacleBtn.onclick = setGridBtnClicker
            setEndBtn.onclick      = setGridBtnClicker
            resetBtn.onclick       = resetBtnClicker
            startBtn.onclick       = findRoad
            mapGrid.onmousedown    = function() { isMapMouseDown = true  }
            mapGrid.onmouseup      = function() { isMapMouseDown = false }
        },
        run: function () {
            this.createMap(gridWidth, gridHeight, 15)
            this.initState()
            this.regEvent()
        }
    }

    app.run()
})()

