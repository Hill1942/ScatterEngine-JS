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
        array.push({ x: x - 1, y: y - 1 })
        array.push({ x: x    , y: y - 1 })
        array.push({ x: x + 1, y: y - 1 })
        array.push({ x: x - 1, y: y })
        array.push({ x: x + 1, y: y })
        array.push({ x: x - 1, y: y + 1 })
        array.push({ x: x    , y: y + 1 })
        array.push({ x: x + 1, y: y + 1 })

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

    function getParentGrid(x, y) {
        for (var i = 0; i < closeTable.length; i++) {
            if (closeTable[i].x == x &&
                closeTable[i].y == y) {
                return closeTable[i].p
            }
        }
        return null
    }

    function findRoad() {
        openTable.push(startPoint)
        astar_find()
        var grid = closeTable[closeTable.length - 1].p
        while (grid != null) {
            var x = grid.x
            var y = grid.y
            mapGrid.rows[y].cells[x].style.backgroundColor = "#00ffff"
            grid = getParentGrid(x, y)
        }
    }

    function astar_find() {
        if (isInCloseTable(endPoint.x, endPoint.y)) {
            return
        }
        var minF_point = openTable[0]
        for (var i = 1; i < openTable.length; i++) {
            if (openTable[i].f_value < minF_point.f_value) {
                minF_point = openTable[i]
            }
        }
        closeTable.push(minF_point)
        for (var j = 0; j < openTable.length; j++) {
            if (openTable[j].x == minF_point.x &&
                openTable[j].y == minF_point.y) {
                openTable.splice(j, 1)
            }
        }

        var roundPoints = getRoundPoints(minF_point.x, minF_point.y)
        for (var k = 0; k < roundPoints.length; k++) {
            if (isInCloseTable(roundPoints[k].x, roundPoints[k].y) || 
                isInObstacles(roundPoints[k].x, roundPoints[k].y)) {
                continue
            }
            if (isInOpenTable(roundPoints[k].x, roundPoints[k].y)) {
                var new_gValue = minF_point.g_value + 
                    (Math.abs(minF_point.x - roundPoints[k].x) +
                        Math.abs(minF_point.y - roundPoints[k].y) == 1 ?
                        minF_point.g_value + 10 : minF_point.g_value + 14)
                if (new_gValue < roundPoints[k].g_value) {
                    roundPoints[k].p = minF_point
                }
            } else {
                var g = (Math.abs(minF_point.x - roundPoints[k].x) +
                        Math.abs(minF_point.y - roundPoints[k].y)) == 1 ?
                        minF_point.g_value + 10 : minF_point.g_value + 14
                var h = (Math.abs(endPoint.x - startPoint.x) + 
                        Math.abs(endPoint.y - endPoint.y)) * 10
                var f = g + h
                openTable.push({
                    x: roundPoints[k].x,
                    y: roundPoints[k].y,
                    p: { x: minF_point.x, y: minF_point.y },
                    g_value: g,
                    h_value: h,
                    f_value: f
                })
            }
        }
        astar_find()
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
            this.createMap(50, 35, 15)
            this.initState()
            this.regEvent()
        }
    }

    app.run()
})()

