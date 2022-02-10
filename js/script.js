let dist_betw = 300;
let quan = Math.round(window.innerHeight/200); //How much bubbles on 1 line
let bubbles = [];
let canvas = document.getElementById("can_sec");

window.onload = function () {
	let count = Math.floor(document.documentElement.clientWidth/dist_betw);
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;

	for (let lines = 0; lines < count; lines++) {
		for (let i = 0; i < quan; i++)
			bubbles[bubbles.length] = new Newbubble(lines, i+1);
	}
	
	window.requestAnimationFrame(draw);
}

function draw () {
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);

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

		let arr = findBubbles(i);
		if (arr) {
			for (let a of arr) {
				bubbles[i].targetrad += bubbles[a].rad;
				bubbles[a].y = -bubbles[a].rad;
			}
		}
	}
	
	window.requestAnimationFrame(draw);
}

function Newbubble (line, amount) {
	this.lineX = line;
	this.num = amount;
	this.rad = 1;
	this.targetrad = Math.random() * 10 + 10;
	this.speed = -(( 5 - this.rad/10)/2.5);
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

function findBubbles (iter) {
	let arr = [];

	for (let i = 0; i < bubbles.length; i++) {
		if (i == iter)
			continue;
		
		if (Math.abs(bubbles[iter].x - bubbles[i].x) < Math.max(bubbles[iter].rad, bubbles[i].rad) && Math.abs(bubbles[iter].y - bubbles[i].y) < Math.max(bubbles[iter].rad, bubbles[i].rad)) {
			arr[arr.length] = i;
		}
	}

	return arr;
}

