import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Pokemon } from "@/types/pokemon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Sparkles } from "lucide-react";

interface PokemonCardProps {
  pokemon: Pokemon;
  onDelete: (pokemon: Pokemon) => void;
  index?: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onDelete,
  index = 0,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getTypeColor = (typeName: string) => {
    const colors: { [key: string]: string } = {
      normal: "from-gray-400 to-gray-500",
      fire: "from-red-500 to-orange-600",
      water: "from-blue-500 to-cyan-600",
      electric: "from-yellow-400 to-yellow-600",
      grass: "from-green-500 to-emerald-600",
      ice: "from-blue-200 to-cyan-400",
      fighting: "from-red-700 to-red-800",
      poison: "from-purple-500 to-purple-700",
      ground: "from-yellow-600 to-amber-700",
      flying: "from-indigo-400 to-blue-500",
      psychic: "from-pink-500 to-purple-600",
      bug: "from-green-400 to-lime-600",
      rock: "from-yellow-800 to-amber-900",
      ghost: "from-purple-700 to-indigo-800",
      dragon: "from-indigo-700 to-purple-800",
      dark: "from-gray-800 to-gray-900",
      steel: "from-gray-500 to-slate-600",
      fairy: "from-pink-300 to-pink-500",
    };
    return colors[typeName] || "from-gray-400 to-gray-500";
  };

  const getTypeTextColor = (typeName: string) => {
    const lightTypes = ["electric", "ice", "fairy"];
    return lightTypes.includes(typeName) ? "text-gray-800" : "text-white";
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleViewDetails = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/pokemon/${pokemon._id || pokemon.id}`);
      setIsLoading(false);
    }, 200);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(pokemon);
  };

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const animationDelay = `${index * 0.1}s`;

  return (
    <div
      className="stagger-item pokemon-card group"
      style={{ animationDelay }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${pokemon.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleViewDetails();
        }
      }}
    >
      <Card className="glass-card relative overflow-hidden transition-all duration-300 cursor-pointer border-0 h-full">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(
            primaryType,
          )} opacity-3 group-hover:opacity-5 transition-opacity duration-300`}
        />

        {pokemon.id % 50 === 0 && (
          <div className="absolute top-2 left-2 z-10">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        )}

        <CardHeader className="pokemon-card-header p-3 pb-2">
          <div className="pokemon-image-container mb-2">
            <img
              src={
                pokemon.sprites.other?.["official-artwork"]?.front_default ||
                pokemon.sprites.front_default ||
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
              }
              alt={pokemon.name}
              className="w-full h-full object-contain drop-shadow-lg floating-animation"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/120x120/667eea/ffffff?text=${pokemon.name
                  .charAt(0)
                  .toUpperCase()}`;
              }}
            />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-gray-800 capitalize line-clamp-1">
              {pokemon.name}
            </h3>
            <p className="text-sm font-semibold text-gray-500">
              #{pokemon.id.toString().padStart(3, "0")}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pokemon-card-content p-3 pt-0">
          <div className="flex flex-wrap justify-center gap-1 mb-2">
            {pokemon.types.map((type) => (
              <Badge
                key={type.slot}
                className={`pokemon-type-badge border-0 bg-gradient-to-r ${getTypeColor(
                  type.type.name,
                )} ${getTypeTextColor(
                  type.type.name,
                )} shadow-sm transition-all duration-200`}
              >
                {capitalizeFirst(type.type.name)}
              </Badge>
            ))}
          </div>

          <div className="pokemon-stats mb-2">
            <div className="stat-item bg-gradient-to-br from-green-50 to-green-100">
              <p className="font-semibold text-green-700 text-xs uppercase tracking-wide">
                Height
              </p>
              <p className="text-sm font-bold text-green-800">
                {pokemon.height / 10}m
              </p>
            </div>
            <div className="stat-item bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="font-semibold text-blue-700 text-xs uppercase tracking-wide">
                Weight
              </p>
              <p className="text-sm font-bold text-blue-800">
                {pokemon.weight / 10}kg
              </p>
            </div>
          </div>

          <div className="space-y-1 mb-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Base Experience
              </span>
              <span className="text-sm font-bold text-purple-600">
                {pokemon.base_experience}
              </span>
            </div>
            <div className="stats-bar">
              <div
                className="stats-bar-fill"
                style={{
                  width: `${Math.min((pokemon.base_experience / 300) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              disabled={isLoading}
              className="button-hover-effect flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-blue-500 text-white hover:text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="loading-spinner mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {isLoading ? "Loading..." : "View"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="button-hover-effect bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-500 text-white hover:text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label={`Delete ${pokemon.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -skew-x-12" />
        </div>
      </Card>
    </div>
  );
};
