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
        "Open":     1,
        "Close":    2,
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
    var gridDrawType   = GRID_DRAW_TYPE.Start  // origin point
    var isMapMouseDown = false

    var gridWidth      = 50
    var gridHeight     = 50

    var startPoint
    var endPoint
    var obstacles  = []
    var openTable  = []
    var closeTable = []

    Element.prototype.gVal = function(prop) {
        return parseInt(this.getAttribute(prop))
    }
    Element.prototype.sVal = function(prop, val) {
        this.setAttribute(prop, val.toString())
    }

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
        for (var i = 0; i < gridHeight; i++) {
            for (var j = 0; j < gridWidth; j++) {
                var grid = mapGrid.rows[i].cells[j]
                if (grid == startPoint || grid == endPoint) {
                    continue
                }
                if (grid.style.backgroundColor.toString() != "rgb(153, 153, 153)") {
                    grid.style.backgroundColor = "#ffffff"
                    grid.sVal("type", GRID_TYPE.Init)
                }
            }
        }
        obstacles  = []
        openTable  = []
        closeTable = []
    }

    function getHValue(pointA, pointB) {
        return (Math.abs(pointA.gVal("x") - pointB.gVal("x")) + Math.abs(pointA.gVal("y") - pointB.gVal("y"))) * 10
    }
    function getGValue(from, to) {
        return Math.abs(from.gVal("x") - to.gVal("x")) + Math.abs(from.gVal("y") - to.gVal("y")) == 1 ?
            from.gVal("g_value") + 10 : from.gVal("g_value") + 14
    }

    function getRoundPoints(x, y) {
        var array = [];

        function isObstacle(x, y) {
            return mapGrid.rows[y].cells[x].gVal("type") == GRID_TYPE.Obstacle
        }

        function myPush(x, y, check, type) {
            if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) {
                return
            }

            if (check) {
                switch (type) {
                    case 1:  //top - left
                        if (isObstacle(x, y + 1) || isObstacle(x + 1, y))
                            return
                        break
                    case 2:  //top - right
                        if (isObstacle(x - 1, y) || isObstacle(x, y + 1))
                            return
                        break
                    case 3:  //bottom - left
                        if (isObstacle(x, y - 1) || isObstacle(x + 1, y))
                            return
                        break
                    case 4:  //bottom - right
                        if (isObstacle(x - 1, y) || isObstacle(x, y - 1))
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
                var currGrid = mapGrid.rows[i].cells[j]
                if (currGrid.style.backgroundColor.toString() == "rgb(153, 153, 153)") {
                    currGrid.sVal("type", GRID_TYPE.Obstacle)
                    obstacles.push(currGrid)
                }
            }
        }
        switch (methodID) {
            case 0:   //astar
                startPoint.sVal("g_value", 0)
                startPoint.sVal("h_value", getHValue(startPoint, endPoint))
                startPoint.sVal("f_value", getHValue(startPoint, endPoint))
                startPoint.sVal("type", GRID_TYPE.Open)
                endPoint.sVal("g_value", 0)
                endPoint.sVal("h_value", 0)
                endPoint.sVal("f_value", 0)
                endPoint.sVal("type", GRID_TYPE.Init)

                openTable.push(startPoint)
                astar_find()
                break
            case 1:   //bfs
                startPoint.sVal("type", GRID_TYPE.Init)
                endPoint.sVal("type", GRID_TYPE.Init)
                bfs_find(startPoint)
                break
            case 2:    //dfs
                startPoint.sVal("type", GRID_TYPE.Init)
                endPoint.sVal("type", GRID_TYPE.Init)
                dfs_find(startPoint)
                break
        }
    }

    function geneRoad() {
        var grid = closeTable[closeTable.length - 1]
        if (methodID == 0) {
            grid = closeTable[closeTable.length - 1].p
        }
        while (grid != null ) {
            if (grid == startPoint) {
                return
            }
            grid.style.backgroundColor = "#00ffff"
            grid = grid.p
        }
    }

    function astar_find() {
        if (endPoint.gVal("type") == GRID_TYPE.Close) {
            geneRoad()
            return
        }
        var minF_point = openTable[0]
        for (var i = 1; i < openTable.length; i++) {
            if (openTable[i].gVal("f_value") < minF_point.gVal("f_value")) {
                minF_point = openTable[i]
            }
        }
        for (var j = 0; j < openTable.length; j++) {
            if (openTable[j] == minF_point) {
                openTable.splice(j, 1)
            }
        }
        closeTable.push(minF_point)
        minF_point.sVal("type", GRID_TYPE.Close)
        if (minF_point != startPoint && minF_point != endPoint) {
            minF_point.style.backgroundColor = "#ffff00"
        }

        var minFPointX = minF_point.gVal("x")
        var minFPointY = minF_point.gVal("y")
        var roundPoints = getRoundPoints(minFPointX, minFPointY)
        for (var k = 0; k < roundPoints.length; k++) {
            var curr = roundPoints[k];
            if (curr) {
                var currType = curr.gVal("type")
                if (currType == GRID_TYPE.Close || currType == GRID_TYPE.Obstacle) {
                    continue
                }
                if (currType == GRID_TYPE.Open) {  //in open table
                    var new_gValue = getGValue(minF_point, curr)
                    if (new_gValue < curr.gVal("g_value")) {
                        curr.p = minF_point
                        curr.sVal("g_value", new_gValue)
                        curr.sVal("f_value", new_gValue + curr.gVal("h_value"))
                    }
                } else {
                    var g = getGValue(minF_point, curr)
                    var h = getHValue(curr, endPoint)
                    var f = g + h
                    curr.p = minF_point
                    curr.sVal("type", GRID_TYPE.Open)
                    curr.sVal("g_value", g)
                    curr.sVal("h_value", h)
                    curr.sVal("f_value", f)
                    openTable.push(curr)
                    if (curr == endPoint) {
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
        curr.sVal("type", GRID_TYPE.Close)
        if (curr != startPoint) {
            curr.style.backgroundColor = "#ffff00"
        }

        var roundPoints = getRoundPoints(curr.gVal("x"), curr.gVal("y"))
        for (var k = 0; k < roundPoints.length; k++) {
            var tmpGrid = roundPoints[k]
            if (tmpGrid) {
                var tmpType = tmpGrid.gVal("type")
                if (tmpType == GRID_TYPE.Open || tmpType == GRID_TYPE.Close || tmpType == GRID_TYPE.Obstacle) {
                    continue
                }

                if (tmpGrid == endPoint) {
                    geneRoad()
                    return
                } else {
                    tmpGrid.p = curr
                    tmpGrid.sVal("type", GRID_TYPE.Open)
                    openTable.push(tmpGrid)
                    if (tmpGrid == endPoint) {
                        continue
                    }
                    tmpGrid.style.backgroundColor = "#00ff00"
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
        curr.sVal("type", GRID_TYPE.Close)
        if (curr != startPoint) {
            curr.style.backgroundColor = "#ffff00"
        }

        var roundPoints = getRoundPoints(curr.gVal("x"), curr.gVal("y"))
        for (var k = 0; k < roundPoints.length; k++) {
            var tmpGrid = roundPoints[k]
            if (tmpGrid) {
                var tmpType = tmpGrid.gVal("type")
                if (tmpType == GRID_TYPE.Open || tmpType == GRID_TYPE.Close || tmpType == GRID_TYPE.Obstacle) {
                    continue
                }

                if (tmpGrid == endPoint) {
                    geneRoad()
                    return
                } else {
                    tmpGrid.p = curr
                    tmpGrid.sVal("type", GRID_TYPE.Open)
                    openTable.push(tmpGrid)
                    if (tmpGrid == endPoint) {
                        continue
                    }
                    tmpGrid.style.backgroundColor = "#00ff00"
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
        tdElement.sVal("x", x)
        tdElement.sVal("y", y)
        tdElement.sVal("type", "0")  // 0 for nothing, 1 for open, 2 for close, 3 for obstacle
        tdElement.onclick = function() {
            switch (gridDrawType) {
                case GRID_DRAW_TYPE.Start:
                    this.style.backgroundColor = "#ff0000"
                    startPoint = this
                    break
                case GRID_DRAW_TYPE.Obstacle:
                    this.style.backgroundColor = "#999999"

                    break
                case GRID_DRAW_TYPE.End:
                    this.style.backgroundColor = "#0000ff"
                    endPoint = this
                    break
            }
        }
        tdElement.onmousemove = function() {
            if (isMapMouseDown && gridDrawType == GRID_DRAW_TYPE.Obstacle) {
                this.style.backgroundColor = "#999999"
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

