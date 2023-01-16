// From https://github.com/djvanderlaan/rijksdriehoek/blob/master/js/rijksdriehoek.js
import { geoProjection as projection } from 'd3-geo';

export function rijksdriehoek(λ, φ) {
	// Coordinates of origin (Amersfoort)
	let x0 = 155000.0;
	let y0 = 463000.0;
	let φ0 = 52.1551744;
	let λ0 = 5.38720621;
	let R = [
		{ p: 0, q: 1, R: 190094.945 },
		{ p: 1, q: 1, R: -11832.228 },
		{ p: 2, q: 1, R: -114.221 },
		{ p: 0, q: 3, R: -32.391 },
		{ p: 1, q: 0, R: -0.705 },
		{ p: 3, q: 1, R: -2.34 },
		{ p: 1, q: 3, R: -0.608 },
		{ p: 0, q: 2, R: -0.008 },
		{ p: 2, q: 3, R: 0.148 }
	];
	let S = [
		{ p: 1, q: 0, S: 309056.544 },
		{ p: 0, q: 2, S: 3638.893 },
		{ p: 2, q: 0, S: 73.077 },
		{ p: 1, q: 2, S: -157.984 },
		{ p: 3, q: 0, S: 59.788 },
		{ p: 0, q: 1, S: 0.433 },
		{ p: 2, q: 2, S: -6.439 },
		{ p: 1, q: 1, S: -0.032 },
		{ p: 0, q: 4, S: 0.092 },
		{ p: 1, q: 4, S: -0.054 }
	];
	let dφ = 0.36 * ((180 * φ) / Math.PI - φ0);
	let dλ = 0.36 * ((180 * λ) / Math.PI - λ0);
	let x = x0;
	for (let i = 0; i < R.length; ++i) {
		let p = R[i].p;
		let q = R[i].q;
		let r = R[i].R;
		x += r * Math.pow(dφ, p) * Math.pow(dλ, q);
	}
	let y = y0;
	for (let i = 0; i < S.length; ++i) {
		let p = S[i].p;
		let q = S[i].q;
		let s = S[i].S;
		y += s * Math.pow(dφ, p) * Math.pow(dλ, q);
	}
	return [x, y];
}

rijksdriehoek.invert = function (x, y) {
	// Coordinates of origin (Amersfoort)
	let x0 = 155000.0;
	let y0 = 463000.0;
	let φ0 = 52.1551744;
	let λ0 = 5.38720621;
	let K = [
		{ p: 0, q: 1, K: 3235.65389 },
		{ p: 2, q: 0, K: -32.58297 },
		{ p: 0, q: 2, K: -0.2475 },
		{ p: 2, q: 1, K: -0.84978 },
		{ p: 0, q: 3, K: -0.0655 },
		{ p: 2, q: 2, K: -0.01709 },
		{ p: 1, q: 0, K: -0.00738 },
		{ p: 4, q: 0, K: 0.0053 },
		{ p: 2, q: 3, K: -0.00039 },
		{ p: 4, q: 1, K: 0.00033 },
		{ p: 1, q: 1, K: -0.00012 }
	];
	let L = [
		{ p: 1, q: 0, L: 5260.52916 },
		{ p: 1, q: 1, L: 105.94684 },
		{ p: 1, q: 2, L: 2.45656 },
		{ p: 3, q: 0, L: -0.81885 },
		{ p: 1, q: 3, L: 0.05594 },
		{ p: 3, q: 1, L: -0.05607 },
		{ p: 0, q: 1, L: 0.01199 },
		{ p: 3, q: 2, L: -0.00256 },
		{ p: 1, q: 4, L: 0.00128 }
	];
	let dx = (x - x0) / 1e5;
	let dy = (y - y0) / 1e5;
	let φ = φ0;
	for (let i = 0; i < K.length; ++i) {
		let p = K[i].p;
		let q = K[i].q;
		let k = K[i].K;
		φ += (k * Math.pow(dx, p) * Math.pow(dy, q)) / 3600;
	}
	let λ = λ0;
	for (let i = 0; i < L.length; ++i) {
		let p = L[i].p;
		let q = L[i].q;
		let l = L[i].L;
		λ += (l * Math.pow(dx, p) * Math.pow(dy, q)) / 3600;
	}
	return [(180 * λ) / Math.PI, (180 * φ) / Math.PI];
};

export default function () {
	return projection(rijksdriehoek);
}
