"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../src/components/ui/button";
import { Card, CardContent } from "../src/components/ui/card";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import { toast, Toaster } from "sonner";

export default function Page() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await emailjs.send(
                'service_rm0nsn2', 
                'template_8xb3op5', 
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                },
                '9Wd2D9zfV7aimnGD6' 
            );

            toast.success('Message envoyé avec succès !');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            toast.error('Une erreur est survenue lors de l\'envoi du message.');
            console.error('Erreur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="min-h-screen">
        <Toaster position="top-right" />
        {/* hero section here */}
        <div className="min-h-screen rounded-2xl m-2 md:m-5 flex flex-col relative overflow-hidden" style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)' }}>
            {/* blobs en fond */}           
            <div className="absolute bottom-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-70 z-0 transform scale-x-150"></div>
            <div className="absolute bottom-15 -left-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute bottom-15 -right-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-15 z-0 transform "></div>

            <div className="absolute top-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-70 z-0 transform scale-x-150"></div>
            <div className="absolute top-15 -left-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute top-15 -right-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-15 z-0 transform "></div>

            {/* navbar HERE */}
            <nav className="flex justify-between items-center py-4 px-4 md:px-10 relative z-50">
                <h1 className="text-xl md:text-2xl font-bold">Prise Médoc.</h1>
                
                {/* Menu Burger */}
                <button 
                    className={`md:hidden p-2 relative cursor-pointer z-50 ${isMenuOpen ? 'hidden' : 'block'}`}
                    onClick={handleMenuToggle}
                    aria-label="Menu"
                >
                    <div className="w-6 h-0.5 bg-black mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-black mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-black"></div>
                </button>

                {/* Menu Desktop */}
                <ul className="hidden md:flex gap-4">
                    <li className="text-md"><Link href="#about" className="hover:text-[#3b803b] transition-colors">À propos</Link></li>
                    <li className="text-md"><Link href="#features" className="hover:text-[#3b803b] transition-colors">Fonctionnalités</Link></li>
                    <li className="text-md"><Link href="#contact" className="hover:text-[#3b803b] transition-colors">Contact</Link></li>
                </ul>

                {/* Menu Mobile */}
                <div className={`fixed inset-0 bg-white z-40 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                    <div className="flex flex-col items-center justify-center h-full">
                        <button 
                            className="absolute top-4 right-10 p-2 z-50 cursor-pointer"
                            onClick={handleMenuToggle}
                            aria-label="Fermer le menu"
                        >
                            <div className="w-6 h-0.5 bg-black rotate-45 absolute"></div>
                            <div className="w-6 h-0.5 bg-black -rotate-45 absolute"></div>
                        </button>
                        <ul className="flex flex-col items-center gap-8 text-xl">
                            <li><Link href="#about" className="hover:text-[#3b803b] transition-colors" onClick={handleMenuToggle}>À propos</Link></li>
                            <li><Link href="#features" className="hover:text-[#3b803b] transition-colors" onClick={handleMenuToggle}>Fonctionnalités</Link></li>
                            <li><Link href="#contact" className="hover:text-[#3b803b] transition-colors" onClick={handleMenuToggle}>Contact</Link></li>
                            <Button variant="default" size="default" className="bg-[#77FFB2] text-black hover:text-white cursor-pointer" onClick={() => router.push("/dashboard")}>Se connecter</Button>
                        </ul>
                    </div>
                </div>

                <div className="hidden md:flex gap-4">
                    <Button variant="default" size="default" className="bg-[#77FFB2] text-black hover:text-white cursor-pointer" onClick={() => router.push("/dashboard")}>Se connecter</Button>
                </div>
            </nav>

            {/* hero content HERE */}
            <div className="flex flex-col items-center justify-center flex-grow relative z-10 px-4 md:px-0">
                <h2 className="text-2xl md:text-4xl font-bold text-center">Prise Médoc : Ne ratez plus jamais un médicament.</h2>
                <p className="my-4 text-base md:text-lg text-center">
                    Grâce à Prise Médoc, recevez vos rappels personnalisés et restez serein chaque jour.<br />
                    Une application pensée pour vous soutenir et vous simplifier la vie, à chaque étape.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mt-10">
                    <Button variant="default" size="default" className="bg-[#47f894] text-black hover:text-white cursor-pointer" onClick={() => router.push("/dashboard")}>C&apos;est partie !</Button>
                    <Button variant="default" size="default" className="bg-white text-black shadow-sm hover:text-white cursor-pointer" onClick={() => router.push("#about")}>
                    Comment ça marche ?
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row mt-10 gap-4 p-4 md:p-7 pb-10 relative z-10">
                <Card className="w-full md:w-1/3 flex flex-col justify-between items-center bg-white/20 backdrop-blur-md shadow-xl">
                    <CardContent className="flex flex-row items-center gap-4">
                        <div>
                            <Image src="/icon/verifier.svg" alt="check" width={24} height={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Simplicité</h3>  
                            <p className="text-sm">En quelques clics, on ajoute un médicament et on suit ses prises au quotidien.</p>
                        </div>
                    </CardContent>          
                </Card>      
                <Card className="w-full md:w-1/3 flex flex-col justify-between items-center bg-white/20 backdrop-blur-md shadow-xl">
                    <CardContent className="flex flex-row items-center gap-4">
                        <div>
                            <Image src="/icon/tonnerre.svg" alt="rapide" width={24} height={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Rapidité</h3>  
                            <p className="text-sm">Ajoutez, modifiez ou cochez une prise en un instant. Une interface fluide et intuitive.</p>
                        </div>
                    </CardContent>          
                </Card>  
                
                <Card className="w-full md:w-1/3 flex flex-col justify-between items-center bg-white/20 backdrop-blur-md shadow-xl">
                    <CardContent className="flex flex-row items-center gap-4">
                        <div>
                            <Image src="/icon/rappel.svg" alt="rappel" width={24} height={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Rappels fiables</h3>  
                            <p className="text-sm">Recevez vos rappels à l&apos;heure prévue. Plus besoin de se poser de question.</p>
                        </div>
                    </CardContent>          
                </Card>   
            </div>
        </div>

        <div className="mx-4 md:mx-[10%] mt-[5%] flex flex-col">
            {/* A propos HERE*/}
            <section id="about">
                <div className="flex flex-col md:flex-row my-[10%] gap-10 md:gap-20">
                    <div className="w-full md:w-1/3">
                        <Image src="/img/oublie.png" alt="medicament" className="h-full w-full object-cover" width={300} height={300} />
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col">
                        <h2 className="text-2xl md:text-4xl font-bold">Ne ratez plus jamais un médicament.</h2>
                        <p className="my-4 text-base md:text-lg">
                            Tout a commencé avec ma mère, qui oubliait souvent de prendre ses médicaments.Rien de grave… sauf quand ça devient quotidien. 
                            Il fallait lui rappeler,et souvent vérifier. Et je me suis dit : Pourquoi ne pas créer une application simple, faite pour elle ?
                            Prise Médoc est né de là.
                            Créer une app accessible, douce, utile, qui ne complique pas les choses mais qui les rend plus faciles. 
                            Parce qu&apos;un simple rappel au bon moment, ça peut vraiment faire la différence.
                        </p>
                        <Button variant="default" size="default" className="w-fit self-start bg-[#77FFB2] text-black hover:text-white cursor-pointer" onClick={()=> router.push("/dashboard")}>C&apos;est partie !</Button>
                    </div>
                </div>
            </section>

            {/* fonctionnalité */}
            <Card className="bg-gradient-to-b from-[#88C8FF] to-[#ffffff] my-[5%]" id="features">
                <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Card className="w-full md:w-1/4 flex flex-col bg-white/20 backdrop-blur-md shadow-xl min-h-[350px]">
                        <CardContent className="flex flex-col gap-4 flex-1 justify-end">
                            <div className="flex justify-center items-center">
                                <Image src="/img/medic.png" alt="medicaments" width={200} height={100} />
                            </div>
                            <h5>Ajout & gestion des médicaments</h5>
                            <p className="text-sm">Ajoutez un traitement en quelques secondes, choisissez l&apos;heure de prise et laissez l&apos;application s&apos;en charger. Simple, rapide et efficace.</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full md:w-1/4 flex flex-col bg-white/20 backdrop-blur-md shadow-xl min-h-[350px]">
                        <CardContent className="flex flex-col gap-4 flex-1 justify-end">
                            <div className="flex justify-center items-center">
                                <Image src="/img/push.png" alt="push" width={200} height={100} />
                            </div>
                            <h5>Rappels & notifications</h5>
                            <p className="text-sm">Recevez une alerte au bon moment. Plus besoin d&apos;y penser, Prise Médoc vous le rappelle.</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full md:w-1/4 flex flex-col bg-white/20 backdrop-blur-md shadow-xl min-h-[350px]">
                        <CardContent className="flex flex-col gap-4 flex-1 justify-end">
                            <div className="flex justify-center items-center">
                                <Image src="/img/checklist.png" alt="checklist" width={200} height={100} />
                            </div>
                            <h5>Suivi de prise</h5>
                            <p className="text-sm">Un bouton suffit pour marquer un médicament comme &quot;pris&quot; ou &quot;oublié&quot;. Le statut s&apos;affiche pour mieux suivre la journée.</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full md:w-1/4 flex flex-col bg-white/20 backdrop-blur-md shadow-xl min-h-[350px]">
                        <CardContent className="flex flex-col gap-4 flex-1 justify-end">
                            <div className="flex justify-center items-center">
                                <Image src="/img/solidarity.png" alt="check" width={200} height={100} />
                            </div>
                            <h5>Adaptée à tous</h5>
                            <p className="text-sm">Pensée pour les proches, les familles, les personnes âgées : une interface claire, lisible et accessible à tous.</p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

            {/* Contact HERE */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-20 my-[15%]" id="contact">
                <div className="w-full md:w-1/2 flex flex-col">
                    <h2 className="text-2xl md:text-4xl font-bold color-[#008CFF]">Contactez-moi</h2>
                 
                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex flex-col gap-2">
                            <p className="text-lg">Email</p>
                            <a href="mailto:guillaumesere60@gmail.com" className="text-sm">guillaumesere60@gmail.com</a>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <Card className="bg-gradient-to-b from-[#88C8FF] to-[#ffffff]">
                        <CardContent className="flex flex-col gap-4 m-4 md:m-10">
                            <h5>Restons en contact</h5>
                            <p className="text-sm">Vous pouvez aussi m&apos;écrire directement via le formulaire de contact. Je vous répondrai dès que possible.</p>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nom" 
                                    className="border-b border-black p-2" 
                                    required
                                />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email" 
                                    className="border-b border-black p-2" 
                                    required
                                />
                                <textarea 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Message" 
                                    className="border-b border-black p-2"
                                    required
                                ></textarea>
                                <Button 
                                    variant="default" 
                                    size="default" 
                                    type="submit" 
                                    className="w-fit self-start bg-[#77FFB2] text-black cursor-pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Envoi en cours...' : 'Envoyer'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        {/* footer HERE */}
        <footer className="flex justify-center items-center h-20 bg-[#88C8FF] rounded-t-2xl mt-[5%]">
            <p className="text-sm">© 2025 Prise Médoc. Tous droits réservés.</p>
        </footer>
      </div>
    );
  }
  