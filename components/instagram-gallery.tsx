'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type InstagramImage = {
  src: string
  alt: string
  link: string
}

const InstagramGallery: React.FC = () => {
  // Using state to ensure component mounts after hydration
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const instagramImages: InstagramImage[] = [
    {
      src: 'https://res.cloudinary.com/travelee/image/upload/v1746794514/b52fb0ec-cc8e-4f4b-951a-4a5eb1e9d1dc.png',
      alt: 'Instagram post 1',
      link: 'https://www.instagram.com/p/DJa61_7pXea/?img_index=1'
    },
    {
      src: 'https://res.cloudinary.com/travelee/image/upload/v1746794573/710ada57-3c85-45d6-947b-11f0fa47618b.png',
      alt: 'Instagram post 2',
      link: 'https://www.instagram.com/p/DJZJWKiq6Xs/?img_index=1'
    },
    {
      src: 'https://res.cloudinary.com/travelee/image/upload/v1746794762/38636cfa-92ea-4137-a7cd-a44de9fcf50a.png',
      alt: 'Instagram post 3',
      link: 'https://www.instagram.com/p/DJWfb2vKHR7/'
    },
    {
      src: 'https://res.cloudinary.com/travelee/image/upload/v1746794657/22b695c2-7e7d-4d6e-9cde-761ea68d346f.png',
      alt: 'Instagram post 4',
      link: 'https://www.instagram.com/p/DInV9WIK9Uw/'
    },
  ]

  return (
    <div className="instagram-block py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="heading text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-astragon font-bold mb-3 text-[#1d503a]">
            Kratim On Instagram
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-gilroy">
            #KratimJewelry
          </p>
        </div>
        
        {mounted && (
          <div className="list-instagram mt-4 sm:mt-6 w-full">
            <div className="w-full max-w-[1200px] mx-auto px-4">
              <Swiper
                slidesPerView={1}
                loop={true}
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                spaceBetween={16}
                navigation={true}
                pagination={{ clickable: true }}
                breakpoints={{
                  500: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  680: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  992: {
                    slidesPerView: 4,
                    spaceBetween: 28,
                  },
                  1200: {
                    slidesPerView: 4,
                    spaceBetween: 32,
                  },
                }}
                className="instagram-swiper"
              >
                {instagramImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex justify-center">
                      <Link 
                        href={image.link} 
                        target="_blank" 
                        className="item relative block overflow-hidden rounded-lg w-full max-w-[250px] h-[250px]"
                      >
                        <Image
                          src={image.src}
                          width={500}
                          height={500}
                          alt={image.alt}
                          className="h-full w-full object-cover duration-500 hover:scale-110 transition-transform"
                          priority
                        />
                        <div className="icon w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-[#1d503a] group duration-500 flex items-center justify-center rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="text-[#1d503a] group-hover:text-white"
                          >
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
        
        {/* Follow button */}
        <div className="mt-5 md:mt-0 text-center">
          <Link 
            href="https://www.instagram.com/kratim_jewl/" 
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1d503a] hover:bg-[#1d503a]/90 text-white rounded-full font-gilroy text-sm sm:text-base transition-colors duration-300"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
            Follow Us on Instagram
          </Link>
        </div>
      </div>
      
      {/* Add custom styles for Swiper navigation and pagination */}
      <style jsx global>{`
        .instagram-swiper {
          padding-bottom: 40px !important;
        }
        .instagram-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .instagram-swiper .swiper-pagination-bullet {
          background: #1d503a;
        }
        .instagram-swiper .swiper-button-next,
        .instagram-swiper .swiper-button-prev {
          color: #1d503a;
        }
        .instagram-swiper .swiper-button-next:after,
        .instagram-swiper .swiper-button-prev:after {
          font-size: 24px;
        }
      `}</style>
    </div>
  )
}

export default InstagramGallery 