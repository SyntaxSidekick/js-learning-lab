import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Paper,
  Alert,
  AlertTitle,
  Skeleton,
  useTheme
} from '@mui/material'
import {
  Lightbulb,
  MenuBook,
  FlashOn,
  AccessTime
} from '@mui/icons-material'

const QuestionDisplay = ({ 
  question, 
  showHint, 
  showExplanation, 
  onToggleHint 
}) => {
  const theme = useTheme()

  const getDifficultyConfig = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return {
          color: 'success',
          icon: '🌱',
          label: 'Beginner'
        }
      case 'intermediate':
        return {
          color: 'warning',
          icon: '⚡',
          label: 'Intermediate'
        }
      case 'advanced':
        return {
          color: 'error',
          icon: '🔥',
          label: 'Advanced'
        }
      default:
        return {
          color: 'default',
          icon: '📝',
          label: 'Unknown'
        }
    }
  }

  if (!question) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width={100} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} />
          <Skeleton variant="rectangular" height={150} />
        </CardContent>
      </Card>
    )
  }

  const difficultyConfig = getDifficultyConfig(question.difficulty)

  return (
    <Card sx={{ 
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8]
      }
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Question Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Chip
              icon={<span>{difficultyConfig.icon}</span>}
              label={difficultyConfig.label}
              color={difficultyConfig.color}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<FlashOn sx={{ fontSize: 16 }} />}
              label={question.category}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              #{question.id}
            </Typography>
          </Box>
        </Box>

        {/* Question */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ 
          fontWeight: 600,
          mb: 3,
          lineHeight: 1.3
        }}>
          {question.question}
        </Typography>
        
        {/* Code Block */}
        <Paper 
          variant="outlined" 
          sx={{ 
            position: 'relative',
            overflow: 'hidden',
            mb: 3,
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
            border: `2px solid ${theme.palette.divider}`,
            transition: 'border-color 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main + '40'
            }
          }}
        >
          {/* Code Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: '#ff5f56' 
                }} />
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: '#ffbd2e' 
                }} />
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: '#27ca3f' 
                }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                script.js
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              JavaScript
            </Typography>
          </Box>

          {/* Code Content */}
          <Box sx={{ p: 3 }}>
            <Typography 
              component="pre" 
              sx={{ 
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: 'pre-wrap',
                color: theme.palette.text.primary
              }}
            >
              {question.starterCode}
            </Typography>
          </Box>
        </Paper>

        {/* Hint Section */}
        {showHint && (
          <Alert 
            severity="warning" 
            icon={<Lightbulb />}
            sx={{ mb: 3 }}
          >
            <AlertTitle>💡 Hint</AlertTitle>
            {question.hint}
          </Alert>
        )}

        {/* Explanation Section */}
        {showExplanation && (
          <Alert 
            severity="info" 
            icon={<MenuBook />}
          >
            <AlertTitle>📚 Explanation</AlertTitle>
            {question.explanation}
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default QuestionDisplay