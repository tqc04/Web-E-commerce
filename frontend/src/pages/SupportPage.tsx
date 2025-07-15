import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Avatar
} from '@mui/material'
import {
  ExpandMore,
  Send,
  Phone,
  Email,
  Chat,
  Help,
  QuestionAnswer,
  ContactSupport,
  Assignment,
  Security,
  Payment,
  LocalShipping,
  AccountCircle,
  Star,
  CheckCircle
} from '@mui/icons-material'

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
      id={`support-tabpanel-${index}`}
      aria-labelledby={`support-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [ticketForm, setTicketForm] = useState({
    orderNumber: '',
    issue: '',
    description: '',
    priority: 'medium'
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', contactForm)
    // Handle form submission
  }

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Ticket form submitted:', ticketForm)
    // Handle ticket submission
  }

  const faqData = [
    {
      category: 'Orders',
      icon: <Assignment />,
      questions: [
        {
          q: 'How can I track my order?',
          a: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll find tracking information and real-time updates there.'
        },
        {
          q: 'Can I cancel or modify my order?',
          a: 'Orders can be cancelled or modified within 2 hours of placement. After this time, the order enters processing and cannot be changed.'
        },
        {
          q: 'What if I received a damaged item?',
          a: 'We\'re sorry to hear that! Please contact our support team with photos of the damaged item and your order number. We\'ll process a replacement or refund immediately.'
        }
      ]
    },
    {
      category: 'Shipping',
      icon: <LocalShipping />,
      questions: [
        {
          q: 'What are your shipping options?',
          a: 'We offer Standard (3-5 business days), Express (1-2 business days), and Same-day delivery in select areas. Shipping costs vary by location and method.'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to most countries worldwide. International shipping takes 7-14 business days depending on the destination.'
        },
        {
          q: 'How much does shipping cost?',
          a: 'Standard shipping is free for orders over $50. Express shipping costs $9.99, and same-day delivery costs $19.99.'
        }
      ]
    },
    {
      category: 'Payments',
      icon: <Payment />,
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and cryptocurrency payments including Bitcoin and Ethereum.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely! We use industry-standard SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers.'
        },
        {
          q: 'Can I pay in installments?',
          a: 'Yes, we offer buy-now-pay-later options through Klarna and Afterpay for eligible orders over $100.'
        }
      ]
    },
    {
      category: 'Account',
      icon: <AccountCircle />,
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page and enter your email. We\'ll send you a secure link to reset your password.'
        },
        {
          q: 'Can I change my email address?',
          a: 'Yes, you can update your email address in your account settings. You\'ll need to verify the new email address.'
        },
        {
          q: 'How do I delete my account?',
          a: 'To delete your account, please contact our support team. Note that this action is irreversible and will permanently remove all your data.'
        }
      ]
    }
  ]

  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: <Chat />,
      action: 'Start Chat',
      available: '24/7',
      color: 'primary'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Email />,
      action: 'Send Email',
      available: 'Response within 2 hours',
      color: 'secondary'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: <Phone />,
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM',
      color: 'success'
    }
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Help & Support
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          We're here to help! Find answers to common questions or get in touch with our support team.
        </Typography>
      </Box>

      {/* Quick Contact Methods */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {contactMethods.map((method, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Avatar sx={{ 
                  bgcolor: `${method.color}.main`, 
                  mx: 'auto', 
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  {method.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {method.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {method.description}
                </Typography>
                <Chip 
                  label={method.available} 
                  size="small" 
                  color="success" 
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  color={method.color as any}
                  fullWidth
                >
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="FAQ" 
            icon={<Help />} 
            iconPosition="start"
          />
          <Tab 
            label="Contact Us" 
            icon={<ContactSupport />} 
            iconPosition="start"
          />
          <Tab 
            label="Submit Ticket" 
            icon={<Assignment />} 
            iconPosition="start"
          />
        </Tabs>

        {/* FAQ Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          {faqData.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {category.icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {category.category}
                </Typography>
              </Box>
              
              {category.questions.map((faq, faqIndex) => (
                <Accordion key={faqIndex}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </TabPanel>

        {/* Contact Us Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom>
            Contact Our Support Team
          </Typography>
          
          <form onSubmit={handleContactSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  startIcon={<Send />}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Submit Ticket Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom>
            Submit Support Ticket
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            For order-related issues, please provide your order number for faster resolution.
          </Alert>
          
          <form onSubmit={handleTicketSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Order Number (if applicable)"
                  value={ticketForm.orderNumber}
                  onChange={(e) => setTicketForm({...ticketForm, orderNumber: e.target.value})}
                  placeholder="e.g., ORD-12345"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                  SelectProps={{ native: true }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Issue Summary"
                  value={ticketForm.issue}
                  onChange={(e) => setTicketForm({...ticketForm, issue: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detailed Description"
                  multiline
                  rows={6}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                  required
                  helperText="Please provide as much detail as possible to help us resolve your issue quickly."
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  startIcon={<Assignment />}
                >
                  Submit Ticket
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
      </Paper>

      {/* Additional Resources */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <QuestionAnswer sx={{ mr: 1, verticalAlign: 'middle' }} />
                Quick Answers
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Order Status Updates" 
                    secondary="Track your orders in real-time"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Return & Refund Policy" 
                    secondary="30-day hassle-free returns"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Security & Privacy" 
                    secondary="Your data is safe with us"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                Customer Satisfaction
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                We're committed to providing excellent support. Here's what our customers say:
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  4.9/5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average support rating from 10,000+ customers
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SupportPage 