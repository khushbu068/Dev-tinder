import React, {
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const SWIPE_THRESHOLD = 120;

// Forwarded so the parent's buttons can trigger the same fly-away
// animation as an actual drag release.
const SwipeCard = forwardRef(({ user, onSwipeComplete, isTop, style }, ref) => {
  const controls = useAnimation();
  const x = useMotionValue(0);

  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -20], [1, 0]);

  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();

  const flyOut = async (direction) => {
    await controls.start({
      x: direction === "interested" ? 700 : -700,
      rotate: direction === "interested" ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.35, ease: "easeIn" },
    });
    onSwipeComplete(direction);
  };

  useImperativeHandle(ref, () => ({
    swipe: (direction) => flyOut(direction),
  }));

  const handleDragEnd = (event, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      flyOut("interested");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      flyOut("ignored");
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 400, damping: 28 },
      });
    }
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, ...style }}
      animate={controls}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: "grabbing" } : {}}
    >
      <div className="relative w-full h-full rounded-2xl border border-white/10 bg-[#07111f]/80 backdrop-blur-xl shadow-2xl overflow-hidden select-none flex flex-col">

        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-5 left-5 z-10 border-2 border-green-400 text-green-400 text-xs font-bold px-3 py-1 rounded-lg -rotate-12"
            >
              INTERESTED
            </motion.div>
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-5 right-5 z-10 border-2 border-red-400 text-red-400 text-xs font-bold px-3 py-1 rounded-lg rotate-12"
            >
              PASS
            </motion.div>
          </>
        )}

        <div className="h-52 sm:h-60 w-full bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center shrink-0">
          {user.profileImage?.trim() ? (
            <img
              src={user.profileImage}
              alt={user.firstName}
              draggable={false}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
              {initials ? (
                <span className="text-yellow-400 text-2xl font-semibold">
                  {initials}
                </span>
              ) : (
                <FontAwesomeIcon icon={faCircleUser} className="text-yellow-400 text-4xl" />
              )}
            </div>
          )}
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <h2 className="text-white text-lg font-semibold">
            {user.firstName} {user.lastName}
            {user.age ? `, ${user.age}` : ""}
          </h2>

          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
            {user.about || "This developer hasn't written a bio yet."}
          </p>

          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {user.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default SwipeCard;