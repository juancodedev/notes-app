import "@fontsource/inter/latin.css"
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Toaster } from 'sonner'

const Home = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <header className='px-4 lg:px-6 h-14 flex items-center border-b'>
                <Link className='flex items-center justify-center' to='/'>
                    <span className='text-xl font-bold'>NotesApp</span>
                </Link>
                <nav className='ml-auto flex gap-4 sm:gap-6'>
                    <Link className='text-sm font-medium hover:underline underline-offset-4' to='/login'>
                        Iniciar Sesión
                    </Link>
                    <Link className='text-sm font-medium hover:underline underline-offset-4' to='/register'>
                        Registrarse
                    </Link>
                </nav>
            </header>
            <main className='flex-1 font-inter'>
                <Toaster />
                <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
                    <div className='container px-4 md:px-6'>
                        <div className='flex flex-col items-center justify-center space-y-4'>
                            <div className='space-y-2'>
                                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                                    Sistema de Administración de Notas
                                </h1>
                                <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                                    Crea, edita y administra tus notas con facilidad. Colabora en tiempo real con otros usuarios.
                                </p>
                            </div>
                            <div className='space-x-4'>
                                <Link to='/register'>
                                    <Button>Comenzar Ahora</Button>
                                </Link>
                                <Link to='/login'>
                                    <Button variant='outline'>Iniciar Sesión</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800'>
                    <div className='container px-4 md:px-6'>
                        <div className='grid gap-6 lg:grid-cols-3 items-start'>
                            <div className='flex flex-col justify-center space-y-4'>
                                <div className='space-y-2'>
                                    <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl'>
                                        Crea y Edita Notas
                                    </h2>
                                    <p className='text-gray-500 dark:text-gray-400'>
                                        Crea nuevas notas y edítalas con un editor intuitivo y fácil de usar.
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center space-y-4'>
                                <div className='space-y-2'>
                                    <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl'>Edición Colaborativa</h2>
                                    <p className='text-gray-500 dark:text-gray-400'>
                                        Trabaja en tus notas con otros usuarios en tiempo real.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Resolución de Conflictos</h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Fusiona cambios, descarta o reintenta cuando ocurran conflictos de edición.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 NotesApp. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;