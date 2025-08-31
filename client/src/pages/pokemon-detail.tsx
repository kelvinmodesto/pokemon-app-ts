import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Pokemon } from "@/types/pokemon";
import { usePokemon } from "@/hooks/usePokemon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, Sparkles, Zap } from "lucide-react";

export const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [selectedSprite, setSelectedSprite] = useState<string>("");

  const { loading, error, fetchPokemonById, clearError } = usePokemon();

  useEffect(() => {
    if (id) {
      fetchPokemonById(id)
        .then((data) => {
          setPokemon(data);
          setSelectedSprite(
            data.sprites.other?.["official-artwork"]?.front_default ||
              data.sprites.front_default ||
              "",
          );
        })
        .catch(() => {
          // Error is handled by the hook
        });
    }
  }, [id, fetchPokemonById]);

  const handleBack = () => {
    navigate("/");
  };

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

  const getStatColor = (statName: string) => {
    const colors: { [key: string]: string } = {
      hp: "from-green-500 to-green-600",
      attack: "from-red-500 to-red-600",
      defense: "from-blue-500 to-blue-600",
      "special-attack": "from-orange-500 to-orange-600",
      "special-defense": "from-purple-500 to-purple-600",
      speed: "from-yellow-500 to-yellow-600",
    };
    return colors[statName] || "from-gray-500 to-gray-600";
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const playSound = (soundUrl: string) => {
    const audio = new Audio(soundUrl);
    audio.play().catch(() => {
      // Handle audio play errors silently
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center custom-scrollbar">
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center gap-6 p-12">
            <div className="relative">
              <div className="loading-spinner w-12 h-12" />
              <div className="absolute inset-0 animate-pulse">
                <div className="w-12 h-12 border-2 border-blue-300 rounded-full opacity-25" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Loading Pokemon Details...
              </h3>
              <p className="text-gray-600">
                Fetching information from the Pokedex ✨
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 custom-scrollbar">
        <Card className="glass-card bg-red-50/95 border-red-200/50 max-w-lg w-full">
          <CardContent className="text-center p-12">
            <div className="text-8xl mb-6 animate-bounce">❌</div>
            <h2 className="text-2xl font-bold text-red-800 mb-3">
              Pokemon Not Found
            </h2>
            <p className="text-red-600 mb-6 leading-relaxed">
              {error ||
                "The requested Pokemon could not be found in the Pokedex."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleBack}
                variant="outline"
                className="button-hover-effect bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-800 border-gray-300 font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={clearError}
                className="button-hover-effect bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || "normal";

  return (
    <div
      className="min-h-screen p-4 space-y-8 custom-scrollbar"
      style={{ padding: "1rem" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(primaryType)} opacity-5`}
        />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="button-hover-effect glass-card border-white/30 hover:bg-white/20font-semibold"
              style={{ color: "black", padding: "4px" }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text capitalize mb-2">
              {pokemon.name}
            </h1>
            <p className="text-lg text-gray-600 font-semibold">
              #{pokemon.id.toString().padStart(3, "0")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {pokemon.id % 50 === 0 && (
              <div className="relative">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-6 h-6 text-yellow-400 opacity-75" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <Card
            className="glass-card relative overflow-hidden p-6"
            style={{ padding: "1rem" }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(
                primaryType,
              )} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
            />

            <CardContent className="relative z-10 space-y-8">
              <div className="text-center">
                <div
                  className="relative mx-auto mb-6"
                  style={{ width: "300px", height: "300px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                  <img
                    src={selectedSprite}
                    alt={pokemon.name}
                    className="w-full h-full object-contain drop-shadow-2xl floating-animation"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/300x300/667eea/ffffff?text=${pokemon.name.charAt(0).toUpperCase()}`;
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-black text-gray-800 capitalize">
                    {pokemon.name}
                  </h1>

                  <div className="flex flex-wrap justify-center gap-3">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type.slot}
                        className={`pokemon-type-badge px-4 py-2 text-base font-semibold border-0 bg-gradient-to-r ${getTypeColor(
                          type.type.name,
                        )} ${getTypeTextColor(
                          type.type.name,
                        )} shadow-lg transition-all duration-200`}
                      >
                        {capitalizeFirst(type.type.name)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat-item bg-gradient-to-br from-green-50 to-green-100 p-4">
                      <p className="font-semibold text-green-700 text-sm uppercase tracking-wide">
                        Height
                      </p>
                      <p className="text-xl font-bold text-green-800">
                        {pokemon.height / 10}m
                      </p>
                    </div>
                    <div className="stat-item bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                      <p className="font-semibold text-blue-700 text-sm uppercase tracking-wide">
                        Weight
                      </p>
                      <p className="text-xl font-bold text-blue-800">
                        {pokemon.weight / 10}kg
                      </p>
                    </div>
                    <div className="stat-item bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                      <p className="font-semibold text-purple-700 text-sm uppercase tracking-wide">
                        Experience
                      </p>
                      <p className="text-xl font-bold text-purple-800">
                        {pokemon.base_experience}
                      </p>
                    </div>
                    <div className="stat-item bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                      <p className="font-semibold text-orange-700 text-sm uppercase tracking-wide">
                        Order
                      </p>
                      <p className="text-xl font-bold text-orange-800">
                        {pokemon.order}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-center">
                      Abilities
                    </h3>
                    <div className="grid gap-3">
                      {pokemon.abilities.map((ability) => (
                        <div
                          key={ability.slot}
                          className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                            ability.is_hidden
                              ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100"
                              : "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800 capitalize">
                              {ability.ability.name.replace("-", " ")}
                            </span>
                            {ability.is_hidden && (
                              <Badge className="bg-yellow-400 text-yellow-900">
                                Hidden
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {pokemon.cries && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-800 text-center">
                        Pokemon Cries
                      </h3>
                      <div className="flex justify-center gap-3">
                        {pokemon.cries.latest && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playSound(pokemon.cries.latest)}
                            className="button-hover-effect bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 border-green-300 text-green-700 hover:text-green-800"
                          >
                            <Volume2 className="w-4 h-4 mr-2" />
                            Latest Cry
                          </Button>
                        )}
                        {pokemon.cries.legacy && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playSound(pokemon.cries.legacy)}
                            className="button-hover-effect bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-blue-300 text-blue-700 hover:text-blue-800"
                          >
                            <Volume2 className="w-4 h-4 mr-2" />
                            Legacy Cry
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Base Stats
                    </h3>
                    <div className="space-y-4">
                      {pokemon.stats.map((stat) => (
                        <div key={stat.stat.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700 capitalize text-sm">
                              {stat.stat.name.replace("-", " ")}
                            </span>
                            <span className="font-bold text-gray-800">
                              {stat.base_stat}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-full bg-gradient-to-r ${getStatColor(stat.stat.name)} transition-all duration-1000`}
                              style={{
                                width: `${Math.min((stat.base_stat / 150) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">Total</span>
                          <span className="font-bold text-purple-600">
                            {pokemon.stats.reduce(
                              (sum, stat) => sum + stat.base_stat,
                              0,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
