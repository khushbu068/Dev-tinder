import { motion } from "framer-motion";
import {
  faCode,
  faComments,
  faRocket,
  faHeart,
  faUserGroup,
  faLaptopCode,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: faUserGroup,
      title: "Find Your People",
      description:
        "Discover developers who share your interests, skills, and passion for building.",
    },
    {
      icon: faComments,
      title: "Connect & Chat",
      description:
        "Send connection requests and start meaningful conversations with developers.",
    },
    {
      icon: faLaptopCode,
      title: "Build Together",
      description:
        "Turn conversations into collaborations, projects, ideas, and real products.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Showcase your skills, experience, interests, and the technologies you love.",
    },
    {
      number: "02",
      title: "Discover Developers",
      description:
        "Explore developers and find people who match your interests and goals.",
    },
    {
      number: "03",
      title: "Make Connections",
      description:
        "Send connection requests and grow your developer network.",
    },
    {
      number: "04",
      title: "Start Building",
      description:
        "Chat, exchange ideas and collaborate on something awesome.",
    },
  ];

  const techStack = [
    "React",
    "Redux",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "Socket.IO",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 text-sm mb-6">
              <FontAwesomeIcon icon={faCode} />
              Built for developers
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Where
              <span className="text-yellow-400"> Developers </span>
              Connect.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
              Dev-Tinder is a place where developers can discover people,
              exchange ideas, build connections, and turn great conversations
              into great projects.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition flex items-center gap-2"
              >
                Get Started
                <FontAwesomeIcon icon={faArrowRight} />
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition"
              >
                Back to Home
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-400/10 blur-3xl rounded-full" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              <div className="font-mono text-sm space-y-3">
                <p className="text-gray-500">
                </p>

                <p>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-cyan-300">developer</span>{" "}
                  = {"{"}
                </p>

                <p className="pl-5">
                  <span className="text-yellow-300">skills</span>: [
                  <span className="text-green-300">
                    "React", "Node", "MongoDB"
                  </span>
                  ],
                </p>

                <p className="pl-5">
                  <span className="text-yellow-300">passion</span>:{" "}
                  <span className="text-green-300">"Building"</span>,
                </p>

                <p className="pl-5">
                  <span className="text-yellow-300">lookingFor</span>:{" "}
                  <span className="text-green-300">"Great People"</span>
                </p>

                <p>{"}"}</p>

                <div className="mt-6 border-t border-white/10 pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      Match found!
                    </p>
                    <p className="text-gray-500 text-xs">
                      Ready to build something amazing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 py-20">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm font-semibold">
            Our Mission
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Technology is better
            <span className="text-cyan-400"> together.</span>
          </h2>

          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Great software isn't built by code alone. It's built through
            collaboration, conversations, different perspectives, and people
            who are excited to create something meaningful together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-7 hover:border-cyan-400/30 transition"
            >
              <div className="w-14 h-14 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 transition">
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="text-cyan-300 text-xl"
                />
              </div>

              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative bg-white/[0.03] border-y border-white/5 py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">
            <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm font-semibold">
              Simple Process
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              From profile to
              <span className="text-yellow-400"> project.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="relative"
              >
                <div className="text-6xl font-black text-white/5">
                  {step.number}
                </div>

                <div className="-mt-7 relative">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold mb-5">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto px-6 py-24">

        <div className="text-center">
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold">
            Under the Hood
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Built with modern
            <span className="text-cyan-400"> technology.</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {techStack.map((tech) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.08 }}
              className="px-5 py-3 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/40 hover:text-cyan-300 transition"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-cyan-400/5 backdrop-blur-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-yellow-400 to-cyan-400 flex items-center justify-center text-black text-3xl font-bold shadow-lg">
            KC
          </div>

          <div className="text-center md:text-left">
            <p className="text-yellow-400 text-sm uppercase tracking-widest">
              Built with passion
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Meet the creator
            </h2>

            <p className="mt-3 text-gray-400 leading-relaxed">
              Dev-Tinder was created by Khushbu Chacholiya with the idea of
              making developer networking more human, interactive, and
              meaningful.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="relative px-6 pb-24">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-10 md:p-16"
        >
          <FontAwesomeIcon
            icon={faRocket}
            className="text-yellow-400 text-4xl mb-6"
          />

          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to meet your next
            <span className="text-yellow-400"> developer?</span>
          </h2>

          <p className="mt-5 text-gray-400 text-lg">
            Create your profile, discover developers, and start building
            something great.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-8 px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition shadow-lg"
          >
            Join Dev-Tinder
            <FontAwesomeIcon
              icon={faArrowRight}
              className="ml-2"
            />
          </button>
        </motion.div>
      </section>

    </div>
  );
};

export default About;