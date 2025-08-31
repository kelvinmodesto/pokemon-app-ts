import React, { useState, useEffect } from "react";
import type { Pokemon } from "@/types/pokemon";
import { usePokemon } from "@/hooks/usePokemon";
import { PokemonCard } from "@/components/pokemon-card";
import { PokemonForm } from "@/components/pokemon-form";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PokemonLogo from "@/assets/pokemon-23.svg";

import {
  Loader2,
  RefreshCw,
  AlertCircle,
  Plus,
  Sparkles,
  Search,
  Filter,
  Zap,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const itemsPerPage = 12;

  const {
    pokemons,
    currentPage,
    totalPages,
    total,
    loading,
    error,
    creating,
    deleting,
    fetchPokemons,
    createPokemon,
    deletePokemon,
    clearError,
  } = usePokemon();

  const handleAddPokemon = async (pokemonIdOrName: string) => {
    await createPokemon({ pokemonIdOrName });
    await fetchPokemons(currentPage, itemsPerPage);
    setShowForm(false);
  };

  const handleDeletePokemon = async (pokemon: Pokemon) => {
    if (!window.confirm(`Are you sure you want to delete ${pokemon.name}?`)) {
      return;
    }

    try {
      await deletePokemon(pokemon._id || pokemon.id.toString());
      await fetchPokemons(currentPage, itemsPerPage);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete Pokemon");
    }
  };

  const handlePageChange = (page: number) => {
    fetchPokemons(page, itemsPerPage);
  };

  const handleRefresh = () => {
    clearError();
    fetchPokemons(currentPage, itemsPerPage);
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.id.toString().includes(searchQuery);
    const matchesType =
      filterType === "all" ||
      pokemon.types.some((type) => type.type.name === filterType);
    return matchesSearch && matchesType;
  });

  const allTypes = Array.from(
    new Set(pokemons.flatMap((p) => p.types.map((t) => t.type.name))),
  ).sort();

  useEffect(() => {
    fetchPokemons(1, itemsPerPage);
  }, [fetchPokemons]);

  return (
    <div className="min-h-screen p-4 space-y-8 custom-scrollbar">
      <div className="relative text-center space-y-6 py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <Sparkles className="w-3 h-3 text-white/30" />
            </div>
          ))}
        </div>

        <div className="slide-up flex justify-center">
          <img
            src={PokemonLogo}
            alt="Pokemon Collection"
            className="h-20"
            style={{ width: "200px", marginBottom: "1rem" }}
          />
        </div>

        <div
          className="flex justify-center mt-8"
          style={{ marginBottom: "1rem" }}
        >
          <div
            className="glass-card px-6 py-3 flex mb-8"
            style={{ gap: "1rem", paddingLeft: "1rem", paddingRight: "1rem" }}
          >
            <div className="flex flex-col">
              <div className="text-2xl font-bold gradient-text">{total}</div>
              <div className="text-sm text-gray-600 font-medium">
                Total Pokemon
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold gradient-text">
                {allTypes.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Types Found
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold gradient-text">
                {totalPages}
              </div>
              <div className="text-sm text-gray-600 font-medium">Pages</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowForm(!showForm)}
              disabled={creating}
              className="button-hover-effect border-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
              style={{
                marginLeft: "1rem",
                borderRadius: "4px",
                marginRight: "1rem",
              }}
            >
              {creating ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {creating ? "Adding..." : showForm ? "Hide Form" : "Add Pokemon"}
            </Button>

            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="button-hover-effect glass-card border-white/30 hover:bg-white/20  hover:text-gray-800 font-semibold"
              style={{ color: "black", paddingLeft: "4px" }}
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
                style={{ color: "black" }}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Pokemon by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 border-none rounded-xl font-medium"
              style={{ color: "black", marginLeft: "2rem" }}
            />
          </div>
          <div className="flex justify-center">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 bg-white/90 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium min-w-36"
            >
              <option value="all">All Types</option>
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="flex justify-center bounce-in">
          <div className="w-full max-w-lg">
            <PokemonForm
              onSubmit={handleAddPokemon}
              isLoading={creating}
              error={error}
              onClearError={clearError}
            />
          </div>
        </div>
      )}

      {!loading && !error && total > 0 && (
        <div className="text-center" style={{ margin: "1rem" }}>
          <Card className="glass-card inline-block">
            <CardContent className="px-8 py-4">
              <div className="flex items-center gap-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    Showing{" "}
                    <span className="gradient-text">
                      {filteredPokemons.length}
                    </span>{" "}
                    of <span className="gradient-text">{total}</span> Pokemon
                  </p>
                  {(creating || deleting) && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="loading-spinner w-3 h-3" />
                      <span className="text-sm text-blue-600 font-medium">
                        {creating && "Adding Pokemon..."}
                        {deleting && "Removing Pokemon..."}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <div className="flex justify-center bounce-in">
          <Card className="glass-card bg-red-50/90 border-red-200/50 max-w-lg w-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 mb-1">
                  Error Loading Pokemon
                </h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button
                onClick={handleRefresh}
                size="sm"
                className="button-hover-effect bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20">
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
                  Loading Pokemon...
                </h3>
                <p className="text-gray-600">
                  Preparing your amazing collection ✨
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !error && filteredPokemons.length > 0 && (
        <>
          <div className="pokemon-grid">
            {filteredPokemons.map((pokemon, index) => (
              <PokemonCard
                key={pokemon._id || pokemon.id}
                pokemon={pokemon}
                onDelete={handleDeletePokemon}
                index={index}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <div className="glass-card p-2 rounded-2xl">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !error && filteredPokemons.length === 0 && total > 0 && (
        <div className="flex justify-center py-20">
          <Card className="glass-card max-w-lg w-full">
            <CardContent className="text-center p-12">
              <div className="text-8xl mb-6 animate-bounce">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Pokemon Found
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                No Pokemon match your current search criteria. Try adjusting
                your search or filter settings.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                  }}
                  variant="outline"
                  className="button-hover-effect bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-800 border-gray-300 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={() => setShowForm(true)}
                  disabled={creating}
                  className="button-hover-effect bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pokemon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !error && pokemons.length === 0 && (
        <div className="flex justify-center py-20">
          <Card className="glass-card max-w-lg w-full">
            <CardContent className="text-center p-12">
              <div className="text-8xl mb-6 animate-pulse">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Start Your Journey!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your Pokemon collection is empty. Add your first Pokemon to
                begin your amazing journey!
              </p>
              <Button
                onClick={() => setShowForm(true)}
                disabled={creating}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-200"
              >
                {creating ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {creating ? "Adding..." : "Catch Your First Pokemon"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button
          onClick={() => setShowForm(!showForm)}
          disabled={creating}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-200"
        >
          {creating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </Button>
      </div>
    </div>
  );
};
