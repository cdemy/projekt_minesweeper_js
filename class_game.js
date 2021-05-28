function randomValue(max) {
	return Math.floor(Math.random() * max);
}

class Feld {
	constructor() {
		this.aufgedeckt = false;
		this.mine = false;
		this.value = 0;
	}
}

class Game {
	constructor(breite, hoehe, minen) {
		// Die Felder werden initialisiert
		this.breite = breite;
		this.hoehe = hoehe;
		this.minen = minen;
        this.minenVerdeckt = minen;
        this.verloren = false;
		this.felder = new Array();
		for (let i = 0; i < breite; i++) {
			this.felder[i] = [];
			for (let j = 0; j < hoehe; j++) {
				this.felder[i][j] = new Feld();
			}
		}
		console.log(this.felder);
		// Die Minen werden verteilt
		for (let i = 0; i < minen; i++) {
			let mineGesetzt = false;
			while (!mineGesetzt) {
				let x = randomValue(breite);
				let y = randomValue(hoehe);
				if (!this.felder[x][y].mine) {
					this.felder[x][y].mine = true;
					mineGesetzt = true;
				}
			}
		}

		// Die Values werden berechnet
		for (let x = 0; x < breite; x++) {
			for (let y = 0; y < hoehe; y++) {
				// Nur Felder ohne Mine können ein Value haben
				if (!this.felder[x][y].mine) {
					this.felder[x][y].value = this.calculateValue(x, y);
				}
			}
		}
	}

	calculateValue(x, y) {
		let iValue = 0;
		if (x > 0) {
			// links mitte
			if (this.felder[x - 1][y].mine) {
				iValue++;
			}
			if (y > 0) {
				// links oben
				if (this.felder[x - 1][y - 1].mine) {
					iValue++;
				}
			}
			if (y < this.hoehe - 1) {
				// links unten
				if (this.felder[x - 1][y + 1].mine) {
					iValue++;
				}
			}
		}
		if (x < this.breite - 1) {
			// rechts mitte
			if (this.felder[x + 1][y].mine) {
				iValue++;
			}
			if (y > 0) {
				// rechts oben
				if (this.felder[x + 1][y - 1].mine) {
					iValue++;
				}
			}
			if (y < this.hoehe - 1) {
				// rechts unten
				if (this.felder[x + 1][y + 1].mine) {
					iValue++;
				}
			}
		}
		if (y > 0) {
			// mitte oben
			if (this.felder[x][y - 1].mine) {
				iValue++;
			}
		}
		if (y < this.hoehe - 1) {
			// mitte unten
			if (this.felder[x][y + 1].mine) {
				iValue++;
			}
		}
		return iValue;
	}

    clickFeld(x,y) {
        if (this.verloren) {
            alert('Sie haben schon verloren. Starten Sie ein neues Spiel.');
            return;
        }
        // Click auf Mine
        if (this.felder[x][y].mine){
            this.verloren = true;
            alert('BOOM! Sie haben leider verloren!');
            return;
        }
        this.aufgedeckt = true;
        // Click auf Feld mit Value 0
        if (this.felder[x][y].value==0) {
            this.openLeerfelder(x,y);
            return;
        }
    }

	getHTML() {
		var html = "";
		var htmlColumns = "";
		// Zuerst legen wir die TemplateColumns
		for (let i = 0; i < this.breite; i++) {
			htmlColumns += " 1fr";
			htmlColumns.trim();
		}
		html += '<div id="spielfeld_inner" class="' + (this.verloren ? 'verloren' : 'aktiv') + '" style="grid-template-columns:' + htmlColumns + '">';
		// Jetzt erstmal ein DIV pro Spielfeld: Inhalt = Value
		for (let x = 0; x < this.breite; x++) {
			for (let y = 0; y < this.hoehe; y++) {
				html +=
					'<div id="feld_' +
					x +
					"_" +
					y +
					'" class="' +
					(this.felder[x][y].aufgedeckt ? "open" : "closed") +
					'" onclick="clickFeld(' +
					x +
					"," +
					y +
					')">' +
					(this.felder[x][y].mine ? "M" : this.felder[x][y].value) +
					"</div>";
			}
		}
		html += "</div>";
		return html;
	}
}
