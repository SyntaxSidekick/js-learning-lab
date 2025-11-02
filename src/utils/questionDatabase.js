// JSON Database Loader and Manager
export class QuestionDatabase {
  constructor() {
    this.data = null;
    this.isLoaded = false;
  }

  // Load questions from JSON file
  async loadQuestions() {
    try {
      // In production, this would be a fetch request to your JSON file
      const response = await fetch('./src/data/questionsDatabase.json');
      this.data = await response.json();
      this.isLoaded = true;
      return this.data;
    } catch (error) {
      console.error('Failed to load questions database:', error);
      // Fallback to embedded data or empty state
      return this.getFallbackData();
    }
  }

  // Get all questions
  getAllQuestions() {
    return this.data?.questions || [];
  }

  // Get questions by category
  getQuestionsByCategory(categoryId) {
    return this.getAllQuestions().filter(q => q.category === categoryId);
  }

  // Get questions by difficulty
  getQuestionsByDifficulty(difficulty) {
    return this.getAllQuestions().filter(q => q.difficulty === difficulty);
  }

  // Get filtered questions
  getFilteredQuestions(filters = {}) {
    let questions = this.getAllQuestions();

    if (filters.category && filters.category !== 'all') {
      questions = questions.filter(q => q.category === filters.category);
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      questions = questions.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.type) {
      questions = questions.filter(q => q.type === filters.type);
    }

    if (filters.tags && filters.tags.length > 0) {
      questions = questions.filter(q => 
        filters.tags.some(tag => q.tags.includes(tag))
      );
    }

    return questions;
  }

  // Get random questions
  getRandomQuestions(count = 10, filters = {}) {
    const filtered = this.getFilteredQuestions(filters);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Get question by ID
  getQuestionById(id) {
    return this.getAllQuestions().find(q => q.id === id);
  }

  // Get categories
  getCategories() {
    return this.data?.categories || [];
  }

  // Get category by ID
  getCategoryById(id) {
    return this.getCategories().find(c => c.id === id);
  }

  // Get database metadata
  getMetadata() {
    return this.data?.meta || {};
  }

  // Search questions
  searchQuestions(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.getAllQuestions().filter(q => 
      q.title.toLowerCase().includes(term) ||
      q.question.toLowerCase().includes(term) ||
      q.explanation.toLowerCase().includes(term) ||
      q.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  // Get related questions
  getRelatedQuestions(questionId, count = 5) {
    const question = this.getQuestionById(questionId);
    if (!question) return [];

    const related = this.getAllQuestions()
      .filter(q => 
        q.id !== questionId && 
        (q.category === question.category || 
         q.tags.some(tag => question.tags.includes(tag)))
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    return related;
  }

  // Get question statistics
  getStatistics() {
    const questions = this.getAllQuestions();
    const categories = this.getCategories();

    const stats = {
      total: questions.length,
      byDifficulty: {
        beginner: questions.filter(q => q.difficulty === 'beginner').length,
        intermediate: questions.filter(q => q.difficulty === 'intermediate').length,
        advanced: questions.filter(q => q.difficulty === 'advanced').length
      },
      byCategory: {},
      byType: {}
    };

    // Count by category
    categories.forEach(cat => {
      stats.byCategory[cat.id] = questions.filter(q => q.category === cat.id).length;
    });

    // Count by type
    const types = [...new Set(questions.map(q => q.type))];
    types.forEach(type => {
      stats.byType[type] = questions.filter(q => q.type === type).length;
    });

    return stats;
  }

  // Fallback data in case JSON loading fails
  getFallbackData() {
    return {
      meta: {
        version: "1.0",
        lastUpdated: "2025-10-31",
        totalQuestions: 10,
        categories: 5
      },
      categories: [
        { id: "variables", name: "Variables", color: "#4CAF50" },
        { id: "functions", name: "Functions", color: "#2196F3" },
        { id: "objects", name: "Objects", color: "#FF9800" },
        { id: "promises", name: "Promises", color: "#F44336" },
        { id: "loops", name: "Loops", color: "#9C27B0" }
      ],
      questions: [
        {
          id: 1,
          category: "variables",
          difficulty: "beginner",
          type: "output",
          title: "Variable Hoisting",
          question: "What will be the output?",
          code: "console.log(x); var x = 5;",
          options: ["undefined", "5", "ReferenceError", "null"],
          correctAnswer: 0,
          explanation: "Due to hoisting, var x is declared but not assigned.",
          hints: ["Think about hoisting"],
          tags: ["hoisting", "var"],
          relatedConcepts: ["Variable declarations"]
        }
      ]
    };
  }
}

// Export singleton instance
export const questionDB = new QuestionDatabase();

// Auto-load questions when module is imported
questionDB.loadQuestions().catch(console.error);