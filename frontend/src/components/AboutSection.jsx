import { Leaf, Recycle, Truck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="border border-[#E5E5E5] p-6 bg-white hover:shadow-md transition"
  >
    <Icon className="text-[#9F5C69] mb-4" size={26} />
    <h3 className="text-[#111] font-semibold text-[16px]">{title}</h3>
    <p className="text-[#666] text-sm mt-2 leading-relaxed">{desc}</p>
  </motion.div>
);

const AboutSection = () => {
  return (
    <section
      id="about"
      className="w-full py-24 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-sm tracking-widest text-[#9F5C69] uppercase">
            About TrendyThreads
          </p>

          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold text-[#111] leading-tight">
            Style that feels good
          </h2>

          <p className="mt-4 text-[#555] leading-relaxed text-base">
            TrendyThreads is your destination for modern fashion that blends comfort,
            confidence, and simplicity. We focus on clean designs, wearable styles,
            and pieces that fit into your everyday life.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="mt-16 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-[#111]">
              Our approach
            </h3>

            <p className="mt-4 text-[#555] leading-relaxed">
              We design and curate collections that focus on fit, feel, and everyday wearability.
              No unnecessary noise — just good fashion that works.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="border border-[#E5E5E5] px-4 py-2 text-sm text-[#333]">
                Clean aesthetics
              </span>
              <span className="border border-[#E5E5E5] px-4 py-2 text-sm text-[#333]">
                Comfortable fits
              </span>
              <span className="border border-[#E5E5E5] px-4 py-2 text-sm text-[#333]">
                Everyday fashion
              </span>
            </div>
          </motion.div>

          {/* Right features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={Leaf}
              title="Better choices"
              desc="We aim for thoughtful materials and cleaner production where possible."
            />
            <FeatureCard
              icon={Recycle}
              title="Minimal waste"
              desc="Simple packaging and reduced excess wherever we can."
            />
            <FeatureCard
              icon={Truck}
              title="Fast delivery"
              desc="Reliable shipping with clear updates."
            />
            <FeatureCard
              icon={HeartHandshake}
              title="Customer first"
              desc="Built around comfort, confidence, and trust."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-[#8A5A5D] text-white tracking-wide text-sm hover:bg-[#6f4446] transition"
          >
            EXPLORE COLLECTION
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;