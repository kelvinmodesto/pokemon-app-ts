import { useState, useCallback } from "react";
import { useFetch } from "./useFetch";
import type {
  Pokemon,
  PaginatedPokemonResponse,
  CreatePokemonRequest,
  UpdatePokemonRequest,
} from "@/types/pokemon";

interface UsePokemonState {
  pokemons: Pokemon[];
  currentPage: number;
  totalPages: number;
  total: number;
  loading: boolean;
  error: string | null;
}

interface UsePokemonOperations {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  validating: boolean;
}

export function usePokemon() {
  const [state, setState] = useState<UsePokemonState>({
    pokemons: [],
    currentPage: 1,
    totalPages: 1,
    total: 0,
    loading: false,
    error: null,
  });

  const [operations, setOperations] = useState<UsePokemonOperations>({
    creating: false,
    updating: false,
    deleting: false,
    validating: false,
  });

  const { get, post, patch, delete: deleteRequest } = useFetch();

  const fetchPokemons = useCallback(
    async (page: number = 1, limit: number = 20) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = (await get(
          `/pokemons?page=${page}&limit=${limit}`,
        )) as PaginatedPokemonResponse;
        setState((prev) => ({
          ...prev,
          pokemons: response.data,
          currentPage: response.page,
          totalPages: response.totalPages,
          total: response.total,
          loading: false,
        }));
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch Pokemon";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          pokemons: [],
        }));
        throw error;
      }
    },
    [get],
  );

  const fetchPokemonById = useCallback(
    async (id: string): Promise<Pokemon> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const pokemon = (await get(`/pokemons/${id}`)) as Pokemon;
        setState((prev) => ({ ...prev, loading: false }));
        return pokemon;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch Pokemon";
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    },
    [get],
  );

  const createPokemon = useCallback(
    async (data: CreatePokemonRequest): Promise<Pokemon> => {
      setOperations((prev) => ({ ...prev, creating: true }));
      setState((prev) => ({ ...prev, error: null }));

      try {
        const pokemon = (await post("/pokemons", data)) as Pokemon;
        setOperations((prev) => ({ ...prev, creating: false }));
        return pokemon;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create Pokemon";
        setState((prev) => ({ ...prev, error: errorMessage }));
        setOperations((prev) => ({ ...prev, creating: false }));
        throw error;
      }
    },
    [post],
  );

  const updatePokemon = useCallback(
    async (id: string, data: UpdatePokemonRequest): Promise<Pokemon> => {
      setOperations((prev) => ({ ...prev, updating: true }));
      setState((prev) => ({ ...prev, error: null }));

      try {
        const pokemon = (await patch(`/pokemons/${id}`, data)) as Pokemon;
        setOperations((prev) => ({ ...prev, updating: false }));
        return pokemon;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update Pokemon";
        setState((prev) => ({ ...prev, error: errorMessage }));
        setOperations((prev) => ({ ...prev, updating: false }));
        throw error;
      }
    },
    [patch],
  );

  const deletePokemon = useCallback(
    async (id: string): Promise<{ deleted: boolean; message: string }> => {
      setOperations((prev) => ({ ...prev, deleting: true }));
      setState((prev) => ({ ...prev, error: null }));

      try {
        const result = (await deleteRequest(`/pokemons/${id}`)) as {
          deleted: boolean;
          message: string;
        };
        setOperations((prev) => ({ ...prev, deleting: false }));
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete Pokemon";
        setState((prev) => ({ ...prev, error: errorMessage }));
        setOperations((prev) => ({ ...prev, deleting: false }));
        throw error;
      }
    },
    [deleteRequest],
  );

  const validatePokemon = useCallback(
    async (
      pokemonIdOrName: string,
    ): Promise<{
      exists: boolean;
      pokemon?: Pokemon;
      message: string;
    }> => {
      setOperations((prev) => ({ ...prev, validating: true }));
      setState((prev) => ({ ...prev, error: null }));

      try {
        const result = (await get(`/pokemons/validate/${pokemonIdOrName}`)) as {
          exists: boolean;
          pokemon?: Pokemon;
          message: string;
        };
        setOperations((prev) => ({ ...prev, validating: false }));
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to validate Pokemon";
        setState((prev) => ({ ...prev, error: errorMessage }));
        setOperations((prev) => ({ ...prev, validating: false }));
        throw error;
      }
    },
    [get],
  );

  const resetState = useCallback(() => {
    setState({
      pokemons: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
      loading: false,
      error: null,
    });
    setOperations({
      creating: false,
      updating: false,
      deleting: false,
      validating: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    ...operations,
    fetchPokemons,
    fetchPokemonById,
    createPokemon,
    updatePokemon,
    deletePokemon,
    validatePokemon,
    resetState,
    clearError,
  };
}
