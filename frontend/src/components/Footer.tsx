import React, { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
  Divider,
} from '@mui/material'
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Send,
  Security,
  LocalShipping,
  SupportAgent,
  PaymentOutlined,
  VerifiedUser,
  Nature,
} from '@mui/icons-material'

const Footer: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log('Newsletter signup:', email)
      setEmail('')
      // Here you would typically send to your newsletter service
    }
  }

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ]

  const customerService = [
    { label: 'Help Center', href: '/help' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Your Order', href: '/track-order' },
    { label: 'Contact Us', href: '/contact' },
  ]

  const categories = [
    { label: 'Electronics', href: '/products?category=electronics' },
    { label: 'Gaming', href: '/products?category=gaming' },
    { label: 'Computers', href: '/products?category=computers' },
    { label: 'Mobile Devices', href: '/products?category=mobile' },
    { label: 'Audio & Headphones', href: '/products?category=audio' },
    { label: 'Accessories', href: '/products?category=accessories' },
  ]

  const policies = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Return Policy', href: '/return-policy' },
    { label: 'Security', href: '/security' },
    { label: 'Accessibility', href: '/accessibility' },
  ]

  const socialLinks = [
    { icon: <Facebook />, href: '#', label: 'Facebook', color: '#1877f2' },
    { icon: <Twitter />, href: '#', label: 'Twitter', color: '#1da1f2' },
    { icon: <Instagram />, href: '#', label: 'Instagram', color: '#e4405f' },
    { icon: <LinkedIn />, href: '#', label: 'LinkedIn', color: '#0077b5' },
    { icon: <YouTube />, href: '#', label: 'YouTube', color: '#ff0000' },
  ]

  const features = [
    { icon: <LocalShipping />, text: 'Free Shipping', subtext: 'On orders over $50' },
    { icon: <Security />, text: 'Secure Payments', subtext: '100% secure checkout' },
    { icon: <SupportAgent />, text: '24/7 Support', subtext: 'Dedicated support team' },
    { icon: <VerifiedUser />, text: 'Money Back', subtext: '30-day guarantee' },
  ]

  return (
    <Box component="footer" sx={{ bgcolor: '#1a1a1a', color: 'white', mt: 'auto' }}>
      {/* Features Banner */}
      <Box sx={{ bgcolor: '#2a2a2a', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {feature.text}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {feature.subtext}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Footer */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'primary.main' }}>
              ShopPro
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
              Your trusted e-commerce destination for the latest tech products. 
              We provide quality products, exceptional service, and innovative AI-powered shopping experiences.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">support@shoppro.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">123 Tech Street, Digital City, DC 12345</Typography>
              </Box>
            </Box>

            {/* Social Media */}
            <Box>
              <Typography variant="body2" gutterBottom fontWeight="bold">
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: social.color,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  color="inherit"
                  sx={{
                    display: 'block',
                    py: 0.5,
                    opacity: 0.8,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      opacity: 1,
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Categories
            </Typography>
            <Box>
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  color="inherit"
                  sx={{
                    display: 'block',
                    py: 0.5,
                    opacity: 0.8,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      opacity: 1,
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {category.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Customer Service
            </Typography>
            <Box>
              {customerService.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  color="inherit"
                  sx={{
                    display: 'block',
                    py: 0.5,
                    opacity: 0.8,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      opacity: 1,
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {service.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8, fontSize: '0.875rem' }}>
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </Typography>
            
            <Box component="form" onSubmit={handleNewsletterSubmit}>
              <TextField
                fullWidth
                size="small"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<Send />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Subscribe
              </Button>
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.6 }}>
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Bottom Footer */}
      <Box sx={{ bgcolor: '#0f0f0f', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            {/* Legal Links */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: { xs: 2, md: 0 } }}>
                {policies.map((policy, index) => (
                  <Link
                    key={index}
                    href={policy.href}
                    color="inherit"
                    sx={{
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      textDecoration: 'none',
                      '&:hover': {
                        opacity: 1,
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {policy.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Payment Methods & Trust Badges */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentOutlined sx={{ fontSize: 16, opacity: 0.7 }} />
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Secure Payments
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Nature sx={{ fontSize: 16, opacity: 0.7 }} />
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Eco Friendly
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

          {/* Copyright */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} ShopPro. All rights reserved. | Made with ❤️ for amazing shopping experiences
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5, mt: 1, display: 'block' }}>
              Powered by AI • Built for the future of e-commerce
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Footer 