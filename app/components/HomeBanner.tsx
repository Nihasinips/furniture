import Image from 'next/image';

const HomeBanner = () => {
    return (
        <div className="relative bg-gradient-to-r from-stone-100 to-stone-100 mb-8">
            <div className='mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly'>
                <div className="mb-8 md:md-0 text-center">
                    <h1 className='text-4xl md:text-3xl font-bold text-slate-700 mb-4'>Welcome to Our Store</h1>
                    <h1 className="text-3xl font-bold text-purple-400  mb-2">Discount Sale</h1>
                    <p className="text-lg md:text-xl text-red-300 mb-2">Enjoy discounts on selected items</p>
                    <p className="text-2xl md:text-5xl text-zinc-500 font-bold">Get offers for every item</p>
                </div>
                <div className="w-1/3 relative aspect-video">
                    <Image
                        src='https://res.cloudinary.com/duk02f5eh/image/upload/v1710897944/fvcep4gul0os4lzu0r9t.jpg'
                        fill
                        alt="Banner image"  
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
}

export default HomeBanner;
