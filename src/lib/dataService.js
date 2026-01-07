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
