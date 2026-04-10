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
}

function drawSVG(svg, layout, size) {
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
	} else {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+2*size},${16+3*size}`);
		line(32+2*size,16,32+3*size,16+3*size);
		line(32+4*size,16+1*size,32+0.66*size,16+1*size);
		line(32+4*size,16+2*size,32+1.32*size,16+2*size);
	}
}

const renderVowels = (vowels, settings=DEFAULT_SETTINGS) => {
	settings.size = Number(settings.size) || DEFAULT_SETTINGS.size;
	settings.layout = settings.layout.toLowerCase();

	const positionFunc = layoutFunction[settings.layout] ?? trapezoidChartCoord;

	const container = document.createElement('div');
	container.setAttribute('class', 'vowel-chart-container');

	const svgEl = document.createElement("svg");
	container.appendChild(svgEl);
	const textFloat = document.createElement('div');
	textFloat.setAttribute('class', 'vowel-chart-text-float-container');
	container.appendChild(textFloat);


	for (const vowel of vowels) {
		const [x, y] = positionFunc(vowel.x, vowel.y);

		if (vowel.dot!='middle') {
			const dotEl = document.createElement('span');
			dotEl.setAttribute('class', 'vowel-chart-text-dot');
			dotEl.setAttribute('style', `left: ${(x*settings.size+32)-3}px; top: ${(y*settings.size+16)-3}px;`);
			textFloat.appendChild(dotEl);
		}
		const text = document.createElement('span');
		text.setAttribute('class', 'vowel-chart-text-float '+vowel.dot);
		text.setAttribute('style', `left: ${(x*settings.size+32)+(vowel.dot=='left'?-4:vowel.dot=='right'?4:0)}px; top: ${(y*settings.size+16)}px;`);
		text.innerText = vowel.label;
		textFloat.appendChild(text);
	}

	drawSVG(svgEl, settings.layout.toLowerCase(), settings.size);

	return container.outerHTML;
};