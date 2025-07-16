import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Lock,
  Visibility,
  VisibilityOff,
  PhotoCamera,
  Settings,
  Security,
  Notifications
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  avatarUrl: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PreferencesData {
  personalizationEnabled: boolean
  chatbotEnabled: boolean
  recommendationEnabled: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    avatarUrl: ''
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [preferences, setPreferences] = useState<PreferencesData>({
    personalizationEnabled: true,
    chatbotEnabled: true,
    recommendationEnabled: true,
    emailNotifications: true,
    pushNotifications: false
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        avatarUrl: user.avatarUrl || ''
      })
      
      setPreferences({
        personalizationEnabled: user.personalizationEnabled ?? true,
        chatbotEnabled: user.chatbotEnabled ?? true,
        recommendationEnabled: user.recommendationEnabled ?? true,
        emailNotifications: true,
        pushNotifications: false
      })
    }
  }, [user])

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    )
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setMessage(null)
  }

  const handleProfileSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await apiService.updateUserProfile(profileData)
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setIsEditing(false)
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await apiService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      )
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await apiService.updateUserProfile(preferences)
      if (response.success) {
        setMessage({ type: 'success', text: 'Preferences updated successfully!' })
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update preferences'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Profile Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box position="relative">
              <Avatar
                src={profileData.avatarUrl}
                sx={{ width: 100, height: 100 }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Box display="flex" gap={1}>
              <Chip
                label={user?.role}
                color={user?.role === 'ADMIN' ? 'primary' : 'default'}
                size="small"
              />
              <Chip
                label={user?.isEmailVerified ? 'Verified' : 'Unverified'}
                color={user?.isEmailVerified ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper elevation={3}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Settings />} label="Preferences" />
          <Tab icon={<Notifications />} label="Notifications" />
        </Tabs>

        {message && (
          <Box sx={{ p: 2 }}>
            <Alert severity={message.type}>{message.text}</Alert>
          </Box>
        )}

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                disabled={true} // Email cannot be edited
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                disabled={!isEditing}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={!isEditing}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleProfileSave}
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        edge="end"
                      >
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        edge="end"
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        edge="end"
                      >
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
        </TabPanel>

        {/* Preferences Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Account Preferences
          </Typography>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.personalizationEnabled}
                  onChange={(e) => setPreferences(prev => ({ ...prev, personalizationEnabled: e.target.checked }))}
                />
              }
              label="Enable Personalization"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Allow the system to personalize your experience based on your behavior
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.chatbotEnabled}
                  onChange={(e) => setPreferences(prev => ({ ...prev, chatbotEnabled: e.target.checked }))}
                />
              }
              label="Enable AI Assistant"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Allow access to the AI-powered chatbot assistant
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.recommendationEnabled}
                  onChange={(e) => setPreferences(prev => ({ ...prev, recommendationEnabled: e.target.checked }))}
                />
              }
              label="Enable Recommendations"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive personalized product recommendations
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handlePreferencesSave}
            disabled={isLoading}
          >
            Save Preferences
          </Button>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                />
              }
              label="Email Notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive order updates and promotional emails
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.pushNotifications}
                  onChange={(e) => setPreferences(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                />
              }
              label="Push Notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive browser push notifications for important updates
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handlePreferencesSave}
            disabled={isLoading}
          >
            Save Settings
          </Button>
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default ProfilePage 