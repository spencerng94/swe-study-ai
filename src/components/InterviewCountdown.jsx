import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

function InterviewCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    // Interview date: January 12, 2026 at 1:45 PM PDT
    const updateCountdown = () => {
      // Create interview date: January 12, 2026, 1:45 PM PDT
      // PDT is UTC-7, so 1:45 PM PDT = 8:45 PM UTC (13:45 + 7 = 20:45 UTC)
      // Using ISO string format which is more reliable
      const interviewDateStr = '2026-01-12T20:45:00.000Z'
      const interviewDate = new Date(interviewDateStr)
      
      // Verify date is valid
      if (isNaN(interviewDate.getTime())) {
        console.error('Invalid interview date')
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
        return
      }
      
      const now = new Date()
      const difference = interviewDate.getTime() - now.getTime()


      if (difference > 0) {
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24))
        const remainingAfterDays = difference % (1000 * 60 * 60 * 24)
        const totalHours = Math.floor(remainingAfterDays / (1000 * 60 * 60))
        
        console.log('Setting timeLeft - days:', totalDays, 'hours:', totalHours)
        
        setTimeLeft({ 
          days: totalDays, 
          hours: totalHours, 
          minutes: 0 
        })
      } else {
        console.log('Interview date is in the past!')
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
      }
    }

    // Update immediately
    updateCountdown()
    // Then update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-salesforce-dark-blue">
      <Clock className="w-4 h-4" />
      <span className="text-sm font-semibold">
        <span className="font-bold text-salesforce-blue">{timeLeft.days}</span> days,{' '}
        <span className="font-bold text-salesforce-blue">{timeLeft.hours}</span> hours left
      </span>
    </div>
  )
}

export default InterviewCountdown
