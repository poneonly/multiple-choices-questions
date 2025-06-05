class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedOption = null;
        this.availableQuizzes = new Map(); // Store available quizzes
        
        // DOM Elements
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.nextButton = document.getElementById('next-btn');
        this.restartButton = document.getElementById('restart-btn');
        this.restartQuizButton = document.getElementById('restart-quiz-btn');
        this.progressBar = document.getElementById('progressBar');
        this.scoreElement = document.getElementById('score');
        this.totalQuestionsElement = document.getElementById('totalQuestions');
        this.questionContainer = document.getElementById('question-container');
        this.resultContainer = document.getElementById('result-container');
        this.finalScoreElement = document.getElementById('final-score');
        this.totalQuestionsFinalElement = document.getElementById('total-questions');
        this.quizSelect = document.getElementById('quiz-select');
        this.quizUpload = document.getElementById('quiz-upload');
        this.uploadStatus = document.getElementById('upload-status');

        // Bind event listeners
        this.nextButton.addEventListener('click', () => this.handleNextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        this.restartQuizButton.addEventListener('click', () => this.restartQuiz());
        this.quizSelect.addEventListener('change', () => this.handleQuizSelection());
        this.quizUpload.addEventListener('change', (e) => this.handleFileUpload(e));

        // Initialize quiz
        this.loadAvailableQuizzes();
    }

    async loadAvailableQuizzes() {
        try {
            // Load the default quiz
            const defaultQuiz = await this.fetchQuiz('question.json');
            this.availableQuizzes.set('question.json', defaultQuiz);
            this.updateQuizSelect();
            
            // Try to load other quizzes from the quizzes directory
            try {
                const response = await fetch('quizzes/');
                const files = await response.json();
                for (const file of files) {
                    if (file.endsWith('.json')) {
                        const quiz = await this.fetchQuiz(`quizzes/${file}`);
                        this.availableQuizzes.set(file, quiz);
                    }
                }
                this.updateQuizSelect();
            } catch (error) {
                console.log('No additional quizzes found in quizzes directory');
            }
        } catch (error) {
            console.error('Error loading quizzes:', error);
            this.showUploadStatus('Error loading quizzes. Please try again later.', 'error');
        }
    }

    async fetchQuiz(filename) {
        const response = await fetch(filename);
        if (!response.ok) throw new Error(`Failed to load quiz: ${filename}`);
        return await response.json();
    }

    updateQuizSelect() {
        this.quizSelect.innerHTML = '<option value="">Select a Quiz</option>';
        for (const [filename, quiz] of this.availableQuizzes) {
            const option = document.createElement('option');
            option.value = filename;
            option.textContent = this.getQuizTitle(quiz, filename);
            this.quizSelect.appendChild(option);
        }
    }

    getQuizTitle(quiz, filename) {
        // Try to get title from first question or use filename
        return quiz[0]?.question?.split('?')[0] || filename.replace('.json', '');
    }

    async handleQuizSelection() {
        const selectedFile = this.quizSelect.value;
        if (!selectedFile) return;

        try {
            this.questions = this.availableQuizzes.get(selectedFile);
            this.totalQuestionsElement.textContent = this.questions.length;
            this.totalQuestionsFinalElement.textContent = this.questions.length;
            this.restartQuiz();
        } catch (error) {
            console.error('Error loading selected quiz:', error);
            this.showUploadStatus('Error loading selected quiz. Please try again.', 'error');
        }
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            this.showUploadStatus('Please upload a JSON file.', 'error');
            return;
        }

        try {
            const quiz = JSON.parse(await file.text());
            
            // Validate quiz structure
            if (!Array.isArray(quiz) || !this.validateQuizStructure(quiz)) {
                throw new Error('Invalid quiz format');
            }

            // Add to available quizzes
            const filename = file.name;
            this.availableQuizzes.set(filename, quiz);
            this.updateQuizSelect();
            
            // Select the newly uploaded quiz
            this.quizSelect.value = filename;
            this.handleQuizSelection();
            
            this.showUploadStatus('Quiz uploaded successfully!', 'success');
        } catch (error) {
            console.error('Error uploading quiz:', error);
            this.showUploadStatus('Error uploading quiz. Please check the file format.', 'error');
        }

        // Reset file input
        event.target.value = '';
    }

    validateQuizStructure(quiz) {
        return quiz.every(q => 
            typeof q.question === 'string' &&
            Array.isArray(q.options) &&
            q.options.length > 0 &&
            typeof q.correct_answer === 'string' &&
            q.options.includes(q.correct_answer)
        );
    }

    showUploadStatus(message, type) {
        this.uploadStatus.textContent = message;
        this.uploadStatus.className = 'upload-status ' + (type || '');
        setTimeout(() => {
            this.uploadStatus.textContent = '';
            this.uploadStatus.className = 'upload-status';
        }, 3000);
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.handleOptionSelect(optionElement, option));
            this.optionsContainer.appendChild(optionElement);
        });

        this.updateProgress();
        this.nextButton.disabled = true;
        this.selectedOption = null;
    }

    handleOptionSelect(optionElement, selectedAnswer) {
        if (this.selectedOption) return;

        this.selectedOption = selectedAnswer;
        const question = this.questions[this.currentQuestionIndex];
        const options = this.optionsContainer.children;

        // Disable all options
        Array.from(options).forEach(option => {
            option.style.pointerEvents = 'none';
        });

        // Mark selected option
        optionElement.classList.add('selected');

        // Check if answer is correct
        if (selectedAnswer === question.correct_answer) {
            optionElement.classList.add('correct');
            this.score++;
            this.scoreElement.textContent = this.score;
        } else {
            optionElement.classList.add('incorrect');
            // Highlight correct answer
            Array.from(options).forEach(option => {
                if (option.textContent === question.correct_answer) {
                    option.classList.add('correct');
                }
            });
        }

        this.nextButton.disabled = false;
    }

    handleNextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    showResults() {
        this.questionContainer.classList.add('hidden');
        this.resultContainer.classList.remove('hidden');
        this.finalScoreElement.textContent = this.score;
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.questionContainer.classList.remove('hidden');
        this.resultContainer.classList.add('hidden');
        this.displayQuestion();
    }
}

// Initialize quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
}); 