
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PublicInformation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Informações Públicas - Segurança</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-fire-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="font-semibold mb-2">Em Caso de Emergência</h3>
            <p className="text-sm text-gray-600">
              Ligue 193 imediatamente e siga as orientações dos bombeiros.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="font-semibold mb-2">Mantenha-se Seguro</h3>
            <p className="text-sm text-gray-600">
              Evite áreas com fumaça, mantenha janelas fechadas e tenha sempre uma rota de fuga.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold mb-2">Reporte Focos</h3>
            <p className="text-sm text-gray-600">
              Use nossa assistente AURORA para reportar novos focos de incêndio rapidamente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicInformation;
