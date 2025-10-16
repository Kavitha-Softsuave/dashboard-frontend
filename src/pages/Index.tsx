import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, BoxSelect } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard & Widget Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Create powerful data visualizations and build custom dashboards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-primary" onClick={() => navigate('/widgets')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <BoxSelect className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Create Widget</h2>
              <p className="text-muted-foreground">
                Design and configure chart widgets with various visualization types
              </p>
              <Button className="w-full mt-4" size="lg">
                Manage Widgets
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-primary" onClick={() => navigate('/dashboard')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <LayoutDashboard className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Create Dashboard</h2>
              <p className="text-muted-foreground">
                Build interactive dashboards by arranging and resizing widgets
              </p>
              <Button className="w-full mt-4" size="lg">
                Build Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
