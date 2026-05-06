import { Sunrise, Moon, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface RoutineStep {
  step: number;
  name: string;
  product: string;
  reason: string;
}

interface SkincareRoutineProps {
  morning: RoutineStep[];
  evening: RoutineStep[];
  tips: string[];
}

export function SkincareRoutine({ morning, evening, tips }: SkincareRoutineProps) {
  return (
    <div className="space-y-6">
      {/* Morning Routine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-orange-500" />
            Morning Routine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {morning.map((step) => (
              <div key={step.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{step.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{step.product}</p>
                  <p className="text-xs text-gray-500 italic">{step.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evening Routine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-500" />
            Evening Routine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evening.map((step) => (
              <div key={step.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{step.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{step.product}</p>
                  <p className="text-xs text-gray-500 italic">{step.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather-Specific Tips */}
      {tips.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertCircle className="w-5 h-5" />
              Weather-Specific Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex gap-2">
                  <Badge variant="secondary" className="flex-shrink-0">
                    Tip {index + 1}
                  </Badge>
                  <p className="text-sm text-blue-900">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
