const ProgressBar = ({ score, streak, darkMode }) => {
  const maxStreak = Math.max(streak, 10) // Show progress out of 10 or current streak
  const progressPercentage = (streak / maxStreak) * 100

  return (
    <div className={`p-4 rounded-lg border ${
      darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-gray-500">Streak: {streak}</span>
      </div>
      
      <div className={`w-full bg-gray-200 rounded-full h-2 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div 
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Total Correct: {score}
      </div>
    </div>
  )
}

export default ProgressBar