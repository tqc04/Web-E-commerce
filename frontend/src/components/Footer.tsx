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
    <Box component="footer" sx={{ bgcolor: '#181818', color: 'white', mt: 'auto' }}>
      {/* Features Banner */}
      <Box sx={{ bgcolor: '#232323', py: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={6} md={3} key={index} sx={{ textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 1 }}>{feature.icon}</Box>
                <Typography variant="body2" fontWeight="bold">{feature.text}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Footer */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
          {/* Company Info + Social */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main', mb: 1 }}>
              ShopPro
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Your trusted e-commerce destination for the latest tech products.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {socialLinks.map((social, idx) => (
                <IconButton key={idx} href={social.href} sx={{ color: 'white', '&:hover': { color: social.color } }}>
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Quick Links</Typography>
            {quickLinks.map((link, idx) => (
              <Link key={idx} href={link.href} color="inherit" underline="hover" sx={{ display: 'block', mb: 0.5, opacity: 0.8, '&:hover': { color: 'primary.main', opacity: 1 } }}>{link.label}</Link>
            ))}
          </Grid>

          {/* Categories */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Categories</Typography>
            {categories.map((cat, idx) => (
              <Link key={idx} href={cat.href} color="inherit" underline="hover" sx={{ display: 'block', mb: 0.5, opacity: 0.8, '&:hover': { color: 'primary.main', opacity: 1 } }}>{cat.label}</Link>
            ))}
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Stay Updated</Typography>
            <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: 1, flex: 1 }}
                InputProps={{ sx: { fontSize: 14 } }}
              />
              <Button type="submit" variant="contained" sx={{ borderRadius: 1, px: 2, minWidth: 0 }}>
                <Send fontSize="small" />
              </Button>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Get special offers, free giveaways, and exclusive deals.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Box sx={{ bgcolor: '#111', py: 2, mt: 2 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            © 2025 ShopPro. All rights reserved. | Made with <span style={{ color: '#e25555' }}>♥</span> for shopping experiences
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <PaymentOutlined fontSize="small" sx={{ opacity: 0.7 }} />
            <Nature fontSize="small" sx={{ opacity: 0.7 }} />
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Footer 