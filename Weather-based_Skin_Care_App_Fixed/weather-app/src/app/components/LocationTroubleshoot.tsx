import { AlertCircle, CheckCircle2, Lock, MapPin, Wifi, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LocationTroubleshootProps {
  errorCode?: number;
  onClose: () => void;
}

export function LocationTroubleshoot({ errorCode, onClose }: LocationTroubleshootProps) {
  const getTroubleshootingSteps = () => {
    switch (errorCode) {
      case 1: // PERMISSION_DENIED
        return {
          title: 'Automatic Location Not Available',
          icon: <MapPin className="w-6 h-6 text-blue-500" />,
          steps: [
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Use the search box below to enter your city name'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Or select from popular locations for quick access'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Your skincare routine will update based on the location you choose'
            }
          ],
          additionalInfo: 'Location services may be restricted in this environment. Manual city search works great!'
        };
      
      case 2: // POSITION_UNAVAILABLE
        return {
          title: 'Location Unavailable',
          icon: <Wifi className="w-6 h-6 text-orange-500" />,
          steps: [
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Check if location services are enabled on your device'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Make sure you have internet connectivity'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Try moving to a location with better GPS signal'
            }
          ],
          additionalInfo: 'Windows: Settings → Privacy → Location | Mac: System Preferences → Security & Privacy → Location Services'
        };
      
      case 3: // TIMEOUT
        return {
          title: 'Location Request Timed Out',
          icon: <Clock className="w-6 h-6 text-yellow-500" />,
          steps: [
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Wait a few seconds and try again'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Check your internet connection'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Move to an area with better GPS reception'
            }
          ],
          additionalInfo: 'If this persists, try entering your city name manually instead.'
        };
      
      default:
        return {
          title: 'Location Access Help',
          icon: <AlertCircle className="w-6 h-6 text-blue-500" />,
          steps: [
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Ensure location services are enabled'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Grant permission when prompted'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              text: 'Check your browser settings'
            }
          ],
          additionalInfo: 'Alternatively, you can enter your city name manually below.'
        };
    }
  };

  const troubleshoot = getTroubleshootingSteps();

  const isPermissionsPolicyError = errorCode === 1;
  const borderColor = isPermissionsPolicyError ? 'border-blue-200' : 'border-orange-200';
  const bgColor = isPermissionsPolicyError ? 'bg-blue-50' : 'bg-orange-50';

  return (
    <Card className={`border-2 ${borderColor} ${bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {troubleshoot.icon}
            <CardTitle className="text-base">{troubleshoot.title}</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm mb-3">{isPermissionsPolicyError ? 'How to use SkinWeather:' : 'Try these steps:'}</h4>
          <ol className="space-y-2">
            {troubleshoot.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <div className="flex items-start gap-2 pt-1">
                  <span className="flex-shrink-0 text-green-600">{step.icon}</span>
                  <span className="text-gray-700">{step.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white/60 rounded-lg p-3 text-xs text-gray-600">
          <strong>{isPermissionsPolicyError ? 'Note:' : 'System Settings:'}</strong> {troubleshoot.additionalInfo}
        </div>

        {!isPermissionsPolicyError && (
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-900 border border-blue-200">
            <strong>💡 Alternative:</strong> You can enter your city name in the search box below instead of using automatic location.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
