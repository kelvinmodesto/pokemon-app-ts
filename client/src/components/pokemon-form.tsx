import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Search,
  X,
  Info,
} from "lucide-react";

interface PokemonFormProps {
  onSubmit: (pokemonIdOrName: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export const PokemonForm: React.FC<PokemonFormProps> = ({
  onSubmit,
  isLoading = false,
  error: externalError,
  onClearError,
}) => {
  const [pokemonIdOrName, setPokemonIdOrName] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const error = externalError || localError;

  const pokemonHints = [
    "pikachu",
    "charizard",
    "blastoise",
    "venusaur",
    "gengar",
    "lucario",
  ];

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pokemonIdOrName.trim()) {
      setLocalError("Please enter a Pokemon name or ID");
      return;
    }

    setLocalError("");
    if (onClearError) {
      onClearError();
    }

    try {
      await onSubmit(pokemonIdOrName.trim().toLowerCase());
      setPokemonIdOrName("");
      setSuccess(true);
      setShowHints(false);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to add Pokemon",
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPokemonIdOrName(e.target.value);
    setLocalError("");
    if (onClearError) onClearError();
  };

  const handleHintClick = (hint: string) => {
    setPokemonIdOrName(hint);
    setShowHints(false);
    setLocalError("");
    if (onClearError) {
      onClearError();
    }
  };

  const clearForm = () => {
    setPokemonIdOrName("");
    setLocalError("");
    setSuccess(false);
    setShowHints(false);
    if (onClearError) {
      onClearError();
    }
  };

  return (
    <div className="pokemon-form">
      {success && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl bounce-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500 success-checkmark" />
              <div>
                <h3 className="font-bold text-green-800">Success!</h3>
                <p className="text-green-600 text-sm">
                  Pokemon added to your collection
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="glass-card border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />

        <CardHeader className="text-center pb-3 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-emerald-500 floating-animation" />
          </div>

          <CardTitle className="text-xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Add New Pokemon
          </CardTitle>

          <p className="text-gray-600 text-sm mt-1">
            Search by name or Pokedex number
          </p>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="pokemon-input"
                className="block text-sm font-semibold text-gray-700"
              >
                Pokemon Name or ID
              </label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  id="pokemon-input"
                  type="text"
                  placeholder="e.g., pikachu, charizard, 25, 6..."
                  value={pokemonIdOrName}
                  onChange={handleInputChange}
                  onFocus={() => setShowHints(true)}
                  onBlur={() => setTimeout(() => setShowHints(false), 200)}
                  disabled={isLoading}
                  className="pokemon-form-input w-full pl-10 pr-10 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  autoComplete="off"
                />

                {pokemonIdOrName && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {showHints && !pokemonIdOrName && (
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-lg slide-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      Popular Pokemon
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pokemonHints.map((hint, index) => (
                      <Badge
                        key={hint}
                        onClick={() => handleHintClick(hint)}
                        onMouseDown={(e) => e.preventDefault()}
                        className="cursor-pointer bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-gray-700 border border-blue-200 hover:border-purple-300 transition-all duration-200 text-xs"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {hint}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 bounce-in">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 text-xs mb-1">
                      Something went wrong
                    </h4>
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                </div>
              )}

              {success && !showHints && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 bounce-in">
                  <CheckCircle className="w-4 h-4 text-green-500 success-checkmark" />
                  <div>
                    <h4 className="font-semibold text-green-800 text-xs">
                      Pokemon Added Successfully!
                    </h4>
                    <p className="text-green-600 text-xs">
                      Your collection has been updated ✨
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !pokemonIdOrName.trim()}
              className="button-hover-effect w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="loading-spinner" />
                  <span>Adding Pokemon...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add to Collection</span>
                </div>
              )}
            </Button>
          </form>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 text-xs mb-1">
                  How to search:
                </h4>
                <ul className="space-y-0.5 text-blue-700 text-xs">
                  <li className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    Pokemon name (e.g., "pikachu", "charizard")
                  </li>
                  <li className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Pokedex number (e.g., "25", "150")
                  </li>
                  <li className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    Case-insensitive search supported
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-200/10 to-transparent rounded-tr-full pointer-events-none" />
      </Card>
    </div>
  );
};
