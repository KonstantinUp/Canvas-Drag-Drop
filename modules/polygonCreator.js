var cnv = document.getElementById('canvas');
var ctx = cnv.getContext('2d');

function Polygon(polygonCoordinates ,sides,arr,id) {
    this.coords =  polygonCoordinates;
    this.sides= sides;
    this.intersectionsIdsArr = arr;
    this.id = id;
}

Polygon.prototype = {
    draw: function () {
        if (this.sides < 3) return;
        ctx.beginPath();
        for (var i = 0; i < this.sides; i++) {
            ctx.lineTo(this.coords[i].x, this.coords[i].y)
        }
        ctx.closePath();
        ctx.fillStyle = '#803742';
        ctx.fill()
    }
};

module.exports = Polygon;