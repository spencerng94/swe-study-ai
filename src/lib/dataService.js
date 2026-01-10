import { supabase, getUserId } from './supabase'

// Game State Service
export const gameStateService = {
  async load() {
    if (!supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('gameState')
      return saved ? JSON.parse(saved) : null
    }

    try {
      const userId = getUserId()
      const { data, error } = await supabase
        .from('game_states')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error loading game state:', error)
        return null
      }

      return data?.state || null
    } catch (error) {
      console.error('Error loading game state:', error)
      return null
    }
  },

  async save(state) {
    if (!supabase) {
      // Fallback to localStorage
      localStorage.setItem('gameState', JSON.stringify(state))
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('game_states')
        .upsert({
          user_id: userId,
          state: state,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Error saving game state:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error saving game state:', error)
      return false
    }
  }
}

// Saved Questions Service
export const savedQuestionsService = {
  async load() {
    if (!supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('savedQuestions')
      return saved ? JSON.parse(saved) : []
    }

    try {
      const userId = getUserId()
      const { data, error } = await supabase
        .from('saved_questions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error loading saved questions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error loading saved questions:', error)
      return []
    }
  },

  async save(question) {
    if (!supabase) {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('savedQuestions') || '[]')
      saved.push(question)
      localStorage.setItem('savedQuestions', JSON.stringify(saved))
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('saved_questions')
        .insert({
          user_id: userId,
          ...question
        })

      if (error) {
        console.error('Error saving question:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error saving question:', error)
      return false
    }
  },

  async delete(id) {
    if (!supabase) {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('savedQuestions') || '[]')
      const filtered = saved.filter(q => q.id !== id)
      localStorage.setItem('savedQuestions', JSON.stringify(filtered))
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('saved_questions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting question:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting question:', error)
      return false
    }
  }
}

// Study Guide Progress Service
export const studyGuideService = {
  async load() {
    if (!supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('studyGuideProgress')
      return saved ? JSON.parse(saved) : {}
    }

    try {
      const userId = getUserId()
      const { data, error } = await supabase
        .from('study_guide_progress')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading study guide progress:', error)
        return {}
      }

      return data?.progress || {}
    } catch (error) {
      console.error('Error loading study guide progress:', error)
      return {}
    }
  },

  async save(progress) {
    if (!supabase) {
      // Fallback to localStorage
      localStorage.setItem('studyGuideProgress', JSON.stringify(progress))
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('study_guide_progress')
        .upsert({
          user_id: userId,
          progress: progress,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Error saving study guide progress:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error saving study guide progress:', error)
      return false
    }
  }
}

// Saved Flashcards Service
export const savedFlashcardsService = {
  async load() {
    if (!supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('savedFlashcards')
      return saved ? JSON.parse(saved) : []
    }

    try {
      const userId = getUserId()
      const { data, error } = await supabase
        .from('saved_flashcards')
        .select('flashcard_id')
        .eq('user_id', userId)

      if (error) {
        console.error('Error loading saved flashcards:', error)
        return []
      }

      return data.map(item => item.flashcard_id)
    } catch (error) {
      console.error('Error loading saved flashcards:', error)
      return []
    }
  },

  async save(flashcardId) {
    if (!supabase) {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('savedFlashcards') || '[]')
      if (!saved.includes(flashcardId)) {
        saved.push(flashcardId)
        localStorage.setItem('savedFlashcards', JSON.stringify(saved))
      }
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('saved_flashcards')
        .insert({
          user_id: userId,
          flashcard_id: flashcardId,
          timestamp: new Date().toISOString(),
        })

      if (error && error.code !== '23505') { // 23505 = unique violation (already saved)
        console.error('Error saving flashcard:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error saving flashcard:', error)
      return false
    }
  },

  async delete(flashcardId) {
    if (!supabase) {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('savedFlashcards') || '[]')
      const filtered = saved.filter(id => id !== flashcardId)
      localStorage.setItem('savedFlashcards', JSON.stringify(filtered))
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('saved_flashcards')
        .delete()
        .eq('flashcard_id', flashcardId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting flashcard:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting flashcard:', error)
      return false
    }
  },

  async isSaved(flashcardId) {
    const saved = await this.load()
    return saved.includes(flashcardId)
  }
}

// Saved Topics Service
export const savedTopicsService = {
  async load() {
    if (!supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('savedTopics')
      return saved ? JSON.parse(saved) : []
    }

    try {
      const userId = getUserId()
      const { data, error } = await supabase
        .from('saved_topics')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error loading saved topics:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error loading saved topics:', error)
      return []
    }
  },

  async save(topic) {
    if (!supabase) {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('savedTopics') || '[]')
      const existingIndex = saved.findIndex(t => t.id === topic.id)
      if (existingIndex >= 0) {
        saved[existingIndex] = topic
      } else {
        saved.push(topic)
      }
      localStorage.setItem('savedTopics', JSON.stringify(saved))
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('saved_topics')
        .upsert({
          user_id: userId,
          ...topic
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Error saving topic:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error saving topic:', error)
      return false
    }
  },

  async delete(id) {
    if (!supabase) {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('savedTopics') || '[]')
      const filtered = saved.filter(t => t.id !== id)
      localStorage.setItem('savedTopics', JSON.stringify(filtered))
      return true
    }

    try {
      const userId = getUserId()
      const { error } = await supabase
        .from('saved_topics')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting topic:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting topic:', error)
      return false
    }
  }
}

// Saved Game Flashcards Service (for game mode questions)
export const savedGameFlashcardsService = {
  async load() {
    const saved = localStorage.getItem('savedGameFlashcards')
    if (!saved) return []
    
    try {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Error loading saved game flashcards:', error)
      return []
    }
  },

  async save(flashcard) {
    const saved = await this.load()
    // Check if already saved (by flashcard id)
    const exists = saved.find(f => f.id === flashcard.id)
    if (exists) {
      return false // Already saved
    }
    
    const newFlashcard = {
      ...flashcard,
      savedAt: new Date().toISOString(),
      id: flashcard.id || `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    saved.push(newFlashcard)
    localStorage.setItem('savedGameFlashcards', JSON.stringify(saved))
    window.dispatchEvent(new CustomEvent('savedGameFlashcardsUpdated'))
    return true
  },

  async delete(id) {
    const saved = await this.load()
    const filtered = saved.filter(f => f.id !== id)
    localStorage.setItem('savedGameFlashcards', JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent('savedGameFlashcardsUpdated'))
    return true
  },

  async isSaved(id) {
    const saved = await this.load()
    return saved.some(f => f.id === id)
  }
}
