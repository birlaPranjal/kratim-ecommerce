import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Hammer as CraftsmanshipIcon,
  Users as EmpowermentIcon,
  Leaf as SustainabilityIcon
} from 'lucide-react';

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  '& svg': {
    color: theme.palette.common.white,
    width: '40px',
    height: '40px',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Home = () => {
  const features = [
    {
      icon: <CraftsmanshipIcon />,
      title: 'Craftsmanship',
      description: 'Each piece is meticulously crafted by skilled artisans, ensuring attention to detail and superior quality.',
    },
    {
      icon: <EmpowermentIcon />,
      title: 'Empowerment',
      description: 'Supporting local artisans and communities through fair trade practices and skill development programs.',
    },
    {
      icon: <SustainabilityIcon />,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and sustainable sourcing to minimize our environmental impact.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <FeatureCard elevation={3}>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 