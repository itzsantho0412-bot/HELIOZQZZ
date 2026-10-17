import React, { useState } from 'react';
import { Product, CustomOrderCategory, BusinessInfo } from './types';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredCustomCategories,
  saveStoredCustomCategories,
  getStoredBusinessInfo,
  saveStoredBusinessInfo,
} from './services/storage';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { ProductDetailModal } from './components/ProductDetailModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CustomTshirtsPage } from './pages/CustomTshirtsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [policySection, setPolicySection] = useState<string>('privacy');

  // Search & Filter Visibility (Hidden by default unless search button clicked)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Stored State
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [customCategories, setCustomCategories] = useState<CustomOrderCategory[]>(() =>
    getStoredCustomCategories()
  );
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => getStoredBusinessInfo());

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomCategory, setSelectedCustomCategory] = useState<CustomOrderCategory | null>(
    null
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [sizeGuideFit, setSizeGuideFit] = useState<string>('Oversized');

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Sync state modifications
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  const handleUpdateCustomCategories = (newCategories: CustomOrderCategory[]) => {
    setCustomCategories(newCategories);
    saveStoredCustomCategories(newCategories);
  };

  const handleUpdateBusinessInfo = (newInfo: BusinessInfo) => {
    setBusinessInfo(newInfo);
    saveStoredBusinessInfo(newInfo);
  };

  const handleNavigate = (tab: string, subSection?: string) => {
    setCurrentTab(tab);
    if (subSection) {
      setPolicySection(subSection);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSizeGuide = (fitType: string = 'Oversized') => {
    setSizeGuideFit(fitType);
    setIsSizeGuideOpen(true);
  };

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (currentTab !== 'home' && currentTab !== 'shop') {
      setCurrentTab('shop');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-white">
      {/* Primary Header with Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setCurrentTab('admin')}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenSearch={handleToggleSearch}
        isSearchOpen={isSearchOpen}
      />

      {/* Main Landmark */}
      <main id="main-content" className="flex-1 focus:outline-none">
        {currentTab === 'home' && (
          <HomePage
            products={products}
            customCategories={customCategories}
            businessInfo={businessInfo}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSelectCustomCategory={(c) => setSelectedCustomCategory(c)}
            onNavigate={handleNavigate}
            onOpenSizeGuide={handleOpenSizeGuide}
            isSearchOpen={isSearchOpen}
            onToggleSearch={handleToggleSearch}
          />
        )}

        {currentTab === 'shop' && (
          <ShopPage
            products={products}
            businessInfo={businessInfo}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenSizeGuide={handleOpenSizeGuide}
            isSearchOpen={isSearchOpen}
            onToggleSearch={handleToggleSearch}
          />
        )}

        {currentTab === 'custom' && (
          <CustomTshirtsPage
            categories={customCategories}
            businessInfo={businessInfo}
            onOpenCustomModal={(c) => setSelectedCustomCategory(c)}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksPage businessInfo={businessInfo} onNavigate={handleNavigate} />
        )}

        {currentTab === 'about' && (
          <AboutPage businessInfo={businessInfo} onNavigate={handleNavigate} />
        )}

        {currentTab === 'contact' && (
          <ContactPage businessInfo={businessInfo} onNavigate={handleNavigate} />
        )}

        {currentTab === 'policies' && (
          <PoliciesPage businessInfo={businessInfo} initialTab={policySection} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage
            products={products}
            customCategories={customCategories}
            businessInfo={businessInfo}
            onUpdateProducts={handleUpdateProducts}
            onUpdateCustomCategories={handleUpdateCustomCategories}
            onUpdateBusinessInfo={handleUpdateBusinessInfo}
            onClose={() => setCurrentTab('home')}
            isAuthenticated={isAdminLoggedIn}
            onLoginSuccess={() => setIsAdminLoggedIn(true)}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setCurrentTab('home');
            }}
          />
        )}
      </main>

      {/* Footer with Mandatory Statutory Business Details */}
      <Footer businessInfo={businessInfo} onNavigate={handleNavigate} />

      {/* Interactive Modals */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        phone={businessInfo.phone}
        onOpenSizeGuide={handleOpenSizeGuide}
      />

      <CustomOrderModal
        category={selectedCustomCategory}
        isOpen={Boolean(selectedCustomCategory)}
        onClose={() => setSelectedCustomCategory(null)}
        phone={businessInfo.phone}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        fitType={sizeGuideFit}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenCookiePolicy={() => handleNavigate('policies', 'cookies')} />
    </div>
  );
}
