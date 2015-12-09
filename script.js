var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
var matrix = [];
var matsim = [];
var color = [5, 255, 100];
var pausa = false;
var a = 60;
var b = 30;

function prod(lis, k){
	for (var ii=0; ii<3; ii++){
		lis[ii] = parseInt(lis[ii]*k);
	}
	return lis;
}

function rese(){
	for (var ii=0; ii<a; ii++){
		matrix[ii]=[];
		matsim[ii]=[];
		for (var jj=0; jj<b; jj++){
			matrix[ii][jj] = false;
			matsim[ii][jj] = false;
		}
		matsim[ii][b] = false;
		matsim[ii][b + 1] = false;
	}
	matsim[a] = [];
	matsim[a + 1] = [];
	for (var jj=0; jj<b + 2; jj++){
		matsim[a][jj]=false;
		matsim[a+1][jj]=false;
	}
}

function randomize(){
	for (var ii=0; ii<a; ii++){
		matrix[ii]=[];
		for (var jj=0; jj<b; jj++){
			r = 2*Math.random();
			matrix[ii][jj] = (r > 1);
		}
	}
}

function randcol(){
	var lis = [parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85];
	if (lis[0] + lis[1] + lis[2]==0){
		return randcol();
	}
	return lis;
}

function rgbstr(lis){
	return "rgb(" + lis[0] + "," + lis[1] + "," + lis[2] + ")";
}

function px(p, q){
	pluma.fillRect(p, q, 1, 1);
}

function square(p, q, d, c){
	pluma.fillStyle = c;
	pluma.fillRect(p - d, q - d, 1, 2*d);
	pluma.fillRect(p - d, q + d, 2*d, 1);
	pluma.fillRect(p - d + 1, q - d, 2*d, 1);
	pluma.fillRect(p + d, q - d + 1, 1, 2*d);
}

function block(p, q, d, c){
	for (var tt=0; tt<4; tt++){
		square(p, q, d - tt, rgbstr(prod([c[0], c[1], c[2]], tt*(32 - 5*tt)/51.0)));
	}
	pluma.fillStyle = rgbstr([c[0], c[1], c[2]]);
	pluma.fillRect(p - d + 4, q - d + 4, 2*d - 7, 2*d - 7);
}

function draw(){
	for (var ii=0; ii<a; ii++){
		for (var jj=0; jj<b; jj++){
			if (matrix[ii][jj]){
				block(10 + 20*ii, 10 + 20*jj, 10, color);
			} else {
				pluma.fillStyle = "black";
				pluma.fillRect(20*ii, 20*jj, 20, 20);
			}
		}
	}
}

function copy(){
	for (var ii=0; ii<a; ii++){
		for (var jj=0; jj<b; jj++){
			matsim[ii + 1][jj + 1] = matrix[ii][jj];
		}
		matsim[ii + 1][0] = matrix[ii][b - 1];
		matsim[ii + 1][b + 1] = matrix[ii][0];
	}
	for (var jj=0; jj<b; jj++){
		matsim[0][jj + 1] = matrix[a - 1][jj];
		matsim[a + 1][jj + 1] = matrix[0][jj];
	}
	matsim[0][0] = matrix[a - 1][b - 1];
	matsim[0][b + 1] = matrix[a - 1][0];
	matsim[a + 1][0] = matrix[0][b - 1];
	matsim[a + 1][b + 1] = matrix[0][0];
}

function cumsum(m, n){
	tot=0;
	lis = [matsim[m][n], matsim[m + 1][n + 2], matsim[m + 1][n], matsim[m + 2][n + 1], matsim[m][n + 1], matsim[m][n + 2], matsim[m + 2][n], matsim[m + 2][n + 2]];
	for (var ii=0; ii<8; ii++){
		if (lis[ii]){
			tot++;
		}
	}
	return tot;
}

function conway(life, num){
	if (life){
		if (num==2 || num==3){
			return true;
		}
	} else {
		if (num==3){
			return true;
		}
	}
	return false;
}

function move(){
	for (var ii=0; ii<a; ii++){
		for (var jj=0; jj<b; jj++){
			matrix[ii][jj] = conway(matsim[ii+1][jj+1], cumsum(ii, jj));
		}
	}
}

function play(){
	if (!pausa){
		copy();
		move();
		draw();
	}
}

function parar(){
	pausa = !pausa;
}

rese();
randomize();
draw();
copy();

lienzo.addEventListener("click", function (e){
	var x;
	var y;
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= lienzo.offsetLeft;
	y -= lienzo.offsetTop;
	console.log(x, y);
	x = parseInt(x/20.0);
	y = parseInt(y/20.0);
	console.log(x, y);
	val = matrix[x][y];
	matrix[x][y] = !val;
	if (val){
		pluma.fillStyle="black";
		pluma.fillRect(20*x, 20*y, 20, 20);
	} else {
		block(10 + 20*x, 10 + 20*y, 10, color);
	}
}, false);

window.setInterval(play, 100);
