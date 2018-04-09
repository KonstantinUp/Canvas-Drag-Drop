var Polygon = require('./modules/polygonCreator');
var inPolygon = require('./modules/isCursorInPolygon');
var intersect = require('./modules/intersection');

    var mouse = {
        x:0,
        y:0
    };
    var objectsIntersectionsArr=[];
    var intersectionsStates = [];
    var flag;
    var isIntersection;
    var deltaX;
    var deltaY;
    var mouseDownX;
    var mouseDownY;
    var polygons =[];
    var counter=0;
    var radius ;
    var polygonCoordinates = [];
    var vertexCoordinates = {};
    var polygonNumber;
    var selected = false;
    var cnv = document.getElementById('canvas');
    var ctx = cnv.getContext('2d');
    var width = window.innerWidth -20;
    var height =window.innerHeight -20;
    cnv.width = window.innerWidth -20;
    cnv.height = window.innerHeight -20;
    cnv.style.background = '#c0c0c0';
    ctx.lineWidth =3;



    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        cnv.width = window.innerWidth -20;
        cnv.height = window.innerHeight -20;
        width = window.innerWidth -20;
        height =window.innerHeight -20;

    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    polygonNumber =  getRndInteger(2,8);

    while (polygonNumber !==0 ){
        counter++;
        var sidesNumber = getRndInteger(3,8);
        var a = (Math.PI * 2) / sidesNumber;
        for (var j = 1; j <= sidesNumber; j++) {
            radius = getRndInteger(10,40);
            vertexCoordinates.x =(radius * Math.cos(a * j) +100);
            vertexCoordinates.y = (radius * Math.sin(a * j) + (counter*100));
            polygonCoordinates.push(vertexCoordinates);
            vertexCoordinates ={};
        }
        polygons.push(new Polygon( polygonCoordinates,sidesNumber,[],counter));
        polygonCoordinates =[];
        polygonNumber--
    }


    setInterval(function () {
        ctx.clearRect(0,0,width,height);
        for(i in polygons){
            polygons[i].draw();
        }
        if(objectsIntersectionsArr != false){
            for(j in objectsIntersectionsArr){
                objectsIntersectionsArr[j].draw();
                ctx.fillStyle = '#ff0000';
                ctx.fill()
            }
        }
        if(selected){
            selected.draw();
            ctx.fillStyle = '#008011';
            ctx.fill()
        }
    },30);


    window.onmousemove = function (e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        if(mouseDownX && mouseDownY && selected){
            deltaX = mouse.x - mouseDownX;
            deltaY = mouse.y - mouseDownY;
            var coordsArrLenght = selected.coords.length;

            for(var i =0;i<coordsArrLenght;i++){
                selected.coords[i].x =  selected.coords[i].x + deltaX;
                selected.coords[i].y =  selected.coords[i].y + deltaY;
            }
            mouseDownX =  mouseDownX + deltaX;
            mouseDownY = mouseDownY + deltaY;
        }
    };

    window.onmousedown = function () {
        if(!mouseDownX && !mouseDownY){
            mouseDownX = mouse.x;
            mouseDownY = mouse.y;
        }
        if(!selected){
            var i;
            for(i in polygons){
                if(inPolygon(polygons[i].coords,mouse)){
                    selected = polygons[i];
                }
            }
        }
    };



    window.onmouseup = function () {
        if(selected) {
            for (i in polygons) {
                if(selected === polygons[i] ){
                    continue;
                }
                flag = intersect(selected.coords, polygons[i].coords);
                intersectionsStates.push(flag.length !== 0);
                if (flag.length !== 0) {
                    if (!objectsIntersectionsArr.includes(polygons[i])) {
                        objectsIntersectionsArr.unshift(polygons[i]);
                    }
                    if (!objectsIntersectionsArr.includes(selected)) {
                        objectsIntersectionsArr.push(selected);
                    }
                    selected.intersectionsIdsArr.push( polygons[i].id);
                    polygons[i].intersectionsIdsArr.push(selected.id);
                }
            }
            function isPositive(flag) {
                return flag == true;
            }
            if (!intersectionsStates.some(isPositive) && objectsIntersectionsArr.length !==0 ) {
                selected.intersectionsIdsArr.forEach(function (id) {
                    objectsIntersectionsArr.forEach(function (item, i) {
                        if (objectsIntersectionsArr[i].id == id) {
                            // debugger;
                            if (objectsIntersectionsArr[i].intersectionsIdsArr.length > 1) {
                                objectsIntersectionsArr[i].intersectionsIdsArr.forEach(function (value, k) {
                                    if (value == selected.id) {
                                        objectsIntersectionsArr[i].intersectionsIdsArr.splice(k, 1);
                                    }
                                })
                            } else {
                                objectsIntersectionsArr[i].intersectionsIdsArr = [];
                                objectsIntersectionsArr.splice(i, 1);
                            }
                        }
                    });
                });

                objectsIntersectionsArr.forEach(function (item, i) {
                    if (objectsIntersectionsArr[i].id == selected.id) {
                        objectsIntersectionsArr.splice(i, 1);
                        selected.intersectionsIdsArr = [];
                    }
                });
            } else {
                var arr = [];
                selected.intersectionsIdsArr.forEach(function (id) {
                    for (i in polygons) {
                        if(id === polygons[i].id){
                            flag = intersect(selected.coords, polygons[i].coords);
                            if (flag.length === 0) {
                                arr.push(id);
                            }
                        }
                    }
                });
                arr.forEach(function (id, j) {
                    selected.intersectionsIdsArr.forEach(function (value,l) {
                        if(value == arr[j]){
                            selected.intersectionsIdsArr.splice(l, 1);
                        }
                    });
                    objectsIntersectionsArr.forEach(function (item, i) {
                        if (objectsIntersectionsArr[i].id == arr[j]) {
                            if (objectsIntersectionsArr[i].intersectionsIdsArr.length > 1) {
                                objectsIntersectionsArr[i].intersectionsIdsArr.forEach(function (value, k) {
                                    if (value == selected.id) {
                                        objectsIntersectionsArr[i].intersectionsIdsArr.splice(k, 1);
                                    }
                                })
                            } else {
                                objectsIntersectionsArr[i].intersectionsIdsArr = [];
                                objectsIntersectionsArr.splice(i, 1);
                            }
                        }
                    });
                });
            }
            selected = false;
            intersectionsStates =[];
        }
        mouseDownX =0;
        mouseDownY =0;
    };
