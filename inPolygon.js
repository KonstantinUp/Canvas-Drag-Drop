function inPolygon(polygonCoordinates,mouse){
    var vertexes = polygonCoordinates.length;
    j = vertexes - 1;
    var c = 0;
    for (i = 0; i < vertexes;i++){
        if ((((polygonCoordinates[i].y<=mouse.y ) && (mouse.y<polygonCoordinates[j].y)) || ((polygonCoordinates[j].y<=mouse.y) && (mouse.y<polygonCoordinates[i].y))) &&
            (mouse.x  > (polygonCoordinates[j].x - polygonCoordinates[i].x) * (mouse.y - polygonCoordinates[i].y) / (polygonCoordinates[j].y - polygonCoordinates[i].y) + polygonCoordinates[i].x)) {
            c = !c
        }
        j = i;
    }
    return c;
}


module.exports = inPolygon;