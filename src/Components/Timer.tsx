import { motion } from "framer-motion";

type Props = {
  timeLeft: number;
};

export default function Timer({ timeLeft }: Props) {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="text-xl font-medium text-blue-500 my-4"
    >
      Time left: <span className="font-bold">{timeLeft}s</span>
    </motion.div>
  );
}
