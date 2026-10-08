import Link from 'next/link';
import MarqueeText from 'react-marquee-text';

interface Headlines {
   nameBn: string,
   image: string,
   id: string,
   today: string,
   unit: string
}

const Marquee = async () => {
    const res = await fetch('https://api.api-store.workers.dev/api/bazardor/products', {
        cache: 'force-cache'
    });
    const data = await res.json();

    console.log(data);
    const headlines: Headlines[] = data;

    return (
        <div className='bg-white'>
            <MarqueeText className=' ' direction='right' duration={20}>
            {
                headlines.map(headline => <Link key={headline.id} href={'/'} className='border border-gray-200 py-4'>
                    <span>{headline.image}</span>
                    <span className='text-[14px] text-[#1D271F] font-medium'> {headline.nameBn}</span> 
                    <span className='text-[14px] text-[#1D271F] font-medium'> {headline.today} টাকা/ {headline.unit}</span>
                    <span className='mx-3'>•</span>
                </Link>)
            }
          </MarqueeText>
        </div>
    );
};

export default Marquee;