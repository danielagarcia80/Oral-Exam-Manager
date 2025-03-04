'use client'
// Use relative imports to test if the issue lies specifically with alias resolution
import { Welcome } from '../components/Home/1_WelcomeBanner/WelcomeBanner';
import { Header } from '../components/Home/0_Header/Header';
import React from 'react';
import Footer from '@/components/Home/4_Footer/Footer';
import About from '@/components/Home/3_About/About';
import HeroSection from '@/components/Home/2_HeroSection/HeroSection';

export default function HomePage() {
  return (
    <>
      <Header/>
      <Welcome />
      <HeroSection />
      <About />
      <Footer />
    </>
  );
}
