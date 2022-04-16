// import React, {useRef, useEffect} from 'react'
// import Link from 'next/link'
// import * as ga from '@Lib/ga'

// const Footer = () => {

//   const goToOpenSea = () => {
//     ga.event({
//       action: 'begin_checkout',
//       params: {'event_label': "Footer OpenSea Btn", "value": 1}
//     })
//   }

//   const gotoExtLink = (label) => {
//     ga.event({
//       action: 'external_link_click',
//       params: {'event_category': "Footer " + label + " Link", 'event_label': label}
//     })
//   }

//   return (
//     <div className='footer-bg w-full flex justify-center shadow-2xl flex-wrap'>
//       <div id="footer-anim-start" className='w-11/12 md:w-3/4 xl:w-3/5 bg-white shadow-2xl -translate-y-1/2 px-5 md:px-8 py-5 font-wask flex flex-wrap justify-between'>
//         <div className='w-1/2 md:w-1/2 flex flex-col items-center my-auto'>
//           <h5 className='tracking-widest leading-tight text-lg'>
//             See More about Gustavo Amaral 
//           </h5>
//           <span className="w-full flex mt-3">
//             <a
//               href='https://www.gustavoamaral.art.br/'
//               target='_blank'
//               rel='noopener noreferrer'
//               onClick={() => gotoExtLink('Gust. Web Store')}
//               className='p-0 md:px-4 mx-1 hover:text-orange-500 hover:font-bold hover:text-lg transform duration-300 inline-flex'
//             >
//               <i className='uil uil-browser text-xl mr-2 my-auto'></i>
//               <span className="hidden lg:inline">Web Store</span>
//             </a>
//             <a
//               href='https://t.me/joinchat/4HpPw8Cwh2wzNjM1'
//               target='_blank'
//               rel='noopener noreferrer'
//               onClick={() => gotoExtLink('Gust. Telegram')}
//               className='p-0 md:px-5 mx-1 hover:text-blue-400 hover:font-bold hover:text-lg transform duration-300 inline-flex'
//             >
//               <i className='uil uil-telegram text-xl mr-2 my-auto'></i>
//               <span className="hidden lg:inline">Telegram</span>
//             </a>
//             <a
//               href='https://www.instagram.com/gustavoamaral/'
//               target='_blank'
//               rel='noopener noreferrer'
//               onClick={() => gotoExtLink('Gust. Instagram')}
//               className='p-0 md:px-4 mx-1 hover:text-fuchsia-400 hover:font-bold hover:text-lg transform duration-300 inline-flex'
//             >
//               <i className='uil uil-instagram-alt text-xl mr-2 my-auto'></i>
//               <span className="hidden lg:inline">Instagram</span>
//             </a>
//           </span>
//         </div>
//         <div className='w-1/2 md:w-1/3 flex justify-end'>
//           <img 
//             src="/img/nft/collections/gustavo-amaral/misc/gustavo-amaral-profile.webp" 
//             className="absolute top-0 h-24 w-24 md:h-28 md:w-28 lg:w-32 lg:h-32 object-cover rounded-full my-auto opacity-90 -translate-y-1/2 md:-translate-y-2/3 translate-x-1/3 md:translate-x-1/2 z-50 border-2 shadow-lg" 
//           />
//           <Link
//             href="https://opensea.io/collection/time-and-space-by-gustavo-amaral"
//             passHref={true}
//             target="_blank"
//           >
//             <button
//               className="px-1.5 md:px-3.5 py-1.5 hover:scale-105 transform duration-300"
//               onClick={goToOpenSea}
//             >
//               <img src='/img/opensea-logo.png' className='h-16 w-auto object-scale-down' />
//             </button>
//           </Link>
//         </div>
//       </div>
//       <div className="w-full flex justify-center pb-0.5 text-white">
//         <div id="star-wars" className="flex justify-center z-50 mx-3 mt-16 mb-6">
//           <div id="crawl" className="relative origin-bottom font-wask font-bold">
//             <h6 className="text-center block">
//               <span className="block text-lg uppercase">🍃 5% of <span className="">all time royalties</span></span>
//               <span className="block text-lg uppercase">🌅 invested in solar energy</span>
//               <span className="block text-base text-white">🏆 0.0<span className="text-black"> / 1 ETH</span></span>
//               <span className="block text-xs font-bold mt-6 font-montserrat">Powered with <span className="text-red">🧡</span> by <span className="text-black">WeDoIT.Jp</span></span>
//             </h6>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Footer
