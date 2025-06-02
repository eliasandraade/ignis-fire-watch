
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('operacional');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login realizado com sucesso",
      description: `Bem-vindo ao IGNIS, ${userType}!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fire-50 to-forest-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 fire-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">🔥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IGNIS</h1>
          <p className="text-gray-600">Conectando dados, salvando vidas</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Tipo de Usuário */}
              <div className="space-y-2">
                <Label>Tipo de Acesso</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={userType === 'operacional' ? 'default' : 'outline'}
                    onClick={() => setUserType('operacional')}
                    className="flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Operacional</span>
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'admin' ? 'default' : 'outline'}
                    onClick={() => setUserType('admin')}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@bombeiros.gov.br"
                  required
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Botão de Login */}
              <Button type="submit" className="w-full fire-gradient text-white">
                <Lock className="h-4 w-4 mr-2" />
                Acessar IGNIS
              </Button>

              {/* Links Auxiliares */}
              <div className="text-center space-y-2 text-sm">
                <a href="#" className="text-fire-600 hover:underline block">
                  Esqueci minha senha
                </a>
                <a href="/" className="text-gray-600 hover:underline block">
                  Voltar ao site público
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações de Emergência */}
        <Card className="mt-6 border-fire-200 bg-fire-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-fire-800 font-medium">
              Em caso de emergência: <strong>193</strong>
            </p>
            <p className="text-xs text-fire-600">
              Sistema disponível 24 horas por dia
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
