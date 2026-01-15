const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
let currentLetter = null;

// QUIZ STATE
let quizScore = 0;
let quizQuestionCount = 0;
const MAX_QUESTIONS = 10;

const tabColors = [
	'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-lime-400', 
	'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400',
	'bg-sky-400', 'bg-blue-400', 'bg-indigo-400', 'bg-violet-400',
	'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400'
];

const spiralContainer = document.getElementById('spiral-container');
for(let i=0; i<20; i++) {
	spiralContainer.innerHTML += `<div class="spiral-hole"><div class="spiral-ring"></div></div>`;
}

function speak(text) {
	if (!('speechSynthesis' in window)) return;
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'it-IT';
	utterance.rate = 0.95;
	let voices = window.speechSynthesis.getVoices();
	const italianVoices = voices.filter(v => v.lang.includes('it'));
	if (italianVoices.length > 0) {
		const bestVoice = 
			italianVoices.find(v => v.name.includes("Google italiano")) || 
			italianVoices.find(v => v.name.includes("Alice")) || 
			italianVoices.find(v => v.name.includes("Elsa")) || 
			italianVoices[0];
		if (bestVoice) utterance.voice = bestVoice;
	}
	window.speechSynthesis.speak(utterance);
}

function speakDefinition(word) {
	const def = definitionCache[word];
	if (!def) return;
	const text = `${def.word}. ${def.category}. ${def.definition}. Esempio: ${def.example}`;
	speak(text);
}

function renderNav() {
	const container = document.getElementById('nav-container');
	container.innerHTML = alphabet.map((letter, i) => {
		const isSelected = currentLetter === letter;
		const colorClass = tabColors[i % tabColors.length];
		const buttonClass = isSelected 
			? `w-full h-10 ${colorClass} text-white shadow-md translate-x-2 rounded-l-lg z-20`
			: `w-3/4 h-10 ${colorClass} bg-opacity-30 text-slate-600 hover:bg-opacity-80 hover:text-white hover:w-full rounded-l-lg transition-all`;

		return `<button onclick="showLetter('${letter}')" class="${buttonClass} flex-shrink-0 flex items-center justify-center text-lg font-bold relative mb-1">
			<span>${letter}</span>
		</button>`;
	}).join('');
}

function showHome() {
	currentLetter = null;
	renderNav();
	document.getElementById('main-content').className = "flex-1 relative overflow-y-auto h-full bg-notebook";
	document.getElementById('main-content').innerHTML = `
		<div class="flex flex-col items-center justify-center min-h-full p-8 text-center bg-white/50 backdrop-blur-sm">
			<div class="bg-white border-4 border-blue-500 rounded-3xl p-12 shadow-xl max-w-2xl transform rotate-1">
				<div class="bg-blue-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 text-blue-500">
					<svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
				</div>
				<h2 class="text-blue-500 font-bold uppercase tracking-widest text-sm mb-2 font-hand">Scuola Secondaria di Primo Grado Ovidio</h2>
				<h1 class="text-6xl md:text-7xl font-bold text-slate-800 mb-2 tracking-tight">Glossario</h1>
				<h1 class="text-5xl md:text-6xl font-hand font-bold text-blue-600 mb-8 transform -rotate-2">Geniale 2A</h1>
				<div class="w-full h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-8"></div>
				<p class="text-xl text-slate-600 font-hand leading-relaxed">"Il tuo compagno di banco digitale per scoprire parole nuove ogni giorno!"</p>
				<div class="mt-12 inline-block bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-bold text-sm border border-yellow-200">Anno Scolastico 2025/2026</div>
			</div>
		</div>
	`;
}

function showLetter(letter) {
	currentLetter = letter;
	renderNav();
	document.getElementById('main-content').className = "flex-1 relative overflow-y-auto h-full bg-notebook";
	const words = wordCache[letter] || [];
	const borderClass = tabColors[alphabet.indexOf(letter) % tabColors.length].replace('bg-', 'border-');

	let content = `
		<div class="p-8 md:p-12 min-h-full">
			<div class="flex items-center justify-between mb-8 pb-4 border-b-4 ${borderClass} border-opacity-30">
				<div class="flex items-center gap-4">
					<div class="w-16 h-16 rounded-xl ${tabColors[alphabet.indexOf(letter) % tabColors.length]} flex items-center justify-center text-white text-4xl font-bold shadow-lg">${letter}</div>
					<div>
						<h2 class="text-3xl font-bold text-slate-800">Parole con la ${letter}</h2>
						<p class="text-slate-500 font-hand text-lg">Indice del glossario</p>
					</div>
				</div>
				<button onclick="showHome()" class="md:hidden text-slate-400 hover:text-blue-600">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
				</button>
			</div>
	`;

	if (words.length === 0) {
		content += `<div class="flex flex-col items-center justify-center py-20 opacity-50"><div class="text-6xl mb-4">📝</div><p class="font-hand text-2xl text-slate-500">Nessuna parola qui... per ora!</p></div>`;
	} else {
		content += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
		words.forEach(word => {
			const safeWord = word.replace(/'/g, "\'");
			content += `
			<div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex justify-between items-center group" onclick="showWord('${safeWord}')">
				<div class="flex items-center gap-3">
					 <div class="w-2 h-2 rounded-full ${tabColors[alphabet.indexOf(letter) % tabColors.length]}"></div>
					 <span class="text-xl font-bold text-slate-700 group-hover:text-blue-600 capitalize">${word}</span>
				</div>
				<button onclick="event.stopPropagation(); speak('${safeWord}')" class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" /></svg>
				</button>
			</div>`;
		});
		content += `</div>`;
	}
	content += `</div>`;
	document.getElementById('main-content').innerHTML = content;
}

function showWord(word) {
	const def = definitionCache[word];
	if (!def) return;
	const safeWordKey = word.replace(/'/g, "\'");
	document.getElementById('main-content').className = "flex-1 relative overflow-y-auto h-full bg-notebook";
	let content = `
		<div class="p-8 md:p-12 max-w-5xl mx-auto animate-fadeIn">
			<div class="flex justify-between items-center mb-6">
				<button onclick="showLetter('${currentLetter}')" class="flex items-center text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-xs gap-2 transition-colors bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
					Indice
				</button>
				<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">${def.category}</span>
			</div>
			<div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
				<div class="h-2 w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
				<div class="p-8 md:p-12">
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-slate-100">
						<div><h1 class="text-5xl md:text-6xl font-black text-slate-800 capitalize mb-2">${def.word}</h1></div>
						<button onclick="speakDefinition('${safeWordKey}')" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" /></svg> Ascolta
						</button>
					</div>
					<div class="flex flex-col md:flex-row gap-8">
						 <div class="flex-1 space-y-6">
							<div class="text-xl text-slate-700 leading-relaxed"><span class="font-bold text-blue-600">Definizione:</span> <br/>${def.definition}</div>
							<div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl relative">
								<span class="absolute -top-3 -left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm transform -rotate-2">ESEMPIO</span>
								<p class="text-lg text-slate-700 font-hand italic text-2xl">"${def.example}"</p>
							</div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
								<div class="bg-slate-50 p-4 rounded-lg">
									<h3 class="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">Sinonimi</h3>
									<div class="flex flex-wrap gap-2">${def.synonyms.map(s => `<span class="px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 text-sm">${s}</span>`).join('')}</div>
								</div>
								${def.funFact ? `<div class="bg-indigo-50 p-4 rounded-lg"><h3 class="font-bold text-indigo-400 text-xs uppercase tracking-wider mb-2">Curiosità</h3><p class="text-indigo-900 text-sm">${def.funFact}</p></div>` : ''}
							</div>
						 </div>
						 ${def.imageUrl ? `<div class="w-full md:w-1/3 flex-shrink-0"><div class="bg-white p-2 border border-slate-200 shadow-lg rounded-xl transform rotate-2 hover:rotate-0 transition-transform duration-500"><div class="aspect-square bg-slate-100 rounded-lg overflow-hidden relative"><img src="${def.imageUrl}" class="w-full h-full object-contain" /></div><div class="mt-2 text-center text-xs text-slate-400 font-mono">Fig. 1</div></div></div>` : ''}
					</div>
				</div>
			</div>
		</div>
	`;
	document.getElementById('main-content').innerHTML = content;
}

// --- LOGICA ESERCIZI ---

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function checkAnswer(selectedWord, correctWord) {
	const feedbackEl = document.getElementById('quiz-feedback');
	const btns = document.querySelectorAll('.quiz-option');
	
	btns.forEach(btn => {
		if(btn.dataset.word === correctWord) {
			btn.classList.add('bg-green-500', 'text-white', 'border-green-600');
			btn.classList.remove('bg-white', 'hover:bg-blue-50');
		} else if (btn.dataset.word === selectedWord && selectedWord !== correctWord) {
			btn.classList.add('bg-red-500', 'text-white', 'border-red-600');
			btn.classList.remove('bg-white', 'hover:bg-blue-50');
		}
		btn.disabled = true;
	});

	if (selectedWord === correctWord) {
		quizScore++;
		feedbackEl.innerHTML = '<div class="text-green-600 font-bold text-xl animate-bounce">✨ Bravissimo!</div>';
	} else {
		feedbackEl.innerHTML = '<div class="text-red-500 font-bold text-xl">Sbagliato. Era: ' + correctWord + '</div>';
	}
	
	quizQuestionCount++;
	document.getElementById('next-btn').classList.remove('hidden');
}

function startGym() {
	// Init State
	quizScore = 0;
	quizQuestionCount = 0;
	
	currentLetter = null;
	renderNav();
	const main = document.getElementById('main-content');
	main.className = "flex-1 relative overflow-y-auto h-full bg-grid-paper";
	
	const allWords = Object.keys(definitionCache);

	// Check if enough words
	if (allWords.length < 4) {
		 main.innerHTML = `
			<div class="flex flex-col items-center justify-center min-h-full p-8 text-center">
				<div class="text-6xl mb-4">🚧</div>
				<h2 class="text-2xl font-bold text-slate-700 mb-2">Palestra Chiusa!</h2>
				<p class="text-slate-500">Servono almeno 4 parole nel glossario per generare gli esercizi.</p>
			</div>
		`;
		return;
	}

	// Show Start Screen
	main.innerHTML = `
		<div class="flex flex-col items-center justify-center min-h-full p-8 text-center">
			<div class="bg-white p-12 rounded-3xl shadow-xl border-4 border-orange-200 max-w-md w-full">
				<div class="text-6xl mb-6">🏋️‍♀️</div>
				<h1 class="text-4xl font-black text-slate-800 mb-2 font-hand">Verifica Geniale</h1>
				<p class="text-slate-600 mb-8">Rispondi a 10 domande per scoprire il tuo voto!</p>
				
				<button onclick="nextQuestion()" class="w-full bg-orange-500 text-white font-bold text-xl py-4 rounded-xl shadow-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all">
					INIZIA ORA
				</button>
			</div>
		</div>
	`;
}

function showResults() {
	const main = document.getElementById('main-content');
	
	let message = "";
	let stampColor = "";
	let stampText = "";

	if (quizScore === 10) {
		message = "ECCELLENTE! Sei un genio delle parole!";
		stampColor = "text-green-600 border-green-600";
		stampText = "OTTIMO";
	} else if (quizScore >= 8) {
		 message = "Bravissimo! Ottimo lavoro.";
		 stampColor = "text-blue-600 border-blue-600";
		 stampText = "DISTINTO";
	} else if (quizScore >= 6) {
		 message = "Bravo, hai superato la prova.";
		 stampColor = "text-orange-600 border-orange-600";
		 stampText = "SUFFICIENTE";
	} else {
		 message = "Puoi fare di meglio! Ripassa le parole.";
		 stampColor = "text-red-600 border-red-600";
		 stampText = "NON SUFFICIENTE";
	}

	main.innerHTML = `
		<div class="flex flex-col items-center justify-center min-h-full p-8 text-center">
			 <div class="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-slate-200 max-w-lg w-full relative overflow-hidden">
				<div class="absolute top-0 left-0 w-full h-4 bg-slate-800"></div>
				
				<h2 class="text-3xl font-bold text-slate-800 mb-2 uppercase tracking-widest">Pagella</h2>
				<p class="text-slate-400 text-sm mb-8">Glossario Geniale 2A</p>

				<div class="text-8xl font-black text-slate-800 mb-4">${quizScore}<span class="text-4xl text-slate-400">/10</span></div>
				
				<p class="text-xl text-slate-600 font-hand mb-6">${message}</p>

				<div class="stamp ${stampColor} text-4xl transform -rotate-6 opacity-80 mb-8">
					${stampText}
				</div>

				<button onclick="startGym()" class="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">
					Riprova Test ↻
				</button>
			 </div>
		</div>
	`;
}

function nextQuestion() {
	const main = document.getElementById('main-content');
	
	if (quizQuestionCount >= MAX_QUESTIONS) {
		showResults();
		return;
	}

	const allWords = Object.keys(definitionCache);
	
	// Pick Random
	const targetWord = allWords[Math.floor(Math.random() * allWords.length)];
	const correctDef = definitionCache[targetWord];
	
	// Distractors
	const distractors = [];
	while(distractors.length < 3) {
		const w = allWords[Math.floor(Math.random() * allWords.length)];
		if (w !== targetWord && !distractors.includes(w)) {
			distractors.push(w);
		}
	}
	const options = shuffleArray([targetWord, ...distractors]);

	// Note: Added min-h to allow scrolling if content is long, removed overflow-hidden on card
	main.innerHTML = `
		<div class="w-full max-w-3xl mx-auto p-4 md:p-8 min-h-full flex flex-col justify-center">
			
			<div class="mb-6 text-center">
				<div class="inline-block px-4 py-1 bg-white rounded-full text-slate-500 font-bold text-sm shadow-sm border border-slate-200">
					Domanda ${quizQuestionCount + 1} di ${MAX_QUESTIONS}
				</div>
			</div>

			<div class="bg-white p-6 md:p-10 rounded-2xl shadow-lg border-2 border-slate-200 relative">
				<div class="absolute top-0 left-0 w-full h-2 bg-orange-400 rounded-t-2xl"></div>
				
				<div class="mb-8">
					<span class="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-4 uppercase">Indovina la parola</span>
					<h3 class="text-xl md:text-2xl text-slate-800 font-medium leading-relaxed">
						"${correctDef.definition}"
					</h3>
					 <p class="mt-4 text-slate-400 italic text-sm">Categoria: ${correctDef.category}</p>
				</div>

				<div class="grid grid-cols-1 gap-3 mb-6">
					${options.map(opt => `
						<button 
							class="quiz-option p-4 rounded-xl border-2 border-slate-100 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 font-bold text-lg transition-all text-left capitalize"
							data-word="${opt}"
							onclick="checkAnswer('${opt.replace(/'/g, "\'")}', '${targetWord.replace(/'/g, "\'")}')"
						>
							${opt}
						</button>
					`).join('')}
				</div>

				<div id="quiz-feedback" class="h-8 text-center mb-4"></div>

				<div class="text-center">
					 <button id="next-btn" onclick="nextQuestion()" class="hidden bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition-colors">
						${(quizQuestionCount + 1) === MAX_QUESTIONS ? 'Vedi Risultato' : 'Prossima Domanda'} ➔
					 </button>
				</div>
			</div>
		</div>
	`;
}

showHome();

window.speak=speak;
window.speakDefinition=speakDefinition;
window.renderNav=renderNav;
window.showHome=showHome;
window.showLetter=showLetter;
window.showWord=showWord;
window.shuffleArray=shuffleArray;
window.checkAnswer=checkAnswer;
window.startGym=startGym;
window.showResults=showResults;
window.nextQuestion=nextQuestion;