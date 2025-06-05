class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedOption = null;
        
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

        // Bind event listeners
        this.nextButton.addEventListener('click', () => this.handleNextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        this.restartQuizButton.addEventListener('click', () => this.restartQuiz());

        // Initialize quiz
        this.loadQuestions();
    }

    async loadQuestions() {
        try {
            const response = await fetch('question.json');
            this.questions = await response.json();
            this.totalQuestionsElement.textContent = this.questions.length;
            this.totalQuestionsFinalElement.textContent = this.questions.length;
            this.displayQuestion();
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questionText.textContent = 'Error loading questions. Please try again later.';
        }
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