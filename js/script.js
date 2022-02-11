let dist_betw = 200;
let quan = Math.round(window.innerHeight/200); //How much bubbles on 1 line
let bubbles = [], diedBubbles = [];
let canvas = document.getElementById("can_sec");
let flag = false;
let canv_mousex = 0, canv_mousey = 0;

window.onload = function () {
	let count = Math.floor(document.documentElement.clientWidth/dist_betw);
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;


	for (let lines = 0; lines < count; lines++) {
		for (let i = 0; i < quan; i++)
			bubbles[bubbles.length] = new Newbubble(lines, i+1);
	}
	
	if(!flag) {
		window.requestAnimationFrame(draw);
		flag = true;
	}
}

canvas.onmousemove = function (event) {
	canv_mousex = event.offsetX;
	canv_mousey = event.offsetY;
}

function draw () {
	if (canvas.width != document.documentElement.clientWidth || canvas.height != document.documentElement.clientHeight){
		bubbles.length = 0;
		window.onload();
	}

	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	ctx.lineWidth = 2;
	ctx.lineCap = "round";

	for (let i = 0; i < bubbles.length; i++) {
		bubbles[i].renderPosition();
		if (bubbles[i].y > window.innerHeight)
			continue;

		ctx.strokeStyle = "#545C52";

		ctx.beginPath();
		ctx.arc(bubbles[i].x + 1, bubbles[i].y + 1, bubbles[i].rad, 0, (Math.PI/180)*360);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(bubbles[i].x + 1, bubbles[i].y + 1, bubbles[i].reflrad, (Math.PI/180)*(190 + bubbles[i].cornchg), (Math.PI/180)*(260 + bubbles[i].cornchg));
		ctx.stroke();

		ctx.strokeStyle = "#F0FDFF";

		ctx.beginPath();
		ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].rad, 0, (Math.PI/180)*360);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].reflrad, (Math.PI/180)*(190 + bubbles[i].cornchg), (Math.PI/180)*(260 + bubbles[i].cornchg));
		ctx.stroke();

		diedBubbles.forEach (function (item, index){
			for (let deg = 0; deg < 360; deg += 45) {
				ctx.beginPath();
				ctx.moveTo(diedBubbles[index].close*Math.cos(deg*Math.PI/180) + diedBubbles[index].x, diedBubbles[index].close*Math.sin(deg*Math.PI/180) + diedBubbles[index].y);
				ctx.lineTo(diedBubbles[index].far*Math.cos(deg*Math.PI/180) + diedBubbles[index].x, diedBubbles[index].far*Math.sin(deg*Math.PI/180) + diedBubbles[index].y)
				ctx.stroke();
			}
			if (diedBubbles[index].renderPosition())
				diedBubbles.splice(0, 1);
		});
		
		let arr = findBubbles(i);
		if (arr) {
			for (let a of arr) {
				let bigger, smaller;
				if (bubbles[a].rad > bubbles[i].rad) 
				{bigger = a; smaller = i;} 
				else 
				{bigger = i; smaller = a;}
				bubbles[bigger].targetrad += .6*bubbles[smaller].rad;
				bubbles[smaller].y = -bubbles[smaller].rad;
			}
		}

		if ((canv_mousex > bubbles[i].x - bubbles[i].rad && canv_mousex < bubbles[i].x + bubbles[i].rad && canv_mousey > bubbles[i].y - bubbles[i].rad && canv_mousey < bubbles[i].y + bubbles[i].rad) || bubbles[i].rad > 40) {
			diedBubbles[diedBubbles.length] = new Newpopanim(bubbles[i]);
			bubbles[i].y = -Math.random()*bubbles[i].rad*10 - 100;
		}
	}
	
	window.requestAnimationFrame(draw);
}

function Newbubble (line, amount) {
	this.lineX = line;
	this.num = amount;
	this.rad = 1;
	this.targetrad = Math.random() * 10 + 10;
	this.speed = -(( 5 - this.rad/15)/2.8);
	this.x = line*dist_betw;
	this.y = window.innerHeight + this.num*50*(Math.random()*5 + 1);
	this.sin_f = Math.round(Math.random());
	this.cos_f = Math.round(Math.random());
	this.sin_corner = 360;
	this.cos_corner = 360;
	this.sin_chg = Math.random() * this.speed / 10 + .4;
	this.cos_chg = Math.random() * this.speed / 10 + .4;
	this.reflrad = this.rad/1.6;
	this.cornchg = 1;
	this.cornspd = .1;
	this.renderPosition = function () {
		if(this.rad < this.targetrad){
			this.rad += 1;
			this.reflrad = this.rad/1.6;
			this.speed = -(( 5 - this.rad/15)/2.5);
		}
		
		this.y += this.speed;
		if (this.y < -this.rad) {
			this.y = window.innerHeight + this.num*50*(Math.random()*5 + 1);
			this.x = line*dist_betw;
			this.rad = 1;
			this.targetrad = Math.random() * 10 + 10;
		}

		this.x += Math.sin(this.sin_corner * Math.PI / 180) * this.sin_f * .5 - Math.cos(this.cos_corner * Math.PI / 180) * this.cos_f*.3;

		this.sin_corner -= this.sin_chg;
		if (this.sin_corner < 0) 
			this.sin_corner = 360;

		this.cos_corner -= this.cos_chg;
		if (this.cos_corner < 0) 
			this.cos_corner = 360;

		this.cornchg += this.cornspd;
		if (this.cornchg > 20 || this.cornchg < 0)
			this.cornspd *= -1;
	}
}

function Newpopanim (diedB) {
	this.x = diedB.x;
	this.y = diedB.y;
	this.rad = diedB.rad
	this.close = this.rad;
	this.far = this.close*1.3;
	this.farspd = .09;
	this.closesdp = .1;
	this.renderPosition = function () {
		this.close += this.closesdp;
		this.far += this.farspd;
		return (this.far <= this.close) ? true : false;
	}
}

function findBubbles (iter) {
	let arr = [];

	for (let i = 0; i < bubbles.length; i++) {
		if (i == iter)
			continue;
		
		let raddistance = Math.max(bubbles[iter].rad + 0.5*bubbles[i].rad, bubbles[i].rad + 0.5*bubbles[iter].rad);
		if (Math.abs(bubbles[iter].x - bubbles[i].x) < raddistance && Math.abs(bubbles[iter].y - bubbles[i].y) < raddistance)
			arr[arr.length] = i;
	}

	return arr;
}

