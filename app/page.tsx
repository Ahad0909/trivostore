'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<'home' | 'shoes' | 'women' | 'men'>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under1500' | '1500to2000' | 'above2000'>('all');

  // Track selected sizes for T-Shirt cards
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({
    'm-1': 'M',
    'm-2': 'M',
    'm-3': 'M',
    'm-4': 'M',
  });

  const [modalSize, setModalSize] = useState<string>('M');

  // --- Cart State ---
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');

  // Delivery Charges Constant
  const DELIVERY_CHARGES = 300;

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percent' | 'free_shipping'; value: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Order Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    city: 'Karachi',
    address: '',
    paymentMethod: 'cod', // 'cod' | 'jazzcash_abdul' | 'jazzcash_fahad' | 'easypaisa'
    transactionId: '',
  });

  // Payment Accounts Info
  const paymentAccounts = {
    jazzcash_abdul: {
      provider: 'JazzCash',
      number: '03312918129',
      title: 'Abdul Ahad',
    },
    jazzcash_fahad: {
      provider: 'JazzCash',
      number: '03220395632',
      title: 'Mohammad Fahad',
    },
    easypaisa: {
      provider: 'EasyPaisa',
      number: '03312918129',
      title: 'Abdul Ahad',
    },
  };

  // 1. All 25 Shoes Data
  const shoesData = [
    { id: 'shoe-1', title: 'BLACK WOVEN KNIT SNEAKERS', price: 1500, img: '/shoe1.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-2', title: 'NIKE LUNARLON RUNNING SHOES', price: 1300, img: '/shoe2.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-3', title: 'NIKE WHITE CLASSIC', price: 1500, img: '/shoe3.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-4', title: 'OLD ORDER MORE UMTEMPO', price: 1500, img: '/shoe4.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-5', title: 'NIKE LUNARLON 8', price: 1600, img: '/shoe5.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-6', title: 'NIKE DUNK LOW', price: 1500, img: '/shoe6.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-7', title: 'NIKE DUNK-LOW BLACK', price: 1600, img: '/shoe7.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-8', title: 'XTEP CHUNKY DAD SNEAKERS', price: 2000, img: '/shoe8.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-9', title: 'REEBOK PRINT ATHLUX WEAVE', price: 1600, img: '/shoe9.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-10', title: 'SNEAKERS GO RUN', price: 2000, img: '/shoe10.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-11', title: 'NIKE HORIZON WHITE', price: 1500, img: '/shoe11.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-12', title: 'PRO SPECS CASUAL SNEAKERS', price: 2000, img: '/shoe12.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-13', title: 'NEW BALANCE 530', price: 2000, img: '/shoe13.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-14', title: "MEN'S SLIP ON KNIT SNEAKERS", price: 1600, img: '/shoe14.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-15', title: 'BACK SKETCHERS', price: 1500, img: '/shoe15.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-16', title: 'NIKE STORM BLACK', price: 1500, img: '/shoe16.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-17', title: 'SKETCHER IMPACT PRO', price: 2000, img: '/shoe17.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-18', title: 'NEW BALANCE 992 (PREMIUM)', price: 2500, img: '/shoe18.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-19', title: "MEN'S BLADE SOLE KNIT SNEAKERS", price: 1800, img: '/shoe19.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-20', title: 'SNEAKERS VOLT FLASH', price: 1600, img: '/shoe20.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-21', title: 'ORBIT GREY SKETCHERS', price: 1600, img: '/shoe21.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-22', title: 'NIKE AIR MAX DAWN', price: 1700, img: '/shoe22.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-23', title: 'ADDIDAS ORIGINAL SUPERSTAR', price: 2200, img: '/shoe23.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
    { id: 'shoe-24', title: 'FILA DLS FOAM SNEAKERS', price: 1500, img: '/shoe24.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: false },
    { id: 'shoe-25', title: 'B O A KNIT SNEAKERS', price: 2000, img: '/shoe25.jpeg', category: 'shoes', categoryLabel: 'Footwear Collection', isHot: true },
  ];

  // 2. Women's Collection
  const womenData = [
    { id: 'w-1', title: 'Embroidered Lawn Suit (3 Piece)', category: 'women', categoryLabel: "Ladies Suits", price: 4500, img: '/women-suit1.jpeg', isHot: true },
    { id: 'w-2', title: 'Gold-Plated Designer Jewelry Set', category: 'women', categoryLabel: 'Jewelry', price: 2200, img: '/jewelry1.jpeg', isHot: false },
    { id: 'w-3', title: 'Printed Summer Linen Suit (2 Piece)', category: 'women', categoryLabel: "Ladies Suits", price: 3800, img: '/women-suit2.jpeg', isHot: false },
    { id: 'w-4', title: 'Minimalist Zircon Crystal Pendant', category: 'women', categoryLabel: 'Jewelry', price: 1650, img: '/jewelry2.jpeg', isHot: true },
  ];

  // 3. Men's T-Shirts Collection
  const menData = [
    { id: 'm-1', title: 'TRIVO BLACK TSHIRT', category: 'men', categoryLabel: "Men's T-Shirt", price: 699, img: '/tshirt1.jpeg', isHot: true, hasSizes: true, availableSizes: ['M', 'L'] },
    { id: 'm-2', title: 'TRIVO WHITE TSHIRT', category: 'men', categoryLabel: "Men's T-Shirt", price: 699, img: '/tshirt2.jpeg', isHot: false, hasSizes: true, availableSizes: ['M', 'L'] },
    { id: 'm-3', title: 'TRIVO BLACK DROP-SHOULDER', category: 'men', categoryLabel: "Men's T-Shirt", price: 749, img: '/tshirt3.jpeg', isHot: false, hasSizes: true, availableSizes: ['M', 'L'] },
    { id: 'm-4', title: 'TRIVO WHITE DROP-SHOULDER', category: 'men', categoryLabel: "Men's T-Shirt", price: 749, img: '/tshirt4.jpeg', isHot: true, hasSizes: true, availableSizes: ['M', 'L'] },
  ];

  // Reviews Data
  const reviews = [
    { id: 1, name: "Hamza Ahmed", city: "Karachi", rating: 5, comment: "Bohot zabardast sneakers hain! Size bilkul perfect aaya aur delivery bhi bohot fast thi." },
    { id: 2, name: "Ayesha Khan", city: "Karachi", rating: 5, comment: "Lawn suit ki quality bohot achi hai. Picture jaisa hi product mil gya." },
    { id: 3, name: "Usman Ali", city: "Karachi", rating: 5, comment: "T-Shirt ka fabric kaafi soft hai. Rs. 699 me behtereen cheez hai." }
  ];

  const allProducts = [...shoesData, ...womenData, ...menData];

  // Helper Filter Logic
  const filterProduct = (item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === 'under1500') matchesPrice = item.price < 1500;
    else if (priceFilter === '1500to2000') matchesPrice = item.price >= 1500 && item.price <= 2000;
    else if (priceFilter === 'above2000') matchesPrice = item.price > 2000;

    return matchesSearch && matchesPrice;
  };

  const filteredShoes = shoesData.filter(filterProduct);
  const filteredWomen = womenData.filter(filterProduct);
  const filteredMen = menData.filter(filterProduct);
  const filteredAll = allProducts.filter(filterProduct);

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleOpenModal = (item: any) => {
    setSelectedProduct(item);
    if (item.hasSizes) {
      setModalSize(selectedSizes[item.id] || 'M');
    }
  };

  // Cart Functions
  const addToCart = (product: any, chosenSize?: string) => {
    const sizeToSave = product.hasSizes ? (chosenSize || selectedSizes[product.id] || 'M') : null;
    const cartItemId = sizeToSave ? `${product.id}-${sizeToSave}` : product.id;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartItemId, selectedSize: sizeToSave, quantity: 1 }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
    setCheckoutStep('cart');
  };

  const updateQuantity = (cartItemId: string, amount: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any[]
    );
  };

  // Coupon Logic
  const handleApplyCoupon = () => {
    setCouponError('');
    const cleanCode = couponCode.trim().toUpperCase();

    if (cleanCode === 'TRIVO10') {
      setAppliedCoupon({ code: 'TRIVO10', type: 'percent', value: 10 });
      setCouponCode('');
    } else if (cleanCode === 'FREE300') {
      setAppliedCoupon({ code: 'FREE300', type: 'free_shipping', value: DELIVERY_CHARGES });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try TRIVO10 or FREE300');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Cart Totals Calculation
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  let finalDeliveryCharges = cartItems.length > 0 ? DELIVERY_CHARGES : 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'free_shipping') {
      discountAmount = DELIVERY_CHARGES;
      finalDeliveryCharges = 0;
    }
  }

  const grandTotal = cartItems.length > 0 ? (cartSubtotal - (appliedCoupon?.type === 'percent' ? discountAmount : 0)) + finalDeliveryCharges : 0;

  // Supabase Integration with Checkout Form
  const handleWebsiteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill all required fields');
      return;
    }
    if (customerInfo.paymentMethod !== 'cod' && !customerInfo.transactionId) {
      alert('Please enter Transaction ID / TRX ID for online payment');
      return;
    }

    try {
      const { data, error } = await supabase.from('orders').insert([
        {
          customer_name: customerInfo.name,
          phone: customerInfo.phone,
          city: customerInfo.city,
          address: customerInfo.address,
          payment_method: customerInfo.paymentMethod,
          transaction_id: customerInfo.transactionId || 'COD',
          items: cartItems,
          total_price: grandTotal,
          status: 'pending',
        },
      ]);

      if (error) {
        console.error('Database Error:', error);
        alert('Order save karne mein masla aaya! Koshish karein dobara try karein.');
        return;
      }

      setCheckoutStep('success');
      setCartItems([]);
    } catch (err) {
      console.error(err);
      alert('Network issue! Dobara koshish karein.');
    }
  };

  const generateWhatsAppMessage = () => {
    let msg = `*NEW ORDER FROM TRIVO WEBSITE*\n\n`;
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.title}* ${item.selectedSize ? `(Size: ${item.selectedSize})` : ''}\nQty: ${item.quantity} | Price: Rs. ${item.price * item.quantity}\n\n`;
    });
    msg += `*Subtotal:* Rs. ${cartSubtotal}\n`;
    if (appliedCoupon) {
      msg += `*Coupon Applied:* ${appliedCoupon.code} (-Rs. ${discountAmount})\n`;
    }
    msg += `*Delivery Charges (Karachi):* Rs. ${finalDeliveryCharges}\n*Grand Total:* Rs. ${grandTotal}\n`;
    return encodeURIComponent(msg);
  };

  // Reusable Product Card
  const ProductCard = ({ item }: { item: any }) => {
    const currentSize = selectedSizes[item.id] || 'M';

    return (
      <div className="bg-[#11131a] border border-gray-800 rounded-xl overflow-hidden flex flex-col hover:-translate-y-2 hover:border-gray-700 transition duration-300">
        <div 
          className="relative h-64 bg-[#161822] overflow-hidden cursor-pointer"
          onClick={() => handleOpenModal(item)}
        >
          {item.isHot && (
            <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-black px-2.5 py-1 rounded-md z-10 tracking-widest uppercase">
              HOT
            </span>
          )}
          <img 
            src={item.img} 
            alt={item.title} 
            className="w-full h-full object-cover hover:scale-105 transition duration-500" 
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', '/brandlogo.jpeg');
            }}
          />
        </div>

        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-sm font-bold text-white uppercase line-clamp-1">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{item.categoryLabel}</p>

            {item.hasSizes && (
              <div className="mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Select Size:
                </span>
                <div className="flex gap-2">
                  {item.availableSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(item.id, size)}
                      className={`px-3 py-1.5 rounded-md text-xs font-black transition-all duration-200 border ${
                        currentSize === size
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-[#161822] text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                      }`}
                    >
                      {size === 'M' ? 'Medium (M)' : 'Large (L)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-2 gap-2">
            <span className="text-sm font-extrabold text-white">Rs. {item.price.toLocaleString()}</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => addToCart(item, currentSize)}
                className="px-2.5 py-1.5 bg-white text-black rounded text-xs font-extrabold uppercase hover:bg-gray-200 transition"
              >
                + Cart
              </button>
              <button 
                onClick={() => handleOpenModal(item)}
                className="px-2.5 py-1.5 border border-gray-700 text-white rounded text-xs font-bold uppercase hover:bg-gray-800 transition"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const selectedAcc = (paymentAccounts as any)[customerInfo.paymentMethod];

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-200 font-sans relative flex flex-col justify-between">
      <div>
        {/* Top Announcement Bar */}
        <div className="bg-black text-gray-300 text-center py-2 text-xs font-bold tracking-widest uppercase border-b border-gray-800">
          ⚡ USE CODE <span className="text-yellow-400">TRIVO10</span> FOR 10% OFF OR <span className="text-green-400">FREE300</span> FOR FREE DELIVERY ⚡
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 bg-[#090a0f]/95 backdrop-blur border-b border-gray-800">
          <div 
            onClick={() => setActiveCategory('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img src="/brandlogo.jpeg" alt="TRIVO Logo" className="h-10 w-auto object-contain rounded-md" />
            <span className="text-xl font-black tracking-widest text-white uppercase">TRIVO</span>
          </div>
          <nav className="hidden md:flex gap-6 text-xs font-bold tracking-wider uppercase text-gray-400">
            <button onClick={() => setActiveCategory('home')} className={activeCategory === 'home' ? 'text-white underline' : 'hover:text-white'}>Home Page</button>
            <button onClick={() => setActiveCategory('shoes')} className={activeCategory === 'shoes' ? 'text-white underline' : 'hover:text-white'}>Shoes ({shoesData.length})</button>
            <button onClick={() => setActiveCategory('women')} className={activeCategory === 'women' ? 'text-white underline' : 'hover:text-white'}>Ladies Suits & Jewelry</button>
            <button onClick={() => setActiveCategory('men')} className={activeCategory === 'men' ? 'text-white underline' : 'hover:text-white'}>Men T-Shirts</button>
          </nav>
          
          {/* Cart Toggle Button */}
          <button 
            onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
            className="bg-white text-black px-5 py-2 rounded-full text-xs font-extrabold tracking-wider uppercase hover:bg-gray-200 transition flex items-center gap-2"
          >
            🛒 Cart ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)})
          </button>
        </header>

        {/* Main Showcase */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Search Bar & Filter Controls */}
          <div className="bg-[#11131a] border border-gray-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 text-xs">
                🔍
              </span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shoes, t-shirts, suits, etc..."
                className="w-full bg-[#161822] border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs font-bold uppercase text-gray-400 whitespace-nowrap">Filter Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="bg-[#161822] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under1500">Under Rs. 1,500</option>
                <option value="1500to2000">Rs. 1,500 - Rs. 2,000</option>
                <option value="above2000">Above Rs. 2,000</option>
              </select>
            </div>
          </div>

          {/* Category Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { id: 'home', label: '🏠 Showcase Portions' },
              { id: 'shoes', label: `👟 Shoes Collection (${shoesData.length})` },
              { id: 'women', label: '👗 Ladies Suits & Jewelry' },
              { id: 'men', label: '👕 Men T-Shirts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition duration-300 ${
                  activeCategory === tab.id
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-[#161822] text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeCategory === 'home' ? (
            <div className="space-y-12">
              {filteredShoes.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 border-b border-gray-800 pb-3">👟 Shoes Collection</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredShoes.slice(0, 4).map((item) => <ProductCard key={item.id} item={item} />)}
                  </div>
                </section>
              )}

              {filteredWomen.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 border-b border-gray-800 pb-3">👗 Ladies Suits & Jewelry</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredWomen.map((item) => <ProductCard key={item.id} item={item} />)}
                  </div>
                </section>
              )}

              {filteredMen.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 border-b border-gray-800 pb-3">👕 Men's T-Shirts</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredMen.map((item) => <ProductCard key={item.id} item={item} />)}
                  </div>
                </section>
              )}

              {filteredShoes.length === 0 && filteredWomen.length === 0 && filteredMen.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-bold uppercase mb-2">No Products Found</p>
                  <p className="text-xs">Try searching for something else or reset the price filter.</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {filteredAll.filter((p) => p.category === activeCategory).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredAll.filter((p) => p.category === activeCategory).map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-bold uppercase mb-2">No Products Match Your Criteria</p>
                  <p className="text-xs">Try adjusting your search query or price filter.</p>
                </div>
              )}
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="mt-20 border-t border-gray-800 pt-12">
            <h3 className="text-xl font-black text-white uppercase tracking-wider text-center mb-8">What Our Customers Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-[#11131a] border border-gray-800 p-5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{rev.name} ({rev.city})</span>
                    <span className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#11131a] border border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-black/50 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold z-10 hover:bg-white hover:text-black transition"
            >
              ✕
            </button>
            <div className="h-72 bg-[#161822]">
              <img 
                src={selectedProduct.img} 
                alt={selectedProduct.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', '/brandlogo.jpeg');
                }}
              />
            </div>
            <div className="p-6">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{selectedProduct.categoryLabel}</span>
              <h3 className="text-xl font-black text-white mt-1 mb-2 uppercase">{selectedProduct.title}</h3>
              <p className="text-2xl font-black text-white mb-4">Rs. {selectedProduct.price.toLocaleString()}</p>

              {selectedProduct.hasSizes && (
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Selected Size:
                  </label>
                  <div className="flex gap-3">
                    {selectedProduct.availableSizes?.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => {
                          setModalSize(size);
                          handleSizeSelect(selectedProduct.id, size);
                        }}
                        className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                          modalSize === size
                            ? 'bg-white text-black border-2 border-white'
                            : 'bg-[#161822] text-gray-400 border border-gray-700 hover:border-gray-500'
                        }`}
                      >
                        {size === 'M' ? 'Medium (M)' : 'Large (L)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => addToCart(selectedProduct, modalSize)}
                  className="w-full py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition hover:bg-gray-200"
                >
                  Add To Cart 🛒
                </button>
                <a 
                  href={`https://wa.me/923362279124?text=Hi%20TRIVO,%20I%20want%20to%20order:%20${encodeURIComponent(selectedProduct.title)}${selectedProduct.hasSizes ? `%20(Size:%20${modalSize})` : ''}%20Price:%20Rs.${selectedProduct.price}%20%2B%20Rs.300%20Delivery`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-center font-extrabold text-xs uppercase tracking-wider rounded-xl block transition"
                >
                  Order WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Cart Drawer & Dual Checkout */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11131a] border-l border-gray-800 w-full max-w-md h-full flex flex-col justify-between p-6 relative overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
              <h2 className="text-lg font-black uppercase text-white tracking-wider">
                {checkoutStep === 'cart' && 'Your Shopping Cart'}
                {checkoutStep === 'form' && 'Delivery Information'}
                {checkoutStep === 'success' && 'Order Placed!'}
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: CART ITEMS VIEW */}
            {checkoutStep === 'cart' && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-12">
                    <span className="text-4xl mb-2">🛒</span>
                    <p className="text-sm font-bold uppercase">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="flex gap-4 items-center bg-[#161822] p-3 rounded-xl border border-gray-800">
                        <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-white uppercase line-clamp-1">{item.title}</h4>
                          {item.selectedSize && <p className="text-[10px] text-gray-400">Size: {item.selectedSize}</p>}
                          <p className="text-xs font-black text-white mt-1">Rs. {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#090a0f] border border-gray-800 px-2 py-1 rounded-lg">
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="text-xs font-bold px-1 text-gray-400 hover:text-white">-</button>
                          <span className="text-xs font-bold text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="text-xs font-bold px-1 text-gray-400 hover:text-white">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cartItems.length > 0 && (
                  <div className="border-t border-gray-800 pt-4 mt-4 space-y-3">
                    
                    {/* Coupon Code Input Section */}
                    {!appliedCoupon ? (
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Discount Code (e.g. TRIVO10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 bg-[#161822] border border-gray-800 rounded-lg px-3 py-2 text-xs text-white uppercase placeholder-gray-500 focus:outline-none focus:border-white"
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            className="bg-white text-black px-4 py-2 rounded-lg text-xs font-extrabold uppercase hover:bg-gray-200 transition"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-[#161822] px-3 py-2 rounded-lg border border-green-800 text-xs">
                        <span className="text-green-400 font-bold">Coupon ({appliedCoupon.code}) Applied!</span>
                        <button onClick={removeCoupon} className="text-gray-400 hover:text-white text-xs underline">Remove</button>
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs text-gray-400 pt-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="text-white font-bold">Rs. {cartSubtotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-400">
                          <span>Discount:</span>
                          <span>- Rs. {discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery (Karachi):</span>
                        <span className="text-white font-bold">{finalDeliveryCharges === 0 ? 'FREE' : `Rs. ${finalDeliveryCharges}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-gray-800">
                        <span>Grand Total:</span>
                        <span>Rs. {grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button 
                        onClick={() => setCheckoutStep('form')}
                        className="w-full bg-white text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-gray-200 transition"
                      >
                        Checkout Form
                      </button>
                      <a 
                        href={`https://wa.me/923362279124?text=${generateWhatsAppMessage()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1 transition"
                      >
                        WhatsApp Checkout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: CHECKOUT FORM VIEW */}
            {checkoutStep === 'form' && (
              <form onSubmit={handleWebsiteCheckout} className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 text-xs overflow-y-auto pr-1">
                  <div>
                    <label className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Full Name *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Ali Khan"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full bg-[#161822] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Phone / WhatsApp *</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="03001234567"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full bg-[#161822] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">City *</label>
                    <input 
                      required
                      type="text" 
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full bg-[#161822] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Complete Address *</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="House/Plot #, Street, Area"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full bg-[#161822] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Payment Method *</label>
                    <select
                      value={customerInfo.paymentMethod}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
                      className="w-full bg-[#161822] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-white cursor-pointer"
                    >
                      <option value="cod">Cash on Delivery (COD)</option>
                      <option value="jazzcash_abdul">JazzCash - Abdul Ahad (03312918129)</option>
                      <option value="jazzcash_fahad">JazzCash - Mohammad Fahad (03220395632)</option>
                      <option value="easypaisa">EasyPaisa - Abdul Ahad (03312918129)</option>
                    </select>
                  </div>

                  {/* Account details box for online transfer */}
                  {selectedAcc && (
                    <div className="bg-[#161822] p-3 rounded-xl border border-gray-800 space-y-2">
                      <p className="text-[10px] text-yellow-400 font-bold uppercase">Transfer Amount: Rs. {grandTotal}</p>
                      <p className="text-xs text-gray-300">Account: <span className="font-bold text-white">{selectedAcc.title}</span></p>
                      <p className="text-xs text-gray-300">Number: <span className="font-bold text-white">{selectedAcc.number}</span> ({selectedAcc.provider})</p>
                      
                      <div className="pt-2">
                        <label className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">TRX ID / Transaction ID *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 0928172635"
                          value={customerInfo.transactionId}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, transactionId: e.target.value })}
                          className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-800 mt-4 space-y-2">
                  <button 
                    type="submit"
                    className="w-full bg-white text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-gray-200 transition"
                  >
                    Confirm Order (Rs. {grandTotal})
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full text-gray-400 hover:text-white text-xs font-bold uppercase text-center py-1"
                  >
                    ← Back to Cart
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS VIEW */}
            {checkoutStep === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">Order Confirmed!</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Shukriya! Aapka order hamare database (Supabase) mein save ho gaya hai. Hum aap se jald hi rabta karenge.
                </p>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-gray-200 transition mt-4"
                >
                  Continue Shopping
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#050507] border-t border-gray-800 py-10 text-center text-gray-500 text-xs">
        <p className="text-white font-black tracking-widest uppercase mb-1">TRIVO FOOTWEAR</p>
        <p className="mb-4">MADE TO STAND OUT</p>
        <p>&copy; 2026 TRIVO. All Rights Reserved.</p>
      </footer>
    </div>
  );
}