
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">IGNIS</h3>
          <p className="text-gray-400 mb-4">Conectando dados, salvando vidas</p>
          <div className="flex justify-center space-x-6 text-sm">
            <span>Dados: INPE • SIPAM • Meteorologia</span>
            <span>•</span>
            <span>Sistema 24/7</span>
            <span>•</span>
            <span>Emergência: 193</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
