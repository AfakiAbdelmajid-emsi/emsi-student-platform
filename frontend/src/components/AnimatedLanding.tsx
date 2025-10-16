'use client';

import Image from "next/image";
import { FaFolderOpen, FaCalendarAlt, FaRobot, FaUsers, FaArrowRight, FaGraduationCap, FaLightbulb, FaChartLine, FaBook, FaClock, FaStar, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AnimatedLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et Nom */}
            <div className="flex items-center gap-3">
              <Image src="/emsi.svg" alt="EMSI Logo" width={40} height={40} className="h-10 w-auto" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Assistant Académique EMSI</h1>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#fonctionnalites" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">Fonctionnalités</a>
              <a href="#parcours" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">Parcours EMSI</a>
              <a href="#temoignages" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">Témoignages</a>
            </nav>

            {/* CTA Buttons Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/demo"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Voir la Démo
              </a>
              <a
                href="/register"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                Commencer Maintenant
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-3">
                <a href="#fonctionnalites" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">Fonctionnalités</a>
                <a href="#parcours" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">Parcours EMSI</a>
                <a href="#temoignages" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">Témoignages</a>
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href="/demo"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Voir la Démo
                  </a>
                  <a
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-center"
                  >
                    Commencer Maintenant
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="mx-auto max-w-7xl relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium shadow-sm border border-blue-200"
              >
                <FaStar className="mr-2" />
                100% dédié aux étudiants EMSI
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Organise tes cours,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
                  planifie tes examens
                </span>
                {' '}et réussis grâce à l'IA et à la communauté EMSI.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                La plateforme qui révolutionne l'organisation académique des étudiants EMSI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="/login"
                  className="group relative rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                >
                  Commencer Maintenant
                  <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="/demo"
                  className="group rounded-lg border-2 border-blue-200 bg-white px-8 py-4 text-center text-sm font-semibold text-blue-700 shadow-sm transition-all hover:shadow-md hover:border-blue-300"
                >
                  Voir la Démo
                </motion.a>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-700 to-green-500 shadow-lg"
                    ></motion.div>
                  ))}
                </div>
                <span className="font-medium">5,000+ étudiants EMSI déjà organisés</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-green-100/50 rounded-3xl backdrop-blur-sm border border-blue-200/20 shadow-2xl"></div>
              <Image
                src="/5.jpg"
                alt="Plateforme EMSI"
                fill
                className="object-contain p-8"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section */}
      <section id="fonctionnalites" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-50">
        <div className="mx-auto max-w-7xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Fonctionnalités{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
                clés
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils intelligents conçus spécifiquement pour les étudiants EMSI, 
              de CP1 à GI3, toutes spécialités confondues.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Organisation des cours",
                description: "Tous les fichiers classés par niveau (CP1 à GI3) et spécialité.",
                icon: <FaFolderOpen className="h-8 w-8" />,
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Planificateur intelligent",
                description: "Planning automatique selon les examens et priorités.",
                icon: <FaCalendarAlt className="h-8 w-8" />,
                color: "from-green-500 to-green-600"
              },
              {
                title: "Assistant IA 24/7",
                description: "Aide immédiate sur les documents, cours et concepts.",
                icon: <FaRobot className="h-8 w-8" />,
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Communauté EMSI",
                description: "Questions, entraide et partage entre camarades EMSI.",
                icon: <FaUsers className="h-8 w-8" />,
                color: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                     style={{ background: `linear-gradient(to bottom right, ${feature.color.split(' ')[0]}, ${feature.color.split(' ')[1]})` }}></div>
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mb-6 p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 w-fit"
                  >
                    <div className="text-blue-700">
                      {feature.icon}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours EMSI Section */}
      <section id="parcours" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Parcours{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
                EMSI
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils spécialement conçus pour chaque étape de ton parcours académique à l'EMSI
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* CP1/CP2 Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-600 rounded-xl">
                  <FaGraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">CP1 & CP2</h3>
                  <p className="text-blue-700 font-medium">Classes Préparatoires</p>
                </div>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Cours fondamentaux :</strong> Maths, Physique, Informatique
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Révision pour examens de passage</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Aide IA pour les bases scientifiques</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Collaboration entre étudiants</strong>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* GI1/GI2/GI3 Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-green-600 rounded-xl">
                  <FaLightbulb className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">GI1, GI2 & GI3</h3>
                  <p className="text-green-700 font-medium">Cycle Ingénieur</p>
                </div>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Cours spécialisés selon la filière :</strong> Génie Informatique, Génie Industriel, Génie Civil, etc.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Suivi de projets, stages et PFE</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Aide IA pour projets techniques complexes</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Réseau entre étudiants et anciens EMSI</strong>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-50">
        <div className="mx-auto max-w-7xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Témoignages{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
                étudiants
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Découvre comment la plateforme aide les étudiants EMSI à réussir dans leurs études
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "L'organisation des cours m'a sauvé la vie ! Je ne perds plus jamais mes documents EMSI et je peux réviser efficacement.",
                author: "El Ouafi Amine",
                role: "GI2 - Génie Informatique",
                city: "EMSI Casablanca",
                avatar: "/1.jpg"
              },
              {
                quote: "L'assistant IA m'aide à comprendre les concepts complexes de mes cours EMSI. C'est comme avoir un tuteur 24/7 !",
                author: "Yassine Benali",
                role: "GI1 - Génie Industriel",
                city: "EMSI Rabat",
                avatar: "/2.jpeg"
              },
              {
                quote: "La communauté EMSI est incroyable. J'ai trouvé de l'aide pour tous mes projets et j'ai même fait des amis !",
                author: "Imane Ouali",
                role: "GI3 - Génie Civil",
                city: "EMSI Marrakech",
                avatar: "/3.avif"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-blue-700 to-green-500 p-[2px]">
                    <div className="h-full w-full rounded-full bg-white p-[2px]">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={64}
                        height={64}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-blue-700 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.city}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Prêt(e) à mieux réussir à l'EMSI ?
          </h2>
          <p className="mx-auto text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl">
            Rejoins des milliers d'étudiants déjà organisés !
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/register"
              className="rounded-lg bg-white px-8 py-4 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              Commencer Maintenant
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/contact"
              className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/20"
            >
              Contacter le Support
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/emsi.svg" alt="EMSI Logo" width={32} height={32} />
                <div>
                  <h3 className="font-bold text-white">Assistant Académique EMSI</h3>
                  <p className="text-sm text-gray-400">Plateforme étudiante EMSI</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Développé spécialement pour les étudiants EMSI, de CP1 à GI3.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Fonctionnalités</h3>
              <ul className="space-y-2">
                <li><a href="/features" className="text-gray-400 hover:text-white transition-colors">Organisation des cours</a></li>
                <li><a href="/planning" className="text-gray-400 hover:text-white transition-colors">Planificateur intelligent</a></li>
                <li><a href="/ai-assistant" className="text-gray-400 hover:text-white transition-colors">Assistant IA</a></li>
                <li><a href="/community" className="text-gray-400 hover:text-white transition-colors">Communauté EMSI</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Gestion des cookies</a></li>
                <li><a href="/legal" className="text-gray-400 hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © 2024 Assistant Académique EMSI. Tous droits réservés.
              </p>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <span className="text-sm text-gray-400">Développé pour les étudiants EMSI</span>
                <div className="flex gap-2">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}