function trapezoidChartCoord(x, y) {
	x = x * ((6-y)/3);
	return [x+(2*y/3), y];
}

function triangleChartCoord(x, y) {
	x = x * 2* ((3-y)/3);
	return [x+(2*y/3), y];
}

function squareChartCoord(x, y) {
	return [x*2, y];
}

function formantChartCoord(x, y) {
	const nx = 1 - (x/2)*0.2;
	y = y*nx;
	x = x * 2* ((3-y)/3);
	return [x+(2*y/3), y];
}

const layoutFunction = {
	'square': squareChartCoord,
	'trapezoid': trapezoidChartCoord,
	'triangle': triangleChartCoord,
	'formant': formantChartCoord,
	'formant2': trapezoidChartCoord,
}

function drawSVG(svg, diphthongs, layout, size) {
	svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	svg.setAttribute('width', (size*4+64)+'px');
	svg.setAttribute('height', (size*3+32)+'px');
	svg.setAttribute('viewBox', `0 0 ${64+4*size} ${32+3*size}`);
	svg.setAttribute('aria-label', 'Vowel diagram');
	svg.setAttribute('class', 'vowel-chart-svg');

	let line = (x1,y1,x2,y2) => {
		const l = document.createElement("line");
		l.setAttribute('x1', String(x1));
		l.setAttribute('y1', String(y1));
		l.setAttribute('x2', String(x2));
		l.setAttribute('y2', String(y2));
		svg.appendChild(l);
	};

	const polygon = document.createElement("polygon");
	polygon.setAttribute("fill", `transparent`);
	svg.appendChild(polygon);

	if (layout == 'square') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+0*size},${16+3*size}`);
		line(32+2*size,16,32+2*size,16+3*size);
		line(32+4*size,16+1*size,32,16+1*size);
		line(32+4*size,16+2*size,32,16+2*size);
	} else if (layout == 'triangle') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+2*size},${16+3*size}`);
		line(32+2*size,16,32+2*size,16+3*size);
		line(32+3.33*size,16+1*size,32+0.66*size,16+1*size);
		line(32+2.69*size,16+2*size,32+1.32*size,16+2*size);
	} else if (layout == 'formant') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+2*size},${16+3*size}`);
		line(32+1.33*size,16,32+2*size,16+3*size);
		line(32+2.66*size,16,32+2*size,16+3*size);
		line(32+3.46*size,16+0.8*size,32+0.66*size,16+1*size);
		line(32+2.93*size,16+1.6*size,32+1.32*size,16+2*size);
	} else if (layout == 'formant2') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+2*size},${16+3*size}`);
		// line(32+2*size,16,32+3*size,16+3*size);
		line(32+4*size,16+1*size,32+0.66*size,16+1*size);
		line(32+4*size,16+2*size,32+1.32*size,16+2*size);
		line(32+1.33*size,16,32+3*size,16+3*size);
		line(32+2.69*size,16,32+3*size,16+3*size);
	} else {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+2*size},${16+3*size}`);
		line(32+2*size,16,32+3*size,16+3*size);
		line(32+4*size,16+1*size,32+0.66*size,16+1*size);
		line(32+4*size,16+2*size,32+1.32*size,16+2*size);
	}

	for (const [sx, sy, stx, sty] of diphthongs) {
		const tip_angle = Math.atan2(sty - sy, stx - sx);
		const polygon = document.createElement("polygon");
		svg.appendChild(polygon);

		const l = document.createElement("line");
		l.setAttribute('x1', String(32+sx*size));
		l.setAttribute('y1', String(16+sy*size));
		l.setAttribute('x2', String(32+stx*size));
		l.setAttribute('y2', String(16+sty*size));
		l.setAttribute('stroke-width', '1.6');
		svg.appendChild(l);

		const c = document.createElement("circle");
		c.setAttribute('cx', String(32+sx*size));
		c.setAttribute('cy', String(16+sy*size));
		c.setAttribute('r', '2.5');
		svg.appendChild(c);

		const [zx, zy] = [32+stx*size, 16+sty*size]

		polygon.setAttribute("points", `0,0 -35,-18 -25,0 -35,18`);
		polygon.setAttribute("transform", `translate(${zx}, ${zy}) rotate(${tip_angle/Math.PI*180}) scale(0.25)`);
	}
}

const renderVowels = (vowels, settings=DEFAULT_SETTINGS) => {
	settings.size = Number(settings.size) || DEFAULT_SETTINGS.size;
	settings.layout = settings.layout.toLowerCase();

	const trueMid = vowels.filter(v => v.x != 1&&v.y>0&&v.y<2.5);
	if (settings.trueMid && trueMid.every(v=>v.y==1)) {
		trueMid.forEach(v => v.y=1.5)
	}

	const positionFunc = layoutFunction[settings.layout] ?? trapezoidChartCoord;

	const container = document.createElement('div');
	container.setAttribute('class', 'vowel-chart-container');

	if (vowels.length == 0) return container.outerHTML;

	const svgEl = document.createElement("svg");
	container.appendChild(svgEl);
	const textFloat = document.createElement('div');
	textFloat.setAttribute('class', 'vowel-chart-text-float-container');
	container.appendChild(textFloat);

	const diphthongs = [];
	for (const vowel of vowels) {
		const [x, y] = positionFunc(vowel.x, vowel.y);
		let lx = x, ly = y;

		if (vowel.diphthong) {
			const [dx, dy] = positionFunc(vowel.diphthong[1], vowel.diphthong[2]);
			diphthongs.push([x, y, dx, dy]);
			lx = (x+Math.sign(x-dx)*0.3);
			ly = (y+Math.sign(y-dy)*0.3);
		}

		if (vowel.dot!='middle') {
			const dotEl = document.createElement('span');
			dotEl.setAttribute('class', 'vowel-chart-text-dot');
			dotEl.setAttribute('style', `left: ${(x*settings.size+32)-3}px; top: ${(y*settings.size+16)-3}px;`);
			textFloat.appendChild(dotEl);
		}
		const text = document.createElement('span');
		text.setAttribute('class', 'vowel-chart-text-float '+vowel.dot);
		text.setAttribute('style', `left: ${(lx*settings.size+32)+(vowel.dot=='left'?-4:vowel.dot=='right'?4:0)}px; top: ${(ly*settings.size+16)}px;`);
		text.innerText = vowel.label;
		textFloat.appendChild(text);
	}

	drawSVG(svgEl, diphthongs, settings.layout.toLowerCase(), settings.size);

	return container.outerHTML;
};