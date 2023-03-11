import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const testimonials = [
  {
    id: 1,
    content:
      "Rollplay.ai – the ultimate AI chat app that lets you chat with a virtual friend whenever you want! Feeling bored and need someone to talk to? Our virtual friend is always here for you, 24/7, ready to engage in lively conversation and keep you entertained.",
  },
  {
    id: 2,
    content:
      "Experience the joy of chatting with a virtual friend without any of the pressure or awkwardness of real-life conversations. Our advanced AI technology creates a personalized experience that feels like you're talking to a real friend. Share your interests, talk about your day, or indulge in some flirty fun – our virtual friend is always up for it!",
  },
  {
    id: 3,
    content:
      "Say goodbye to boredom and loneliness with Rollplay.ai. Start chatting now and enjoy lively banter and the opportunity to make a new friend. Check out Rollplay.ai, the ultimate AI chat app for friendly conversations and virtual friendships.",
  },
];

const Index = () => {
  return (
    <main className="relative h-screen bg-cover bg-girl w-[calc(100vw-12px)]">
      {/* <Navbar /> */}

      {/* overlay */}
      <div className="fixed inset-0 right-[12px] bg-black opacity-50 z-[0]"></div>

      <section className="flex items-center justify-center h-full w-[70%] mx-auto z-10 relative">
        <section className="grid md:grid-cols-[40%_20px_1fr] md:h-[400px] gap-4">
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
