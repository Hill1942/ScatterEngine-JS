/**
 * @fileOverview  lalala
 * @author kaidiyang
 * @date 2016/11/02
 */

(function () {

    var GRID_DRAW_TYPE = {
        "Start":    0,
        "Obstacle": 1,
        "End":      2
    }
    var GRID_TYPE = {
        "Init":     0,
        "Open":     0,
        "Close":    1,
        "Obstacle": 3
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
    var gridDrawType       = GRID_DRAW_TYPE.Start  // origin point
    var isMapMouseDown = false

    var gridWidth      = 50
    var gridHeight     = 50

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
        for (var i = 0; i < gridHeight; i++) {
            for (var j = 0; j < gridWidth; j++) {
                var grid = mapGrid.rows[i].cells[j];
                if (grid.style.backgroundColor.toString() != "rgb(153, 153, 153)") {
                    grid.style.backgroundColor = "#ffffff"
                    grid.setAttribute("type", "3")
                }
            }
        }
    }

    function getRoundPoints(x, y) {
        var array = [];

        function myPush(x, y, check, type) {
            if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) {
                return
            }

            if (check) {
                switch (type) {
                    case 1:
                        if (isInObstacles(x, y + 1) || isInObstacles(x + 1, y))
                            return
                        break
                    case 2:
                        if (isInObstacles(x - 1, y) || isInObstacles(x, y + 1))
                            return
                        break
                    case 3:
                        if (isInObstacles(x, y - 1) || isInObstacles(x + 1, y))
                            return
                        break
                    case 4:
                        if (isInObstacles(x - 1, y) || isInObstacles(x, y - 1))
                            return
                        break
                }
            }

            array.push(mapGrid.rows[y].cells[x])
        }

        myPush(x - 1,  y - 1, true, 1)
        myPush(x    ,  y - 1)
        myPush(x + 1,  y - 1, true, 2)
        myPush(x - 1,  y)
        myPush(x + 1,  y)
        myPush(x - 1,  y + 1, true, 3)
        myPush(x    ,  y + 1)
        myPush(x + 1,  y + 1, true, 4)

        shuffle(array)

        return array
    }

    function isInOpenTable(x, y) {
        return mapGrid.rows[y].cells[x].getAttribute("type") == "1"
    }

    function isInCloseTable(x, y) {
        return mapGrid.rows[y].cells[x].getAttribute("type") == "2"
    }

    function isInObstacles(x, y) {
        return mapGrid.rows[y].cells[x].getAttribute("type") == "3"
    }

    function setGridBtnClicker() {
        setStartBtn.style.backgroundColor    = "#999999"
        setObstacleBtn.style.backgroundColor = "#999999"
        setEndBtn.style.backgroundColor      = "#999999"
        this.style.backgroundColor           = "#FF6565"
        switch (this.id) {
            case "setStartBtn":
                gridDrawType = GRID_DRAW_TYPE.Start
                break
            case "setObstacleBtn":
                gridDrawType = GRID_DRAW_TYPE.Obstacle
                break
            case "setEndBtn":
                gridDrawType = GRID_DRAW_TYPE.End
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
        for (var i = 0; i < gridHeight; i++) {
            for (var j = 0; j < gridWidth; j++) {
                if (mapGrid.rows[i].cells[j].style.backgroundColor.toString() == "rgb(153, 153, 153)") {
                    obstacles.push({ x: j, y: i })
                }
            }
        }
        switch (methodID) {
            case 0:   //astar
                startPoint.h_value = (Math.abs(endPoint.x - startPoint.x) + Math.abs(endPoint.y - startPoint.y)) * 10
                startPoint.f_value = startPoint.h_value + startPoint.g_value
                startPoint.setAttribute("type", "1")
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
        minF_point.setAttribute("type", "2")
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
            var curr = roundPoints[k];
            if (curr) {
                var currX = curr.x;
                var currY = curr.y;
                if (curr.getAttribute("type") == "2" || curr.getAttribute("type") == "3") {
                    continue
                }
                if (curr.getAttribute("type") == "1") {  //in open table
                    var new_gValue = (Math.abs(minF_point.x - currX) + Math.abs(minF_point.y - currY) == 1 ?
                    minF_point.g_value + 10 : minF_point.g_value + 14)
                    if (new_gValue < curr.g_value) {
                        curr.p = minF_point
                        curr.g_value = new_gValue
                        curr.f_value = new_gValue + curr.h_value
                    }
                } else {
                    var g = (Math.abs(minF_point.x - currX) + Math.abs(minF_point.y - currY)) == 1 ?
                            minF_point.g_value + 10 : minF_point.g_value + 14
                    var h = (Math.abs(endPoint.x - currX) + Math.abs(endPoint.y - currY)) * 10
                    var f = g + h
                    curr.p = minF_point
                    curr.setAttribute("type", "1")
                    curr.setAttribute("g_value", g)
                    curr.setAttribute("h_value", h)
                    curr.setAttribute("f_value", f)
                    openTable.push(curr)
                    if (currX == endPoint.x && currY == endPoint.y) {
                        continue
                    }
                    curr.style.backgroundColor = "#00ff00"

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
        tdElement.setAttribute("type", "0")  // 0 for nothing, 1 for open, 2 for close, 3 for obstacle
        tdElement.onclick = function() {
            switch (gridDrawType) {
                case GRID_DRAW_TYPE.Start:
                    this.style.backgroundColor = "#ff0000"
                    startPoint.x = x
                    startPoint.y = y
                    break
                case GRID_DRAW_TYPE.Obstacle:
                    this.style.backgroundColor = "#999999"

                    break
                case GRID_DRAW_TYPE.End:
                    this.style.backgroundColor = "#0000ff"
                    endPoint.x = x
                    endPoint.y = y
                    break
            }
        }
        tdElement.onmousemove = function() {
            if (isMapMouseDown && gridDrawType == GRID_DRAW_TYPE.Obstacle) {
                this.style.backgroundColor = "#999999"
                //obstacles.push({ x: this.getAttribute("x"), y: this.getAttribute("y") })
            }
        }

        if (y == 0) {
            tdElement.innerHTML = x
        }
        if (x == 0) {
            tdElement.innerHTML = y
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

