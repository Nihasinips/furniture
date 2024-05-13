import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import {MdFacebook} from 'react-icons/md';
import{AiFillTwitterCircle,AiFillInstagram} from 'react-icons/ai';

const Footer = () => {
    return (
        <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
            <Container>
                <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Shop Categories</h3>
                        <div>
                            <Link href="#">Sofa</Link>
                        </div>
                        <div>
                            <Link href="#">Bed</Link>
                        </div>
                        <div>
                            <Link href="#">Chair</Link>
                        </div>
                        <div>
                            <Link href="#">Wardrobe</Link>
                        </div>
                        <div>
                            <Link href="#">Tables</Link>
                        </div>
                        <div>
                            <Link href="#">Others</Link>
                        </div>
                    </FooterList>
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className='text-base font-bold mb-2'>Contact Us</h3>
                        <p className="mb-2">664/2 Kalliyampudur Pirivu,</p>
                        <p className="mb-2">Kunnathur Road,</p>
                        <p className="mb-2">Perundurai,</p>
                        <p className="mb-2">Erode 638052.</p>
                        <p className="mb-2">Mobile: +91 9842854888
</p>
                        <p className="mb-2">E-mail: jaganharin@gmail.com</p>
                        <p>{new Date().getFullYear()} Jagan Wood Furnitures. All rights reserved</p>
                        
                    </div>
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className='text-base font-bold mb-2'>About Us</h3>
                        <p className="mb-2">Welcome to Jagan Wood Furnitures, your ultimate destination for high-quality furniture and home decor! At our shop, we're passionate about providing our customers with beautifully crafted furniture pieces that enhance the aesthetic and comfort of their homes.</p>
                        <p>{new Date().getFullYear()} Jagan Wood Furnitures. All rights reserved</p>
                    </div>
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Follow Us</h3>
                        <div className="flex gap-2">
                            <Link href="#">
                                <MdFacebook size={24}/>
                            </Link>
                            <Link href="#">
                                <AiFillTwitterCircle size={24}/>
                            </Link>
                            <Link href="#">
                                <AiFillInstagram size={24}/>
                            </Link>
                            
                        </div>
                    </FooterList>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
