let bibleWords = [];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('sentence-input');
    input.addEventListener('input', checkWords);

    // Load Bible words from JSON file
    loadBibleWords();
});

async function loadBibleWords() {
    try {
        const response = await fetch('words.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        bibleWords = await response.json();
        console.log('Bible words loaded successfully');
    } catch (error) {
        console.error('Error loading Bible words:', error);
    }
}

function checkWords() {
    const inputElement = document.getElementById('sentence-input');
    const sentence = inputElement.value.toLowerCase();
    const words = sentence.split(/\s+/).filter(word => word.length > 0);

    const highlightedSentence = words.map(word => {
        if (bibleWords.includes(word)) {
            return `<span class="bible-word">${word}</span>`;
        }
        return word;
    }).join(' ');

    // Display the highlighted text in a separate container
    const highlightedTextElement = document.getElementById('highlighted-text');
    if (highlightedTextElement) {
        highlightedTextElement.innerHTML = highlightedSentence;
    }

    const bibleWordCount = words.filter(word => bibleWords.includes(word)).length;

    displayResult(bibleWordCount, words.length);
    updateBackground(bibleWordCount, words.length);
}

function displayResult(bibleWordCount, totalWords) {
    let resultElement = document.getElementById('result');
    if (!resultElement) {
        resultElement = document.createElement('p');
        resultElement.id = 'result';
        document.querySelector('.container').appendChild(resultElement);
    }

    const percentage = (bibleWordCount / totalWords * 100).toFixed(2);
    resultElement.textContent = `${bibleWordCount} out of ${totalWords} words (${percentage}%) are found in the Bible.`;

    // Apply the "holy" effect
    const intensity = percentage / 100;
    resultElement.style.textShadow = `0 0 ${5 + intensity * 10}px rgba(255, 255, 255, ${intensity})`;
}

function updateBackground(bibleWordCount, totalWords) {
    const percentage = bibleWordCount / totalWords * 100;
    const container = document.querySelector('.container');

    let backgroundImage;
    if (percentage === 100) {
        backgroundImage = 'heaven.jpeg';
    } else if (percentage === 0) {
        backgroundImage = 'hell.jpeg';
    } else {
        backgroundImage = 'normal.jpeg';
    }

    container.style.backgroundImage = `url(${backgroundImage})`;

    // Calculate the opacity for gradual fading effect
    if (percentage > 0 && percentage < 100) {
        const heavenOpacity = percentage / 100;
        const hellOpacity = (100 - percentage) / 100;

        // Create the effect by blending images
        container.style.backgroundImage = `linear-gradient(
            rgba(255, 255, 255, ${heavenOpacity}), 
            rgba(255, 255, 255, ${hellOpacity})),
            url(${backgroundImage})`;
    } else {
        container.style.backgroundImage = `url(${backgroundImage})`;
    }

    // Gradual fade effect for smooth transitions
    container.style.transition = 'background-image 0.5s ease, background-color 0.5s ease';
}
