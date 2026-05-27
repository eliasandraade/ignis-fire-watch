
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WeatherConditions = () => {
  return (
    <Card className="border-l-4 border-l-warning-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          🌦️ Condições Meteorológicas
          <Badge className="ml-2 bg-warning-100 text-warning-800">Atualizado</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Vento</p>
            <p className="font-semibold text-blue-700">15 km/h NE</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <p className="text-sm text-gray-600">Umidade</p>
            <p className="font-semibold text-red-700">32%</p>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded">
            <p className="text-sm text-gray-600">Temperatura</p>
            <p className="font-semibold text-orange-700">28°C</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Pressão</p>
            <p className="font-semibold text-gray-700">1013 hPa</p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <Badge className="bg-warning-100 text-warning-800 animate-pulse w-full justify-center">
            ⚠️ Condições favoráveis à propagação
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherConditions;
