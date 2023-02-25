import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const testimonials = [
  {
    id: 1,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam id incidunt quos numquam iure quae illum voluptatibus consequuntur quis nostrum!",
  },
  {
    id: 2,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam id incidunt quos numquam iure quae illum voluptatibus consequuntur quis nostrum!",
  },
  {
    id: 3,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam id incidunt quos numquam iure quae illum voluptatibus consequuntur quis nostrum!",
  },
];

const Index = () => {
  return (
    <main className="relative h-screen bg-black bg-cover bg-girl w-[calc(100vw-12px)]">
      {/* <Navbar /> */}

      <section className="flex items-center justify-center h-full w-[70%] mx-auto">
        <section className="grid md:grid-cols-[40%_20px_1fr] md:h-[300px] gap-4">
          <article className="text-white">
            <img
              src="/assets/logo-white.png"
              alt="Rollplay logo"
              className="object-contain w-24 aspect-square"
            />

            <div className="mt-4 md:text-right">
              <h1 className="text-2xl md:text-6xl text-main">
                Rollplay.<span className="text-white">ai</span>
              </h1>
              <p className="mt-4 text-xl">Virtual AI Friend</p>
            </div>
          </article>

          {/* line separator */}
          <div className="w-0.5 h-full mx-2 bg-white relative hidden md:block">
            {/* dot */}
            <div className="absolute top-0 w-2 h-2 bg-white -left-[142%] rounded-full"></div>
          </div>

          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="w-full py-4 text-white"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="md:!mt-12">
                <p className="md:w-[80%] text-gray-400 md:text-2xl">
                  {testimonial.content}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </section>

      <div className="absolute px-4 py-12 mr-2 bg-white rounded-l-full -right-2 bottom-20">
        <Link href="/chat" className="block px-4 ml-2 rounded-full bg-main">
          <ArrowRightIcon className="w-10 h-10 text-white" />
        </Link>
      </div>
    </main>
  );
};

export default Index;
