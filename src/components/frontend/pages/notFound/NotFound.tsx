import  lackfooter  from '@/public/rectangle-33.jpg';
import cups from '@/public/cups.png';
import  Image  from 'next/image';
export default function NotFound() {
  return (
    <section className="not-found min-h-[100vh] pt-24 flex justify-center items-center" style={{backgroundImage:`url(${lackfooter.src})`}} >
      <div className="flex flex-col md:flex-row w-full max-w-[70vw] border-2 border-golden p-3  md:p-10 bg-black2">
        <div className="w-full md:w-6/12"><Image src={cups.src} width={cups.width} height={cups.height} alt="gericht" /></div>
        <div className="w-full md:w-6/12 flex flex-col justify-center items-center">
        <h1 className="min-w-full text-center text-3xl  md:text-left md:text-5xl font-bold text-white">Page Not Found</h1>
        <p className="min-w-full text-center text-lg md:text-left md:text-2xl text-golden">Sorry, we can't find this page, while take a drink with us</p>
        </div>
      </div>
    </section> 
  )
}

