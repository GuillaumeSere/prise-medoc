"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";

export default function TestTimezone() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [frenchTime, setFrenchTime] = useState<string>("");
    const [testResult, setTestResult] = useState<string>("");

    const handleUpdateTimes = () => {
        const now = new Date();
        const utcTime = now.toISOString();
        
        // Heure française
        const frenchFormatter = new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Europe/Paris',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const frenchTimeString = frenchFormatter.format(now);
        
        setCurrentTime(utcTime);
        setFrenchTime(frenchTimeString);
    };

    const handleTestMedicationTime = async () => {
        try {
            const response = await fetch('/api/cron/check-medications');
            const data = await response.json();
            setTestResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setTestResult(`Erreur: ${error}`);
        }
    };

    useEffect(() => {
        handleUpdateTimes();
        const interval = setInterval(handleUpdateTimes, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Test du fuseau horaire</h1>
            
            <div className="space-y-4">
                <Card className="w-full">
                    <CardHeader className="pb-2">
                        <h2 className="text-xl font-semibold">Heures actuelles</h2>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-2">
                            <p><strong>UTC:</strong> {currentTime}</p>
                            <p><strong>Français:</strong> {frenchTime}</p>
                        </div>
                        <Button 
                            onClick={handleUpdateTimes} 
                            className="mt-4" 
                            variant="default" 
                            size="default"
                            aria-label="Actualiser les heures affichées"
                            tabIndex={0}
                        >
                            Actualiser
                        </Button>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="pb-2">
                        <h2 className="text-xl font-semibold">Test de l'API de vérification</h2>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <Button 
                            onClick={handleTestMedicationTime} 
                            className="mb-4" 
                            variant="default" 
                            size="default"
                            aria-label="Tester l'API de vérification des médicaments"
                            tabIndex={0}
                        >
                            Tester l'API maintenant
                        </Button>
                        {testResult && (
                            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                                {testResult}
                            </pre>
                        )}
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="pb-2">
                        <h2 className="text-xl font-semibold">Instructions de test</h2>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-2 text-sm">
                            <p>1. Vérifiez que l'heure française affichée correspond à votre heure locale</p>
                            <p>2. Cliquez sur "Tester l'API maintenant" pour voir les logs de l'API</p>
                            <p>3. Vérifiez dans les logs que l'heure française est correcte</p>
                            <p>4. Si vous avez un médicament programmé, l'API devrait l'envoyer à la bonne heure</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
