import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import {
  Support,
  Email,
  Phone,
  LocationOn,
  ExpandMore,
  Send,
  CheckCircle,
  Info,
  Warning,
  Error,
  Chat,
  Help,
  ContactSupport,
  QuestionAnswer,
  Schedule,
  Security,
  Payment,
  LocalShipping,
  Refresh,
  Star,
  ShoppingCart
} from '@mui/icons-material';

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payment' },
    { value: 'shipping', label: 'Shipping & Delivery' },
    { value: 'returns', label: 'Returns & Refunds' },
    { value: 'product', label: 'Product Information' },
    { value: 'account', label: 'Account Issues' },
    { value: 'other', label: 'Other' },
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll receive tracking information via email once your order ships.',
      category: 'shipping',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all packaging intact. Some items may have different return policies.',
      category: 'returns',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. International shipping times vary by location.',
      category: 'shipping',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check availability during checkout.',
      category: 'shipping',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for business accounts.',
      category: 'billing',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a link to reset your password.',
      category: 'account',
    },
    {
      question: 'Are my payment details secure?',
      answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers.',
      category: 'security',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Orders can be cancelled within 1 hour of placement if they haven\'t been processed for shipping. Contact our support team immediately.',
      category: 'general',
    },
  ];

  const supportChannels = [
    {
      icon: <Email />,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@shoppro.com',
      responseTime: 'Within 24 hours',
      color: 'primary.main',
    },
    {
      icon: <Phone />,
      title: 'Phone Support',
      description: 'Speak with our team',
      contact: '+1 (555) 123-4567',
      responseTime: 'Mon-Fri, 9AM-6PM EST',
      color: 'success.main',
    },
    {
      icon: <Chat />,
      title: 'Live Chat',
      description: 'Instant help available',
      contact: 'Available 24/7',
      responseTime: 'Instant response',
      color: 'warning.main',
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully! We\'ll get back to you soon.',
        severity: 'success',
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
      });
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Support Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          We're here to help! Find answers to your questions or contact our support team
        </Typography>
        
        {/* Support Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              24/7
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Support Available
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
                         <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
               &lt; 2h
             </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Response
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
              98%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Satisfaction Rate
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, height: 'fit-content' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ContactSupport />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Contact Us
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.category}
                        label="Category"
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      placeholder="Please describe your issue or question in detail..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={loading ? <Refresh /> : <Send />}
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Support Channels */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Get Help Faster
              </Typography>
              
              <Grid container spacing={3}>
                {supportChannels.map((channel, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: channel.color,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: channel.color, mr: 2 }}>
                          {channel.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {channel.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {channel.description}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {channel.contact}
                        </Typography>
                        <Chip
                          label={channel.responseTime}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Office Information */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Office Information
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Head Office"
                    secondary="123 Tech Street, Digital City, DC 12345, United States"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Business Hours"
                    secondary="Monday - Friday: 9:00 AM - 6:00 PM EST"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security"
                    secondary="All communications are encrypted and secure"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Find quick answers to common questions
        </Typography>

        <Grid container spacing={2}>
          {faqs.map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Accordion sx={{ borderRadius: 2, mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Help Categories */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          Help Categories
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Browse help articles by category
        </Typography>

        <Grid container spacing={3}>
          {[
            { icon: <ShoppingCart />, title: 'Orders & Shipping', count: 15, color: 'primary.main' },
            { icon: <Payment />, title: 'Payment & Billing', count: 12, color: 'success.main' },
            { icon: <Refresh />, title: 'Returns & Refunds', count: 8, color: 'warning.main' },
            { icon: <Security />, title: 'Account & Security', count: 10, color: 'error.main' },
            { icon: <LocalShipping />, title: 'Shipping Info', count: 6, color: 'info.main' },
            { icon: <Help />, title: 'General Help', count: 20, color: 'secondary.main' },
          ].map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: category.color, width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  {category.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.count} articles
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupportPage; 