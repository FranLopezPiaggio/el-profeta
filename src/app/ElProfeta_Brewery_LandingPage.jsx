'use client'

import React, { useState, useEffect } from 'react';
import {
  Beer,
  Sparkles,
  Truck,
  Calendar,
  ShoppingBag,
  PhoneCall,
  Check,
  Menu,
  X,
  ChevronRight,
  Star,
  Droplets,
  Wheat
} from 'lucide-react';

// --- DATA ---
const beers = [
  {
    id: 1,
    name: "Golden Profeta",
    category: "Rubias",
    abv: "5.2%",
    ibu: "22",
    description: "Notas de miel y pan tostado, cuerpo ligero, final limpio y refrescante.",
    price: "$4.500",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=500&fit=crop",
    badge: "Más Vendida"
  },
  {
    id: 2,
    name: "IPA Mística",
    category: "IPAs",
    abv: "6.8%",
    ibu: "55",
    description: "Explosión de lúpulo fresco, cítricos tropicales y un amargor equilibrado.",
    price: "$5.200",
    image: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400&h=500&fit=crop",
    badge: "Nueva"
  },
  {
    id: 3,
    name: "Amber MALT",
    category: "Rubias",
    abv: "5.5%",
    ibu: "28",
    description: "Caramelo suave, nueces tostadas y un color ámbar profundo.",
    price: "$4.800",
    image: "https://images.unsplash.com/photo-1575037614876-c38a4c44f5bd?w=400&h=500&fit=crop",
    badge: null
  },
  {
    id: 4,
    name: "Stout Imperial",
    category: "Negras & MALT",
    abv: "8.5%",
    ibu: "45",
    description: "Chocolate negro, café espresso y un cuerpo cremoso y sedoso.",
    price: "$6.000",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=500&fit=crop",
    badge: "Edición Limitada"
  },
  {
    id: 5,
    name: "Hazy Profeta",
    category: "IPAs",
    abv: "6.2%",
    ibu: "35",
    description: "Neipa turbia con notas de mango, maracuyá y textura aterciopelada.",
    price: "$5.500",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=500&fit=crop",
    badge: "Tendencia"
  },
  {
    id: 6,
    name: "Porter Nocturna",
    category: "Negras & MALT",
    abv: "5.8%",
    ibu: "32",
    description: "Vainilla, caramelo quemado y un toque ahumado que envuelve el paladar.",
    price: "$5.000",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=500&fit=crop",
    badge: null
  }
];

const barrelPackages = [
  { size: "10 Litros", events: "Hasta 20 personas", price: "$45.000" },
  { size: "20 Litros", events: "Hasta 40 personas", price: "$85.000" },
  { size: "30 Litros", events: "Hasta 60 personas", price: "$120.000" },
  { size: "50 Litros", events: "Hasta 100 personas", price: "$190.000" }
];

// --- COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Cervezas", href: "#cervezas" },
    { name: "Alquiler de Barriles", href: "#barriles" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FBF8F1]/95 backdrop-blur-md shadow-[#3B2314]/10 shadow-sm border-b border-[#3B2314]/10' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#D98A29] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Beer className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7C9031] border-2 border-[#FBF8F1]" />
            </div>
            <span className="text-[#3B2314] font-bold text-xl tracking-wider uppercase font-serif">
              El Profeta
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#3B2314] hover:text-[#7C9031] font-medium text-sm tracking-wide transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7C9031] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#7C9031] hover:bg-[#687a27] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Pedir por WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-[#3B2314] hover:bg-[#F3EBDD] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#FBF8F1]/95 backdrop-blur-md border-b border-[#3B2314]/10 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-[#3B2314] hover:text-[#7C9031] font-medium py-2 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#7C9031] text-white font-bold px-4 py-3 rounded-lg text-center mt-4"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="inicio" className="pt-24 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FBF8F1]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#D98A29]/15 text-[#3B2314] px-4 py-2 rounded-full text-sm font-semibold border border-[#D98A29]/20">
              <Wheat className="w-4 h-4" />
              Cerveza Artesanal de Origen
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3B2314] leading-tight font-serif">
              La Profecía de la{' '}
              <span className="text-[#D98A29]">Buena Cerveza</span>{' '}
              Artesanal
            </h1>

            <p className="text-lg text-[#3B2314]/80 leading-relaxed max-w-lg">
              Disfruta de recetas ancestrales, ingredientes 100% naturales y el verdadero sabor a lúpulo fresco. Cada trago es una revelación.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#cervezas"
                className="bg-[#D98A29] text-stone-950 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-[#b8721d] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <Beer className="w-5 h-5" />
                Ver Catálogo
              </a>
              <a
                href="#barriles"
                className="border-2 border-[#3B2314] text-[#3B2314] font-bold px-8 py-4 rounded-xl hover:bg-[#3B2314] hover:text-white transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <Truck className="w-5 h-5" />
                Alquilar Barril
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-[#3B2314]/70">
                <Check className="w-5 h-5 text-[#7C9031]" />
                <span className="text-sm font-medium">100% Natural</span>
              </div>
              <div className="flex items-center gap-2 text-[#3B2314]/70">
                <Check className="w-5 h-5 text-[#7C9031]" />
                <span className="text-sm font-medium">Elaboración Local</span>
              </div>
              <div className="flex items-center gap-2 text-[#3B2314]/70">
                <Check className="w-5 h-5 text-[#7C9031]" />
                <span className="text-sm font-medium">Envío Rápido</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="bg-[#F3EBDD] p-4 sm:p-6 rounded-3xl border border-[#3B2314]/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D98A29]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#7C9031]/10 rounded-full blur-3xl" />

              <img
                src="https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=600&fit=crop"
                alt="Cerveza artesanal El Profeta"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg relative z-10"
              />

              {/* Floating badge */}
              <div className="absolute bottom-8 left-8 z-20 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-[#3B2314]/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#7C9031]/15 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-[#7C9031]" />
                  </div>
                  <div>
                    <p className="text-[#3B2314] font-bold text-lg">+15 Estilos</p>
                    <p className="text-[#3B2314]/60 text-sm">Disponibles ahora</p>
                  </div>
                </div>
              </div>

              {/* Top right badge */}
              <div className="absolute top-8 right-8 z-20 bg-[#D98A29] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                <Star className="w-4 h-4 inline mr-1" />
                Premium Craft
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCatalog = () => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [cart, setCart] = useState([]);

  const filters = ["Todas", "IPAs", "Rubias", "Negras & MALT", "Ediciones Especiales"];

  const filteredBeers = activeFilter === "Todas"
    ? beers
    : activeFilter === "Ediciones Especiales"
      ? beers.filter(b => b.badge === "Edición Limitada" || b.badge === "Nueva")
      : beers.filter(b => b.category === activeFilter);

  const addToCart = (beer) => {
    setCart([...cart, beer]);
  };

  return (
    <section id="cervezas" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FBF8F1]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#7C9031]/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7C9031]" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B2314] font-serif mb-4">
            Catálogo de Cervezas Sagradas
          </h2>
          <p className="text-[#3B2314]/70 text-lg max-w-2xl mx-auto">
            Cada receta es una historia, cada lote es una obra de arte. Descubre nuestras creaciones más premiadas.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeFilter === filter
                  ? 'bg-[#3B2314] text-white shadow-md'
                  : 'bg-[#F3EBDD] text-[#3B2314] hover:bg-[#3B2314]/10 border border-[#3B2314]/10'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Cart indicator */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#D98A29] text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 animate-bounce">
            <ShoppingBag className="w-5 h-5" />
            {cart.length} en carrito
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBeers.map((beer) => (
            <div
              key={beer.id}
              className="group bg-[#F3EBDD] rounded-2xl overflow-hidden border border-[#3B2314]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-[#FBF8F1]">
                <img
                  src={beer.image}
                  alt={beer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {beer.badge && (
                  <div className="absolute top-4 left-4 bg-[#D98A29] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {beer.badge}
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-[#7C9031]/90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    {beer.abv} ABV
                  </span>
                  <span className="bg-[#3B2314]/80 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    {beer.ibu} IBU
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#7C9031] text-xs font-bold uppercase tracking-wider">
                    {beer.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#3B2314] mb-2 font-serif">
                  {beer.name}
                </h3>
                <p className="text-[#3B2314]/70 text-sm mb-4 leading-relaxed">
                  {beer.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#3B2314]/10">
                  <span className="text-2xl font-bold text-[#3B2314]">
                    {beer.price}
                  </span>
                  <button
                    onClick={() => addToCart(beer)}
                    className="bg-[#7C9031] hover:bg-[#687a27] text-white font-bold px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BarrelRental = () => {
  return (
    <section id="barriles" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3EBDD]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B2314] font-serif mb-4">
            ¡Lleva la Cervecería a tu Evento!
          </h2>
          <p className="text-[#3B2314]/70 text-lg max-w-2xl mx-auto">
            Alquila tu barril y convierte cualquier celebración en una experiencia artesanal inolvidable. Bodas, cumpleaños, reuniones corporativas y más.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          {/* Card 1 - Large Feature */}
          <div className="md:col-span-2 md:row-span-2 bg-[#FBF8F1] rounded-3xl overflow-hidden border border-[#3B2314]/10 shadow-lg relative group">
            <img
              src="https://images.unsplash.com/photo-1575037614876-c38a4c44f5bd?w=800&h=600&fit=crop"
              alt="Chopera serviendo cerveza"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="inline-flex items-center gap-1 bg-[#D98A29] text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                <Star className="w-4 h-4 fill-current" />
                El más elegido para eventos
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-3">
                Servicio Completo Chopera + Barril
              </h3>
              <p className="text-white/80 max-w-lg">
                Incluye la chopera de madera rústica, tubo de gas CO₂, hielo de mantenimiento y todo listo para tirar tiradas perfectas con espuma ideal.
              </p>
            </div>
          </div>

          {/* Card 2 - Capacities */}
          <div className="bg-[#FBF8F1] rounded-3xl p-6 border border-[#3B2314]/10 shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#7C9031]/15 flex items-center justify-center mb-4">
                <Beer className="w-6 h-6 text-[#7C9031]" />
              </div>
              <h3 className="text-xl font-bold text-[#3B2314] font-serif mb-4">
                Capacidades Disponibles
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["10L", "20L", "30L", "50L"].map((size) => (
                <div key={size} className="bg-[#F3EBDD] rounded-xl px-3 py-2 text-center border border-[#3B2314]/5">
                  <span className="text-[#3B2314] font-bold text-sm">{size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 - Delivery */}
          <div className="bg-[#FBF8F1] rounded-3xl p-6 border border-[#3B2314]/10 shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D98A29]/15 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-[#D98A29]" />
              </div>
              <h3 className="text-xl font-bold text-[#3B2314] font-serif mb-2">
                Entrega e Instalación
              </h3>
              <p className="text-[#3B2314]/70 text-sm">
                Te lo llevamos a domicilio y lo dejamos instalado listo para disfrutar. Sin complicaciones.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Check className="w-5 h-5 text-[#7C9031]" />
              <span className="text-sm font-medium text-[#3B2314]">Incluido en el servicio</span>
            </div>
          </div>

          {/* Card 4 - Wide CTA */}
          <div className="md:col-span-3 bg-[#1C1917] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3B2314]/20">
            <div className="text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-2">
                ¿Tienes una fiesta este fin de semana?
              </h3>
              <p className="text-white/70">
                Cotiza tu barril en minutos y asegura el mejor momento para tus invitados.
              </p>
            </div>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D98A29] text-stone-950 font-extrabold px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <PhoneCall className="w-5 h-5" />
              Cotizar por WhatsApp
            </a>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {barrelPackages.map((pkg, idx) => (
            <div key={idx} className="bg-[#FBF8F1] rounded-2xl p-6 border border-[#3B2314]/10 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 rounded-full bg-[#7C9031]/15 flex items-center justify-center mx-auto mb-4">
                <Beer className="w-8 h-8 text-[#7C9031]" />
              </div>
              <h4 className="text-lg font-bold text-[#3B2314] mb-1">{pkg.size}</h4>
              <p className="text-[#3B2314]/60 text-sm mb-3">{pkg.events}</p>
              <p className="text-2xl font-bold text-[#D98A29]">{pkg.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="nosotros" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FBF8F1]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-[#F3EBDD] p-4 rounded-3xl border border-[#3B2314]/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=600&h=500&fit=crop"
                alt="Proceso artesanal"
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#7C9031] text-white p-6 rounded-2xl shadow-xl hidden lg:block">
              <p className="text-3xl font-bold">5+</p>
              <p className="text-sm opacity-90">Años de tradición</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#7C9031]/15 text-[#3B2314] px-4 py-2 rounded-full text-sm font-semibold">
              <Wheat className="w-4 h-4" />
              Nuestra Historia
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3B2314] font-serif">
              De la Tierra a tu Vaso
            </h2>
            <p className="text-[#3B2314]/80 leading-relaxed">
              El Profeta nació de una profecía simple: crear la cerveza más honesta y deliciosa de la región. Utilizamos agua de manantial local, malta seleccionada de agricultores cercanos y lúpulo cultivado en nuestras propias tierras.
            </p>
            <p className="text-[#3B2314]/80 leading-relaxed">
              Cada lote es elaborado con paciencia, respetando los tiempos naturales de fermentación y maduración. No usamos aditivos ni aceleradores químicos. Solo ingredientes puros y mucha pasión.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-[#F3EBDD] rounded-xl p-4 border border-[#3B2314]/5">
                <p className="text-2xl font-bold text-[#D98A29]">100%</p>
                <p className="text-sm text-[#3B2314]/70">Ingredientes naturales</p>
              </div>
              <div className="bg-[#F3EBDD] rounded-xl p-4 border border-[#3B2314]/5">
                <p className="text-2xl font-bold text-[#D98A29]">15+</p>
                <p className="text-sm text-[#3B2314]/70">Estilos diferentes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contacto" className="bg-[#181513] text-stone-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#D98A29] flex items-center justify-center">
                <Beer className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-wider uppercase font-serif">
                El Profeta
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Cerveza artesanal elaborada con ingredientes 100% naturales y mucha pasión. La profecía de la buena cerveza.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Navegación</h4>
            <ul className="space-y-2">
              {["Inicio", "Cervezas", "Alquiler de Barriles", "Nosotros", "Contacto"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(/ /g, '')}`} className="text-stone-400 hover:text-[#D98A29] transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#7C9031]" />
                +56 9 1234 5678
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#7C9031]" />
                Envíos a todo Santiago
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7C9031]" />
                Lun - Sáb: 12:00 - 00:00
              </li>
            </ul>
          </div>

          {/* Social / CTA */}
          <div>
            <h4 className="text-white font-bold mb-4">Síguenos</h4>
            <div className="flex gap-3 mb-6">
              {["Instagram", "Facebook", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#3B2314]/50 flex items-center justify-center hover:bg-[#D98A29] transition-colors"
                >
                  <span className="text-xs font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#7C9031] hover:bg-[#687a27] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm w-full justify-center"
            >
              <PhoneCall className="w-4 h-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-[#3B2314]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © 2024 El Profeta Craft Brewery. Todos los derechos reservados.
          </p>
          <p className="text-stone-600 text-xs">
            El exceso de alcohol es perjudicial para la salud. Consume con moderación.
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN APP ---
const App = () => {
  return (
    <div className="min-h-screen bg-[#FBF8F1] font-sans">
      <Navbar />
      <Hero />
      <ProductCatalog />
      <BarrelRental />
      <About />
      <Footer />
    </div>
  );
};

export default App;
