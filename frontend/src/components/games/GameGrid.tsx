import { Game } from "@/types";
import GameCard from "./GameCard";
import { motion } from "framer-motion";

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
}

export default function GameGrid({ games, isLoading }: GameGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-primary-light h-64 rounded-xl animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-20 bg-primary-light/50 rounded-2xl border border-white/5">
        <h3 className="text-xl font-bold text-gray-400">No games found</h3>
        <p className="text-gray-600 mt-2">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game, index) => (
        <motion.div
          key={game._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          viewport={{ once: true }}
        >
          <GameCard game={game} />
        </motion.div>
      ))}
    </div>
  );
}
