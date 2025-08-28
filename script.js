 let currentChapter = 1;
        let score = 0;
        let exerciseIndex = 0;
        const maxChapters = 5;
        
        const exercises = [
            {
                question: "A friend sends you this message:",
                text: "I'm so happy! I got an A+ on my test!",
                correct: "happy",
                explanation: "Great job! This message has happy words like 'so happy' and 'A+' - these show excitement and joy from the Happy Kingdom! 😊"
            },
            {
                question: "Your classmate writes:",
                text: "I'm worried about tomorrow's math quiz.",
                correct: "sad",
                explanation: "Excellent! The word 'worried' is a feeling from the Sad Kingdom - it shows concern and anxiety. 😢"
            },
            {
                question: "You see this in a book:",
                text: "The library opens at 9 AM every day.",
                correct: "neutral",
                explanation: "Perfect! This sentence just gives information without showing emotions - it's from the Neutral Kingdom! 😐"
            },
            {
                question: "A review says:",
                text: "This movie was terrible and boring!",
                correct: "sad",
                explanation: "Well done! Words like 'terrible' and 'boring' are negative feelings from the Sad Kingdom. 😢"
            },
            {
                question: "Someone posts:",
                text: "I absolutely love this amazing ice cream!",
                correct: "happy",
                explanation: "Fantastic! 'Absolutely love' and 'amazing' are super positive words from the Happy Kingdom! 😊"
            }
        ];

        function nextChapter() {
            if (currentChapter < maxChapters) {
                document.getElementById(`chapter${currentChapter}`).classList.remove('active');
                currentChapter++;
                document.getElementById(`chapter${currentChapter}`).classList.add('active');
                updateNavigation();
                
                // Scroll to top of the page smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                if (currentChapter === 3) {
                    startExercises();
                }
            }
        }

        function prevChapter() {
            if (currentChapter > 1) {
                document.getElementById(`chapter${currentChapter}`).classList.remove('active');
                currentChapter--;
                document.getElementById(`chapter${currentChapter}`).classList.add('active');
                updateNavigation();
                
                // Scroll to top of the page smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }

        function updateNavigation() {
            document.getElementById('prev-btn').disabled = currentChapter === 1;
            document.getElementById('next-btn').style.display = currentChapter === maxChapters ? 'none' : 'inline-block';
            document.getElementById('chapter-info').textContent = `Chapter ${currentChapter} of ${maxChapters}`;
        }

        function startExercises() {
            exerciseIndex = 0;
            score = 0;
            showExercise();
        }

        function showExercise() {
            if (exerciseIndex >= exercises.length) {
                document.getElementById('practice-next').style.display = 'block';
                updateProgress();
                return;
            }

            const exercise = exercises[exerciseIndex];
            const container = document.getElementById('exercise-container');
            
            container.innerHTML = `
                <div class="exercise-card">
                    <div class="exercise-question">
                        ${exercise.question}
                    </div>
                    <div class="sample-text">
                        "${exercise.text}"
                    </div>
                    <p style="font-size: 1.2em; text-align: center; margin: 20px 0;">
                        Which emotion kingdom does this come from?
                    </p>
                    <div class="emotion-buttons">
                        <button class="emotion-btn happy" onclick="checkAnswer('happy')">
                            😊 Happy Kingdom
                        </button>
                        <button class="emotion-btn sad" onclick="checkAnswer('sad')">
                            😢 Sad Kingdom
                        </button>
                        <button class="emotion-btn neutral" onclick="checkAnswer('neutral')">
                            😐 Neutral Kingdom
                        </button>
                    </div>
                    <div id="feedback" class="feedback"></div>
                </div>
            `;
            updateProgress();
        }

        function checkAnswer(selected) {
            const exercise = exercises[exerciseIndex];
            const feedback = document.getElementById('feedback');
            const buttons = document.querySelectorAll('.emotion-btn');
            
            // Disable all buttons
            buttons.forEach(btn => btn.disabled = true);
            
            if (selected === exercise.correct) {
                score++;
                feedback.innerHTML = `
                    <div style="font-size: 1.5em; margin-bottom: 15px;">🎉 Correct! 🎉</div>
                    <p>${exercise.explanation}</p>
                `;
                feedback.className = 'feedback correct';
            } else {
                feedback.innerHTML = `
                    <div style="font-size: 1.5em; margin-bottom: 15px;">🤔 Not quite right, but that's okay! 🤔</div>
                    <p>${exercise.explanation}</p>
                    <p style="margin-top: 10px;"><strong>Keep learning - you're doing great!</strong></p>
                `;
                feedback.className = 'feedback incorrect';
            }
            
            feedback.style.display = 'block';
            document.getElementById('score').textContent = score;
            
            // Show next exercise after delay
            setTimeout(() => {
                exerciseIndex++;
                showExercise();
            }, 3000);
        }

        function updateProgress() {
            const progress = Math.min((exerciseIndex / exercises.length) * 100, 100);
            document.getElementById('progress').style.width = progress + '%';
            document.getElementById('progress-text').textContent = `${Math.min(exerciseIndex, exercises.length)} / ${exercises.length}`;
        }

        function tryExample(element) {
            const text = element.textContent.replace(/"/g, '');
            document.getElementById('user-text').value = text;
            analyzeText();
        }

        function analyzeText() {
            const text = document.getElementById('user-text').value.trim();
            if (!text) {
                alert('Please type a sentence first! 📝');
                return;
            }

            const analysis = performSentimentAnalysis(text);
            displayAnalysis(text, analysis);
        }

        function performSentimentAnalysis(text) {
            const positiveWords = [
                'love', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic', 'excellent', 
                'happy', 'joy', 'excited', 'thrilled', 'delighted', 'pleased', 'glad', 
                'beautiful', 'perfect', 'brilliant', 'outstanding', 'superb', 'magnificent',
                'good', 'nice', 'fun', 'cool', 'sweet', 'adorable', 'cute', 'lovely',
                'best', 'favorite', 'incredible', 'spectacular', 'marvelous', 'fabulous'
            ];
            
            const negativeWords = [
                'hate', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'disgusting',
                'sad', 'angry', 'mad', 'upset', 'worried', 'scared', 'afraid', 'nervous',
                'disappointed', 'frustrated', 'annoyed', 'irritated', 'furious', 'depressed',
                'boring', 'stupid', 'dumb', 'annoying', 'painful', 'hurt', 'sick',
                'difficult', 'hard', 'challenging', 'problem', 'trouble', 'wrong', 'broken'
            ];

            const words = text.toLowerCase().split(/\s+/);
            let positiveScore = 0;
            let negativeScore = 0;
            let foundWords = { positive: [], negative: [] };

            words.forEach(word => {
                const cleanWord = word.replace(/[^\w]/g, '');
                if (positiveWords.includes(cleanWord)) {
                    positiveScore++;
                    foundWords.positive.push(cleanWord);
                } else if (negativeWords.includes(cleanWord)) {
                    negativeScore++;
                    foundWords.negative.push(cleanWord);
                }
            });

            let sentiment, kingdom, emoji, color;
            if (positiveScore > negativeScore) {
                sentiment = 'Positive';
                kingdom = 'Happy Kingdom';
                emoji = '😊';
                color = '#27ae60';
            } else if (negativeScore > positiveScore) {
                sentiment = 'Negative';
                kingdom = 'Sad Kingdom';
                emoji = '😢';
                color = '#e74c3c';
            } else {
                sentiment = 'Neutral';
                kingdom = 'Neutral Kingdom';
                emoji = '😐';
                color = '#f39c12';
            }

            return {
                sentiment,
                kingdom,
                emoji,
                color,
                positiveScore,
                negativeScore,
                foundWords,
                totalWords: words.length
            };
        }

        function displayAnalysis(originalText, analysis) {
            const resultsDiv = document.getElementById('analysis-results');
            
            // Highlight emotional words in the text
            let highlightedText = originalText;
            analysis.foundWords.positive.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                highlightedText = highlightedText.replace(regex, `<span class="word-highlight positive-word">${word}</span>`);
            });
            analysis.foundWords.negative.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                highlightedText = highlightedText.replace(regex, `<span class="word-highlight negative-word">${word}</span>`);
            });

            resultsDiv.innerHTML = `
                <div class="analysis-result">
                    <h3 style="color: ${analysis.color}; font-size: 1.8em; margin-bottom: 20px;">
                        ${analysis.emoji} Magic Mirror Result: ${analysis.kingdom}! ${analysis.emoji}
                    </h3>
                    
                    <div style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 15px; margin: 20px 0;">
                        <h4 style="margin-bottom: 15px;">🔮 Your sentence with magical word highlights:</h4>
                        <div style="font-size: 1.3em; line-height: 1.6;">${highlightedText}</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                        <div style="background: rgba(46, 204, 113, 0.2); padding: 15px; border-radius: 10px; text-align: center;">
                            <strong>Happy Words Found:</strong><br>
                            <span style="font-size: 1.5em; color: #27ae60;">${analysis.positiveScore}</span>
                        </div>
                        <div style="background: rgba(231, 76, 60, 0.2); padding: 15px; border-radius: 10px; text-align: center;">
                            <strong>Sad Words Found:</strong><br>
                            <span style="font-size: 1.5em; color: #e74c3c;">${analysis.negativeScore}</span>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 15px; margin-top: 20px;">
                        <h4 style="margin-bottom: 15px;">🧠 How the Magic Mirror thinks:</h4>
                        <p style="font-size: 1.1em; line-height: 1.6;">
                            "I found ${analysis.positiveScore + analysis.negativeScore} magical emotion words out of ${analysis.totalWords} total words. 
                            ${analysis.positiveScore > analysis.negativeScore ? 
                                `Since I found more happy words (${analysis.positiveScore}) than sad words (${analysis.negativeScore}), this sentence comes from the Happy Kingdom! 😊` :
                                analysis.negativeScore > analysis.positiveScore ?
                                `Since I found more sad words (${analysis.negativeScore}) than happy words (${analysis.positiveScore}), this sentence comes from the Sad Kingdom! 😢` :
                                `Since I found the same number of happy and sad words, or no emotional words at all, this sentence comes from the Neutral Kingdom! 😐`
                            }"
                        </p>
                    </div>
                </div>
            `;

            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function restartAdventure() {
            currentChapter = 1;
            score = 0;
            exerciseIndex = 0;
            
            // Hide all chapters
            for (let i = 1; i <= maxChapters; i++) {
                document.getElementById(`chapter${i}`).classList.remove('active');
            }
            
            // Show first chapter
            document.getElementById('chapter1').classList.add('active');
            updateNavigation();
            
            // Scroll to top of the page smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Reset form
            document.getElementById('user-text').value = '';
            document.getElementById('analysis-results').innerHTML = '';
        }

        // Initialize floating hearts animation with random positions
        function initializeFloatingElements() {
            const hearts = document.querySelectorAll('.floating-heart');
            hearts.forEach((heart, index) => {
                heart.style.animationDelay = `${index * 0.5}s`;
                heart.style.animationDuration = `${4 + Math.random() * 4}s`;
            });
        }

        // Add some interactive sparkle effects
        function addSparkleEffect(element) {
            element.addEventListener('click', function(e) {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.position = 'absolute';
                sparkle.style.left = e.clientX + 'px';
                sparkle.style.top = e.clientY + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.fontSize = '20px';
                sparkle.style.animation = 'sparkle 1s ease-out forwards';
                document.body.appendChild(sparkle);

                setTimeout(() => sparkle.remove(), 1000);
            });
        }

        // Add sparkle animation CSS
        const sparkleStyle = document.createElement('style');
        sparkleStyle.textContent = `
            @keyframes sparkle {
                0% {
                    opacity: 1;
                    transform: translateY(0px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-50px) scale(0);
                }
            }
        `;
        document.head.appendChild(sparkleStyle);

        // Initialize everything when page loads
        window.onload = function() {
            initializeFloatingElements();
            updateNavigation();
            
            // Add sparkle effects to buttons
            document.querySelectorAll('.big-button, .emotion-btn, .kingdom-card').forEach(addSparkleEffect);
        };