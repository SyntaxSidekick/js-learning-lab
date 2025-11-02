import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Alert,
  AlertTitle,
  Paper,
  useTheme
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Visibility,
  AutoAwesome,
  CompareArrows
} from '@mui/icons-material'

const ResultDisplay = ({ result, onShowExplanation }) => {
  const theme = useTheme()
  const isCorrect = result.isCorrect

  return (
    <Card sx={{ 
      border: 2,
      borderColor: isCorrect ? 'success.main' : 'error.main',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8]
      }
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Result Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between',
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 48, 
              height: 48,
              borderRadius: 3,
              backgroundColor: isCorrect ? 'success.light' : 'error.light',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isCorrect ? (
                <CheckCircle sx={{ fontSize: 28 }} />
              ) : (
                <Cancel sx={{ fontSize: 28 }} />
              )}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                color: isCorrect ? 'success.main' : 'error.main',
                fontWeight: 600,
                mb: 0.5
              }}>
                {isCorrect ? '🎉 Perfect!' : '🤔 Not quite right'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isCorrect ? 'Great job! Your answer is correct.' : 'Take another look at the code.'}
              </Typography>
            </Box>
          </Box>
          
          {isCorrect && (
            <AutoAwesome 
              sx={{ 
                fontSize: 32, 
                color: 'warning.main',
                animation: 'bounce 0.6s ease-in-out'
              }} 
            />
          )}
        </Box>

        {/* Output Comparison */}
        <Box sx={{ mb: 3 }}>
          {/* Your Output */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ 
                width: 20, 
                height: 20, 
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                Y
              </Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Your Output
              </Typography>
            </Box>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                backgroundColor: '#272822',
                borderColor: '#49483e',
                border: `2px solid #49483e`
              }}
            >
              <Typography 
                component="pre" 
                sx={{ 
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '0.875rem',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  color: result.output ? '#f8f8f2' : '#75715e',
                  fontStyle: result.output ? 'normal' : 'italic'
                }}
              >
                {result.output || '(no output)'}
              </Typography>
            </Paper>
          </Box>

          {/* Expected Output */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ 
                width: 20, 
                height: 20, 
                borderRadius: '50%',
                backgroundColor: 'success.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                E
              </Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Expected Output
              </Typography>
            </Box>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                backgroundColor: '#272822',
                borderColor: isCorrect ? '#a6e22e' : '#49483e',
                border: `2px solid ${isCorrect ? '#a6e22e' : '#49483e'}`
              }}
            >
              <Typography 
                component="pre" 
                sx={{ 
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '0.875rem',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  color: '#f8f8f2'
                }}
              >
                {result.expected}
              </Typography>
            </Paper>
          </Box>

          {/* Comparison indicator */}
          {!isCorrect && (
            <Alert 
              severity="warning" 
              icon={<CompareArrows />}
              sx={{ mt: 2 }}
            >
              The outputs don't match. Check your logic and try again.
            </Alert>
          )}
        </Box>
      </CardContent>

      {/* Show Explanation Button for incorrect answers */}
      {!isCorrect && (
        <CardActions sx={{ px: 4, pb: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Visibility />}
            onClick={onShowExplanation}
            sx={{ borderRadius: 2 }}
          >
            Show Explanation
          </Button>
        </CardActions>
      )}
    </Card>
  )
}

export default ResultDisplay